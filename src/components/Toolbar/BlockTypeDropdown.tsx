import * as React from 'react';
import {LexicalEditor} from 'lexical';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  CodeXml,
  Pilcrow,
  Check
} from 'lucide-react';

import {blockTypeToBlockName} from '../../contexts/ToolbarContext';
import {DropdownMenu, DropdownMenuItem} from '../../ui/DropdownMenu';
import {
  formatParagraph,
  formatHeading,
  formatBulletList,
  formatNumberedList,
  formatCheckList,
  formatQuote,
  formatCode,
} from './toolbarUtils';

export function BlockTypeDropdown({
  editor,
  blockType,
  disabled = false,
}: {
  editor: LexicalEditor;
  blockType: keyof typeof blockTypeToBlockName;
  disabled?: boolean;
}) {
  const formatBlock = (type: string) => {
    switch (type) {
      case 'paragraph':
        formatParagraph(editor);
        break;
      case 'h1':
        formatHeading(editor, blockType, 'h1');
        break;
      case 'h2':
        formatHeading(editor, blockType, 'h2');
        break;
      case 'h3':
        formatHeading(editor, blockType, 'h3');
        break;
      case 'bullet':
        formatBulletList(editor, blockType);
        break;
      case 'number':
        formatNumberedList(editor, blockType);
        break;
      case 'check':
        formatCheckList(editor, blockType);
        break;
      case 'quote':
        formatQuote(editor, blockType);
        break;
      case 'code':
        formatCode(editor, blockType);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'paragraph':
        return <Pilcrow size={16} />;
      case 'h1':
        return <Heading1 size={16} />;
      case 'h2':
        return <Heading2 size={16} />;
      case 'h3':
        return <Heading3 size={16} />;
      case 'bullet':
        return <List size={16} />;
      case 'number':
        return <ListOrdered size={16} />;
      case 'check':
        return <ListChecks size={16} />;
      case 'quote':
        return <Quote size={16} />;
      case 'code':
        return <CodeXml size={16} />;
      default:
        return <Pilcrow size={16} />;
    }
  };

  return (
    <DropdownMenu
      disabled={disabled}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonIcon={getIcon(blockType)}
      buttonClassName="Lexiform__toolbarButton Lexiform__blockTypeButton"
      title="Formatting options"
    >
      <DropdownMenuItem
        className={blockType === 'paragraph' ? 'active' : ''}
        onClick={() => formatBlock('paragraph')}
      >
        <span className="Lexiform__dropdownIcon"><Pilcrow size={16} /></span>
        <span className="Lexiform__dropdownText">Normal</span>
        {blockType === 'paragraph' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'h1' ? 'active' : ''}
        onClick={() => formatBlock('h1')}
      >
        <span className="Lexiform__dropdownIcon"><Heading1 size={16} /></span>
        <span className="Lexiform__dropdownText">Heading 1</span>
        {blockType === 'h1' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'h2' ? 'active' : ''}
        onClick={() => formatBlock('h2')}
      >
        <span className="Lexiform__dropdownIcon"><Heading2 size={16} /></span>
        <span className="Lexiform__dropdownText">Heading 2</span>
        {blockType === 'h2' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'h3' ? 'active' : ''}
        onClick={() => formatBlock('h3')}
      >
        <span className="Lexiform__dropdownIcon"><Heading3 size={16} /></span>
        <span className="Lexiform__dropdownText">Heading 3</span>
        {blockType === 'h3' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'bullet' ? 'active' : ''}
        onClick={() => formatBlock('bullet')}
      >
        <span className="Lexiform__dropdownIcon"><List size={16} /></span>
        <span className="Lexiform__dropdownText">Bullet List</span>
        {blockType === 'bullet' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'number' ? 'active' : ''}
        onClick={() => formatBlock('number')}
      >
        <span className="Lexiform__dropdownIcon"><ListOrdered size={16} /></span>
        <span className="Lexiform__dropdownText">Numbered List</span>
        {blockType === 'number' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'check' ? 'active' : ''}
        onClick={() => formatBlock('check')}
      >
        <span className="Lexiform__dropdownIcon"><ListChecks size={16} /></span>
        <span className="Lexiform__dropdownText">Check List</span>
        {blockType === 'check' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'quote' ? 'active' : ''}
        onClick={() => formatBlock('quote')}
      >
        <span className="Lexiform__dropdownIcon"><Quote size={16} /></span>
        <span className="Lexiform__dropdownText">Quote</span>
        {blockType === 'quote' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className={blockType === 'code' ? 'active' : ''}
        onClick={() => formatBlock('code')}
      >
        <span className="Lexiform__dropdownIcon"><CodeXml size={16} /></span>
        <span className="Lexiform__dropdownText">Code Block</span>
        {blockType === 'code' && <span className="Lexiform__dropdownCheck"><Check size={16} /></span>}
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
