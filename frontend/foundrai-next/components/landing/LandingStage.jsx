// "use client";
// import { useState } from "react";
// import { Send, Zap, Brain, Eye, Cpu, Rocket, FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { useAppStore } from "@/store/useAppStore";
// import { useSimulation } from "@/hooks/useSimulation";
// import { TICKER_MESSAGES } from "@/lib/utils";

// export default function LandingStage() {
//   const { idea, setIdea, fastMode, setInputMode, setStage } = useAppStore();
//   const { run } = useSimulation();
//   const [launching, setLaunching] = useState(false);

//   const handlePromptLaunch = async () => {
//     if (!idea.trim() || launching) return;
//     setLaunching(true);
//     await run();
//     setLaunching(false);
//   };

//   const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES];

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 pt-20">
//       {/* Hero */}
//       <div className="text-center max-w-3xl mx-auto mb-10">
//         <Badge className="mb-5 bg-indigo-500/10 text-indigo-400 border-indigo-500/30 gap-1.5">
//           <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" />
//           MULTI-AGENT AI CONSENSUS ENGINE · 6 AGENTS
//         </Badge>
//         <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-5">
//           Autonomous Business
//           <br />
//           <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
//             Validation Engine.
//           </span>
//         </h1>
//         <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
//           Stop guessing. 6 AI agents debate your startup with real market data
//           and produce a validated plan, legal check, and GitHub repo.
//         </p>
//       </div>

//       {/* Input modes */}
//       <div className="w-full max-w-2xl">
//         <Tabs defaultValue="prompt" onValueChange={(v) => setInputMode(v)}>
//           <TabsList className="w-full mb-4 bg-white/[0.04] border border-white/[0.08]">
//             <TabsTrigger
//               value="prompt"
//               className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
//             >
//               <Zap size={13} className="mr-1.5" /> Quick Prompt
//             </TabsTrigger>
//             <TabsTrigger
//               value="form"
//               className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
//             >
//               <FileText size={13} className="mr-1.5" /> Build with Form
//             </TabsTrigger>
//           </TabsList>

//           {/* Prompt tab */}
//           <TabsContent value="prompt" className="mt-0">
//             <div className="glass rounded-2xl overflow-hidden mb-3">
//               <Textarea
//                 value={idea}
//                 onChange={(e) => setIdea(e.target.value)}
//                 placeholder="Describe your startup idea in plain English…"
//                 rows={4}
//                 className="bg-transparent border-0 text-white placeholder-slate-600
//                   font-fira text-sm resize-none focus:ring-0 px-5 pt-5"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && e.metaKey) handlePromptLaunch();
//                 }}
//               />
//               <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
//                 <span className="text-[10px] text-slate-600 font-fira tracking-widest">
//                   INPUT TERMINAL V2.0 · ⌘↵ to launch
//                 </span>
//                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-dot" />
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <Button
//                 variant="outline"
//                 className={`flex-1 border-white/[0.08] gap-2 ${fastMode ? "text-white bg-white/[0.06]" : "text-slate-500"}`}
//                 onClick={() => useAppStore.getState().setFastMode(true)}
//               >
//                 <Zap size={14} className={fastMode ? "text-indigo-400" : ""} />
//                 Fast Mode{" "}
//                 <span className="text-slate-600 text-xs">3 agents · ~30s</span>
//               </Button>
//               <Button
//                 variant="outline"
//                 className={`flex-1 border-white/[0.08] gap-2 ${!fastMode ? "text-white bg-white/[0.06]" : "text-slate-500"}`}
//                 onClick={() => useAppStore.getState().setFastMode(false)}
//               >
//                 <Brain
//                   size={14}
//                   className={!fastMode ? "text-violet-400" : ""}
//                 />
//                 Deep Mode{" "}
//                 <span className="text-slate-600 text-xs">6 agents</span>
//               </Button>
//               <Button
//                 onClick={handlePromptLaunch}
//                 disabled={!idea.trim() || launching}
//                 className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 gap-2 font-bold"
//               >
//                 {launching ? (
//                   <>
//                     <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
//                     Launching…
//                   </>
//                 ) : (
//                   <>
//                     <Send size={14} /> Launch
//                   </>
//                 )}
//               </Button>
//             </div>
//           </TabsContent>

//           {/* Form tab */}
//           <TabsContent value="form" className="mt-0">
//             <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
//               <div className="text-4xl">📋</div>
//               <div>
//                 <p className="text-white font-semibold mb-1">
//                   11-field structured intake
//                 </p>
//                 <p className="text-slate-500 text-sm">
//                   Answer structured questions — we build the optimal prompt for
//                   all 6 agents.
//                 </p>
//               </div>
//               <Button
//                 className="bg-indigo-600 hover:bg-indigo-500 gap-2 font-bold"
//                 onClick={() => {
//                   setInputMode("form");
//                   setStage("intake");
//                 }}
//               >
//                 <FileText size={14} /> Open Intake Form
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Perceive → Reason → Act */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full mt-14">
//         {[
//           {
//             Icon: Eye,
//             title: "Perceive",
//             desc: "6 agents scan live web, GitHub, Reddit, Google Trends, and legal databases.",
//             tag: "DATA LAYER",
//             color: "text-blue-400",
//           },
//           {
//             Icon: Cpu,
//             title: "Reason",
//             desc: "Multi-agent consensus protocol debates strategy through 4 phases of deliberation.",
//             tag: "CONSENSUS",
//             color: "text-indigo-400",
//           },
//           {
//             Icon: Rocket,
//             title: "Act",
//             desc: "Produces PDF, legal report, GitHub repo, and CFO financial charts.",
//             tag: "DEPLOYMENT",
//             color: "text-violet-400",
//           },
//         ].map(({ Icon, title, desc, tag, color }) => (
//           <div key={title} className="glass rounded-xl p-5">
//             <Icon size={20} className={`${color} mb-3`} />
//             <div className="text-white font-bold text-base mb-2">{title}</div>
//             <p className="text-slate-500 text-xs leading-relaxed font-fira mb-4">
//               {desc}
//             </p>
//             <div className="flex items-center gap-2">
//               <div className="h-px flex-1 bg-white/10" />
//               <span className="text-slate-600 text-[10px] font-semibold tracking-widest">
//                 {tag}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Ticker */}
//       <div className="fixed bottom-0 left-0 right-0 h-9 bg-[#0a0a0f]/95 border-t border-white/[0.06] overflow-hidden flex items-center">
//         <div className="flex items-center whitespace-nowrap animate-ticker">
//           {doubled.map((msg, i) => (
//             <span
//               key={i}
//               className="inline-flex items-center gap-2 px-8 text-[11px] font-fira text-slate-600 border-r border-white/[0.04]"
//             >
//               <span className="w-1 h-1 rounded-full bg-indigo-500 flex-shrink-0" />
//               {msg}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import {
//   Send,
//   Zap,
//   Brain,
//   Eye,
//   Cpu,
//   Rocket,
//   FileText,
//   ArrowRight,
// } from "lucide-react";
// import { useAppStore } from "@/store/useAppStore";
// import { useSimulation } from "@/hooks/useSimulation";
// import { TICKER_MESSAGES, cn } from "@/lib/utils";

