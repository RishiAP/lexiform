# Requirements Document: `@rishiap/lexiform` NPM Package

## Context

**Package repository (this repo):** https://github.com/RishiAP/lexiform  
**Original application (reference/demo):** https://github.com/RishiAP/lexical  
**Live demo:** https://lexical-editor-react.vercel.app  
**Goal:** This repository contains the canonical source for the `@rishiap/lexiform` package. The `src/` directory is the library source to be built and published; `demo/` contains the original Next.js demo used for local development only. The package will provide a frontend React component plus a small set of backend-safe serializer utilities for server-side processing and conversions.

---

## 1. What Exists Today

The current repo is a **Next.js application** (bootstrapped with `create-next-app`), TypeScript 92.5%, CSS 7.5%. It wraps Facebook's Lexical editor and exposes it as a form-like component.

### Features confirmed from the live demo:

| Feature | Detail |
|---|---|
| Block type selector | Dropdown — "Normal" visible; likely includes H1, H2, H3, Quote, Code, etc. |
| Font family selector | Dropdown — "Arial" visible; likely more families |
| Insert button | Likely inserts links, images, or special nodes |
| Text alignment | "Left Align" visible; likely Center, Right, Justify |
| Get Contents button | Extracts editor content (JSON or HTML) to consume externally |
| Contenteditable area | Placeholder: "Write your content here" |

---

## 2. Package Identity

```json
{
  "name": "@rishiap/lexiform",
  "description": "Lexical-based editor as a drop-in React component and backend-safe serializers",
  "version": "0.1.0",
  "author": "RishiAP",
  "license": "MIT"
}
```

> **Note:** The package name `@rishiap/lexiform` is scoped to avoid collision with existing packages on npm. Create the `@rishiap` org on npm if it doesn't exist, or choose an alternative unscoped name.

Dual-purpose (frontend + backend utilities):

- The primary deliverable is a frontend React component (`LexicalEditor`) that depends on Lexical and runs in the browser.
- In addition, export a small set of pure functions (serializers) such as `lexicalJSONToHTML` and `htmlToLexicalJSON` that are safe to run in Node, Bun, and other server runtimes (for server-side rendering, conversions, or CLI tooling). These utilities MUST NOT require the Lexical browser runtime and should be implemented as pure JS/TS functions.

Important: Lexical itself is client-only — the editor UI cannot run on the server. Only the serializer utilities can be considered backend-safe.

---

## 3. Package Architecture

The repo must be **restructured from a Next.js app into a library**. Two separate things will exist after the refactor:

```
/
├── src/                    ← library source (the package)
│   ├── index.ts            ← main export
│   ├── components/
│   │   ├── LexicalEditor.tsx      ← main component
│   │   ├── Toolbar/
│   │   │   ├── BlockTypeDropdown.tsx
│   │   │   ├── FontFamilyDropdown.tsx
│   │   │   ├── AlignmentControls.tsx
│   │   │   └── InsertControls.tsx
│   │   └── plugins/               ← Lexical plugin wrappers
│   ├── nodes/                     ← any custom Lexical nodes
│   ├── themes/                    ← CSS theme file
│   │   └── DefaultTheme.css
│   └── types.ts                   ← exported TypeScript types
│
├── demo/                   ← replaces the Next.js app, for local dev only
│   └── (small Next.js or Vite app that imports from src/)
│
├── tsconfig.json
├── tsup.config.ts          ← build config
└── package.json
```

---

## 4. Build Toolchain

Use **`tsup`** (wraps esbuild) for bundling. Do NOT use Next.js to build the library.

### Install dev dependencies:
```bash
yarn add -D tsup typescript @types/react @types/react-dom
```

### `tsup.config.ts`:
```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],          // ship both CJS and ESM
  dts: true,                        // generate .d.ts type declarations
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'], // peer deps — do NOT bundle these
  injectStyle: false,               // consumer imports CSS manually
});
```

### `package.json` build fields:
```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "yarn build"
  }
}
```

---

