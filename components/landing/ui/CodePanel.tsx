"use client";

const CODE_SNIPPETS = [
  { phase: 0.45, lines: [
    "// IoT Firmware — ATOM-X",
    "void setup() {",
    "  Serial.begin(9600);",
    "  pinMode(LED_PIN, OUTPUT);",
    "  init_sensors();",
    "}",
  ]},
  { phase: 0.52, lines: [
    "void loop() {",
    "  float temp = read_DHT22();",
    "  if (temp > THRESHOLD) {",
    "    activate_cooling();",
    "  } else {",
    "    standby_mode();",
    "  }",
    "}",
  ]},
  { phase: 0.58, lines: [
    "; Assembly — conditional branch",
    "  CMP  R0, #THRESH",
    "  BGT  activate_cool",
    "  B    standby",
    "activate_cool:",
    "  MOV  R1, #1",
    "  STR  R1, [ACTUATOR]",
  ]},
  { phase: 0.65, lines: [
    "// Execute pipeline",
    ">>> compile OK",
    ">>> flash 0x08000000",
    ">>> RUNNING...",
    "signal → SENSOR → GATEWAY",
    "status: EXECUTE ✓",
  ]},
  { phase: 0.72, lines: [
    "// AI Agent — inference",
    "agent.load(model_v3);",
    "const pred = agent.predict({",
    "  sensor: temp, humidity,",
    "  context: edge_state",
    "});",
    "if (pred.anomaly) dispatch();",
  ]},
];

export function CodePanel({ scrollProgress }: { scrollProgress: number }) {
  const activeSnippet = [...CODE_SNIPPETS].reverse().find((s) => scrollProgress >= s.phase - 0.04);
  const snippetOpacity = activeSnippet
    ? Math.min(1, (scrollProgress - (activeSnippet.phase - 0.04)) / 0.06)
    : 0;

  if (!activeSnippet || snippetOpacity < 0.05) return null;

  const isAssembly = activeSnippet.lines.some((l) => l.startsWith(";") || l.includes("CMP"));

  return (
    <div
      className="code-panel pointer-events-none fixed right-6 top-1/2 z-20 w-72 -translate-y-1/2 transition-opacity duration-300 md:right-10 md:w-80"
      style={{ opacity: snippetOpacity }}
    >
      <div className="overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-950/85 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-cyan-500/20 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-cyan-400/70">
            {isAssembly ? "asm — branch.asm" : "firmware.cpp"}
          </span>
        </div>
        <pre className="max-h-52 overflow-hidden p-4 font-mono text-[11px] leading-relaxed text-cyan-100/90 md:text-xs">
          {activeSnippet.lines.map((line, i) => {
            const lineDelay = i / activeSnippet.lines.length;
            const lineVisible = snippetOpacity > lineDelay * 0.6;
            const isKeyword = /\b(if|else|void|const|CMP|BGT|B|MOV|STR)\b/.test(line);
            const isComment = line.trim().startsWith("//") || line.trim().startsWith(";");
            const isSuccess = line.includes("✓") || line.includes("OK") || line.includes("RUNNING");

            return (
              <div
                key={i}
                className="transition-all duration-200"
                style={{
                  opacity: lineVisible ? 1 : 0,
                  transform: lineVisible ? "translateX(0)" : "translateX(-8px)",
                }}
              >
                <span className="mr-3 select-none text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={
                    isSuccess
                      ? "text-emerald-400"
                      : isComment
                        ? "text-slate-500"
                        : isKeyword
                          ? "text-fuchsia-400"
                          : "text-cyan-200/80"
                  }
                >
                  {line}
                </span>
              </div>
            );
          })}
        </pre>
        <div className="border-t border-cyan-500/20 px-3 py-1.5 font-mono text-[10px] text-cyan-500/60">
          <span className="animate-pulse">▊</span> compiling...
        </div>
      </div>
    </div>
  );
}
