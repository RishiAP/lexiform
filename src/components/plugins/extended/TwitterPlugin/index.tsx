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

import {$createTweetNode, TweetNode} from '../../../../nodes/extended/TweetNode';
import TextInput from '../../../../legacy/ui/TextInput';
import Button from '../../../../legacy/ui/Button';

export const INSERT_TWEET_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_TWEET_COMMAND',
);

export function InsertTweetDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [url, setUrl] = useState('');

  const onClick = () => {
    const match = url.match(
      /(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/,
    );
    const id = match ? match[3] : null;
    if (id) {
      activeEditor.dispatchCommand(INSERT_TWEET_COMMAND, id);
    }
    onClose();
  };

  return (
    <>
      <TextInput
        label="Tweet URL"
        placeholder="i.e. https://twitter.com/user/status/..."
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

export default function TwitterPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TweetNode])) {
      throw new Error('TwitterPlugin: TweetNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_TWEET_COMMAND,
      (payload) => {
        const tweetNode = $createTweetNode(payload);
        $insertNodeToNearestRoot(tweetNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
