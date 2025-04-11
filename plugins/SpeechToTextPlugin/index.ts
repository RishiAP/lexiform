/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use client";
import type {LexicalCommand, LexicalEditor, RangeSelection} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {useEffect, useRef, useState} from 'react';

import useReport from '../../hooks/useReport';

export const SPEECH_TO_TEXT_COMMAND: LexicalCommand<boolean> = createCommand(
  'SPEECH_TO_TEXT_COMMAND',
);

const VOICE_COMMANDS: Readonly<
  Record<
    string,
    (arg0: {editor: LexicalEditor; selection: RangeSelection}) => void
  >
> = {
  '\n': ({selection}) => {
    selection.insertParagraph();
  },
  redo: ({editor}) => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  },
  undo: ({editor}) => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  },
};

export default function SpeechToTextPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const recognition = useRef<any>(null);
  const report = useReport();

  useEffect(() => {
    // Define SpeechRecognition inside useEffect
    const SpeechRecognition = 
      // @ts-expect-error missing type
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (isEnabled && recognition.current === null && SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.addEventListener(
        'result',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (event: any) => {
          const resultItem = event.results.item(event.resultIndex);
          const {transcript} = resultItem.item(0);
          report(transcript);

          if (!resultItem.isFinal) {
            return;
          }

          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              const command = VOICE_COMMANDS[transcript.toLowerCase().trim()];

              if (command) {
                command({
                  editor,
                  selection,
                });
              } else if (transcript.match(/\s*\n\s*/)) {
                selection.insertParagraph();
              } else {
                selection.insertText(transcript);
              }
            }
          });
        },
      );
    }

    if (recognition.current) {
      if (isEnabled) {
        recognition.current.start();
      } else {
        recognition.current.stop();
      }
    }

    return () => {
      if (recognition.current !== null) {
        recognition.current.stop();
      }
    };
  }, [editor, isEnabled, report]); // Removed SpeechRecognition from deps
  useEffect(() => {
    return editor.registerCommand(
      SPEECH_TO_TEXT_COMMAND,
      (_isEnabled: boolean) => {
        setIsEnabled(_isEnabled);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
