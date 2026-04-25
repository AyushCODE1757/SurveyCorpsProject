// "use client";
// import { Zap, Brain, GitBranch } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useAppStore } from "@/store/useAppStore";
// import { cn } from "@/lib/utils";

// export default function Navbar() {
//   const { fastMode, setFastMode, stage, converged } = useAppStore();

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-xl">
//       {/* Logo */}
//       <div className="flex items-center gap-2 flex-shrink-0">
//         <span className="text-white font-bold text-base tracking-tight">
//           FoundrAI
//         </span>
//         <Badge
//           variant="outline"
//           className="text-indigo-400 border-indigo-500/40 bg-indigo-500/10 text-[10px]"
//         >
//           2.0
//         </Badge>
//         {converged && (
//           <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 gap-1">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
//             VERIFIED
//           </Badge>
//         )}
//       </div>

//       <div className="ml-auto flex items-center gap-3">
//         {/* Fast / Deep toggle */}
//         <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-lg p-1 gap-1">
//           <Button
//             size="sm"
//             variant={fastMode ? "default" : "ghost"}
//             className={cn(
//               "h-7 px-3 text-xs gap-1.5",
//               fastMode
//                 ? "bg-indigo-600 hover:bg-indigo-500"
//                 : "text-slate-400 hover:text-white",
//             )}
//             onClick={() => setFastMode(true)}
//           >
//             <Zap size={11} /> Fast
//           </Button>
//           <Button
//             size="sm"
//             variant={!fastMode ? "default" : "ghost"}
//             className={cn(
//               "h-7 px-3 text-xs gap-1.5",
//               !fastMode
//                 ? "bg-indigo-600 hover:bg-indigo-500"
//                 : "text-slate-400 hover:text-white",
//             )}
//             onClick={() => setFastMode(false)}
//           >
//             <Brain size={11} /> Deep
//           </Button>
//         </div>

//         {/* Live indicator */}
//         <div className="flex items-center gap-1.5">
//           <span
//             className={cn(
//               "w-2 h-2 rounded-full",
//               stage === "active"
//                 ? "bg-emerald-400 animate-pulse-dot"
//                 : "bg-slate-700",
//             )}
//           />
//           <span className="text-xs text-slate-500 font-medium font-fira">
//             {stage === "active" ? "LIVE" : "IDLE"}
//           </span>
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           className="h-7 px-3 text-xs gap-1.5 border-white/[0.08] text-slate-400 hover:text-white"
//         >
//           <GitBranch size={12} /> Star
//         </Button>
//       </div>
//     </header>
//   );
// // }

// "use client";
// import { Zap, Brain, Star } from "lucide-react";
// import { useAppStore } from "@/store/useAppStore";
// import { cn } from "@/lib/utils";

// export default function Navbar() {
//   const { fastMode, setFastMode, stage, converged } = useAppStore();

//   return (
//     <header
//       className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6
//       border-b border-white/[0.05] bg-[#111111]/95 backdrop-blur-xl"
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-3 flex-shrink-0">
//         {/* Gold mark */}
//         <div className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold-sm">
//           <span className="text-[#111] font-black text-sm leading-none">F</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-white font-bold text-[15px] tracking-tight">
//             FoundrAI
//           </span>
//           <span className="font-fira text-[10px] text-gold-500/70 tracking-widest">
//             v2.0
//           </span>
//         </div>

//         {/* Separator */}
//         {converged && (
//           <>
//             <div className="w-px h-4 bg-white/[0.08]" />
//             <div
//               className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
//               bg-emerald-500/10 border border-emerald-500/20"
//             >
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
//               <span className="text-emerald-400 font-fira text-[10px] font-semibold tracking-widest">
//                 VERIFIED
//               </span>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Center — stage breadcrumb */}
//       {stage !== "landing" && (
//         <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 font-fira text-[11px] text-white/20">
//           {["landing", "intake", "active", "results"].map((s, i, arr) => (
//             <span
//               key={s}
//               className={cn(
//                 "capitalize",
//                 stage === s && "text-gold-500",
//                 arr.indexOf(stage) > i && "text-white/40",
//               )}
//             >
//               {s}
//               {i < arr.length - 1 ? " /" : ""}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Right controls */}
//       <div className="ml-auto flex items-center gap-2">
//         {/* Mode toggle */}
//         <div className="flex items-center bg-white/[0.03] border border-white/[0.07] rounded-lg p-0.5 gap-0.5">
//           <button
//             onClick={() => setFastMode(true)}
//             className={cn(
//               "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200",
//               fastMode
//                 ? "bg-gold-gradient text-[#111] shadow-gold-sm"
//                 : "text-white/30 hover:text-white/60",
//             )}
//           >
//             <Zap size={11} /> Fast
//           </button>
//           <button
//             onClick={() => setFastMode(false)}
//             className={cn(
//               "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200",
//               !fastMode
//                 ? "bg-gold-gradient text-[#111] shadow-gold-sm"
//                 : "text-white/30 hover:text-white/60",
//             )}
//           >
//             <Brain size={11} /> Deep
//           </button>
//         </div>

//         {/* Status */}
//         <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
//           <span
//             className={cn(
//               "w-1.5 h-1.5 rounded-full",
//               stage === "active"
//                 ? "bg-emerald-400 animate-pulse-dot"
//                 : "bg-white/20",
//             )}
//           />
//           <span className="font-fira text-[10px] tracking-widest text-white/30">
//             {stage === "active" ? "LIVE" : "IDLE"}
//           </span>
//         </div>

