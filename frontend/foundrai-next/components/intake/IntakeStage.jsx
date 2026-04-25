// "use client";
// import { useMemo } from "react";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { useAppStore } from "@/store/useAppStore";
// import { useSimulation } from "@/hooks/useSimulation";
// import { FORM_OPTIONS, buildPromptFromForm } from "@/lib/utils";
// import FormField from "./FormField";
// import PromptPreview from "./PromptPreview";

// const FIELDS = [
//   {
//     name: "name",
//     label: "Startup Name",
//     type: "text",
//     placeholder: "e.g. Acme",
//     required: true,
//   },
//   {
//     name: "tagline",
//     label: "One-line Tagline",
//     type: "text",
//     placeholder: "e.g. Fast analytics for SMBs",
//     required: true,
//   },
//   {
//     name: "problem",
//     label: "The Problem",
//     type: "textarea",
//     placeholder: "What pain does this solve?",
//     required: true,
//   },
//   {
//     name: "solution",
//     label: "The Solution",
//     type: "textarea",
//     placeholder: "What does your product actually do?",
//     required: true,
//   },
//   {
//     name: "stage",
//     label: "Startup Stage",
//     type: "select",
//     options: FORM_OPTIONS.stage,
//   },
//   {
//     name: "market_type",
//     label: "Market Type",
//     type: "select",
//     options: FORM_OPTIONS.market_type,
//   },
//   {
//     name: "audience",
//     label: "Target Audience",
//     type: "select",
//     options: FORM_OPTIONS.audience,
//   },
//   {
//     name: "revenue",
//     label: "Revenue Model",
//     type: "select",
//     options: FORM_OPTIONS.revenue,
//   },
//   {
//     name: "platform",
//     label: "Primary Platform",
//     type: "select",
//     options: FORM_OPTIONS.platform,
//   },
//   {
//     name: "sensitivity",
//     label: "Data Sensitivity",
//     type: "select",
//     options: FORM_OPTIONS.sensitivity,
//   },
//   {
//     name: "bottleneck",
//     label: "Biggest Bottleneck",
//     type: "select",
//     options: FORM_OPTIONS.bottleneck,
//   },
//   {
//     name: "team_edge",
//     label: "Team Edge",
//     type: "select",
//     options: FORM_OPTIONS.team_edge,
//   },
// ];

// export default function IntakeStage() {
//   const { formData, setFormData, setIdea, setStage } = useAppStore();
//   const { run } = useSimulation();

//   const prompt = useMemo(() => buildPromptFromForm(formData), [formData]);

//   const isValid = formData.name && formData.problem && formData.solution;

//   const handleChange = (name, value) => setFormData({ [name]: value });

//   const handleLaunch = async () => {
//     setIdea(prompt);
//     await run();
//   };

//   return (
//     <div className="min-h-screen pt-20 pb-16 px-6">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-slate-500 hover:text-white mb-4 gap-1.5 -ml-2"
//             onClick={() => setStage("landing")}
//           >
//             <ArrowLeft size={14} /> Back
//           </Button>
//           <h1 className="text-2xl font-bold text-white tracking-tight">
//             Tell us about your startup
//           </h1>
//           <p className="text-slate-500 text-sm mt-1">
//             Fill in the form — we generate a structured prompt and run 6 agents
//             on it.
//           </p>
//         </div>

//         {/* Two columns: form left, preview right */}
//         <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-6">
//           {/* Form */}
//           <div className="glass rounded-2xl p-6 space-y-5">
//             {/* Text fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {FIELDS.slice(0, 4).map((f) => (
//                 <div
//                   key={f.name}
//                   className={f.type === "textarea" ? "sm:col-span-2" : ""}
//                 >
//                   <FormField
//                     field={f}
//                     value={formData[f.name] || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//               ))}
//             </div>

//             <Separator className="bg-white/[0.06]" />

//             {/* Dropdowns grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//               {FIELDS.slice(4).map((f) => (
//                 <FormField
//                   key={f.name}
//                   field={f}
//                   value={formData[f.name] || ""}
//                   onChange={handleChange}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Right panel: preview + launch */}
//           <div className="space-y-4">
//             <PromptPreview prompt={prompt} onEdit={setIdea} />

//             <Button
//               onClick={handleLaunch}
//               disabled={!isValid}
//               className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-bold gap-2"
//             >
//               Launch 6-Agent Validation
//               <ArrowRight size={15} />
//             </Button>

