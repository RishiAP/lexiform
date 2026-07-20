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
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import {
  $getNodeByKey,
  NodeKey,
} from 'lexical';
import * as React from 'react';
import {useCallback, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import KatexRenderer from '../../legacy/ui/KatexRenderer';
import KatexEquationAlterer from '../../legacy/ui/KatexEquationAlterer';
import {$isEquationNode} from './EquationNode';
import { Dialog } from '../../ui/Dialog';

import './EquationComponent.css';

type EquationComponentProps = {
  equation: string;
  inline: boolean;
  nodeKey: NodeKey;
};

export default function EquationComponent({
  equation,
  inline,
  nodeKey,
}: EquationComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [showEditor, setShowEditor] = useState<boolean>(false);

  const onConfirm = useCallback(
    (newEquation: string, _inline: boolean) => {
      setShowEditor(false);
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isEquationNode(node)) {
          node.setEquation(newEquation);
          node.selectNext(0, 0);
        }
      });
    },
    [editor, nodeKey],
  );

  return (
    <>
      {showEditor && isEditable && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setShowEditor(false);
          }}
          title="Edit Equation"
          onFocusOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target?.closest?.('math-virtual-keyboard') || target?.closest?.('[class*="ML__"]') || target?.closest?.('[mathlive]') || target?.closest?.('.ui-menu-container') || target?.closest?.('.ui-menu') || target?.getAttribute?.('role') === 'presentation') {
              e.preventDefault();
            }
          }}
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target?.closest?.('math-virtual-keyboard') || target?.closest?.('[class*="ML__"]') || target?.closest?.('[mathlive]') || target?.closest?.('.ui-menu-container') || target?.closest?.('.ui-menu') || target?.getAttribute?.('role') === 'presentation') {
              e.preventDefault();
            }
          }}
        >
          <KatexEquationAlterer
            initialEquation={equation}
            initialInline={inline}
            hideInlineToggle={true}
            onConfirm={onConfirm}
          />
        </Dialog>
      )}
      <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
        <span
          className={`EquationComponent__container ${
            !inline ? 'EquationComponent__container--block' : ''
          }`}
        >
          <KatexRenderer
            equation={equation}
            inline={inline}
            onDoubleClick={() => {
              if (isEditable) {
                setShowEditor(true);
              }
            }}
          />
          {isEditable && (
            <span className="EquationComponent__editHint">
              {inline ? 'double-click to edit' : 'double-click to edit'}
            </span>
          )}
        </span>
      </ErrorBoundary>
    </>
  );
}
