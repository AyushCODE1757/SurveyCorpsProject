"use client";
import { useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

// Tag colour mapping — keeps the card palette consistent
const TAG_COLORS = {
  "Churn Risk":         { bg: "bg-red-500/10",    border: "border-red-500/25",    text: "text-red-400"    },
  "Regulatory Risk":    { bg: "bg-orange-500/10", border: "border-orange-500/25", text: "text-orange-400" },
  "Market Risk":        { bg: "bg-yellow-500/10", border: "border-yellow-500/25", text: "text-yellow-400" },
  "CAC Risk":           { bg: "bg-pink-500/10",   border: "border-pink-500/25",   text: "text-pink-400"   },
  "Sales Cycle Risk":   { bg: "bg-amber-500/10",  border: "border-amber-500/25",  text: "text-amber-400"  },
  "Cold Start Risk":    { bg: "bg-purple-500/10", border: "border-purple-500/25", text: "text-purple-400" },
  "Failure Pattern":    { bg: "bg-rose-500/10",   border: "border-rose-500/25",   text: "text-rose-400"   },
  "PMF Signal":         { bg: "bg-teal-500/10",   border: "border-teal-500/25",   text: "text-teal-400"   },
  "Founder Signal":     { bg: "bg-blue-500/10",   border: "border-blue-500/25",   text: "text-blue-400"   },
};

const DEFAULT_TAG_COLOR = {
  bg: "bg-slate-500/10",
  border: "border-slate-500/20",
  text: "text-slate-400",
};

function RedditCard({ post, index }) {
  const { subreddit, title, body_snippet, score_range, relevance_tag } = post;
  const colors = TAG_COLORS[relevance_tag] || DEFAULT_TAG_COLOR;

  return (
    <div
      className={`rounded-lg border ${colors.border} ${colors.bg} p-3 animate-fade-in-up flex flex-col gap-1.5`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header: subreddit + score range */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[10px] font-bold text-slate-300 font-fira tracking-wide">
          {subreddit}
        </span>
        <span className="text-[9px] text-slate-600 font-fira">
          {score_range}
        </span>
      </div>

      {/* Title */}
      <p className="text-[11px] font-semibold text-slate-200 leading-snug line-clamp-2">
        {title}
      </p>

      {/* Body snippet */}
      {body_snippet && (
        <p className="text-[10px] font-fira text-slate-500 leading-relaxed line-clamp-2">
          {body_snippet}
          {body_snippet.length >= 200 ? "…" : ""}
        </p>
      )}

      {/* Relevance tag */}
      {relevance_tag && (
        <div className="flex items-center gap-1 pt-0.5">
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded font-fira font-semibold tracking-wide border ${colors.border} ${colors.bg} ${colors.text}`}
          >
            {relevance_tag}
          </span>
        </div>
      )}
    </div>
  );
}

export default function RedditFeed() {
  const redditPosts = useAppStore((s) => s.redditPosts);
  const bodyRef     = useRef(null);

  // Auto-scroll when new posts arrive
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [redditPosts.length]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <span className="text-base leading-none">🟠</span>
        <span className="text-[11px] font-semibold text-slate-400 tracking-widest">
          REDDIT PAIN POINT FEED
        </span>
        {redditPosts.length > 0 && (
          <span className="ml-auto text-[10px] font-fira text-slate-600">
            {redditPosts.length} posts
          </span>
        )}
      </div>

      {/* Card list */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
      >
        {redditPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-8">
            <span className="text-2xl">🟠</span>
            <p className="text-slate-700 text-xs font-fira">
              Reddit data loads when Risk Agent runs…
            </p>
          </div>
        ) : (
          redditPosts.map((post, i) => (
            <RedditCard
              key={`${post.subreddit}-${i}`}
              post={post}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
}