import type {JSX} from 'react';

import {
  $isCodeNode,
} from '@lexical/code';
import {
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code-prism';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, ListNode} from '@lexical/list';
import {$isHeadingNode} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from '@lexical/selection';
import {$isTableNode, $isTableSelection} from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  IS_APPLE,
  mergeRegister,
} from '@lexical/utils';
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {Dispatch, useCallback, useEffect, useState} from 'react';
import * as React from 'react';

import {
  Bold,
  Italic,
  Underline,
  Undo,
  Redo,
  Link,
  CodeXml,
  Smile
} from 'lucide-react';

import {
  blockTypeToBlockName,
  useToolbarState,
} from '../../contexts/ToolbarContext';
import {getSelectedNode} from '../../utils/getSelectedNode';
import {sanitizeUrl} from '../../utils/url';
import {FontSize} from './FontSize';
import {BlockTypeDropdown} from './BlockTypeDropdown';
import {FontFamilyDropdown} from './FontFamilyDropdown';
import {AlignmentControls} from './AlignmentControls';
import {InsertControls} from './InsertControls';
import {TextFormatDropdown} from './TextFormatDropdown';
import {ColorPicker} from '../../ui/ColorPicker';
import {DropdownMenu, DropdownMenuItem} from '../../ui/DropdownMenu';
import useModal from '../../legacy/hooks/useModal';
import {InsertEmojiDialog} from '../plugins/extended/EmojiPickerPlugin/InsertEmojiDialog';

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];
  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }
  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function Divider(): JSX.Element {
  return <div className="Lexiform__toolbarDivider" />;
}

