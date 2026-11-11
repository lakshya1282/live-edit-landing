# live-edit: Website Content

Nov 11, 2026 · @lakshya parmar

## Site map and positioning

live-edit is an Antigravity skill that puts a click-to-edit layer on your running localhost site and writes your changes back into the source files.

| Item | Copy |
| --- | --- |
| Name | live-edit |
| Tagline | Edit your site on the page. Save it to the code. |
| One-line pitch | Click any title, card or button on localhost, change it live, and live-edit writes the change into your codebase. |
| Who it is for | Developers and freelancers who build sites with an AI coding agent and are tired of describing small copy and layout tweaks in chat |
| Voice | Short, direct, developer-to-developer. No hype words. |

### Pages

| Page | Path | Its job | Main button |
| --- | --- | --- | --- |
| Landing | / | Explain the idea in 10 seconds, show the flow | Install the skill |
| Installation | /install | Get from zero to a running session in 3 commands | Copy install command |
| Usage | /usage | Teach the overlay controls and the save loop | Read the docs |
| Docs | /docs | How it works, limits, troubleshooting, security | View on GitHub |
| GitHub repo | github.com/lakshya1282/live-edit | Source, README, issues | Star the repo |

Replace YOUR-USERNAME with your GitHub handle wherever it appears below.

## Landing page copy

Sections run top to bottom in page order. Text in quotes is on-page copy; text in brackets is a note to the designer.

### 1. Hero

**Eyebrow:** A skill for Antigravity

**Headline:** Edit your site on the page. Save it to the code.

**Subheadline:** live-edit adds a click-to-edit layer to your localhost site. Change a title, duplicate a card, disable a button, then hit save. The change lands in your source files, not in a chat message.

**Primary button:** Install the skill

**Secondary button:** View on GitHub

**Under the buttons:** Free and open source. Zero dependencies. Runs only on your machine.

&#91;Visual: a looping screen recording of a branches page. A cursor double-clicks a heading, types, presses Ctrl+S, and a result panel shows the file name and line number.\]

### 2. The problem

**Heading:** Small changes should not need a paragraph of instructions.

**Body:** You are building with an AI agent. The layout is 90% right. Now you need a new heading, a different opening time on one card, one button turned off. Describing each tweak in chat is slower than just clicking it. live-edit lets you click it, then writes the change into the right file.

### 3. How it works

**Heading:** Three steps. No setup project.

1. **Install.** Run one command in your project root. It adds the skill, an `npm run live` script and a `.gitignore` line.
2. **Run.** Start your dev server, then `npm run live`. Open `localhost:4321`. Your site appears with the editor on top.
3. **Edit and save.** Click anything, change it, press Save. Text edits are written straight into your source. Adds, deletes and button changes go to your agent, which applies them in your code style.

### 4. Features

**Heading:** What you can change on the page

| Feature | One-line copy |
| --- | --- |
| Click to select | Hover to highlight, click to select. Jump from a title up to its card or section with Parent. |
| Inline text editing | Double-click any title, subtitle or paragraph and type. Enter confirms, Esc cancels. |
| Duplicate and delete cards | Add a card by duplicating one. Remove a card in one click. Undo if you slip. |
| Button state | Enable or disable any button and save the state into your code. |
| Writes to your source | Text edits are matched to the right file and line in JSX, TSX, HTML, Vue, Svelte, Astro, MDX and JSON. |
| Works with your dev server | A local proxy sits in front of Next.js, Vite or any dev server. Hot reload keeps working. |
| Always shows what happened | After Save, a panel lists every file and line written, and every change waiting for the agent. |
| Local and private | Binds to 127.0.0.1. Writes need a per-session token. Nothing leaves your machine. |

### 5. Why not just ask the agent?

**Heading:** Click it, don't describe it.

|  | Describe it in chat | live-edit |
| --- | --- | --- |
| Pick the element | Explain which card and which line | Click it |
| See the result | Wait, then reload | Instant on the page |
| Change one word | Prompt, review diff | Double-click, type, save |
| Duplicate a card | Describe structure and data | One click, agent updates the data array |
| Same text on many cards | Risk of editing the wrong one | Matched using the card around it |

