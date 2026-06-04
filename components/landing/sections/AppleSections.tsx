"use client";

import dynamic from "next/dynamic";
import {
  StickySection,
  SectionEyebrow,
  SectionTitle,
  SectionBody,
  FadeBlock,
} from "../ui/StickySection";
import { SectionContent } from "../ui/SectionContent";
import { SectionCanvas } from "../ui/SectionCanvas";
import { SceneRunner } from "../ui/SceneRunner";
import { phase } from "../hooks/useSectionProgress";
import { EmbeddedShowcase } from "../ui/EmbeddedShowcase";
import { EnergyShowcase } from "../ui/EnergyShowcase";
import { HeroQuantumSection } from "../ui/HeroQuantumSection";
import { RoboticsShowcase } from "../ui/RoboticsShowcase";
import { PlaygroundSection } from "../playground/PlaygroundSection";

const SmartHomeScene = dynamic(() => import("../scene/SmartHomeScene").then((m) => m.SmartHomeScene), { ssr: false });
const IndustrialScene = dynamic(() => import("../scene/IndustrialScene").then((m) => m.IndustrialScene), { ssr: false });
const RobotArmScene = dynamic(() => import("../scene/RobotArmScene").then((m) => m.RobotArmScene), { ssr: false });
const AgricultureScene = dynamic(() => import("../scene/AgricultureScene").then((m) => m.AgricultureScene), { ssr: false });
const VehicleIoTScene = dynamic(() => import("../scene/VehicleIoTScene").then((m) => m.VehicleIoTScene), { ssr: false });
const HealthcareScene = dynamic(() => import("../scene/HealthcareScene").then((m) => m.HealthcareScene), { ssr: false });
const SmartCityScene = dynamic(() => import("../scene/SmartCityScene").then((m) => m.SmartCityScene), { ssr: false });
const EdgeMLScene = dynamic(() => import("../scene/EdgeMLScene").then((m) => m.EdgeMLScene), { ssr: false });

