"use client";
import { Zap, Brain, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { fastMode, setFastMode, stage, converged } = useAppStore();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6
      border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-white font-bold text-base tracking-tight">
          FoundrAI
        </span>
        <Badge
          variant="outline"
          className="text-indigo-400 border-indigo-500/40 bg-indigo-500/10 text-[10px]"
        >
          2.0
        </Badge>
        {converged && (
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            VERIFIED
          </Badge>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Fast / Deep toggle */}
        <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-lg p-1 gap-1">
          <Button
            size="sm"
            variant={fastMode ? "default" : "ghost"}
            className={cn(
              "h-7 px-3 text-xs gap-1.5",
              fastMode
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "text-slate-400 hover:text-white",
            )}
            onClick={() => setFastMode(true)}
          >
            <Zap size={11} /> Fast
          </Button>
          <Button
            size="sm"
            variant={!fastMode ? "default" : "ghost"}
            className={cn(
              "h-7 px-3 text-xs gap-1.5",
              !fastMode
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "text-slate-400 hover:text-white",
            )}
            onClick={() => setFastMode(false)}
          >
            <Brain size={11} /> Deep
          </Button>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              stage === "active"
                ? "bg-emerald-400 animate-pulse-dot"
                : "bg-slate-700",
            )}
          />
          <span className="text-xs text-slate-500 font-medium font-fira">
            {stage === "active" ? "LIVE" : "IDLE"}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs gap-1.5 border-white/[0.08] text-slate-400 hover:text-white"
        >
          <GitBranch size={12} /> Star
        </Button>
      </div>
    </header>
  );
}
