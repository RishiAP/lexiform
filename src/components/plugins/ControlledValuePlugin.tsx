import {useEffect, useRef} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { EditorOutputFormat } from '../../types';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';
import { compressLexicalJSON, decompressLexicalJSON } from '../../utils/serializers';

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
        const rawJson = editor.getEditorState().toJSON();
        currentContent = JSON.stringify(compressLexicalJSON(rawJson));
      } else {
        currentContent = $generateHtmlFromNodes(editor, null);
      }
    });

    if (value === currentContent) return;
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    
    if (format === 'json') {
      try {
        const rawObj = JSON.parse(value);
        const decompressedObj = decompressLexicalJSON(rawObj);
        const parsedState = editor.parseEditorState(decompressedObj);
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
