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

import {$createYouTubeNode, YouTubeNode} from '../../../../nodes/extended/YouTubeNode';
import TextInput from '../../../../legacy/ui/TextInput';
import Button from '../../../../legacy/ui/Button';

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_YOUTUBE_COMMAND',
);

export function InsertYouTubeDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [url, setUrl] = useState('');

  const onClick = () => {
    const match = url.match(
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
    );
    const id = match ? (match[2].length === 11 ? match[2] : null) : null;
    if (id) {
      activeEditor.dispatchCommand(INSERT_YOUTUBE_COMMAND, id);
    }
    onClose();
  };

  return (
    <>
      <TextInput
        label="YouTube URL"
        placeholder="i.e. https://www.youtube.com/watch?v=..."
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

export default function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