//         <button
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
//           bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-gold-400
//           hover:border-gold-500/20 transition-all duration-200 text-xs font-semibold"
//         >
//           <Star size={11} /> Star
//         </button>
//       </div>
//     </header>
//   );
// }

// "use client";
// import { Zap, Brain, Star } from "lucide-react";
// import { useAppStore } from "@/store/useAppStore";
// import { cn } from "@/lib/utils";

// export default function Navbar() {
//   const { fastMode, setFastMode, stage, converged } = useAppStore();

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.05] bg-[#111111]/95 backdrop-blur-xl">
//       {/* Logo */}
//       <div className="flex items-center gap-3 flex-shrink-0">
//         {/* Gold mark */}
//         <div className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold-sm">
//           <span className="text-[#111] font-black text-sm leading-none">F</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-white font-bold text-[15px] tracking-tight">
//             FoundrAI
//           </span>
//           <span className="font-fira text-[10px] text-gold-500/70 tracking-widest">
//             v2.0
//           </span>
//         </div>

//         {/* Separator */}
//         {converged && (
//           <>
//             <div className="w-px h-4 bg-white/[0.08]" />
//             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
//               <span className="text-emerald-400 font-fira text-[10px] font-semibold tracking-widest">
//                 VERIFIED
//               </span>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Center — stage breadcrumb */}
//       {stage !== "landing" && (
//         <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 font-fira text-[11px] text-white/20">
//           {["landing", "intake", "active", "results"].map((s, i, arr) => (
//             <span
//               key={s}
//               className={cn(
//                 "capitalize",
//                 stage === s && "text-gold-500",
//                 arr.indexOf(stage) > i && "text-white/40",
//               )}
//             >
//               {s}
//               {i < arr.length - 1 ? " /" : ""}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Right controls */}
//       <div className="ml-auto flex items-center gap-2">
//         {/* Mode toggle */}
//         <div className="flex items-center bg-white/[0.03] border border-white/[0.07] rounded-lg p-0.5 gap-0.5">
//           <button
//             onClick={() => setFastMode(true)}
//             className={cn(
//               "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200",
//               fastMode
//                 ? "bg-gold-gradient text-[#111] shadow-gold-sm"
//                 : "text-white/30 hover:text-white/60",
//             )}
//           >
//             <Zap size={11} /> Fast
//           </button>
//           <button
//             onClick={() => setFastMode(false)}
//             className={cn(
//               "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200",
//               !fastMode
//                 ? "bg-gold-gradient text-[#111] shadow-gold-sm"
//                 : "text-white/30 hover:text-white/60",
//             )}
//           >
//             <Brain size={11} /> Deep
//           </button>
//         </div>

//         {/* Status */}
//         <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
//           <span
//             className={cn(
//               "w-1.5 h-1.5 rounded-full",
//               stage === "active"
//                 ? "bg-emerald-400 animate-pulse-dot"
//                 : "bg-white/20",
//             )}
//           />
//           <span className="font-fira text-[10px] tracking-widest text-white/30">
//             {stage === "active" ? "LIVE" : "IDLE"}
//           </span>
//         </div>

//         <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-gold-400 hover:border-gold-500/20 transition-all duration-200 text-xs font-semibold">
//           <Star size={11} /> Star
//         </button>
//       </div>
//     </header>
//   );
// }

"use client";
import { Zap, Brain, Star } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function Navbar() {
  const { fastMode, setFastMode, stage, converged } = useAppStore();

  return (
    <header
      style={{
        background: "rgba(17,17,17,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
            boxShadow: "0 0 0 1px rgba(234,179,8,0.25)",
          }}
        >
          <span
            className="font-black text-sm leading-none"
            style={{ color: "#111" }}
          >
            F
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-[15px] tracking-tight">
            FoundrAI
          </span>
          <span
            className="font-fira text-[10px] tracking-widest"
            style={{ color: "rgba(251,191,36,0.6)" }}
          >
            v2.0
          </span>
        </div>
        {converged && (
          <>
            <div
              className="w-px h-4"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="font-fira text-[10px] font-semibold tracking-widest text-emerald-400">
                VERIFIED
              </span>
            </div>
          </>
        )}
      </div>

      {/* Center breadcrumb */}
      {stage !== "landing" && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 font-fira text-[11px]">
          {["landing", "intake", "active", "results"].map((s, i, arr) => (
            <span
              key={s}
              style={{
                color:
                  stage === s
                    ? "#fbbf24"
                    : arr.indexOf(stage) > i
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.15)",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {i < arr.length - 1 ? " /" : ""}
            </span>
          ))}
        </div>
      )}

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">
        {/* Mode toggle */}
        <div
          className="flex items-center p-0.5 gap-0.5 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            {
              label: "Fast",
              icon: <Zap size={11} />,
              active: fastMode,
              onClick: () => setFastMode(true),
            },
            {
              label: "Deep",
              icon: <Brain size={11} />,
              active: !fastMode,
              onClick: () => setFastMode(false),
            },
          ].map(({ label, icon, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
              style={
                active
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

        {/* Status */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${stage === "active" ? "bg-emerald-400 animate-pulse-dot" : ""}`}
            style={
              stage !== "active" ? { background: "rgba(255,255,255,0.2)" } : {}
            }
          />
          <span
            className="font-fira text-[10px] tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {stage === "active" ? "LIVE" : "IDLE"}
          </span>
        </div>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fbbf24";
            e.currentTarget.style.borderColor = "rgba(234,179,8,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <Star size={11} /> Star
        </button>
      </div>
    </header>
  );
}