// // Small reusable tab button
// function TabBtn({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={cn(
//         "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold",
//         "rounded-lg transition-all duration-200",
//         active
//           ? "bg-gold-gradient text-[#111] shadow-gold-sm"
//           : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]",
//       )}
//     >
//       {children}
//     </button>
//   );
// }

// // Agent pill
// function AgentPill({ emoji, label, color }) {
//   return (
//     <div
//       className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium font-fira"
//       style={{ borderColor: `${color}30`, background: `${color}10`, color }}
//     >
//       {emoji} {label}
//     </div>
//   );
// }

// export default function LandingStage() {
//   const { idea, setIdea, fastMode, setFastMode, setInputMode, setStage } =
//     useAppStore();
//   const { run } = useSimulation();
//   const [activeTab, setActiveTab] = useState("prompt");
//   const [launching, setLaunching] = useState(false);

//   const handleLaunch = async () => {
//     if (!idea.trim() || launching) return;
//     setLaunching(true);
//     await run();
//     setLaunching(false);
//   };

//   const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES];

//   const agents = [
//     { emoji: "🧠", label: "CEO", color: "#818cf8" },
//     { emoji: "⚡", label: "Dev", color: "#60a5fa" },
//     { emoji: "📈", label: "CFO", color: "#34d399" },
//     { emoji: "🌐", label: "CMO", color: "#fbbf24" },
//     { emoji: "⚠️", label: "Risk", color: "#f87171" },
//     { emoji: "⚖️", label: "Legal", color: "#a78bfa" },
//   ];

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center px-6 pb-28 pt-20
//       bg-obsidian-radial bg-obsidian-radial2"
//     >
//       {/* Agent pills row */}
//       <div className="flex items-center gap-2 flex-wrap justify-center mb-8 animate-fade-in">
//         <span className="data-label mr-1">6 AGENTS</span>
//         {agents.map((a) => (
//           <AgentPill key={a.label} {...a} />
//         ))}
//       </div>

//       {/* Hero */}
//       <div className="text-center max-w-4xl mx-auto mb-10 animate-fade-in-up">
//         <h1 className="text-5xl md:text-[4.5rem] font-extrabold tracking-tight leading-[1.04] mb-5">
//           <span className="text-white">Autonomous Business</span>
//           <br />
//           <span
//             className="text-transparent bg-clip-text"
//             style={{
//               backgroundImage:
//                 "linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #f59e0b 70%, #d97706 100%)",
//             }}
//           >
//             Validation Engine.
//           </span>
//         </h1>
//         <p className="text-white/40 text-lg leading-relaxed max-w-lg mx-auto font-light">
//           6 AI agents debate your startup with live market data — then deliver a
//           plan, legal check, and GitHub repo.
//         </p>
//       </div>

//       {/* Input card */}
//       <div
//         className="w-full max-w-[640px] animate-fade-in-up"
//         style={{ animationDelay: "0.1s" }}
//       >
//         {/* Tab switcher */}
//         <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-3">
//           <TabBtn
//             active={activeTab === "prompt"}
//             onClick={() => setActiveTab("prompt")}
//           >
//             <Zap size={12} /> Quick Prompt
//           </TabBtn>
//           <TabBtn
//             active={activeTab === "form"}
//             onClick={() => setActiveTab("form")}
//           >
//             <FileText size={12} /> Build with Form
//           </TabBtn>
//         </div>

//         {/* Prompt panel */}
//         {activeTab === "prompt" && (
//           <div className="animate-fade-in">
//             {/* Terminal textarea */}
//             <div className="relative rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden mb-3 hover-gold transition-all duration-300 focus-within:border-gold-500/25 focus-within:shadow-gold-sm">
//               {/* Top bar */}
//               <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
//                 <div className="flex gap-1.5">
//                   <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
//                   <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
//                   <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
//                 </div>
//                 <span className="font-fira text-[10px] text-white/20 tracking-widest ml-1">
//                   FOUNDRAI TERMINAL · v2.0
//                 </span>
//                 <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse-dot" />
//               </div>

//               <textarea
//                 value={idea}
//                 onChange={(e) => setIdea(e.target.value)}
//                 placeholder="Describe your startup idea in plain English…"
//                 rows={5}
//                 className="w-full bg-transparent px-5 py-4 text-white/80 placeholder-white/15
//                   font-fira text-sm resize-none outline-none leading-relaxed"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && e.metaKey) handleLaunch();
//                 }}
//               />

//               <div className="px-5 py-2.5 border-t border-white/[0.05] flex items-center justify-between">
//                 <span className="font-fira text-[10px] text-white/20 tracking-widest">
//                   ⌘ + ↵ to launch
//                 </span>
//                 <span className="font-fira text-[10px] text-white/15">
//                   {idea.length} chars
//                 </span>
//               </div>
//             </div>

//             {/* Mode + Launch row */}
//             <div className="flex gap-2">
//               {/* Fast */}
//               <button
//                 onClick={() => setFastMode(true)}
//                 className={cn(
//                   "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
//                   "border text-xs font-semibold transition-all duration-200",
//                   fastMode
//                     ? "border-gold-500/30 bg-gold-500/8 text-gold-400 shadow-gold-sm"
//                     : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60 hover:border-white/[0.12]",
//                 )}
//               >
//                 <Zap size={13} className={fastMode ? "text-gold-400" : ""} />
//                 Fast Mode
//                 <span
//                   className={cn(
//                     "text-[10px]",
//                     fastMode ? "text-gold-600" : "text-white/20",
//                   )}
//                 >
//                   3 agents · ~30s
//                 </span>
//               </button>

//               {/* Deep */}
//               <button
//                 onClick={() => setFastMode(false)}
//                 className={cn(
//                   "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
//                   "border text-xs font-semibold transition-all duration-200",
//                   !fastMode
//                     ? "border-gold-500/30 bg-gold-500/8 text-gold-400 shadow-gold-sm"
//                     : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60 hover:border-white/[0.12]",
//                 )}
//               >
//                 <Brain size={13} className={!fastMode ? "text-gold-400" : ""} />
//                 Deep Mode
//                 <span
//                   className={cn(
//                     "text-[10px]",
//                     !fastMode ? "text-gold-600" : "text-white/20",
//                   )}
//                 >
//                   6 agents
//                 </span>
//               </button>

