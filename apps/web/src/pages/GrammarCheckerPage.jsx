import GrammarCheckerBox from '../components/custom/GrammarCheckerBox';

export default function GrammarCheckerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">AI Grammar Check</h1>
      <p className="text-slate-400 max-w-3xl">
        Write or paste your text below. The AI will analyze it in your browser and suggest corrections for grammar and spelling. Your data stays private.
      </p>
      <GrammarCheckerBox />
    </div>
  );
}