### 6. FAQ

**Does it work with Next.js, Vite or plain HTML?** Yes. live-edit proxies whatever dev server you already run. If your text is in your source files, it can be found.

**Does it change my production site?** No. The editor only exists on the proxy at port 4321. Your dev server and your build are untouched.

**What does it add to my project?** A `.agent/skills/live-edit` folder, an `npm run live` script, and `.live/` in `.gitignore`.

**Do I need Antigravity?** Text edits save to your files without any agent. Duplicate, delete and button changes are applied by the agent, so you need Antigravity or another agent that reads SKILL.md files.

**What if my text comes from a CMS or database?** Then it is not in your code. live-edit tells you it could not find it and does not guess.

### 7. Final call to action

**Heading:** Stop describing. Start clicking.

**Buttons:** Install the skill, Read the docs

**Footer line:** live-edit is open source and runs on localhost. Built for Antigravity.

## Installation page copy

**Page title:** Install live-edit

**Intro:** You can be editing on localhost in about two minutes. Install it once per project.

### Requirements

| You need | Notes |
| --- | --- |
| Node.js 18 or newer | Check with `node -v` |
| A website project with a dev server | Next.js, Vite, Astro, plain HTML server, anything on localhost |
| Antigravity | Needed to apply duplicate, delete and button changes. Text edits save without it. |

### Step 1. Get the skill

```bash
git clone https://github.com/lakshya1282/live-edit.git
```

No git? Download the ZIP from the repo's Releases page and unzip it.

### Step 2. Install it into your project

Open a terminal in **your website's root folder** (the one with `package.json`) and run:

```bash
node ../live-edit/skills/live-edit/scripts/live.mjs init
```

Adjust the path to wherever you cloned the repo. This command:

1. Copies the skill to `.agent/skills/live-edit/`
2. Adds the script `npm run live` to your `package.json`
3. Adds `.live/` to your `.gitignore`

It changes nothing else.

### Step 3. Start your site

```bash
npm run dev
```

### Step 4. Start live-edit

In a second terminal, in the same folder:

```bash
npm run live
```

You should see:

```text
live-edit ready
open  http://localhost:4321   (proxying http://localhost:3000)
edits write to: /path/to/your-website
```

Check that the last line shows your project folder. If it shows another folder, stop and restart from the project root.

### Step 5. Open the editor

Go to `http://localhost:4321`. Your site loads as normal, with a small bar at the bottom: **Live: on, Undo, 0 changes, Save to code**. That bar means it works.

Then tell Antigravity: **start live-edit**. It will wait for your changes and apply the ones the editor cannot write by itself.

### Options

| Option | What it does | Example |
| --- | --- | --- |
| `--target` | Your dev server's address, if it is not found automatically | `npm run live -- --target http://localhost:5173` |
| `--port` | The editor's port. Default is 4321. | `npm run live -- --port 4400` |

Astro also uses port 4321 by default. If you use Astro, start live-edit with `--port 4400`.

No `package.json`? Run it directly:

```bash
node .agent/skills/live-edit/scripts/live.mjs start --target http://localhost:8000
```

### Install for every project

Copy the skill folder into Antigravity's global skills folder instead of running `init` per project. \[Author: confirm the current global skills path in Antigravity's docs before publishing; it was `~/.gemini/antigravity/skills/` at the time of writing.\]

### Uninstall

1. Delete the `.agent/skills/live-edit` folder.
2. Remove the `"live"` line from `scripts` in `package.json`.
3. Remove `.live/` from `.gitignore`.

### Install problems

| You see | Do this |
| --- | --- |
| No dev server found | Start your site first, or pass `--target` with its address |
| Port already in use | Pass `--port` with a free port |
| Edits are not found in your code | You started live-edit outside the project root. Stop it and restart from the root. |

## Usage page copy

**Page title:** Using live-edit

