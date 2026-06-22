import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  getDOMSelection,
} from 'lexical';
import {
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link as LinkIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  CaseUpper,
  CaseLower,
  CaseSensitive
} from 'lucide-react';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';

import {setFloatingElemPosition} from '../../utils/setFloatingElemPosition';
import {getDOMRangeRect} from '../../utils/getDOMRangeRect';

function FloatingTextFormatToolbar({
  editor,
  anchorElem,
  isText,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  isLowercase,
  isUppercase,
  isCapitalize,
  isCode,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isText: boolean;
  isLink: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isLowercase: boolean;
  isUppercase: boolean;
  isCapitalize: boolean;
  isCode: boolean;
}) {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem,
        isLink,
      );
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateTextFormatFloatingToolbar]);

  if (!isText) {
    return null;
  }

  return (
    <div ref={popupCharStylesEditorRef} className="Lexiform__floatingTextFormatToolbar">
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`Lexiform__floatingToolbarButton ${isBold ? 'active' : ''}`}
        title="Bold (Ctrl+B)"
        aria-label="Format text as bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={`Lexiform__floatingToolbarButton ${isItalic ? 'active' : ''}`}
        title="Italic (Ctrl+I)"
        aria-label="Format text as italics"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`Lexiform__floatingToolbarButton ${isUnderline ? 'active' : ''}`}
        title="Underline (Ctrl+U)"
        aria-label="Format text to underlined"
      >
        <Underline size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={`Lexiform__floatingToolbarButton ${isStrikethrough ? 'active' : ''}`}
        title="Strikethrough"
        aria-label="Format text with a strikethrough"
      >
        <Strikethrough size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        className={`Lexiform__floatingToolbarButton ${isSubscript ? 'active' : ''}`}
        title="Subscript"
        aria-label="Format text as subscript"
      >
        <SubscriptIcon size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        className={`Lexiform__floatingToolbarButton ${isSuperscript ? 'active' : ''}`}
        title="Superscript"
        aria-label="Format text as superscript"
      >
        <SuperscriptIcon size={16} />
      </button>
      <div className="Lexiform__floatingToolbarDivider" />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase');
        }}
        className={`Lexiform__floatingToolbarButton ${isLowercase ? 'active' : ''}`}
        title="Lowercase"
        aria-label="Format text as lowercase"
      >
        <CaseLower size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase');
        }}
        className={`Lexiform__floatingToolbarButton ${isUppercase ? 'active' : ''}`}
        title="Uppercase"
        aria-label="Format text as uppercase"
      >
        <CaseUpper size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize');
        }}
        className={`Lexiform__floatingToolbarButton ${isCapitalize ? 'active' : ''}`}
        title="Capitalize"
        aria-label="Format text as capitalize"
      >
        <CaseSensitive size={16} />
      </button>
      <div className="Lexiform__floatingToolbarDivider" />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
        className={`Lexiform__floatingToolbarButton ${isCode ? 'active' : ''}`}
        title="Insert code block"
        aria-label="Insert code block"
      >
        <Code size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          }
        }}
        className={`Lexiform__floatingToolbarButton ${isLink ? 'active' : ''}`}
        title="Insert link"
        aria-label="Insert link"
      >
        <LinkIcon size={16} />
      </button>
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
) {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isCapitalize, setIsCapitalize] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          selection.isCollapsed() ||
          nativeSelection.isCollapsed)
      ) {
        setIsText(false);
        return;
      }

      const node = selection?.getNodes()[0];
      const parent = node?.getParent();
      const isLinkNode = $isLinkNode(parent) || $isLinkNode(node);

      if (selection !== null && $isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
        setIsSubscript(selection.hasFormat('subscript'));
        setIsSuperscript(selection.hasFormat('superscript'));
        setIsLowercase(selection.hasFormat('lowercase'));
        setIsUppercase(selection.hasFormat('uppercase'));
        setIsCapitalize(selection.hasFormat('capitalize'));
        setIsCode(selection.hasFormat('code'));
      }

      if (node !== null && $isTextNode(node)) {
        setIsText(true);
      } else {
        setIsText(false);
      }
      setIsLink(isLinkNode);
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <FloatingTextFormatToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isUnderline={isUnderline}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isLowercase={isLowercase}
      isUppercase={isUppercase}
      isCapitalize={isCapitalize}
      isCode={isCode}
      isText={isText}
    />,
    anchorElem,
  );
}

export function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}) {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem);
}
