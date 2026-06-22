// @ts-nocheck
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use client";
import type {JSX} from 'react';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import {COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand, LexicalEditor} from 'lexical';
import {useEffect, useState} from 'react';

import {$createFigmaNode, FigmaNode} from '../../../../nodes/extended/FigmaNode';
import TextInput from '../../../../legacy/ui/TextInput';
import Button from '../../../../legacy/ui/Button';

export const INSERT_FIGMA_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_FIGMA_COMMAND',
);

export function InsertFigmaDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [url, setUrl] = useState('');

  const onClick = () => {
    const match = url.match(
      /figma\.com\/file\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/,
    );
    const id = match ? match[1] : null;
    if (id) {
      activeEditor.dispatchCommand(INSERT_FIGMA_COMMAND, id);
    }
    onClose();
  };

  return (
    <>
      <TextInput
        label="Figma URL"
        placeholder="i.e. https://www.figma.com/file/..."
        onChange={setUrl}
        value={url}
      />
      <div className="Lexiform__dialogActions" style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
        <Button disabled={!url} onClick={onClick}>
          Confirm
        </Button>
      </div>
    </>
  );
}

export default function FigmaPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([FigmaNode])) {
      throw new Error('FigmaPlugin: FigmaNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_FIGMA_COMMAND,
      (payload) => {
        const figmaNode = $createFigmaNode(payload);
        $insertNodeToNearestRoot(figmaNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
