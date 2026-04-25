// "use client";
// import { useState } from "react";
// import { Pencil, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";

// export default function PromptPreview({ prompt, onEdit }) {
//   const [editing, setEditing] = useState(false);
//   const [draft, setDraft] = useState(prompt);

//   const handleSave = () => {
//     onEdit(draft);
//     setEditing(false);
//   };

//   return (
//     <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
//       <div className="flex items-center justify-between">
//         <span className="text-xs font-semibold text-indigo-400 tracking-widest font-fira">
//           GENERATED PROMPT PREVIEW
//         </span>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-7 px-2 text-xs text-slate-500 hover:text-white gap-1"
//           onClick={() => (editing ? handleSave() : setEditing(true))}
//         >
//           {editing ? (
//             <>
//               <Check size={11} /> Save
//             </>
//           ) : (
//             <>
//               <Pencil size={11} /> Edit
//             </>
//           )}
//         </Button>
//       </div>

//       {editing ? (
//         <Textarea
//           value={draft}
//           onChange={(e) => setDraft(e.target.value)}
//           rows={8}
//           className="bg-black/20 border-white/[0.08] text-slate-300 font-fira text-xs resize-none focus:ring-0"
//         />
//       ) : (
//         <pre className="text-xs font-fira text-slate-300 whitespace-pre-wrap leading-relaxed">
//           {prompt}
//         </pre>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PromptPreview({ prompt, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(prompt);

  const handleSave = () => {
    onEdit(draft);
    setEditing(false);
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c0c0c] p-5 space-y-4 shadow-inner">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <span className="text-[10px] font-bold text-gold-500 tracking-widest font-fira uppercase">
          Prompt Preview
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[10px] text-white/40 hover:text-white hover:bg-white/[0.05] gap-1.5"
          onClick={() => (editing ? handleSave() : setEditing(true))}
        >
          {editing ? (
            <>
              <Check size={10} /> Save
            </>
          ) : (
            <>
              <Pencil size={10} /> Edit
            </>
          )}
        </Button>
      </div>

      {editing ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={12}
          className="bg-black/40 border-white/[0.06] text-white/80 font-fira text-xs resize-none focus:border-gold-500/30 focus:ring-0 leading-relaxed"
        />
      ) : (
        <pre className="text-[11px] font-fira text-white/60 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-white/10">
          {prompt}
        </pre>
      )}
    </div>
  );
}
