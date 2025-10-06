import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function GrammarCheckerBox() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, ready, working

  // We use a ref for the pipeline because it's a mutable object that we don't want to trigger re-renders
  const pipelineRef = useRef(null);
  const workerRef = useRef(null);

  // This effect initializes the web worker
  useEffect(() => {
    if (!workerRef.current) {
      setStatus('loading');
      workerRef.current = new Worker(new URL('../../workers/grammar.worker.js', import.meta.url), {
        type: 'module'
      });

      // Listen for messages from the worker
      workerRef.current.onmessage = (event) => {
        const message = event.data;
        switch (message.status) {
          case 'initiate-done':
            setStatus('ready');
            break;
          case 'progress':
            setStatus(`working: ${Math.round(message.progress)}%`);
            break;
          case 'complete':
            setOutput(message.output[0].generated_text);
            setStatus('ready');
            break;
          case 'error':
            console.error('Worker error:', message.data);
            setStatus('idle');
            break;
        }
      };
    }
    // Cleanup worker on component unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const handleCheckGrammar = () => {
    if (status !== 'ready' || !input) return;
    setStatus('working');
    workerRef.current.postMessage({ text: input });
  };

  const renderButtonContent = () => {
    switch (status) {
      case 'loading':
        return <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Initializing AI...</>;
      case 'working':
        return <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Checking...</>;
      default:
        return <><Sparkles className="w-5 h-5 mr-2" /> Check Grammar</>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your English text here..."
          className="w-full h-64 p-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-blue-300 focus:border-blue-300 resize-none"
        />
        <button
          onClick={handleCheckGrammar}
          disabled={status !== 'ready' || !input}
          className="w-full flex items-center justify-center py-3 px-4 bg-blue-300 text-slate-950 font-semibold rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {renderButtonContent()}
        </button>
      </div>
      <div className="w-full h-full min-h-[312px] p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Correction</h3>
        <p className="text-slate-400 whitespace-pre-wrap">{output || 'Suggestions will appear here.'}</p>
      </div>
    </div>
  );
}