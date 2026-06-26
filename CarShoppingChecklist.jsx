import { useState, useRef } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VEHICLES = [
  { id: "rav4_xle",       label: "2026 RAV4 XLE Premium AWD",        msrp: "$37,550", color: "#1a6b3c" },
  { id: "rav4_xse",       label: "2026 RAV4 XSE AWD",                msrp: "$42,750", color: "#1a6b3c" },
  { id: "camry_se",       label: "2026 Camry SE AWD",                 msrp: "$33,900", color: "#1a6b3c" },
  { id: "crv_sportl",     label: "2026 CR-V Sport-L Hybrid AWD",      msrp: "$40,225", color: "#c0392b" },
  { id: "forester_sport", label: "2026 Forester Hybrid Sport AWD",    msrp: "$39,380", color: "#2c6090" },
];

// DealerRater data included; N/A ratings shown as "—"
const DEALERS = [
  // Toyota
  { id: "lynch",       brand: "Toyota", label: "Lynch Toyota",          town: "Manchester",    dist: "~5 mi",  phone: "(860) 646-4321", drRating: "4.6", drReviews: 314  },
  { id: "hartford",    brand: "Toyota", label: "Hartford Toyota",        town: "Hartford",      dist: "~15 mi", phone: "(860) 278-5411", drRating: "4.8", drReviews: 3917 },
  { id: "gale",        brand: "Toyota", label: "Gale Toyota",            town: "Enfield",       dist: "~18 mi", phone: "(860) 741-3534", drRating: "4.1", drReviews: 441  },
  { id: "colchester",  brand: "Toyota", label: "Toyota of Colchester",   town: "Colchester",    dist: "~22 mi", phone: "(860) 537-2666", drRating: "—",   drReviews: 203  },
  { id: "hoffman",     brand: "Toyota", label: "Hoffman Toyota",         town: "West Simsbury", dist: "~22 mi", phone: "(860) 651-3725", drRating: "4.5", drReviews: 891  },
  // Honda
  { id: "manchester_honda", brand: "Honda", label: "Manchester Honda",   town: "Manchester",    dist: "~5 mi",  phone: "(860) 645-3100", drRating: "—",   drReviews: 388  },
  { id: "liberty",     brand: "Honda",  label: "Liberty Honda",          town: "Hartford",      dist: "~15 mi", phone: "(860) 246-8466", drRating: "4.7", drReviews: 4034 },
  { id: "lia_honda",   brand: "Honda",  label: "Lia Honda of Enfield",   town: "Enfield",       dist: "~20 mi", phone: "(860) 741-3305", drRating: "5.0", drReviews: 408  },
  { id: "schaller_honda", brand: "Honda", label: "Schaller Honda",       town: "New Britain",   dist: "~25 mi", phone: "(860) 826-2480", drRating: "4.7", drReviews: 1030 },
  // Subaru
  { id: "suburban",    brand: "Subaru", label: "Suburban Subaru",        town: "Vernon",        dist: "~1 mi",  phone: "(860) 649-6550", drRating: "—",   drReviews: 51   },
  { id: "bertera",     brand: "Subaru", label: "Bertera Subaru of Hartford", town: "Hartford",  dist: "~15 mi", phone: "(860) 246-6655", drRating: "—",   drReviews: 319  },
  { id: "schaller_sub",brand: "Subaru", label: "Schaller Subaru",        town: "Berlin",        dist: "~25 mi", phone: "(860) 828-4411", drRating: "—",   drReviews: 270  },
];

