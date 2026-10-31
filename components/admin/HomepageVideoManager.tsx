"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface VideoConfig {
  url: string;
  eyebrow: string;
  title: string;
  is_visible: boolean;
}

interface VerifyResult {
  verified: boolean;
  permissionOk: boolean;
  message: string;
  optimizedUrl?: string;
}

interface HomepageVideoManagerProps {
  actorEmail?: string;
  onSaved?: () => void;
  showNotification?: (msg: string, isError?: boolean) => void;
}

export default function HomepageVideoManager({
  actorEmail = "admin@deflores.com",
  onSaved,
  showNotification,
}: HomepageVideoManagerProps = {}) {
  const [video1, setVideo1] = useState<VideoConfig>({
    url: "/ramp_video_1.mp4",
    eyebrow: "THE RAMP",
    title: "Couture in motion.",
    is_visible: true,
  });

  const [video2, setVideo2] = useState<VideoConfig>({
    url: "/ramp_video_2.mp4",
    eyebrow: "SECOND LOOK",
    title: "The runway, again.",
    is_visible: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying1, setVerifying1] = useState(false);
  const [verifying2, setVerifying2] = useState(false);
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);

  const [verifyResult1, setVerifyResult1] = useState<VerifyResult | null>(null);
  const [verifyResult2, setVerifyResult2] = useState<VerifyResult | null>(null);

  const [saveMessage, setSaveMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/videos");
        const data = await res.json();
        if (data.success && data.videos) {
          if (data.videos.video_1) {
            const v1Url = data.videos.video_1.url || "/ramp_video_1.mp4";
            setVideo1({
              url: v1Url,
              eyebrow: data.videos.video_1.eyebrow || "THE RAMP",
              title: data.videos.video_1.title || "Couture in motion.",
              is_visible: data.videos.video_1.is_visible !== false,
            });
            if (v1Url) {
              setVerifyResult1({
                verified: true,
                permissionOk: true,
                message: "Current video URL loaded from database.",
                optimizedUrl: v1Url,
              });
            }
          }
          if (data.videos.video_2) {
            const v2Url = data.videos.video_2.url || "/ramp_video_2.mp4";
            setVideo2({
              url: v2Url,
              eyebrow: data.videos.video_2.eyebrow || "SECOND LOOK",
              title: data.videos.video_2.title || "The runway, again.",
              is_visible: data.videos.video_2.is_visible !== false,
            });
            if (v2Url) {
              setVerifyResult2({
                verified: true,
                permissionOk: true,
                message: "Current video URL loaded from database.",
                optimizedUrl: v2Url,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch homepage videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVerify = async (index: 1 | 2) => {
    const target = index === 1 ? video1 : video2;
    const setVerifying = index === 1 ? setVerifying1 : setVerifying2;
    const setVerifyResult = index === 1 ? setVerifyResult1 : setVerifyResult2;
    const setVideo = index === 1 ? setVideo1 : setVideo2;

    if (!target.url || !target.url.trim()) {
      setVerifyResult({
        verified: true,
        permissionOk: false,
        message: "Please enter a valid video link or Google Drive link first.",
      });
      return false;
    }

    try {
      setVerifying(true);
      setVerifyResult(null);

      const res = await fetch("/api/admin/videos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target.url.trim(), videoIndex: index }),
      });

      const data = await res.json();

      if (data.success && data.permissionOk) {
        setVerifyResult({
          verified: true,
          permissionOk: true,
          message: data.message,
          optimizedUrl: data.optimizedUrl,
        });

        if (data.optimizedUrl && data.optimizedUrl !== target.url) {
          setVideo((prev) => ({ ...prev, url: data.optimizedUrl }));
        }
        return true;
      } else {
        setVerifyResult({
          verified: true,
          permissionOk: false,
          message: data.message || "Failed to verify video link permission.",
        });
        return false;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setVerifyResult({
        verified: true,
        permissionOk: false,
        message: `Validation failed: ${msg}`,
      });
      return false;
    } finally {
      setVerifying(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = index === 1 ? setUploading1 : setUploading2;
    const setVideo = index === 1 ? setVideo1 : setVideo2;
    const setVerifyResult = index === 1 ? setVerifyResult1 : setVerifyResult2;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", `ramp_video_${index}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setVideo((prev) => ({ ...prev, url: data.url }));
        setVerifyResult({
          verified: true,
          permissionOk: true,
          message: `Video uploaded directly to storage (${(file.size / (1024 * 1024)).toFixed(1)} MB). Ready to stream.`,
          optimizedUrl: data.url,
        });
      } else {
        alert(data.error || "Failed to upload video file.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      alert(`Upload error: ${msg}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveAll = async () => {
    setSaveMessage(null);

    if (!video1.url.trim() || !video2.url.trim()) {
      setSaveMessage({
        text: "Both Video 1 and Video 2 require a valid video link before saving.",
        isError: true,
      });
      return;
    }

    let ok1 = verifyResult1?.permissionOk;
    let ok2 = verifyResult2?.permissionOk;

    if (!ok1) {
      ok1 = await handleVerify(1);
    }
    if (!ok2) {
      ok2 = await handleVerify(2);
    }

    if (!ok1 || !ok2) {
      setSaveMessage({
        text: "Permission check failed on one or both videos. Please ensure sharing permissions are set to public before saving.",
        isError: true,
      });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_1: video1,
          video_2: video2,
          actorEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveMessage({
          text: "Both Video 1 and Video 2 have been verified, optimized, and saved to the database. The homepage is now updated!",
          isError: false,
        });
        if (showNotification) {
          showNotification("Homepage videos saved to database!");
        }
        if (onSaved) {
          onSaved();
        }
      } else {
        setSaveMessage({
          text: data.error || "Failed to save video configuration.",
          isError: true,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setSaveMessage({
        text: `Error saving to database: ${msg}`,
        isError: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-12 text-center">
        <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
          Synchronizing Homepage Videos from Database...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-coral text-[10px] font-bold tracking-widest uppercase block mb-1">
            RUNWAY BROADCAST CMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
            Homepage Ramp Videos (Single Screen Studio)
          </h2>
          <p className="text-zinc-400 text-xs tracking-wider font-light mt-1 max-w-2xl">
            Configure both runway motion videos from this single screen. The system validates public permissions, optimizes Google Drive links into streamable endpoints, and displays live interactive previews before saving to the database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving || verifying1 || verifying2 || uploading1 || uploading2}
          className="self-start sm:self-auto bg-white hover:bg-coral text-zinc-950 hover:text-white font-medium text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors duration-200 flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving to DB...</span>
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Save Both Videos to DB</span>
            </>
          )}
        </button>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs tracking-wider ${
            saveMessage.isError
              ? "bg-red-950/60 border-red-800 text-red-200"
              : "bg-emerald-950/60 border-emerald-800 text-emerald-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <span>{saveMessage.isError ? "✕" : "✓"}</span>
            <span>{saveMessage.text}</span>
          </div>
          {!saveMessage.isError && (
            <Link
              href="/"
              target="_blank"
              className="text-white underline hover:text-coral transition-colors uppercase font-medium text-[11px] shrink-0"
            >
              View on Homepage →
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">SLOT 01</span>
              <h3 className="text-xl font-serif text-white tracking-wide">Video 1: The Ramp</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={video1.is_visible}
                onChange={(e) => setVideo1((prev) => ({ ...prev, is_visible: e.target.checked }))}
                className="w-4 h-4 accent-coral rounded"
              />
              <span>Visible on Homepage</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={video1.eyebrow}
                onChange={(e) => setVideo1((prev) => ({ ...prev, eyebrow: e.target.value }))}
                placeholder="THE RAMP"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                Heading Title
              </label>
              <input
                type="text"
                value={video1.title}
                onChange={(e) => setVideo1((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Couture in motion."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                Video Link (Google Drive / Direct MP4 URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={video1.url}
                  onChange={(e) => {
                    setVideo1((prev) => ({ ...prev, url: e.target.value }));
                    setVerifyResult1(null);
                  }}
                  placeholder="https://drive.google.com/file/d/... or /ramp_video_1.mp4"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-zinc-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleVerify(1)}
                  disabled={verifying1 || !video1.url}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {verifying1 ? "Checking..." : "Check & Optimize"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                ref={fileInputRef1}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => handleFileUpload(e, 1)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef1.current?.click()}
                disabled={uploading1}
                className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                {uploading1 ? (
                  <span>Uploading to Storage...</span>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Upload Local MP4 File</span>
                  </>
                )}
              </button>
            </div>

            {verifyResult1 && (
              <div
                className={`p-3.5 rounded-lg border text-xs tracking-wider space-y-1 ${
                  verifyResult1.permissionOk
                    ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                    : "bg-red-950/40 border-red-800/80 text-red-200"
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>{verifyResult1.permissionOk ? "✓ Permission Verified" : "✕ Permission Error"}</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed font-light">{verifyResult1.message}</p>
                {verifyResult1.optimizedUrl && (
                  <div className="text-[10px] font-mono text-zinc-400 break-all pt-1">
                    Optimized Stream: {verifyResult1.optimizedUrl}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <span className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400">
              Live Preview (Video 1)
            </span>
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[280px] aspect-[9/16] bg-black border border-zinc-800 rounded-lg overflow-hidden relative shadow-md">
                {video1.url ? (
                  <video
                    key={video1.url}
                    src={video1.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-600 text-xs">
                    <span>No video specified. Enter a link or upload a file above.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">SLOT 02</span>
              <h3 className="text-xl font-serif text-white tracking-wide">Video 2: Second Look</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={video2.is_visible}
                onChange={(e) => setVideo2((prev) => ({ ...prev, is_visible: e.target.checked }))}
                className="w-4 h-4 accent-coral rounded"
              />
              <span>Visible on Homepage</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={video2.eyebrow}
                onChange={(e) => setVideo2((prev) => ({ ...prev, eyebrow: e.target.value }))}
                placeholder="SECOND LOOK"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                Heading Title
              </label>
              <input
                type="text"
                value={video2.title}
                onChange={(e) => setVideo2((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="The runway, again."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                Video Link (Google Drive / Direct MP4 URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={video2.url}
                  onChange={(e) => {
                    setVideo2((prev) => ({ ...prev, url: e.target.value }));
                    setVerifyResult2(null);
                  }}
                  placeholder="https://drive.google.com/file/d/... or /ramp_video_2.mp4"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-zinc-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleVerify(2)}
                  disabled={verifying2 || !video2.url}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {verifying2 ? "Checking..." : "Check & Optimize"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                ref={fileInputRef2}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => handleFileUpload(e, 2)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef2.current?.click()}
                disabled={uploading2}
                className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                {uploading2 ? (
                  <span>Uploading to Storage...</span>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Upload Local MP4 File</span>
                  </>
                )}
              </button>
            </div>

            {verifyResult2 && (
              <div
                className={`p-3.5 rounded-lg border text-xs tracking-wider space-y-1 ${
                  verifyResult2.permissionOk
                    ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                    : "bg-red-950/40 border-red-800/80 text-red-200"
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>{verifyResult2.permissionOk ? "✓ Permission Verified" : "✕ Permission Error"}</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed font-light">{verifyResult2.message}</p>
                {verifyResult2.optimizedUrl && (
                  <div className="text-[10px] font-mono text-zinc-400 break-all pt-1">
                    Optimized Stream: {verifyResult2.optimizedUrl}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <span className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400">
              Live Preview (Video 2)
            </span>
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[280px] aspect-[9/16] bg-black border border-zinc-800 rounded-lg overflow-hidden relative shadow-md">
                {video2.url ? (
                  <video
                    key={video2.url}
                    src={video2.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-600 text-xs">
                    <span>No video specified. Enter a link or upload a file above.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
