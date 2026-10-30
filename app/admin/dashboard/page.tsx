"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import StorefrontCms from "../../../components/admin/StorefrontCms";

interface StatData {
  totalLogs: number;
  totalSubscribers: number;
  totalProducts: number;
  totalGalleryImages: number;
  uniqueDevices: number;
  uniqueSessions: number;
  totalActivities: number;
  instagramHandle?: string;
  instagramLastSynced?: string | null;
  totalInstagramPosts?: number;
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

interface ProductColor {
  name: string;
  hex: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  category?: string;
  subcategory?: string;
  badge?: string;
  gender?: string;
  occasion?: string[];
  fabric?: string;
  craft?: string;
  isPatron?: boolean;
  patronQuote?: string;
  patronAuthor?: string;
  description: string;
  colors?: ProductColor[];
  sizes?: string[];
  details?: Record<string, any>;
  rating?: number;
  reviewCount?: number;
  reviewAuthor?: string;
  reviewRating?: number;
  reviewQuote?: string;
  images?: string[];
  lookbookImages?: string[];
  createdAt?: string;
}

const GENDER_OPTIONS = ["Women", "Men", "Unisex", "Bridal"];
const OCCASION_PRESETS = [
  "Bridal",
  "Reception",
  "Sangeet & Haldi",
  "Cocktail & Party",
  "Festive Heirloom",
  "Evening Gala",
  "Bespoke Couture",
  "Casual Luxury",
];
const FABRIC_PRESETS = [
  "Pure Georgette",
  "Silk Cotton",
  "Raw Silk",
  "Organza",
  "Chiffon",
  "Handloom Silk",
  "Velvet",
  "Banarasi Brocade",
  "Crepe",
  "Tulle & Net",
];
const CRAFT_PRESETS = [
  "Zari Embroidery",
  "Hand-stitched Sequins",
  "Cowl Draping",
  "Aari & Zardozi Work",
  "Threadwork",
  "Mirror Work",
  "Cutwork & Appliqué",
  "Architectural Pleating",
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "product" | "gallery" | "newsletter" | "logs" | "categories" | "cms">("stats");
  const [activeLogSubTab, setActiveLogSubTab] = useState<"admin" | "user">("admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [stats, setStats] = useState<StatData>({ totalLogs: 0, totalSubscribers: 0, totalProducts: 0, totalGalleryImages: 0, uniqueDevices: 0, uniqueSessions: 0, totalActivities: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userDevices, setUserDevices] = useState<UserDevice[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [adminCategories, setAdminCategories] = useState<any[]>([]);
  const [selectedCatIdx, setSelectedCatIdx] = useState<number>(0);
  const [isSavingCat, setIsSavingCat] = useState(false);
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);
  const [uploadingSubIdx, setUploadingSubIdx] = useState<number | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");
  const [pId, setPId] = useState("");
  const [pTitle, setPTitle] = useState("");
  const [pPrice, setPPrice] = useState("₹28,500");
  const [pCategory, setPCategory] = useState("Bespoke");
  const [pSubcategory, setPSubcategory] = useState("");
  const [pBadge, setPBadge] = useState("Bespoke");
  const [pDescription, setPDescription] = useState("");
  const [pColors, setPColors] = useState<ProductColor[]>([
    { name: "Mint", hex: "#a3ebd6" },
    { name: "Ivory", hex: "#fdfaf2" },
  ]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#f0705e");
  const [pSizes, setPSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [pLeadTime, setPLeadTime] = useState("5-7 Working Days");
  const [pGender, setPGender] = useState<string>("Women");
  const [pOccasions, setPOccasions] = useState<string[]>(["Bridal", "Reception"]);
  const [pFabric, setPFabric] = useState<string>("Pure Georgette");
  const [pCraft, setPCraft] = useState<string>("Zari Embroidery");
  const [pIsPatron, setPIsPatron] = useState<boolean>(false);
  const [pPatronQuote, setPPatronQuote] = useState<string>("");
  const [pPatronAuthor, setPPatronAuthor] = useState<string>("");
  const [newOccasionInput, setNewOccasionInput] = useState<string>("");
  const [isSyncingInstagram, setIsSyncingInstagram] = useState<boolean>(false);
  const [slot0File, setSlot0File] = useState<File | null>(null);
  const [slot0Existing, setSlot0Existing] = useState("");
  const [slot1File, setSlot1File] = useState<File | null>(null);
  const [slot1Existing, setSlot1Existing] = useState("");
  const [slot2File, setSlot2File] = useState<File | null>(null);
  const [slot2Existing, setSlot2Existing] = useState("");
  const [slot3File, setSlot3File] = useState<File | null>(null);
  const [slot3Existing, setSlot3Existing] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("Alexander Stewart");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewQuote, setReviewQuote] = useState("Spectacular hand loom work. Stitched perfectly, fitting details are flawless.");
  const [includeReview, setIncludeReview] = useState(false);
  const [includeExtraLookbook, setIncludeExtraLookbook] = useState(false);
  const [extraLookbookFiles, setExtraLookbookFiles] = useState<File[]>([]);
  const [existingLookbookUrls, setExistingLookbookUrls] = useState<string[]>([]);
  const [isPublishingProduct, setIsPublishingProduct] = useState(false);
  const [publishStatusText, setPublishStatusText] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryDesc, setGalleryDesc] = useState("");

  const [subEmail, setSubEmail] = useState("");
  const [campSubject, setCampSubject] = useState("");
  const [campHtml, setCampHtml] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

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
        setSelectedProductIds([]);
      } else {
        router.push("/admin/login");
      }

      // Fetch categories for management
      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      if (catData.success && catData.categories) {
        const normalized = catData.categories.map((c: any) => ({
          ...c,
          subcategories: Array.isArray(c.subcategories)
            ? c.subcategories
            : typeof c.subcategories === "string"
            ? (() => {
                try {
                  const p = JSON.parse(c.subcategories);
                  return Array.isArray(p) ? p : [];
                } catch {
                  return [];
                }
              })()
            : [],
        }));
        setAdminCategories(normalized);
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
    if (!isEditMode) {
      let generatedKey = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

      if (generatedKey) {
        const keyExists = products.some((p) => p.id === generatedKey);
        if (keyExists) {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          generatedKey = `${generatedKey}_${randomNum}`;
        }
        setPId(generatedKey);
      } else {
        setPId("");
      }
    }
  };