const SECTIONS = [
  {
    id: "interior_dog", label: "Interior & Dog Friendliness", icon: "🐾",
    items: [
      { id: "upholstery_type",  text: "Confirm upholstery type (SofTex / StarTex / leather — easy to wipe clean?)" },
      { id: "upholstery_feel",  text: "Rub upholstery firmly — durable, not slippery?" },
      { id: "rear_seat_flat",   text: "Fold rear seats flat — level load floor for dog comfort?" },
      { id: "rear_seat_slope",  text: "Check rear seat angle — hammock cover will sit level for 30 lb dog?" },
      { id: "rear_legroom",     text: "Cargo depth with seats up — room for a dog crate if needed?" },
      { id: "floor_mats",       text: "All-weather floor mats included or available front & rear?" },
      { id: "dog_access",       text: "Rear door opening height/width — easy for dog to jump in/out?" },
      { id: "rear_ac_vents",    text: "Rear HVAC vents present for dog comfort?" },
      { id: "cargo_liner",      text: "OEM cargo liner available?" },
      { id: "odor_resist",      text: "Cabin smells clean with no off-gassing?" },
    ],
  },
  {
    id: "noise_comfort", label: "Cabin Noise & Ride Comfort", icon: "🔇",
    items: [
      { id: "idle_noise",       text: "At idle — powertrain hum level acceptable?" },
      { id: "highway_noise",    text: "60–65 mph cruise — normal conversation without raising voice?" },
      { id: "road_texture",     text: "Rough road / expansion joints — suspension absorbs well?" },
      { id: "wind_noise",       text: "Highway speed — wind whistle around A-pillars or mirrors?" },
      { id: "brakegen_noise",   text: "Regen braking feel — smooth and quiet, not grabby?" },
      { id: "hvac_noise",       text: "HVAC on high — blower noise acceptable at cruise?" },
      { id: "seat_comfort_30m", text: "Driver seat 30+ min — no pressure points or fatigue?" },
      { id: "rear_ride",        text: "Rear seat ride quality — acceptable for passenger and dog?" },
    ],
  },
  {
    id: "safety_tech", label: "Safety & Driver Assist", icon: "🛡️",
    items: [
      { id: "adas_demo",        text: "Demo adaptive cruise + lane keeping on highway" },
      { id: "blind_spot",       text: "Blind-spot monitor standard on this trim?" },
      { id: "rear_cross",       text: "Rear cross-traffic alert — audible AND visual?" },
      { id: "auto_braking",     text: "Automatic emergency braking (AEB) standard?" },
      { id: "backup_cam",       text: "Backup camera — wide-angle, clear guidelines?" },
      { id: "headlights",       text: "LED headlights standard? Auto high-beam? (affects IIHS rating)" },
      { id: "surround_cam",     text: "360° surround camera available or standard?" },
      { id: "safe_exit",        text: "Safe exit assist / door open warning present?" },
    ],
  },
  {
    id: "awd_winter", label: "AWD & Winter Readiness", icon: "❄️",
    items: [
      { id: "awd_always_on",    text: "AWD always-on (Subaru) or on-demand/electronic (Toyota/Honda)?" },
      { id: "ground_clearance", text: "Ground clearance at least 8\" for CT winters?" },
      { id: "drive_modes",      text: "Snow or mud/sand drive mode — how activated?" },
      { id: "tire_size",        text: "Tire size — affordable to replace with winter set?" },
      { id: "heated_steering",  text: "Heated steering wheel standard on this trim?" },
      { id: "heated_seats",     text: "Heated front seats standard? Rear available?" },
      { id: "remote_start",     text: "Remote start standard or dealer add-on — cost?" },
      { id: "defrost_rear",     text: "Rear window defrost and mirror defrost standard?" },
    ],
  },
  {
    id: "mpg_hybrid", label: "Hybrid System & Efficiency", icon: "⚡",
    items: [
      { id: "ev_mode",          text: "EV-only mode at low speeds without pressing anything?" },
      { id: "regen_levels",     text: "Adjustable regenerative braking levels available?" },
      { id: "fuel_display",     text: "Real-time MPG display easy to read while driving?" },
      { id: "charge_display",   text: "Hybrid battery state-of-charge gauge visible at a glance?" },
      { id: "mpg_realistic",    text: "Checked real-world owner MPG for CT winter conditions?" },
      { id: "battery_warranty", text: "Hybrid battery warranty confirmed (Toyota 10yr/150K; Honda/Subaru 8yr/100K)?" },
      { id: "engine_noise_accel", text: "Full throttle — CVT/engine noise tolerable, no drone?" },
    ],
  },
  {
    id: "infotainment", label: "Infotainment & Connectivity", icon: "📱",
    items: [
      { id: "screen_size",      text: "Screen size on this trim — 10.5\" or 12.9\" (XSE)?" },
      { id: "carplay_wireless", text: "Wireless Apple CarPlay confirmed (not wired-only)?" },
      { id: "nav_built_in",     text: "Built-in navigation or CarPlay-only?" },
      { id: "voice_control",    text: "Voice command response — recognizes natural speech?" },
      { id: "usb_rear",         text: "Rear USB-C ports — 1 or 2?" },
      { id: "wireless_charge",  text: "Wireless phone charging pad standard?" },
      { id: "audio_system",     text: "Audio system clarity, bass, imaging at medium volume?" },
      { id: "cluster_display",  text: "Digital cluster easy to configure, readable in daylight?" },
    ],
  },
  {
    id: "cargo_practicality", label: "Cargo & Practicality", icon: "📦",
    items: [
      { id: "cargo_volume",     text: "Cargo volume with seats up — minimum 37 cu ft for SUVs?" },
      { id: "power_liftgate",   text: "Power liftgate standard? Hands-free version available?" },
      { id: "liftgate_height",  text: "Liftgate clears your garage height?" },
      { id: "underfloor_storage", text: "Underfloor storage for dog supplies / cables?" },
      { id: "tie_down_hooks",   text: "Cargo tie-down hooks present and robust?" },
      { id: "grocery_hooks",    text: "Grocery/bag hooks in cargo area?" },
      { id: "seat_fold_easy",   text: "60/40 rear seats fold one-handed, no headrest removal?" },
    ],
  },
  {
    id: "ownership_cost", label: "Ownership Cost & Finance", icon: "💰",
    items: [
      { id: "otd_price",        text: "Full OTD price in writing: MSRP + fees + CT sales tax (6.35%)?" },
      { id: "dealer_addons",    text: "Identified and negotiated out dealer-added packages?" },
      { id: "apr_rate",         text: "APR quote from captive lender vs. own bank/credit union?" },
      { id: "monthly_payment",  text: "Payment compared at 60 vs 72 months — total interest noted?" },
      { id: "maint_confirm",    text: "ToyotaCare / Maintain the Love terms confirmed in writing?" },
      { id: "ext_warranty",     text: "Extended warranty evaluated — not decided at signing?" },
      { id: "gap_insurance",    text: "GAP insurance compared dealer vs. insurer if financing >80%?" },
      { id: "rebates_stacking", text: "Stackable rebates checked: military, loyalty, college, regional?" },
      { id: "insurance_quote",  text: "Insurance quote obtained before finalizing?" },
    ],
  },
  {
    id: "dealer_service", label: "Dealership & Service Quality", icon: "🔧",
    items: [
      { id: "service_hours",    text: "Service hours — early morning and Saturday covered?" },
      { id: "loaner_policy",    text: "Loaner car policy for warranty work — any mileage limits?" },
      { id: "express_lane",     text: "Express lane for oil changes — estimated wait time?" },
      { id: "service_online",   text: "Online scheduling and status updates available?" },
      { id: "tech_certified",   text: "Master Technicians on staff for hybrid service?" },
      { id: "parts_stock",      text: "Parts department stocks common hybrid parts on-site?" },
      { id: "waiting_amenities",text: "Waiting room — Wi-Fi, comfortable seating, coffee?" },
      { id: "pickup_delivery",  text: "Pickup/delivery service available for Vernon CT?" },
      { id: "dealer_reviews",   text: "Google / DealerRater service reviews checked (past 6 mo)?" },
      { id: "sales_pressure",   text: "Sales experience — low-pressure or high-push tactics?" },
      { id: "price_transparency",text: "OTD price disclosed quickly and cleanly?" },
    ],
  },
];