export function ToolbarPlugin({
  editor,
  activeEditor,
  setActiveEditor,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  activeEditor: LexicalEditor;
  setActiveEditor: Dispatch<LexicalEditor>;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const {toolbarState, updateToolbarState} = useToolbarState();
  const [modal, showModal] = useModal();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        updateToolbarState(
          'isImageCaption',
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container',
          ),
        );
      } else {
        updateToolbarState('isImageCaption', false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      updateToolbarState('isRTL', $isParentElementRTL(selection));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);
      updateToolbarState('isLink', isLink);

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        updateToolbarState('rootType', 'table');
      } else {
        updateToolbarState('rootType', 'root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState('blockType', type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            updateToolbarState(
              'blockType',
              type as keyof typeof blockTypeToBlockName,
            );
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            updateToolbarState(
              'codeLanguage',
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      
      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      updateToolbarState(
        'bgColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      updateToolbarState(
        'fontFamily',
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      updateToolbarState(
        'elementFormat',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      updateToolbarState('isBold', selection.hasFormat('bold'));
      updateToolbarState('isItalic', selection.hasFormat('italic'));
      updateToolbarState('isUnderline', selection.hasFormat('underline'));
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough'),
      );
      updateToolbarState('isSubscript', selection.hasFormat('subscript'));
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
      updateToolbarState('isHighlight', selection.hasFormat('highlight'));
      updateToolbarState('isCode', selection.hasFormat('code'));
      updateToolbarState(
        'fontSize',
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
      updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
      updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
      updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
    }
  }, [activeEditor, editor, updateToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
          // Ensure we run toolbar reads inside the editor read context so
          // `$` helpers (eg. $getSelection, $getEditor) find the active editor.
          newEditor.getEditorState().read(() => {
            $updateToolbar();
          }, { editor: newEditor });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar, setActiveEditor]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    }, { editor: activeEditor });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        }, { editor: activeEditor });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState('canUndo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState('canRedo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor, updateToolbarState]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? {tag: 'historic'} : {},
      );
    },
    [activeEditor],
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({color: value});
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({'background-color': value});
    },
    [applyStyleText],
  );

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  return (
    <div className="Lexiform__toolbar">
      <button
        disabled={!toolbarState.canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type="button"
        className="Lexiform__toolbarButton"
        aria-label="Undo">
        <Undo size={16} />
      </button>
      <button
        disabled={!toolbarState.canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
        type="button"
        className="Lexiform__toolbarButton"
        aria-label="Redo">
        <Redo size={16} />
      </button>
      
      <Divider />
      
      {toolbarState.blockType in blockTypeToBlockName &&
        activeEditor === editor && (
          <>
            <BlockTypeDropdown
              disabled={!isEditable}
              blockType={toolbarState.blockType}
              editor={activeEditor}
            />
            <Divider />
          </>
        )}
        
      {toolbarState.blockType === 'code' ? (
        <DropdownMenu
          disabled={!isEditable}
          buttonClassName="Lexiform__toolbarButton Lexiform__codeLanguageButton"
          buttonLabel={getLanguageFriendlyName(toolbarState.codeLanguage)}
          title="Select language"
        >
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => (
            <DropdownMenuItem
              className={value === toolbarState.codeLanguage ? 'active' : ''}
              onClick={() => onCodeLanguageSelect(value)}
              key={value}
            >
              <span className="Lexiform__dropdownText">{name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      ) : (
        <>
          <FontFamilyDropdown
            disabled={!isEditable}
            value={toolbarState.fontFamily}
            editor={activeEditor}
          />
          <Divider />
          <FontSize
            selectionFontSize={toolbarState.fontSize.slice(0, -2)}
            editor={activeEditor}
            disabled={!isEditable}
          />
          <Divider />
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            className={`Lexiform__toolbarButton ${toolbarState.isBold ? 'active' : ''}`}
            title="Bold"
            type="button"
            aria-label="Format text as bold">
            <Bold size={16} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            className={`Lexiform__toolbarButton ${toolbarState.isItalic ? 'active' : ''}`}
            title="Italic"
            type="button"
            aria-label="Format text as italics">
            <Italic size={16} />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            className={`Lexiform__toolbarButton ${toolbarState.isUnderline ? 'active' : ''}`}
            title="Underline"
            type="button"
            aria-label="Format text to underlined">
            <Underline size={16} />
          </button>
          {!toolbarState.isImageCaption && (
            <button
              disabled={!isEditable}
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
              className={`Lexiform__toolbarButton ${toolbarState.isCode ? 'active' : ''}`}
              title="Insert code block"
              type="button"
              aria-label="Insert code block">
              <CodeXml size={16} />
            </button>
          )}
          <button
            disabled={!isEditable}
            onClick={insertLink}
            className={`Lexiform__toolbarButton ${toolbarState.isLink ? 'active' : ''}`}
            aria-label="Insert link"
            title="Insert link"
            type="button">
            <Link size={16} />
          </button>

          <ColorPicker
            disabled={!isEditable}
            color={toolbarState.fontColor}
            onChange={onFontColorSelect}
            title="Text color"
          >
            <button className="Lexiform__toolbarButton" aria-label="Text color" title="Text color">
              <div className="Lexiform__colorIndicator" style={{ backgroundColor: toolbarState.fontColor }}>
                <span className="Lexiform__colorLetter">A</span>
              </div>
            </button>
          </ColorPicker>

          <ColorPicker
            disabled={!isEditable}
            color={toolbarState.bgColor}
            onChange={onBgColorSelect}
            title="Background color"
          >
            <button className="Lexiform__toolbarButton" aria-label="Background color" title="Background color">
              <div className="Lexiform__colorIndicator" style={{ backgroundColor: toolbarState.bgColor, border: '1px solid #ccc' }}>
                <span className="Lexiform__colorLetter">bg</span>
              </div>
            </button>
          </ColorPicker>

          <TextFormatDropdown 
            disabled={!isEditable}
            editor={activeEditor}
            isStrikethrough={toolbarState.isStrikethrough}
            isSubscript={toolbarState.isSubscript}
            isSuperscript={toolbarState.isSuperscript}
          />
          <Divider />
          <DropdownMenu
            disabled={!isEditable}
            buttonIcon={<Smile size={16} />}
            buttonClassName="Lexiform__toolbarButton"
            title="Insert Emoji"
          >
            <div style={{ width: '320px', padding: '8px' }}>
              <InsertEmojiDialog activeEditor={activeEditor} onClose={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
              }} />
            </div>
          </DropdownMenu>
          <Divider />
          <InsertControls 
            disabled={!isEditable}
            editor={activeEditor}
          />
        </>
      )}
      <Divider />
      <AlignmentControls
        disabled={!isEditable}
        value={toolbarState.elementFormat}
        editor={activeEditor}
        isRTL={toolbarState.isRTL}
      />
      {modal}
    </div>
  );
}