**Intro:** Edit on the page, press Save, and your code changes. This page covers every control and the save loop.

### Start a session

1. Run your dev server, then `npm run live`.
2. Open `http://localhost:4321`.
3. Tell Antigravity: **start live-edit**. Keep it running while you edit.

### Select something

Hover to see a dashed outline. Click to select. The selected element gets a solid outline and a small toolbar.

While Live is on, clicks on the page select instead of following links or pressing buttons. Switch Live off to use the site normally.

### The toolbar

| Button | What it does | Saved how |
| --- | --- | --- |
| Edit text | Makes the text editable in place | Written straight to your source |
| Parent ↑ | Selects the element around this one. Use it to go from a title to its card or section. | Selection only |
| Child ↓ | Selects the first element inside this one | Selection only |
| Duplicate | Copies the element and places it after the original. Use it to add a card. | Applied by the agent |
| Delete | Removes the element | Applied by the agent |
| Enable / Disable | Shown on buttons only. Toggles the disabled state. | Applied by the agent |

### Edit text

1. Double-click a title, subtitle or paragraph, or select it and press **Edit text**.
2. Type. **Enter** confirms. **Esc** cancels.
3. Repeat for as many texts as you like. The counter at the bottom shows how many changes are waiting.

If the element you selected holds no text itself, you will see a hint to use **Child ↓** and pick the element that does.

### Add a card

1. Click inside the card, then press **Parent ↑** until the whole card is selected.
2. Press **Duplicate**. The copy appears right after it.
3. Double-click the copy's title and text and change them.
4. Press Save. The agent adds the new card to your code. If your cards come from a data array, it adds a new entry with the same fields.

### Delete a card

Select the whole card with **Parent ↑**, press **Delete**, then Save. If the card comes from a data array, the agent removes that entry.

### Turn a button on or off

Select the button, press **Disable** (or **Enable**), then Save. The agent sets the `disabled` attribute, or changes the state or prop that controls it.

### The bottom bar

| Control | What it does |
| --- | --- |
| Live: on / off | Turns the editor on or off. Off means the site behaves normally. |
| Undo | Reverts your last change. Also Ctrl/Cmd+Z. |
| N changes | Click to list everything waiting to be saved |
| Save to code | Writes your changes. Also Ctrl/Cmd+S. |

Nothing touches your code until you press Save.

### After you press Save

A panel appears at the bottom right and stays until you close it.

| You see | It means |
| --- | --- |
| ✓ src/Branches.jsx:42 | The text was written to that file and line |
| ⚠ queued | Not in your code yet. Waiting for the agent. |
| ⚠ queued, ambiguous | The same text appears in several places and live-edit would not guess. The agent will pick, or ask you. |
| ⚠ queued, notfound | The text is not in your source files. It may come from a CMS or an API. |

If anything is queued, tell Antigravity: **apply live-edit changes**. The agent reads each item, edits the right files in your code style, and clears it from the queue.

### Keyboard shortcuts

| Keys | Action |
| --- | --- |
| Double-click | Select and edit text |
| Enter | Confirm text edit |
| Esc | Cancel text edit, or deselect |
| Ctrl/Cmd+S | Save to code |
| Ctrl/Cmd+Z | Undo |

### Tips

- Save often. A full page reload clears edits you have not saved.
- Edit one text at a time. Do not paste formatted content.
- Work on one card per save when texts repeat across cards.
- Review the result in your normal Git diff before you commit.

## Docs page copy

**Page title:** How live-edit works

**Intro:** live-edit has three parts: a local proxy, an editor layer, and a skill your agent follows. This page explains how they fit together, what is saved where, and what to do when something is not saved.

### How it works

1. **A proxy sits in front of your dev server.** `npm run live` starts a small server on port 4321 that forwards everything to your real dev server. Hot reload keeps working because websocket traffic is passed through.
2. **The editor is added to the page.** The proxy injects one script into each HTML page it forwards. That script draws the outlines, toolbar and bottom bar.
3. **You edit in the browser.** Edits are held in the page until you press Save.
4. **Save sends them to the proxy.** The proxy tries to write each text edit into your source files.
5. **Anything it cannot write safely is queued.** Queued changes go to `.live/pending.json` for your agent, which applies them in your code style.

