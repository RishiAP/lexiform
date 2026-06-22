import * as React from 'react';
import {LexicalEditor, ElementFormatType, FORMAT_ELEMENT_COMMAND} from 'lexical';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  IndentIncrease,
  IndentDecrease,
  Check,
} from 'lucide-react';
import {INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND} from 'lexical';

import {DropdownMenu, DropdownMenuItem, DropdownMenuSeparator} from '../../ui/DropdownMenu';

export function AlignmentControls({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled?: boolean;
}) {
  const getIcon = (format: ElementFormatType) => {
    switch (format) {
      case 'left':
        return <AlignLeft size={16} />;
      case 'center':
        return <AlignCenter size={16} />;
      case 'right':
        return <AlignRight size={16} />;
      case 'justify':
        return <AlignJustify size={16} />;
      default:
        return <AlignLeft size={16} />;
    }
  };

  const getLabel = (format: ElementFormatType) => {
    switch (format) {
      case 'left':
        return 'Left Align';
      case 'center':
        return 'Center Align';
      case 'right':
        return 'Right Align';
      case 'justify':
        return 'Justify Align';
      default:
        return 'Left Align';
    }
  };

  return (
    <DropdownMenu
      disabled={disabled}
      buttonIcon={getIcon(value)}
      buttonLabel={getLabel(value)}
      buttonClassName="Lexiform__toolbarButton"
      title="Alignment options"
    >
      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={value === 'left' ? 'active' : ''}
      >
        <span className="Lexiform__dropdownIcon"><AlignLeft size={16} /></span>
        <span className="Lexiform__dropdownText">Left Align</span>
        {value === 'left' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={value === 'center' ? 'active' : ''}
      >
        <span className="Lexiform__dropdownIcon"><AlignCenter size={16} /></span>
        <span className="Lexiform__dropdownText">Center Align</span>
        {value === 'center' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={value === 'right' ? 'active' : ''}
      >
        <span className="Lexiform__dropdownIcon"><AlignRight size={16} /></span>
        <span className="Lexiform__dropdownText">Right Align</span>
        {value === 'right' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className={value === 'justify' ? 'active' : ''}
      >
        <span className="Lexiform__dropdownIcon"><AlignJustify size={16} /></span>
        <span className="Lexiform__dropdownText">Justify Align</span>
        {value === 'justify' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
      >
        <span className="Lexiform__dropdownIcon">
          {isRTL ? <IndentIncrease size={16} /> : <IndentDecrease size={16} />}
        </span>
        <span className="Lexiform__dropdownText">Outdent</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
      >
        <span className="Lexiform__dropdownIcon">
          {isRTL ? <IndentDecrease size={16} /> : <IndentIncrease size={16} />}
        </span>
        <span className="Lexiform__dropdownText">Indent</span>
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
