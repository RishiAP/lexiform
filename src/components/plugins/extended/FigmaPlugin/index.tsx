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

import {$createFigmaNode, FigmaNode} from '../../../../nodes/extended/FigmaNode';
import Button from '../../../../legacy/ui/Button';

export const INSERT_FIGMA_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_FIGMA_COMMAND',
);

const FIGMA_REGEX = /figma\.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/;

function extractFigmaId(url: string): string | null {
  const match = url.match(FIGMA_REGEX);
  return match ? match[2] : null;
}

export function InsertFigmaDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const figmaId = useMemo(() => extractFigmaId(url), [url]);
  const isValid = figmaId !== null;
  const showError = touched && url.length > 0 && !isValid;

  const onClick = () => {
    if (figmaId) {
      activeEditor.dispatchCommand(INSERT_FIGMA_COMMAND, figmaId);
    }
    onClose();
  };

  return (
    <div style={{ minWidth: '400px', maxWidth: '100%' }}>
      <div className="Input__wrapper">
        <label className="Input__label">Figma URL</label>
        <input
          className={`Input__input ${showError ? 'Input__input--error' : ''}`}
          placeholder="https://www.figma.com/file/..."
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
          Please enter a valid Figma URL (e.g. https://figma.com/file/...)
        </p>
      )}
      <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
        <Button onClick={onClose} small>Cancel</Button>
        <Button disabled={!isValid} onClick={onClick}>Confirm</Button>
      </div>
    </div>
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
