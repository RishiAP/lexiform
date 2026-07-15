import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$isListItemNode, $isListNode} from '@lexical/list';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  $createParagraphNode,
} from 'lexical';
import {useEffect} from 'react';

export function ListBackspaceFixPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const anchor = selection.anchor;
          if (anchor.offset === 0) {
            let node = anchor.getNode();
            let listItem = $isListItemNode(node) ? node : node.getParent();
            
            if (!listItem && node.getParent()?.getParent && $isListItemNode(node.getParent()?.getParent())) {
               listItem = node.getParent()?.getParent() ?? null;
            }

            if ($isListItemNode(listItem)) {
              const parent = listItem.getParent();
              const isNested = $isListNode(parent) && $isListItemNode(parent.getParent());
              
              if (isNested) {
                // Nested lists can just be outdented normally
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
              } else {
                // Root level lists: split the list correctly instead of jumping to the top
                editor.update(() => {
                  const paragraph = $createParagraphNode();
                  // Move children to the new paragraph to preserve text
                  const children = listItem.getChildren();
                  children.forEach(child => paragraph.append(child));
                  
                  // replace() on ListItemNode handles splitting the list properly
                  listItem.replace(paragraph);
                  paragraph.selectStart();
                });
              }
              event.preventDefault();
              return true;
            }
          }
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return null;
}
