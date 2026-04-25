"use client";
import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const ALLOWED = [".pdf", ".docx", ".txt", ".md", ".csv"];
const MAX_MB = 10;

export default function FileUpload() {
  const setDocumentId = useAppStore((s) => s.setDocumentId);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
    setDocumentId(null);
  };

  const upload = useCallback(
    async (selectedFile) => {
      setFile(selectedFile);
      setStatus("uploading");
      setErrorMsg("");

      const form = new FormData();
      form.append("file", selectedFile);

      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Upload failed");
        }
        const data = await res.json();
        setDocumentId(data.document_id);
        setStatus("done");
      } catch (e) {
        setErrorMsg(e.message);
        setStatus("error");
        setDocumentId(null);
      }
    },
    [setDocumentId],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer?.files?.[0];
      if (!dropped) return;
      validate(dropped);
    },
    [upload],
  );

  const onFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked) validate(picked);
  };

  const validate = (f) => {
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setErrorMsg(`Unsupported type. Allowed: ${ALLOWED.join(", ")}`);
      setStatus("error");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrorMsg(`File too large. Max ${MAX_MB}MB.`);
      setStatus("error");
      return;
    }
    upload(f);
  };

  return (
    <div className="mt-4">
      <p className="text-xs text-white/40 uppercase tracking-widest font-fira mb-2">
        Optional: attach a document
      </p>

      {status === "idle" && (
        <label
          className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl p-6 cursor-pointer transition-colors duration-150
            ${
              dragging
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
            }`}
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
        >
          <Upload size={20} className="text-white/30" />
          <span className="text-xs text-white/40">
            Drop PDF, DOCX, TXT, CSV — or click to browse
          </span>
          <input
            type="file"
            accept={ALLOWED.join(",")}
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      )}

      {status === "uploading" && (
        <div className="flex items-center gap-3 border border-white/10 rounded-xl p-4 bg-white/[0.02]">
          <Loader2 size={16} className="animate-spin text-indigo-400" />
          <div>
            <p className="text-xs text-white font-medium">{file?.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5">
              Extracting and embedding...
            </p>
          </div>
        </div>
      )}

      {status === "done" && (
        <div className="flex items-center gap-3 border border-emerald-500/30 rounded-xl p-4 bg-emerald-500/5">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">
              {file?.name}
            </p>
            <p className="text-[10px] text-emerald-400/70 mt-0.5">
              Embedded — agents will use this context
            </p>
          </div>
          <button
            onClick={reset}
            className="text-white/20 hover:text-white/60 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 border border-red-500/30 rounded-xl p-4 bg-red-500/5">
          <FileText size={16} className="text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-red-300">{errorMsg}</p>
          </div>
          <button
            onClick={reset}
            className="text-white/20 hover:text-white/60 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
