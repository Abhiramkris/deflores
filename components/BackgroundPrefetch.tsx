"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BackgroundPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const prefetchAssets = () => {
      const routes = [
        "/explore",
        "/collections/lehenga",
        "/collections/gown",
        "/collections/saree",
        "/collections/mens-wear",
        "/collections/party-wear",
      ];

      for (const route of routes) {
        try {
          router.prefetch(route);
        } catch {}
      }

      const endpoints = ["/api/products", "/api/categories"];

      for (const url of endpoints) {
        try {
          fetch(url, { priority: "low" } as RequestInit).catch(() => {});
        } catch {}
      }
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const handle = window.requestIdleCallback(prefetchAssets, { timeout: 3000 });
        return () => window.cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(prefetchAssets, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [router]);

  return null;
}
