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
import {useEffect, useState, useMemo} from 'react';

import {$createTweetNode, TweetNode} from '../../../../nodes/extended/TweetNode';
import Button from '../../../../legacy/ui/Button';

export const INSERT_TWEET_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_TWEET_COMMAND',
);

const TWEET_REGEX = /(?:twitter\.com|x\.com)\/(?:#!\/)?\w+\/status(?:es)?\/(\d+)/;

function extractTweetId(url: string): string | null {
  const match = url.match(TWEET_REGEX);
  return match ? match[1] : null;
}

export function InsertTweetDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const tweetId = useMemo(() => extractTweetId(url), [url]);
  const isValid = tweetId !== null;
  const showError = touched && url.length > 0 && !isValid;

  const onClick = () => {
    if (tweetId) {
      activeEditor.dispatchCommand(INSERT_TWEET_COMMAND, tweetId);
    }
    onClose();
  };

  return (
    <div style={{ width: '400px', maxWidth: '100%' }}>
      <div className="Input__wrapper">
        <label className="Input__label">Tweet URL</label>
        <input
          className={`Input__input ${showError ? 'Input__input--error' : ''}`}
          placeholder="https://x.com/user/status/123456789"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (!touched) setTouched(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValid) onClick();
          }}
        />
      </div>
      {showError && (
        <p style={{color: 'var(--lexiform-destructive, #ef4444)', fontSize: '12px', margin: '0 0 8px 0'}}>
          Please enter a valid Tweet URL (e.g. https://x.com/user/status/...)
        </p>
      )}
      <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
        <Button onClick={onClose} small>Cancel</Button>
        <Button disabled={!isValid} onClick={onClick}>Confirm</Button>
      </div>
    </div>
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
