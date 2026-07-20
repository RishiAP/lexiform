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
  initialInline?: boolean;
  hideInlineToggle?: boolean;
  onConfirm: (equation: string, inline: boolean) => void;
};

export default function KatexEquationAlterer({
  onConfirm,
  initialEquation = '',
  initialInline = true,
  hideInlineToggle = false,
}: Props): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(initialInline);
  const mathRef=React.useRef<MathfieldElement>(null);

  const onClick = useCallback(() => {
    onConfirm(equation.replaceAll("\\exponentialE","e"), inline);
  }, [onConfirm, equation, inline]);

  const onCheckboxChange = useCallback(() => {
    setInline(!inline);
  }, [setInline, inline]);



  React.useEffect(() => {
    const mf = mathRef.current;
    if (!mf) return;

    // FIX: MathLive's menu toggle opens on `pointerdown` and creates a Scrim overlay.
    // On mobile, the browser fires synthetic `mousedown`, `mouseup`, and `click` 
    // events shortly after the touch.
    // 1. The synthetic `mousedown` steals focus, causing the menu to instantly close
    //    itself via `focusout` (which is why you previously had to "hold" to bypass it).
    // 2. The synthetic `click` hits the Scrim, causing MathLive to instantly close it.
    // Solution: Suppress all synthetic mouse events for 400ms following a touch on 
    // any MathLive menu component.

    let suppressClickUntil = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;

      const path = e.composedPath() as HTMLElement[];
      const hitsScrim = path.some(el =>
        el instanceof HTMLElement && 
        el.getAttribute?.('role') === 'presentation' &&
        el.style?.position === 'fixed'
      );
      
      const isMenuToggle = path.some(el => 
        el instanceof HTMLElement && (
          el.getAttribute?.('part') === 'menu-toggle' ||
          el.classList?.contains?.('ML__menu-toggle')
        )
      );

      // Only suppress synthetic mouse events when tapping the toggle to OPEN the menu.
      // If the user taps the Scrim to close the menu, hitsScrim is true. We MUST NOT
      // suppress the ghost click in that case, because MathLive relies on it to close!
      if (isMenuToggle && !hitsScrim) {
        suppressClickUntil = Date.now() + 400;
      }
    };

    const suppressGhostEvents = (e: MouseEvent) => {
      // If we recently touched the menu, aggressively suppress the synthetic mouse
      // events to protect MathLive's focus state and click handlers.
      if (Date.now() < suppressClickUntil) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    // Use capture phase to intercept before MathLive
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('mousedown', suppressGhostEvents, true);
    document.addEventListener('mouseup', suppressGhostEvents, true);
    document.addEventListener('click', suppressGhostEvents, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('mousedown', suppressGhostEvents, true);
      document.removeEventListener('mouseup', suppressGhostEvents, true);
      document.removeEventListener('click', suppressGhostEvents, true);
    };
  }, []);

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
    <div style={{ width: '400px', maxWidth: '100%' }} className="KatexEquationAlterer_dialog">
      {!hideInlineToggle && (
        <div className="KatexEquationAlterer_defaultRow">
          Inline
          <input type="checkbox" checked={inline} onChange={onCheckboxChange} />
        </div>
      )}
      <div className="KatexEquationAlterer_defaultRow">Equation </div>
      <div className="KatexEquationAlterer_centerRow">
        <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
        <math-field 
          ref={mathRef} 
          style={{width:"100%"}} 
          onKeyDown={handleKeyPress} 
          onInput={(e) => setEquation(e.currentTarget.value)}
        >
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
