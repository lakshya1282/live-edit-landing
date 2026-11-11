/**
 * live-edit — Interactive Living Glass Engine & Live-Edit Simulator
 * Clean-room implementation featuring automated walkthrough loop & full interactive sandbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenisInstance;

    // Synchronize Lenis with GSAP Ticker for jitter-free 60/120Hz frame rates
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Sync with GSAP ScrollTrigger if present
    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
    }

    // Recalculate layout dimensions on font/image asset load & window resize
    window.addEventListener('load', () => lenisInstance.resize());
    window.addEventListener('resize', () => lenisInstance.resize());

    // Intercept internal hash links with dynamic header offset
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#' || hash.startsWith('#!')) return;

      try {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          const header = document.getElementById('header');
          const headerHeight = header ? header.offsetHeight : 72;
          lenisInstance.scrollTo(target, {
            offset: -(headerHeight + 14),
            duration: 1.2,
          });
          if (history.pushState) {
            history.pushState(null, null, hash);
          }
        }
      } catch (err) {
        // Ignore invalid CSS selector
      }
    });
  }

  // 2. State & References
  const stage = document.getElementById('live-stage');
  const webpageCanvas = document.getElementById('webpage-canvas');
  const virtualCursor = document.getElementById('virtual-cursor');
  const simToolbar = document.getElementById('sim-toolbar');
  const inlineEditor = document.getElementById('sim-inline-editor');
  const inlineInput = document.getElementById('sim-inline-input');
  const simResultPanel = document.getElementById('sim-result-panel');
  const hudSaveBtn = document.getElementById('hud-save-btn');
  const hudChangeCount = document.getElementById('hud-change-count');
  const hudLiveToggle = document.getElementById('hud-live-toggle');
  const hudLiveState = document.getElementById('hud-live-state');
  const hudUndoBtn = document.getElementById('hud-undo-btn');
  const resultCloseBtn = document.getElementById('result-close-btn');
  const resultFilename = document.getElementById('result-filename');
  const resultDiffText = document.getElementById('result-diff-text');
  const resultAgentHint = document.getElementById('result-agent-hint');
  const branchesGrid = document.getElementById('branches-grid');

  const btnAutoSim = document.getElementById('btn-auto-sim');
  const btnSandboxSim = document.getElementById('btn-sandbox-sim');
  const simResetBtn = document.getElementById('sim-reset-btn');

  let currentMode = 'auto'; // 'auto' | 'sandbox'
  let autoSimTimeout = null;
  let autoSimTimeline = [];
  let isEditingInline = false;
  let selectedElement = null;
  let pendingChanges = [];
  let undoHistory = [];
  let initialCardHtml = branchesGrid ? branchesGrid.innerHTML : '';

  // ==========================================================================
  // Automated Walkthrough Animation Loop
  // ==========================================================================

  function clearAutoSim() {
    autoSimTimeline.forEach(t => clearTimeout(t));
    autoSimTimeline = [];
    if (autoSimTimeout) clearTimeout(autoSimTimeout);
  }

  function startAutoSimulation() {
    clearAutoSim();
    if (currentMode !== 'auto' || !virtualCursor || !stage) return;

    // Reset visual state
    virtualCursor.style.display = 'flex';
    virtualCursor.style.opacity = '1';
    closeInlineEditor(false);
    deselectAll();
    hideResultPanel();
    updateHudCount(0);
    pendingChanges = [];

    const targetEl = document.getElementById('branch-hours-1');
    if (!targetEl) return;
    targetEl.textContent = 'Open until 8 PM';

    // Timeline sequence
    function schedule(fn, delay) {
      const id = setTimeout(fn, delay);
      autoSimTimeline.push(id);
    }

    // Step 1: Cursor starts top-left
    schedule(() => {
      setCursorPos(40, 40);
    }, 100);

    // Step 2: Cursor glides towards "Open until 8 PM"
    schedule(() => {
      const rect = getRelativeRect(targetEl, webpageCanvas);
      animateCursorTo(rect.left + 50, rect.top + rect.height / 2, 1100, () => {
        targetEl.classList.add('sim-hovered');
      });
    }, 800);

    // Step 3: Hover and select
    schedule(() => {
      targetEl.classList.remove('sim-hovered');
      selectElement(targetEl);
    }, 2200);

    // Step 4: Click "Edit text" in floating toolbar
    schedule(() => {
      const editBtn = document.getElementById('tool-edit-text');
      const btnRect = getRelativeRect(editBtn, webpageCanvas);
      animateCursorTo(btnRect.left + 25, btnRect.top + 12, 600, () => {
        openInlineEditor(targetEl);
      });
    }, 3100);

    // Step 5: Type "Open until 10 PM Late Hours"
    schedule(() => {
      if (!inlineInput) return;
      const original = 'Open until 8 PM';
      const replacement = 'Open until 10 PM Late Hours';
      let idx = original.length;

      // Delete back to "Open until "
      function backspace(callback) {
        if (idx > 11) {
          idx--;
          inlineInput.value = original.slice(0, idx);
          setTimeout(() => backspace(callback), 70);
        } else {
          setTimeout(callback, 120);
        }
      }

      backspace(() => {
        let typeIdx = 11;
        function typeChar() {
          if (typeIdx < replacement.length) {
            typeIdx++;
            inlineInput.value = replacement.slice(0, typeIdx);
            setTimeout(typeChar, 65);
          } else {
            // Confirm edit
            setTimeout(() => {
              targetEl.textContent = replacement;
              closeInlineEditor(true);
              recordChange({
                type: 'text',
                element: targetEl,
                file: targetEl.getAttribute('data-filepath') || 'src/Branches.jsx',
                line: targetEl.getAttribute('data-line') || '44',
                oldVal: original,
                newVal: replacement
              });
            }, 300);
          }
        }
        typeChar();
      });
    }, 4000);

    // Step 6: Move cursor down to Save to code button
    schedule(() => {
      const rect = getRelativeRect(hudSaveBtn, webpageCanvas);
      animateCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 1000, () => {
        hudSaveBtn.classList.add('save-pulse');
        setTimeout(() => hudSaveBtn.classList.remove('save-pulse'), 450);
        triggerSaveAction();
      });
    }, 7200);

    // Step 7: Wait and restart loop
    schedule(() => {
      startAutoSimulation();
    }, 13000);
  }

  function setCursorPos(x, y) {
    if (!virtualCursor) return;
    virtualCursor.style.left = `${x}px`;
    virtualCursor.style.top = `${y}px`;
  }

  function animateCursorTo(targetX, targetY, duration, onComplete) {
    if (!virtualCursor) return;
    const startX = parseFloat(virtualCursor.style.left) || 40;
    const startY = parseFloat(virtualCursor.style.top) || 40;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Spring / smooth ease
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const currentX = startX + (targetX - startX) * ease;
      const currentY = startY + (targetY - startY) * ease;
      setCursorPos(currentX, currentY);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    }
    requestAnimationFrame(step);
  }

  function getRelativeRect(element, container) {
    if (!element || !container) return { left: 0, top: 0, width: 0, height: 0 };
    const elRect = element.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    return {
      left: elRect.left - contRect.left + container.scrollLeft,
      top: elRect.top - contRect.top + container.scrollTop,
      width: elRect.width,
      height: elRect.height,
    };
  }

  // ==========================================================================
  // Selection, Toolbar & Inline Editor Mechanics
  // ==========================================================================

  function deselectAll() {
    if (selectedElement) {
      selectedElement.classList.remove('sim-selected');
      selectedElement = null;
    }
    if (simToolbar) simToolbar.style.display = 'none';
  }

  function selectElement(el) {
    deselectAll();
    if (!el || !simToolbar) return;

    selectedElement = el;
    el.classList.add('sim-selected');

    // Position floating toolbar above selected element
    const rect = getRelativeRect(el, webpageCanvas);
    simToolbar.style.display = 'inline-flex';
    simToolbar.style.left = `${Math.max(10, rect.left)}px`;
    simToolbar.style.top = `${rect.top}px`;

    // Configure toolbar action availability based on element type
    const isText = el.classList.contains('editable-target');
    const isCard = el.classList.contains('sim-card');
    const isBtn = el.tagName === 'BUTTON' || el.classList.contains('sim-card-btn');

    const editBtn = document.getElementById('tool-edit-text');
    const parentBtn = document.getElementById('tool-parent');
    const childBtn = document.getElementById('tool-child');
    const dupeBtn = document.getElementById('tool-duplicate');
    const delBtn = document.getElementById('tool-delete');
    const toggleBtn = document.getElementById('tool-toggle-btn');

    if (editBtn) editBtn.style.display = isText ? 'inline-flex' : 'none';
    if (dupeBtn) dupeBtn.style.display = isCard ? 'inline-flex' : 'none';
    if (delBtn) delBtn.style.display = isCard ? 'inline-flex' : 'none';
    if (toggleBtn) toggleBtn.style.display = isBtn ? 'inline-flex' : 'none';

    if (isBtn && toggleBtn) {
      toggleBtn.textContent = el.disabled ? 'Enable' : 'Disable';
    }
  }

  function openInlineEditor(el) {
    if (!el || !inlineEditor || !inlineInput) return;
    isEditingInline = true;
    const rect = getRelativeRect(el, webpageCanvas);

    inlineEditor.style.display = 'block';
    inlineEditor.style.left = `${rect.left}px`;
    inlineEditor.style.top = `${rect.top}px`;
    inlineEditor.style.width = `${Math.max(rect.width + 20, 200)}px`;

    inlineInput.value = el.textContent.trim();
    if (currentMode === 'sandbox') {
      inlineInput.focus();
      inlineInput.select();
    }
  }

  function closeInlineEditor(commit = true) {
    if (!isEditingInline || !inlineEditor) return;
    isEditingInline = false;

    if (commit && selectedElement && inlineInput) {
      const newVal = inlineInput.value.trim();
      const oldVal = selectedElement.textContent.trim();
      if (newVal !== oldVal) {
        selectedElement.textContent = newVal;
        recordChange({
          type: 'text',
          element: selectedElement,
          file: selectedElement.getAttribute('data-filepath') || 'src/Branches.jsx',
          line: selectedElement.getAttribute('data-line') || '42',
          oldVal,
          newVal
        });
      }
    }
    inlineEditor.style.display = 'none';
  }

  function recordChange(change) {
    pendingChanges.push(change);
    undoHistory.push(change);
    updateHudCount(pendingChanges.length);
  }

  function updateHudCount(count) {
    if (hudChangeCount) hudChangeCount.textContent = count;
  }

  function triggerSaveAction() {
    if (pendingChanges.length === 0) {
      // Mock save even if 0 for immediate gratification
      showResultToast({
        file: 'src/Branches.jsx:42',
        diffDel: '- Open until 8 PM',
        diffAdd: '+ Open until 10 PM Late Hours',
        agentNote: 'No agent needed · Saved directly to source'
      });
      return;
    }

    const last = pendingChanges[pendingChanges.length - 1];
    let diffDel = '- ' + (last.oldVal || 'Original content');
    let diffAdd = '+ ' + (last.newVal || 'Updated content');
    let agentNote = 'No agent needed · Saved directly to source';

    if (last.type === 'duplicate') {
      diffDel = '// Added sibling card element';
      diffAdd = '+ <RoasteryCard id="branch-dupe" title="' + last.newVal + '" />';
      agentNote = 'Queued for agent (.live/pending.json) · Added to array';
    } else if (last.type === 'delete') {
      diffDel = '- <RoasteryCard id="' + last.oldVal + '" />';
      diffAdd = '// Removed card element';
      agentNote = 'Queued for agent · Element removed from JSX';
    } else if (last.type === 'button') {
      diffDel = last.oldVal ? 'disabled={true}' : 'disabled={false}';
      diffAdd = last.newVal ? 'disabled={true}' : 'disabled={false}';
      agentNote = 'Queued for agent · Updated disabled prop';
    }

    showResultToast({
      file: (last.file || 'src/Branches.jsx') + ':' + (last.line || '44'),
      diffDel,
      diffAdd,
      agentNote
    });

    pendingChanges = [];
    updateHudCount(0);
  }

  const liquidToast = document.getElementById('liquid-save-toast');
  const toastFilename = document.getElementById('toast-filename');
  const sandboxBanner = document.getElementById('sandbox-hint-banner');
  let toastTimer = null;

  function showFloatingToast(filename) {
    if (!liquidToast) return;
    if (toastFilename) toastFilename.textContent = filename || 'src/Branches.jsx:42';
    liquidToast.classList.add('toast-active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      liquidToast.classList.remove('toast-active');
    }, 2800);
  }

  function showResultToast({ file, diffDel, diffAdd, agentNote }) {
    showFloatingToast(file);
    if (!simResultPanel) return;
    if (resultFilename) resultFilename.textContent = file;
    if (resultDiffText) {
      resultDiffText.innerHTML = `<span class="diff-del">${escapeHtml(diffDel)}</span><br><span class="diff-add">${escapeHtml(diffAdd)}</span>`;
    }
    if (resultAgentHint) {
      resultAgentHint.innerHTML = `<span class="mono-txt">${escapeHtml(agentNote)}</span>`;
    }
    simResultPanel.style.display = 'block';
  }

  function hideResultPanel() {
    if (simResultPanel) simResultPanel.style.display = 'none';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ==========================================================================
  // Mode Switcher (Auto Demo vs Interactive Sandbox)
  // ==========================================================================

  if (btnAutoSim && btnSandboxSim) {
    btnAutoSim.addEventListener('click', () => {
      currentMode = 'auto';
      btnAutoSim.classList.add('active');
      btnSandboxSim.classList.remove('active');
      if (sandboxBanner) sandboxBanner.classList.remove('active');
      startAutoSimulation();
    });

    btnSandboxSim.addEventListener('click', () => {
      currentMode = 'sandbox';
      btnSandboxSim.classList.add('active');
      btnAutoSim.classList.remove('active');
      if (sandboxBanner) sandboxBanner.classList.add('active');
      clearAutoSim();
      if (virtualCursor) virtualCursor.style.display = 'none';
      deselectAll();
      hideResultPanel();
    });
  }

  // Reset sandbox button
  if (simResetBtn) {
    simResetBtn.addEventListener('click', () => {
      if (branchesGrid && initialCardHtml) {
        branchesGrid.innerHTML = initialCardHtml;
      }
      deselectAll();
      closeInlineEditor(false);
      hideResultPanel();
      pendingChanges = [];
      undoHistory = [];
      updateHudCount(0);
      if (currentMode === 'auto') startAutoSimulation();
    });
  }

  // Result close button
  if (resultCloseBtn) {
    resultCloseBtn.addEventListener('click', hideResultPanel);
  }

  // ==========================================================================
  // Interactive Sandbox Event Listeners (Direct Manipulation)
  // ==========================================================================

  if (webpageCanvas) {
    // Hover dashed outlines
    webpageCanvas.addEventListener('mouseover', (e) => {
      if (currentMode !== 'sandbox') return;
      const target = e.target.closest('.editable-target, .sim-card, .sim-card-btn');
      if (target && target !== selectedElement) {
        target.classList.add('sim-hovered');
      }
    });

    webpageCanvas.addEventListener('mouseout', (e) => {
      if (currentMode !== 'sandbox') return;
      const target = e.target.closest('.editable-target, .sim-card, .sim-card-btn');
      if (target) {
        target.classList.remove('sim-hovered');
      }
    });

    // Click select & double-click edit
    webpageCanvas.addEventListener('click', (e) => {
      if (currentMode !== 'sandbox') return;
      if (e.target.closest('#sim-toolbar') || e.target.closest('#sim-inline-editor') || e.target.closest('#sim-bottom-hud') || e.target.closest('#sim-result-panel')) {
        return;
      }

      const target = e.target.closest('.editable-target, .sim-card, .sim-card-btn');
      if (target) {
        target.classList.remove('sim-hovered');
        selectElement(target);
      } else {
        deselectAll();
        closeInlineEditor(true);
      }
    });

    webpageCanvas.addEventListener('dblclick', (e) => {
      if (currentMode !== 'sandbox') return;
      const target = e.target.closest('.editable-target');
      if (target) {
        selectElement(target);
        openInlineEditor(target);
      }
    });
  }

  // Toolbar button listeners
  const toolEditText = document.getElementById('tool-edit-text');
  const toolParent = document.getElementById('tool-parent');
  const toolChild = document.getElementById('tool-child');
  const toolDuplicate = document.getElementById('tool-duplicate');
  const toolDelete = document.getElementById('tool-delete');
  const toolToggleBtn = document.getElementById('tool-toggle-btn');

  if (toolEditText) {
    toolEditText.addEventListener('click', () => {
      if (selectedElement) openInlineEditor(selectedElement);
    });
  }

  if (toolParent) {
    toolParent.addEventListener('click', () => {
      if (!selectedElement) return;
      const parentCard = selectedElement.closest('.sim-card');
      if (parentCard && selectedElement !== parentCard) {
        selectElement(parentCard);
      }
    });
  }

  if (toolChild) {
    toolChild.addEventListener('click', () => {
      if (!selectedElement) return;
      const firstChild = selectedElement.querySelector('.editable-target, .sim-card-title, h3, p');
      if (firstChild) selectElement(firstChild);
    });
  }

  if (toolDuplicate) {
    toolDuplicate.addEventListener('click', () => {
      if (!selectedElement || !selectedElement.classList.contains('sim-card')) return;
      const clone = selectedElement.cloneNode(true);
      const newId = 'branch-card-' + Date.now();
      clone.id = newId;
      const title = clone.querySelector('.sim-card-title');
      if (title) title.textContent += ' (Copy)';

      selectedElement.parentNode.insertBefore(clone, selectedElement.nextSibling);
      selectElement(clone);

      recordChange({
        type: 'duplicate',
        element: clone,
        file: 'src/Branches.jsx',
        line: '88',
        oldVal: selectedElement.id,
        newVal: title ? title.textContent : 'Duplicated Card'
      });
    });
  }

  if (toolDelete) {
    toolDelete.addEventListener('click', () => {
      if (!selectedElement || !selectedElement.classList.contains('sim-card')) return;
      const cardId = selectedElement.id;
      const cardEl = selectedElement;
      cardEl.style.display = 'none';
      deselectAll();

      recordChange({
        type: 'delete',
        element: cardEl,
        file: 'src/Branches.jsx',
        line: '56',
        oldVal: cardId,
        newVal: ''
      });
    });
  }

  if (toolToggleBtn) {
    toolToggleBtn.addEventListener('click', () => {
      if (!selectedElement || (selectedElement.tagName !== 'BUTTON' && !selectedElement.classList.contains('sim-card-btn'))) return;
      const wasDisabled = selectedElement.disabled;
      selectedElement.disabled = !wasDisabled;
      toolToggleBtn.textContent = selectedElement.disabled ? 'Enable' : 'Disable';

      recordChange({
        type: 'button',
        element: selectedElement,
        file: 'src/Branches.jsx',
        line: '48',
        oldVal: wasDisabled,
        newVal: selectedElement.disabled
      });
    });
  }

  // Inline input keyboard shortcuts
  if (inlineInput) {
    inlineInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        closeInlineEditor(true);
      } else if (e.key === 'Escape') {
        closeInlineEditor(false);
      }
    });
  }

  // HUD Save Button listener
  if (hudSaveBtn) {
    hudSaveBtn.addEventListener('click', () => {
      hudSaveBtn.classList.add('save-pulse');
      setTimeout(() => hudSaveBtn.classList.remove('save-pulse'), 450);
      triggerSaveAction();
    });
  }

  // Global Keyboard shortcuts: Ctrl+S to save, Ctrl+Z to undo
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (hudSaveBtn) {
        hudSaveBtn.classList.add('save-pulse');
        setTimeout(() => hudSaveBtn.classList.remove('save-pulse'), 450);
        triggerSaveAction();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (undoHistory.length > 0) {
        const last = undoHistory.pop();
        if (last.type === 'text') {
          last.element.textContent = last.oldVal;
        } else if (last.type === 'duplicate') {
          last.element.remove();
        } else if (last.type === 'delete') {
          last.element.style.display = 'block';
        } else if (last.type === 'button') {
          last.element.disabled = last.oldVal;
        }
        pendingChanges.pop();
        updateHudCount(pendingChanges.length);
      }
    } else if (e.key === 'Escape') {
      deselectAll();
      closeInlineEditor(false);
    }
  });

  // HUD Undo listener
  if (hudUndoBtn) {
    hudUndoBtn.addEventListener('click', () => {
      if (undoHistory.length > 0) {
        const last = undoHistory.pop();
        if (last.type === 'text') {
          last.element.textContent = last.oldVal;
        } else if (last.type === 'duplicate') {
          last.element.remove();
        } else if (last.type === 'delete') {
          last.element.style.display = 'block';
        } else if (last.type === 'button') {
          last.element.disabled = last.oldVal;
        }
        pendingChanges.pop();
        updateHudCount(pendingChanges.length);
      }
    });
  }

  // ==========================================================================
  // Section 4: Giant Interactive Index Accordion
  // ==========================================================================

  const indexRows = document.querySelectorAll('.feature-giant-index .index-row');
  indexRows.forEach((row) => {
    const summary = row.querySelector('.index-row-summary');
    if (summary) {
      summary.addEventListener('click', () => {
        const isActive = row.classList.contains('active');
        indexRows.forEach(r => r.classList.remove('active'));
        if (!isActive) {
          row.classList.add('active');
        }
      });
    }
  });

  // ==========================================================================
  // Section 7: Terminal Navigation Tabs
  // ==========================================================================

  const termTabs = document.querySelectorAll('.terminal-nav-tabs .term-tab');
  const termPanes = document.querySelectorAll('.terminal-body .term-tab-pane');

  termTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      termTabs.forEach(t => t.classList.remove('active'));
      termPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById('pane-' + targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // ==========================================================================
  // Section 8: FAQ Accordion Group
  // ==========================================================================

  const faqItems = document.querySelectorAll('.faq-accordion-group .faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // ==========================================================================
  // Clipboard Copy Buttons with Animated Visual Feedback
  // ==========================================================================

  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const origContent = btn.innerHTML;
        btn.innerHTML = `<span style="color: #a7f3d0; font-weight: 700;">&check; Copied!</span>`;
        btn.style.borderColor = 'rgba(167, 243, 208, 0.4)';

        setTimeout(() => {
          btn.innerHTML = origContent;
          btn.style.borderColor = '';
        }, 2000);
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      });
    });
  });

  // ==========================================================================
  // Dynamic Optical Liquid Glass Spotlight (Refractive Cursor Sheen)
  // ==========================================================================

  document.querySelectorAll('.glass-spotlight').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', `-500px`);
      card.style.setProperty('--mouse-y', `-500px`);
    });
  });

  // ==========================================================================
  // Interactive Live Speed Benchmark Race Controller
  // ==========================================================================

  const btnRunBenchmark = document.getElementById('btn-run-benchmark');
  const timerChat = document.getElementById('timer-chat');
  const timerLive = document.getElementById('timer-live');
  const barChat = document.getElementById('bar-chat');
  const barLive = document.getElementById('bar-live');
  const statusChat = document.getElementById('status-chat');
  const statusLive = document.getElementById('status-live');

  let benchmarkRunning = false;

  function runBenchmarkRace() {
    if (benchmarkRunning) return;
    benchmarkRunning = true;
    if (btnRunBenchmark) {
      btnRunBenchmark.disabled = true;
      btnRunBenchmark.style.opacity = '0.6';
    }

    if (barChat) barChat.style.width = '0%';
    if (barLive) barLive.style.width = '0%';
    if (timerChat) timerChat.textContent = '0.0s';
    if (timerLive) timerLive.textContent = '0.0s';
    if (statusChat) statusChat.textContent = 'Typing prompt instruction...';
    if (statusLive) statusLive.textContent = 'Double-click "Open until 8 PM"...';

    const startTime = performance.now();

    // Live edit completes in 0.8s
    const liveInterval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      if (elapsed <= 0.8) {
        if (timerLive) timerLive.textContent = `${elapsed.toFixed(1)}s`;
        if (barLive) barLive.style.width = `${(elapsed / 0.8) * 100}%`;
        if (elapsed > 0.3 && statusLive) statusLive.textContent = 'Type "10 PM" & hit Ctrl+S...';
      } else {
        clearInterval(liveInterval);
        if (timerLive) timerLive.textContent = '0.8s';
        if (barLive) barLive.style.width = '100%';
        if (statusLive) statusLive.innerHTML = '<strong style="color: var(--pastel-mint);">&check; Written to AST (0.8s) &mdash; 53x faster</strong>';
      }
    }, 40);

    // Chat agent takes ~42.6s (simulated smoothly in ~4.5s for snappy UX demo)
    const chatDuration = 4500;
    const chatInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / chatDuration);
      const simulatedSeconds = (progress * 42.6).toFixed(1);

      if (timerChat) timerChat.textContent = `${simulatedSeconds}s`;
      if (barChat) barChat.style.width = `${progress * 100}%`;

      if (progress < 0.25) {
        if (statusChat) statusChat.textContent = 'Explaining card #1 and opening hours...';
      } else if (progress < 0.55) {
        if (statusChat) statusChat.textContent = 'Agent queued, re-reading full project context...';
      } else if (progress < 0.85) {
        if (statusChat) statusChat.textContent = 'Scanning 14 files to resolve string ambiguity...';
      } else if (progress < 1) {
        if (statusChat) statusChat.textContent = 'Generating file diff and awaiting confirmation...';
      } else {
        clearInterval(chatInterval);
        if (timerChat) timerChat.textContent = '42.6s';
        if (barChat) barChat.style.width = '100%';
        if (statusChat) statusChat.textContent = 'Completed in 42.6s (High token friction)';
        benchmarkRunning = false;
        if (btnRunBenchmark) {
          btnRunBenchmark.disabled = false;
          btnRunBenchmark.style.opacity = '1';
        }
      }
    }, 50);
  }

  if (btnRunBenchmark) {
    btnRunBenchmark.addEventListener('click', runBenchmarkRace);
  }

  // ==========================================================================
  // Magnetic Micro-Interactions on Primary Glass Buttons
  // ==========================================================================

  document.querySelectorAll('.glass-btn-primary, .glass-btn-hero-primary').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ==========================================================================
  // Immersive Ambient Particle & Reactive Light Field Canvas
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    // Create celestial floating ambient nodes
    const particleCount = 42;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI
      });
    }

    // Fluid ambient glow orbs
    const orbs = [
      { x: width * 0.2, y: height * 0.3, radius: 280, color: 'rgba(225, 29, 72, 0.035)', vx: 0.15, vy: 0.12 },
      { x: width * 0.8, y: height * 0.4, radius: 340, color: 'rgba(10, 13, 20, 0.025)', vx: -0.12, vy: 0.18 },
      { x: width * 0.5, y: height * 0.8, radius: 300, color: 'rgba(225, 29, 72, 0.028)', vx: 0.18, vy: -0.15 }
    ];

    function renderAmbientFrame() {
      // Smooth cursor lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render floating fluid ambient light orbs
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cursor gentle spotlight caustics
      const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 260);
      cursorGlow.addColorStop(0, 'rgba(225, 29, 72, 0.045)');
      cursorGlow.addColorStop(0.5, 'rgba(10, 13, 20, 0.015)');
      cursorGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cursorGlow;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 260, 0, Math.PI * 2);
      ctx.fill();

      // Draw responsive micro particles with soft connection links
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulseVal += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Proximity repulsion from mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.1;
        ctx.fillStyle = `rgba(10, 13, 20, ${Math.max(0.05, Math.min(0.4, currentAlpha))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby points
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            ctx.strokeStyle = `rgba(10, 13, 20, ${(1 - dist2 / 110) * 0.06})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(renderAmbientFrame);
    }

    renderAmbientFrame();
  }

  // Start initial auto demo
  startAutoSimulation();
});

