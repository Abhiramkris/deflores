"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StatData {
  totalLogs: number;
  totalSubscribers: number;
  totalProducts: number;
  totalGalleryImages: number;
  uniqueDevices: number;
  uniqueSessions: number;
  totalActivities: number;
}

interface LogEntry {
  id: number;
  actorEmail: string;
  actionType: string;
  description: string;
  createdAt: string;
}

interface UserActivity {
  id: number;
  sessionId: string;
  deviceId: string;
  actionType: string;
  pageUrl: string;
  scrollPercentage: number | null;
  targetElement: string | null;
  productId: string | null;
  email: string | null;
  createdAt: string;
}

interface UserDevice {
  id: number;
  email: string;
  deviceId: string;
  createdAt: string;
}

interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "product" | "gallery" | "newsletter" | "logs" | "reviews">("stats");
  const [activeLogSubTab, setActiveLogSubTab] = useState<"admin" | "user">("admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dashboard Data States
  const [stats, setStats] = useState<StatData>({ totalLogs: 0, totalSubscribers: 0, totalProducts: 0, totalGalleryImages: 0, uniqueDevices: 0, uniqueSessions: 0, totalActivities: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userDevices, setUserDevices] = useState<UserDevice[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [pId, setPId] = useState("");
  const [pTitle, setPTitle] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pColors, setPColors] = useState("Mint, Ivory");
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState("Alexander Stewart");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewQuote, setReviewQuote] = useState("Spectacular hand loom work. Stitched perfectly, fitting details are flawless.");
  const [includeReview, setIncludeReview] = useState(false);
  const [includeExtraLookbook, setIncludeExtraLookbook] = useState(false);
  const [extraLookbookFiles, setExtraLookbookFiles] = useState<File[]>([]);

  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryDesc, setGalleryDesc] = useState("");

  const [subEmail, setSubEmail] = useState("");
  const [campSubject, setCampSubject] = useState("");
  const [campHtml, setCampHtml] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editAuthor, setEditAuthor] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editQuote, setEditQuote] = useState("");

  // Fetch Dashboard details
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setLogs(data.logs);
        setUserActivities(data.userActivities || []);
        setUserDevices(data.userDevices || []);
        setSubscribers(data.subscribers);
        setProducts(data.products);
        setReviews(data.reviews || []);
        setSelectedProductIds([]);
      } else {
        router.push("/admin/login");
      }
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateReview = async (id: number) => {
    if (!editAuthor.trim() || !editQuote.trim()) {
      showNotification("Please fill in all review fields.", true);
      return;
    }

    try {
      const res = await fetch("/api/admin/reviews/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, author: editAuthor, rating: editRating, quote: editQuote })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Review updated successfully.");
        setEditingReviewId(null);
        fetchDashboardData();
      } else {
        showNotification(data.error || "Failed to update review", true);
      }
    } catch (err) {
      showNotification("Error updating review", true);
    }
  };

  const handleDeleteProducts = async (ids: string[]) => {
    const confirmMsg = ids.length === 1 
      ? "Are you sure you want to delete this product?" 
      : `Are you sure you want to delete these ${ids.length} products?`;
      
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(ids.length === 1 ? "Product deleted successfully (soft delete)." : "Selected products deleted successfully (soft delete).");
        setSelectedProductIds([]);
        fetchDashboardData();
      } else {
        showNotification(data.error || "Failed to delete products", true);
      }
    } catch (err) {
      showNotification("Error during product deletion", true);
    }
  };

  const handleLogout = async () => {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  const showNotification = (msg: string, err = false) => {
    setMessage(msg);
    setIsError(err);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleTitleChange = (val: string) => {
    setPTitle(val);
    
    // Generate clean lowercase key with underscores instead of spaces
    let generatedKey = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_") // Replace spaces and special characters with underscore
      .replace(/^_+|_+$/g, "");    // Clean leading/trailing underscores

    if (generatedKey) {
      // Check if key already exists in local products list
      const keyExists = products.some(p => p.id === generatedKey);
      if (keyExists) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        generatedKey = `${generatedKey}_${randomNum}`;
      }
      setPId(generatedKey);
    } else {
      setPId("");
    }
  };

  // Add Product Submit Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productFiles.length !== 4) {
      showNotification("Please select exactly 4 showcase photos (minimum and limit required).", true);
      return;
    }
    if (!pId || !pTitle) {
      showNotification("Please fill in ID and Title.", true);
      return;
    }

    const formData = new FormData();
    productFiles.forEach((file, idx) => {
      formData.append(`file_${idx}`, file);
    });
    formData.append("type", "product");
    formData.append("id", pId);
    formData.append("title", pTitle);
    formData.append("description", pDescription);
    
    // Convert colors list to JSON string
    const colorArray = pColors.split(",").map(c => ({ name: c.trim(), hex: "#ffffff" }));
    formData.append("colors", JSON.stringify(colorArray));

    // Append reviews data if enabled
    if (includeReview) {
      formData.append("reviewAuthor", reviewAuthor);
      formData.append("reviewRating", reviewRating.toString());
      formData.append("reviewQuote", reviewQuote);
    } else {
      formData.append("reviewAuthor", "");
      formData.append("reviewRating", "0");
      formData.append("reviewQuote", "");
    }

    // Append extra lookbook gallery files if enabled
    if (includeExtraLookbook && extraLookbookFiles.length > 0) {
      formData.append("extraFilesCount", extraLookbookFiles.length.toString());
      extraLookbookFiles.forEach((file, idx) => {
        formData.append(`extra_file_${idx}`, file);
      });
    } else {
      formData.append("extraFilesCount", "0");
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Product catalog item and WebP compressed showcase photos registered successfully!");
        setPId("");
        setPTitle("");
        setPDescription("");
        setProductFiles([]);
        setReviewAuthor("Alexander Stewart");
        setReviewRating(5);
        setReviewQuote("Spectacular hand loom work. Stitched perfectly, fitting details are flawless.");
        setIncludeReview(false);
        setIncludeExtraLookbook(false);
        setExtraLookbookFiles([]);
        fetchDashboardData();
      } else {
        showNotification(data.error || "Upload failed", true);
      }
    } catch (err) {
      showNotification("Server error during upload", true);
    }
  };

  // Gallery Upload Handler
  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) {
      showNotification("Please select a gallery image file.", true);
      return;
    }

    const formData = new FormData();
    formData.append("file", galleryFile);
    formData.append("type", "gallery");
    formData.append("description", galleryDesc);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Gallery image optimized and uploaded successfully!");
        setGalleryDesc("");
        setGalleryFile(null);
        fetchDashboardData();
      } else {
        showNotification(data.error || "Upload failed", true);
      }
    } catch (err) {
      showNotification("Server error during upload", true);
    }
  };

  // Add Newsletter Subscriber
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_subscriber", email: subEmail })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Manually subscribed: ${subEmail}`);
        setSubEmail("");
        fetchDashboardData();
      } else {
        showNotification(data.error || "Error adding subscriber", true);
      }
    } catch (err) {
      showNotification("Connection error", true);
    }
  };

  // Send Email Campaign
  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campSubject || !campHtml) {
      showNotification("Subject and HTML body content are required.", true);
      return;
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_campaign", subject: campSubject, html: campHtml })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Email campaign sent out successfully!");
        setCampSubject("");
        setCampHtml("");
        fetchDashboardData();
      } else {
        showNotification(data.error || "Failed sending emails", true);
      }
    } catch (err) {
      showNotification("Connection error", true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-950 font-serif text-lg">
        Synchronizing workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-800">
      
      {/* Sidebar navigation */}
      <aside className={`transition-all duration-300 bg-zinc-950 text-white flex flex-col justify-between p-6 ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        <div className="space-y-8">
          
          <div className="flex flex-col gap-4">
            {/* Collapse Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-zinc-400 hover:text-white p-1.5 rounded-md bg-zinc-900 border border-zinc-800 self-start cursor-pointer hover:bg-zinc-800 transition-colors"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>

            {!sidebarCollapsed ? (
              <div className="text-left">
                <Link href="/" className="font-serif text-xl tracking-[0.2em] uppercase text-white hover:opacity-75 block">
                  DeFlores
                </Link>
                <span className="text-[9px] tracking-widest text-zinc-500 uppercase font-semibold block mt-1">Admin Panel</span>
              </div>
            ) : (
              <div className="text-center font-serif text-lg tracking-[0.1em] font-bold text-white border-b border-zinc-850 pb-2">
                DF
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1.5 text-left">
            {[
              { 
                id: "stats", 
                label: "Dashboard Stats", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ) 
              },
              { 
                id: "product", 
                label: "Add Dynamic Product", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                ) 
              },
              { 
                id: "gallery", 
                label: "Gallery Manager", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                ) 
              },
              { 
                id: "newsletter", 
                label: "Newsletter Manager", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                ) 
              },
              { 
                id: "logs", 
                label: "Action Logs & Activity", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H3.75A1.5 1.5 0 002.25 3.75v16.5A1.5 1.5 0 003.75 21.75h12A1.5 1.5 0 0017.25 20.25V18m2.25-3.75a1.5 1.5 0 00-1.875-1.432m1.875 1.432a1.5 1.5 0 01-1.875 1.432m0-2.864A1.5 1.5 0 0116.5 15m.001 0V18m0 0H18.75" />
                  </svg>
                ) 
              },
              { 
                id: "reviews", 
                label: "Reviews Manager", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.107-.218-.284-.348-.508-.348s-.401.13-.508.348L8.27 7.747l-4.69.682c-.24.035-.418.2-.468.435-.05.235.04.482.23.652l3.393 3.308-.8 4.672c-.04.24.06.48.265.626.205.146.475.148.68.006l4.195-2.206 4.196 2.206c.205.142.475.14.68-.006.205-.146.305-.386.265-.626l-.8-4.672 3.393-3.308c.19-.17.28-.417.23-.652-.05-.235-.228-.4-.468-.435l-4.69-.682-2.197-4.248z" />
                  </svg>
                ) 
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                title={tab.label}
                className={`w-full text-left rounded-lg transition-all cursor-pointer flex items-center gap-3 ${
                  sidebarCollapsed ? "justify-center p-3" : "py-3 px-4"
                } ${
                  activeTab === tab.id 
                    ? "bg-white text-zinc-950 shadow-xs" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <span className="shrink-0">{tab.icon}</span>
                {!sidebarCollapsed && (
                  <span className="text-[11px] font-bold tracking-widest uppercase truncate">{tab.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full text-center border border-zinc-700 hover:border-white text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer py-3 text-xs flex justify-center items-center gap-2"
          >
            <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 3l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {!sidebarCollapsed && <span className="text-[10px] font-bold tracking-widest uppercase">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace panel */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen">
        
        {/* Floating Notification */}
        {message && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-xs font-semibold tracking-widest uppercase ${
            isError ? "bg-red-950 text-red-200 border border-red-800" : "bg-zinc-950 text-white border border-zinc-800"
          }`}>
            {message}
          </div>
        )}

        {/* TAB 1: Statistics Dashboard */}
        {activeTab === "stats" && (() => {
          // 1. Calculate product click popularity from real-time activities logs
          const productInterest: Record<string, number> = {};
          userActivities.forEach((actItem) => {
            const act = actItem as any;
            const prodId = act.productId || act.productid;
            if (prodId) {
              productInterest[prodId] = (productInterest[prodId] || 0) + 1;
            }
          });
          const productInterestList = Object.entries(productInterest)
            .map(([id, count]) => ({ id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          // 2. Calculate engagement over last 7 days for the line graph
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }).reverse();

          const dailyActivity = last7Days.map(dayLabel => {
            const count = userActivities.filter((actItem) => {
              const act = actItem as any;
              const createdAt = act.createdAt || act.createdat;
              if (!createdAt) return false;
              const actDay = new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              return actDay === dayLabel;
            }).length;
            return { label: dayLabel, value: count };
          });

          const maxVal = Math.max(...dailyActivity.map(d => d.value), 5);
          const chartW = 400;
          const chartH = 140;
          const points = dailyActivity.map((d, index) => {
            const x = (index / (dailyActivity.length - 1)) * (chartW - 60) + 40;
            const y = chartH - (d.value / maxVal) * (chartH - 40) - 20;
            return `${x},${y}`;
          }).join(" ");

          return (
            <div className="space-y-10 text-left">
              <div className="space-y-1">
                <h2 className="font-serif text-3xl font-light text-zinc-950">Overview Statistics</h2>
                <p className="text-xs text-zinc-400 font-light">Real-time storefront engagement, catalog, and newsletter metrics.</p>
              </div>
              
              {/* Grid of counter statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { count: stats.totalSubscribers, label: "Subscribers", subText: "Active newsletter list", icon: (
                    <svg className="w-5 h-5 text-zinc-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  )},
                  { count: stats.totalProducts, label: "Products Catalog", subText: "Bespoke Dynamic items", icon: (
                    <svg className="w-5 h-5 text-zinc-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l5.159-5.159a2.25 2.25 0 000-3.182L12.001 3.66a2.25 2.25 0 00-1.591-.659v.001zM6 7.5h.008v.008H6V7.5z" />
                    </svg>
                  )},
                  { count: stats.totalGalleryImages, label: "Gallery Photos", subText: "Masonry Lookbook count", icon: (
                    <svg className="w-5 h-5 text-zinc-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />
                    </svg>
                  )},
                  { count: stats.uniqueDevices, label: "Audience Devices", subText: "Logged Visitor ID count", icon: (
                    <svg className="w-5 h-5 text-zinc-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 15h9" />
                    </svg>
                  )}
                ].map((card, idx) => (
                  <div key={idx} className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                      <div className="text-3xl font-serif font-light text-zinc-950">{card.count}</div>
                      <div className="text-[10px] tracking-wider font-bold uppercase text-zinc-900">{card.label}</div>
                      <div className="text-[9px] font-light text-zinc-400">{card.subText}</div>
                    </div>
                    <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">{card.icon}</div>
                  </div>
                ))}
              </div>

              {/* Graphic Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Chart 1: Traffic Line Chart */}
                <div className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-widest">Client Interaction Trend</h3>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-100">Last 7 Days</span>
                  </div>

                  <div className="w-full relative h-[160px] flex items-center justify-center">
                    <svg className="w-full h-full" viewBox={`0 0 ${chartW} ${chartH}`}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#09090b" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#09090b" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Y-axis Helper gridlines */}
                      <line x1="40" y1="20" x2={chartW - 20} y2="20" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" />
                      <line x1="40" y1="70" x2={chartW - 20} y2="70" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" />
                      <line x1="40" y1="120" x2={chartW - 20} y2="120" stroke="#f4f4f5" strokeWidth="1" />

                      {/* Area Fill */}
                      {dailyActivity.length > 1 && (
                        <path
                          d={`M ${dailyActivity.map((d, i) => `${(i / (dailyActivity.length - 1)) * (chartW - 60) + 40},${chartH - (d.value / maxVal) * (chartH - 40) - 20}`).join(" L ")} L ${(dailyActivity.length - 1) / (dailyActivity.length - 1) * (chartW - 60) + 40},120 L 40,120 Z`}
                          fill="url(#areaGrad)"
                        />
                      )}

                      {/* Chart Path Line */}
                      {dailyActivity.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#09090b"
                          strokeWidth="2"
                          points={points}
                        />
                      )}

                      {/* Node dots & numbers */}
                      {dailyActivity.map((d, index) => {
                        const cx = (index / (dailyActivity.length - 1)) * (chartW - 60) + 40;
                        const cy = chartH - (d.value / maxVal) * (chartH - 40) - 20;
                        return (
                          <g key={index}>
                            <circle cx={cx} cy={cy} r="3" fill="#09090b" />
                            <text x={cx} y={cy - 8} textAnchor="middle" className="text-[8px] font-bold fill-zinc-950 font-sans">{d.value}</text>
                            <text x={cx} y="134" textAnchor="middle" className="text-[7px] font-bold fill-zinc-400 font-sans uppercase tracking-wider">{d.label}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Chart 2: Product Popularity Bar Chart */}
                <div className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-sm font-bold text-zinc-900 uppercase tracking-widest">Product Click Popularity</h3>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-100">Top Interactions</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    {productInterestList.length > 0 ? (
                      productInterestList.map((item, idx) => {
                        const maxCount = Math.max(...productInterestList.map(p => p.count), 1);
                        const widthPct = (item.count / maxCount) * 100;
                        // Find product title matching ID
                        const pTitle = products.find(p => p.id === item.id)?.title || `Product #${item.id}`;
                        return (
                          <div key={idx} className="space-y-1 text-[10px]">
                            <div className="flex justify-between font-medium">
                              <span className="text-zinc-950 font-bold truncate max-w-[200px]">{pTitle}</span>
                              <span className="text-zinc-500 font-mono font-bold">{item.count} clicks</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-zinc-950 h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${widthPct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-[140px] flex items-center justify-center text-xs text-zinc-400 font-light">No click logs registered yet. Visit storefront product pages to track activity.</div>
                    )}
                  </div>
                </div>

              </div>

              {/* Catalog list section */}
              <div className="bg-white border border-zinc-200/60 p-6 md:p-8 rounded-xl shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-zinc-950">Active Catalog Items</h3>
                  <div className="flex gap-4 items-center">
                    {selectedProductIds.length > 0 && (
                      <button 
                        onClick={() => handleDeleteProducts(selectedProductIds)} 
                        className="bg-red-900 text-red-100 hover:bg-red-950 px-3.5 py-1.5 rounded-lg text-[9px] tracking-widest font-bold uppercase transition-all shadow-xs border border-red-800"
                      >
                        Delete Selected ({selectedProductIds.length})
                      </button>
                    )}
                    <span className="text-[9px] tracking-wider uppercase font-semibold text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">{products.length} Items</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-150 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4 w-10">
                          <input 
                            type="checkbox"
                            checked={products.length > 0 && selectedProductIds.length === products.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds(products.map(p => p.id));
                              } else {
                                setSelectedProductIds([]);
                              }
                            }}
                            className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-4">Preview</th>
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const productImages = (p as any).images || [];
                        const thumbnail = productImages[0] || "/crop_green.png";
                        const isChecked = selectedProductIds.includes(p.id);
                        return (
                          <tr key={p.id} className={`border-b border-zinc-50 hover:bg-zinc-50/50 ${isChecked ? "bg-zinc-50/70" : ""}`}>
                            <td className="py-3 px-4">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProductIds([...selectedProductIds, p.id]);
                                  } else {
                                    setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                                  }
                                }}
                                className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="relative w-8 h-10 bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden shadow-xs">
                                <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-zinc-950">#{p.id}</td>
                            <td className="py-3 px-4 font-semibold text-zinc-900">{p.title}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[8px] font-bold bg-emerald-50 text-emerald-700 tracking-wide rounded-full uppercase border border-emerald-100">Live</span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-4">
                              <Link href={`/product/${p.id}`} target="_blank" className="text-zinc-950 underline hover:opacity-70 font-bold text-[9px] tracking-widest uppercase">
                                View
                              </Link>
                              <button 
                                onClick={() => handleDeleteProducts([p.id])}
                                className="text-red-600 hover:text-red-800 font-bold text-[9px] tracking-widest uppercase cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          );
        })()}

        {/* TAB 2: Add Dynamic Product */}
        {activeTab === "product" && (
          <div className="space-y-8 text-left">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-light text-zinc-950">Add Dynamic Product</h2>
              <p className="text-xs text-zinc-500 leading-relaxed font-light tracking-wide">
                Upload exactly 4 showcase photos. Images will be optimized to WebP and saved in Supabase Storage.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Inputs */}
              <div className="lg:col-span-8">
                <form onSubmit={handleAddProduct} className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Product Title</label>
                    <input
                      type="text"
                      required
                      value={pTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Mint Sequin Lehenga"
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Description</label>
                    <textarea
                      rows={3}
                      value={pDescription}
                      onChange={(e) => setPDescription(e.target.value)}
                      placeholder="Bespoke Circular Lehenga detailed threadwork..."
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Colors (Comma List)</label>
                    <input
                      type="text"
                      value={pColors}
                      onChange={(e) => setPColors(e.target.value)}
                      placeholder="Mint, Ivory"
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block font-semibold text-zinc-700">Showcase Photos (Exactly 4 Required)</label>
                    <input
                      type="file"
                      multiple
                      required
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setProductFiles(files);
                      }}
                      className="text-xs text-zinc-500"
                    />
                    <p className="text-[9px] text-zinc-400 mt-1 font-light">Selected: {productFiles.length} / 4 files</p>
                  </div>

                  {/* Reviews Toggle Checkbox */}
                  <div className="flex items-center gap-2 pt-2 pb-2">
                    <input
                      type="checkbox"
                      id="includeReview"
                      checked={includeReview}
                      onChange={(e) => setIncludeReview(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                    />
                    <label htmlFor="includeReview" className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase cursor-pointer select-none">
                      Include Customer Review
                    </label>
                  </div>

                  {/* Extra Lookbook Gallery Toggle Checkbox */}
                  <div className="flex items-center gap-2 pb-2">
                    <input
                      type="checkbox"
                      id="includeExtraLookbook"
                      checked={includeExtraLookbook}
                      onChange={(e) => setIncludeExtraLookbook(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                    />
                    <label htmlFor="includeExtraLookbook" className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase cursor-pointer select-none">
                      Add Extra Gallery Images (Lookbook)
                    </label>
                  </div>

                  {/* Extra Lookbook Files input */}
                  {includeExtraLookbook && (
                    <div className="border-t border-zinc-100 pt-6 space-y-4">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block font-semibold text-zinc-700">Extra Lookbook / Gallery Photos</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setExtraLookbookFiles(files);
                        }}
                        className="text-xs text-zinc-500"
                      />
                      <p className="text-[9px] text-zinc-400 mt-1 font-light">Selected: {extraLookbookFiles.length} lookbook files</p>
                    </div>
                  )}

                  {/* Reviews Segment */}
                  {includeReview && (
                    <div className="border-t border-zinc-100 pt-6 space-y-4">
                      <h3 className="font-serif text-sm font-bold text-zinc-950 uppercase">Customer Review</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Author Name</label>
                          <input
                            type="text"
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            placeholder="Alexander Stewart"
                            className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Stars (1-5)</label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={reviewRating}
                            onChange={(e) => setReviewRating(parseInt(e.target.value) || 5)}
                            className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Review Message</label>
                        <textarea
                          rows={2}
                          value={reviewQuote}
                          onChange={(e) => setReviewQuote(e.target.value)}
                          placeholder="Spectacular hand loom work. Stitched perfectly, fitting details are flawless."
                          className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Product ID Key (Auto Generated) */}
                  <div className="space-y-2 border-t border-zinc-100 pt-6">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Product ID / Key</label>
                    <input
                      type="text"
                      required
                      value={pId}
                      onChange={(e) => setPId(e.target.value)}
                      placeholder="e.g. mint_sequin_lehenga"
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-zinc-50/50 font-mono"
                    />
                    <p className="text-[8px] text-zinc-400 font-light mt-1">Generated automatically from Title. Duplicate values append a random unique suffix.</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors"
                  >
                    Upload Product Item
                  </button>
                </form>
              </div>

              {/* Right Column: Live Storefront Preview */}
              <div className="lg:col-span-4 bg-zinc-50/50 p-6 rounded-xl border border-zinc-200/50 max-h-[85vh] overflow-y-auto space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <h3 className="font-serif text-sm font-bold text-zinc-400 uppercase tracking-widest">Storefront Live Preview</h3>
                  <span className="text-[8px] tracking-wider uppercase font-semibold text-zinc-400 bg-zinc-200 px-2.5 py-0.5 rounded-full">Responsive Layout Mock</span>
                </div>

                <div className="bg-white border border-zinc-150 p-6 rounded-xl shadow-xs space-y-8 font-sans">
                  
                  {/* Dynamic Images Grid (shows uploaded files as blob urls, fallbacks to blank) */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6 bg-zinc-100 aspect-square relative overflow-hidden rounded-lg flex items-center justify-center text-[10px] text-zinc-400">
                      {productFiles[0] ? (
                        <img src={URL.createObjectURL(productFiles[0])} alt="Preview 1" className="w-full h-full object-cover" />
                      ) : "Showcase 1 (Main)"}
                    </div>

                    <div className="col-span-6 grid grid-cols-2 gap-3">
                      <div className="bg-zinc-100 aspect-square relative overflow-hidden rounded-lg flex items-center justify-center text-[8px] text-zinc-400">
                        {productFiles[1] ? (
                          <img src={URL.createObjectURL(productFiles[1])} alt="Preview 2" className="w-full h-full object-cover" />
                        ) : "Showcase 2"}
                      </div>
                      <div className="bg-zinc-100 aspect-square relative overflow-hidden rounded-lg flex items-center justify-center text-[8px] text-zinc-400">
                        {productFiles[2] ? (
                          <img src={URL.createObjectURL(productFiles[2])} alt="Preview 3" className="w-full h-full object-cover" />
                        ) : "Showcase 3"}
                      </div>
                      <div className="col-span-2 bg-zinc-100 aspect-[2/1] relative overflow-hidden rounded-lg flex items-center justify-center text-[8px] text-zinc-400">
                        {productFiles[3] ? (
                          <img src={URL.createObjectURL(productFiles[3])} alt="Preview 4" className="w-full h-full object-cover" />
                        ) : "Showcase 4 (Detail)"}
                      </div>
                    </div>
                  </div>

                  {/* Details and Review box */}
                  <div className="flex flex-col gap-6 text-left">
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-[8px] bg-zinc-950 text-white font-bold tracking-widest uppercase px-2 py-0.5 rounded-full inline-block">Bespoke</span>
                        <h4 className="font-serif text-xl font-light text-zinc-950">{pTitle || "Product Title Preview"}</h4>
                        <div className="flex gap-1 text-[9px] text-amber-500">★ 5.0 (New Reviews)</div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] tracking-widest font-bold uppercase text-zinc-400 block">Colors</span>
                        <div className="flex gap-1.5">
                          {pColors.split(",").map((c, i) => (
                            <span key={i} className="text-[8px] tracking-widest uppercase bg-zinc-50 border border-zinc-200 px-2 py-0.5 font-bold text-zinc-600 rounded-sm">{c.trim() || "Color"}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-zinc-100 pt-4">
                        <span className="text-[8px] tracking-widest font-bold uppercase text-zinc-400 block">Description</span>
                        <p className="text-[10px] text-zinc-500 font-light leading-relaxed">{pDescription || "Provide a custom circular lehenga description to preview details here..."}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Inquiry button */}
                      <div className="bg-zinc-950 text-white p-4 rounded-xl flex flex-col gap-2 items-center text-center">
                        <span className="text-[8px] tracking-widest font-bold uppercase text-zinc-400">Inquiry Link</span>
                        <div className="w-full text-white text-[9px] font-bold tracking-widest uppercase py-2 bg-white/10 rounded-lg hover:bg-white/15 transition-all text-center">Inquire via WhatsApp</div>
                      </div>

                      {/* Review details */}
                      {includeReview && (
                        <div className="border border-zinc-100 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-zinc-950">{reviewAuthor || "Reviewer"}</span>
                            <span className="text-[8px] text-amber-500">{"★".repeat(Math.max(1, Math.min(5, reviewRating)))}</span>
                          </div>
                          <p className="text-[9px] text-zinc-500 font-light italic leading-relaxed">"{reviewQuote || "Spectacular design."}"</p>
                        </div>
                      )}

                      {/* Extra Lookbook Gallery grid preview */}
                      {includeExtraLookbook && extraLookbookFiles.length > 0 && (
                        <div className="border-t border-zinc-100 pt-4 space-y-2">
                          <span className="text-[8px] tracking-widest font-bold uppercase text-zinc-400 block">Lookbook Gallery Mockup</span>
                          <div className="grid grid-cols-2 gap-2">
                            {extraLookbookFiles.slice(0, 4).map((file, idx) => (
                              <div key={idx} className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-md flex items-center justify-center text-[8px] text-zinc-400">
                                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                          {extraLookbookFiles.length > 4 && (
                            <p className="text-[8px] text-zinc-400 font-light text-center">+ {extraLookbookFiles.length - 4} more photos</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: Gallery Manager */}
        {activeTab === "gallery" && (
          <div className="space-y-8 text-left max-w-2xl">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-light text-zinc-950">Gallery Manager</h2>
              <p className="text-xs text-zinc-500 leading-relaxed font-light tracking-wide">
                Optimizes images before uploading to Supabase Storage, instantly showing on the Pinterest masonry gallery grid.
              </p>
            </div>

            <form onSubmit={handleUploadGallery} className="bg-white border border-zinc-200/60 p-8 rounded-2xl shadow-xs space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Description / Caption</label>
                <input
                  type="text"
                  required
                  value={galleryDesc}
                  onChange={(e) => setGalleryDesc(e.target.value)}
                  placeholder="e.g. HAUTE COUTURE"
                  className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Gallery Image File</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                  className="text-xs text-zinc-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors"
              >
                Optimized Upload to Gallery
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Newsletter Manager */}
        {activeTab === "newsletter" && (
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-3xl font-light text-zinc-950">Newsletter & Campaigns</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: List and Add Manual subscriber */}
              <div className="lg:col-span-5 space-y-8">
                {/* Add Manual Form */}
                <form onSubmit={handleAddSubscriber} className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs space-y-4">
                  <h3 className="font-serif text-base font-bold text-zinc-950">Add Subscriber</h3>
                  <input
                    type="email"
                    required
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="client@email.com"
                    className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                  />
                  <button type="submit" className="w-full bg-zinc-950 text-white text-[9px] font-bold tracking-widest uppercase py-2.5 hover:bg-zinc-800 transition-colors">
                    Add Email Address
                  </button>
                </form>                 {/* Subscribers table list */}
                <div className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs space-y-4">
                  <h3 className="font-serif text-base font-bold text-zinc-950">Newsletter Subscribers List</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-wider text-[9px] py-2">
                          <th className="pb-2">Email</th>
                          <th className="pb-2">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub) => (
                          <tr key={sub.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                            <td className="py-2.5 font-medium text-zinc-950">{sub.email}</td>
                            <td className="py-2.5 text-zinc-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mapped Devices list */}
                <div className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs space-y-4">
                  <h3 className="font-serif text-base font-bold text-zinc-950">Linked Devices Registry</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-wider text-[9px] py-2">
                          <th className="pb-2">Email</th>
                          <th className="pb-2">Device ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDevices.map((dev) => (
                          <tr key={dev.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                            <td className="py-2.5 font-medium text-zinc-950 truncate max-w-[120px]" title={dev.email}>{dev.email}</td>
                            <td className="py-2.5 font-mono text-[9px] text-zinc-500">{dev.deviceId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Draft Campaign via Resend */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSendCampaign} className="bg-white border border-zinc-200/60 p-8 rounded-2xl shadow-xs space-y-6">
                  <h3 className="font-serif text-lg font-bold text-zinc-950">Draft Email Campaign</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Subject Line</label>
                    <input
                      type="text"
                      required
                      value={campSubject}
                      onChange={(e) => setCampSubject(e.target.value)}
                      placeholder="Seasonal Summer Collection Launch..."
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">HTML Content</label>
                    <textarea
                      required
                      rows={8}
                      value={campHtml}
                      onChange={(e) => setCampHtml(e.target.value)}
                      placeholder="<p>Greetings from de flores Haute Couture. We are pleased to launch our collection...</p>"
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent resize-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors"
                  >
                    Broadcast Campaign to Subscribers
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Action Logs */}
        {activeTab === "logs" && (
          <div className="space-y-8 text-left">
            <div className="space-y-2 flex justify-between items-end">
              <div>
                <h2 className="font-serif text-3xl font-light text-zinc-950">Action Logging & Tracking</h2>
                <p className="text-xs text-zinc-500 leading-relaxed font-light tracking-wide">
                  A chronological log registry tracking system activities and frontend user actions.
                </p>
              </div>
              
              {/* Subtab selection */}
              <div className="flex gap-2 border-b border-zinc-200">
                <button
                  onClick={() => setActiveLogSubTab("admin")}
                  className={`text-[10px] font-bold tracking-widest uppercase pb-2 px-4 cursor-pointer ${
                    activeLogSubTab === "admin" ? "border-b-2 border-zinc-950 text-zinc-950" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  System Logs
                </button>
                <button
                  onClick={() => setActiveLogSubTab("user")}
                  className={`text-[10px] font-bold tracking-widest uppercase pb-2 px-4 cursor-pointer ${
                    activeLogSubTab === "user" ? "border-b-2 border-zinc-950 text-zinc-950" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  User Activities
                </button>
              </div>
            </div>

            {activeLogSubTab === "admin" ? (
              <div className="bg-white border border-zinc-200/60 p-6 md:p-8 rounded-xl shadow-xs">
                <h3 className="font-serif text-base font-bold text-zinc-950 mb-4">System & Admin Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-150 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Actor</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((logItem) => {
                        const log = logItem as any;
                        const actType = log.actionType || log.actiontype || "";
                        const actor = log.actorEmail || log.actoremail || "System/Client";
                        const createdAt = log.createdAt || log.createdat || "";
                        return (
                          <tr key={log.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                            <td className="py-3 px-4 text-zinc-400 font-mono">
                              {createdAt ? new Date(createdAt).toLocaleString() : "-"}
                            </td>
                            <td className="py-3 px-4 font-bold text-zinc-950">{actor}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider rounded-full uppercase ${
                                actType.includes("FAILED") ? "bg-red-50 text-red-700" :
                                actType.includes("SUCCESS") ? "bg-emerald-50 text-emerald-700" :
                                actType.includes("SUBSCRIBED") ? "bg-blue-50 text-blue-700" : "bg-zinc-100 text-zinc-700"
                              }`}>
                                {actType}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-zinc-600 font-light">{log.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-zinc-200/60 p-6 md:p-8 rounded-xl shadow-xs">
                <h3 className="font-serif text-base font-bold text-zinc-950 mb-4">Real-time Frontend Tracking Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-150 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Session & Device</th>
                        <th className="py-3 px-4">Identity (Email)</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Product ID / Interest</th>
                        <th className="py-3 px-4">Target Details</th>
                        <th className="py-3 px-4">Scroll</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userActivities.map((actItem) => {
                        const act = actItem as any;
                        const sessId = act.sessionId || act.sessionid || "";
                        const devId = act.deviceId || act.deviceid || "";
                        const actType = act.actionType || act.actiontype || "";
                        const prodId = act.productId || act.productid || "";
                        const targetEl = act.targetElement || act.targetelement || "";
                        const scrollPct = act.scrollPercentage || act.scrollpercentage || null;
                        const createdAt = act.createdAt || act.createdat || "";
                        return (
                          <tr key={act.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                            <td className="py-3 px-4 text-zinc-400 font-mono">
                              {createdAt ? new Date(createdAt).toLocaleString() : "-"}
                            </td>
                            <td className="py-3 px-4 font-mono text-[9px] space-y-0.5">
                              <div><span className="text-zinc-400 font-sans uppercase">Session:</span> {sessId.slice(0, 10)}...</div>
                              <div><span className="text-zinc-400 font-sans uppercase">Device:</span> {devId.slice(0, 10)}...</div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-zinc-950 truncate max-w-[120px]" title={act.email || ""}>
                              {act.email || "-"}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider rounded-full uppercase ${
                                actType === "WHATSAPP_CLICK" ? "bg-emerald-50 text-emerald-700" :
                                actType === "NEWSLETTER_SUB" ? "bg-amber-50 text-amber-700" :
                                actType === "SCROLL" ? "bg-purple-50 text-purple-700" : "bg-zinc-100 text-zinc-700"
                              }`}>
                                {actType}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                              {prodId ? (
                                <Link href={`/product/${prodId}`} target="_blank" className="underline hover:opacity-75">
                                  #{prodId}
                                </Link>
                              ) : "-"}
                            </td>
                            <td className="py-3 px-4 text-zinc-600 font-light truncate max-w-xs" title={targetEl}>
                              {targetEl || "No target data"}
                            </td>
                            <td className="py-3 px-4 font-mono text-zinc-500">
                              {scrollPct ? `${scrollPct}%` : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 5: Reviews Manager */}
        {activeTab === "reviews" && (
          <div className="space-y-8 text-left">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-light text-zinc-950">Reviews Manager</h2>
              <p className="text-xs text-zinc-500 leading-relaxed font-light tracking-wide">
                View, moderate, and edit all customer reviews across your catalog items.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/60 p-6 md:p-8 rounded-xl shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-150 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Product ID</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Review Message</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.length > 0 ? (
                      reviews.map((r) => {
                        const isEditing = editingReviewId === r.id;
                        return (
                          <tr key={r.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                            <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                              #{r.productId || r.product_id}
                            </td>
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editAuthor}
                                  onChange={(e) => setEditAuthor(e.target.value)}
                                  className="border border-zinc-200 text-xs px-2 py-1 focus:outline-none focus:border-zinc-500 rounded bg-transparent w-full"
                                />
                              ) : (
                                <span className="font-semibold text-zinc-950">{r.author}</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min={1}
                                  max={5}
                                  value={editRating}
                                  onChange={(e) => setEditRating(parseInt(e.target.value) || 5)}
                                  className="border border-zinc-200 text-xs px-2 py-1 focus:outline-none focus:border-zinc-500 rounded bg-transparent w-16"
                                />
                              ) : (
                                <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {isEditing ? (
                                <textarea
                                  value={editQuote}
                                  onChange={(e) => setEditQuote(e.target.value)}
                                  className="border border-zinc-200 text-xs px-2 py-1 focus:outline-none focus:border-zinc-500 rounded bg-transparent w-full resize-none"
                                  rows={2}
                                />
                              ) : (
                                <p className="text-zinc-600 font-light italic">"{r.quote}"</p>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isEditing ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleUpdateReview(r.id)}
                                    className="bg-zinc-950 text-white px-2.5 py-1 rounded text-[8px] tracking-wider uppercase font-bold hover:bg-zinc-800 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingReviewId(null)}
                                    className="border border-zinc-200 text-zinc-500 px-2.5 py-1 rounded text-[8px] tracking-wider uppercase font-bold hover:bg-zinc-100 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingReviewId(r.id);
                                    setEditAuthor(r.author);
                                    setEditRating(r.rating);
                                    setEditQuote(r.quote);
                                  }}
                                  className="text-zinc-950 underline hover:opacity-75 font-bold text-[9px] tracking-widest uppercase cursor-pointer"
                                >
                                  Edit Review
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 font-light text-xs">No customer reviews found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
