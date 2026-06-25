# @rishiap/lexiform

[![NPM Version](https://img.shields.io/npm/v/@rishiap/lexiform)](https://www.npmjs.com/package/@rishiap/lexiform)
[![Made by RishiAP](https://img.shields.io/badge/Made%20by-RishiAP-blue?style=flat-square&logo=github)](https://github.com/RishiAP)

Lexiform is a highly polished, ultra-lightweight (under 100KB minified & gzipped), headless-compatible drop-in React rich text editor built on top of [Lexical](https://lexical.dev/) (`0.45.0`). Styled seamlessly with vanilla CSS + [Radix UI](https://www.radix-ui.com/) primitives + [Lucide React](https://lucide.dev/) icons.

It abstracts away the complexity of Lexical's architecture and provides a stunning, modern, single `<LexicalEditor>` component for quick integration into Next.js, Vite, and other React apps.

## Features

- **Ultra Lightweight**: Fully featured editor bundle that stays under 100KB (minified and gzipped) by utilizing smart code-splitting (e.g. dynamically lazy-loading a 350KB emoji list).
- **Next.js 15+ & Turbopack Ready**: Fully compatible with the modern Next.js App Router, strict ESM resolution, and Turbopack's static analyzers (zero module warnings).
- **Drop-in `<LexicalEditor />` Component**: Start using a rich text editor instantly.
- **Beautiful UI**: Polished toolbar with vanilla CSS combined with robust Radix UI primitives.
- **Native Shadcn & Tailwind Compatibility**: Inherits global CSS variables and natively supports standard `.dark` and `.light` theme classes, syncing perfectly with `next-themes`.
- **Slash Menu (`/`) Component Picker**: Type `/` to bring up a Notion-style block menu.
- **Floating Toolbar**: Select any text to instantly see a floating toolbar with quick formatting options (Bold, Italic, Link, Case formatting, Subscript, etc).
- **Zero-Config JSON Compression**: Automatically strips Lexical defaults (like `version`, `direction`, `detail`) natively in the background, slashing the JSON payload size for ultra-lightweight database storage.
- **Backend-Safe Serializers**: Includes SSR/backend-friendly utilities to seamlessly convert Lexical JSON to HTML/Markdown and vice-versa.
- **Feature-Rich Editing**:
  - Headings & Block types (H1-H6, Quote, Code, Lists)
  - Text Formatting (Bold, Italic, Underline, Strikethrough, Code, Subscript, Superscript, Case conversions)
  - Color Pickers (Font Color & Background Color)
  - Alignments (Left, Center, Right, Justify)
  - Interactive Links & Floating Editors
  - History (Undo/Redo)
- **Advanced Nodes & Plugins**:
  - Excalidraw whiteboards
  - Mathematics/Equations (KaTeX)
  - Polls
  - Layout / Columns
  - Embeds: YouTube, X (Twitter), Figma
  - Categorized Emoji Picker with search & `:` real-time typeahead dropdown
  - Classic Emoticon support `:)`, `:D`
  - Collapsible sections
- **Controlled Component**: Pass `value` and `onChange` seamlessly like a standard HTML input.
- **ESM & Headless Support**: Modern build system using `tsup`, ensuring compatibility across various React environments.

## Installation

```bash
npm install @rishiap/lexiform
# or
yarn add @rishiap/lexiform
# or
pnpm add @rishiap/lexiform
```

> **Note**: Lexiform relies on modern React (`>=18.0.0`). The core editor automatically installs all necessary Lexical dependencies.

### Optional Dependencies

Some advanced plugins require large third-party libraries. To keep the base package lightweight, these are marked as optional peer dependencies. If you plan to use these specific plugins, install them separately:

- **`ExcalidrawPlugin`**: requires `@excalidraw/excalidraw`
- **`EquationsPlugin`**: requires `katex` and `mathlive`

Because these plugins are huge, they are **decoupled from the main bundle**. If you want to use them, install their peer dependencies and import them from their dedicated subpaths:

```tsx
// 1. Install the peer dependency
// npm install @excalidraw/excalidraw

// 2. Import from the subpath (both JS and styles)
import { ExcalidrawPlugin } from '@rishiap/lexiform/excalidraw';
import '@rishiap/lexiform/excalidraw.css';

import { EquationsPlugin } from '@rishiap/lexiform/equations';
import '@rishiap/lexiform/equations.css';
```

## Usage

Using Lexiform in your app is as simple as importing the editor and its stylesheet.

```tsx
"use client"; // If using Next.js App Router

import { useState } from 'react';
import { 
  LexicalEditor, 
  ExtendedNodes, 
  ComponentPickerPlugin,
  EquationsPlugin,
  ExcalidrawPlugin,
  ImagesPlugin,
  YouTubePlugin 
} from '@rishiap/lexiform';
import '@rishiap/lexiform/styles.css'; // Don't forget the CSS!

export default function MyEditor() {
  const [content, setContent] = useState<string>('');

  return (
    <div className="border rounded-xl shadow-sm p-4">
      <LexicalEditor
        value={content}
        onChange={(val) => setContent(val)}
        outputFormat="json" // or "html" or "markdown"
        placeholder="Start typing..."
        nodes={ExtendedNodes}
        plugins={
          <>
            <ComponentPickerPlugin />
            <EquationsPlugin />
            <ExcalidrawPlugin />
            <ImagesPlugin />
            <YouTubePlugin />
            {/* Add more plugins as needed */}
          </>
        }
      />
    </div>
  );
}
```

## Custom Code Languages

Lexiform lazily loads its syntax highlighters to keep your initial bundle tiny. By default, the code block dropdown offers a core set of common languages. You can easily restrict these or add entirely new languages (like Go, Ruby, Docker, etc.) using the `codeLanguages` prop and the `DEFAULT_CODE_LANGUAGES` export.

```tsx
import { LexicalEditor, DEFAULT_CODE_LANGUAGES } from '@rishiap/lexiform';

// 1. Import any additional languages you want from PrismJS
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-docker';

export default function MyEditor() {
  return (
    <LexicalEditor
      // ...other props
      codeLanguages={{
        ...DEFAULT_CODE_LANGUAGES, // Spread the built-in defaults
        go: 'Go',                  // Add your custom languages!
        ruby: 'Ruby',
        docker: 'Docker',
      }}
    />
  );
}
```

If you ever want to strictly restrict the editor to a subset of languages (e.g., only JavaScript and Python), simply don't spread the defaults!

## Theming & Dark Mode

Lexiform is built to be a team player. Its internal variables automatically look for standard Shadcn UI variables (`--background`, `--foreground`, `--primary`, etc.).

If your app uses `next-themes` (or manually applies `.dark` classes to the `<html>` or `<body>` tag), Lexiform will seamlessly switch to its dark theme. Furthermore, Lexiform features **two-way theme synchronization** for advanced plugins like Excalidraw: toggling the theme from inside the Excalidraw whiteboard will automatically dispatch `StorageEvent`s and update your website's global theme in real-time.

If you want to manually force themes without `next-themes`, apply the `lexiform-dark` or `lexiform-light` classes.

## Serializers

Lexiform exports utilities for easily converting between Lexical JSON format and static HTML or Markdown, making it easy to save to a database and render safely on the frontend.

```tsx
import { 
  lexicalJSONToHTML, 
  htmlToLexicalJSON,
  lexicalJSONToMarkdown,
  markdownToLexicalJSON
} from '@rishiap/lexiform/server';

// Generate HTML from JSON
const htmlString = lexicalJSONToHTML(lexicalJsonString);

// Or generate Markdown from JSON
const markdownString = lexicalJSONToMarkdown(lexicalJsonString);

// Parse HTML or Markdown back into Lexical JSON (for editing)
const jsonFromHtml = htmlToLexicalJSON(htmlString);
const jsonFromMd = markdownToLexicalJSON(markdownString);
```

## Available Plugins
Lexiform exports many plugins to extend the base editor. Simply pass them into the `plugins` prop alongside `ExtendedNodes` in the `nodes` prop.

*   `ComponentPickerPlugin` (Enables `/` menu)
*   `EquationsPlugin` (Inline & Block KaTeX)
*   `ExcalidrawPlugin` (Interactive whiteboards)
*   `ImagesPlugin` (Image uploads/embeds)
*   `LayoutPlugin` (Multi-column layouts)
*   `PollPlugin` (Interactive voting)
*   `YouTubePlugin`, `TwitterPlugin`, `FigmaPlugin` (Embeds)
*   `CollapsiblePlugin` (Toggle sections)

## Development

Lexiform is built using `tsup`. 
1. Install dependencies: `npm install`
2. Build the package: `npm run build`
3. Link and test locally in the `demo/` folder: `cd demo && npm run dev`

## Author

**RishiAP**
- [GitHub: @RishiAP](https://github.com/RishiAP)
- [NPM: @rishiap](https://www.npmjs.com/~rishiap)

## License
MIT
