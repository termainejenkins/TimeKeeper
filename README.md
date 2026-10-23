# <img src="src/renderer/assets/icon.png" alt="Time Keeper icon" width="48" height="48"> Time Keeper

An always-on-top desktop HUD that shows the task you are in and how much time is left, without taking over the screen.

![Time Keeper HUD demo](docs/demo.gif)

**Demo GIF placeholder.** The HUD has to be recorded on Windows. Save that capture as `docs/demo.gif` (this path). Until that file is committed, the image above will not render.

## Download

Installers are published on GitHub Releases:

https://github.com/termainejenkins/TimeKeeper/releases

Windows builds are the ones published today (`Time Keeper-Setup-<version>.exe`).

## Features

- Always-on-top, transparent, click-through HUD (the menu button can still be used)
- Local task create, edit, and delete, including repeats (daily, weekly, weekdays, weekends, every other day, and a custom day interval)
- Multiple task lists and an archive for tasks that have expired
- System tray menu: Show HUD, Options, Quit
- Options window with a live HUD preview
- HUD options: dark mode, clock, click-through, always on top, opacity, placement, border, and size (width, height, font size, padding)
- Color thresholds in HUD Options: normal, warning, and critical colors and percentages, with a live preview animation. The on-screen HUD border shifts between those colors as time runs down, using the built-in 50% and 5% cutovers
- Settings persist across restarts (`electron-store` for tasks and HUD settings)

## Roadmap

- **Google Calendar integration — coming soon.** OAuth and a calendar client are scaffolded in `src/main/calendar/google.ts` and exposed over IPC. Events are not shown on the HUD yet, and the app does not ship with Google credentials.
- Replace the demo GIF placeholder at `docs/demo.gif` with a Windows recording of the HUD.

## Tech stack

- Electron
- React
- TypeScript
- Vite
- electron-store
- electron-builder
- Jest and Testing Library

## Build from source

Requirements: Node.js 18 or later, npm 7 or later, and Git.

```bash
git clone https://github.com/termainejenkins/TimeKeeper.git
cd TimeKeeper
npm install
```

Copy `.env.example` to `.env` if you are working on the Calendar scaffold. Leave the values empty until that work starts. Do not commit `.env`.

Development (builds the renderer and main process, then launches Electron):

```bash
npm run dev
```

Production build (compile only, no installer):

```bash
npm run build
```

Package an installer into `release/` (gitignored):

```bash
npm run package:win    # Windows NSIS installer
npm run package:mac    # macOS dmg
npm run package:linux  # Linux AppImage
```

Tests:

```bash
npm test
```

Vite must keep `base: './'` in `vite.config.ts`. A leading slash makes Electron look for the renderer bundle at the filesystem root, so the HUD window stays blank.

## Project layout

```
src/
  main.ts                 # Electron main process (windows, tray, IPC)
  main/tasks/             # Local tasks stored with electron-store
  main/calendar/google.ts # Google Calendar scaffold (not wired to the HUD)
  renderer/               # React HUD and options window
  shared/                 # Types, menu, color helpers
```

## License

MIT

## Author

Termaine Jenkins (TJ)
