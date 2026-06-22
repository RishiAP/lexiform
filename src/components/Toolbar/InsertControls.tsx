import * as React from 'react';
import {LexicalEditor} from 'lexical';
import {Plus, Minus, Link, Image as ImageIcon, Table as TableIcon, BarChart2, PenTool, Calculator, Columns, ChevronsUpDown, Scissors} from 'lucide-react';
import {FaYoutube, FaXTwitter, FaFigma} from 'react-icons/fa6';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';

import {DropdownMenu, DropdownMenuItem} from '../../ui/DropdownMenu';
import {TOGGLE_LINK_COMMAND} from '@lexical/link';

import useModal from '../../legacy/hooks/useModal';
import {InsertEquationDialog} from '../plugins/extended/EquationsPlugin';
import {INSERT_EXCALIDRAW_COMMAND} from '../plugins/extended/ExcalidrawPlugin';
import {InsertImageDialog} from '../plugins/extended/ImagesPlugin';
import InsertLayoutDialog from '../plugins/extended/LayoutPlugin/InsertLayoutDialog';
import {InsertPollDialog} from '../plugins/extended/PollPlugin';
import {InsertTableDialog} from '../plugins/extended/TablePlugin';
import {INSERT_COLLAPSIBLE_COMMAND} from '../plugins/extended/CollapsiblePlugin';
import {INSERT_PAGE_BREAK} from '../plugins/extended/PageBreakPlugin';
import {InsertYouTubeDialog} from '../plugins/extended/YouTubePlugin';
import {InsertTweetDialog} from '../plugins/extended/TwitterPlugin';
import {InsertFigmaDialog} from '../plugins/extended/FigmaPlugin';

export function InsertControls({
  editor,
  disabled = false,
}: {
  editor: LexicalEditor;
  disabled?: boolean;
}) {
  const [modal, showModal] = useModal();

  return (
    <>
      {modal}
      <DropdownMenu
        disabled={disabled}
        buttonIcon={<Plus size={16} />}
        buttonLabel="Insert"
        buttonClassName="Lexiform__toolbarButton"
        title="Insert"
      >
        <DropdownMenuItem
          onClick={() => {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
          }}
        >
          <span className="Lexiform__dropdownIcon"><Link size={16} /></span>
          <span className="Lexiform__dropdownText">Link</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert Image', (onClose) => (
              <InsertImageDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><ImageIcon size={16} /></span>
          <span className="Lexiform__dropdownText">Image</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert Table', (onClose) => (
              <InsertTableDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><TableIcon size={16} /></span>
          <span className="Lexiform__dropdownText">Table</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert Poll', (onClose) => (
              <InsertPollDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><BarChart2 size={16} /></span>
          <span className="Lexiform__dropdownText">Poll</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
          }}
        >
          <span className="Lexiform__dropdownIcon"><PenTool size={16} /></span>
          <span className="Lexiform__dropdownText">Excalidraw</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert Equation', (onClose) => (
              <InsertEquationDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><Calculator size={16} /></span>
          <span className="Lexiform__dropdownText">Equation</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert Columns Layout', (onClose) => (
              <InsertLayoutDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><Columns size={16} /></span>
          <span className="Lexiform__dropdownText">Columns Layout</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
          }}
        >
          <span className="Lexiform__dropdownIcon"><ChevronsUpDown size={16} /></span>
          <span className="Lexiform__dropdownText">Collapsible</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert YouTube Video', (onClose) => (
              <InsertYouTubeDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><FaYoutube size={16} /></span>
          <span className="Lexiform__dropdownText">YouTube Video</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert Tweet', (onClose) => (
              <InsertTweetDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><FaXTwitter size={16} /></span>
          <span className="Lexiform__dropdownText">Tweet</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            showModal('Insert Figma Document', (onClose) => (
              <InsertFigmaDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <span className="Lexiform__dropdownIcon"><FaFigma size={16} /></span>
          <span className="Lexiform__dropdownText">Figma Document</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
          }}
        >
          <span className="Lexiform__dropdownIcon"><Minus size={16} /></span>
          <span className="Lexiform__dropdownText">Horizontal Rule</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
          }}
        >
          <span className="Lexiform__dropdownIcon"><Scissors size={16} /></span>
          <span className="Lexiform__dropdownText">Page Break</span>
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  );
}
