import '../styles/styles.css';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {AutoLinkPlugin} from '@lexical/react/LexicalAutoLinkPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {TRANSFORMERS} from '@lexical/markdown';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {SharedHistoryContext} from '../contexts/SharedHistoryContext';
import {ToolbarContext} from '../contexts/ToolbarContext';
import {ToolbarPlugin} from './Toolbar/ToolbarPlugin';
import {OnChangePlugin} from './plugins/OnChangePlugin';
import {ControlledValuePlugin} from './plugins/ControlledValuePlugin';
import {FloatingLinkEditorPlugin} from './plugins/FloatingLinkEditorPlugin';
import {FloatingTextFormatToolbarPlugin} from './plugins/FloatingTextFormatToolbarPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import {useState, useCallback, lazy, Suspense} from 'react';

const CodeHighlightPlugin = lazy(() =>
  import('./plugins/CodeHighlightPlugin').then((module) => ({
    default: module.CodeHighlightPlugin,
  })),
);
import EmojiPickerPlugin from './plugins/extended/EmojiPickerPlugin';
import TableActionMenuPlugin from './plugins/extended/TableActionMenuPlugin';
import TableHoverActionsPlugin from './plugins/extended/TableHoverActionsPlugin';
import TableCellResizerPlugin from './plugins/extended/TableCellResizer';
import {LexicalContentEditable} from '../ui/ContentEditable';
import {editorNodes} from '../nodes/EditorNodes';
import theme from '../themes/DefaultTheme';
import {LexicalEditorProps} from '../types';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const MATCHERS = [
  (text: string) => {
    const match = /(?:^|\s)(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))/.exec(
      text,
    );
    if (match !== null) {
      return {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: match[1],
      };
    }
    return null;
  },
];

export function LexicalEditor({
  value,
  onChange,
  outputFormat = 'json',
  placeholder = 'Enter some text...',
  readOnly = false,
  className = '',
  style,
  autoFocus = false,
  nodes,
  plugins,
  codeLanguages,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'LexiformEditor',
    theme,
    nodes: nodes ? [...editorNodes, ...nodes] : editorNodes,
    editable: !readOnly,
    onError: (error: Error) => {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <ToolbarContext>
          <EditorShell
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={className}
            style={style}
            plugins={plugins}
            value={value}
            onChange={onChange}
            outputFormat={outputFormat}
            codeLanguages={codeLanguages}
          />
        </ToolbarContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

/**
 * Inner shell component that has access to LexicalComposerContext.
 * This solves the problem of needing shared state (isLinkEditMode)
 * between the toolbar and the floating link editor.
 */
function EditorShell({
  placeholder,
  autoFocus,
  className,
  style,
  plugins,
  value,
  onChange,
  outputFormat,
  codeLanguages,
}: {
  placeholder: string;
  autoFocus: boolean;
  className: string;
  style?: React.CSSProperties;
  plugins?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  outputFormat: 'json' | 'html' | 'markdown';
  codeLanguages?: Record<string, string>;
}) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = useCallback((_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  }, []);

  return (
    <div className={`Lexiform__editorContainer ${className}`} style={style}>
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
        setIsLinkEditMode={setIsLinkEditMode}
        codeLanguages={codeLanguages}
      />

      <div className="Lexiform__editorInner">
        <RichTextPlugin
          contentEditable={
            <div className="Lexiform__editorScroller">
              <div className="Lexiform__editor" ref={onRef}>
                <LexicalContentEditable placeholder={placeholder} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        {autoFocus && <AutoFocusPlugin />}
        <ListPlugin />
        <CheckListPlugin />
        <TabIndentationPlugin />
        <ClearEditorPlugin />
        <HashtagPlugin />
        <LinkPlugin />
        <AutoLinkPlugin matchers={MATCHERS} />
        <HorizontalRulePlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <Suspense fallback={null}>
          <CodeHighlightPlugin />
        </Suspense>

        {/* Table plugins - injected internally for full table support */}
        <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
        <TableCellResizerPlugin />
        {floatingAnchorElem && (
          <>
            {/* Floating editors that need anchorElem */}
            <FloatingLinkEditorPlugin
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
              anchorElem={floatingAnchorElem}
            />
            <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} setIsLinkEditMode={setIsLinkEditMode} />
            <TableActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
            <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
          </>
        )}

        <EmojiPickerPlugin />
        {plugins}

        {value !== undefined && (
          <ControlledValuePlugin value={value} format={outputFormat} />
        )}
        {onChange && (
          <OnChangePlugin onChange={onChange} outputFormat={outputFormat} />
        )}
      </div>
    </div>
  );
}