//               {/* Launch */}
//               <button
//                 onClick={handleLaunch}
//                 disabled={!idea.trim() || launching}
//                 className={cn(
//                   "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
//                   "font-bold text-sm transition-all duration-200",
//                   "bg-gold-gradient text-[#111] shadow-gold-md",
//                   "hover:shadow-gold-lg hover:scale-[1.01]",
//                   "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
//                 )}
//               >
//                 {launching ? (
//                   <>
//                     <span className="w-3.5 h-3.5 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
//                     Launching…
//                   </>
//                 ) : (
//                   <>
//                     <Send size={14} /> Launch
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Form panel */}
//         {activeTab === "form" && (
//           <div className="animate-fade-in rounded-xl border border-white/[0.07] bg-white/[0.02] p-8 flex flex-col items-center text-center gap-5">
//             {/* Visual grid of fields */}
//             <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
//               {[
//                 "Startup Name",
//                 "Problem",
//                 "Solution",
//                 "Stage",
//                 "Market",
//                 "Audience",
//                 "Revenue",
//                 "Platform",
//                 "Legal Risk",
//               ].map((f, i) => (
//                 <div
//                   key={f}
//                   className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-2"
//                 >
//                   <span className="font-fira text-[9px] text-white/25 tracking-wide block">
//                     {f}
//                   </span>
//                   <div
//                     className={cn(
//                       "h-1.5 rounded-full mt-1.5",
//                       i < 3 ? "bg-gold-500/20 w-3/4" : "bg-white/[0.06] w-1/2",
//                     )}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div>
//               <p className="text-white/70 font-semibold text-sm mb-1">
//                 11-field structured intake
//               </p>
//               <p className="text-white/25 text-xs leading-relaxed max-w-xs">
//                 Answer targeted questions — we generate the optimal prompt for
//                 all 6 agents.
//               </p>
//             </div>

//             <button
//               onClick={() => {
//                 setInputMode("form");
//                 setStage("intake");
//               }}
//               className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-gradient text-[#111] font-bold text-sm shadow-gold-md hover:shadow-gold-lg hover:scale-[1.02] transition-all duration-200"
//             >
//               <FileText size={14} /> Open Intake Form <ArrowRight size={13} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Stats row */}
//       <div
//         className="flex items-center gap-6 mt-10 animate-fade-in"
//         style={{ animationDelay: "0.2s" }}
//       >
//         {[
//           { value: "6", label: "AI Agents" },
//           { value: "4", label: "Data Sources" },
//           { value: "7.5", label: "Consensus Threshold" },
//           { value: "<3m", label: "Full Validation" },
//         ].map(({ value, label }) => (
//           <div key={label} className="text-center">
//             <div className="text-gold-400 font-bold text-lg font-fira leading-none">
//               {value}
//             </div>
//             <div className="data-label mt-1">{label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Feature cards */}
//       <div
//         className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl w-full mt-10 animate-fade-in"
//         style={{ animationDelay: "0.25s" }}
//       >
//         {[
//           {
//             Icon: Eye,
//             title: "Perceive",
//             desc: "Web search, GitHub, Reddit, Google Trends, and patent databases — all live.",
//             tag: "DATA LAYER",
//             accent: "#60a5fa",
//           },
//           {
//             Icon: Cpu,
//             title: "Reason",
//             desc: "4-phase deliberation: proposal, critique, revision, and consensus synthesis.",
//             tag: "CONSENSUS",
//             accent: "#fbbf24",
//           },
//           {
//             Icon: Rocket,
//             title: "Act",
//             desc: "PDF plan, legal report, CFO charts, influencer list, GitHub repo.",
//             tag: "DEPLOYMENT",
//             accent: "#a78bfa",
//           },
//         ].map(({ Icon, title, desc, tag, accent }) => (
//           <div
//             key={title}
//             className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all duration-300 overflow-hidden group"
//           >
//             {/* Accent corner */}
//             <div
//               className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               style={{
//                 background: `radial-gradient(circle at top right, ${accent}15, transparent 70%)`,
//               }}
//             />
//             <div
//               className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
//               style={{
//                 background: `${accent}12`,
//                 border: `1px solid ${accent}20`,
//               }}
//             >
//               <Icon size={16} style={{ color: accent }} />
//             </div>
//             <div className="text-white/80 font-bold text-sm mb-2">{title}</div>
//             <p className="text-white/25 text-[11px] leading-relaxed font-fira mb-4">
//               {desc}
//             </p>
//             <div className="flex items-center gap-2">
//               <div
//                 className="h-px flex-1"
//                 style={{ background: `${accent}20` }}
//               />
//               <span
//                 className="font-fira text-[9px] tracking-widest"
//                 style={{ color: `${accent}60` }}
//               >
//                 {tag}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Ticker */}
//       <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#111111]/98 border-t border-white/[0.04] overflow-hidden flex items-center">
//         <div className="flex items-center whitespace-nowrap animate-ticker">
//           {doubled.map((msg, i) => (
//             <span
//               key={i}
//               className="inline-flex items-center gap-2.5 px-8 font-fira text-[10px]
//                 text-white/20 border-r border-white/[0.04] tracking-wide"
//             >
//               <span className="w-1 h-1 rounded-full bg-gold-500/50 flex-shrink-0" />
//               {msg}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// // }

// "use client";
// import { useState } from "react";
// import {
//   Send,
//   Zap,
//   Brain,
//   Eye,
//   Cpu,
//   Rocket,
//   FileText,
//   ArrowRight,
// } from "lucide-react";
// import { useAppStore } from "@/store/useAppStore";
// import { useSimulation } from "@/hooks/useSimulation";
// import { TICKER_MESSAGES, cn } from "@/lib/utils";

// // Small reusable tab button
// function TabBtn({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={cn(
//         "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold",
//         "rounded-lg transition-all duration-200",
//         active
//           ? "bg-gold-gradient text-[#111] shadow-gold-sm"
//           : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]",
//       )}
//     >
//       {children}
//     </button>
//   );
// }

// // Agent pill
// function AgentPill({ emoji, label, color }) {
//   return (
//     <div
//       className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium font-fira"
//       style={{ borderColor: `${color}30`, background: `${color}10`, color }}
//     >
//       {emoji} {label}
//     </div>
//   );
// }

// export default function LandingStage() {
//   const { idea, setIdea, fastMode, setFastMode, setInputMode, setStage } =
//     useAppStore();
//   const { run } = useSimulation();
//   const [activeTab, setActiveTab] = useState("prompt");
//   const [launching, setLaunching] = useState(false);

//   const handleLaunch = async () => {
//     if (!idea.trim() || launching) return;
//     setLaunching(true);
//     await run();
//     setLaunching(false);
//   };

//   const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES];

//   const agents = [
//     { emoji: "🧠", label: "CEO", color: "#818cf8" },
//     { emoji: "⚡", label: "Dev", color: "#60a5fa" },
//     { emoji: "📈", label: "CFO", color: "#34d399" },
//     { emoji: "🌐", label: "CMO", color: "#fbbf24" },
//     { emoji: "⚠️", label: "Risk", color: "#f87171" },
//     { emoji: "⚖️", label: "Legal", color: "#a78bfa" },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-28 pt-20 bg-obsidian-radial bg-obsidian-radial2">
//       {/* Agent pills row */}
//       <div className="flex items-center gap-2 flex-wrap justify-center mb-8 animate-fade-in">
//         <span className="data-label mr-1">6 AGENTS</span>
//         {agents.map((a) => (
//           <AgentPill key={a.label} {...a} />
//         ))}
//       </div>

