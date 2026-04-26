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
