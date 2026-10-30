"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface InstagramPost {
  id: number;
  postId: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
  mediaType?: string;
}

interface InstagramGridProps {
  eyebrow?: string;
  headline?: string;
  profile_url?: string;
  image?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
}

export default function InstagramGrid({
  eyebrow = "FOLLOW ALONG",
  headline = "@deflores.india",
  profile_url = "https://instagram.com/deflores.india",
  image,
  image_1,
  image_2,
  image_3,
  image_4,
  image_5,
  image_6,
}: InstagramGridProps) {
  const customImages = [image_1 || image, image_2, image_3, image_4, image_5, image_6];

  const defaultPosts: InstagramPost[] = [
    { id: 1, postId: "1", mediaUrl: customImages[0] || "/newimages/IMG_1058.webp", permalink: profile_url, caption: "Artisanal lehenga silhouette in pure georgette." },
    { id: 2, postId: "2", mediaUrl: customImages[1] || "/newimages/IMG_1060.webp", permalink: profile_url, caption: "Hand-finished silk cotton festive chic." },
    { id: 3, postId: "3", mediaUrl: customImages[2] || "/newimages/IMG_1061.webp", permalink: profile_url, caption: "Dramatic scarlet cowl drape gown." },
    { id: 4, postId: "4", mediaUrl: customImages[3] || "/newimages/IMG_1062.webp", permalink: profile_url, caption: "Bespoke bridal heirlooms tailored to perfection." },
    { id: 5, postId: "5", mediaUrl: customImages[4] || "/new_images2/IMG_1076.webp", permalink: profile_url, caption: "Runway couture and architectural drape." },
    { id: 6, postId: "6", mediaUrl: customImages[5] || "/new_images2/IMG_1077.webp", permalink: profile_url, caption: "Atelier details. Hand-stitched precision." },
  ];

  const [posts, setPosts] = useState<InstagramPost[]>(defaultPosts);

  useEffect(() => {
    const fetchInstagram = async () => {
      try {
        const res = await fetch("/api/instagram/sync");
        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          const mapped = data.posts.slice(0, 6).map((p: any, idx: number) => {
            const custom = customImages[idx]?.trim();
            return {
              id: p.id || idx + 1,
              postId: p.postId || p.postid || p.post_id || String(p.id || idx + 1),
              mediaUrl: custom || p.mediaUrl || p.mediaurl || p.media_url || defaultPosts[idx].mediaUrl,
              permalink: p.permalink || profile_url,
              caption: p.caption || defaultPosts[idx].caption,
              mediaType: p.mediaType || p.mediatype || p.media_type,
            };
          });

          while (mapped.length < 6) {
            const idx = mapped.length;
            const custom = customImages[idx]?.trim();
            mapped.push({
              ...defaultPosts[idx],
              mediaUrl: custom || defaultPosts[idx].mediaUrl,
            });
          }

          setPosts(mapped);
        } else {
          setPosts(defaultPosts);
        }
      } catch (err) {
        console.error("Failed to fetch synced Instagram posts:", err);
        setPosts(defaultPosts);
      }
    };
    fetchInstagram();
  }, [profile_url, image, image_1, image_2, image_3, image_4, image_5, image_6]);

  return (
    <section
      aria-labelledby="instagram-heading"
      className="w-full pt-12 sm:pt-16 min-[900px]:pt-24 pb-8 sm:pb-12 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex flex-col items-center text-center gap-3 mb-8 sm:mb-12">
        <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-grey">
          {eyebrow}
        </span>
        <a
          id="instagram-heading"
          href={profile_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-[clamp(24px,3.5vw,36px)] font-normal text-ink hover:text-coral transition-colors duration-200"
        >
          {headline}
        </a>
      </div>

      <div className="w-full px-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 min-[900px]:grid-cols-6 gap-1">
          {posts.map((post) => (
            <a
              key={post.id || post.postId}
              href={post.permalink || profile_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.caption || "View on Instagram"}
              className="group block relative aspect-square overflow-hidden bg-phBg select-none border border-line"
            >
              <Image
                src={post.mediaUrl || (post as any).mediaurl || "/newimages/IMG_1058.webp"}
                alt={post.caption || "De Flores Instagram post"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                unoptimized={typeof post.mediaUrl === "string" && (post.mediaUrl.startsWith("/uploads/") || post.mediaUrl.startsWith("http"))}
              />
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                <div className="flex justify-end">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <p className="text-[10px] line-clamp-3 leading-snug font-sans text-paper/90">
                  {post.caption || "View on Instagram @deflores.india"}
                </p>
                <span className="text-[9px] uppercase tracking-widest text-coral font-semibold">
                  View Post →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
