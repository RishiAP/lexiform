import * as React from 'react';
import { Popover } from 'radix-ui';
import { calculateZoomLevel } from '@lexical/utils';
import { useEffect, useMemo, useRef, useState } from 'react';

const basicColors = [
  '#d0021b', '#f5a623', '#f8e71c', '#8b572a', '#7ed321', '#417505',
  '#bd10e0', '#9013fe', '#4a90e2', '#50e3c2', '#b8e986', '#000000',
  '#4a4a4a', '#9b9b9b', '#ffffff',
];

const WIDTH = 214;
const HEIGHT = 150;

interface Position {
  x: number;
  y: number;
}

// Color conversion utilities
function hex2rgb(hex: string) {
  const normalized = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
  const parts = normalized.replace(/^#/, '').match(/.{2}/g);
  if (!parts || parts.length < 3) {
    return { r: 0, g: 0, b: 0 };
  }
  const [r, g, b] = parts;
  return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
}

function rgb2hsv({ r, g, b }: { r: number, g: number, b: number }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  const h = d ? (max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? 2 + (b - r) / d : 4 + (r - g) / d) * 60 : 0;
  const s = max ? (d / max) * 100 : 0;
  const v = max * 100;
  return { h, s, v };
}

function hsv2rgb({ h, s, v }: { h: number, s: number, v: number }) {
  s /= 100; v /= 100;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  const index = i % 6;
  const r = Math.round([v, q, p, p, t, v][index] * 255);
  const g = Math.round([t, v, v, q, p, p][index] * 255);
  const b = Math.round([p, p, t, v, v, q][index] * 255);
  return { r, g, b };
}

function rgb2hex({ r, g, b }: { r: number, g: number, b: number }) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function transformColor(format: 'hex' | 'hsv', color: any) {
  let hex = '#000000', hsv = { h: 0, s: 0, v: 0 };
  if (format === 'hex') {
    hex = color;
    hsv = rgb2hsv(hex2rgb(hex));
  } else if (format === 'hsv') {
    hsv = color;
    hex = rgb2hex(hsv2rgb(hsv));
  }
  return { hex, hsv };
}

function clamp(value: number, max: number, min: number) {
  return value > max ? max : value < min ? min : value;
}

function MoveWrapper({ className, style, onChange, children }: { className?: string, style?: React.CSSProperties, onChange: (pos: Position) => void, children: React.ReactNode }) {
  const divRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  const move = (e: React.MouseEvent | MouseEvent) => {
    if (divRef.current) {
      const { width, height, left, top } = divRef.current.getBoundingClientRect();
      const zoom = calculateZoomLevel(divRef.current);
      const x = clamp(e.clientX / zoom - left, width, 0);
      const y = clamp(e.clientY / zoom - top, height, 0);
      onChange({ x, y });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    move(e);
    const onMouseMove = (_e: MouseEvent) => {
      _e.preventDefault();
      draggedRef.current = true;
      move(_e);
    };
    const onMouseUp = (_e: MouseEvent) => {
      if (draggedRef.current) {
        const captureClick = (clickEvent: MouseEvent) => {
          clickEvent.stopPropagation();
          document.removeEventListener('click', captureClick, true);
        };
        document.addEventListener('click', captureClick, true);
        setTimeout(() => {
          document.removeEventListener('click', captureClick, true);
        }, 0);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      move(_e);
      draggedRef.current = false;
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div ref={divRef} className={className} style={style} onMouseDown={onMouseDown}>
      {children}
    </div>
  );
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

export function ColorPicker({ color, onChange, children, title, disabled }: ColorPickerProps) {
  const [selfColor, setSelfColor] = useState(() => transformColor('hex', color));
  const [inputColor, setInputColor] = useState(color);

  useEffect(() => {
    const newColor = transformColor('hex', color);
    setSelfColor(newColor);
    setInputColor(color === '' ? '' : newColor.hex);
  }, [color]);

  const onSetHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setInputColor(hex);
    if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      const newColor = transformColor('hex', hex);
      setSelfColor(newColor);
      onChange(newColor.hex);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild disabled={disabled}>
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="Lexiform__popoverContent" 
          sideOffset={5}
          onFocusOutside={(e) => e.preventDefault()}
        >
          {title && <div className="Lexiform__popoverTitle">{title}</div>}
          <div className="Lexiform__colorPickerWrapper" style={{ width: WIDTH }}>
            <div className="Lexiform__colorPickerInputWrapper">
              <label>Hex</label>
              <input type="text" value={inputColor} onChange={onSetHex} className="Lexiform__colorPickerInput" placeholder="#000000" />
            </div>
            <button
              className="Lexiform__colorPickerDefaultBtn"
              onClick={() => {
                setInputColor('');
                onChange('');
              }}
            >
              Default
            </button>
            <div className="Lexiform__colorPickerBasic">
              {basicColors.map((basicColor) => (
                <button
                  key={basicColor}
                  className={`Lexiform__colorPickerBasicItem ${basicColor === selfColor.hex ? 'active' : ''}`}
                  style={{ backgroundColor: basicColor }}
                  onClick={() => {
                    setInputColor(basicColor);
                    setSelfColor(transformColor('hex', basicColor));
                    onChange(basicColor);
                  }}
                  aria-label={`Select color ${basicColor}`}
                />
              ))}
            </div>
            <MoveWrapper
              className="Lexiform__colorPickerSaturation"
              style={{ backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)` }}
              onChange={({ x, y }) => {
                const newHsv = { ...selfColor.hsv, s: (x / WIDTH) * 100, v: 100 - (y / HEIGHT) * 100 };
                const newColor = transformColor('hsv', newHsv);
                setSelfColor(newColor);
                setInputColor(newColor.hex);
                onChange(newColor.hex);
              }}
            >
              <div
                className="Lexiform__colorPickerCursor"
                style={{
                  backgroundColor: selfColor.hex,
                  left: (selfColor.hsv.s / 100) * WIDTH,
                  top: ((100 - selfColor.hsv.v) / 100) * HEIGHT,
                }}
              />
            </MoveWrapper>
            <MoveWrapper
              className="Lexiform__colorPickerHue"
              onChange={({ x }) => {
                const newHsv = { ...selfColor.hsv, h: (x / WIDTH) * 360 };
                const newColor = transformColor('hsv', newHsv);
                setSelfColor(newColor);
                setInputColor(newColor.hex);
                onChange(newColor.hex);
              }}
            >
              <div
                className="Lexiform__colorPickerHueCursor"
                style={{
                  backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
                  left: (selfColor.hsv.h / 360) * WIDTH,
                }}
              />
            </MoveWrapper>
            <div className="Lexiform__colorPickerPreview" style={{ backgroundColor: selfColor.hex }} />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