//       {/* Hero */}
//       <div className="text-center max-w-4xl mx-auto mb-10 animate-fade-in-up">
//         <h1 className="text-5xl md:text-[4.5rem] font-extrabold tracking-tight leading-[1.04] mb-5">
//           <span className="text-white">Autonomous Business</span>
//           <br />
//           <span
//             className="text-transparent bg-clip-text"
//             style={{
//               backgroundImage:
//                 "linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #f59e0b 70%, #d97706 100%)",
//             }}
//           >
//             Validation Engine.
//           </span>
//         </h1>
//         <p className="text-white/40 text-lg leading-relaxed max-w-lg mx-auto font-light">
//           6 AI agents debate your startup with live market data — then deliver a
//           plan, legal check, and GitHub repo.
//         </p>
//       </div>

//       {/* Input card */}
//       <div
//         className="w-full max-w-[640px] animate-fade-in-up"
//         style={{ animationDelay: "0.1s" }}
//       >
//         {/* Tab switcher */}
//         <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-3">
//           <TabBtn
//             active={activeTab === "prompt"}
//             onClick={() => setActiveTab("prompt")}
//           >
//             <Zap size={12} /> Quick Prompt
//           </TabBtn>
//           <TabBtn
//             active={activeTab === "form"}
//             onClick={() => setActiveTab("form")}
//           >
//             <FileText size={12} /> Build with Form
//           </TabBtn>
//         </div>

//         {/* Prompt panel */}
//         {activeTab === "prompt" && (
//           <div className="animate-fade-in">
//             {/* Terminal textarea */}
//             <div className="relative rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden mb-3 hover-gold transition-all duration-300 focus-within:border-gold-500/25 focus-within:shadow-gold-sm">
//               {/* Top bar */}
//               <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
//                 <div className="flex gap-1.5">
//                   <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
//                   <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
//                   <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
//                 </div>
//                 <span className="font-fira text-[10px] text-white/20 tracking-widest ml-1">
//                   FOUNDRAI TERMINAL · v2.0
//                 </span>
//                 <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse-dot" />
//               </div>

//               <textarea
//                 value={idea}
//                 onChange={(e) => setIdea(e.target.value)}
//                 placeholder="Describe your startup idea in plain English…"
//                 rows={5}
//                 className="w-full bg-transparent px-5 py-4 text-white/80 placeholder-white/15 font-fira text-sm resize-none outline-none leading-relaxed"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && e.metaKey) handleLaunch();
//                 }}
//               />

//               <div className="px-5 py-2.5 border-t border-white/[0.05] flex items-center justify-between">
//                 <span className="font-fira text-[10px] text-white/20 tracking-widest">
//                   ⌘ + ↵ to launch
//                 </span>
//                 <span className="font-fira text-[10px] text-white/15">
//                   {idea.length} chars
//                 </span>
//               </div>
//             </div>

//             {/* Mode + Launch row */}
//             <div className="flex gap-2">
//               {/* Fast */}
//               <button
//                 onClick={() => setFastMode(true)}
//                 className={cn(
//                   "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
//                   "border text-xs font-semibold transition-all duration-200",
//                   fastMode
//                     ? "border-gold-500/30 bg-gold-500/8 text-gold-400 shadow-gold-sm"
//                     : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60 hover:border-white/[0.12]",
//                 )}
//               >
//                 <Zap size={13} className={fastMode ? "text-gold-400" : ""} />
//                 Fast Mode
//                 <span
//                   className={cn(
//                     "text-[10px]",
//                     fastMode ? "text-gold-600" : "text-white/20",
//                   )}
//                 >
//                   3 agents · ~30s
//                 </span>
//               </button>

//               {/* Deep */}
//               <button
//                 onClick={() => setFastMode(false)}
//                 className={cn(
//                   "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
//                   "border text-xs font-semibold transition-all duration-200",
//                   !fastMode
//                     ? "border-gold-500/30 bg-gold-500/8 text-gold-400 shadow-gold-sm"
//                     : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60 hover:border-white/[0.12]",
//                 )}
//               >
//                 <Brain size={13} className={!fastMode ? "text-gold-400" : ""} />
//                 Deep Mode
//                 <span
//                   className={cn(
//                     "text-[10px]",
//                     !fastMode ? "text-gold-600" : "text-white/20",
//                   )}
//                 >
//                   6 agents
//                 </span>
//               </button>

//               {/* Launch */}
//               <button
//                 onClick={handleLaunch}
//                 disabled={!idea.trim() || launching}
//                 className={cn(
//                   "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
//                   "font-bold text-sm transition-all duration-200",
//                   "bg-gold-gradient text-[#111] shadow-gold-md",
//                   "hover:shadow-gold-lg hover:scale-[1.01]",
//                   "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
//                 )}
//               >
//                 {launching ? (
//                   <>
//                     <span className="w-3.5 h-3.5 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
//                     Launching…
//                   </>
//                 ) : (
//                   <>
//                     <Send size={14} /> Launch
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Form panel */}
//         {activeTab === "form" && (
//           <div className="animate-fade-in rounded-xl border border-white/[0.07] bg-white/[0.02] p-8 flex flex-col items-center text-center gap-5">
//             {/* Visual grid of fields */}
//             <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
//               {[
//                 "Startup Name",
//                 "Problem",
//                 "Solution",
//                 "Stage",
//                 "Market",
//                 "Audience",
//                 "Revenue",
//                 "Platform",
//                 "Legal Risk",
//               ].map((f, i) => (
//                 <div
//                   key={f}
//                   className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-2"
//                 >
//                   <span className="font-fira text-[9px] text-white/25 tracking-wide block">
//                     {f}
//                   </span>
//                   <div
//                     className={cn(
//                       "h-1.5 rounded-full mt-1.5",
//                       i < 3 ? "bg-gold-500/20 w-3/4" : "bg-white/[0.06] w-1/2",
//                     )}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div>
//               <p className="text-white/70 font-semibold text-sm mb-1">
//                 11-field structured intake
//               </p>
//               <p className="text-white/25 text-xs leading-relaxed max-w-xs">
//                 Answer targeted questions — we generate the optimal prompt for
//                 all 6 agents.
//               </p>
//             </div>