  const handleResetProductForm = () => {
    setIsEditMode(false);
    setEditingProductId("");
    setPId("");
    setPTitle("");
    setPPrice("₹28,500");
    setPCategory("Bespoke");
    setPSubcategory("");
    setPBadge("Bespoke");
    setPDescription("");
    setPGender("Women");
    setPOccasions(["Bridal", "Reception"]);
    setPFabric("Pure Georgette");
    setPCraft("Zari Embroidery");
    setPIsPatron(false);
    setPPatronQuote("");
    setPPatronAuthor("");
    setNewOccasionInput("");
    setPColors([
      { name: "Mint", hex: "#a3ebd6" },
      { name: "Ivory", hex: "#fdfaf2" },
    ]);
    setNewColorName("");
    setNewColorHex("#f0705e");
    setPSizes(["S", "M", "L", "XL"]);
    setPLeadTime("5-7 Working Days");
    setSlot0File(null);
    setSlot0Existing("");
    setSlot1File(null);
    setSlot1Existing("");
    setSlot2File(null);
    setSlot2Existing("");
    setSlot3File(null);
    setSlot3Existing("");
    setIncludeReview(false);
    setReviewAuthor("Alexander Stewart");
    setReviewRating(5);
    setReviewQuote("Spectacular hand loom work. Stitched perfectly, fitting details are flawless.");
    setIncludeExtraLookbook(false);
    setExtraLookbookFiles([]);
    setExistingLookbookUrls([]);
    setFileInputKey((prev) => prev + 1);
  };

  const handleEditProduct = (p: Product) => {
    setIsEditMode(true);
    setEditingProductId(p.id);
    setPId(p.id);
    setPTitle(p.title || "");
    setPPrice(p.price || "Haute Couture");
    setPCategory(p.category || "Bespoke");
    setPSubcategory(p.subcategory || "");
    setPBadge(p.badge || p.category || "Bespoke");
    setPDescription(p.description || "");
    setPGender(p.gender || "Women");
    const occList = Array.isArray(p.occasion) ? p.occasion : (typeof p.occasion === "string" ? (() => { try { const parsed = JSON.parse(p.occasion); return Array.isArray(parsed) ? parsed : []; } catch { return []; } })() : []);
    setPOccasions(occList.length > 0 ? occList : ["Bridal"]);
    setPFabric(p.fabric || "Pure Georgette");
    setPCraft(p.craft || "Zari Embroidery");
    setPIsPatron(Boolean(p.isPatron));
    setPPatronQuote(p.patronQuote || p.reviewQuote || "");
    setPPatronAuthor(p.patronAuthor || p.reviewAuthor || "");
    setNewOccasionInput("");

    let parsedColors: ProductColor[] = [];
    if (Array.isArray(p.colors) && p.colors.length > 0) {
      parsedColors = p.colors;
    } else {
      parsedColors = [{ name: "Ivory", hex: "#fdfaf2" }];
    }
    setPColors(parsedColors);

    let parsedSizes: string[] = [];
    if (Array.isArray(p.sizes) && p.sizes.length > 0) {
      parsedSizes = p.sizes;
    } else {
      parsedSizes = ["S", "M", "L", "XL"];
    }
    setPSizes(parsedSizes);

    setPLeadTime(p.details?.leadTime || "5-7 Working Days");

    const showcase = p.images || [];
    setSlot0File(null);
    setSlot0Existing(showcase[0] || "");
    setSlot1File(null);
    setSlot1Existing(showcase[1] || "");
    setSlot2File(null);
    setSlot2Existing(showcase[2] || "");
    setSlot3File(null);
    setSlot3Existing(showcase[3] || "");

    const hasRev = Boolean(p.reviewAuthor && p.reviewQuote);
    setIncludeReview(hasRev);
    setReviewAuthor(p.reviewAuthor || "Alexander Stewart");
    setReviewRating(p.reviewRating || 5);
    setReviewQuote(p.reviewQuote || "");

    const lookbooks = p.lookbookImages || [];
    setIncludeExtraLookbook(lookbooks.length > 0);
    setExistingLookbookUrls(lookbooks);
    setExtraLookbookFiles([]);

    setActiveTab("product");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishingProduct) return;

