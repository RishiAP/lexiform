import type React from 'react';

export interface LexicalEditorProps {
  /**
   * Initial state of the editor. Can be an HTML string or Lexical JSON state string.
   */
  value?: string;

  /**
   * Callback fired when the editor state changes. Returns Lexical JSON state string.
   */
  onChange?: (json: string) => void;

  /**
   * Callback fired when the editor state changes. Returns HTML string.
   */
  onChangeHTML?: (html: string) => void;

  /**
   * Placeholder text to display when the editor is empty.
   */
  placeholder?: string;

  /**
   * Whether the editor is read-only.
   */
  readOnly?: boolean;

  /**
   * Toolbar configuration. Omit to show all available controls, or provide an object
   * to selectively enable/disable specific sections.
   */
  toolbar?: {
    history?: boolean;       // Undo/Redo
    blockType?: boolean;     // H1-H6, Quote, Code, Lists
    fontFamily?: boolean;    // Font family dropdown
    fontSize?: boolean;      // Font size controls
    fontColor?: boolean;     // Text color picker
    bgColor?: boolean;       // Background color picker
    alignment?: boolean;     // Left/Center/Right/Justify
    insert?: boolean;        // Insert link, horizontal rule
    textFormat?: boolean;    // Bold/Italic/Underline/Code + extras dropdown
  };

  /**
   * CSS class name applied to the outer wrapper.
   */
  className?: string;

  /**
   * Inline styles applied to the outer wrapper.
   */
  style?: React.CSSProperties;

  /**
   * Whether the editor should automatically focus on mount.
   */
  autoFocus?: boolean;

  /**
   * Minimum height of the editor content area.
   */
  minHeight?: string | number;

  /**
   * Output format when onChange is called
   */
  outputFormat?: EditorOutputFormat;

  /**
   * Additional Lexical nodes to register with the editor
   */
  nodes?: any[];

  /**
   * Additional plugins to render inside the composer
   */
  plugins?: React.ReactNode;

  /**
   * Override or restrict the available languages in the code block dropdown.
   * If provided, only these languages will be shown.
   * Example: { "js": "JavaScript", "python": "Python", "rust": "Rust" }
   */
  codeLanguages?: Record<string, string>;
}

export type EditorOutputFormat = 'json' | 'html' | 'markdown';