//             <button
//               onClick={() => {
//                 setInputMode("form");
//                 setStage("intake");
//               }}
//               className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-gradient text-[#111] font-bold text-sm shadow-gold-md hover:shadow-gold-lg hover:scale-[1.02] transition-all duration-200"
//             >
//               <FileText size={14} /> Open Intake Form <ArrowRight size={13} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Stats row */}
//       <div
//         className="flex items-center gap-6 mt-10 animate-fade-in"
//         style={{ animationDelay: "0.2s" }}
//       >
//         {[
//           { value: "6", label: "AI Agents" },
//           { value: "4", label: "Data Sources" },
//           { value: "7.5", label: "Consensus Threshold" },
//           { value: "<3m", label: "Full Validation" },
//         ].map(({ value, label }) => (
//           <div key={label} className="text-center">
//             <div className="text-gold-400 font-bold text-lg font-fira leading-none">
//               {value}
//             </div>
//             <div className="data-label mt-1">{label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Feature cards */}
//       <div
//         className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl w-full mt-10 animate-fade-in"
//         style={{ animationDelay: "0.25s" }}
//       >
//         {[
//           {
//             Icon: Eye,
//             title: "Perceive",
//             desc: "Web search, GitHub, Reddit, Google Trends, and patent databases — all live.",
//             tag: "DATA LAYER",
//             accent: "#60a5fa",
//           },
//           {
//             Icon: Cpu,
//             title: "Reason",
//             desc: "4-phase deliberation: proposal, critique, revision, and consensus synthesis.",
//             tag: "CONSENSUS",
//             accent: "#fbbf24",
//           },
//           {
//             Icon: Rocket,
//             title: "Act",
//             desc: "PDF plan, legal report, CFO charts, influencer list, GitHub repo.",
//             tag: "DEPLOYMENT",
//             accent: "#a78bfa",
//           },
//         ].map(({ Icon, title, desc, tag, accent }) => (
//           <div
//             key={title}
//             className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all duration-300 overflow-hidden group"
//           >
//             {/* Accent corner */}
//             <div
//               className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               style={{
//                 background: `radial-gradient(circle at top right, ${accent}15, transparent 70%)`,
//               }}
//             />
//             <div
//               className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
//               style={{
//                 background: `${accent}12`,
//                 border: `1px solid ${accent}20`,
//               }}
//             >
//               <Icon size={16} style={{ color: accent }} />
//             </div>
//             <div className="text-white/80 font-bold text-sm mb-2">{title}</div>
//             <p className="text-white/25 text-[11px] leading-relaxed font-fira mb-4">
//               {desc}
//             </p>
//             <div className="flex items-center gap-2">
//               <div
//                 className="h-px flex-1"
//                 style={{ background: `${accent}20` }}
//               />
//               <span
//                 className="font-fira text-[9px] tracking-widest"
//                 style={{ color: `${accent}60` }}
//               >
//                 {tag}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Ticker */}
//       <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#111111]/98 border-t border-white/[0.04] overflow-hidden flex items-center">
//         <div className="flex items-center whitespace-nowrap animate-ticker">
//           {doubled.map((msg, i) => (
//             <span
//               key={i}
//               className="inline-flex items-center gap-2.5 px-8 font-fira text-[10px] text-white/20 border-r border-white/[0.04] tracking-wide"
//             >
//               <span className="w-1 h-1 rounded-full bg-gold-500/50 flex-shrink-0" />
//               {msg}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import {
//   Send,
//   Zap,
//   Brain,
//   Eye,
//   Cpu,
//   Rocket,
//   FileText,
//   ArrowRight,
// } from "lucide-react";
// import { useAppStore } from "@/store/useAppStore";
// import { useSimulation } from "@/hooks/useSimulation";
// import { TICKER_MESSAGES } from "@/lib/utils";

// const AGENTS = [
//   { emoji: "🧠", label: "CEO", color: "#818cf8" },
//   { emoji: "⚡", label: "Dev", color: "#60a5fa" },
//   { emoji: "📈", label: "CFO", color: "#34d399" },
//   { emoji: "🌐", label: "CMO", color: "#fbbf24" },
//   { emoji: "⚠️", label: "Risk", color: "#f87171" },
//   { emoji: "⚖️", label: "Legal", color: "#a78bfa" },
// ];

// const FEATURES = [
//   {
//     Icon: Eye,
//     title: "Perceive",
//     desc: "Web search, GitHub, Reddit, Google Trends, patent databases — all live.",
//     tag: "DATA LAYER",
//     accent: "#60a5fa",
//   },
//   {
//     Icon: Cpu,
//     title: "Reason",
//     desc: "4-phase deliberation: proposal, critique, revision, consensus.",
//     tag: "CONSENSUS",
//     accent: "#fbbf24",
//   },
//   {
//     Icon: Rocket,
//     title: "Act",
//     desc: "PDF plan, legal report, CFO charts, influencer list, GitHub repo.",
//     tag: "DEPLOYMENT",
//     accent: "#a78bfa",
//   },
// ];

// const STATS = [
//   { value: "6", label: "AI Agents" },
//   { value: "5+", label: "Data Sources" },
//   { value: "7.5", label: "Consensus Threshold" },
//   { value: "<3m", label: "Full Validation" },
// ];

// export default function LandingStage() {
//   const { idea, setIdea, fastMode, setFastMode, setInputMode, setStage } =
//     useAppStore();
//   const { run } = useSimulation();
//   const [tab, setTab] = useState("prompt");
//   const [launching, setLaunching] = useState(false);

//   const handleLaunch = async () => {
//     if (!idea.trim() || launching) return;
//     setLaunching(true);
//     await run();
//     setLaunching(false);
//   };

//   const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES];

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center px-6 pb-28 pt-20"
//       style={{
//         background:
//           "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234,179,8,0.05) 0%, transparent 60%), #111111",
//       }}
//     >
//       {/* Agent pills */}
//       <div className="flex items-center gap-2 flex-wrap justify-center mb-8 animate-fade-in">
//         <span className="data-label mr-2">6 AGENTS ACTIVE</span>
//         {AGENTS.map((a) => (
//           <div
//             key={a.label}
//             className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium font-fira"
//             style={{
//               border: `1px solid ${a.color}30`,
//               background: `${a.color}10`,
//               color: a.color,
//             }}
//           >
//             {a.emoji} {a.label}
//           </div>
//         ))}
//       </div>

//       {/* Hero text */}
//       <div className="text-center max-w-4xl mx-auto mb-10 animate-fade-in-up">
//         <h1
//           className="font-extrabold tracking-tight leading-[1.04] mb-5"
//           style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
//         >
//           <span style={{ color: "#ede8dc" }}>Autonomous Business</span>
//           <br />
//           <span
//             style={{
//               background:
//                 "linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #f59e0b 80%)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//             }}
//           >
//             Validation Engine.
//           </span>
//         </h1>
//         <p
//           className="text-lg leading-relaxed max-w-lg mx-auto"
//           style={{ color: "rgba(237,232,220,0.4)", fontWeight: 300 }}
//         >
//           6 AI agents debate your startup with live market data — then deliver a
//           validated plan, legal check, and GitHub repo.
//         </p>
//       </div>

