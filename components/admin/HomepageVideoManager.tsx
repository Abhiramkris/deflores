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

  const [isPlaying1, setIsPlaying1] = useState(true);
  const [isPlaying2, setIsPlaying2] = useState(true);
  const [isMuted1, setIsMuted1] = useState(true);
  const [isMuted2, setIsMuted2] = useState(true);

  const [saveMessage, setSaveMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

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
                message: "Active video URL loaded from database.",
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
                message: "Active video URL loaded from database.",
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

  const togglePlay = (index: 1 | 2) => {
    const ref = index === 1 ? videoRef1.current : videoRef2.current;
    const isPlaying = index === 1 ? isPlaying1 : isPlaying2;
    const setIsPlaying = index === 1 ? setIsPlaying1 : setIsPlaying2;
    if (!ref) return;
    if (isPlaying) {
      ref.pause();
      setIsPlaying(false);
    } else {
      ref.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (index: 1 | 2) => {
    const ref = index === 1 ? videoRef1.current : videoRef2.current;
    const isMuted = index === 1 ? isMuted1 : isMuted2;
    const setIsMuted = index === 1 ? setIsMuted1 : setIsMuted2;
    if (!ref) return;
    ref.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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
      const res = await fetch("/api/admin/videos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target.url.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.permissionOk) {
        const cleanUrl = data.optimizedUrl || target.url;
        setVideo((prev) => ({ ...prev, url: cleanUrl }));
        setVerifyResult({
          verified: true,
          permissionOk: true,
          message: data.message || "Permissions verified and link optimized for streaming.",
          optimizedUrl: cleanUrl,
        });
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
        text: "Permission check failed on one or both videos. Please verify public access before saving.",
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
          text: "Both Video 1 and Video 2 have been verified, optimized, and published to the live database.",
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
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center shadow-xs">
        <div className="inline-flex items-center gap-3">
          <svg className="animate-spin w-4 h-4 text-coral" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-zinc-600 text-xs font-mono tracking-widest uppercase">
            Synchronizing Runway Videos from Database...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 flex flex-col gap-8 shadow-xs text-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-coral">
              RUNWAY MOTION BROADCAST · SECTION 10
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-zinc-950 font-normal">
            Homepage Ramp Videos (Single Screen Studio)
          </h3>
          <p className="text-xs text-zinc-500 font-light mt-1 max-w-2xl leading-relaxed">
            Manage the looping vertical 9:16 motion runway videos for The Ramp and Second Look. The studio validates public permissions, optimizes Google Drive links into streamable endpoints, and displays live interactive previews before saving to the database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving || verifying1 || verifying2 || uploading1 || uploading2}
          className="self-start sm:self-auto px-6 py-2.5 bg-zinc-950 hover:bg-coral text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-2 shrink-0"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Publishing to DB...</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          className={`p-4 rounded-lg border flex items-center justify-between gap-4 text-xs tracking-wider transition-all ${
            saveMessage.isError
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}
        >
          <div className="flex items-center gap-2.5 font-medium">
            <span>{saveMessage.isError ? "✕" : "✓"}</span>
            <span>{saveMessage.text}</span>
          </div>
          {!saveMessage.isError && (
            <Link
              href="/"
              target="_blank"
              className="text-coral hover:text-zinc-950 font-bold uppercase tracking-wider text-[11px] shrink-0 underline"
            >
              View on Storefront →
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        <div className="bg-zinc-50/70 border border-zinc-200 rounded-xl p-6 flex flex-col gap-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold block mb-0.5">
                SLOT 01 · PRIMARY RUNWAY
              </span>
              <h4 className="text-lg font-serif text-zinc-950 font-normal">
                Video 1: The Ramp
              </h4>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-zinc-600">
                Storefront Visible
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={video1.is_visible}
                  onChange={(e) => setVideo1((prev) => ({ ...prev, is_visible: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={video1.eyebrow}
                  onChange={(e) => setVideo1((prev) => ({ ...prev, eyebrow: e.target.value }))}
                  placeholder="THE RAMP"
                  className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 transition-colors shadow-2xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                  Heading Title
                </label>
                <input
                  type="text"
                  value={video1.title}
                  onChange={(e) => setVideo1((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Couture in motion."
                  className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 transition-colors shadow-2xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                  Video Source Link
                </label>
                <span className="text-[10px] font-medium text-zinc-400 tracking-wider">
                  Google Drive / Direct MP4
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={video1.url}
                  onChange={(e) => {
                    setVideo1((prev) => ({ ...prev, url: e.target.value }));
                    setVerifyResult1(null);
                  }}
                  placeholder="https://drive.google.com/file/d/... or /ramp_video_1.mp4"
                  className="flex-1 bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2.5 rounded-lg font-mono focus:outline-none focus:border-zinc-950 transition-colors shadow-2xs placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => handleVerify(1)}
                  disabled={verifying1 || !video1.url}
                  className="bg-zinc-950 hover:bg-coral text-white text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs flex items-center gap-1.5"
                >
                  {verifying1 ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>Check & Optimize</span>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-1">
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
                className="w-full py-2.5 px-4 bg-white hover:bg-zinc-100 border border-zinc-300 hover:border-zinc-950 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {uploading1 ? (
                  <span className="text-zinc-600">Uploading to Storage...</span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Upload Local MP4 Video File</span>
                  </>
                )}
              </button>
            </div>

            {verifyResult1 && (
              <div
                className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-all ${
                  verifyResult1.permissionOk
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span>{verifyResult1.permissionOk ? "✓ Public Permissions Verified" : "✕ Permission Error"}</span>
                </div>
                <p className="text-[11px] mt-1 font-normal opacity-90">{verifyResult1.message}</p>
                {verifyResult1.optimizedUrl && (
                  <div className="text-[10px] font-mono text-zinc-500 break-all pt-1.5 border-t border-emerald-200/60 mt-1.5">
                    Streaming Endpoint: {verifyResult1.optimizedUrl}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 font-bold">
                Interactive Preview (9:16 Portrait)
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700">
                Live Storefront View
              </span>
            </div>

            <div className="w-full flex justify-center py-2">
              <div className="relative w-full max-w-[240px] aspect-[9/16] bg-zinc-950 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 ring-1 ring-black/5 group">
                {video1.url ? (
                  <>
                    <video
                      ref={videoRef1}
                      key={video1.url}
                      src={video1.url}
                      autoPlay
                      muted={isMuted1}
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />
                    
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-emerald-400 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{video1.is_visible ? "LIVE ON HOME" : "HIDDEN"}</span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => togglePlay(1)}
                        className="bg-black/50 hover:bg-coral text-white backdrop-blur-md p-1.5 rounded-full border border-white/20 transition-colors cursor-pointer"
                        title={isPlaying1 ? "Pause Video" : "Play Video"}
                      >
                        {isPlaying1 ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMute(1)}
                        className="bg-black/50 hover:bg-coral text-white backdrop-blur-md p-1.5 rounded-full border border-white/20 transition-colors cursor-pointer"
                        title={isMuted1 ? "Unmute Audio" : "Mute Audio"}
                      >
                        {isMuted1 ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none text-left">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-white/80 block mb-0.5">
                        {video1.eyebrow || "THE RAMP"}
                      </span>
                      <p className="text-sm font-serif font-light text-white leading-tight">
                        {video1.title || "Couture in motion."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500 text-xs">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 text-zinc-400">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                      <line x1="7" y1="2" x2="7" y2="22" />
                      <line x1="17" y1="2" x2="17" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <line x1="2" y1="7" x2="7" y2="7" />
                      <line x1="2" y1="17" x2="7" y2="17" />
                      <line x1="17" y1="17" x2="22" y2="17" />
                      <line x1="17" y1="7" x2="22" y2="7" />
                    </svg>
                    <span>Enter a valid link or upload a file above to preview.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50/70 border border-zinc-200 rounded-xl p-6 flex flex-col gap-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold block mb-0.5">
                SLOT 02 · SECONDARY RUNWAY
              </span>
              <h4 className="text-lg font-serif text-zinc-950 font-normal">
                Video 2: Second Look
              </h4>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-zinc-600">
                Storefront Visible
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={video2.is_visible}
                  onChange={(e) => setVideo2((prev) => ({ ...prev, is_visible: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={video2.eyebrow}
                  onChange={(e) => setVideo2((prev) => ({ ...prev, eyebrow: e.target.value }))}
                  placeholder="SECOND LOOK"
                  className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 transition-colors shadow-2xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                  Heading Title
                </label>
                <input
                  type="text"
                  value={video2.title}
                  onChange={(e) => setVideo2((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="The runway, again."
                  className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 transition-colors shadow-2xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                  Video Source Link
                </label>
                <span className="text-[10px] font-medium text-zinc-400 tracking-wider">
                  Google Drive / Direct MP4
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={video2.url}
                  onChange={(e) => {
                    setVideo2((prev) => ({ ...prev, url: e.target.value }));
                    setVerifyResult2(null);
                  }}
                  placeholder="https://drive.google.com/file/d/... or /ramp_video_2.mp4"
                  className="flex-1 bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2.5 rounded-lg font-mono focus:outline-none focus:border-zinc-950 transition-colors shadow-2xs placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => handleVerify(2)}
                  disabled={verifying2 || !video2.url}
                  className="bg-zinc-950 hover:bg-coral text-white text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs flex items-center gap-1.5"
                >
                  {verifying2 ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>Check & Optimize</span>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-1">
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
                className="w-full py-2.5 px-4 bg-white hover:bg-zinc-100 border border-zinc-300 hover:border-zinc-950 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {uploading2 ? (
                  <span className="text-zinc-600">Uploading to Storage...</span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Upload Local MP4 Video File</span>
                  </>
                )}
              </button>
            </div>

            {verifyResult2 && (
              <div
                className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-all ${
                  verifyResult2.permissionOk
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span>{verifyResult2.permissionOk ? "✓ Public Permissions Verified" : "✕ Permission Error"}</span>
                </div>
                <p className="text-[11px] mt-1 font-normal opacity-90">{verifyResult2.message}</p>
                {verifyResult2.optimizedUrl && (
                  <div className="text-[10px] font-mono text-zinc-500 break-all pt-1.5 border-t border-emerald-200/60 mt-1.5">
                    Streaming Endpoint: {verifyResult2.optimizedUrl}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 font-bold">
                Interactive Preview (9:16 Portrait)
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700">
                Live Storefront View
              </span>
            </div>

            <div className="w-full flex justify-center py-2">
              <div className="relative w-full max-w-[240px] aspect-[9/16] bg-zinc-950 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 ring-1 ring-black/5 group">
                {video2.url ? (
                  <>
                    <video
                      ref={videoRef2}
                      key={video2.url}
                      src={video2.url}
                      autoPlay
                      muted={isMuted2}
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />
                    
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-emerald-400 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{video2.is_visible ? "LIVE ON HOME" : "HIDDEN"}</span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => togglePlay(2)}
                        className="bg-black/50 hover:bg-coral text-white backdrop-blur-md p-1.5 rounded-full border border-white/20 transition-colors cursor-pointer"
                        title={isPlaying2 ? "Pause Video" : "Play Video"}
                      >
                        {isPlaying2 ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMute(2)}
                        className="bg-black/50 hover:bg-coral text-white backdrop-blur-md p-1.5 rounded-full border border-white/20 transition-colors cursor-pointer"
                        title={isMuted2 ? "Unmute Audio" : "Mute Audio"}
                      >
                        {isMuted2 ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none text-left">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-white/80 block mb-0.5">
                        {video2.eyebrow || "SECOND LOOK"}
                      </span>
                      <p className="text-sm font-serif font-light text-white leading-tight">
                        {video2.title || "The runway, again."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500 text-xs">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 text-zinc-400">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                      <line x1="7" y1="2" x2="7" y2="22" />
                      <line x1="17" y1="2" x2="17" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <line x1="2" y1="7" x2="7" y2="7" />
                      <line x1="2" y1="17" x2="7" y2="17" />
                      <line x1="17" y1="17" x2="22" y2="17" />
                      <line x1="17" y1="7" x2="22" y2="7" />
                    </svg>
                    <span>Enter a valid link or upload a file above to preview.</span>
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