// ─── Print styles injected into <head> ────────────────────────────────────────

const PRINT_STYLE = `
@media print {
  @page { size: letter portrait; margin: 0.5in; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .no-print { display: none !important; }
  .print-page { page-break-after: always; page-break-inside: avoid; }
  .print-page:last-child { page-break-after: avoid; }
  .print-header { background: #1c1b18 !important; color: #fff !important;
    padding: 8px 12px; margin-bottom: 8px; border-left: 4px solid #1a6b3c; }
  .print-section { margin-bottom: 6px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
  .print-section-header { background: #f4f4f2 !important; padding: 4px 8px;
    font-weight: 700; font-size: 9pt; display: flex; justify-content: space-between; }
  .print-item { display: flex; align-items: flex-start; gap: 6px;
    padding: 2px 8px; border-top: 1px solid #eee; font-size: 8pt; line-height: 1.3; }
  .print-check { width: 10px; height: 10px; border: 1.5px solid #555;
    border-radius: 2px; flex-shrink: 0; margin-top: 1px;
    background: #fff; display: inline-block; }
  .print-check.checked { background: #1a6b3c !important; border-color: #1a6b3c !important; }
  .print-stars { color: #e8a020 !important; font-size: 8pt; }
  .print-note { font-size: 7.5pt; color: #555; font-style: italic;
    padding: 2px 8px 4px 24px; border-top: 1px dashed #eee; }
  .print-rating-row { padding: 3px 8px; font-size: 7.5pt;
    color: #555; border-top: 1px dashed #eee; display: flex; gap: 8px; }
  .print-dealer-meta { font-size: 8pt; color: #555; padding: 2px 12px 6px; }
  .print-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
}
`;

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n === value ? 0 : n)}
          style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: 16, padding: "0 1px", lineHeight: 1,
            color: n <= value ? "#e8a020" : "#ccc" }}
          title={`${n} star${n > 1 ? "s" : ""}`}>★</button>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab,      setActiveTab]      = useState("vehicle");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDealer,  setSelectedDealer]  = useState(null);
  const [brandFilter,    setBrandFilter]    = useState("All");
  const [checks,         setChecks]         = useState({});
  const [notes,          setNotes]          = useState({});
  const [ratings,        setRatings]        = useState({});
  const [dealerChecks,   setDealerChecks]   = useState({});
  const [dealerNotes,    setDealerNotes]    = useState({});
  const [dealerRatings,  setDealerRatings]  = useState({});
  const [openSections,   setOpenSections]   = useState({});
  const [toast,          setToast]          = useState(null);
  const fileInputRef = useRef(null);
  const APP_VERSION  = "1.1";

  // ── Inject print CSS once ────────────────────────────────────────────────
  if (typeof document !== "undefined" && !document.getElementById("checklist-print-css")) {
    const st = document.createElement("style");
    st.id = "checklist-print-css";
    st.textContent = PRINT_STYLE;
    document.head.appendChild(st);
  }

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const VEHICLE_SECTIONS = SECTIONS.filter(s => s.id !== "dealer_service");
  const DEALER_SECTIONS  = SECTIONS.filter(s => s.id === "dealer_service");

  const toggleCheck = (key, setFn, map) => setFn({ ...map, [key]: !map[key] });
  const setNote     = (key, val, setFn, map) => setFn({ ...map, [key]: val });
  const setRating   = (key, val, setFn, map) => setFn({ ...map, [key]: val });

  const sectionProgress = (entity, section, checkMap) => {
    const prefix = entity + "|" + section.id + "|";
    const total = section.items.length;
    const done  = section.items.filter(it => checkMap[prefix + it.id]).length;
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  };

  const overallProgress = (entity, checkMap, sectionList) => {
    let total = 0, done = 0;
    sectionList.forEach(sec => sec.items.forEach(it => {
      total++;
      if (checkMap[entity + "|" + sec.id + "|" + it.id]) done++;
    }));
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  };

  const starStr = (n) => n > 0 ? "★".repeat(n) + "☆".repeat(5 - n) : "not rated";

  // ── Save / Load ──────────────────────────────────────────────────────────
  const buildSaveData = () => ({
    _version: APP_VERSION, _saved: new Date().toISOString(),
    checks, notes, ratings, dealerChecks, dealerNotes, dealerRatings, openSections,
    selectedVehicleId: selectedVehicle?.id ?? null,
    selectedDealerId:  selectedDealer?.id  ?? null,
  });

  const handleSave = () => {
    try {
      const json = JSON.stringify(buildSaveData(), null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const ts   = new Date().toISOString().slice(0,16).replace("T","_").replace(":","");
      const a    = document.createElement("a");
      a.href = url; a.download = `CarChecklist_${ts}.json`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      showToast("✅ Saved! Tap 'Save to Files' in the share sheet.");
    } catch (e) { showToast("❌ Save failed: " + e.message, "err"); }
  };

  const handleLoad = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data._version) throw new Error("Not a valid checklist file.");
        if (data.checks)        setChecks(data.checks);
        if (data.notes)         setNotes(data.notes);
        if (data.ratings)       setRatings(data.ratings);
        if (data.dealerChecks)  setDealerChecks(data.dealerChecks);
        if (data.dealerNotes)   setDealerNotes(data.dealerNotes);
        if (data.dealerRatings) setDealerRatings(data.dealerRatings);
        if (data.openSections)  setOpenSections(data.openSections);
        if (data.selectedVehicleId) {
          const v = VEHICLES.find(v => v.id === data.selectedVehicleId);
          if (v) setSelectedVehicle(v);
        }
        if (data.selectedDealerId) {
          const d = DEALERS.find(d => d.id === data.selectedDealerId);
          if (d) setSelectedDealer(d);
        }
        showToast(`✅ Loaded: ${data._saved ? new Date(data._saved).toLocaleString() : "unknown date"}`);
      } catch (err) { showToast("❌ Load failed: " + err.message, "err"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Print All: vehicles ──────────────────────────────────────────────────
  const printVehicles = () => {
    const win = window.open("", "_blank");
    const rows = (v, sec) => sec.items.map(it => {
      const key = v.id + "|" + sec.id + "|" + it.id;
      const ck  = checks[key] || false;
      return `<div class="print-item">
        <span class="print-check ${ck ? "checked" : ""}"></span>
        <span>${it.text}</span>
      </div>`;
    }).join("");

    const pages = VEHICLES.map(v => {
      const prog = overallProgress(v.id, checks, VEHICLE_SECTIONS);
      const sections = VEHICLE_SECTIONS.map(sec => {
        const p = sectionProgress(v.id, sec, checks);
        const r = ratings[v.id + "|" + sec.id] || 0;
        const n = notes[v.id + "|" + sec.id] || "";
        return `<div class="print-section">
          <div class="print-section-header">
            <span>${sec.icon} ${sec.label}</span>
            <span>${p.done}/${p.total}${r > 0 ? " · " + starStr(r) : ""}</span>
          </div>
          ${rows(v, sec)}
          ${n ? `<div class="print-note">Notes: ${n}</div>` : ""}
        </div>`;
      });
      // split into two columns of 4 sections each
      const col1 = sections.slice(0, 4).join("");
      const col2 = sections.slice(4).join("");
      return `<div class="print-page">
        <div class="print-header">
          <div style="font-size:12pt;font-weight:700;">${v.label}</div>
          <div style="font-size:8pt;color:#aaa;">MSRP ${v.msrp} · ${prog.done}/${prog.total} evaluated (${prog.pct}%) · Printed ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="print-two-col">
          <div>${col1}</div>
          <div>${col2}</div>
        </div>
      </div>`;
    }).join("");

    win.document.write(`<!DOCTYPE html><html><head><title>Vehicle Checklists</title>
      <style>${PRINT_STYLE.replace(/@media print \{/, "").replace(/\}$/, "")}</style>
      </head><body>${pages}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  // ── Print All: dealers ───────────────────────────────────────────────────
  const printDealers = () => {
    const win = window.open("", "_blank");
    const rows = (d, sec) => sec.items.map(it => {
      const key = d.id + "|" + sec.id + "|" + it.id;
      const ck  = dealerChecks[key] || false;
      return `<div class="print-item">
        <span class="print-check ${ck ? "checked" : ""}"></span>
        <span>${it.text}</span>
      </div>`;
    }).join("");

    const pages = DEALERS.map(d => {
      const prog = overallProgress(d.id, dealerChecks, DEALER_SECTIONS);
      const r    = dealerRatings[d.id + "|overall"] || 0;
      const n    = dealerNotes[d.id + "|overall"] || "";
      const secs = DEALER_SECTIONS.map(sec => {
        const p  = sectionProgress(d.id, sec, dealerChecks);
        const sr = dealerRatings[d.id + "|" + sec.id] || 0;
        const sn = dealerNotes[d.id + "|" + sec.id] || "";
        return `<div class="print-section">
          <div class="print-section-header">
            <span>${sec.icon} ${sec.label}</span>
            <span>${p.done}/${p.total}${sr > 0 ? " · " + starStr(sr) : ""}</span>
          </div>
          ${rows(d, sec)}
          ${sn ? `<div class="print-note">Notes: ${sn}</div>` : ""}
        </div>`;
      }).join("");
      return `<div class="print-page">
        <div class="print-header">
          <div style="font-size:12pt;font-weight:700;">${d.label} — ${d.town}, CT</div>
          <div style="font-size:8pt;color:#aaa;">${d.dist} from Vernon · ${d.phone} · DealerRater: ${d.drRating} (${d.drReviews} reviews) · Printed ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="print-dealer-meta">Brand: ${d.brand}</div>
        ${secs}
        ${n ? `<div class="print-section"><div class="print-section-header">📋 Overall Notes</div><div class="print-note">${n}</div></div>` : ""}
        ${r > 0 ? `<div class="print-rating-row">Overall rating: <span class="print-stars">${starStr(r)}</span></div>` : ""}
        <div style="font-size:7pt;color:#aaa;margin-top:6px;">${prog.done}/${prog.total} items evaluated (${prog.pct}%)</div>
      </div>`;
    }).join("");

    win.document.write(`<!DOCTYPE html><html><head><title>Dealer Checklists</title>
      <style>${PRINT_STYLE.replace(/@media print \{/, "").replace(/\}$/, "")}</style>
      </head><body>${pages}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const G  = "#1a6b3c";
  const AM = "#c47f00";
  const n50  = "#f8f8f6";
  const n100 = "#eeede9";
  const n300 = "#c8c5bc";
  const n700 = "#3a3830";
  const n900 = "#1c1b18";

  const s = {
    app:       { fontFamily: "'Inter',system-ui,sans-serif", background: n50, minHeight: "100vh", color: n900, maxWidth: 820, margin: "0 auto", paddingBottom: 60 },
    header:    { background: n900, color: "#fff", padding: "14px 16px 10px", borderBottom: `3px solid ${G}` },
    hTitle:    { fontSize: 15, fontWeight: 700, margin: 0 },
    hSub:      { fontSize: 11, color: "#aaa", marginTop: 2 },
    toolbar:   { display: "flex", gap: 8, padding: "8px 12px", background: "#fff", borderBottom: `1px solid ${n100}`, alignItems: "center", flexWrap: "wrap" },
    tBtn: (v) => ({ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:6,
      border: v === "primary" ? `2px solid ${G}` : v === "danger" ? `2px solid #c0392b` : `2px solid ${n300}`,
      background: v === "primary" ? G : v === "danger" ? "#c0392b" : "#fff",
      color: (v === "primary" || v === "danger") ? "#fff" : n700,
      cursor:"pointer", fontWeight:700, fontSize:11, fontFamily:"inherit", whiteSpace:"nowrap" }),
    tHint:     { fontSize: 10, color: n300, flex: 1, textAlign: "right" },
    tabs:      { display:"flex", background:"#fff", borderBottom:`1px solid ${n300}`, position:"sticky", top:0, zIndex:10 },
    tab: (a)  => ({ flex:1, padding:"10px 6px", background: a ? G : "transparent", color: a ? "#fff" : n700,
      border:"none", cursor:"pointer", fontWeight: a ? 700 : 500, fontSize:12 }),
    selectorRow: { display:"flex", flexWrap:"wrap", gap:6, padding:"10px 12px 4px" },
    chip: (a, col) => ({ padding:"5px 11px", borderRadius:20,
      border: `2px solid ${a ? (col||G) : n300}`, background: a ? (col||G) : "#fff",
      color: a ? "#fff" : n700, cursor:"pointer", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }),
    brandChip: (a) => ({ padding:"4px 10px", borderRadius:12,
      border:`1.5px solid ${a ? n700 : n300}`, background: a ? n700 : "#fff",
      color: a ? "#fff" : n700, cursor:"pointer", fontSize:11, fontWeight:600 }),
    sec:       { padding:"0 12px" },
    secCard:   { background:"#fff", border:`1px solid ${n100}`, borderRadius:7, marginBottom:8, overflow:"hidden" },
    secHdr: (o)=> ({ display:"flex", alignItems:"center", padding:"9px 12px", cursor:"pointer", background: o ? n50 : "#fff", userSelect:"none", gap:7 }),
    secIcon:   { fontSize:14 },
    secLabel:  { flex:1, fontWeight:700, fontSize:12 },
    pill: (p) => ({ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:10,
      background: p===100 ? "#d4edda" : p>0 ? "#fff3cd" : n100,
      color: p===100 ? G : p>0 ? AM : n700, minWidth:40, textAlign:"center" }),
    chev: (o) => ({ fontSize:10, color:n300, transform: o ? "rotate(90deg)" : "none", transition:"transform 0.15s" }),
    itemRow:   { display:"flex", alignItems:"flex-start", gap:9, padding:"8px 12px", borderTop:`1px solid ${n100}` },
    cbx:       { marginTop:2, accentColor:G, width:15, height:15, cursor:"pointer", flexShrink:0 },
    itemTxt: (c)=> ({ flex:1, fontSize:12, lineHeight:1.4, color: c ? n300 : n700, textDecoration: c ? "line-through" : "none" }),
    noteArea:  { padding:"0 12px 10px 36px", display:"flex", flexDirection:"column", gap:5 },
    textarea:  { width:"100%", borderRadius:5, border:`1px solid ${n300}`, padding:"5px 8px", fontSize:11, resize:"vertical", minHeight:46, fontFamily:"inherit", color:n900, boxSizing:"border-box" },
    ratingRow: { display:"flex", alignItems:"center", gap:7, padding:"5px 12px 8px", borderTop:`1px dashed ${n100}` },
    ratingLbl: { fontSize:11, color:n700, fontWeight:600 },
    emptyState:{ padding:36, textAlign:"center", color:n300, fontSize:13 },
    sumCard:   { background:"#fff", border:`1px solid ${n100}`, borderRadius:7, marginBottom:8, padding:"12px 14px" },
    sumVLabel: { fontWeight:700, fontSize:13, marginBottom:4 },
    barTrack:  { background:n100, borderRadius:4, height:6, overflow:"hidden", flex:1 },
    barFill: (p,c)=> ({ width:p+"%", background: p===100 ? G : (c||AM), height:"100%", borderRadius:4, transition:"width 0.3s" }),
    bigAvg:    { fontWeight:800, fontSize:20, color:G, lineHeight:1 },
    infoBox:   { background:"#eef6f0", border:`1px solid #b2d8bf`, borderRadius:6, padding:"9px 12px", margin:"8px 12px", fontSize:11, color:"#1a4a2e", lineHeight:1.5 },
    drBadge: (r)=> ({ display:"inline-flex", alignItems:"center", gap:3, fontSize:10, fontWeight:700,
      padding:"2px 7px", borderRadius:10,
      background: r==="5.0" ? "#d4edda" : r==="—" ? n100 : "#fff3cd",
      color: r==="5.0" ? G : r==="—" ? n700 : AM }),
    toast: (t)=> ({ position:"fixed", bottom:22, left:"50%", transform:"translateX(-50%)",
      background: t==="err" ? "#c0392b" : n900, color:"#fff", padding:"9px 18px",
      borderRadius:22, fontSize:12, fontWeight:600, zIndex:9999,
      boxShadow:"0 4px 16px rgba(0,0,0,0.25)", maxWidth:"90vw", textAlign:"center", pointerEvents:"none" }),
  };

  // ── Section renderer ──────────────────────────────────────────────────────
  function renderSections(entity, sectionList, checkMap, setCheckFn, notesMap, setNotesFn, ratingsMap, setRatingsFn) {
    return sectionList.map(sec => {
      const key   = entity + "|" + sec.id;
      const isOpen = !!openSections[key];
      const prog  = sectionProgress(entity, sec, checkMap);
      return (
        <div key={sec.id} style={s.secCard}>
          <div style={s.secHdr(isOpen)} onClick={() => setOpenSections({ ...openSections, [key]: !isOpen })}>
            <span style={s.secIcon}>{sec.icon}</span>
            <span style={s.secLabel}>{sec.label}</span>
            <span style={s.pill(prog.pct)}>{prog.done}/{prog.total}</span>
            <span style={s.chev(isOpen)}>▶</span>
          </div>
          {isOpen && (<>
            {sec.items.map(item => {
              const ck = checkMap[key + "|" + item.id] || false;
              return (
                <div key={item.id} style={s.itemRow}>
                  <input type="checkbox" style={s.cbx} checked={ck}
                    onChange={() => toggleCheck(key + "|" + item.id, setCheckFn, checkMap)} />
                  <span style={s.itemTxt(ck)}>{item.text}</span>
                </div>
              );
            })}
            <div style={s.ratingRow}>
              <span style={s.ratingLbl}>Section rating:</span>
              <StarRating value={ratingsMap[key] || 0}
                onChange={v => setRating(key, v, setRatingsFn, ratingsMap)} />
              {ratingsMap[key] > 0 && (
                <span style={{ fontSize:10, color:n300 }}>
                  {["","Poor","Fair","OK","Good","Excellent"][ratingsMap[key]]}
                </span>
              )}
            </div>
            <div style={s.noteArea}>
              <textarea style={s.textarea} placeholder={`Notes for ${sec.label.toLowerCase()}…`}
                value={notesMap[key] || ""}
                onChange={e => setNote(key, e.target.value, setNotesFn, notesMap)} />
            </div>
          </>)}
        </div>
      );
    });
  }

  // ── Vehicle Tab ───────────────────────────────────────────────────────────
  function VehicleTab() {
    const prog = selectedVehicle ? overallProgress(selectedVehicle.id, checks, VEHICLE_SECTIONS) : null;
    return (<>
      <div style={s.infoBox}>
        <strong>How to use:</strong> Select a vehicle, work through sections during the test drive. Check items, rate each section 1–5 ★, and add notes. Use <strong>Print All Vehicles</strong> in the toolbar for a one-page-per-vehicle printout.
      </div>
      <div style={s.selectorRow}>
        {VEHICLES.map(v => (
          <button key={v.id} style={s.chip(selectedVehicle?.id === v.id, v.color)}
            onClick={() => setSelectedVehicle(v)}>
            {v.label.replace("2026 ", "")}
          </button>
        ))}
      </div>
      {!selectedVehicle && <div style={s.emptyState}>← Select a vehicle above to begin</div>}
      {selectedVehicle && (
        <div style={s.sec}>
          <div style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 0 7px" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{selectedVehicle.label}</div>
              <div style={{ fontSize:10, color:n300 }}>MSRP {selectedVehicle.msrp} · {prog.done}/{prog.total} evaluated</div>
            </div>
            <div style={s.barTrack}><div style={s.barFill(prog.pct, AM)} /></div>
            <div style={{ fontSize:11, fontWeight:700, color: prog.pct===100 ? G : AM, minWidth:32 }}>{prog.pct}%</div>
          </div>
          {renderSections(selectedVehicle.id, VEHICLE_SECTIONS, checks, setChecks, notes, setNotes, ratings, setRatings)}
        </div>
      )}
    </>);
  }

  // ── Dealer Tab ────────────────────────────────────────────────────────────
  function DealerTab() {
    const brands = ["All", ...Array.from(new Set(DEALERS.map(d => d.brand)))];
    const filtered = brandFilter === "All" ? DEALERS : DEALERS.filter(d => d.brand === brandFilter);
    const prog = selectedDealer ? overallProgress(selectedDealer.id, dealerChecks, DEALER_SECTIONS) : null;
    return (<>
      <div style={s.infoBox}>
        <strong>How to use:</strong> Filter by brand, select a dealership, and evaluate during your visit. DealerRater ratings shown on each chip. Use <strong>Print All Dealers</strong> for a one-page-per-dealer printout.
      </div>
      {/* Brand filter */}
      <div style={{ ...s.selectorRow, paddingBottom:2 }}>
        {brands.map(b => (
          <button key={b} style={s.brandChip(brandFilter === b)} onClick={() => setBrandFilter(b)}>{b}</button>
        ))}
      </div>
      {/* Dealer chips with DealerRater badge */}
      <div style={{ ...s.selectorRow, paddingTop:4 }}>
        {filtered.map(d => (
          <button key={d.id} style={{ ...s.chip(selectedDealer?.id === d.id), display:"flex", flexDirection:"column", alignItems:"flex-start", padding:"5px 10px", gap:2 }}
            onClick={() => setSelectedDealer(d)}>
            <span style={{ fontSize:11, fontWeight:700 }}>{d.label}</span>
            <span style={{ fontSize:9, color: selectedDealer?.id === d.id ? "rgba(255,255,255,0.8)" : n300 }}>
              {d.town} · {d.dist} · DR: {d.drRating} ({d.drReviews})
            </span>
          </button>
        ))}
      </div>
      {!selectedDealer && <div style={s.emptyState}>← Select a dealership above to begin</div>}
      {selectedDealer && (
        <div style={s.sec}>
          <div style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 0 5px" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{selectedDealer.label}</div>
              <div style={{ fontSize:10, color:n300, display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", marginTop:2 }}>
                <span>{selectedDealer.dist} from Vernon · {selectedDealer.phone}</span>
                <span style={s.drBadge(selectedDealer.drRating)}>
                  DR {selectedDealer.drRating} · {selectedDealer.drReviews} reviews
                </span>
              </div>
            </div>
            <div style={s.barTrack}><div style={s.barFill(prog.pct, AM)} /></div>
            <div style={{ fontSize:11, fontWeight:700, color: prog.pct===100 ? G : AM, minWidth:32 }}>{prog.pct}%</div>
          </div>
          {renderSections(selectedDealer.id, DEALER_SECTIONS, dealerChecks, setDealerChecks, dealerNotes, setDealerNotes, dealerRatings, setDealerRatings)}
          <div style={{ ...s.secCard, marginTop:10 }}>
            <div style={{ padding:"10px 12px", borderBottom:`1px solid ${n100}` }}>
              <div style={{ fontWeight:700, fontSize:12, marginBottom:4 }}>📋 Overall Dealer Notes</div>
              <textarea style={{ ...s.textarea, minHeight:70 }}
                placeholder="Overall impression, salesperson to work with, pricing notes…"
                value={dealerNotes[selectedDealer.id + "|overall"] || ""}
                onChange={e => setNote(selectedDealer.id + "|overall", e.target.value, setDealerNotes, dealerNotes)} />
            </div>
            <div style={s.ratingRow}>
              <span style={s.ratingLbl}>Overall dealer rating:</span>
              <StarRating value={dealerRatings[selectedDealer.id + "|overall"] || 0}
                onChange={v => setRating(selectedDealer.id + "|overall", v, setDealerRatings, dealerRatings)} />
            </div>
          </div>
        </div>
      )}
    </>);
  }

  // ── Summary Tab ───────────────────────────────────────────────────────────
  function SummaryTab() {
    const vSummary = VEHICLES.map(v => {
      const secRatings = VEHICLE_SECTIONS.map(s => ({ label:s.label, icon:s.icon, rating: ratings[v.id+"|"+s.id]||0 }));
      const filled = secRatings.filter(r => r.rating > 0);
      const avg = filled.length ? (filled.reduce((a,b)=>a+b.rating,0)/filled.length).toFixed(1) : "—";
      return { ...v, secRatings, avg, prog: overallProgress(v.id, checks, VEHICLE_SECTIONS) };
    });
    const dSummary = DEALERS.map(d => ({
      ...d,
      prog:   overallProgress(d.id, dealerChecks, DEALER_SECTIONS),
      rating: dealerRatings[d.id+"|overall"] || 0,
    }));

    return (
      <div style={{ padding:"12px 12px 0" }}>
        <div style={{ fontWeight:700, fontSize:13, color:n700, marginBottom:8 }}>Vehicles</div>
        {vSummary.map(v => {
          const rated = v.secRatings.filter(r => r.rating > 0);
          return (
            <div key={v.id} style={s.sumCard}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={s.sumVLabel}>{v.label}</div>
                  <div style={{ fontSize:10, color:n300, marginBottom:6 }}>MSRP {v.msrp} · {v.prog.done}/{v.prog.total} evaluated ({v.prog.pct}%)</div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                    <div style={s.barTrack}><div style={s.barFill(v.prog.pct)} /></div>
                    <span style={{ fontSize:10, fontWeight:700, color: v.prog.pct===100 ? G : AM }}>{v.prog.pct}%</span>
                  </div>
                  {rated.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {rated.map(r => (
                        <span key={r.label} style={{ fontSize:10, background:n100, borderRadius:9, padding:"1px 7px" }}>
                          {r.icon} {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={s.bigAvg}>{v.avg}</div>
                  <div style={{ fontSize:9, color:n300, marginTop:1 }}>avg ★</div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ fontWeight:700, fontSize:13, color:n700, margin:"14px 0 8px" }}>Dealers</div>
        {dSummary.map(d => (
          <div key={d.id} style={s.sumCard}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:12 }}>{d.label} <span style={{ fontWeight:400, color:n300, fontSize:10 }}>— {d.town}</span></div>
                <div style={{ fontSize:10, color:n300, marginBottom:5, display:"flex", gap:6, alignItems:"center" }}>
                  <span>{d.dist} · {d.phone}</span>
                  <span style={s.drBadge(d.drRating)}>DR {d.drRating} ({d.drReviews})</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={s.barTrack}><div style={s.barFill(d.prog.pct)} /></div>
                  <span style={{ fontSize:10, fontWeight:700, color: d.prog.pct===100 ? G : AM }}>{d.prog.pct}%</span>
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={s.bigAvg}>{d.rating > 0 ? d.rating : "—"}</div>
                <div style={{ fontSize:9, color:n300, marginTop:1 }}>your ★</div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ ...s.infoBox, marginTop:14 }}>
          <strong>Decision notes:</strong>
          <textarea style={{ ...s.textarea, marginTop:6, minHeight:80 }}
            placeholder="Final thoughts, top contenders, deal-breakers, next steps…"
            value={notes["decision|final"] || ""}
            onChange={e => setNote("decision|final", e.target.value, setNotes, notes)} />
        </div>
      </div>
    );
  }

  // ── Root render ───────────────────────────────────────────────────────────
  return (
    <div style={s.app}>
      <div style={s.header}>
        <p style={s.hTitle}>🚗 Vehicle &amp; Dealer Evaluation Checklist</p>
        <p style={s.hSub}>July/August 2026 · Vernon, CT · Andrew Holl</p>
      </div>

      <div style={s.toolbar} className="no-print">
        <button style={s.tBtn("primary")} onClick={handleSave}>💾 Save JSON</button>
        <button style={s.tBtn("secondary")} onClick={() => fileInputRef.current?.click()}>📂 Load JSON</button>
        <input ref={fileInputRef} type="file" accept=".json,application/json"
          style={{ display:"none" }} onChange={handleLoad} />
        <button style={s.tBtn("secondary")} onClick={printVehicles}>🖨️ Print Vehicles</button>
        <button style={s.tBtn("secondary")} onClick={printDealers}>🖨️ Print Dealers</button>
        <span style={s.tHint}>Save → share → Save to Files</span>
      </div>

      <div style={s.tabs} className="no-print">
        {[["vehicle","🚗 Vehicles"],["dealer","🔧 Dealers"],["summary","📊 Summary"]].map(([id,lbl]) => (
          <button key={id} style={s.tab(activeTab===id)} onClick={() => setActiveTab(id)}>{lbl}</button>
        ))}
      </div>

      {activeTab === "vehicle" && <VehicleTab />}
      {activeTab === "dealer"  && <DealerTab />}
      {activeTab === "summary" && <SummaryTab />}

      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}
    </div>
  );
}
