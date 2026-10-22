"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { CmsSchema, CmsSectionDef, CmsFieldDef, CmsHistoryItem } from "../../lib/cms";

interface SectionMeta {
  content: Record<string, string | number | boolean>;
  status: "draft" | "published";
  updatedAt: string | null;
  updatedBy: string;
}

interface UploadStat {
  dimensions: string;
  savings: string;
}

interface Props {
  showNotification: (msg: string, err?: boolean) => void;
  actorEmail?: string;
}

export default function StorefrontCms({ showNotification, actorEmail = "admin@deflores.com" }: Props) {
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState<CmsSchema | null>(null);
  const [sections, setSections] = useState<Record<string, SectionMeta>>({});
  const [history, setHistory] = useState<CmsHistoryItem[]>([]);
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>("hero");
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [uploadStats, setUploadStats] = useState<Record<string, UploadStat>>({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const res = await fetch("/api/admin/cms");
        const data = await res.json();
        if (ignore) return;

        if (data.success) {
          setSchema(data.schema);
          setSections(data.sections || {});
          setHistory(data.history || []);

          const initialKey = "hero" in (data.sections || {}) ? "hero" : Object.keys(data.sections || {})[0] || "hero";
          setSelectedSectionKey(initialKey);
          setFormData((data.sections?.[initialKey]?.content as Record<string, string | number | boolean>) || {});
          setIsDirty(false);
        } else {
          showNotification(data.error || "Failed loading CMS data", true);
        }
      } catch {
        if (!ignore) {
          showNotification("Error loading CMS data", true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, [showNotification]);

  const reloadData = async (targetKey?: string) => {
    try {
      const res = await fetch("/api/admin/cms");
      const data = await res.json();
      if (data.success) {
        setSchema(data.schema);
        setSections(data.sections || {});
        setHistory(data.history || []);

        const keyToUse = targetKey || (selectedSectionKey in (data.sections || {}) ? selectedSectionKey : "hero");
        setFormData((data.sections?.[keyToUse]?.content as Record<string, string | number | boolean>) || {});
        setIsDirty(false);
      } else {
        showNotification(data.error || "Failed refreshing CMS data", true);
      }
    } catch {
      showNotification("Error refreshing CMS data", true);
    }
  };

  const handleSelectSection = (key: string) => {
    if (isDirty) {
      const confirmSwitch = window.confirm("You have unsaved edits in this section. Switch anyway and discard unsaved changes?");
      if (!confirmSwitch) return;
    }
    setSelectedSectionKey(key);
    setFormData((sections[key]?.content as Record<string, string | number | boolean>) || {});
    setIsDirty(false);
  };

  const handleFieldChange = (fieldKey: string, val: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: val,
    }));
    setIsDirty(true);
  };

  const handleImageUpload = async (fieldKey: string, file: File) => {
    const fieldDef = schema?.sections?.[selectedSectionKey]?.fields?.[fieldKey];
    if (!fieldDef) return;

    if (file.size > 50 * 1024 * 1024) {
      showNotification("Image exceeds 50MB limit. Please choose an image under 50MB.", true);
      return;
    }

    setIsUploading((prev) => ({ ...prev, [fieldKey]: true }));

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("sectionKey", selectedSectionKey);
      form.append("fieldKey", fieldKey);

      const res = await fetch("/api/admin/cms/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const nextForm = { ...formData, [fieldKey]: data.url };
        setFormData(nextForm);
        setUploadStats((prev) => ({
          ...prev,
          [fieldKey]: {
            dimensions: `${data.width}×${data.height}`,
            savings: `${data.savingsPercent}% (WebP 82)`,
          },
        }));

        try {
          const saveRes = await fetch("/api/admin/cms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sectionKey: selectedSectionKey,
              content: nextForm,
              status: "published",
              actorEmail,
            }),
          });
          const saveData = await saveRes.json();
          if (saveRes.ok && saveData.success) {
            setIsDirty(false);
            await reloadData(selectedSectionKey);
            showNotification(`Image uploaded, compressed (${data.savingsPercent}% savings) & published live!`);
          } else {
            setIsDirty(true);
            showNotification(`Image optimized (${data.savingsPercent}% savings). Click Publish to apply.`, false);
          }
        } catch {
          setIsDirty(true);
          showNotification(`Image optimized (${data.savingsPercent}% savings). Click Publish to apply.`, false);
        }
      } else {
        showNotification(data.error || "Image upload failed", true);
      }
    } catch {
      showNotification("Image upload error", true);
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: selectedSectionKey,
          content: formData,
          status,
          actorEmail,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(
          status === "published"
            ? `Section '${selectedSectionKey}' published live.`
            : `Section '${selectedSectionKey}' saved as draft.`
        );
        setIsDirty(false);
        reloadData(selectedSectionKey);
      } else {
        showNotification(data.error || "Failed to save section", true);
      }
    } catch {
      showNotification("Network error saving section", true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async (historyId: number) => {
    const confirmRollback = window.confirm("Are you sure you want to restore this revision? This will overwrite the current content.");
    if (!confirmRollback) return;

    try {
      const res = await fetch("/api/admin/cms/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historyId, actorEmail }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Restored to revision v${data.restoredVersion}.`);
        setIsHistoryOpen(false);
        reloadData(selectedSectionKey);
      } else {
        showNotification(data.error || "Rollback failed", true);
      }
    } catch {
      showNotification("Rollback network error", true);
    }
  };

  const handleResetDefaults = () => {
    const confirmReset = window.confirm("Reset this section to master couture defaults?");
    if (!confirmReset) return;

    const defaultContent = schema?.sections?.[selectedSectionKey]?.fields;
    if (!defaultContent) return;

    const resetVals: Record<string, string | number | boolean> = {};
    for (const [k, def] of Object.entries(defaultContent)) {
      resetVals[k] = def.placeholder || (def.type === "boolean" ? true : "");
    }

    setFormData(resetVals);
    setIsDirty(true);
    showNotification("Reset to defaults. Click 'Publish Live' to save.");
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-zinc-200 rounded-xl p-12 text-center text-zinc-500 font-sans text-xs uppercase tracking-widest">
        Syncing Master Schema & Content...
      </div>
    );
  }

  const currentSectionSchema = schema?.sections?.[selectedSectionKey];
  const sectionMeta = sections[selectedSectionKey];
  const sectionHistory = history.filter((h) => h.sectionKey === selectedSectionKey);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase block">
            MASTER SOURCE OF TRUTH
          </span>
          <h2 className="text-xl md:text-2xl font-serif text-zinc-950 font-normal">
            Storefront CMS
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Dynamic content injection strictly decoupled from styling. Enforces character boundaries, auto-fitting cover mode, and in-built WebP compression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="px-3 py-2 border border-zinc-300 hover:border-zinc-950 text-zinc-700 hover:text-zinc-950 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Revisions ({sectionHistory.length})
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 border border-zinc-300 hover:border-red-600 text-zinc-600 hover:text-red-600 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.entries(schema?.sections || {}).map(([key, sec]: [string, CmsSectionDef]) => {
          const isSelected = selectedSectionKey === key;
          const isPublished = sections[key]?.status === "published";
          const isSectionVisible = sections[key]?.content?.is_visible !== false;

          return (
            <button
              key={key}
              onClick={() => handleSelectSection(key)}
              className={`shrink-0 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400"
              }`}
            >
              <span>{sec.title}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  !isSectionVisible
                    ? "bg-zinc-400"
                    : isPublished
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
                title={!isSectionVisible ? "Hidden" : isPublished ? "Published" : "Draft"}
              />
            </button>
          );
        })}
      </div>

      {currentSectionSchema && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 flex flex-col gap-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-serif text-zinc-950 font-normal">
                  {currentSectionSchema.title}
                </h3>
                {isDirty && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
                    Unsaved Edits
                  </span>
                )}
                {sectionMeta?.status === "draft" && (
                  <span className="bg-blue-100 text-blue-800 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
                    Draft Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {currentSectionSchema.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSave("draft")}
                className="px-4 py-2 border border-zinc-300 hover:border-zinc-950 text-zinc-800 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
              >
                Save as Draft
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSave("published")}
                className="px-6 py-2 bg-coral hover:bg-zinc-950 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isSaving ? "Publishing..." : "Publish Live"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(currentSectionSchema.fields || {}).map(([fieldKey, fieldDef]: [string, CmsFieldDef]) => {
              const val = formData[fieldKey] ?? "";

              if (fieldDef.type === "boolean") {
                const checked = formData[fieldKey] !== false;
                return (
                  <div key={fieldKey} className="md:col-span-2 flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 block">
                        {fieldDef.label}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-normal">
                        Toggle to immediately show or hide this section on the live storefront.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => handleFieldChange(fieldKey, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                );
              }

              if (fieldDef.type === "textarea") {
                const charCount = String(val).length;
                const isTooShort = fieldDef.min_chars && charCount < fieldDef.min_chars;
                const isTooLong = fieldDef.max_chars && charCount > fieldDef.max_chars;

                return (
                  <div key={fieldKey} className="md:col-span-2 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                        {fieldDef.label} {fieldDef.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="text-[10px] font-semibold tracking-wider">
                        <span className={isTooShort || isTooLong ? "text-red-600 font-bold" : "text-zinc-500"}>
                          {charCount}
                        </span>
                        <span className="text-zinc-400"> / {fieldDef.max_chars} max</span>
                        {fieldDef.min_chars && (
                          <span className="text-zinc-400 ml-1.5">(min {fieldDef.min_chars})</span>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={String(val)}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      placeholder={fieldDef.placeholder}
                      className={`w-full border text-xs px-3.5 py-2.5 rounded-lg focus:outline-none transition-colors bg-white font-sans ${
                        isTooShort || isTooLong ? "border-red-400 focus:border-red-600" : "border-zinc-300 focus:border-zinc-950"
                      }`}
                    />
                  </div>
                );
              }

              if (fieldDef.type === "image") {
                const isFieldUploading = isUploading[fieldKey] || false;
                const stats = uploadStats[fieldKey];
                const imageSrc = typeof val === "string" && val.trim() !== "" && val !== "undefined" && val !== "null" ? val.trim() : "";

                return (
                  <div key={fieldKey} className="md:col-span-2 flex flex-col gap-2 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-700 block">
                          {fieldDef.label} {fieldDef.required && <span className="text-red-500">*</span>}
                        </span>
                        <span className="text-[10px] text-zinc-500 tracking-wider">
                          Cover Mode (Auto-fits frame) · Recommended: <strong className="text-zinc-800">{fieldDef.aspect_ratio || "Flexible"}</strong>{fieldDef.min_width ? ` · Min Width: ${fieldDef.min_width}px` : ""}
                        </span>
                      </div>

                      {stats && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          Optimized: {stats.dimensions} · {stats.savings}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                      <div className="relative w-32 h-32 bg-zinc-200 border border-zinc-300 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt="Preview"
                            fill
                            sizes="128px"
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">
                            No Image
                          </span>
                        )}
                        {isFieldUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[9px] font-bold tracking-widest uppercase">
                            Compressing...
                          </div>
                        )}
                      </div>

                      <div className="flex-1 w-full flex flex-col gap-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isFieldUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(fieldKey, file);
                          }}
                          className="text-xs text-zinc-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-coral cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={imageSrc}
                            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                            placeholder="Direct image URL or path"
                            className="w-full border border-zinc-300 text-xs px-3 py-1.5 rounded-md focus:outline-none focus:border-zinc-950 bg-white"
                          />
                          {imageSrc && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange(fieldKey, "")}
                              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 uppercase tracking-wider font-bold cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const charCount = String(val).length;
              const isTooShort = fieldDef.min_chars && charCount < fieldDef.min_chars;
              const isTooLong = fieldDef.max_chars && charCount > fieldDef.max_chars;

              return (
                <div key={fieldKey} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                      {fieldDef.label} {fieldDef.required && <span className="text-red-500">*</span>}
                    </label>
                    {fieldDef.max_chars && (
                      <div className="text-[10px] font-semibold tracking-wider">
                        <span className={isTooShort || isTooLong ? "text-red-600 font-bold" : "text-zinc-500"}>
                          {charCount}
                        </span>
                        <span className="text-zinc-400"> / {fieldDef.max_chars}</span>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={String(val)}
                    onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                    placeholder={fieldDef.placeholder}
                    className={`w-full border text-xs px-3.5 py-2.5 rounded-lg focus:outline-none transition-colors bg-white font-sans ${
                      isTooShort || isTooLong ? "border-red-400 focus:border-red-600" : "border-zinc-300 focus:border-zinc-950"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 flex flex-col gap-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div>
                <h4 className="text-base font-serif text-zinc-950">
                  Revision History: {currentSectionSchema?.title}
                </h4>
                <p className="text-xs text-zinc-500">
                  Every publish action creates an immutable snapshot. You can roll back anytime with 1 click.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 text-xs uppercase font-bold tracking-wider px-2 py-1 cursor-pointer"
              >
                Close
              </button>
            </div>

            {sectionHistory.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-400 uppercase tracking-widest">
                No past revisions recorded yet for this section.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sectionHistory.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-center justify-between p-3.5 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 tracking-wider">
                          Revision v{rev.version}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          by {rev.createdBy}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRollback(rev.id)}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-800 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      Rollback
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