//       {/* Input card */}
//       <div
//         className="w-full max-w-[640px] animate-fade-in-up"
//         style={{ animationDelay: "0.1s" }}
//       >
//         {/* Tab switcher */}
//         <div
//           className="flex gap-1 p-1 rounded-xl mb-3"
//           style={{
//             background: "rgba(255,255,255,0.03)",
//             border: "1px solid rgba(255,255,255,0.06)",
//           }}
//         >
//           {[
//             { key: "prompt", icon: <Zap size={12} />, label: "Quick Prompt" },
//             {
//               key: "form",
//               icon: <FileText size={12} />,
//               label: "Build with Form",
//             },
//           ].map(({ key, icon, label }) => (
//             <button
//               key={key}
//               onClick={() => setTab(key)}
//               className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
//               style={
//                 tab === key
//                   ? {
//                       background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
//                       color: "#111",
//                       boxShadow: "0 0 0 1px rgba(234,179,8,0.25)",
//                     }
//                   : { color: "rgba(255,255,255,0.3)" }
//               }
//             >
//               {icon} {label}
//             </button>
//           ))}
//         </div>

//         {/* Prompt tab */}
//         {tab === "prompt" && (
//           <div className="animate-fade-in">
//             {/* Terminal box */}
//             <div
//               className="rounded-xl overflow-hidden mb-3 transition-all duration-300"
//               style={{
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 background: "rgba(255,255,255,0.02)",
//               }}
//             >
//               {/* macOS bar */}
//               <div
//                 className="flex items-center gap-2 px-4 py-3"
//                 style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
//               >
//                 <div className="flex gap-1.5">
//                   {[
//                     "rgba(255,95,87,0.7)",
//                     "rgba(255,189,46,0.7)",
//                     "rgba(40,200,64,0.7)",
//                   ].map((c, i) => (
//                     <span
//                       key={i}
//                       className="w-2.5 h-2.5 rounded-full"
//                       style={{ background: c }}
//                     />
//                   ))}
//                 </div>
//                 <span
//                   className="font-fira text-[10px] tracking-widest ml-2"
//                   style={{ color: "rgba(255,255,255,0.2)" }}
//                 >
//                   FOUNDRAI TERMINAL · v2.0
//                 </span>
//                 <span
//                   className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse-dot"
//                   style={{ background: "#fbbf24" }}
//                 />
//               </div>

//               <textarea
//                 value={idea}
//                 onChange={(e) => setIdea(e.target.value)}
//                 placeholder="Describe your startup idea in plain English…"
//                 rows={5}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && e.metaKey) handleLaunch();
//                 }}
//                 className="w-full bg-transparent font-fira text-sm resize-none outline-none leading-relaxed"
//                 style={{
//                   padding: "16px 20px",
//                   color: "rgba(237,232,220,0.8)",
//                   caretColor: "#fbbf24",
//                 }}
//               />

//               <div
//                 className="flex items-center justify-between px-5 py-2.5"
//                 style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
//               >
//                 <span
//                   className="font-fira text-[10px] tracking-widest"
//                   style={{ color: "rgba(255,255,255,0.2)" }}
//                 >
//                   ⌘ + ↵ to launch
//                 </span>
//                 <span
//                   className="font-fira text-[10px]"
//                   style={{ color: "rgba(255,255,255,0.15)" }}
//                 >
//                   {idea.length} chars
//                 </span>
//               </div>
//             </div>

//             {/* Mode + Launch */}
//             <div className="flex gap-2">
//               {[
//                 {
//                   key: "fast",
//                   label: "Fast Mode",
//                   sub: "3 agents · ~30s",
//                   icon: <Zap size={13} />,
//                   active: fastMode,
//                   onClick: () => setFastMode(true),
//                 },
//                 {
//                   key: "deep",
//                   label: "Deep Mode",
//                   sub: "6 agents",
//                   icon: <Brain size={13} />,
//                   active: !fastMode,
//                   onClick: () => setFastMode(false),
//                 },
//               ].map(({ key, label, sub, icon, active, onClick }) => (
//                 <button
//                   key={key}
//                   onClick={onClick}
//                   className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all duration-200"
//                   style={
//                     active
//                       ? {
//                           border: "1px solid rgba(234,179,8,0.35)",
//                           background: "rgba(234,179,8,0.07)",
//                           color: "#fbbf24",
//                           boxShadow: "0 0 0 1px rgba(234,179,8,0.15)",
//                         }
//                       : {
//                           border: "1px solid rgba(255,255,255,0.07)",
//                           background: "rgba(255,255,255,0.02)",
//                           color: "rgba(255,255,255,0.3)",
//                         }
//                   }
//                 >
//                   <span style={active ? { color: "#fbbf24" } : {}}>{icon}</span>
//                   {label}
//                   <span
//                     className="text-[10px]"
//                     style={{
//                       color: active
//                         ? "rgba(234,179,8,0.5)"
//                         : "rgba(255,255,255,0.18)",
//                     }}
//                   >
//                     {sub}
//                   </span>
//                 </button>
//               ))}

//               <button
//                 onClick={handleLaunch}
//                 disabled={!idea.trim() || launching}
//                 className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200"
//                 style={{
//                   background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
//                   color: "#111",
//                   boxShadow:
//                     "0 0 0 1px rgba(234,179,8,0.35), 0 4px 20px rgba(234,179,8,0.12)",
//                   opacity: !idea.trim() || launching ? 0.35 : 1,
//                   cursor: !idea.trim() || launching ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {launching ? (
//                   <>
//                     <span
//                       className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
//                       style={{
//                         borderColor: "rgba(17,17,17,0.3)",
//                         borderTopColor: "#111",
//                       }}
//                     />{" "}
//                     Launching…
//                   </>
//                 ) : (
//                   <>
//                     <Send size={14} /> Launch
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Form tab */}
//         {tab === "form" && (
//           <div
//             className="animate-fade-in rounded-xl p-8 flex flex-col items-center text-center gap-5"
//             style={{
//               border: "1px solid rgba(255,255,255,0.07)",
//               background: "rgba(255,255,255,0.02)",
//             }}
//           >
//             {/* Field preview grid */}
//             <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
//               {[
//                 "Startup Name",
//                 "Problem",
//                 "Solution",
//                 "Stage",
//                 "Market",
//                 "Audience",
//                 "Revenue",
//                 "Platform",
//                 "Legal Risk",
//               ].map((f, i) => (
//                 <div
//                   key={f}
//                   className="rounded-lg px-2.5 py-2.5"
//                   style={{
//                     border: "1px solid rgba(255,255,255,0.06)",
//                     background: "rgba(255,255,255,0.02)",
//                   }}
//                 >
//                   <span
//                     className="font-fira text-[9px] tracking-wide block"
//                     style={{ color: "rgba(255,255,255,0.25)" }}
//                   >
//                     {f}
//                   </span>
//                   <div
//                     className="h-1 rounded-full mt-1.5"
//                     style={{
//                       width: i < 3 ? "75%" : "50%",
//                       background:
//                         i < 3
//                           ? "rgba(234,179,8,0.25)"
//                           : "rgba(255,255,255,0.06)",
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div>
//               <p
//                 className="font-semibold text-sm mb-1"
//                 style={{ color: "rgba(237,232,220,0.8)" }}
//               >
//                 11-field structured intake
//               </p>
//               <p
//                 className="text-xs leading-relaxed max-w-xs"
//                 style={{ color: "rgba(255,255,255,0.25)" }}
//               >
//                 Answer targeted questions — we generate the optimal prompt for
//                 all 6 agents.
//               </p>
//             </div>

