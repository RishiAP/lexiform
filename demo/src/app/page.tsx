"use client";

import dynamic from 'next/dynamic';
import '@rishiap/lexiform/styles.css';
import { ExtendedNodes, ComponentPickerPlugin, EquationsPlugin, ExcalidrawPlugin, ImagesPlugin, LayoutPlugin, PollPlugin, YouTubePlugin, TwitterPlugin, FigmaPlugin, CollapsiblePlugin } from '@rishiap/lexiform';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const LexicalEditor = dynamic(
  () => import('@rishiap/lexiform').then((mod) => mod.LexicalEditor),
  { ssr: false }
);

export default function Home() {
  const [content, setContent] = useState<string>(`{"root":{"children":[{"children":[{"text":"Welcome to Lexiform!","type":"text"}],"type":"heading","tag":"h1"},{"children":[{"text":"Type '/' to open the component picker and insert equations, polls, tables, and more!","type":"text"}],"type":"paragraph"}],"type":"root"}}`);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('lexiform-dark');
      document.documentElement.classList.remove('lexiform-light');
    } else {
      document.documentElement.classList.remove('lexiform-dark');
      document.documentElement.classList.add('lexiform-light');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'} p-8 font-[family-name:var(--font-geist-sans)] transition-colors duration-200`}>
      <main className="max-w-4xl mx-auto flex flex-col gap-8 relative">
        <button 
          onClick={() => setIsDark(!isDark)} 
          className={`absolute right-0 top-0 p-3 rounded-full ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-500 shadow-sm border border-gray-200 hover:bg-gray-100'} transition-all`}
          title="Toggle Theme"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4">Lexiform Demo</h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>A beautiful, lightweight Lexical-based editor</p>
        </header>

        <div className={`${isDark ? 'bg-[#09090b] border-gray-800' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden p-6 transition-colors duration-200`}>
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

        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-900'} border text-gray-100 p-6 rounded-xl overflow-auto text-sm font-mono`}>
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
