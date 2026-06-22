import * as React from 'react';
import {LexicalEditor} from 'lexical';
import {$getSelection, $isRangeSelection} from 'lexical';
import {$patchStyleText} from '@lexical/selection';
import {Check} from 'lucide-react';

import {DropdownMenu, DropdownMenuItem} from '../../ui/DropdownMenu';

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

export function FontFamilyDropdown({
  editor,
  value,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  disabled?: boolean;
}) {
  const handleClick = (option: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-family': option,
        });
      }
    });
  };

  return (
    <DropdownMenu
      disabled={disabled}
      buttonLabel={value}
      buttonClassName="Lexiform__toolbarButton Lexiform__fontFamilyButton"
      title="Font family"
    >
      {FONT_FAMILY_OPTIONS.map(([option, text]) => (
        <DropdownMenuItem
          key={option}
          className={value === option ? 'active' : ''}
          onClick={() => handleClick(option)}
        >
          <span className="Lexiform__dropdownText" style={{ fontFamily: option }}>
            {text}
          </span>
          {value === option && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