//             <button
//               onClick={() => {
//                 setInputMode("form");
//                 setStage("intake");
//               }}
//               className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
//               style={{
//                 background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
//                 color: "#111",
//                 boxShadow:
//                   "0 0 0 1px rgba(234,179,8,0.35), 0 4px 20px rgba(234,179,8,0.12)",
//               }}
//             >
//               <FileText size={14} /> Open Intake Form <ArrowRight size={13} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Stats */}
//       <div
//         className="flex items-center gap-8 mt-10 animate-fade-in"
//         style={{ animationDelay: "0.2s" }}
//       >
//         {STATS.map(({ value, label }) => (
//           <div key={label} className="text-center">
//             <div
//               className="font-bold text-lg font-fira leading-none"
//               style={{ color: "#fbbf24" }}
//             >
//               {value}
//             </div>
//             <div className="data-label mt-1">{label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Feature cards */}
//       <div
//         className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl w-full mt-8 animate-fade-in"
//         style={{ animationDelay: "0.25s" }}
//       >
//         {FEATURES.map(({ Icon, title, desc, tag, accent }) => (
//           <div
//             key={title}
//             className="relative rounded-xl p-5 overflow-hidden group transition-all duration-300"
//             style={{
//               border: "1px solid rgba(255,255,255,0.06)",
//               background: "rgba(255,255,255,0.02)",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.borderColor = `${accent}25`)
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
//             }
//           >
//             <div
//               className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
//               style={{
//                 background: `${accent}12`,
//                 border: `1px solid ${accent}20`,
//               }}
//             >
//               <Icon size={16} style={{ color: accent }} />
//             </div>
//             <div
//               className="font-bold text-sm mb-2"
//               style={{ color: "rgba(237,232,220,0.85)" }}
//             >
//               {title}
//             </div>
//             <p
//               className="text-[11px] leading-relaxed font-fira mb-4"
//               style={{ color: "rgba(255,255,255,0.25)" }}
//             >
//               {desc}
//             </p>
//             <div className="flex items-center gap-2">
//               <div
//                 className="h-px flex-1"
//                 style={{ background: `${accent}20` }}
//               />
//               <span
//                 className="font-fira text-[9px] tracking-widest"
//                 style={{ color: `${accent}60` }}
//               >
//                 {tag}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Ticker */}
//       <div
//         className="fixed bottom-0 left-0 right-0 h-8 overflow-hidden flex items-center"
//         style={{
//           background: "rgba(17,17,17,0.98)",
//           borderTop: "1px solid rgba(255,255,255,0.04)",
//         }}
//       >
//         <div className="flex items-center whitespace-nowrap animate-ticker">
//           {doubled.map((msg, i) => (
//             <span
//               key={i}
//               className="inline-flex items-center gap-2.5 px-8 font-fira text-[10px] tracking-wide"
//               style={{
//                 color: "rgba(255,255,255,0.2)",
//                 borderRight: "1px solid rgba(255,255,255,0.04)",
//               }}
//             >
//               <span
//                 className="w-1 h-1 rounded-full flex-shrink-0"
//                 style={{ background: "rgba(251,191,36,0.5)" }}
//               />
//               {msg}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import {
  Send,
  Zap,
  Brain,
  Eye,
  Cpu,
  Rocket,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSimulation } from "@/hooks/useSimulation";
import { TICKER_MESSAGES } from "@/lib/utils";
import ParticleBackground from "@/components/ui/ParticleBackground"; // <-- Imported here

const AGENTS = [
  { emoji: "🧠", label: "CEO", color: "#818cf8" },
  { emoji: "⚡", label: "Dev", color: "#60a5fa" },
  { emoji: "📈", label: "CFO", color: "#34d399" },
  { emoji: "🌐", label: "CMO", color: "#fbbf24" },
  { emoji: "⚠️", label: "Risk", color: "#f87171" },
  { emoji: "⚖️", label: "Legal", color: "#a78bfa" },
];

const FEATURES = [
  {
    Icon: Eye,
    title: "Perceive",
    desc: "Web search, GitHub, Reddit, Google Trends, patent databases — all live.",
    tag: "DATA LAYER",
    accent: "#60a5fa",
  },
  {
    Icon: Cpu,
    title: "Reason",
    desc: "4-phase deliberation: proposal, critique, revision, consensus.",
    tag: "CONSENSUS",
    accent: "#fbbf24",
  },
  {
    Icon: Rocket,
    title: "Act",
    desc: "PDF plan, legal report, CFO charts, influencer list, GitHub repo.",
    tag: "DEPLOYMENT",
    accent: "#a78bfa",
  },
];

const STATS = [
  { value: "6", label: "AI Agents" },
  { value: "5+", label: "Data Sources" },
  { value: "7.5", label: "Consensus Threshold" },
  { value: "<3m", label: "Full Validation" },
];