//             <p className="text-[11px] text-slate-600 text-center font-fira">
//               Deep mode runs all 6 agents including Legal
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useMemo } from "react";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { useAppStore } from "@/store/useAppStore";
// import { useSimulation } from "@/hooks/useSimulation";
// import { FORM_OPTIONS, buildPromptFromForm } from "@/lib/utils";
// import FormField from "./FormField";
// import PromptPreview from "./PromptPreview";

// const FIELDS = [
//   {
//     name: "name",
//     label: "Startup Name",
//     type: "text",
//     placeholder: "e.g. Acme",
//     required: true,
//   },
//   {
//     name: "tagline",
//     label: "One-line Tagline",
//     type: "text",
//     placeholder: "e.g. Fast analytics for SMBs",
//     required: true,
//   },
//   {
//     name: "problem",
//     label: "The Problem",
//     type: "textarea",
//     placeholder: "What pain does this solve?",
//     required: true,
//   },
//   {
//     name: "solution",
//     label: "The Solution",
//     type: "textarea",
//     placeholder: "What does your product actually do?",
//     required: true,
//   },
//   {
//     name: "stage",
//     label: "Startup Stage",
//     type: "select",
//     options: FORM_OPTIONS.stage,
//   },
//   {
//     name: "market_type",
//     label: "Market Type",
//     type: "select",
//     options: FORM_OPTIONS.market_type,
//   },
//   {
//     name: "audience",
//     label: "Target Audience",
//     type: "select",
//     options: FORM_OPTIONS.audience,
//   },
//   {
//     name: "revenue",
//     label: "Revenue Model",
//     type: "select",
//     options: FORM_OPTIONS.revenue,
//   },
//   {
//     name: "platform",
//     label: "Primary Platform",
//     type: "select",
//     options: FORM_OPTIONS.platform,
//   },
//   {
//     name: "sensitivity",
//     label: "Data Sensitivity",
//     type: "select",
//     options: FORM_OPTIONS.sensitivity,
//   },
//   {
//     name: "bottleneck",
//     label: "Biggest Bottleneck",
//     type: "select",
//     options: FORM_OPTIONS.bottleneck,
//   },
//   {
//     name: "team_edge",
//     label: "Team Edge",
//     type: "select",
//     options: FORM_OPTIONS.team_edge,
//   },
// ];

// export default function IntakeStage() {
//   const { formData, setFormData, setIdea, setStage } = useAppStore();
//   const { run } = useSimulation();

//   const prompt = useMemo(() => buildPromptFromForm(formData), [formData]);
//   const isValid = formData.name && formData.problem && formData.solution;
//   const handleChange = (name, value) =>
//     setFormData({ ...formData, [name]: value });

//   const handleLaunch = async () => {
//     setIdea(prompt);
//     await run();
//   };

//   return (
//     <div className="min-h-screen pt-20 pb-16 px-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-white/40 hover:text-white mb-4 gap-1.5 -ml-2 hover:bg-white/[0.04]"
//             onClick={() => setStage("landing")}
//           >
//             <ArrowLeft size={14} /> Back
//           </Button>
//           <h1 className="text-3xl font-extrabold text-white tracking-tight">
//             Tell us about your startup
//           </h1>
//           <p className="text-white/40 text-sm mt-2 font-light">
//             Fill in the form — we generate a structured prompt and run 6 agents
//             on it.
//           </p>
//         </div>

//         {/* Two columns: form left, preview right */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
//           {/* Form */}
//           <div className="bg-[#111111]/80 border border-white/[0.05] backdrop-blur-md rounded-2xl p-7 space-y-6 shadow-xl">
//             {/* Text fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               {FIELDS.slice(0, 4).map((f) => (
//                 <div
//                   key={f.name}
//                   className={f.type === "textarea" ? "sm:col-span-2" : ""}
//                 >
//                   <FormField
//                     field={f}
//                     value={formData[f.name] || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//               ))}
//             </div>

//             <Separator className="bg-white/[0.06]" />

//             {/* Dropdowns grid - Fixed to 2 columns max so they don't overlap */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               {FIELDS.slice(4).map((f) => (
//                 <FormField
//                   key={f.name}
//                   field={f}
//                   value={formData[f.name] || ""}
//                   onChange={handleChange}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Right panel: preview + launch */}
//           <div className="space-y-4">
//             <PromptPreview prompt={prompt} onEdit={setIdea} />

//             <Button
//               onClick={handleLaunch}
//               disabled={!isValid}
//               className="w-full h-12 bg-gold-gradient text-[#111] shadow-gold-md hover:shadow-gold-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-30 disabled:hover:scale-100 font-bold text-sm gap-2 rounded-xl"
//             >
//               Launch 6-Agent Validation
//               <ArrowRight size={15} />
//             </Button>

