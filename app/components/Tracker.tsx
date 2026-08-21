"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Helper to generate a random UUID
function generateUUID() {
  return "uuid-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initialize persistent device ID & temporary session ID
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
      deviceId = generateUUID();
      localStorage.setItem("device_id", deviceId);
    }

    let sessionId = sessionStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem("session_id", sessionId);
    }

    const browserMeta = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };

    const sendTrackLog = async (payload: {
      actionType: "PAGE_VIEW" | "SCROLL" | "CLICK" | "TOUCH" | "WHATSAPP_CLICK" | "NEWSLETTER_SUB";
      scrollPercentage?: number;
      targetElement?: string;
    }) => {
      try {
        // Detect product ID dynamically from pathname (e.g. /product/1 -> '1')
        const productMatch = window.location.pathname.match(/\/product\/([^/]+)/);
        const productId = productMatch ? productMatch[1] : null;

        // Retrieve mapped email address if user previously subscribed on this device
        const email = localStorage.getItem("subscriber_email") || null;

        await fetch("/api/logs/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            deviceId,
            pageUrl: window.location.href,
            browserMeta,
            productId,
            email,
            ...payload,
          }),
        });
      } catch (err) {
        // Silently catch tracking transmission errors
      }
    };

    // 2. Track page view on path changes
    sendTrackLog({ actionType: "PAGE_VIEW", targetElement: `Loaded page route: ${pathname}` });

    // 3. Track scroll depth (threshold boundaries: 25%, 50%, 75%, 100%)
    const reportedThresholds = new Set<number>();
    const handleScroll = () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      const pct = Math.min(Math.round((scrollPos / totalHeight) * 100), 100);

      // Report thresholds
      [25, 50, 75, 100].forEach((threshold) => {
        if (pct >= threshold && !reportedThresholds.has(threshold)) {
          reportedThresholds.add(threshold);
          sendTrackLog({
            actionType: "SCROLL",
            scrollPercentage: threshold,
            targetElement: `Scrolled past page ${threshold}% threshold`,
          });
        }
      });
    };

    // 4. Global click listener to track touch/clicks on CTA elements
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find closest link or button
      const interactiveEl = target.closest("a, button");
      if (!interactiveEl) return;

      const elementText = interactiveEl.textContent?.trim().slice(0, 50) || "Icon";
      const href = interactiveEl.getAttribute("href") || "";

      // Classify event category
      let actionType: "WHATSAPP_CLICK" | "NEWSLETTER_SUB" | null = null;
      if (href.includes("wa.me") || elementText.toLowerCase().includes("whatsapp")) {
        actionType = "WHATSAPP_CLICK";
      } else if (elementText.toLowerCase().includes("subscribe") || elementText.toLowerCase().includes("join") || elementText.toLowerCase().includes("inquire")) {
        actionType = "NEWSLETTER_SUB";
      }

      // Ignore normal page navigation link clicks to prevent duplicate tracking (since PAGE_VIEW tracks the destination)
      if (!actionType) return;

      sendTrackLog({
        actionType,
        targetElement: `Clicked <${interactiveEl.tagName.toLowerCase()}> with text "${elementText}" (href: ${href})`,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleGlobalClick, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [pathname]);

  return null; // Invisible global tracking node
}
