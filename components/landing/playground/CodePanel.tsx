"use client";

interface CodePanelProps {
  title: string;
  hint: string;
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  error: string | null;
  log?: string | null;
}

export function CodePanel({
  title,
  hint,
  code,
  onChange,
  onRun,
  onReset,
  error,
  log,
}: CodePanelProps) {
  return (
    <div className="flex h-full min-h-[360px] flex-col rounded-2xl border border-[#d2d2d7]/70 bg-[#1d1d1f] shadow-inner">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-xs text-[#86868b]">{title}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-white/15 px-3 py-1 text-xs font-medium text-[#a1a1a6] transition-colors hover:bg-white/10 hover:text-white"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onRun}
            className="rounded-lg bg-[#0071e3] px-4 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            ▶ Run
          </button>
        </div>
      </div>
      <p className="border-b border-white/5 px-4 py-2 font-mono text-[10px] text-[#6e6e73]">{hint}</p>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-[200px] flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-[#f5f5f7] outline-none placeholder:text-[#48484a]"
        aria-label="IoT simulation code"
      />
      <div className="border-t border-white/10 px-4 py-2 font-mono text-[11px]">
        {error ? (
          <span className="text-[#ff453a]">✕ {error}</span>
        ) : (
          <span className="text-[#34c759]">▸ {log ?? "Ready — press Run to simulate"}</span>
        )}
      </div>
    </div>
  );
}
