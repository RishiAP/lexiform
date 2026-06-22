import {useEffect, useRef} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { EditorOutputFormat } from '../../types';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';

interface ControlledValuePluginProps {
  value?: string;
  format?: EditorOutputFormat;
}

export function ControlledValuePlugin({ value, format = 'json' }: ControlledValuePluginProps) {
  const [editor] = useLexicalComposerContext();
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (value === undefined || value === null) return;
    
    let currentContent = '';
    editor.getEditorState().read(() => {
      if (format === 'json') {
        currentContent = JSON.stringify(editor.getEditorState().toJSON());
      } else {
        currentContent = $generateHtmlFromNodes(editor, null);
      }
    });

    if (value === currentContent) return;
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    
    if (format === 'json') {
      try {
        const parsedState = editor.parseEditorState(value);
        editor.setEditorState(parsedState);
      } catch (e) {
        console.error('Lexiform: Failed to parse JSON value', e);
      }
    } else {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        $insertNodes(nodes);
      });
    }

    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);

  }, [editor, value, format]);

  return null;
}