&#91;Diagram for designer: left to right. Browser editor, then Proxy, then a split. Top branch: "Text found in exactly one place" goes to "Written to source file". Bottom branch: "Duplicate, delete, button state, or unclear text" goes to ".live/pending.json", then "Agent applies it", then "Source file".\]

### What is saved where

| Change | Saved by | Result |
| --- | --- | --- |
| Text edit, found in one place | live-edit, on Save | File and line written immediately |
| Text edit, same text in several places | live-edit if the surrounding card identifies one, otherwise the agent | Written, or queued with file and line candidates |
| Text edit, not found in source | The agent | Queued as notfound. Often means the text comes from a CMS or API. |
| Duplicate a card | The agent | New markup or new data entry, including your edits to the copy |
| Delete a card | The agent | Markup or data entry removed |
| Enable or disable a button | The agent | `disabled` attribute, state or prop changed |

### How text is found

live-edit takes the text you changed and searches your project for it.

- It searches `.html`, `.htm`, `.jsx`, `.tsx`, `.js`, `.ts`, `.mjs`, `.vue`, `.svelte`, `.astro`, `.mdx`, `.md` and `.json` files under 500 KB.
- It skips `node_modules`, `.git`, `dist`, `build`, `.next`, `.nuxt`, `.svelte-kit`, `.vercel`, `.turbo`, `coverage`, `out`, `.agent` and `.live`.
- It ignores differences in whitespace, line breaks, curly versus straight quotes, and HTML entities such as `&apos;` and `&amp;`.
- When the same text appears more than once, it uses the other texts in the same card, such as the branch name or address, to choose the right one. If that is still unclear, it queues the edit instead of guessing.
- When you change part of a sentence that React splits around a value, such as "Visit any of our {count} locations", it saves only the part that changed.

It only writes to files inside the folder where `npm run live` was started.

### Commands

| Command | What it does |
| --- | --- |
| `live.mjs init` | Installs the skill into the current project and adds `npm run live` |
| `live.mjs start [--target URL] [--port N]` | Starts the editor proxy. Default port 4321. |
| `live.mjs wait [--timeout SECONDS]` | Waits for saved changes that need the agent, prints them, and exits. Default timeout 600 seconds. |
| `live.mjs pending` | Prints the queue without clearing it |
| `live.mjs done [id ...]` | Removes items from the queue. With no ids, clears everything. |

The agent uses `wait` and `done`. You normally only run `init` and `start`.

### What the agent does

The skill's `SKILL.md` tells Antigravity to loop while you edit:

1. Run `wait` until you press Save with queued changes.
2. Find the right source for each item and change it, following your existing code style.
3. Run `done` for that item.
4. Report what changed in one line, then wait again.

If a change is unclear and a wrong guess would edit the wrong card, the agent asks you one short question first.

### Troubleshooting

| Problem | Cause | Fix |
| --- | --- | --- |
| The edit is gone after refresh | It was queued, not written | Look at the result panel. If it says queued, ask Antigravity to apply live-edit changes. |
| Panel says notfound | The text is not in your code, or live-edit was started in the wrong folder | Check the "edits write to" line in the terminal. If the text comes from a CMS or API, change it there. |
| Panel says ambiguous | The same text exists in several files | The agent picks using the candidates listed. Or edit one card at a time. |
| Save failed | live-edit is not running | Start `npm run live` again |
| Site is blank or shows an error | Wrong `--target` | Pass your dev server's address with `--target` |
| Clicks do not follow links | Live is on | Switch Live off in the bottom bar |
| Unsaved edits disappeared | The page did a full reload | Save more often |

### Limits

- Text built from several string parts, or created at runtime, cannot be matched and is queued as notfound.
- Duplicate, delete and button changes need an agent to apply them.
- A new card cannot be edited again until the agent has added it and the page has reloaded.
- It does not edit styles, images, links or layout. It edits text, cards and button state.
- A full page reload clears edits that were not saved.