    const trimmedTitle = (pTitle || "").trim();
    const cleanId = (pId || trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")).trim().replace(/^_+|_+$/g, "");

    if (!cleanId || !trimmedTitle) {
      showNotification("Please provide both Product ID and Title.", true);
      return;
    }

    const hasSlot0 = slot0File || slot0Existing;
    if (!hasSlot0) {
      showNotification("Please provide at least Showcase Photo 1 (Main Hero image).", true);
      return;
    }

    setIsPublishingProduct(true);
    setPublishStatusText(isEditMode ? "Optimizing media & updating product..." : "Compressing images with Sharp WebP & publishing...");

    const formData = new FormData();
    formData.append("type", "product");
    formData.append("id", cleanId);
    formData.append("title", trimmedTitle);
    formData.append("price", pPrice || "Haute Couture");
    formData.append("category", pCategory || "Bespoke");
    formData.append("subcategory", pSubcategory || "");
    formData.append("badge", pBadge || pCategory || "Bespoke");
    formData.append("gender", pGender);
    formData.append("occasion", JSON.stringify(pOccasions));
    formData.append("fabric", pFabric);
    formData.append("craft", pCraft);
    formData.append("isPatron", pIsPatron ? "true" : "false");
    formData.append("patronQuote", pPatronQuote);
    formData.append("patronAuthor", pPatronAuthor);
    formData.append("description", pDescription || "");
    formData.append("colors", JSON.stringify(pColors));
    formData.append("sizes", JSON.stringify(pSizes));
    formData.append("details", JSON.stringify({ leadTime: pLeadTime }));

    if (slot0File) formData.append("file_0", slot0File);
    else if (slot0Existing) formData.append("existing_image_0", slot0Existing);

    if (slot1File) formData.append("file_1", slot1File);
    else if (slot1Existing) formData.append("existing_image_1", slot1Existing);

    if (slot2File) formData.append("file_2", slot2File);
    else if (slot2Existing) formData.append("existing_image_2", slot2Existing);

    if (slot3File) formData.append("file_3", slot3File);
    else if (slot3Existing) formData.append("existing_image_3", slot3Existing);

    if (includeReview && reviewAuthor && reviewQuote) {
      formData.append("reviewAuthor", reviewAuthor);
      formData.append("reviewRating", reviewRating.toString());
      formData.append("reviewQuote", reviewQuote);
    } else {
      formData.append("reviewAuthor", "");
      formData.append("reviewRating", "0");
      formData.append("reviewQuote", "");
    }

    if (includeExtraLookbook) {
      formData.append("existing_lookbook_images", JSON.stringify(existingLookbookUrls));
      formData.append("extraFilesCount", extraLookbookFiles.length.toString());
      extraLookbookFiles.forEach((file, idx) => {
        formData.append(`extra_file_${idx}`, file);
      });
    } else {
      formData.append("extraFilesCount", "0");
    }

    try {
      setPublishStatusText("Uploading and processing files via secure backend...");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(isEditMode ? `Product "${trimmedTitle}" updated successfully!` : `Dynamic product "${trimmedTitle}" published successfully!`);
        handleResetProductForm();
        await fetchDashboardData();
        if (typeof document !== "undefined") {
          const catalogEl = document.getElementById("active-catalog-items");
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else {
        showNotification(data.error || "Save failed. Please check image formats or field sizes.", true);
      }
    } catch {
      showNotification("Server error or connection interrupted during save", true);
    } finally {
      setIsPublishingProduct(false);
      setPublishStatusText("");
    }
  };

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
                id: "categories", 
                label: "Categories & Sub-Categories", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                ) 
              },
              { 
                id: "cms", 
                label: "Storefront CMS", 
                icon: (
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h17.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
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

              <div id="active-catalog-items" className="bg-white border border-zinc-200/60 p-6 md:p-8 rounded-xl shadow-xs space-y-4">
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
                            <td className="py-3 px-4">
                              <div className="font-semibold text-zinc-900">{p.title}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className="px-1.5 py-0.5 bg-zinc-100 text-[8px] font-bold text-zinc-600 uppercase">{p.gender || "Women"}</span>
                                {p.category && <span className="px-1.5 py-0.5 bg-zinc-100 text-[8px] font-bold text-zinc-600 uppercase">{p.category}</span>}
                                {p.fabric && <span className="px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 text-[8px] text-zinc-500 uppercase">{p.fabric}</span>}
                                {p.isPatron && <span className="px-1.5 py-0.5 bg-coral/10 text-coral border border-coral/30 text-[8px] font-bold uppercase">Patron</span>}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[8px] font-bold bg-emerald-50 text-emerald-700 tracking-wide rounded-full uppercase border border-emerald-100">Live</span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-4">
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="text-zinc-950 hover:text-coral font-bold text-[9px] tracking-widest uppercase cursor-pointer"
                              >
                                Edit
                              </button>
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

        {activeTab === "product" && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-3xl font-light text-zinc-950">
                    {isEditMode ? `Edit Product: ${pTitle || pId}` : "Product Catalog Manager"}
                  </h2>
                  {isEditMode && (
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Edit Mode (#{pId})
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light tracking-wide">
                  Configure titles, categories, pricing, color swatches, sizes, showcase photos, and client reviews.
                </p>
              </div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleResetProductForm}
                  className="self-start sm:self-auto text-[10px] tracking-widest uppercase font-bold text-zinc-700 hover:text-zinc-950 px-4 py-2 border border-zinc-300 bg-white hover:bg-zinc-50 shadow-xs cursor-pointer transition-colors"
                >
                  Cancel Edit / Add New
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <form key={fileInputKey} onSubmit={handleAddProduct} className="bg-white border border-zinc-200/60 p-6 sm:p-8 rounded-xl shadow-xs space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Product Title *</label>
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
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Product ID / Key *</label>
                      <input
                        type="text"
                        required
                        value={pId}
                        readOnly={isEditMode}
                        onChange={(e) => setPId(e.target.value)}
                        placeholder="e.g. mint_sequin_lehenga"
                        className={`w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none font-mono ${isEditMode ? "bg-zinc-100 text-zinc-500 cursor-not-allowed" : "bg-zinc-50/50"}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-100 pt-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Category *</label>
                      <select
                        value={pCategory}
                        onChange={(e) => {
                          setPCategory(e.target.value);
                          setPSubcategory("");
                        }}
                        className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-white cursor-pointer"
                      >
                        {adminCategories.length > 0 ? (
                          adminCategories.map((c: any) => (
                            <option key={c.key} value={c.title}>
                              {c.title}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Bespoke">Bespoke</option>
                            <option value="Lehenga">Lehenga</option>
                            <option value="Gown">Gown</option>
                            <option value="Saree">Saree</option>
                            <option value="Party Wear">Party Wear</option>
                            <option value="Mens Wear">Mens Wear</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Subcategory (Optional)</label>
                      {(() => {
                        const matchedCat = adminCategories.find((c: any) => c.title === pCategory || c.key === pCategory.toLowerCase());
                        const subs = matchedCat && Array.isArray(matchedCat.subcategories) ? matchedCat.subcategories : [];
                        return (
                          <div className="flex gap-2">
                            {subs.length > 0 ? (
                              <select
                                value={pSubcategory}
                                onChange={(e) => setPSubcategory(e.target.value)}
                                className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-white cursor-pointer"
                              >
                                <option value="">-- Select Subcategory --</option>
                                {subs.map((s: any, idx: number) => (
                                  <option key={idx} value={s.title}>
                                    {s.title}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={pSubcategory}
                                onChange={(e) => setPSubcategory(e.target.value)}
                                placeholder="e.g. Bridal, Pret, Handloom"
                                className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                              />
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Badge / Tag</label>
                      <input
                        type="text"
                        value={pBadge}
                        onChange={(e) => setPBadge(e.target.value)}
                        placeholder="e.g. Bespoke, Haute Couture"
                        className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest self-center mr-1">Badge Presets:</span>
                    {["Bespoke", "Haute Couture", "Ready to Wear", "Atelier Exclusive", "New Arrival"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setPBadge(b)}
                        className={`text-[9px] tracking-widest uppercase font-semibold px-2.5 py-1 border transition-colors cursor-pointer ${
                          pBadge === b ? "bg-zinc-950 text-white border-zinc-950" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6 border-t border-zinc-100 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-widest text-zinc-950 uppercase">
                        Product Filters & Attributes
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                        System-defined & Custom
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Department / Gender *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {GENDER_OPTIONS.map((g) => {
                          const isSelected = pGender === g;
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setPGender(g)}
                              className={`py-2.5 px-3 text-xs tracking-wider uppercase font-semibold border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                              }`}
                            >
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                          Occasions / Events (Select One or More)
                        </label>
                        <span className="text-[9px] text-zinc-400">
                          {pOccasions.length} selected
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {OCCASION_PRESETS.map((occ) => {
                          const isSelected = pOccasions.includes(occ);
                          return (
                            <button
                              key={occ}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setPOccasions(pOccasions.filter((o) => o !== occ));
                                } else {
                                  setPOccasions([...pOccasions, occ]);
                                }
                              }}
                              className={`text-[10px] tracking-wider uppercase font-medium px-3 py-1.5 border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-zinc-950 text-white border-zinc-950"
                                  : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400"
                              }`}
                            >
                              {occ} {isSelected ? "✓" : "+"}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={newOccasionInput}
                          onChange={(e) => setNewOccasionInput(e.target.value)}
                          placeholder="Add custom occasion (e.g. Sangeet Soirée)"
                          className="w-full border border-zinc-200 text-xs px-3 py-2 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = newOccasionInput.trim();
                            if (trimmed && !pOccasions.includes(trimmed)) {
                              setPOccasions([...pOccasions, trimmed]);
                              setNewOccasionInput("");
                            }
                          }}
                          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[10px] uppercase font-bold tracking-wider cursor-pointer border border-zinc-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Fabric / Material
                      </label>
                      <input
                        type="text"
                        value={pFabric}
                        onChange={(e) => setPFabric(e.target.value)}
                        placeholder="e.g. Pure Georgette, Silk Cotton, Banarasi Brocade"
                        className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {FABRIC_PRESETS.map((fab) => (
                          <button
                            key={fab}
                            type="button"
                            onClick={() => setPFabric(fab)}
                            className={`text-[9px] tracking-wider uppercase font-medium px-2 py-0.5 border cursor-pointer transition-colors ${
                              pFabric === fab
                                ? "bg-zinc-950 text-white border-zinc-950"
                                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                            }`}
                          >
                            {fab}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Craft / Embellishment Technique
                      </label>
                      <input
                        type="text"
                        value={pCraft}
                        onChange={(e) => setPCraft(e.target.value)}
                        placeholder="e.g. Zari Embroidery, Cowl Draping, Hand-stitched Sequins"
                        className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {CRAFT_PRESETS.map((crf) => (
                          <button
                            key={crf}
                            type="button"
                            onClick={() => setPCraft(crf)}
                            className={`text-[9px] tracking-wider uppercase font-medium px-2 py-0.5 border cursor-pointer transition-colors ${
                              pCraft === crf
                                ? "bg-zinc-950 text-white border-zinc-950"
                                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                            }`}
                          >
                            {crf}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border border-zinc-200/80 p-4 bg-zinc-50/50 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pIsPatron}
                          onChange={(e) => setPIsPatron(e.target.checked)}
                          className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-4 w-4 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 block">
                            Feature this creation in "OUR PATRONS" Section on Homepage
                          </span>
                          <span className="text-[10px] text-zinc-500 font-light block">
                            When enabled, this attire and client testimonial are highlighted in the homepage patrons gallery.
                          </span>
                        </div>
                      </label>

                      {pIsPatron && (
                        <div className="space-y-3 pt-3 border-t border-zinc-200/60">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                              Patron / Client Name & Title
                            </label>
                            <input
                              type="text"
                              value={pPatronAuthor}
                              onChange={(e) => setPPatronAuthor(e.target.value)}
                              placeholder="e.g. Meera K., Bridal Client"
                              className="w-full border border-zinc-200 text-xs px-3 py-2 text-zinc-950 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                              Patron Words / Review Quote
                            </label>
                            <textarea
                              rows={2}
                              value={pPatronQuote}
                              onChange={(e) => setPPatronQuote(e.target.value)}
                              placeholder="e.g. The fit was unreal — I didn't need a single alteration for my reception evening."
                              className="w-full border border-zinc-200 text-xs px-3 py-2 text-zinc-950 bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-zinc-100 pt-6">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Price / Inquiry Label</label>
                      <button
                        type="button"
                        onClick={() => setPPrice("Haute Couture • Price on Request")}
                        className="text-[9px] font-semibold tracking-wider text-zinc-500 hover:text-zinc-950 underline cursor-pointer"
                      >
                        Set to "Price on Request"
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      placeholder="e.g. ₹28,500 or Haute Couture"
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                    />
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["₹22,500", "₹24,000", "₹28,500", "₹32,000", "₹45,000", "Price on Request"].map((pr) => (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => setPPrice(pr)}
                          className="text-[9px] tracking-wider uppercase font-medium px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-600 hover:border-zinc-400 cursor-pointer"
                        >
                          {pr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-zinc-100 pt-6">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Description</label>
                    <textarea
                      rows={3}
                      value={pDescription}
                      onChange={(e) => setPDescription(e.target.value)}
                      placeholder="Detailed description of silhouette, hand embroidery, fabric, and circular draping..."
                      className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-4 border-t border-zinc-100 pt-6">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Color Swatches Manager</label>
                    
                    <div className="flex flex-wrap gap-3 items-center">
                      {pColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 shadow-xs"
                        >
                          <div
                            className="w-4 h-4 border border-zinc-300 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-[10px] font-semibold text-zinc-900 tracking-wider uppercase">{color.name}</span>
                          <span className="text-[9px] font-mono text-zinc-400">({color.hex})</span>
                          <button
                            type="button"
                            onClick={() => setPColors(pColors.filter((_, i) => i !== idx))}
                            className="text-zinc-400 hover:text-red-600 font-bold text-xs ml-1 cursor-pointer"
                            title="Remove color"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center pt-2">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Color Presets:</span>
                      {[
                        { name: "Mint", hex: "#a3ebd6" },
                        { name: "Ivory", hex: "#fdfaf2" },
                        { name: "Scarlet", hex: "#cc0000" },
                        { name: "Emerald", hex: "#046342" },
                        { name: "Gold", hex: "#d4af37" },
                        { name: "Blush", hex: "#f6d5cc" },
                        { name: "Coral", hex: "#f0705e" },
                        { name: "Midnight Black", hex: "#111111" },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            if (!pColors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
                              setPColors([...pColors, preset]);
                            }
                          }}
                          className="flex items-center gap-1.5 text-[9px] tracking-wider uppercase px-2 py-1 bg-white border border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 border border-zinc-300" style={{ backgroundColor: preset.hex }} />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center pt-2">
                      <input
                        type="text"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="Custom Color Name (e.g. Royal Navy)"
                        className="border border-zinc-200 text-xs px-3 py-2 text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none w-52"
                      />
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-9 h-9 border border-zinc-200 cursor-pointer p-0.5 bg-white"
                        title="Pick Color Hex"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">{newColorHex}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (newColorName.trim()) {
                            setPColors([...pColors, { name: newColorName.trim(), hex: newColorHex }]);
                            setNewColorName("");
                          }
                        }}
                        className="bg-zinc-950 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-2 hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        + Add Custom Color
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-zinc-100 pt-6">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL", "Custom / Made to Measure"].map((size) => {
                        const isSelected = pSizes.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setPSizes(pSizes.filter((s) => s !== size));
                              } else {
                                setPSizes([...pSizes, size]);
                              }
                            }}
                            className={`text-[10px] tracking-widest uppercase font-semibold px-3 py-1.5 border transition-colors cursor-pointer ${
                              isSelected ? "bg-zinc-950 text-white border-zinc-950" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                            }`}
                          >
                            {isSelected ? `✓ ${size}` : size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-zinc-100 pt-6">
                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-zinc-900 uppercase block">
                        Showcase Photos (4 Dedicated Slots) *
                      </label>
                      <p className="text-[10px] text-zinc-400 font-light mt-0.5">
                        Matches the product detail gallery layout. Upload high-res images (compressed to WebP automatically).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-zinc-200 p-4 space-y-3 bg-zinc-50/50">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-900">Slot 1: Main Front (4:3) *</span>
                          {(slot0File || slot0Existing) && (
                            <span className="text-[8px] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                              {slot0File ? "New File" : "Current"}
                            </span>
                          )}
                        </div>
                        <div className="aspect-[4/3] bg-zinc-200 relative overflow-hidden flex items-center justify-center">
                          {slot0File ? (
                            <img src={URL.createObjectURL(slot0File)} alt="Slot 1" className="w-full h-full object-cover" />
                          ) : slot0Existing ? (
                            <img src={slot0Existing} alt="Slot 1" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-medium">Hero / Front 4:3</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setSlot0File(f);
                          }}
                          className="text-xs text-zinc-500 w-full"
                        />
                      </div>

                      <div className="border border-zinc-200 p-4 space-y-3 bg-zinc-50/50">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-900">Slot 2: Angle 1 (4:3)</span>
                          {(slot1File || slot1Existing) && (
                            <span className="text-[8px] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                              {slot1File ? "New File" : "Current"}
                            </span>
                          )}
                        </div>
                        <div className="aspect-[4/3] bg-zinc-200 relative overflow-hidden flex items-center justify-center">
                          {slot1File ? (
                            <img src={URL.createObjectURL(slot1File)} alt="Slot 2" className="w-full h-full object-cover" />
                          ) : slot1Existing ? (
                            <img src={slot1Existing} alt="Slot 2" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-medium">Side / Angle 4:3</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setSlot1File(f);
                          }}
                          className="text-xs text-zinc-500 w-full"
                        />
                      </div>

                      <div className="border border-zinc-200 p-4 space-y-3 bg-zinc-50/50">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-900">Slot 3: Angle 2 (4:3)</span>
                          {(slot2File || slot2Existing) && (
                            <span className="text-[8px] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                              {slot2File ? "New File" : "Current"}
                            </span>
                          )}
                        </div>
                        <div className="aspect-[4/3] bg-zinc-200 relative overflow-hidden flex items-center justify-center">
                          {slot2File ? (
                            <img src={URL.createObjectURL(slot2File)} alt="Slot 3" className="w-full h-full object-cover" />
                          ) : slot2Existing ? (
                            <img src={slot2Existing} alt="Slot 3" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-medium">Back / Draping 4:3</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setSlot2File(f);
                          }}
                          className="text-xs text-zinc-500 w-full"
                        />
                      </div>

                      <div className="border border-zinc-200 p-4 space-y-3 bg-zinc-50/50">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-900">Slot 4: Detail Panoramic (2:1)</span>
                          {(slot3File || slot3Existing) && (
                            <span className="text-[8px] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                              {slot3File ? "New File" : "Current"}
                            </span>
                          )}
                        </div>
                        <div className="aspect-[2/1] bg-zinc-200 relative overflow-hidden flex items-center justify-center">
                          {slot3File ? (
                            <img src={URL.createObjectURL(slot3File)} alt="Slot 4" className="w-full h-full object-cover" />
                          ) : slot3Existing ? (
                            <img src={slot3Existing} alt="Slot 4" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-medium">Embroidery Detail 2:1</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setSlot3File(f);
                          }}
                          className="text-xs text-zinc-500 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <input
                      type="checkbox"
                      id="includeReview"
                      checked={includeReview}
                      onChange={(e) => setIncludeReview(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                    />
                    <label htmlFor="includeReview" className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase cursor-pointer select-none">
                      Include Customer Review Testimonial
                    </label>
                  </div>

                  {includeReview && (
                    <div className="border border-zinc-200 p-5 space-y-4 bg-zinc-50/40">
                      <h3 className="font-serif text-sm font-bold text-zinc-950 uppercase">Customer Review</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Author Name</label>
                          <input
                            type="text"
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            placeholder="Alexander Stewart"
                            className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-white"
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
                            className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-white"
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
                          className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 focus:outline-none focus:border-zinc-500 rounded-none bg-white resize-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <input
                      type="checkbox"
                      id="includeExtraLookbook"
                      checked={includeExtraLookbook}
                      onChange={(e) => setIncludeExtraLookbook(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                    />
                    <label htmlFor="includeExtraLookbook" className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase cursor-pointer select-none">
                      Atmosphere Editorial Lookbook Photos
                    </label>
                  </div>

                  {includeExtraLookbook && (
                    <div className="border border-zinc-200 p-5 space-y-4 bg-zinc-50/40">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block font-semibold text-zinc-700">
                          Editorial Atmosphere Photos
                        </label>
                        <p className="text-[9px] text-zinc-400">High-fashion campaign images displayed in the editorial lookbook gallery.</p>
                      </div>

                      {existingLookbookUrls.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Existing Lookbook Images:</span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {existingLookbookUrls.map((url, idx) => (
                              <div key={idx} className="relative aspect-[3/4] bg-zinc-100 border border-zinc-200 overflow-hidden group">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setExistingLookbookUrls(existingLookbookUrls.filter((_, i) => i !== idx))}
                                  className="absolute top-1 right-1 bg-black/75 text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title="Delete image"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
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
                        <p className="text-[9px] text-zinc-400 font-light">Selected new lookbook files: {extraLookbookFiles.length}</p>
                      </div>
                    </div>
                  )}

                  {isPublishingProduct && (
                    <div className="p-3.5 bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs flex items-center gap-3 animate-pulse">
                      <svg className="animate-spin h-4 w-4 text-zinc-900 shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 text-[11px] tracking-wider uppercase">
                          {isEditMode ? "Updating Product Item" : "Publishing Dynamic Product Item"}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-light">
                          {publishStatusText || "Compressing images with Sharp WebP & recording to database..."}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-zinc-100 flex gap-4">
                    <button
                      type="submit"
                      disabled={isPublishingProduct}
                      className="flex-1 bg-zinc-950 text-white text-[11px] font-bold tracking-widest uppercase py-4 hover:bg-zinc-800 transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isPublishingProduct ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white shrink-0" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>{isEditMode ? "Saving Changes & Optimizing Media..." : "Publishing Dynamic Product Item..."}</span>
                        </>
                      ) : (
                        <span>{isEditMode ? "Save Changes & Update Product" : "Publish Dynamic Product Item"}</span>
                      )}
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        disabled={isPublishingProduct}
                        onClick={handleResetProductForm}
                        className="px-6 border border-zinc-300 text-zinc-700 text-[11px] font-bold tracking-widest uppercase hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-4 bg-paper p-6 border border-line max-h-[90vh] overflow-y-auto space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-line">
                  <h3 className="font-serif text-sm tracking-[0.18em] uppercase text-grey">Live Preview</h3>
                  <span className="text-[8px] tracking-[0.18em] uppercase font-medium text-ink bg-white px-2 py-0.5 border border-line">
                    0px Luxury Aesthetic
                  </span>
                </div>

                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-phBg aspect-[9/16] relative overflow-hidden border border-line flex items-center justify-center">
                      {slot0File ? (
                        <img src={URL.createObjectURL(slot0File)} alt="Preview 1" className="w-full h-full object-cover" />
                      ) : slot0Existing ? (
                        <img src={slot0Existing} alt="Preview 1" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-grey uppercase tracking-widest">Hero 9:16</span>
                      )}
                      <span className="absolute top-2 left-2 bg-paper/95 text-ink text-[7px] font-medium tracking-[0.15em] uppercase px-2 py-0.5 border border-line">
                        {pBadge || pCategory || "Bespoke"}
                      </span>
                    </div>

                    <div className="bg-phBg aspect-[9/16] relative overflow-hidden border border-line flex items-center justify-center">
                      {slot1File ? (
                        <img src={URL.createObjectURL(slot1File)} alt="Preview 2" className="w-full h-full object-cover" />
                      ) : slot1Existing ? (
                        <img src={slot1Existing} alt="Preview 2" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] text-grey uppercase">Angle 9:16</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-grey block">
                      {pCategory} {pSubcategory ? `• ${pSubcategory}` : ""}
                    </span>
                    <h4 className="font-serif text-2xl uppercase tracking-[0.02em] text-ink leading-tight">
                      {pTitle || "Product Title Preview"}
                    </h4>
                    <div className="font-serif text-lg text-ink">
                      {pPrice || "Haute Couture"}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 bg-white border border-line text-zinc-700">
                        Dept: {pGender}
                      </span>
                      {pFabric && (
                        <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 bg-white border border-line text-zinc-700">
                          {pFabric}
                        </span>
                      )}
                      {pCraft && (
                        <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 bg-white border border-line text-zinc-700">
                          {pCraft}
                        </span>
                      )}
                      {pOccasions.map((occ) => (
                        <span key={occ} className="text-[8px] uppercase tracking-wider px-2 py-0.5 bg-white border border-line text-zinc-700">
                          {occ}
                        </span>
                      ))}
                      {pIsPatron && (
                        <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 bg-coral/10 text-coral border border-coral/30 font-bold">
                          ★ Featured in Our Patrons
                        </span>
                      )}
                    </div>

                    {includeReview && (
                      <div className="flex items-center gap-1.5 text-[10px] text-coral">
                        <span>★</span>
                        <span className="font-medium text-ink">{reviewRating}.0</span>
                        <span className="text-grey">(Verified Patron Review)</span>
                      </div>
                    )}
                  </div>

                  {pColors.length > 0 && (
                    <div className="space-y-2 border-t border-line pt-3">
                      <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-grey block">
                        Color Swatches
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {pColors.map((c, i) => (
                          <div key={i} className="flex items-center gap-1.5 border border-line px-2 py-1 bg-white">
                            <span className="w-3 h-3 border border-line" style={{ backgroundColor: c.hex }} />
                            <span className="text-[9px] uppercase tracking-wider text-ink font-medium">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pSizes.length > 0 && (
                    <div className="space-y-2 border-t border-line pt-3">
                      <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-grey block">
                        Size & Fit
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pSizes.map((s, i) => (
                          <span key={i} className="text-[9px] uppercase tracking-widest px-2.5 py-1 border border-line bg-white text-ink font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-line pt-3">
                    <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-grey block mb-1">
                      Description & Silhouette
                    </span>
                    <p className="text-[12px] text-ink/80 leading-relaxed font-light">
                      {pDescription || "Silken drape with intricate embellishments crafted in our Cochin atelier."}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="w-full bg-ink text-white text-[10px] uppercase tracking-[0.18em] font-medium py-3 text-center">
                      Inquire via WhatsApp →
                    </div>
                  </div>

                  {includeReview && reviewQuote && (
                    <div className="border border-line p-3 bg-white space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-serif text-ink">{reviewAuthor}</span>
                        <span className="text-coral">{"★".repeat(reviewRating)}</span>
                      </div>
                      <p className="text-[10px] text-grey italic leading-relaxed">"{reviewQuote}"</p>
                    </div>
                  )}
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

        {activeTab === "categories" && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-zinc-200 pb-5 gap-4">
              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-light text-zinc-950">Categories & Sub-Categories Manager</h2>
                <p className="text-xs text-zinc-500 leading-relaxed font-light tracking-wide">
                  Edit homepage main categories, tags, images, and customize their respective sub-categories.
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    setIsSavingCat(true);
                    const res = await fetch("/api/categories", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "update_all", categories: adminCategories }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setMessage("Categories and Sub-categories saved successfully!");
                      setIsError(false);
                    } else {
                      setMessage(data.error || "Failed to save categories");
                      setIsError(true);
                    }
                  } catch (err: any) {
                    setMessage(err.message || "Failed saving categories");
                    setIsError(true);
                  } finally {
                    setIsSavingCat(false);
                    setTimeout(() => setMessage(""), 4000);
                  }
                }}
                disabled={isSavingCat}
                className="bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer shadow-md disabled:opacity-50 self-start md:self-auto"
              >
                {isSavingCat ? "Saving..." : "Save All Categories"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3">
              {adminCategories.map((cat, idx) => (
                <button
                  key={cat.key || idx}
                  onClick={() => setSelectedCatIdx(idx)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                    selectedCatIdx === idx
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {cat.num || `0${idx + 1}`}. {cat.title} ({Array.isArray(cat.subcategories) ? cat.subcategories.length : 0})
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newNum = adminCategories.length + 1;
                  const newCat = {
                    key: `category-${newNum}`,
                    num: newNum < 10 ? `0${newNum}` : `${newNum}`,
                    tag: "NEW COLLECTION",
                    title: `Category ${newNum}`,
                    image: "",
                    description: "Bespoke handcrafted collection by De Flores atelier.",
                    subcategories: [],
                  };
                  setAdminCategories([...adminCategories, newCat]);
                  setSelectedCatIdx(adminCategories.length);
                }}
                className="px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase border border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 transition-all bg-white cursor-pointer"
              >
                + Add Category
              </button>
            </div>

            {adminCategories[selectedCatIdx] && (
              <div className="space-y-8">
                <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-xl space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
                    <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-900">
                      Main Category Information: {adminCategories[selectedCatIdx].title}
                    </h3>
                    {adminCategories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const catTitle = adminCategories[selectedCatIdx].title;
                          if (confirm(`Are you sure you want to delete category "${catTitle}"?`)) {
                            const updated = adminCategories.filter((_, i) => i !== selectedCatIdx);
                            setAdminCategories(updated);
                            setSelectedCatIdx(Math.max(0, selectedCatIdx - 1));
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer"
                      >
                        Delete Category
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Category Title</label>
                      <input
                        type="text"
                        value={adminCategories[selectedCatIdx].title || ""}
                        onChange={(e) => {
                          const updated = [...adminCategories];
                          updated[selectedCatIdx].title = e.target.value;
                          setAdminCategories(updated);
                        }}
                        className="w-full border border-zinc-200 text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Tag Badge</label>
                      <input
                        type="text"
                        value={adminCategories[selectedCatIdx].tag || ""}
                        onChange={(e) => {
                          const updated = [...adminCategories];
                          updated[selectedCatIdx].tag = e.target.value;
                          setAdminCategories(updated);
                        }}
                        className="w-full border border-zinc-200 text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Banner Image Path / URL</label>
                        <label className={`text-[9px] font-bold tracking-widest uppercase cursor-pointer hover:underline ${isUploadingCatImage ? "text-zinc-400 pointer-events-none" : "text-zinc-950"}`}>
                          <span>{isUploadingCatImage ? "Uploading..." : "Upload Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingCatImage}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setIsUploadingCatImage(true);
                                const form = new FormData();
                                form.append("file", file);
                                form.append("sectionKey", "categories");
                                form.append("fieldKey", adminCategories[selectedCatIdx].key || "banner");
                                const res = await fetch("/api/admin/cms/upload", {
                                  method: "POST",
                                  body: form,
                                });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  const updated = [...adminCategories];
                                  updated[selectedCatIdx].image = data.url;
                                  setAdminCategories(updated);
                                  setMessage("Category image uploaded & optimized successfully!");
                                  setIsError(false);
                                } else {
                                  setMessage(data.error || "Upload failed");
                                  setIsError(true);
                                }
                              } catch {
                                setMessage("Upload error occurred");
                                setIsError(true);
                              } finally {
                                setIsUploadingCatImage(false);
                                setTimeout(() => setMessage(""), 4000);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={adminCategories[selectedCatIdx].image || ""}
                          placeholder="Image URL or upload"
                          onChange={(e) => {
                            const updated = [...adminCategories];
                            updated[selectedCatIdx].image = e.target.value;
                            setAdminCategories(updated);
                          }}
                          className="w-full border border-zinc-200 text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 bg-transparent font-mono"
                        />
                        {adminCategories[selectedCatIdx].image && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...adminCategories];
                              updated[selectedCatIdx].image = "";
                              setAdminCategories(updated);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs px-3 py-2 border border-zinc-200 rounded-lg hover:border-red-300 bg-white"
                            title="Remove image"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {adminCategories[selectedCatIdx].image && (
                        <div className="mt-2 relative w-32 h-20 rounded-md overflow-hidden border border-zinc-200 bg-zinc-100">
                          <Image
                            src={adminCategories[selectedCatIdx].image}
                            alt="Category Preview"
                            fill
                            unoptimized
                            sizes="128px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Display Number</label>
                      <input
                        type="text"
                        value={adminCategories[selectedCatIdx].num || ""}
                        onChange={(e) => {
                          const updated = [...adminCategories];
                          updated[selectedCatIdx].num = e.target.value;
                          setAdminCategories(updated);
                        }}
                        className="w-full border border-zinc-200 text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:border-zinc-950 bg-transparent font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Category Description</label>
                    <textarea
                      rows={2}
                      value={adminCategories[selectedCatIdx].description || ""}
                      onChange={(e) => {
                        const updated = [...adminCategories];
                        updated[selectedCatIdx].description = e.target.value;
                        setAdminCategories(updated);
                      }}
                      className="w-full border border-zinc-200 text-xs p-4 rounded-lg focus:outline-none focus:border-zinc-950 bg-transparent resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Sub-Categories Editor */}
                <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-xl space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
                    <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-900">
                      Sub-Categories for {adminCategories[selectedCatIdx].title} ({Array.isArray(adminCategories[selectedCatIdx].subcategories) ? adminCategories[selectedCatIdx].subcategories.length : 0})
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...adminCategories];
                        const rawSubs = updated[selectedCatIdx].subcategories;
                        const currentSubs = Array.isArray(rawSubs)
                          ? rawSubs
                          : typeof rawSubs === "string"
                          ? (() => {
                              try {
                                const p = JSON.parse(rawSubs);
                                return Array.isArray(p) ? p : [];
                              } catch {
                                return [];
                              }
                            })()
                          : [];
                        updated[selectedCatIdx].subcategories = [
                          ...currentSubs,
                          { title: "New Sub-Category", desc: "Description for this new sub-category." }
                        ];
                        setAdminCategories(updated);
                      }}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-md transition-colors"
                    >
                      + Add Sub-Category
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(Array.isArray(adminCategories[selectedCatIdx]?.subcategories)
                      ? adminCategories[selectedCatIdx].subcategories
                      : typeof adminCategories[selectedCatIdx]?.subcategories === "string"
                      ? (() => {
                          try {
                            const p = JSON.parse(adminCategories[selectedCatIdx].subcategories);
                            return Array.isArray(p) ? p : [];
                          } catch {
                            return [];
                          }
                        })()
                      : []
                    ).map((sub: any, subIdx: number) => (
                      <div key={subIdx} className="border border-zinc-200/80 p-5 rounded-xl space-y-3 bg-zinc-50/50 relative group">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">SUB-CATEGORY #{subIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...adminCategories];
                              const cur = Array.isArray(updated[selectedCatIdx].subcategories) ? updated[selectedCatIdx].subcategories : [];
                              updated[selectedCatIdx].subcategories = cur.filter((_: any, i: number) => i !== subIdx);
                              setAdminCategories(updated);
                            }}
                            className="text-red-600 hover:text-red-800 text-[10px] font-bold tracking-widest uppercase"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          <div className="md:col-span-3">
                            <label className="block text-[9px] font-bold tracking-widest text-zinc-400 uppercase mb-1">Title</label>
                            <input
                              type="text"
                              value={sub.title || ""}
                              placeholder="Subcategory Title"
                              onChange={(e) => {
                                const updated = [...adminCategories];
                                updated[selectedCatIdx].subcategories[subIdx].title = e.target.value;
                                setAdminCategories(updated);
                              }}
                              className="w-full border border-zinc-200 text-xs px-3 py-2 rounded-md focus:outline-none focus:border-zinc-950 bg-white font-semibold"
                            />
                          </div>
                          <div className="md:col-span-5">
                            <label className="block text-[9px] font-bold tracking-widest text-zinc-400 uppercase mb-1">Description</label>
                            <input
                              type="text"
                              value={sub.desc || ""}
                              placeholder="Short description or style highlights"
                              onChange={(e) => {
                                const updated = [...adminCategories];
                                updated[selectedCatIdx].subcategories[subIdx].desc = e.target.value;
                                setAdminCategories(updated);
                              }}
                              className="w-full border border-zinc-200 text-xs px-3 py-2 rounded-md focus:outline-none focus:border-zinc-950 bg-white"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Image</label>
                              <label className={`text-[9px] font-bold tracking-widest uppercase cursor-pointer hover:underline ${uploadingSubIdx === subIdx ? "text-zinc-400 pointer-events-none" : "text-zinc-950"}`}>
                                <span>{uploadingSubIdx === subIdx ? "Uploading..." : "Upload Image"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingSubIdx !== null}
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      setUploadingSubIdx(subIdx);
                                      const form = new FormData();
                                      form.append("file", file);
                                      form.append("sectionKey", "subcategories");
                                      form.append("fieldKey", `${adminCategories[selectedCatIdx].key || "cat"}_sub_${subIdx}`);
                                      const res = await fetch("/api/admin/cms/upload", {
                                        method: "POST",
                                        body: form,
                                      });
                                      const data = await res.json();
                                      if (data.success && data.url) {
                                        const updated = [...adminCategories];
                                        updated[selectedCatIdx].subcategories[subIdx].image = data.url;
                                        setAdminCategories(updated);
                                        setMessage("Sub-category image uploaded successfully!");
                                        setIsError(false);
                                      } else {
                                        setMessage(data.error || "Upload failed");
                                        setIsError(true);
                                      }
                                    } catch {
                                      setMessage("Upload error occurred");
                                      setIsError(true);
                                    } finally {
                                      setUploadingSubIdx(null);
                                      setTimeout(() => setMessage(""), 4000);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Image URL or upload"
                                value={sub.image || ""}
                                onChange={(e) => {
                                  const updated = [...adminCategories];
                                  updated[selectedCatIdx].subcategories[subIdx].image = e.target.value;
                                  setAdminCategories(updated);
                                }}
                                className="w-full border border-zinc-200 text-xs px-3 py-2 rounded-md focus:outline-none focus:border-zinc-950 bg-white font-mono text-[11px]"
                              />
                              {sub.image && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...adminCategories];
                                    updated[selectedCatIdx].subcategories[subIdx].image = "";
                                    setAdminCategories(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1.5 border border-zinc-200 rounded hover:border-red-300 bg-white"
                                  title="Remove image"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            {sub.image && (
                              <div className="mt-2 relative w-24 h-16 rounded-md overflow-hidden border border-zinc-200 bg-zinc-100">
                                <Image
                                  src={sub.image}
                                  alt={sub.title || "Subcategory Preview"}
                                  fill
                                  unoptimized
                                  sizes="96px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "cms" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white border border-zinc-200/60 p-6 rounded-xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-coral block mb-1">
                  Social Automation · 3-Day Auto Refresh
                </span>
                <h3 className="font-serif text-lg text-zinc-950 font-normal">
                  Instagram Feed Sync (@{stats.instagramHandle || "deflores.india"})
                </h3>
                <p className="text-xs text-zinc-500 font-light mt-1">
                  Cached in database. Auto-refreshes every 3 days. Last synced: {stats.instagramLastSynced ? new Date(stats.instagramLastSynced).toLocaleString() : "Never"} ({stats.totalInstagramPosts || 0} posts active)
                </p>
              </div>
              <button
                type="button"
                disabled={isSyncingInstagram}
                onClick={async () => {
                  try {
                    setIsSyncingInstagram(true);
                    const res = await fetch("/api/instagram/sync?force=true");
                    const data = await res.json();
                    if (data.success) {
                      showNotification("Instagram posts synchronized to database!");
                      fetchDashboardData();
                    } else {
                      showNotification(data.error || "Sync failed", true);
                    }
                  } catch {
                    showNotification("Error syncing Instagram", true);
                  } finally {
                    setIsSyncingInstagram(false);
                  }
                }}
                className="px-5 py-2.5 bg-zinc-950 text-white hover:bg-coral text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSyncingInstagram ? "Syncing Feed..." : "Sync Instagram Now"}
              </button>
            </div>
            <StorefrontCms showNotification={showNotification} actorEmail="admin@deflores.com" />
          </div>
        )}

      </main>

    </div>
  );
}