export default function LandingStage() {
  const { idea, setIdea, fastMode, setFastMode, setInputMode, setStage } =
    useAppStore();
  const { run } = useSimulation();
  const [tab, setTab] = useState("prompt");
  const [launching, setLaunching] = useState(false);

  const handleLaunch = async () => {
    if (!idea.trim() || launching) return;
    setLaunching(true);
    await run();
    setLaunching(false);
  };

  const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES];

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-28 pt-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234,179,8,0.05) 0%, transparent 60%), #111111",
      }}
    >
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main UI Wrapper (z-10 ensures it sits above particles) */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Agent pills */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-8 animate-fade-in">
          <span className="data-label mr-2">6 AGENTS ACTIVE</span>
          {AGENTS.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium font-fira"
              style={{
                border: `1px solid ${a.color}30`,
                background: `${a.color}10`,
                color: a.color,
              }}
            >
              {a.emoji} {a.label}
            </div>
          ))}
        </div>

        {/* Hero text */}
        <div className="text-center max-w-4xl mx-auto mb-10 animate-fade-in-up">
          <h1
            className="font-extrabold tracking-tight leading-[1.04] mb-5"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
          >
            <span style={{ color: "#ede8dc" }}>Autonomous Business</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #f59e0b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Validation Engine.
            </span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-lg mx-auto"
            style={{ color: "rgba(237,232,220,0.4)", fontWeight: 300 }}
          >
            6 AI agents debate your startup with live market data — then deliver
            a validated plan, legal check, and GitHub repo.
          </p>
        </div>

        {/* Input card */}
        <div
          className="w-full max-w-[640px] animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Tab switcher */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-3 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {[
              { key: "prompt", icon: <Zap size={12} />, label: "Quick Prompt" },
              {
                key: "form",
                icon: <FileText size={12} />,
                label: "Build with Form",
              },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={
                  tab === key
                    ? {
                        background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                        color: "#111",
                        boxShadow: "0 0 0 1px rgba(234,179,8,0.25)",
                      }
                    : { color: "rgba(255,255,255,0.3)" }
                }
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Prompt tab */}
          {tab === "prompt" && (
            <div className="animate-fade-in backdrop-blur-md">
              {/* Terminal box */}
              <div
                className="rounded-xl overflow-hidden mb-3 transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(17,17,17,0.6)",
                }}
              >
                {/* macOS bar */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex gap-1.5">
                    {[
                      "rgba(255,95,87,0.7)",
                      "rgba(255,189,46,0.7)",
                      "rgba(40,200,64,0.7)",
                    ].map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <span
                    className="font-fira text-[10px] tracking-widest ml-2"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    FOUNDRAI TERMINAL · v2.0
                  </span>
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse-dot"
                    style={{ background: "#fbbf24" }}
                  />
                </div>

                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your startup idea in plain English…"
                  rows={5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) handleLaunch();
                  }}
                  className="w-full bg-transparent font-fira text-sm resize-none outline-none leading-relaxed"
                  style={{
                    padding: "16px 20px",
                    color: "rgba(237,232,220,0.8)",
                    caretColor: "#fbbf24",
                  }}
                />

                <div
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="font-fira text-[10px] tracking-widest"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    ⌘ + ↵ to launch
                  </span>
                  <span
                    className="font-fira text-[10px]"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  >
                    {idea.length} chars
                  </span>
                </div>
              </div>

              {/* Mode + Launch */}
              <div className="flex gap-2">
                {[
                  {
                    key: "fast",
                    label: "Fast Mode",
                    sub: "3 agents · ~30s",
                    icon: <Zap size={13} />,
                    active: fastMode,
                    onClick: () => setFastMode(true),
                  },
                  {
                    key: "deep",
                    label: "Deep Mode",
                    sub: "6 agents",
                    icon: <Brain size={13} />,
                    active: !fastMode,
                    onClick: () => setFastMode(false),
                  },
                ].map(({ key, label, sub, icon, active, onClick }) => (
                  <button
                    key={key}
                    onClick={onClick}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-md"
                    style={
                      active
                        ? {
                            border: "1px solid rgba(234,179,8,0.35)",
                            background: "rgba(234,179,8,0.07)",
                            color: "#fbbf24",
                            boxShadow: "0 0 0 1px rgba(234,179,8,0.15)",
                          }
                        : {
                            border: "1px solid rgba(255,255,255,0.07)",
                            background: "rgba(17,17,17,0.6)",
                            color: "rgba(255,255,255,0.3)",
                          }
                    }
                  >
                    <span style={active ? { color: "#fbbf24" } : {}}>
                      {icon}
                    </span>
                    {label}
                    <span
                      className="text-[10px]"
                      style={{
                        color: active
                          ? "rgba(234,179,8,0.5)"
                          : "rgba(255,255,255,0.18)",
                      }}
                    >
                      {sub}
                    </span>
                  </button>
                ))}

                <button
                  onClick={handleLaunch}
                  disabled={!idea.trim() || launching}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                    color: "#111",
                    boxShadow:
                      "0 0 0 1px rgba(234,179,8,0.35), 0 4px 20px rgba(234,179,8,0.12)",
                    opacity: !idea.trim() || launching ? 0.35 : 1,
                    cursor:
                      !idea.trim() || launching ? "not-allowed" : "pointer",
                  }}
                >
                  {launching ? (
                    <>
                      <span
                        className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                        style={{
                          borderColor: "rgba(17,17,17,0.3)",
                          borderTopColor: "#111",
                        }}
                      />{" "}
                      Launching…
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Launch
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Form tab */}
          {tab === "form" && (
            <div
              className="animate-fade-in rounded-xl p-8 flex flex-col items-center text-center gap-5 backdrop-blur-md"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(17,17,17,0.6)",
              }}
            >
              {/* Field preview grid */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                {[
                  "Startup Name",
                  "Problem",
                  "Solution",
                  "Stage",
                  "Market",
                  "Audience",
                  "Revenue",
                  "Platform",
                  "Legal Risk",
                ].map((f, i) => (
                  <div
                    key={f}
                    className="rounded-lg px-2.5 py-2.5"
                    style={{
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span
                      className="font-fira text-[9px] tracking-wide block"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {f}
                    </span>
                    <div
                      className="h-1 rounded-full mt-1.5"
                      style={{
                        width: i < 3 ? "75%" : "50%",
                        background:
                          i < 3
                            ? "rgba(234,179,8,0.25)"
                            : "rgba(255,255,255,0.06)",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: "rgba(237,232,220,0.8)" }}
                >
                  11-field structured intake
                </p>
                <p
                  className="text-xs leading-relaxed max-w-xs"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Answer targeted questions — we generate the optimal prompt for
                  all 6 agents.
                </p>
              </div>

              <button
                onClick={() => {
                  setInputMode("form");
                  setStage("intake");
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                  color: "#111",
                  boxShadow:
                    "0 0 0 1px rgba(234,179,8,0.35), 0 4px 20px rgba(234,179,8,0.12)",
                }}
              >
                <FileText size={14} /> Open Intake Form <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-8 mt-10 animate-fade-in backdrop-blur-sm"
          style={{ animationDelay: "0.2s" }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-bold text-lg font-fira leading-none"
                style={{ color: "#fbbf24" }}
              >
                {value}
              </div>
              <div className="data-label mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl w-full mt-8 animate-fade-in backdrop-blur-sm"
          style={{ animationDelay: "0.25s" }}
        >
          {FEATURES.map(({ Icon, title, desc, tag, accent }) => (
            <div
              key={title}
              className="relative rounded-xl p-5 overflow-hidden group transition-all duration-300"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(17,17,17,0.5)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `${accent}25`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
              }
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background: `${accent}12`,
                  border: `1px solid ${accent}20`,
                }}
              >
                <Icon size={16} style={{ color: accent }} />
              </div>
              <div
                className="font-bold text-sm mb-2"
                style={{ color: "rgba(237,232,220,0.85)" }}
              >
                {title}
              </div>
              <p
                className="text-[11px] leading-relaxed font-fira mb-4"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {desc}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="h-px flex-1"
                  style={{ background: `${accent}20` }}
                />
                <span
                  className="font-fira text-[9px] tracking-widest"
                  style={{ color: `${accent}60` }}
                >
                  {tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker (z-20 ensures it's above particles and UI) */}
      <div
        className="fixed bottom-0 left-0 right-0 h-8 overflow-hidden flex items-center z-20 backdrop-blur-md"
        style={{
          background: "rgba(17,17,17,0.85)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center whitespace-nowrap animate-ticker">
          {doubled.map((msg, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 px-8 font-fira text-[10px] tracking-wide"
              style={{
                color: "rgba(255,255,255,0.2)",
                borderRight: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "rgba(251,191,36,0.5)" }}
              />
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
