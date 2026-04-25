// "use client";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// export default function FormField({ field, value, onChange }) {
//   const { name, label, type, options, placeholder, required } = field;

//   return (
//     <div className="space-y-1.5">
//       <Label
//         htmlFor={name}
//         className="text-xs font-semibold text-slate-400 tracking-wide"
//       >
//         {label}
//         {required && <span className="text-red-400 ml-1">*</span>}
//       </Label>

//       {type === "text" && (
//         <Input
//           id={name}
//           value={value}
//           onChange={(e) => onChange(name, e.target.value)}
//           placeholder={placeholder}
//           className="bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-600
//             focus:border-indigo-500/50 focus:ring-0 font-fira text-sm h-9"
//         />
//       )}

//       {type === "textarea" && (
//         <Textarea
//           id={name}
//           value={value}
//           onChange={(e) => onChange(name, e.target.value)}
//           placeholder={placeholder}
//           rows={3}
//           className="bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-600
//             focus:border-indigo-500/50 focus:ring-0 font-fira text-sm resize-none"
//         />
//       )}

//       {type === "select" && (
//         <Select value={value} onValueChange={(v) => onChange(name, v)}>
//           <SelectTrigger
//             className="bg-white/[0.03] border-white/[0.08] text-white
//             focus:ring-0 focus:border-indigo-500/50 h-9 font-fira text-sm"
//           >
//             <SelectValue placeholder={`Select ${label.toLowerCase()}…`} />
//           </SelectTrigger>
//           <SelectContent className="bg-[#1a1a26] border-white/[0.08] text-white">
//             {options.map((opt) => (
//               <SelectItem
//                 key={opt}
//                 value={opt}
//                 className="text-slate-300 focus:bg-indigo-500/20 focus:text-white font-fira text-sm"
//               >
//                 {opt}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       )}
//     </div>
//   );
// }

// "use client";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function FormField({ field, value, onChange }) {
//   const { name, label, type, options, placeholder, required } = field;

//   return (
//     <div className="space-y-2">
//       <Label
//         htmlFor={name}
//         className="text-[11px] font-bold text-white/50 tracking-wider uppercase"
//       >
//         {label}
//         {required && <span className="text-gold-500 ml-1">*</span>}
//       </Label>

//       {type === "text" && (
//         <Input
//           id={name}
//           value={value}
//           onChange={(e) => onChange(name, e.target.value)}
//           placeholder={placeholder}
//           className="bg-white/[0.02] border-white/[0.06] text-white placeholder-white/20
//             hover:bg-white/[0.04] focus:border-gold-500/50 focus:ring-0 font-fira text-sm h-10 transition-colors"
//         />
//       )}

//       {type === "textarea" && (
//         <Textarea
//           id={name}
//           value={value}
//           onChange={(e) => onChange(name, e.target.value)}
//           placeholder={placeholder}
//           rows={3}
//           className="bg-white/[0.02] border-white/[0.06] text-white placeholder-white/20
//             hover:bg-white/[0.04] focus:border-gold-500/50 focus:ring-0 font-fira text-sm resize-none transition-colors"
//         />
//       )}

//       {type === "select" && (
//         <Select value={value} onValueChange={(v) => onChange(name, v)}>
//           <SelectTrigger
//             className="bg-white/[0.02] border-white/[0.06] text-white hover:bg-white/[0.04]
//             focus:ring-0 focus:border-gold-500/50 h-10 font-fira text-sm transition-colors [&>span]:truncate"
//           >
//             <SelectValue placeholder={`Select ${label.toLowerCase()}...`} />
//           </SelectTrigger>
//           <SelectContent className="bg-[#111111] border-white/[0.08] text-white backdrop-blur-xl">
//             {options.map((opt) => (
//               <SelectItem
//                 key={opt}
//                 value={opt}
//                 className="text-white/70 focus:bg-white/[0.06] focus:text-white font-fira text-sm cursor-pointer"
//               >
//                 {opt}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       )}
//     </div>
//   );
// }

"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormField({ field, value, onChange }) {
  const { name, label, type, options, placeholder, required } = field;

  return (
    <div className="space-y-2 w-full min-w-0">
      <Label
        htmlFor={name}
        className="text-[11px] font-bold text-white/50 tracking-wider uppercase"
      >
        {label}
        {required && <span className="text-amber-500 ml-1">*</span>}
      </Label>

      {type === "text" && (
        <Input
          id={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.02] border-white/[0.06] text-white placeholder-white/20
            hover:bg-white/[0.04] focus:border-amber-500/50 focus:ring-0 font-fira text-sm h-10 transition-colors"
        />
      )}

      {type === "textarea" && (
        <Textarea
          id={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-white/[0.02] border-white/[0.06] text-white placeholder-white/20
            hover:bg-white/[0.04] focus:border-amber-500/50 focus:ring-0 font-fira text-sm resize-none transition-colors"
        />
      )}

      {type === "select" && (
        <Select value={value} onValueChange={(v) => onChange(name, v)}>
          <SelectTrigger
            className="w-full bg-white/[0.02] border-white/[0.06] text-white hover:bg-white/[0.04]
            focus:ring-0 focus:border-amber-500/50 h-10 font-fira text-sm transition-colors text-left truncate"
          >
            <SelectValue
              placeholder={`Select ${label.toLowerCase()}...`}
              className="truncate"
            />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-white/[0.08] text-white backdrop-blur-xl max-w-[var(--radix-select-trigger-width)]">
            {options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="text-white/70 focus:bg-white/[0.06] focus:text-white font-fira text-sm cursor-pointer truncate"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
