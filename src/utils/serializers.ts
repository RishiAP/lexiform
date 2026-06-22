import {createHeadlessEditor} from '@lexical/headless';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {$getRoot, $insertNodes} from 'lexical';
import {editorNodes} from '../nodes/EditorNodes';
import theme from '../themes/DefaultTheme';

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
