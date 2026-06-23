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

import {$createYouTubeNode, YouTubeNode} from '../../../../nodes/extended/YouTubeNode';
import Button from '../../../../legacy/ui/Button';

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_YOUTUBE_COMMAND',
);

const YOUTUBE_REGEX = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

function extractYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match && match[2].length === 11 ? match[2] : null;
}

export function InsertYouTubeDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const isValid = videoId !== null;
  const showError = touched && url.length > 0 && !isValid;

  const onClick = () => {
    if (videoId) {
      activeEditor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoId);
    }
    onClose();
  };

  return (
    <div style={{ minWidth: '400px', maxWidth: '100%' }}>
      <div className="Input__wrapper">
        <label className="Input__label">YouTube URL</label>
        <input
          className={`Input__input ${showError ? 'Input__input--error' : ''}`}
          placeholder="https://www.youtube.com/watch?v=..."
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
          Please enter a valid YouTube URL (e.g. https://youtube.com/watch?v=...)
        </p>
      )}
      <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
        <Button onClick={onClose} small>Cancel</Button>
        <Button disabled={!isValid} onClick={onClick}>Confirm</Button>
      </div>
    </div>
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
