"use client";

import dynamic from 'next/dynamic';
import '@rishiap/lexiform/styles.css';
import '@rishiap/lexiform/equations.css';
import '@rishiap/lexiform/excalidraw.css';
import { ExtendedNodes, ComponentPickerPlugin, ImagesPlugin, LayoutPlugin, PollPlugin, YouTubePlugin, TwitterPlugin, FigmaPlugin, CollapsiblePlugin } from '@rishiap/lexiform';
import { EquationsPlugin } from '@rishiap/lexiform/equations';
import { ExcalidrawPlugin } from '@rishiap/lexiform/excalidraw';
import { useState } from 'react';
import { Sun, Moon, Copy, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

const LexicalEditor = dynamic(
  () => import('@rishiap/lexiform').then((mod) => mod.LexicalEditor),
  { ssr: false }
);

function CopyCommand({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="inline-flex items-center px-4 py-2.5 rounded-lg border font-mono text-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm text-gray-700 dark:text-gray-300 transition-all">
      <span className="mr-4 text-emerald-500 font-semibold">$ <span className="text-gray-700 dark:text-gray-300">{text}</span></span>
      <button 
        onClick={handleCopy} 
        className="p-1.5 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        title="Copy command"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export default function Home() {
  const [content, setContent] = useState<string>(`{"root":{"children":[{"children":[{"text":"Welcome to Lexiform!","type":"text"}],"type":"heading","tag":"h1"},{"children":[{"text":"Type '/' to open the component picker and insert equations, polls, tables, and more!","type":"text"}],"type":"paragraph"}],"type":"root"}}`);
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] transition-colors duration-200">
      <main className="max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 relative">
        <button 
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} 
          className="absolute right-0 top-0 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-500 dark:text-yellow-400 shadow-sm border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          title="Toggle Theme"
        >
          <Sun size={20} className="dark:hidden" />
          <Moon size={20} className="hidden dark:block" />
        </button>

        <header className="text-center mb-2 mt-4 sm:mt-8">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" width="200" height="75" role="img" aria-label="Lexiform Logo" className="drop-shadow-sm">
              <g>
                <rect x="0" y="0" width="110" height="110" rx="22" fill="#4F46E5"/>
                <rect x="24" y="20" width="18" height="70" rx="5" fill="white" opacity="0.95"/>
                <rect x="24" y="73" width="62" height="17" rx="5" fill="white" opacity="0.95"/>
                <line x1="52" y1="31" x2="87" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.45"/>
                <line x1="52" y1="43" x2="81" y2="43" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
                <line x1="52" y1="55" x2="76" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.25"/>
                <rect x="88" y="28" width="3.5" height="18" rx="1.75" fill="#A5B4FC"/>
              </g>
              <text x="130" y="79" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif", fontSize: "46px", fontWeight: 300, letterSpacing: "-0.5px" }} className="fill-[#1E1B4B] dark:fill-[#E0E7FF]">
                lexi<tspan style={{ fontWeight: 600 }} className="fill-[#4F46E5] dark:fill-[#818CF8]">form</tspan>
              </text>
            </svg>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-lg mx-auto">A highly polished, ultra-lightweight, headless-compatible drop-in React rich text editor built on Lexical.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-2">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm text-gray-600 dark:text-gray-300 text-sm flex-wrap justify-center gap-x-2 gap-y-2">
              <span>Made with <span className="text-red-500">❤️</span> by <a href="https://github.com/RishiAP" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-gray-900 dark:text-gray-100">RishiAP</a></span>
              <span className="mx-2 opacity-30 hidden sm:inline">|</span>
              <a href="https://github.com/RishiAP/lexiform" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Star on GitHub
              </a>
              <span className="mx-2 opacity-30 hidden sm:inline">|</span>
              <a href="https://www.npmjs.com/package/@rishiap/lexiform" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H3.334v-4h3.332v4zm4 0h-1.334v-4H8v4H6.666v-5.332h4v5.332zm12 0h-9.334v-5.332h9.334v5.332zm-2.666-4h-4v2.668h1.334v-1.334h1.332v1.334h1.334v-2.668z"/></svg>
                npm
              </a>
            </div>
            <CopyCommand text="npm install @rishiap/lexiform" />
          </div>
        </header>

        <div className="bg-white dark:bg-[#09090b] border-gray-200 dark:border-gray-800 rounded-xl shadow-sm border overflow-hidden p-6 transition-colors duration-200">
          <LexicalEditor
            value={content}
            onChange={(val) => setContent(val)}
            outputFormat="json"
            placeholder="Start typing..."
            nodes={ExtendedNodes}
            plugins={
              <>
                <ComponentPickerPlugin />
                <EquationsPlugin />
                <ExcalidrawPlugin />
                <ImagesPlugin />
                <LayoutPlugin />
                <PollPlugin />
                <YouTubePlugin />
                <TwitterPlugin />
                <FigmaPlugin />
                <CollapsiblePlugin />
              </>
            }
          />
        </div>

        <div className="bg-gray-900 border text-gray-100 p-6 rounded-xl overflow-auto text-sm font-mono border-gray-900 dark:border-gray-800">
          <h3 className="text-gray-400 mb-2 uppercase text-xs font-semibold tracking-wider">Output (JSON)</h3>
          <pre className="whitespace-pre-wrap">{
            (() => {
              try {
                return JSON.stringify(JSON.parse(content), null, 2);
              } catch {
                console.error("Failed to parse content:", content);
                return String(content);
              }
            })()
          }</pre>
        </div>


      </main>
    </div>
  );
}
