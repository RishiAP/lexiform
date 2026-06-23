import {createHeadlessEditor} from '@lexical/headless';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {$getRoot, $insertNodes} from 'lexical';
import {editorNodes} from '../nodes/EditorNodes';
import theme from '../themes/DefaultTheme';
import {$convertToMarkdownString, $convertFromMarkdownString} from '@lexical/markdown';
import {PLAYGROUND_TRANSFORMERS} from '../components/plugins/extended/MarkdownTransformers';

/**
 * Converts Lexical JSON state string to an HTML string.
 * This is safe to run on the server (Node.js) since it uses @lexical/headless.
 */
export function lexicalJSONToHTML(jsonString: string): string {
  const editor = createHeadlessEditor({
    nodes: editorNodes,
    theme,
  });
  
  editor.setEditorState(editor.parseEditorState(jsonString));
  
  let html = '';
  editor.update(() => {
    html = $generateHtmlFromNodes(editor, null);
  });
  
  return html;
}

/**
 * Converts an HTML string to a Lexical JSON state string.
 * Note: This requires a DOM environment. If running on the server, you need to provide a DOM instance
 * like JSDOM or similar via the editor configuration, but for simplicity, this function assumes
 * it's either run in the browser or an environment with a polyfilled DOM.
 */
export function htmlToLexicalJSON(htmlString: string): string {
  const editor = createHeadlessEditor({
    nodes: editorNodes,
    theme,
  });

  editor.update(() => {
    // In a browser environment, DOMParser is available.
    // On the server, this requires jsdom or similar to be global.
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    const root = $getRoot();
    root.clear();
    $insertNodes(nodes);
  });

  return JSON.stringify(editor.getEditorState().toJSON());
}

/**
 * Converts Lexical JSON state string to a Markdown string.
 * This is safe to run on the server (Node.js) since it uses @lexical/headless.
 */
export function lexicalJSONToMarkdown(jsonString: string): string {
  const editor = createHeadlessEditor({
    nodes: editorNodes,
    theme,
  });
  
  editor.setEditorState(editor.parseEditorState(jsonString));
  
  let markdown = '';
  editor.getEditorState().read(() => {
    markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
  });
  
  return markdown;
}

/**
 * Converts a Markdown string to a Lexical JSON state string.
 * This is safe to run on the server (Node.js) since it uses @lexical/headless.
 */
export function markdownToLexicalJSON(markdownString: string): string {
  const editor = createHeadlessEditor({
    nodes: editorNodes,
    theme,
  });

  editor.update(() => {
    $convertFromMarkdownString(markdownString, PLAYGROUND_TRANSFORMERS);
  });

  return JSON.stringify(editor.getEditorState().toJSON());
}

/**
 * Recursively compresses a Lexical JSON object by stripping out default,
 * empty, or redundant fields (like version, empty formats, direction="ltr", etc.)
 * to drastically reduce the payload size for database storage.
 */
export function compressLexicalJSON(node: any): any {
  if (Array.isArray(node)) {
    return node.map(compressLexicalJSON);
  }
  if (node !== null && typeof node === 'object') {
    const compressed: any = {};
    for (const [key, value] of Object.entries(node)) {
      // Strip out Lexical defaults to make them vanish from the output JSON
      if (key === 'version') continue;
      if (key === 'direction' && (value === null || value === 'ltr')) continue;
      if (key === 'format' && (value === '' || value === 0)) continue;
      if (key === 'indent' && value === 0) continue;
      if (key === 'detail' && value === 0) continue;
      if (key === 'mode' && value === 'normal') continue;
      if (key === 'style' && value === '') continue;
      
      // Recursively compress children
      if (key === 'children' && Array.isArray(value)) {
        compressed[key] = value.map(compressLexicalJSON);
        continue;
      }
      
      compressed[key] = compressLexicalJSON(value);
    }
    return compressed;
  }
  return node;
}

/**
 * Recursively decompresses a Lexical JSON object back to its fully explicit form,
 * restoring the default fields that Lexical expects before parsing.
 */
export function decompressLexicalJSON(node: any): any {
  if (Array.isArray(node)) {
    return node.map(decompressLexicalJSON);
  }
  if (node !== null && typeof node === 'object') {
    const decompressed: any = { ...node };
    
    // Always restore version to 1 as Lexical requires it
    if (!('version' in decompressed)) {
      decompressed.version = 1;
    }

    const type = decompressed.type;

    if (type === 'text') {
      if (!('format' in decompressed)) decompressed.format = 0;
      if (!('detail' in decompressed)) decompressed.detail = 0;
      if (!('mode' in decompressed)) decompressed.mode = 'normal';
      if (!('style' in decompressed)) decompressed.style = '';
    } else if (type === 'paragraph' || type === 'heading' || type === 'list' || type === 'listitem' || type === 'quote' || type === 'root') {
      if (!('direction' in decompressed)) decompressed.direction = 'ltr';
      if (!('format' in decompressed)) decompressed.format = '';
      if (!('indent' in decompressed)) decompressed.indent = 0;
    }

    if ('children' in decompressed && Array.isArray(decompressed.children)) {
      decompressed.children = decompressed.children.map(decompressLexicalJSON);
    }

    return decompressed;
  }
  return node;
}
