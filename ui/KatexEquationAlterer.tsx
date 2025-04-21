/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use client";
import type {JSX} from 'react';

import './KatexEquationAlterer.css';
import "mathlive";

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import * as React from 'react';
import {useCallback, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import Button from '../ui/Button';
import { MathfieldElement } from 'mathlive';

type Props = {
  initialEquation?: string;
  onConfirm: (equation: string, inline: boolean) => void;
};

export default function KatexEquationAlterer({
  onConfirm,
  initialEquation = '',
}: Props): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(true);
  const mathRef=React.useRef<MathfieldElement>(null);

  const onClick = useCallback(() => {
    onConfirm(equation.replaceAll("\\exponentialE","e"), inline);
  }, [onConfirm, equation, inline]);

  const onCheckboxChange = useCallback(() => {
    setInline(!inline);
  }, [setInline, inline]);

  const handleKeyPress:React.KeyboardEventHandler=(e)=>{
      if(e.key==='Enter'){
        // Prevents the default behavior of inserting a new line
        e.preventDefault();
        // Hide the virtual keyboard if it is open
        // and call the onClick function
        // This is a workaround for the fact that Mathlive does not
        // provide a way to hide the virtual keyboard programmatically
        mathRef.current?.executeCommand('hideVirtualKeyboard');
        setTimeout(() => {
          onClick();
        },100);
      }
  }

  return (
    <div style={{width:"400px",maxWidth:"calc(100vw - 54px)"}} className="KatexEquationAlterer_dialog">
      <div className="KatexEquationAlterer_defaultRow">
        Inline
        <input type="checkbox" checked={inline} onChange={onCheckboxChange} />
      </div>
      <div className="KatexEquationAlterer_defaultRow">Equation </div>
      <div className="KatexEquationAlterer_centerRow">
        <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
        <math-field ref={mathRef} style={{width:"100%"}} onKeyDown={handleKeyPress} onInput={(e) => setEquation(e.currentTarget.value)}>
          {equation}
        </math-field>
        </ErrorBoundary>
      </div>
      <div className="KatexEquationAlterer_dialogActions">
        <Button onClick={onClick}>Confirm</Button>
      </div>
    </div>
  );
}