//             <p className="text-[11px] text-white/30 text-center font-fira uppercase tracking-widest">
//               Deep mode runs all 6 agents
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useMemo } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/useAppStore";
import { useSimulation } from "@/hooks/useSimulation";
import { FORM_OPTIONS, buildPromptFromForm } from "@/lib/utils";
import FormField from "./FormField";
import PromptPreview from "./PromptPreview";

const FIELDS = [
  {
    name: "name",
    label: "Startup Name",
    type: "text",
    placeholder: "e.g. Acme",
    required: true,
  },
  {
    name: "tagline",
    label: "One-line Tagline",
    type: "text",
    placeholder: "e.g. Fast analytics for SMBs",
    required: true,
  },
  {
    name: "problem",
    label: "The Problem",
    type: "textarea",
    placeholder: "What pain does this solve?",
    required: true,
  },
  {
    name: "solution",
    label: "The Solution",
    type: "textarea",
    placeholder: "What does your product actually do?",
    required: true,
  },
  {
    name: "stage",
    label: "Startup Stage",
    type: "select",
    options: FORM_OPTIONS.stage,
  },
  {
    name: "market_type",
    label: "Market Type",
    type: "select",
    options: FORM_OPTIONS.market_type,
  },
  {
    name: "audience",
    label: "Target Audience",
    type: "select",
    options: FORM_OPTIONS.audience,
  },
  {
    name: "revenue",
    label: "Revenue Model",
    type: "select",
    options: FORM_OPTIONS.revenue,
  },
  {
    name: "platform",
    label: "Primary Platform",
    type: "select",
    options: FORM_OPTIONS.platform,
  },
  {
    name: "sensitivity",
    label: "Data Sensitivity",
    type: "select",
    options: FORM_OPTIONS.sensitivity,
  },
  {
    name: "bottleneck",
    label: "Biggest Bottleneck",
    type: "select",
    options: FORM_OPTIONS.bottleneck,
  },
  {
    name: "team_edge",
    label: "Team Edge",
    type: "select",
    options: FORM_OPTIONS.team_edge,
  },
];

export default function IntakeStage() {
  const { formData, setFormData, setIdea, setStage } = useAppStore();
  const { run } = useSimulation();

  const prompt = useMemo(() => buildPromptFromForm(formData), [formData]);
  const isValid = formData.name && formData.problem && formData.solution;
  const handleChange = (name, value) =>
    setFormData({ ...formData, [name]: value });

  const handleLaunch = async () => {
    setIdea(prompt);
    await run();
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      {/* Expanded the max-width here so the form has room to breathe */}
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white mb-4 gap-1.5 -ml-2 hover:bg-white/[0.04]"
            onClick={() => setStage("landing")}
          >
            <ArrowLeft size={14} /> Back
          </Button>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Tell us about your startup
          </h1>
          <p className="text-white/40 text-sm mt-2 font-light">
            Fill in the form — we generate a structured prompt and run 6 agents
            on it.
          </p>
        </div>

        {/* Two columns: form left, preview right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Form */}
          <div className="bg-[#111111]/80 border border-white/[0.05] backdrop-blur-md rounded-2xl p-8 space-y-6 shadow-xl">
            {/* Text fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FIELDS.slice(0, 4).map((f) => (
                <div
                  key={f.name}
                  className={f.type === "textarea" ? "sm:col-span-2" : ""}
                >
                  <FormField
                    field={f}
                    value={formData[f.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Dropdowns grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FIELDS.slice(4).map((f) => (
                <FormField
                  key={f.name}
                  field={f}
                  value={formData[f.name] || ""}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          {/* Right panel: preview + launch */}
          <div className="space-y-4">
            <PromptPreview prompt={prompt} onEdit={setIdea} />

            {/* Fixed Button: Using native Tailwind gradient classes instead of custom config */}
            <Button
              onClick={handleLaunch}
              disabled={!isValid}
              className="w-full h-12 bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-lg hover:from-amber-300 hover:to-amber-500 hover:scale-[1.01] transition-all duration-200 disabled:opacity-30 disabled:hover:scale-100 font-bold text-sm gap-2 rounded-xl"
            >
              Launch 6-Agent Validation
              <ArrowRight size={15} />
            </Button>

            <p className="text-[11px] text-white/30 text-center font-fira uppercase tracking-widest">
              Deep mode runs all 6 agents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