### Security and privacy

- The editor binds to 127.0.0.1, so only your own computer can reach it.
- Every write request needs a token created fresh each time you start live-edit.
- The proxy removes Content-Security-Policy headers from pages it forwards, so the editor script can load. Your real dev server is not changed.
- Nothing is sent over the internet. There is no account, no analytics and no telemetry.
- Review every change in `git diff` before you commit.

## GitHub repo

### Repo settings

| Setting | Value |
| --- | --- |
| Repo name | live-edit |
| About (description) | Click-to-edit layer for your localhost site. Edit text, duplicate cards, toggle buttons, and save the changes into your codebase. An Antigravity skill. |
| Website | Your landing page URL |
| Topics | antigravity, agent-skill, visual-editor, live-editing, localhost, frontend, nextjs, vite, developer-tools, vibe-coding |
| License | MIT (your call; change if you prefer another) |
| First release | v0.1.0, attach `live-edit.zip` |

### File tree

```text
live-edit/
├── README.md
├── LICENSE
└── skills/
    └── live-edit/
        ├── SKILL.md
        └── scripts/
            ├── live.mjs
            └── client.js
```

Keeping the skill inside `skills/live-edit/` lets `init` copy only the skill, not the repo's `.git` folder.

### README.md

````markdown
# live-edit

Edit your localhost site on the page. Save it to your code.

live-edit is a skill for Antigravity. It adds a click-to-edit layer on top of your running dev server. Change a title, duplicate a card, disable a button, press Save, and the change lands in your source files.

![demo](docs/demo.gif)

## Features

- Click to select any section, card, title, subtitle or button
- Edit text in place. Double-click, type, Enter
- Duplicate and delete cards
- Enable or disable buttons
- Text edits are written straight to your source (JSX, TSX, HTML, Vue, Svelte, Astro, MDX, JSON)
- Structural changes are applied by your agent in your code style
- Works with Next.js, Vite, Astro or any dev server through a local proxy
- Runs on localhost only. Zero dependencies

## Install

Requires Node.js 18+.

```bash
git clone https://github.com/lakshya1282/live-edit.git
cd your-website
node ../live-edit/skills/live-edit/scripts/live.mjs init
```

`init` copies the skill to `.agent/skills/live-edit/`, adds `npm run live` to your `package.json`, and adds `.live/` to `.gitignore`.

## Use

```bash
npm run dev     # your site
npm run live    # the editor, in a second terminal
```

1. Open http://localhost:4321
2. Tell Antigravity: **start live-edit**
3. Click, edit, press Save (Ctrl/Cmd+S)

After Save, a panel lists what was written (file and line) and what is queued for the agent. If anything is queued, tell Antigravity: **apply live-edit changes**.

Options: `--target http://localhost:5173` for your dev server, `--port 4400` for the editor.

## What saves where

| Change | Saved by |
| --- | --- |
| Text edit, found in one place | live-edit, immediately |
| Duplicate, delete, button state | Your agent |
| Text not found in source (CMS, API) | Reported, not guessed |

## How it works

A local proxy forwards your dev server and injects the editor script. Saved text edits are matched to your source files. Everything else is queued in `.live/pending.json` and applied by the agent through the skill.

## Limits

- Edits text, cards and button state. Not styles, images or layout
- Runtime-built text cannot be matched
- A full page reload clears unsaved edits

## Security

Binds to 127.0.0.1. Writes need a per-session token. Writes only inside the folder you started it in. No telemetry.

## Contributing

Issues and pull requests are welcome. Please include the framework and a minimal example of the text that was not found.

## License

MIT
````

### Release notes for v0.1.0

- Click-to-edit overlay with hover, select, parent and child navigation
- Inline text editing saved directly to source
- Duplicate, delete and enable or disable, applied by the agent
- Result panel after every save
- Smart matching for repeated text, split text and HTML entities
- Edits made on a duplicated card go to the new card only
