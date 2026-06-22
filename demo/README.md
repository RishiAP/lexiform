# Lexiform Demo Environment

This directory contains the development and demonstration environment for **Lexiform**, built with [Next.js](https://nextjs.org).

It acts as both a playground to test out new Lexiform features, and a live example of how you can integrate the `@rishiap/lexiform` editor into a modern React application.

## Getting Started

To run the demo locally, from the root of the project, run:

```bash
npm run demo
```

Or, if you are already inside the `demo/` folder:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the editor in action.

## How it works

- **Local Package Linking**: This Next.js app links directly to the local `@rishiap/lexiform` workspace package (see `package.json`).
- **Dynamic Importing**: Because Lexical requires the DOM, the editor is dynamically imported without Server-Side Rendering (SSR) in `app/page.tsx` using `next/dynamic`.
- **Theme Toggling**: The demo demonstrates Lexiform's native `.dark` and `.light` class support by directly toggling these classes on the HTML `document.documentElement`.
- **JSON Serialization**: Below the editor, there is a live preview window showing the `onChange` value parsed back into formatted Lexical JSON state.

## Modifying the Demo

You can start editing the demo page by modifying `src/app/page.tsx`. The page will auto-update as you edit the file.

> **Note**: If you make changes to the actual Lexiform package source code (in `../src`), you must rebuild the package (`npm run build` in the root) and then restart the Next.js dev server for Webpack/Turbopack to pick up the updated local module.
