import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isParagraphNode, $createParagraphNode } from 'lexical';
import { useEffect } from 'react';

export function AlwaysAppendParagraphPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const lastChild = root.getLastChild();
        
        if (lastChild !== null && !$isParagraphNode(lastChild)) {
          editor.update(() => {
            const currentRoot = $getRoot();
            const currentLastChild = currentRoot.getLastChild();
            if (currentLastChild !== null && !$isParagraphNode(currentLastChild)) {
              currentRoot.append($createParagraphNode());
            }
          });
        }
      });
    });
  }, [editor]);

  return null;
}
