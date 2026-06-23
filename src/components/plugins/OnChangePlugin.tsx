import {useEffect, useRef} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { EditorOutputFormat } from '../../types';
import { $generateHtmlFromNodes } from '@lexical/html';
import { compressLexicalJSON } from '../../utils/serializers';
import { $convertToMarkdownString } from '@lexical/markdown';
import { PLAYGROUND_TRANSFORMERS } from './extended/MarkdownTransformers';

interface OnChangePluginProps {
  onChange?: (val: string, format: EditorOutputFormat) => void;
  outputFormat?: EditorOutputFormat;
}

export function OnChangePlugin({ onChange, outputFormat = 'json' }: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  const timeoutRef = useRef<number | null>(null);
  const DEBOUNCE_MS = 300;

  useEffect(() => {
    if (!onChange) return;
    const unregister = editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        if (outputFormat === 'json') {
          editor.getEditorState().read(() => {
            const rawJson = editor.getEditorState().toJSON();
            const compressed = compressLexicalJSON(rawJson);
            onChange(JSON.stringify(compressed), 'json');
          });
        } else if (outputFormat === 'markdown') {
          editor.getEditorState().read(() => {
            const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
            onChange(markdown, 'markdown');
          });
        } else {
          editor.getEditorState().read(() => {
            const html = $generateHtmlFromNodes(editor, null);
            onChange(html, 'html');
          });
        }
      }, DEBOUNCE_MS) as unknown as number;
    });

    return () => {
      unregister();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [editor, onChange, outputFormat]);

  return null;
}
