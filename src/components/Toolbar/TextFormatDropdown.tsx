import * as React from 'react';
import {LexicalEditor, FORMAT_TEXT_COMMAND} from 'lexical';
import {
  Type,
  Strikethrough,
  Subscript,
  Superscript,
  RemoveFormatting,
  Check,
} from 'lucide-react';

import {DropdownMenu, DropdownMenuItem} from '../../ui/DropdownMenu';
import {clearFormatting} from './toolbarUtils';

export function TextFormatDropdown({
  editor,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  disabled = false,
}: {
  editor: LexicalEditor;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  disabled?: boolean;
}) {
  return (
    <DropdownMenu
      disabled={disabled}
      buttonIcon={<Type size={16} />}
      buttonClassName="Lexiform__toolbarButton"
      title="Formatting options"
    >
      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={isStrikethrough ? 'active' : ''}
        title="Strikethrough"
      >
        <span className="Lexiform__dropdownIcon"><Strikethrough size={16} /></span>
        <span className="Lexiform__dropdownText">Strikethrough</span>
        {isStrikethrough && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        className={isSubscript ? 'active' : ''}
        title="Subscript"
      >
        <span className="Lexiform__dropdownIcon"><Subscript size={16} /></span>
        <span className="Lexiform__dropdownText">Subscript</span>
        {isSubscript && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        className={isSuperscript ? 'active' : ''}
        title="Superscript"
      >
        <span className="Lexiform__dropdownIcon"><Superscript size={16} /></span>
        <span className="Lexiform__dropdownText">Superscript</span>
        {isSuperscript && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        onClick={() => {
          clearFormatting(editor);
        }}
        title="Clear text formatting"
      >
        <span className="Lexiform__dropdownIcon"><RemoveFormatting size={16} /></span>
        <span className="Lexiform__dropdownText">Clear Formatting</span>
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