function SpecGrid({ items, dark = false }: { items: { label: string; value: string }[]; dark?: boolean }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#d2d2d7]/40 sm:mt-8 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4 ${dark ? "bg-[#1d1d1f]" : "bg-white lg:bg-white/95 lg:backdrop-blur-sm"}`}
        >
          <p className={`text-[10px] sm:text-xs ${dark ? "text-[#86868b]" : "text-[#6e6e73]"}`}>{item.label}</p>
          <p className={`mt-1 text-xs font-semibold sm:text-sm md:text-base ${dark ? "text-white" : "text-[#1d1d1f]"}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function AppleSections() {
  return (
    <>
      <HeroQuantumSection />

      {/* Microcontroller / Embedded — no WebGL, professional layout */}
      <StickySection id="microcontroller" layout="flow">
        {(p) => <EmbeddedShowcase progress={p} />}
      </StickySection>

      {/* Smart Home IoT */}
      <StickySection
        id="smart-home"
        height="168vh"
        canvas={(getProgress) => (
          <SectionCanvas align="right" opaque camera={[0.6, 1.5, 6]}>
            <SceneRunner getProgress={getProgress} Scene={SmartHomeScene} />
          </SectionCanvas>
        )}
      >
        {(p) => (
          <SectionContent split>
            <FadeBlock progress={p} start={0.04} end={0.18}>
              <SectionEyebrow>Smart Home</SectionEyebrow>
              <SectionTitle>Your home. Connected.</SectionTitle>
              <SectionBody>
                Hub links thermostat, camera, lock, and sensors — each device joins the mesh as you scroll.
              </SectionBody>
            </FadeBlock>
            <FadeBlock progress={p} start={0.22} end={0.38}>
              <SpecGrid
                items={[
                  { label: "Devices", value: "500+ supported" },
                  { label: "Latency", value: "< 12 ms" },
                  { label: "Protocol", value: "MQTT · Zigbee" },
                  { label: "Security", value: "E2E encrypted" },
                ]}
              />
            </FadeBlock>
            <FadeBlock progress={p} start={0.48} end={0.62} className="mt-6">
              <p className="text-sm font-medium text-[#1d1d1f]">
                {phase(p, 0.4, 0.82) > 0.5 ? "All nodes linked." : "Linking nodes..."}
              </p>
            </FadeBlock>
          </SectionContent>
        )}
      </StickySection>

      {/* Industrial IoT */}
      <StickySection
        id="industrial"
        theme="dark"
        height="172vh"
        canvas={(getProgress) => (
          <SectionCanvas align="right" bg="#000" opaque camera={[0.5, 1.8, 7]}>
            <SceneRunner getProgress={getProgress} Scene={IndustrialScene} />
          </SectionCanvas>
        )}
      >
        {(p) => (
          <SectionContent split>
            <FadeBlock progress={p} start={0.04} end={0.16}>
              <SectionEyebrow dark>Industrial IoT</SectionEyebrow>
              <SectionTitle dark>Built for the factory floor.</SectionTitle>
              <SectionBody dark>
                Conveyor lines, storage tanks, PLC panels, and pipe networks — animated in sequence as production comes online.
              </SectionBody>
            </FadeBlock>
            <FadeBlock progress={p} start={0.2} end={0.34}>
              <SpecGrid
                dark
                items={[
                  { label: "Uptime", value: "99.97%" },
                  { label: "PLC", value: "Modbus · OPC-UA" },
                  { label: "Throughput", value: "10K events/s" },
                  { label: "Predictive", value: "ML maintenance" },
                ]}
              />
            </FadeBlock>
            <FadeBlock progress={p} start={0.46} end={0.6} className="mt-6 space-y-2">
              {["Conveyor active", "Tanks monitored", "PLC synced", "Data streaming"].map((step, i) => (
                <p
                  key={step}
                  className={`text-sm transition-opacity ${
                    phase(p, 0.18 + i * 0.12, 0.28 + i * 0.12) > 0.5
                      ? "text-[#34c759]"
                      : "text-[#48484a]"
                  }`}
                >
                  {phase(p, 0.18 + i * 0.12, 0.28 + i * 0.12) > 0.5 ? "✓" : "○"} {step}
                </p>
              ))}
            </FadeBlock>
          </SectionContent>
        )}
      </StickySection>

      {/* Robotics */}
      <StickySection
        id="robotics"
        height="198vh"
        canvas={(getProgress) => (
          <SectionCanvas align="right" opaque camera={[1.15, 0.42, 3.6]} fov={36}>
            <SceneRunner getProgress={getProgress} Scene={RobotArmScene} />
          </SectionCanvas>
        )}
      >
        {(p) => <RoboticsShowcase progress={p} />}
      </StickySection>

      {/* Agriculture IoT */}
      <StickySection
        id="agriculture"
        height="165vh"
        canvas={(getProgress) => (
          <SectionCanvas align="right" opaque camera={[0.5, 2, 7]}>
            <SceneRunner getProgress={getProgress} Scene={AgricultureScene} />
          </SectionCanvas>
        )}
      >
        {(p) => (
          <SectionContent split>
            <FadeBlock progress={p} start={0.04} end={0.18}>
              <SectionEyebrow>Agriculture IoT</SectionEyebrow>
              <SectionTitle>Crops that communicate.</SectionTitle>
              <SectionBody>
                Soil sensors deploy across the field. Moisture, temperature, and weather data stream to your edge hub in real time.
              </SectionBody>
            </FadeBlock>
            <FadeBlock progress={p} start={0.38} end={0.52}>
              <SpecGrid
                items={[
                  { label: "Sensors", value: "Multi-depth probes" },
                  { label: "Coverage", value: "400 acres" },
                  { label: "Irrigation", value: "Auto-triggered" },
                  { label: "Yield boost", value: "+18% avg" },
                ]}
              />
            </FadeBlock>
          </SectionContent>
        )}
      </StickySection>

      {/* Automotive IoT */}
      <StickySection
        id="automotive"
        theme="dark"
        height="165vh"
        canvas={(getProgress) => (
          <SectionCanvas bg="#000" camera={[0, 1, 7]}>
            <SceneRunner getProgress={getProgress} Scene={VehicleIoTScene} />
          </SectionCanvas>
        )}
      >
        {(p) => (
          <SectionContent centered>
            <FadeBlock progress={p} start={0.04} end={0.18}>
              <SectionEyebrow dark>Automotive IoT</SectionEyebrow>
              <SectionTitle dark>Every sensor. One system.</SectionTitle>
              <SectionBody dark>
                LiDAR, radar, cameras, and CAN bus nodes scan sequentially — a complete picture of vehicle intelligence.
              </SectionBody>
            </FadeBlock>
            <FadeBlock progress={p} start={0.38} end={0.52} className="mt-8">
              <p className="font-mono text-4xl font-semibold tabular-nums text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {Math.round(phase(p, 0.22, 0.8) * 100)}%
              </p>
              <p className="mt-2 text-sm text-[#86868b]">Sensor mesh coverage</p>
            </FadeBlock>
          </SectionContent>
        )}
      </StickySection>

      {/* Healthcare IoT */}
      <StickySection
        id="healthcare"
        height="165vh"
        canvas={(getProgress) => (
          <SectionCanvas align="right" opaque camera={[0.5, 1.2, 6]}>
            <SceneRunner getProgress={getProgress} Scene={HealthcareScene} />
          </SectionCanvas>
        )}
      >
        {(p) => (
          <SectionContent split>
            <FadeBlock progress={p} start={0.04} end={0.18}>
              <SectionEyebrow>Healthcare IoT</SectionEyebrow>
              <SectionTitle>Care that never sleeps.</SectionTitle>
              <SectionBody>
                Patient monitors, wearables, and IV pumps — hospital-grade devices with live vitals streaming to edge systems.
              </SectionBody>
            </FadeBlock>
            <FadeBlock progress={p} start={0.38} end={0.52}>
              <SpecGrid
                items={[
                  { label: "Compliance", value: "HIPAA ready" },
                  { label: "Latency", value: "< 8 ms" },
                  { label: "Devices", value: "HL7 · FHIR" },
                  { label: "Uptime", value: "99.99%" },
                ]}
              />
            </FadeBlock>
          </SectionContent>
        )}
      </StickySection>

      {/* Smart City */}
      <StickySection
        id="smart-city"
        theme="dark"
        height="170vh"
        canvas={(getProgress) => (
          <SectionCanvas bg="#000" camera={[0, 1.5, 8]}>
            <SceneRunner getProgress={getProgress} Scene={SmartCityScene} />
          </SectionCanvas>
        )}
      >
        {(p) => (
          <SectionContent centered>
            <FadeBlock progress={p} start={0.04} end={0.18}>
              <SectionEyebrow dark>Smart City</SectionEyebrow>
              <SectionTitle dark>Infrastructure that thinks.</SectionTitle>
              <SectionBody dark>
                Traffic signals cycle, air sensors deploy, cameras mount, and LoRa antennas link — urban IoT built for scale.
              </SectionBody>
            </FadeBlock>
            <FadeBlock progress={p} start={0.38} end={0.54} className="mt-6 flex flex-wrap justify-center gap-4 sm:mt-8 sm:gap-6 md:gap-8">
              {[
                { label: "Traffic", done: phase(p, 0.18, 0.45) },
                { label: "Air quality", done: phase(p, 0.4, 0.65) },
                { label: "Data flow", done: phase(p, 0.7, 0.95) },
              ].map(({ label, done }) => (
                <div key={label}>
                  <p className="text-xl font-semibold text-white sm:text-2xl">{done > 0.8 ? "●" : "○"}</p>
                  <p className="mt-1 text-[10px] text-[#86868b] sm:text-xs">{label}</p>
                </div>
              ))}
            </FadeBlock>
          </SectionContent>
        )}
      </StickySection>

      {/* Smart Grid / Energy */}
      <StickySection id="smart-grid" layout="flow">
        {(p) => <EnergyShowcase progress={p} />}
      </StickySection>

      {/* Edge ML */}
      <StickySection
        id="edge-ml"
        height="168vh"
        canvas={(getProgress) => (
          <SectionCanvas align="right" opaque camera={[0.5, 1.2, 6]}>
            <SceneRunner getProgress={getProgress} Scene={EdgeMLScene} />
          </SectionCanvas>
        )}
      >
        {(p) => (
          <SectionContent split>
            <FadeBlock progress={p} start={0.04} end={0.18}>
              <SectionEyebrow>Edge ML</SectionEyebrow>
              <SectionTitle>Inference where it matters.</SectionTitle>
              <SectionBody>
                Rack-mounted edge servers compile models, run inference, and stream results — no cloud round-trip required.
              </SectionBody>
            </FadeBlock>
            <FadeBlock progress={p} start={0.38} end={0.52}>
              <SpecGrid
                items={[
                  { label: "Models", value: "TensorFlow · ONNX" },
                  { label: "Inference", value: "< 4 ms" },
                  { label: "Power", value: "15W TDP" },
                  { label: "Offline", value: "Full autonomy" },
                ]}
              />
            </FadeBlock>
          </SectionContent>
        )}
      </StickySection>

      {/* AI Agents - text only section, Apple style */}
      <section id="ai-agents" className="bg-black px-4 py-20 text-center sm:px-6 sm:py-28 md:px-12 md:py-32 lg:px-16 lg:py-44 xl:px-20">
        <SectionEyebrow dark>AI Agents</SectionEyebrow>
        <SectionTitle dark>
          Software that
          <br />
          decides for itself.
        </SectionTitle>
        <SectionBody dark>
          Autonomous agents monitor streams, branch on conditions, and dispatch actions — like assembly code with intent.
        </SectionBody>
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[#424245] bg-[#1d1d1f] text-left sm:mt-12 md:mt-16">
          <div className="border-b border-[#424245] px-3 py-2 text-[10px] text-[#86868b] sm:px-4 sm:text-xs">agent.runtime</div>
          <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-[#a1a1a6] sm:p-6 sm:text-xs md:text-sm">
{`if (sensor.temp > threshold) {
  agent.dispatch("cooling", { zone: 3 });
} else if (anomaly.score > 0.92) {
  agent.escalate("maintenance");
} else {
  agent.standby();
}`}
          </pre>
        </div>
      </section>

      <PlaygroundSection />

      {/* CTA */}
      <section id="contact" className="bg-[#f5f5f7] px-4 py-20 text-center sm:px-6 sm:py-28 md:px-12 md:py-36 lg:px-16 lg:py-44 xl:px-20">
        <SectionEyebrow>Get started</SectionEyebrow>
        <SectionTitle>
          Ready to build
          <br />
          something brilliant?
        </SectionTitle>
        <SectionBody>
          From smart homes to factory floors to autonomous fleets — we engineer the full IoT and AI stack.
        </SectionBody>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <a
            href="mailto:hello@nexedge.io"
            className="rounded-full bg-[#0071e3] px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            Contact us
          </a>
          <a
            href="#hero"
            className="rounded-full border border-[#d2d2d7] px-8 py-3 text-sm font-medium text-[#0071e3] transition-colors hover:bg-white"
          >
            Learn more
          </a>
        </div>
        <p className="mt-12 text-[10px] text-[#86868b] sm:mt-16 sm:text-xs md:mt-20">© 2026 NexEdge Systems. All rights reserved.</p>
      </section>
    </>
  );
}
