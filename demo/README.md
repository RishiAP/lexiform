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
- **Theme Toggling**: The demo demonstrates Lexiform's native `.dark` class support, wired up with `next-themes` and Tailwind CSS v4. It also showcases **two-way Excalidraw theme sync**: toggling dark mode inside the Excalidraw whiteboard will magically toggle the entire website's theme!
- **JSON Serialization & Native Compression**: Below the editor, there is a live preview window showing the `onChange` value. Notice how the JSON is natively compressed, automatically stripping out empty defaults like `detail` and `version`!
- **Multiple Output Formats**: Test how Lexiform seamlessly emits highly optimized JSON, raw HTML, or clean Markdown.
- **Smart CSS Chunking**: Check `src/app/page.tsx` to see how you can optionally import just the CSS you need for complex plugins (e.g., Excalidraw, KaTeX) instead of a monolithic stylesheet.
- **Testing Optional Plugins**: Because Lexiform marks large third-party plugins (like Excalidraw and KaTeX) as *optional* peer dependencies, they are explicitly installed as standard `dependencies` in this `demo/package.json` so they can be tested and showcased locally.

## Modifying the Demo

You can start editing the demo page by modifying `src/app/page.tsx`. The page will auto-update as you edit the file.

> **Note**: If you make changes to the actual Lexiform package source code (in `../src`), you must rebuild the package (`npm run build` in the root) and then restart the Next.js dev server for Webpack/Turbopack to pick up the updated local module.

## Deployment to Vercel

You can easily deploy this demo folder directly to Vercel for free hosting.

1. **Import your GitHub repo** into your Vercel Dashboard.
2. In the **Build and Output Settings**, configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `demo`
   - **Install Command Override**: `npm install --include=dev`
   - **Build Command Override**: `cd .. && npm install --include=dev && npm run build && cd demo && npm run build`
3. Click **Deploy**.

*Why this build command?* Because the demo relies on the local `@rishiap/lexiform` package, Vercel must first step back into the root folder to build the `tsup` package before Next.js can compile.
