// @ts-nocheck
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use client";
import {useMemo, useRef} from 'react';

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options?: { maxWait?: number }
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let maxWaitTimeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const context = this;

    const invoke = () => {
      timeoutId = undefined;
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = undefined;
      func.apply(context, args);
    };

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(invoke, wait);

    if (options?.maxWait && maxWaitTimeoutId === undefined) {
      maxWaitTimeoutId = setTimeout(invoke, options.maxWait);
    }
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxWaitTimeoutId !== undefined) {
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = undefined;
    }
  };

  return debounced;
}

export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
) {
  const funcRef = useRef<T | null>(null);
  funcRef.current = fn;

  return useMemo(
    () =>
      debounce(
        (...args: Parameters<T>) => {
          if (funcRef.current) {
            funcRef.current(...args);
          }
        },
        ms,
        {maxWait},
      ),
    [ms, maxWait],
  );
}