## 5. Peer Dependencies vs Bundled Dependencies

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "lexical": "^0.x.x",
    "@lexical/react": "^0.x.x",
    "@lexical/rich-text": "^0.x.x",
    "@lexical/list": "^0.x.x",
    "@lexical/link": "^0.x.x",
    "@lexical/code": "^0.x.x",
    "@lexical/history": "^0.x.x",
    "@lexical/selection": "^0.x.x",
    "@lexical/utils": "^0.x.x",
    "@lexical/markdown": "^0.x.x"
  }
}
```

**Rule:** `react` and `react-dom` are peer deps (host app provides them). All `@lexical/*` packages are regular dependencies (bundled with the package), since consumers shouldn't need to install Lexical separately to use your component.

---

## 6. Public API — Component Props

### `<LexicalEditor />`

This is the **single default export** and main component.

```tsx
export interface LexicalEditorProps {
  // Controlled value (Lexical JSON string). If provided, editor is controlled.
  value?: string;

  // Called on every editor change with the serialized Lexical JSON string
  onChange?: (json: string) => void;

  // Called with HTML string output (alternative to JSON)
  onChangeHTML?: (html: string) => void;

  // Placeholder text inside the editor area
  placeholder?: string;

  // Whether the editor is read-only (no editing, just display)
  readOnly?: boolean;

  // Which toolbar sections to show. Default: all enabled.
  toolbar?: {
    blockType?: boolean;       // H1/H2/H3/Normal/Quote/Code dropdown
    fontFamily?: boolean;      // Font family dropdown
    alignment?: boolean;       // Left/Center/Right/Justify buttons
    insert?: boolean;          // Insert link/image/etc.
    history?: boolean;         // Undo/Redo buttons
  };

  // CSS class applied to the outer wrapper div
  className?: string;

  // Inline styles for the outer wrapper
  style?: React.CSSProperties;

  // Height of the editor area (default: auto)
  minHeight?: string | number;
}
```

### Exported types:

```ts
export type { LexicalEditorProps };
export type EditorOutputFormat = 'json' | 'html' | 'markdown';
```

### Named exports:

```ts
// Main component
export { LexicalEditor } from './components/LexicalEditor';
export { LexicalEditor as default } from './components/LexicalEditor';

// Utility: convert Lexical JSON string → HTML string (for backend use)
export { lexicalJSONToHTML } from './utils/serializers';

// Utility: convert HTML string → Lexical JSON string
export { htmlToLexicalJSON } from './utils/serializers';
```

---

## 7. CSS / Theming Strategy

### Approach: Ship a single CSS file, consumer imports it once.

```tsx
// Consumer's app (e.g., _app.tsx or layout.tsx)
import '@rishiap/lexiform/styles';
```

### What the CSS file covers:
- Toolbar container styles
- Toolbar button styles (hover, active, selected states)
- Dropdown styles (block type, font family)
- Editor contenteditable area (padding, min-height, border)
- Lexical theme class names (bold, italic, underline, heading, code block, etc.)

### CSS Custom Properties for theming:

Expose CSS variables so consumers can override without fighting specificity:

```css
:root {
  --lexical-editor-border: 1px solid #ccc;
  --lexical-editor-border-radius: 6px;
  --lexical-toolbar-bg: #f9f9f9;
  --lexical-toolbar-border: 1px solid #eee;
  --lexical-toolbar-btn-hover-bg: #e8e8e8;
  --lexical-toolbar-btn-active-color: #0070f3;
  --lexical-editor-area-padding: 12px 16px;
  --lexical-editor-min-height: 200px;
  --lexical-editor-font-size: 16px;
  --lexical-editor-font-family: inherit;
  --lexical-placeholder-color: #aaa;
}
```

---

## 8. Internal Component Breakdown

All internal components are **not exported** from `index.ts` — they are implementation details.

### `LexicalEditor.tsx`
- Wraps `<LexicalComposer>` from `@lexical/react`
- Registers all nodes: `HeadingNode`, `QuoteNode`, `ListNode`, `ListItemNode`, `LinkNode`, `CodeNode`, `CodeHighlightNode`
- Includes all plugins (see below)
- Handles `onChange` via `OnChangePlugin` and serializes state to JSON

### Plugins to include (all from `@lexical/react` unless noted):
| Plugin | Purpose |
|---|---|
| `RichTextPlugin` | Enables rich text editing |
| `HistoryPlugin` | Undo/redo support |
| `OnChangePlugin` | Fires `onChange` prop |
| `AutoFocusPlugin` | Optional: auto-focus on mount |
| `ListPlugin` | Ordered and unordered lists |
| `LinkPlugin` | Clickable link nodes |
| `MarkdownShortcutPlugin` | `# heading`, `**bold**`, `> quote` etc. |
| `CodeHighlightPlugin` | Syntax highlighting in code blocks |
| `TabIndentationPlugin` | Tab key for indentation |

### Toolbar components (internal):

**`BlockTypeDropdown.tsx`**
- Options: Normal (paragraph), Heading 1, Heading 2, Heading 3, Quote, Code Block, Bullet List, Numbered List
- Uses `$setBlocksType` from `@lexical/selection`

**`FontFamilyDropdown.tsx`**
- Options: Arial, Georgia, Courier New, Times New Roman, Verdana, monospace
- Applies via `editor.dispatchCommand(FORMAT_TEXT_COMMAND, ...)`

**`AlignmentControls.tsx`**
- Four buttons: Left, Center, Right, Justify
- Uses `FORMAT_ELEMENT_COMMAND`

**`InsertControls.tsx`**
- Insert Link button → prompts for URL, wraps selection in `LinkNode`
- (Optional v2): Insert Image, Insert Horizontal Rule

---

## 9. `src/index.ts` — Full Export Surface

```ts
// Component
export { LexicalEditor } from './components/LexicalEditor';
export { LexicalEditor as default } from './components/LexicalEditor';

// Types
export type { LexicalEditorProps } from './types';

// Serialization utilities
export { lexicalJSONToHTML, htmlToLexicalJSON } from './utils/serializers';
```

That's it. Keep the public surface minimal.

---

## 10. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "demo"]
}
```

---

## 11. What to Move, What to Delete

| Current file/folder | Action |
|---|---|
| `src/app/` (Next.js app router) | **Move to `demo/`** — keep for local dev only, do not ship |
| `src/components/` (existing editor components) | **Migrate into `src/`** — adapt to library pattern |
| `public/` | **Delete or keep in demo** — not needed in the package |
| `next.config.ts` | **Remove from root** — move to `demo/` if kept |
| `.vscode/` | Keep as-is |
| `package.json` | **Rewrite** — remove Next.js deps, add tsup, restructure scripts |

---

## 12. `package.json` Final Shape

```json
{
  "name": "@rishiap/lexiform",
  "version": "0.1.0",
  "description": "Lexical-based editor as a drop-in React component",
  "author": "Rishi AP <your-email>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/RishiAP/lexiform"
  },
  "keywords": ["lexical", "rich-text", "editor", "react", "wysiwyg"],
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css"
  },
  "files": ["dist", "README.md"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "demo": "cd demo && next dev",
    "prepublishOnly": "yarn build",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "lexical": "^0.22.0",
    "@lexical/react": "^0.22.0",
    "@lexical/rich-text": "^0.22.0",
    "@lexical/list": "^0.22.0",
    "@lexical/link": "^0.22.0",
    "@lexical/code": "^0.22.0",
    "@lexical/history": "^0.22.0",
    "@lexical/selection": "^0.22.0",
    "@lexical/utils": "^0.22.0",
    "@lexical/markdown": "^0.22.0"
  },
  "devDependencies": {
    "tsup": "^8.x.x",
    "typescript": "^5.x.x",
    "@types/react": "^18.x.x",
    "@types/react-dom": "^18.x.x"
  }
}
```

---

## 13. Consumer Usage (Target DX)

After publishing, this should be the full integration:

```tsx
// 1. Install
// npm
// npm install @rishiap/lexiform
// yarn
// yarn add @rishiap/lexiform
// pnpm
// pnpm add @rishiap/lexiform
// bun
// bun add @rishiap/lexiform

// 2. Import CSS once in app root
import '@rishiap/lexiform/styles';

// 3. Use in any component
import LexicalEditor from '@rishiap/lexiform';

export default function BlogPostForm() {
  const [content, setContent] = useState('');

  return (
    <LexicalEditor
      placeholder="Write your post..."
      onChange={(json) => setContent(json)}
      toolbar={{ blockType: true, fontFamily: false, alignment: true }}
      minHeight={300}
    />
  );
}
```

---

## 14. Out of Scope (v1)

These are explicitly NOT required for v1:

- Image upload (requires backend integration — v2)
- Collaboration / Yjs
- Table support
- Markdown-only mode (no toolbar)
- `defineEditor()` pattern with auto-generated Zod schemas (separate package idea)
- Next.js `"use client"` directive handling (consumer adds this in their wrapper)
- SSR compatibility (Lexical is inherently client-only; document this clearly)

---

## 15. Known Constraints for the AI

1. **Lexical is client-only** — the component must never run on the server. Export a note in the README that consumers using Next.js App Router must wrap with `dynamic(() => import(...), { ssr: false })` or add `"use client"` to their wrapper.

2. **Do NOT import from `@lexical/react/LexicalComposer` with a named re-export** — Lexical's package structure requires importing from the full path (e.g., `@lexical/react/LexicalComposer`), not the package root.

3. **CSS must be explicitly imported** — tsup does not inject styles automatically. The `"sideEffects": ["**/*.css"]` field in package.json tells bundlers not to tree-shake the CSS file.

4. **The existing `src/app/` code is Next.js App Router** — it uses server/client patterns that don't belong in a library. All editor logic needs to be extracted into pure React components with no Next.js imports.

5. **Lexical version lock** — pin the exact minor version of all `@lexical/*` packages to the same version. Mixing minor versions of Lexical packages causes runtime errors.

---

## 16. Deliverables Checklist

- [ ] `src/` directory with library source (no Next.js imports)
- [ ] `tsup.config.ts` configured for CJS + ESM + `.d.ts`
- [ ] `package.json` rewritten for npm publish
- [ ] `dist/` output: `index.js`, `index.mjs`, `index.d.ts`, `styles.css`
- [ ] `LexicalEditorProps` fully typed and exported
- [ ] All existing toolbar features preserved (block type, font, alignment, insert)
- [ ] `onChange` prop fires with serialized JSON string
- [ ] CSS variables documented
- [ ] `README.md` with install, usage, and Next.js SSR warning
- [ ] `demo/` app updated to import from `src/` for local testing