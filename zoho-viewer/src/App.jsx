// import { useState, useEffect } from "react";

// const API_URL = "http://localhost:8000/api/records";

// export default function App() {
//   const [records, setRecords] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [sortCol, setSortCol] = useState(null);
//   const [sortDir, setSortDir] = useState("asc");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 10;

//   useEffect(() => {
//     fetch(API_URL)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         return res.json();
//       })
//       .then((data) => {
//         let rows = [];
//         let cols = [];

//         if (Array.isArray(data?.records)) {
//           rows = data.records;
//           cols = rows.length > 0 ? Object.keys(rows[0]) : [];
//         } else if (Array.isArray(data?.data?.rows)) {
//           rows = data.data.rows;
//           cols = rows.length > 0 ? Object.keys(rows[0]) : [];
//         } else if (data?.fields && Array.isArray(data?.rows)) {
//           cols = data.fields.map((f) => f.label || f.column_name || f.name);
//           rows = data.rows.map((r) =>
//             Object.fromEntries(cols.map((c, i) => [c, r[i]]))
//           );
//         } else if (Array.isArray(data)) {
//           rows = data;
//           cols = rows.length > 0 ? Object.keys(rows[0]) : [];
//         } else {
//           setError("Unexpected API response format.");
//           console.log("Raw API response:", JSON.stringify(data, null, 2));
//           setLoading(false);
//           return;
//         }

//         setColumns(cols);
//         setRecords(rows);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   const filtered = records.filter((row) =>
//     columns.some((col) =>
//       String(row[col] ?? "").toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   const sorted = sortCol
//     ? [...filtered].sort((a, b) => {
//         const av = a[sortCol] ?? "";
//         const bv = b[sortCol] ?? "";
//         const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
//         return sortDir === "asc" ? cmp : -cmp;
//       })
//     : filtered;

//   const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
//   const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleSort = (col) => {
//     if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else { setSortCol(col); setSortDir("asc"); }
//     setPage(1);
//   };

//   return (
//     <div style={{ fontFamily: "'DM Mono','Courier New',monospace", minHeight: "100vh", background: "#0a0a0f", color: "#e8e8e0" }}>
//       {/* Header */}
//       <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0d0d1a 100%)", borderBottom: "1px solid #2a2a4a", padding: "28px 36px 24px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#4f8ef7,#a855f7)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⊞</div>
//           <div>
//             <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.05em", color: "#f0f0f8" }}>ZOHO SHEET VIEWER</h1>
//             <p style={{ margin: 0, fontSize: "0.7rem", color: "#50509a", letterSpacing: "0.14em", textTransform: "uppercase" }}>Sheet1 · Live Records</p>
//           </div>
//         </div>
//       </div>

//       <div style={{ padding: "28px 36px" }}>
//         {/* Search & Stats */}
//         {!loading && !error && records.length > 0 && (
//           <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
//             <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
//               <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", opacity: 0.5 }}>🔍</span>
//               <input
//                 type="text"
//                 placeholder="Search records..."
//                 value={search}
//                 onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//                 style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#12121e", border: "1px solid #2a2a4a", borderRadius: 8, color: "#e8e8e0", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
//                 onFocus={(e) => (e.target.style.borderColor = "#4f8ef7")}
//                 onBlur={(e) => (e.target.style.borderColor = "#2a2a4a")}
//               />
//             </div>
//             <div style={{ display: "flex", gap: 10 }}>
//               {[{ label: "Total", value: records.length }, { label: "Filtered", value: filtered.length }, { label: "Columns", value: columns.length }].map((s) => (
//                 <div key={s.label} style={{ background: "#12121e", border: "1px solid #2a2a4a", borderRadius: 8, padding: "8px 18px", textAlign: "center" }}>
//                   <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4f8ef7" }}>{s.value}</div>
//                   <div style={{ fontSize: "0.62rem", color: "#50508a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div style={{ textAlign: "center", padding: "80px 0" }}>
//             <div style={{ display: "inline-block", width: 40, height: 40, border: "3px solid #2a2a4a", borderTopColor: "#4f8ef7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//             <p style={{ color: "#50508a", marginTop: 16, fontSize: "0.8rem", letterSpacing: "0.14em" }}>FETCHING RECORDS...</p>
//             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div style={{ background: "#1a0d0d", border: "1px solid #5a1a1a", borderRadius: 12, padding: "28px 32px", maxWidth: 600 }}>
//             <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>⚠️</div>
//             <h3 style={{ margin: "0 0 8px", color: "#f87171", fontSize: "0.95rem" }}>Failed to Load Records</h3>
//             <p style={{ margin: "0 0 16px", color: "#a06060", fontSize: "0.83rem", lineHeight: 1.65 }}>{error}</p>
//             <div style={{ background: "#120808", borderRadius: 8, padding: "14px 16px", fontSize: "0.76rem", color: "#704040", lineHeight: 1.7 }}>
//               Make sure the FastAPI backend is running on <strong style={{ color: "#904040" }}>http://localhost:8000</strong> and your <code>.env</code> credentials are correct.
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && !error && records.length > 0 && (
//           <>
//             <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #1a1a30" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
//                 <thead>
//                   <tr style={{ background: "#0e0e20" }}>
//                     <th style={{ padding: "13px 14px", textAlign: "left", color: "#30305a", fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 600, borderBottom: "1px solid #1a1a30", width: 44 }}>#</th>
//                     {columns.map((col) => (
//                       <th key={col} onClick={() => handleSort(col)}
//                         style={{ padding: "13px 14px", textAlign: "left", color: sortCol === col ? "#4f8ef7" : "#70709a", fontSize: "0.7rem", letterSpacing: "0.1em", fontWeight: 600, borderBottom: "1px solid #1a1a30", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", textTransform: "uppercase" }}>
//                         <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
//                           {col}
//                           <span style={{ opacity: sortCol === col ? 1 : 0.3, fontSize: "0.75em" }}>{sortCol === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}</span>
//                         </span>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginated.map((row, i) => (
//                     <tr key={i}
//                       style={{ background: i % 2 === 0 ? "#0a0a15" : "#0c0c1c", transition: "background 0.12s" }}
//                       onMouseEnter={(e) => (e.currentTarget.style.background = "#13132a")}
//                       onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#0a0a15" : "#0c0c1c")}>
//                       <td style={{ padding: "11px 14px", color: "#28285a", fontSize: "0.7rem", borderBottom: "1px solid #10101e" }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
//                       {columns.map((col) => (
//                         <td key={col} title={String(row[col] ?? "")}
//                           style={{ padding: "11px 14px", color: "#c0c0d8", borderBottom: "1px solid #10101e", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                           {row[col] === null || row[col] === undefined || row[col] === ""
//                             ? <span style={{ color: "#282850", fontStyle: "italic" }}>—</span>
//                             : String(row[col])}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
//                 <span style={{ color: "#38386a", fontSize: "0.74rem" }}>
//                   Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
//                 </span>
//                 <div style={{ display: "flex", gap: 5 }}>
//                   {[
//                     { label: "←", action: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
//                     ...Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
//                       const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
//                       return { label: String(p), action: () => setPage(p), active: p === page };
//                     }),
//                     { label: "→", action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
//                   ].map((btn, i) => (
//                     <button key={i} onClick={btn.action} disabled={btn.disabled}
//                       style={{ padding: "6px 13px", borderRadius: 6, border: "1px solid", borderColor: btn.active ? "#4f8ef7" : "#1e1e38", background: btn.active ? "#0e1e3a" : "transparent", color: btn.disabled ? "#20204a" : btn.active ? "#4f8ef7" : "#70709a", cursor: btn.disabled ? "not-allowed" : "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}>
//                       {btn.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* Empty */}
//         {!loading && !error && records.length === 0 && (
//           <div style={{ textAlign: "center", padding: "70px 0", color: "#30305a" }}>
//             <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>◻</div>
//             <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em" }}>NO RECORDS FOUND</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";
// Chart.register(...registerables);

// const API_URL = "http://localhost:8000/api/records";

// /* ── helpers ── */
// const avg = (a) => (a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0);
// const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
// const TM = {
//   "very satisfied": 9, satisfied: 7, neutral: 5, unsatisfied: 3,
//   "very fair": 9, fair: 7, fairly: 7, unfair: 3,
//   fast: 9, moderate: 6, slow: 3,
// };
// const toN = (v) => TM[(v || "").toLowerCase().trim()] ?? 5;
// const fmtD = (ts) => {
//   const d = new Date(ts);
//   return isNaN(d) ? ts : d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
// };

// /* ── chart hook ── */
// function useChart(ref, config) {
//   const inst = useRef(null);
//   useEffect(() => {
//     if (!ref.current) return;
//     if (inst.current) inst.current.destroy();
//     inst.current = new Chart(ref.current, config);
//     return () => inst.current?.destroy();
//     // eslint-disable-next-line
//   }, [JSON.stringify(config?.data)]);
// }

// /* ── sub-components ── */
// function KpiCard({ icon, label, num, sub, accent, fill }) {
//   return (
//     <div style={S.kpi}>
//       <div style={{ fontSize: 18, marginBottom: 10 }}>{icon}</div>
//       <div style={{ fontSize: "11.5px", fontWeight: 500, color: "#6B7280", marginBottom: 2 }}>{label}</div>
//       <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#C8102E" : "#111827", lineHeight: 1, marginBottom: 4 }}>{num}</div>
//       <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
//       <div style={{ height: 2, background: "#E4E6EA", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
//         <div style={{ height: "100%", width: `${fill}%`, background: "#C8102E", borderRadius: 2 }} />
//       </div>
//     </div>
//   );
// }

// function ScoreBox({ n }) {
//   const cls = n >= 9 ? { bg: "#F0FDF4", color: "#15803D" } : n >= 7 ? { bg: "#FFFBEB", color: "#B45309" } : { bg: "#FDF2F3", color: "#C8102E" };
//   return (
//     <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 5, textAlign: "center", lineHeight: "26px", fontSize: 12, fontWeight: 700, background: cls.bg, color: cls.color }}>{n}</span>
//   );
// }

// function TxtTag({ v }) {
//   const s = (v || "").toLowerCase();
//   let style = { fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500 };
//   if (s.includes("very sat") || s.includes("very fair") || s.includes("fast")) style = { ...style, background: "#F0FDF4", color: "#15803D" };
//   else if (s.includes("sat") || s.includes("fair") || s.includes("mod")) style = { ...style, background: "#F0F9FF", color: "#0369A1" };
//   else if (s.includes("neut")) style = { ...style, background: "#F0F1F3", color: "#6B7280" };
//   else style = { ...style, background: "#FDF2F3", color: "#C8102E" };
//   return <span style={style}>{v}</span>;
// }

// /* ── NPS donut ── */
// function NpsDonut({ prom, pass, det }) {
//   const ref = useRef(null);
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       labels: ["Detractors", "Passives", "Promoters"],
//       datasets: [{ data: [det, pass, prom], backgroundColor: ["#C8102E", "#B45309", "#15803D"], borderWidth: 3, borderColor: "#fff", hoverOffset: 4 }],
//     },
//     options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── histogram ── */
// function Histogram({ data }) {
//   const ref = useRef(null);
//   const dist = Array.from({ length: 11 }, (_, i) => data.filter((d) => d === i).length);
//   const colors = dist.map((_, i) => i <= 6 ? "rgba(200,16,46,0.55)" : i <= 8 ? "rgba(180,83,9,0.45)" : "rgba(21,128,61,0.55)");
//   useChart(ref, {
//     type: "bar",
//     data: { labels: ["0","1","2","3","4","5","6","7","8","9","10"], datasets: [{ data: dist, backgroundColor: colors, borderRadius: 5, borderSkipped: false }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── per-question bar chart ── */
// function QChart({ vals }) {
//   const ref = useRef(null);
//   const nums = vals.map(toN);
//   const dist = Array.from({ length: 10 }, (_, i) => nums.filter((n) => n === i + 1).length);
//   useChart(ref, {
//     type: "bar",
//     data: { labels: ["1","2","3","4","5","6","7","8","9","10"], datasets: [{ data: dist, backgroundColor: "rgba(107,114,128,0.35)", borderRadius: 5, borderSkipped: false }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 10 } } }, y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 10 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── trend line ── */
// function TrendChart({ records }) {
//   const ref = useRef(null);
//   const byD = {};
//   records.forEach((d) => { const k = (d.Timestamp || d.ts || "").slice(0, 10); if (k) byD[k] = (byD[k] || 0) + 1; });
//   const days = Object.keys(byD).sort().slice(-8);
//   const vals = days.map((d) => byD[d] || 0);
//   useChart(ref, {
//     type: "line",
//     data: { labels: days.map((d) => d.slice(5)), datasets: [{ data: vals, borderColor: "#C8102E", backgroundColor: "rgba(200,16,46,0.06)", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#C8102E", borderWidth: 2, fill: true }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { min: 0, grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── styles ── */
// const S = {
//   kpi: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "16px 18px" },
//   card: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "18px 20px" },
//   cardHd: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
//   badge: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#F0F1F3", color: "#6B7280" },
//   badgeRed: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#FDF2F3", color: "#C8102E" },
//   secHd: { fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".7px", color: "#9CA3AF", marginBottom: 12 },
// };

// /* ══════════════════════════════════════════════
//    MAIN APP
// ══════════════════════════════════════════════ */
// export default function App() {
//   const [records, setRecords] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     fetch(API_URL)
//       .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
//       .then((data) => {
//         let rows = [];
//         if (Array.isArray(data?.records)) rows = data.records;
//         else if (Array.isArray(data?.data?.rows)) rows = data.data.rows;
//         else if (data?.fields && Array.isArray(data?.rows)) {
//           const cols = data.fields.map((f) => f.label || f.column_name || f.name);
//           rows = data.rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
//         } else if (Array.isArray(data)) rows = data;
//         else { setError("Unexpected API format"); setLoading(false); return; }

//         setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
//         setRecords(rows);
//         setNow(new Date());
//         setLoading(false);
//       })
//       .catch((e) => { setError(e.message); setLoading(false); });
//   }, []);

//   /* ── derive fields from whatever columns Zoho returns ── */
//   // Match column by checking if any keyword appears inside the column name
//   const findCol = (row, ...keywords) => {
//     const colKeys = Object.keys(row);
//     for (const kw of keywords) {
//       const found = colKeys.find((c) => c.toLowerCase().includes(kw.toLowerCase()));
//       if (found && row[found] !== undefined && row[found] !== "") return row[found];
//     }
//     return "";
//   };

//   const rows = records.map((r) => ({
//     raw: r,
//     name:  findCol(r, "name", "customer"),
//     phone: findCol(r, "phone", "mobile", "number"),
//     ins:   findCol(r, "purchased", "insurance type", "insurance", "policy type"),
//     q1:    Number(findCol(r, "likely", "recommend", "0-10", "nps", "scale")) || 0,
//     q2:    findCol(r, "improve", "aspect", "feedback", "suggestion"),
//     q3:    findCol(r, "clarity", "policy document", "satisfied"),
//     q4:    findCol(r, "speed", "inquir", "resolv"),
//     q5:    findCol(r, "fairly", "fair", "treated", "treatment"),
//     ts:    findCol(r, "timestamp", "date", "time"),
//   }));

//   /* ── filter ── */
//   const filtered = rows.filter((r) => {
//     if (filter === "all") return true;
//     if (filter === "prom") return r.q1 >= 9;
//     if (filter === "det") return r.q1 <= 6;
//     return r.ins === filter;
//   });

//   /* ── KPI data ── */
//   const q1vals = rows.map((r) => r.q1).filter(Boolean);
//   const q3vals = rows.map((r) => toN(r.q3));
//   const q4vals = rows.map((r) => toN(r.q4));
//   const q5vals = rows.map((r) => toN(r.q5));
//   const ov = +((avg(q1vals) + avg(q3vals) + avg(q4vals) + avg(q5vals)) / 4).toFixed(1);

//   /* ── NPS ── */
//   const t = rows.length || 1;
//   const prom = rows.filter((r) => r.q1 >= 9).length;
//   const pass = rows.filter((r) => r.q1 >= 7 && r.q1 <= 8).length;
//   const det = rows.filter((r) => r.q1 <= 6).length;
//   const npsScore = Math.round(((prom - det) / t) * 100);

//   /* ── improvement areas ── */
//   const cnt = {};
//   rows.forEach((r) => { const k = (r.q2 || "").trim(); if (k) cnt[k] = (cnt[k] || 0) + 1; });
//   const impAreas = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
//   const impTotal = impAreas.reduce((s, [, c]) => s + c, 0) || 1;

//   /* ── unique insurance types for filter ── */
//   const insTypes = [...new Set(rows.map((r) => r.ins).filter(Boolean))];

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 40, height: 40, border: "3px solid #E4E6EA", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
//         <p style={{ color: "#9CA3AF", marginTop: 16, fontSize: 13 }}>Loading dashboard…</p>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ background: "#fff", border: "1px solid #E4E6EA", borderRadius: 12, padding: "32px 36px", maxWidth: 480 }}>
//         <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
//         <h3 style={{ color: "#C8102E", marginBottom: 8 }}>Failed to load</h3>
//         <p style={{ color: "#6B7280", fontSize: 13 }}>{error}</p>
//         <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 12 }}>Make sure FastAPI is running on <code>localhost:8000</code></p>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "Inter,sans-serif", background: "#F5F6F8", color: "#111827", fontSize: 14, minHeight: "100vh" }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: "#fff", borderBottom: "1px solid #E4E6EA", height: 58, display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 50 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 12 }}>
//           <div style={{ width: 32, height: 32, background: "#C8102E", borderRadius: 7, display: "grid", placeItems: "center" }}>
//             <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
//           </div>
//           <span style={{ fontSize: "13.5px", fontWeight: 700 }}>Chola MS General Insurance</span>
//         </div>
//         <div style={{ width: 1, height: 20, background: "#E4E6EA" }} />
//         <div style={{ display: "flex", gap: 2 }}>
//           {["Survey Dashboard", "Call History", "Reports"].map((t, i) => (
//             <button key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? "#fff" : "#6B7280", background: i === 0 ? "#C8102E" : "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t}</button>
//           ))}
//         </div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontSize: 12, color: "#9CA3AF" }}>{now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
//           <button onClick={() => window.location.reload()} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1px solid #E4E6EA", background: "#fff", color: "#374151", fontFamily: "Inter,sans-serif" }}>↺ Refresh</button>
//         </div>
//       </nav>

//       <div style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 48px" }}>

//         {/* ── PAGE HEAD ── */}
//         <div style={{ marginBottom: 20 }}>
//           <h1 style={{ fontSize: 17, fontWeight: 700 }}>Customer Experience Dashboard</h1>
//           <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginTop: 3 }}>
//             Voice Survey Analytics &nbsp;·&nbsp; {rows.length} responses collected &nbsp;·&nbsp; Last updated {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
//           </p>
//         </div>

//         {/* ── 1. KPIs ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Overall Summary</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
//             <KpiCard icon="📊" label="Total Responses"    num={rows.length}   sub="Surveys completed"   accent fill={100} />
//             <KpiCard icon="⭐" label="Avg Recommendation" num={avg(q1vals)}   sub="Score out of 10"     accent fill={avg(q1vals)*10} />
//             <KpiCard icon="😊" label="Overall Satisfaction" num={ov}          sub="All questions avg"         fill={ov*10} />
//             <KpiCard icon="📞" label="Resolution Rating"  num={avg(q4vals)}   sub="Speed score /10"           fill={avg(q4vals)*10} />
//             <KpiCard icon="📄" label="Policy Clarity"     num={avg(q3vals)}   sub="Clarity score /10"         fill={avg(q3vals)*10} />
//             <KpiCard icon="🤝" label="Fair Treatment"     num={avg(q5vals)}   sub="Fairness score /10"        fill={avg(q5vals)*10} />
//           </div>
//         </div>

//         {/* ── 2. NPS + HISTOGRAM ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Recommendation Score Analysis</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>NPS Breakdown</h3>
//                 <span style={S.badgeRed}>NPS: {npsScore >= 0 ? "+" : ""}{npsScore}</span>
//               </div>
//               <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
//                 <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
//                   <NpsDonut prom={prom} pass={pass} det={det} />
//                   <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                     <div style={{ fontSize: 30, fontWeight: 700 }}>{npsScore >= 0 ? "+" : ""}{npsScore}</div>
//                     <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>NPS Score</div>
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   {[{ color: "#15803D", label: "Promoters", range: "(9–10)", n: prom }, { color: "#B45309", label: "Passives", range: "(7–8)", n: pass }, { color: "#C8102E", label: "Detractors", range: "(0–6)", n: det }].map((row) => (
//                     <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                       <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
//                       <span style={{ flex: 1, fontSize: "12.5px", color: "#374151" }}>{row.label} <span style={{ color: "#9CA3AF", fontSize: 11 }}>{row.range}</span></span>
//                       <span style={{ fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: "right" }}>{row.n}</span>
//                       <span style={{ fontSize: "11.5px", color: "#9CA3AF", minWidth: 34, textAlign: "right" }}>{pct(row.n, t)}%</span>
//                     </div>
//                   ))}
//                   <div style={{ display: "flex", height: 5, borderRadius: 5, overflow: "hidden", gap: 2, marginTop: 12 }}>
//                     <div style={{ width: `${pct(det, t)}%`, background: "#C8102E", opacity: 0.7 }} />
//                     <div style={{ width: `${pct(pass, t)}%`, background: "#B45309", opacity: 0.5 }} />
//                     <div style={{ width: `${pct(prom, t)}%`, background: "#15803D", opacity: 0.7 }} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Score Distribution</h3>
//                 <span style={S.badge}>Recommendation 0–10</span>
//               </div>
//               <div style={{ position: "relative", height: 210 }}>
//                 <Histogram data={q1vals} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 3. PER QUESTION ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Satisfaction by Question</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
//             {[
//               { title: "Policy Document Clarity", vals: rows.map((r) => r.q3) },
//               { title: "Inquiry Resolution Speed", vals: rows.map((r) => r.q4) },
//               { title: "Fairness of Interaction",  vals: rows.map((r) => r.q5) },
//             ].map(({ title, vals }) => (
//               <div key={title} style={S.card}>
//                 <div style={S.cardHd}>
//                   <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>{title}</h3>
//                   <span style={S.badge}>Avg {avg(vals.map(toN))} / 10</span>
//                 </div>
//                 <div style={{ position: "relative", height: 160 }}>
//                   <QChart vals={vals} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── 4+5. IMPROVEMENT + TREND ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Improvement Areas & Response Trend</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Improvement Area Analysis</h3>
//                 <span style={S.badge}>Free Text</span>
//               </div>
//               {impAreas.length === 0 ? <p style={{ color: "#9CA3AF", fontSize: 13 }}>No data</p> : impAreas.map(([label, count]) => (
//                 <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                   <span style={{ fontSize: "12.5px", color: "#374151", width: 160, flexShrink: 0 }}>{label}</span>
//                   <div style={{ flex: 1, height: 6, background: "#F0F1F3", borderRadius: 6, overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${pct(count, impTotal)}%`, background: "#C8102E", opacity: 0.75, borderRadius: 6 }} />
//                   </div>
//                   <span style={{ fontSize: "12.5px", fontWeight: 600, width: 36, textAlign: "right" }}>{pct(count, impTotal)}%</span>
//                 </div>
//               ))}
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Responses Over Time</h3>
//                 <span style={S.badge}>Daily Volume</span>
//               </div>
//               <div style={{ position: "relative", height: 200 }}>
//                 <TrendChart records={records} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 6. RAW TABLE ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>All Feedback Records</div>
//           <div style={S.card}>
//             <div style={S.cardHd}>
//               <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Voice Survey Responses</h3>
//               <span style={S.badge}>{filtered.length} records</span>
//             </div>

//             {/* Filters */}
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
//               <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Filter:</span>
//               {[{ key: "all", label: "All" }, { key: "prom", label: "Promoters" }, { key: "det", label: "Detractors" }, ...insTypes.map((t) => ({ key: t, label: t.replace(" Insurance", "") }))].map(({ key, label }) => (
//                 <button key={key} onClick={() => setFilter(key)} style={{ padding: "4px 11px", borderRadius: 5, fontSize: 12, fontWeight: filter === key ? 600 : 500, cursor: "pointer", border: "1px solid", borderColor: filter === key ? "#C8102E" : "#E4E6EA", background: filter === key ? "#C8102E" : "#fff", color: filter === key ? "#fff" : "#6B7280", fontFamily: "Inter,sans-serif" }}>{label}</button>
//               ))}
//             </div>

//             {/* Table */}
//             <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
//                 <thead>
//                   <tr>
//                     {["#", ...columns].map((col) => (
//                       <th key={col} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, whiteSpace: "nowrap" }}>{col}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((row, i) => (
//                     <tr key={i} onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={(e) => e.currentTarget.style.background = ""}>
//                       <td style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#9CA3AF", fontSize: 11 }}>{i + 1}</td>
//                       {columns.map((col) => {
//                         const val = row.raw[col];
//                         const isNps = col.toLowerCase().includes("nps") || col.toLowerCase().includes("recommendation") || col.toLowerCase().includes("score");
//                         const isText = col.toLowerCase().includes("clarity") || col.toLowerCase().includes("speed") || col.toLowerCase().includes("fair") || col.toLowerCase().includes("treatment");
//                         return (
//                           <td key={col} style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#374151", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "middle" }}>
//                             {isNps && !isNaN(Number(val)) ? <ScoreBox n={Number(val)} /> : isText ? <TxtTag v={String(val ?? "")} /> : val === null || val === undefined || val === "" ? <span style={{ color: "#D1D5DB" }}>—</span> : String(val)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";
// Chart.register(...registerables);

// const API_URL = "http://localhost:8000/api/records";

// /* ── helpers ── */
// const avg = (a) => (a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0);
// const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
// const TM = {
//   "very satisfied": 9, satisfied: 7, neutral: 5, unsatisfied: 3,
//   "very fair": 9, fair: 7, fairly: 7, unfair: 3,
//   fast: 9, moderate: 6, slow: 3,
// };
// const toN = (v) => TM[(v || "").toLowerCase().trim()] ?? 5;
// const fmtD = (ts) => {
//   const d = new Date(ts);
//   return isNaN(d) ? ts : d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
// };

// /* ── chart hook ── */
// function useChart(ref, config) {
//   const inst = useRef(null);
//   useEffect(() => {
//     if (!ref.current) return;
//     if (inst.current) inst.current.destroy();
//     inst.current = new Chart(ref.current, config);
//     return () => inst.current?.destroy();
//     // eslint-disable-next-line
//   }, [JSON.stringify(config?.data)]);
// }

// /* ── sub-components ── */
// function KpiCard({ icon, label, num, sub, accent, fill }) {
//   return (
//     <div style={S.kpi}>
//       <div style={{ fontSize: 18, marginBottom: 10 }}>{icon}</div>
//       <div style={{ fontSize: "11.5px", fontWeight: 500, color: "#6B7280", marginBottom: 2 }}>{label}</div>
//       <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#C8102E" : "#111827", lineHeight: 1, marginBottom: 4 }}>{num}</div>
//       <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
//       <div style={{ height: 2, background: "#E4E6EA", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
//         <div style={{ height: "100%", width: `${fill}%`, background: "#C8102E", borderRadius: 2 }} />
//       </div>
//     </div>
//   );
// }

// function ScoreBox({ n }) {
//   const cls = n >= 9 ? { bg: "#F0FDF4", color: "#15803D" } : n >= 7 ? { bg: "#FFFBEB", color: "#B45309" } : { bg: "#FDF2F3", color: "#C8102E" };
//   return (
//     <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 5, textAlign: "center", lineHeight: "26px", fontSize: 12, fontWeight: 700, background: cls.bg, color: cls.color }}>{n}</span>
//   );
// }

// function TxtTag({ v }) {
//   const s = (v || "").toLowerCase();
//   let style = { fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500 };
//   if (s.includes("very sat") || s.includes("very fair") || s.includes("fast")) style = { ...style, background: "#F0FDF4", color: "#15803D" };
//   else if (s.includes("sat") || s.includes("fair") || s.includes("mod")) style = { ...style, background: "#F0F9FF", color: "#0369A1" };
//   else if (s.includes("neut")) style = { ...style, background: "#F0F1F3", color: "#6B7280" };
//   else style = { ...style, background: "#FDF2F3", color: "#C8102E" };
//   return <span style={style}>{v}</span>;
// }

// /* ── NPS donut ── */
// function NpsDonut({ prom, pass, det }) {
//   const ref = useRef(null);
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       labels: ["Detractors", "Passives", "Promoters"],
//       datasets: [{ data: [det, pass, prom], backgroundColor: ["#C8102E", "#B45309", "#15803D"], borderWidth: 3, borderColor: "#fff", hoverOffset: 4 }],
//     },
//     options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── histogram ── */
// function Histogram({ data }) {
//   const ref = useRef(null);
//   const dist = Array.from({ length: 11 }, (_, i) => data.filter((d) => d === i).length);
//   const colors = dist.map((_, i) => i <= 6 ? "rgba(200,16,46,0.55)" : i <= 8 ? "rgba(180,83,9,0.45)" : "rgba(21,128,61,0.55)");
//   useChart(ref, {
//     type: "bar",
//     data: { labels: ["0","1","2","3","4","5","6","7","8","9","10"], datasets: [{ data: dist, backgroundColor: colors, borderRadius: 5, borderSkipped: false }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── donut gauge for satisfaction scores ── */
// function DonutGauge({ vals, color }) {
//   const ref = useRef(null);
//   const nums = vals.map(toN);
//   const score = avg(nums);
//   const remaining = 10 - score;
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       datasets: [{
//         data: [score, remaining],
//         backgroundColor: [color, "#F0F1F3"],
//         borderWidth: 0,
//         hoverOffset: 0,
//       }],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       cutout: "78%",
//       plugins: { legend: { display: false }, tooltip: { enabled: false } },
//       animation: { animateRotate: true, duration: 800 },
//     },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── trend line ── */
// function TrendChart({ records }) {
//   const ref = useRef(null);
//   const byD = {};
//   records.forEach((d) => { const k = (d.Timestamp || d.ts || "").slice(0, 10); if (k) byD[k] = (byD[k] || 0) + 1; });
//   const days = Object.keys(byD).sort().slice(-8);
//   const vals = days.map((d) => byD[d] || 0);
//   useChart(ref, {
//     type: "line",
//     data: { labels: days.map((d) => d.slice(5)), datasets: [{ data: vals, borderColor: "#C8102E", backgroundColor: "rgba(200,16,46,0.06)", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#C8102E", borderWidth: 2, fill: true }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { min: 0, grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── styles ── */
// const S = {
//   kpi: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "16px 18px" },
//   card: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "18px 20px" },
//   cardHd: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
//   badge: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#F0F1F3", color: "#6B7280" },
//   badgeRed: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#FDF2F3", color: "#C8102E" },
//   secHd: { fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".7px", color: "#9CA3AF", marginBottom: 12 },
// };

// /* ══════════════════════════════════════════════
//    MAIN APP
// ══════════════════════════════════════════════ */
// export default function App() {
//   const [records, setRecords] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     fetch(API_URL)
//       .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
//       .then((data) => {
//         let rows = [];
//         if (Array.isArray(data?.records)) rows = data.records;
//         else if (Array.isArray(data?.data?.rows)) rows = data.data.rows;
//         else if (data?.fields && Array.isArray(data?.rows)) {
//           const cols = data.fields.map((f) => f.label || f.column_name || f.name);
//           rows = data.rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
//         } else if (Array.isArray(data)) rows = data;
//         else { setError("Unexpected API format"); setLoading(false); return; }

//         setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
//         setRecords(rows);
//         setNow(new Date());
//         setLoading(false);
//       })
//       .catch((e) => { setError(e.message); setLoading(false); });
//   }, []);

//   /* ── derive fields from whatever columns Zoho returns ── */
//   // Match column by checking if keyword appears inside column name
//   const findCol = (row, ...keywords) => {
//     const colKeys = Object.keys(row);
//     for (const kw of keywords) {
//       const found = colKeys.find((c) => c.toLowerCase().includes(kw.toLowerCase()));
//       if (found && row[found] !== undefined && row[found] !== "") return row[found];
//     }
//     return "";
//   };

//   const rows = records.map((r) => ({
//     raw: r,
//     name:  findCol(r, "name"),
//     phone: findCol(r, "phone", "mobile"),
//     ins:   findCol(r, "purchased"),
//     q1:    Number(findCol(r, "recommend", "likely", "scale of 0")) || 0,
//     q2:    findCol(r, "aspect", "improve"),
//     q3:    findCol(r, "clarity", "policy document"),
//     q4:    findCol(r, "speed", "inquir"),
//     q5:    findCol(r, "fairly", "treated"),
//     ts:    findCol(r, "timestamp"),
//   }));

//   /* ── filter ── */
//   const filtered = rows.filter((r) => {
//     if (filter === "all") return true;
//     if (filter === "prom") return r.q1 >= 9;
//     if (filter === "det") return r.q1 <= 6;
//     return r.ins === filter;
//   });

//   /* ── KPI data ── */
//   const q1vals = rows.map((r) => r.q1).filter(Boolean);
//   const q3vals = rows.map((r) => toN(r.q3));
//   const q4vals = rows.map((r) => toN(r.q4));
//   const q5vals = rows.map((r) => toN(r.q5));
//   const ov = +((avg(q1vals) + avg(q3vals) + avg(q4vals) + avg(q5vals)) / 4).toFixed(1);

//   /* ── NPS ── */
//   const t = rows.length || 1;
//   const prom = rows.filter((r) => r.q1 >= 9).length;
//   const pass = rows.filter((r) => r.q1 >= 7 && r.q1 <= 8).length;
//   const det = rows.filter((r) => r.q1 <= 6).length;
//   const npsScore = Math.round(((prom - det) / t) * 100);

//   /* ── improvement areas ── */
//   const cnt = {};
//   rows.forEach((r) => { const k = (r.q2 || "").trim(); if (k) cnt[k] = (cnt[k] || 0) + 1; });
//   const impAreas = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
//   const impTotal = impAreas.reduce((s, [, c]) => s + c, 0) || 1;

//   /* ── unique insurance types for filter ── */
//   const insTypes = [...new Set(rows.map((r) => r.ins).filter(Boolean))];

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 40, height: 40, border: "3px solid #E4E6EA", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
//         <p style={{ color: "#9CA3AF", marginTop: 16, fontSize: 13 }}>Loading dashboard…</p>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ background: "#fff", border: "1px solid #E4E6EA", borderRadius: 12, padding: "32px 36px", maxWidth: 480 }}>
//         <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
//         <h3 style={{ color: "#C8102E", marginBottom: 8 }}>Failed to load</h3>
//         <p style={{ color: "#6B7280", fontSize: 13 }}>{error}</p>
//         <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 12 }}>Make sure FastAPI is running on <code>localhost:8000</code></p>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "Inter,sans-serif", background: "#F5F6F8", color: "#111827", fontSize: 14, minHeight: "100vh" }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: "#fff", borderBottom: "1px solid #E4E6EA", height: 58, display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 50 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 12 }}>
//           <div style={{ width: 32, height: 32, background: "#C8102E", borderRadius: 7, display: "grid", placeItems: "center" }}>
//             <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
//           </div>
//           <span style={{ fontSize: "13.5px", fontWeight: 700 }}>Chola MS General Insurance</span>
//         </div>
//         <div style={{ width: 1, height: 20, background: "#E4E6EA" }} />
//         <div style={{ display: "flex", gap: 2 }}>
//           {["Survey Dashboard", "Call History", "Reports"].map((t, i) => (
//             <button key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? "#fff" : "#6B7280", background: i === 0 ? "#C8102E" : "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t}</button>
//           ))}
//         </div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontSize: 12, color: "#9CA3AF" }}>{now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
//           <button onClick={() => window.location.reload()} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1px solid #E4E6EA", background: "#fff", color: "#374151", fontFamily: "Inter,sans-serif" }}>↺ Refresh</button>
//         </div>
//       </nav>

//       <div style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 48px" }}>

//         {/* ── PAGE HEAD ── */}
//         <div style={{ marginBottom: 20 }}>
//           <h1 style={{ fontSize: 17, fontWeight: 700 }}>Customer Experience Dashboard</h1>
//           <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginTop: 3 }}>
//             Voice Survey Analytics &nbsp;·&nbsp; {rows.length} responses collected &nbsp;·&nbsp; Last updated {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
//           </p>
//         </div>

//         {/* ── 1. KPIs ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Overall Summary</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
//             <KpiCard icon="📊" label="Total Responses"    num={rows.length}   sub="Surveys completed"   accent fill={100} />
//             <KpiCard icon="⭐" label="Avg Recommendation" num={avg(q1vals)}   sub="Score out of 10"     accent fill={avg(q1vals)*10} />
//             <KpiCard icon="😊" label="Overall Satisfaction" num={ov}          sub="All questions avg"         fill={ov*10} />
//             <KpiCard icon="📞" label="Resolution Rating"  num={avg(q4vals)}   sub="Speed score /10"           fill={avg(q4vals)*10} />
//             <KpiCard icon="📄" label="Policy Clarity"     num={avg(q3vals)}   sub="Clarity score /10"         fill={avg(q3vals)*10} />
//             <KpiCard icon="🤝" label="Fair Treatment"     num={avg(q5vals)}   sub="Fairness score /10"        fill={avg(q5vals)*10} />
//           </div>
//         </div>

//         {/* ── 2. NPS + HISTOGRAM ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Recommendation Score Analysis</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>NPS Breakdown</h3>
//                 <span style={S.badgeRed}>NPS: {npsScore >= 0 ? "+" : ""}{npsScore}</span>
//               </div>
//               <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
//                 <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
//                   <NpsDonut prom={prom} pass={pass} det={det} />
//                   <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                     <div style={{ fontSize: 30, fontWeight: 700 }}>{npsScore >= 0 ? "+" : ""}{npsScore}</div>
//                     <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>NPS Score</div>
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   {[{ color: "#15803D", label: "Promoters", range: "(9–10)", n: prom }, { color: "#B45309", label: "Passives", range: "(7–8)", n: pass }, { color: "#C8102E", label: "Detractors", range: "(0–6)", n: det }].map((row) => (
//                     <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                       <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
//                       <span style={{ flex: 1, fontSize: "12.5px", color: "#374151" }}>{row.label} <span style={{ color: "#9CA3AF", fontSize: 11 }}>{row.range}</span></span>
//                       <span style={{ fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: "right" }}>{row.n}</span>
//                       <span style={{ fontSize: "11.5px", color: "#9CA3AF", minWidth: 34, textAlign: "right" }}>{pct(row.n, t)}%</span>
//                     </div>
//                   ))}
//                   <div style={{ display: "flex", height: 5, borderRadius: 5, overflow: "hidden", gap: 2, marginTop: 12 }}>
//                     <div style={{ width: `${pct(det, t)}%`, background: "#C8102E", opacity: 0.7 }} />
//                     <div style={{ width: `${pct(pass, t)}%`, background: "#B45309", opacity: 0.5 }} />
//                     <div style={{ width: `${pct(prom, t)}%`, background: "#15803D", opacity: 0.7 }} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Score Distribution</h3>
//                 <span style={S.badge}>Recommendation 0–10</span>
//               </div>
//               <div style={{ position: "relative", height: 210 }}>
//                 <Histogram data={q1vals} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 3. PER QUESTION ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Satisfaction by Question</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
//             {[
//               { title: "Policy Document Clarity", vals: rows.map((r) => r.q3), color: "#2563EB" },
//               { title: "Inquiry Resolution Speed", vals: rows.map((r) => r.q4), color: "#16A34A" },
//               { title: "Fairness of Interaction",  vals: rows.map((r) => r.q5), color: "#C8102E" },
//             ].map(({ title, vals, color }) => {
//               const score = avg(vals.map(toN));
//               const scoreColor = score >= 7 ? "#15803D" : score >= 5 ? "#B45309" : "#C8102E";
//               return (
//                 <div key={title} style={S.card}>
//                   <div style={S.cardHd}>
//                     <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>{title}</h3>
//                     <span style={{ ...S.badge, color: scoreColor, background: score >= 7 ? "#F0FDF4" : score >= 5 ? "#FFFBEB" : "#FDF2F3" }}>
//                       Avg {score} / 10
//                     </span>
//                   </div>
//                   <div style={{ position: "relative", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <div style={{ position: "relative", width: 150, height: 150 }}>
//                       <DonutGauge vals={vals} color={color} />
//                       <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                         <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{score}</div>
//                         <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>out of 10</div>
//                         <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: scoreColor }}>
//                           {score >= 7 ? "✓ Good" : score >= 5 ? "~ Average" : "✗ Needs Work"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── 4+5. IMPROVEMENT + TREND ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Improvement Areas & Response Trend</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Improvement Area Analysis</h3>
//                 <span style={S.badge}>Free Text</span>
//               </div>
//               {impAreas.length === 0 ? <p style={{ color: "#9CA3AF", fontSize: 13 }}>No data</p> : impAreas.map(([label, count]) => (
//                 <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                   <span style={{ fontSize: "12.5px", color: "#374151", width: 160, flexShrink: 0 }}>{label}</span>
//                   <div style={{ flex: 1, height: 6, background: "#F0F1F3", borderRadius: 6, overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${pct(count, impTotal)}%`, background: "#C8102E", opacity: 0.75, borderRadius: 6 }} />
//                   </div>
//                   <span style={{ fontSize: "12.5px", fontWeight: 600, width: 36, textAlign: "right" }}>{pct(count, impTotal)}%</span>
//                 </div>
//               ))}
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Responses Over Time</h3>
//                 <span style={S.badge}>Daily Volume</span>
//               </div>
//               <div style={{ position: "relative", height: 200 }}>
//                 <TrendChart records={records} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 6. RAW TABLE ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>All Feedback Records</div>
//           <div style={S.card}>
//             <div style={S.cardHd}>
//               <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Voice Survey Responses</h3>
//               <span style={S.badge}>{filtered.length} records</span>
//             </div>

//             {/* Filters */}
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
//               <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Filter:</span>
//               {[{ key: "all", label: "All" }, { key: "prom", label: "Promoters" }, { key: "det", label: "Detractors" }, ...insTypes.map((t) => ({ key: t, label: t.replace(" Insurance", "") }))].map(({ key, label }) => (
//                 <button key={key} onClick={() => setFilter(key)} style={{ padding: "4px 11px", borderRadius: 5, fontSize: 12, fontWeight: filter === key ? 600 : 500, cursor: "pointer", border: "1px solid", borderColor: filter === key ? "#C8102E" : "#E4E6EA", background: filter === key ? "#C8102E" : "#fff", color: filter === key ? "#fff" : "#6B7280", fontFamily: "Inter,sans-serif" }}>{label}</button>
//               ))}
//             </div>

//             {/* Table */}
//             <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
//                 <thead>
//                   <tr>
//                     {["#", ...columns].map((col) => (
//                       <th key={col} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, whiteSpace: "nowrap" }}>{col}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((row, i) => (
//                     <tr key={i} onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={(e) => e.currentTarget.style.background = ""}>
//                       <td style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#9CA3AF", fontSize: 11 }}>{i + 1}</td>
//                       {columns.map((col) => {
//                         const val = row.raw[col];
//                         const isNps = col.toLowerCase().includes("nps") || col.toLowerCase().includes("recommendation") || col.toLowerCase().includes("score");
//                         const isText = col.toLowerCase().includes("clarity") || col.toLowerCase().includes("speed") || col.toLowerCase().includes("fair") || col.toLowerCase().includes("treatment");
//                         return (
//                           <td key={col} style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#374151", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "middle" }}>
//                             {isNps && !isNaN(Number(val)) ? <ScoreBox n={Number(val)} /> : isText ? <TxtTag v={String(val ?? "")} /> : val === null || val === undefined || val === "" ? <span style={{ color: "#D1D5DB" }}>—</span> : String(val)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";
// Chart.register(...registerables);

// const API_URL = "http://localhost:8000/api/records";

// /* ── helpers ── */
// const avg = (a) => (a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0);
// const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
// const TM = {
//   "very satisfied": 9, satisfied: 7, neutral: 5, unsatisfied: 3,
//   "very fair": 9, fair: 7, fairly: 7, unfair: 3,
//   fast: 9, moderate: 6, slow: 3,
// };
// const toN = (v) => TM[(v || "").toLowerCase().trim()] ?? 5;
// const fmtD = (ts) => {
//   const d = new Date(ts);
//   return isNaN(d) ? ts : d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
// };

// /* ── chart hook ── */
// function useChart(ref, config) {
//   const inst = useRef(null);
//   useEffect(() => {
//     if (!ref.current) return;
//     if (inst.current) inst.current.destroy();
//     inst.current = new Chart(ref.current, config);
//     return () => inst.current?.destroy();
//     // eslint-disable-next-line
//   }, [JSON.stringify(config?.data)]);
// }

// /* ── sub-components ── */
// function KpiCard({ icon, label, num, sub, accent, fill }) {
//   return (
//     <div style={S.kpi}>
//       <div style={{ fontSize: 18, marginBottom: 10 }}>{icon}</div>
//       <div style={{ fontSize: "11.5px", fontWeight: 500, color: "#6B7280", marginBottom: 2 }}>{label}</div>
//       <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#C8102E" : "#111827", lineHeight: 1, marginBottom: 4 }}>{num}</div>
//       <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
//       <div style={{ height: 2, background: "#E4E6EA", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
//         <div style={{ height: "100%", width: `${fill}%`, background: "#C8102E", borderRadius: 2 }} />
//       </div>
//     </div>
//   );
// }

// function ScoreBox({ n }) {
//   const cls = n >= 9 ? { bg: "#F0FDF4", color: "#15803D" } : n >= 7 ? { bg: "#FFFBEB", color: "#B45309" } : { bg: "#FDF2F3", color: "#C8102E" };
//   return (
//     <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 5, textAlign: "center", lineHeight: "26px", fontSize: 12, fontWeight: 700, background: cls.bg, color: cls.color }}>{n}</span>
//   );
// }

// function TxtTag({ v }) {
//   const s = (v || "").toLowerCase();
//   let style = { fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500 };
//   if (s.includes("very sat") || s.includes("very fair") || s.includes("fast")) style = { ...style, background: "#F0FDF4", color: "#15803D" };
//   else if (s.includes("sat") || s.includes("fair") || s.includes("mod")) style = { ...style, background: "#F0F9FF", color: "#0369A1" };
//   else if (s.includes("neut")) style = { ...style, background: "#F0F1F3", color: "#6B7280" };
//   else style = { ...style, background: "#FDF2F3", color: "#C8102E" };
//   return <span style={style}>{v}</span>;
// }

// /* ── NPS donut ── */
// function NpsDonut({ prom, pass, det }) {
//   const ref = useRef(null);
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       labels: ["Detractors", "Passives", "Promoters"],
//       datasets: [{ data: [det, pass, prom], backgroundColor: ["#C8102E", "#B45309", "#15803D"], borderWidth: 3, borderColor: "#fff", hoverOffset: 4 }],
//     },
//     options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── histogram ── */
// function Histogram({ data }) {
//   const ref = useRef(null);
//   const dist = Array.from({ length: 11 }, (_, i) => data.filter((d) => d === i).length);
//   const colors = dist.map((_, i) => i <= 6 ? "rgba(200,16,46,0.55)" : i <= 8 ? "rgba(180,83,9,0.45)" : "rgba(21,128,61,0.55)");
//   useChart(ref, {
//     type: "bar",
//     data: { labels: ["0","1","2","3","4","5","6","7","8","9","10"], datasets: [{ data: dist, backgroundColor: colors, borderRadius: 5, borderSkipped: false }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── donut gauge for satisfaction scores ── */
// function DonutGauge({ vals, color }) {
//   const ref = useRef(null);
//   const nums = vals.map(toN);
//   const score = avg(nums);
//   const remaining = 10 - score;
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       datasets: [{
//         data: [score, remaining],
//         backgroundColor: [color, "#F0F1F3"],
//         borderWidth: 0,
//         hoverOffset: 0,
//       }],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       cutout: "78%",
//       plugins: { legend: { display: false }, tooltip: { enabled: false } },
//       animation: { animateRotate: true, duration: 800 },
//     },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── trend line ── */
// function TrendChart({ records }) {
//   const ref = useRef(null);
//   const byD = {};
//   records.forEach((d) => { const k = (d.Timestamp || d.ts || "").slice(0, 10); if (k) byD[k] = (byD[k] || 0) + 1; });
//   const days = Object.keys(byD).sort().slice(-8);
//   const vals = days.map((d) => byD[d] || 0);
//   useChart(ref, {
//     type: "line",
//     data: { labels: days.map((d) => d.slice(5)), datasets: [{ data: vals, borderColor: "#C8102E", backgroundColor: "rgba(200,16,46,0.06)", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#C8102E", borderWidth: 2, fill: true }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { min: 0, grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── styles ── */
// const S = {
//   kpi: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "16px 18px" },
//   card: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "18px 20px" },
//   cardHd: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
//   badge: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#F0F1F3", color: "#6B7280" },
//   badgeRed: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#FDF2F3", color: "#C8102E" },
//   secHd: { fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".7px", color: "#9CA3AF", marginBottom: 12 },
// };

// /* ══════════════════════════════════════════════
//    MAIN APP
// ══════════════════════════════════════════════ */
// export default function App() {
//   const [records, setRecords] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [now, setNow] = useState(new Date());

//   const [refreshing, setRefreshing] = useState(false);

//   const fetchData = (isRefresh = false) => {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);
//     setError(null);

//     fetch(API_URL)
//       .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
//       .then((data) => {
//         let rows = [];
//         if (Array.isArray(data?.records)) rows = data.records;
//         else if (Array.isArray(data?.data?.rows)) rows = data.data.rows;
//         else if (data?.fields && Array.isArray(data?.rows)) {
//           const cols = data.fields.map((f) => f.label || f.column_name || f.name);
//           rows = data.rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
//         } else if (Array.isArray(data)) rows = data;
//         else { setError("Unexpected API format"); setLoading(false); setRefreshing(false); return; }

//         setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
//         setRecords(rows);
//         setNow(new Date());
//         setLoading(false);
//         setRefreshing(false);
//       })
//       .catch((e) => { setError(e.message); setLoading(false); setRefreshing(false); });
//   };

//   useEffect(() => { fetchData(); }, []);

//   /* ── derive fields from whatever columns Zoho returns ── */
//   // Match column by checking if keyword appears inside column name
//   const findCol = (row, ...keywords) => {
//     const colKeys = Object.keys(row);
//     for (const kw of keywords) {
//       const found = colKeys.find((c) => c.toLowerCase().includes(kw.toLowerCase()));
//       if (found && row[found] !== undefined && row[found] !== "") return row[found];
//     }
//     return "";
//   };

//   const rows = records.map((r) => ({
//     raw: r,
//     name:  findCol(r, "name"),
//     phone: findCol(r, "phone", "mobile"),
//     ins:   findCol(r, "purchased"),
//     q1:    Number(findCol(r, "recommend", "likely", "scale of 0")) || 0,
//     q2:    findCol(r, "aspect", "improve"),
//     q3:    findCol(r, "clarity", "policy document"),
//     q4:    findCol(r, "speed", "inquir"),
//     q5:    findCol(r, "fairly", "treated"),
//     ts:    findCol(r, "timestamp"),
//   }));

//   /* ── filter ── */
//   const filtered = rows.filter((r) => {
//     if (filter === "all") return true;
//     if (filter === "prom") return r.q1 >= 9;
//     if (filter === "det") return r.q1 <= 6;
//     return r.ins === filter;
//   });

//   /* ── KPI data ── */
//   const q1vals = rows.map((r) => r.q1).filter(Boolean);
//   const q3vals = rows.map((r) => toN(r.q3));
//   const q4vals = rows.map((r) => toN(r.q4));
//   const q5vals = rows.map((r) => toN(r.q5));
//   const ov = +((avg(q1vals) + avg(q3vals) + avg(q4vals) + avg(q5vals)) / 4).toFixed(1);

//   /* ── NPS ── */
//   const t = rows.length || 1;
//   const prom = rows.filter((r) => r.q1 >= 9).length;
//   const pass = rows.filter((r) => r.q1 >= 7 && r.q1 <= 8).length;
//   const det = rows.filter((r) => r.q1 <= 6).length;
//   const npsScore = Math.round(((prom - det) / t) * 100);

//   /* ── improvement areas ── */
//   const cnt = {};
//   rows.forEach((r) => { const k = (r.q2 || "").trim(); if (k) cnt[k] = (cnt[k] || 0) + 1; });
//   const impAreas = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
//   const impTotal = impAreas.reduce((s, [, c]) => s + c, 0) || 1;

//   /* ── unique insurance types for filter ── */
//   const insTypes = [...new Set(rows.map((r) => r.ins).filter(Boolean))];

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 40, height: 40, border: "3px solid #E4E6EA", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
//         <p style={{ color: "#9CA3AF", marginTop: 16, fontSize: 13 }}>Loading dashboard…</p>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ background: "#fff", border: "1px solid #E4E6EA", borderRadius: 12, padding: "32px 36px", maxWidth: 480 }}>
//         <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
//         <h3 style={{ color: "#C8102E", marginBottom: 8 }}>Failed to load</h3>
//         <p style={{ color: "#6B7280", fontSize: 13 }}>{error}</p>
//         <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 12 }}>Make sure FastAPI is running on <code>localhost:8000</code></p>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "Inter,sans-serif", background: "#F5F6F8", color: "#111827", fontSize: 14, minHeight: "100vh" }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: "#fff", borderBottom: "1px solid #E4E6EA", height: 58, display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 50 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 12 }}>
//           <div style={{ width: 32, height: 32, background: "#C8102E", borderRadius: 7, display: "grid", placeItems: "center" }}>
//             <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
//           </div>
//           <span style={{ fontSize: "13.5px", fontWeight: 700 }}>Chola MS General Insurance</span>
//         </div>
//         <div style={{ width: 1, height: 20, background: "#E4E6EA" }} />
//         <div style={{ display: "flex", gap: 2 }}>
//           {["Survey Dashboard", "Call History", "Reports"].map((t, i) => (
//             <button key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? "#fff" : "#6B7280", background: i === 0 ? "#C8102E" : "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t}</button>
//           ))}
//         </div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontSize: 12, color: "#9CA3AF" }}>{now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
//           <button
//             onClick={() => fetchData(true)}
//             disabled={refreshing}
//             style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: refreshing ? "not-allowed" : "pointer", border: "1px solid #E4E6EA", background: "#fff", color: refreshing ? "#9CA3AF" : "#374151", fontFamily: "Inter,sans-serif", transition: "all .2s" }}
//           >
//             <span style={{ display: "inline-block", animation: refreshing ? "spin .7s linear infinite" : "none" }}>↺</span>
//             {refreshing ? "Refreshing…" : "Refresh"}
//           </button>
//         </div>
//       </nav>

//       <div style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 48px" }}>

//         {/* ── PAGE HEAD ── */}
//         <div style={{ marginBottom: 20 }}>
//           <h1 style={{ fontSize: 17, fontWeight: 700 }}>Customer Experience Dashboard</h1>
//           <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginTop: 3 }}>
//             Voice Survey Analytics &nbsp;·&nbsp; {rows.length} responses collected &nbsp;·&nbsp; Last updated {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
//           </p>
//         </div>

//         {/* ── 1. KPIs ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Overall Summary</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
//             <KpiCard icon="📊" label="Total Responses"    num={rows.length}   sub="Surveys completed"   accent fill={100} />
//             <KpiCard icon="⭐" label="Avg Recommendation" num={avg(q1vals)}   sub="Score out of 10"     accent fill={avg(q1vals)*10} />
//             <KpiCard icon="😊" label="Overall Satisfaction" num={ov}          sub="All questions avg"         fill={ov*10} />
//             <KpiCard icon="📞" label="Resolution Rating"  num={avg(q4vals)}   sub="Speed score /10"           fill={avg(q4vals)*10} />
//             <KpiCard icon="📄" label="Policy Clarity"     num={avg(q3vals)}   sub="Clarity score /10"         fill={avg(q3vals)*10} />
//             <KpiCard icon="🤝" label="Fair Treatment"     num={avg(q5vals)}   sub="Fairness score /10"        fill={avg(q5vals)*10} />
//           </div>
//         </div>

//         {/* ── 2. NPS + HISTOGRAM ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Recommendation Score Analysis</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>NPS Breakdown</h3>
//                 <span style={S.badgeRed}>NPS: {npsScore >= 0 ? "+" : ""}{npsScore}</span>
//               </div>
//               <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
//                 <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
//                   <NpsDonut prom={prom} pass={pass} det={det} />
//                   <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                     <div style={{ fontSize: 30, fontWeight: 700 }}>{npsScore >= 0 ? "+" : ""}{npsScore}</div>
//                     <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>NPS Score</div>
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   {[{ color: "#15803D", label: "Promoters", range: "(9–10)", n: prom }, { color: "#B45309", label: "Passives", range: "(7–8)", n: pass }, { color: "#C8102E", label: "Detractors", range: "(0–6)", n: det }].map((row) => (
//                     <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                       <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
//                       <span style={{ flex: 1, fontSize: "12.5px", color: "#374151" }}>{row.label} <span style={{ color: "#9CA3AF", fontSize: 11 }}>{row.range}</span></span>
//                       <span style={{ fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: "right" }}>{row.n}</span>
//                       <span style={{ fontSize: "11.5px", color: "#9CA3AF", minWidth: 34, textAlign: "right" }}>{pct(row.n, t)}%</span>
//                     </div>
//                   ))}
//                   <div style={{ display: "flex", height: 5, borderRadius: 5, overflow: "hidden", gap: 2, marginTop: 12 }}>
//                     <div style={{ width: `${pct(det, t)}%`, background: "#C8102E", opacity: 0.7 }} />
//                     <div style={{ width: `${pct(pass, t)}%`, background: "#B45309", opacity: 0.5 }} />
//                     <div style={{ width: `${pct(prom, t)}%`, background: "#15803D", opacity: 0.7 }} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Score Distribution</h3>
//                 <span style={S.badge}>Recommendation 0–10</span>
//               </div>
//               <div style={{ position: "relative", height: 210 }}>
//                 <Histogram data={q1vals} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 3. PER QUESTION ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Satisfaction by Question</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
//             {[
//               { title: "Policy Document Clarity", vals: rows.map((r) => r.q3), color: "#2563EB" },
//               { title: "Inquiry Resolution Speed", vals: rows.map((r) => r.q4), color: "#16A34A" },
//               { title: "Fairness of Interaction",  vals: rows.map((r) => r.q5), color: "#C8102E" },
//             ].map(({ title, vals, color }) => {
//               const score = avg(vals.map(toN));
//               const scoreColor = score >= 7 ? "#15803D" : score >= 5 ? "#B45309" : "#C8102E";
//               return (
//                 <div key={title} style={S.card}>
//                   <div style={S.cardHd}>
//                     <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>{title}</h3>
//                     <span style={{ ...S.badge, color: scoreColor, background: score >= 7 ? "#F0FDF4" : score >= 5 ? "#FFFBEB" : "#FDF2F3" }}>
//                       Avg {score} / 10
//                     </span>
//                   </div>
//                   <div style={{ position: "relative", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <div style={{ position: "relative", width: 150, height: 150 }}>
//                       <DonutGauge vals={vals} color={color} />
//                       <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                         <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{score}</div>
//                         <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>out of 10</div>
//                         <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: scoreColor }}>
//                           {score >= 7 ? "✓ Good" : score >= 5 ? "~ Average" : "✗ Needs Work"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── 4+5. IMPROVEMENT + TREND ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Improvement Areas & Response Trend</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Improvement Area Analysis</h3>
//                 <span style={S.badge}>Free Text</span>
//               </div>
//               {impAreas.length === 0 ? <p style={{ color: "#9CA3AF", fontSize: 13 }}>No data</p> : impAreas.map(([label, count]) => (
//                 <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                   <span style={{ fontSize: "12.5px", color: "#374151", width: 160, flexShrink: 0 }}>{label}</span>
//                   <div style={{ flex: 1, height: 6, background: "#F0F1F3", borderRadius: 6, overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${pct(count, impTotal)}%`, background: "#C8102E", opacity: 0.75, borderRadius: 6 }} />
//                   </div>
//                   <span style={{ fontSize: "12.5px", fontWeight: 600, width: 36, textAlign: "right" }}>{pct(count, impTotal)}%</span>
//                 </div>
//               ))}
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Responses Over Time</h3>
//                 <span style={S.badge}>Daily Volume</span>
//               </div>
//               <div style={{ position: "relative", height: 200 }}>
//                 <TrendChart records={records} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 6. RAW TABLE ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>All Feedback Records</div>
//           <div style={S.card}>
//             <div style={S.cardHd}>
//               <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Voice Survey Responses</h3>
//               <span style={S.badge}>{filtered.length} records</span>
//             </div>

//             {/* Filters */}
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
//               <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Filter:</span>
//               {[{ key: "all", label: "All" }, { key: "prom", label: "Promoters" }, { key: "det", label: "Detractors" }, ...insTypes.map((t) => ({ key: t, label: t.replace(" Insurance", "") }))].map(({ key, label }) => (
//                 <button key={key} onClick={() => setFilter(key)} style={{ padding: "4px 11px", borderRadius: 5, fontSize: 12, fontWeight: filter === key ? 600 : 500, cursor: "pointer", border: "1px solid", borderColor: filter === key ? "#C8102E" : "#E4E6EA", background: filter === key ? "#C8102E" : "#fff", color: filter === key ? "#fff" : "#6B7280", fontFamily: "Inter,sans-serif" }}>{label}</button>
//               ))}
//             </div>

//             {/* Table */}
//             <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
//                 <thead>
//                   <tr>
//                     {["#", ...columns].map((col) => (
//                       <th key={col} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, whiteSpace: "nowrap" }}>{col}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((row, i) => (
//                     <tr key={i} onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={(e) => e.currentTarget.style.background = ""}>
//                       <td style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#9CA3AF", fontSize: 11 }}>{i + 1}</td>
//                       {columns.map((col) => {
//                         const val = row.raw[col];
//                         const isNps = col.toLowerCase().includes("nps") || col.toLowerCase().includes("recommendation") || col.toLowerCase().includes("score");
//                         const isText = col.toLowerCase().includes("clarity") || col.toLowerCase().includes("speed") || col.toLowerCase().includes("fair") || col.toLowerCase().includes("treatment");
//                         return (
//                           <td key={col} style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#374151", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "middle" }}>
//                             {isNps && !isNaN(Number(val)) ? <ScoreBox n={Number(val)} /> : isText ? <TxtTag v={String(val ?? "")} /> : val === null || val === undefined || val === "" ? <span style={{ color: "#D1D5DB" }}>—</span> : String(val)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";
// Chart.register(...registerables);

// const API_URL = "http://localhost:8000/api/records";

// /* ── helpers ── */
// const avg = (a) => (a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0);
// const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
// const TM = {
//   "very satisfied": 9, satisfied: 7, neutral: 5, unsatisfied: 3,
//   "very fair": 9, fair: 7, fairly: 7, unfair: 3,
//   fast: 9, moderate: 6, slow: 3,
// };
// const toN = (v) => TM[(v || "").toLowerCase().trim()] ?? 5;
// const fmtD = (ts) => {
//   const d = new Date(ts);
//   return isNaN(d) ? ts : d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
// };

// /* ── chart hook ── */
// function useChart(ref, config) {
//   const inst = useRef(null);
//   useEffect(() => {
//     if (!ref.current) return;
//     if (inst.current) inst.current.destroy();
//     inst.current = new Chart(ref.current, config);
//     return () => inst.current?.destroy();
//     // eslint-disable-next-line
//   }, [JSON.stringify(config?.data)]);
// }

// /* ── sub-components ── */
// function KpiCard({ icon, label, num, sub, accent, fill }) {
//   return (
//     <div style={S.kpi}>
//       <div style={{ fontSize: 18, marginBottom: 10 }}>{icon}</div>
//       <div style={{ fontSize: "11.5px", fontWeight: 500, color: "#6B7280", marginBottom: 2 }}>{label}</div>
//       <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#C8102E" : "#111827", lineHeight: 1, marginBottom: 4 }}>{num}</div>
//       <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
//       <div style={{ height: 2, background: "#E4E6EA", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
//         <div style={{ height: "100%", width: `${fill}%`, background: "#C8102E", borderRadius: 2 }} />
//       </div>
//     </div>
//   );
// }

// function ScoreBox({ n }) {
//   const cls = n >= 9 ? { bg: "#F0FDF4", color: "#15803D" } : n >= 7 ? { bg: "#FFFBEB", color: "#B45309" } : { bg: "#FDF2F3", color: "#C8102E" };
//   return (
//     <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 5, textAlign: "center", lineHeight: "26px", fontSize: 12, fontWeight: 700, background: cls.bg, color: cls.color }}>{n}</span>
//   );
// }

// function TxtTag({ v }) {
//   const s = (v || "").toLowerCase();
//   let style = { fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500 };
//   if (s.includes("very sat") || s.includes("very fair") || s.includes("fast")) style = { ...style, background: "#F0FDF4", color: "#15803D" };
//   else if (s.includes("sat") || s.includes("fair") || s.includes("mod")) style = { ...style, background: "#F0F9FF", color: "#0369A1" };
//   else if (s.includes("neut")) style = { ...style, background: "#F0F1F3", color: "#6B7280" };
//   else style = { ...style, background: "#FDF2F3", color: "#C8102E" };
//   return <span style={style}>{v}</span>;
// }

// /* ── NPS donut ── */
// function NpsDonut({ prom, pass, det }) {
//   const ref = useRef(null);
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       labels: ["Detractors", "Passives", "Promoters"],
//       datasets: [{ data: [det, pass, prom], backgroundColor: ["#C8102E", "#B45309", "#15803D"], borderWidth: 3, borderColor: "#fff", hoverOffset: 4 }],
//     },
//     options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── histogram ── */
// function Histogram({ data }) {
//   const ref = useRef(null);
//   const dist = Array.from({ length: 11 }, (_, i) => data.filter((d) => d === i).length);
//   const colors = dist.map((_, i) => i <= 6 ? "rgba(200,16,46,0.55)" : i <= 8 ? "rgba(180,83,9,0.45)" : "rgba(21,128,61,0.55)");
//   useChart(ref, {
//     type: "bar",
//     data: { labels: ["0","1","2","3","4","5","6","7","8","9","10"], datasets: [{ data: dist, backgroundColor: colors, borderRadius: 5, borderSkipped: false }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── donut gauge for satisfaction scores ── */
// function DonutGauge({ vals, color }) {
//   const ref = useRef(null);
//   const nums = vals.map(toN);
//   const score = avg(nums);
//   const remaining = 10 - score;
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       datasets: [{
//         data: [score, remaining],
//         backgroundColor: [color, "#F0F1F3"],
//         borderWidth: 0,
//         hoverOffset: 0,
//       }],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       cutout: "78%",
//       plugins: { legend: { display: false }, tooltip: { enabled: false } },
//       animation: { animateRotate: true, duration: 800 },
//     },
//   });
//   return <canvas ref={ref} />;
// }



// /* ── mini bar chart for distribution ── */
// function BarMini({ vals, color }) {
//   const ref = useRef(null);
//   const nums = vals.map(toN);
//   const dist = Array.from({ length: 10 }, (_, i) => nums.filter((n) => n === i + 1).length);
//   useChart(ref, {
//     type: "bar",
//     data: {
//       labels: ["1","2","3","4","5","6","7","8","9","10"],
//       datasets: [{ data: dist, backgroundColor: color + "55", borderColor: color, borderWidth: 1, borderRadius: 3, borderSkipped: false }],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.raw} response${c.raw !== 1 ? "s" : ""}` } } },
//       scales: {
//         x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 9 } } },
//         y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 9 }, stepSize: 1 } },
//       },
//     },
//   });
//   return <div style={{ height: 110 }}><canvas ref={ref} /></div>;
// }

// /* ── styles ── */
// const S = {
//   kpi: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "16px 18px" },
//   card: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "18px 20px" },
//   cardHd: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
//   badge: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#F0F1F3", color: "#6B7280" },
//   badgeRed: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#FDF2F3", color: "#C8102E" },
//   secHd: { fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".7px", color: "#9CA3AF", marginBottom: 12 },
// };

// /* ══════════════════════════════════════════════
//    MAIN APP
// ══════════════════════════════════════════════ */
// export default function App() {
//   const [records, setRecords] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [now, setNow] = useState(new Date());

//   const [refreshing, setRefreshing] = useState(false);

//   const fetchData = (isRefresh = false) => {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);
//     setError(null);

//     fetch(API_URL)
//       .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
//       .then((data) => {
//         let rows = [];
//         if (Array.isArray(data?.records)) rows = data.records;
//         else if (Array.isArray(data?.data?.rows)) rows = data.data.rows;
//         else if (data?.fields && Array.isArray(data?.rows)) {
//           const cols = data.fields.map((f) => f.label || f.column_name || f.name);
//           rows = data.rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
//         } else if (Array.isArray(data)) rows = data;
//         else { setError("Unexpected API format"); setLoading(false); setRefreshing(false); return; }

//         setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
//         setRecords(rows);
//         setNow(new Date());
//         setLoading(false);
//         setRefreshing(false);
//       })
//       .catch((e) => { setError(e.message); setLoading(false); setRefreshing(false); });
//   };

//   useEffect(() => { fetchData(); }, []);

//   /* ── derive fields from whatever columns Zoho returns ── */
//   // Match column by checking if keyword appears inside column name
//   const findCol = (row, ...keywords) => {
//     const colKeys = Object.keys(row);
//     for (const kw of keywords) {
//       const found = colKeys.find((c) => c.toLowerCase().includes(kw.toLowerCase()));
//       if (found && row[found] !== undefined && row[found] !== "") return row[found];
//     }
//     return "";
//   };

//   const rows = records.map((r) => ({
//     raw: r,
//     name:  findCol(r, "name"),
//     phone: findCol(r, "phone", "mobile"),
//     ins:   findCol(r, "purchased"),
//     q1:    Number(findCol(r, "recommend", "likely", "scale of 0")) || 0,
//     q2:    findCol(r, "aspect", "improve"),
//     q3:    findCol(r, "clarity", "policy document"),
//     q4:    findCol(r, "speed", "inquir"),
//     q5:    findCol(r, "fairly", "treated"),
//     ts:    findCol(r, "timestamp"),
//   }));

//   /* ── filter ── */
//   const filtered = rows.filter((r) => {
//     if (filter === "all") return true;
//     if (filter === "prom") return r.q1 >= 9;
//     if (filter === "det") return r.q1 <= 6;
//     return r.ins === filter;
//   });

//   /* ── KPI data ── */
//   const q1vals = rows.map((r) => r.q1).filter(Boolean);
//   const q3vals = rows.map((r) => toN(r.q3));
//   const q4vals = rows.map((r) => toN(r.q4));
//   const q5vals = rows.map((r) => toN(r.q5));
//   const ov = +((avg(q1vals) + avg(q3vals) + avg(q4vals) + avg(q5vals)) / 4).toFixed(1);

//   /* ── NPS ── */
//   const t = rows.length || 1;
//   const prom = rows.filter((r) => r.q1 >= 9).length;
//   const pass = rows.filter((r) => r.q1 >= 7 && r.q1 <= 8).length;
//   const det = rows.filter((r) => r.q1 <= 6).length;
//   const npsScore = Math.round(((prom - det) / t) * 100);

//   /* ── improvement areas ── */
//   const cnt = {};
//   rows.forEach((r) => { const k = (r.q2 || "").trim(); if (k) cnt[k] = (cnt[k] || 0) + 1; });
//   const impAreas = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
//   const impTotal = impAreas.reduce((s, [, c]) => s + c, 0) || 1;

//   /* ── unique insurance types for filter ── */
//   const insTypes = [...new Set(rows.map((r) => r.ins).filter(Boolean))];

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 40, height: 40, border: "3px solid #E4E6EA", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
//         <p style={{ color: "#9CA3AF", marginTop: 16, fontSize: 13 }}>Loading dashboard…</p>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ background: "#fff", border: "1px solid #E4E6EA", borderRadius: 12, padding: "32px 36px", maxWidth: 480 }}>
//         <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
//         <h3 style={{ color: "#C8102E", marginBottom: 8 }}>Failed to load</h3>
//         <p style={{ color: "#6B7280", fontSize: 13 }}>{error}</p>
//         <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 12 }}>Make sure FastAPI is running on <code>localhost:8000</code></p>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "Inter,sans-serif", background: "#F5F6F8", color: "#111827", fontSize: 14, minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: "#fff", borderBottom: "1px solid #E4E6EA", height: 58, display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 50 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 12 }}>
//           <div style={{ width: 32, height: 32, background: "#C8102E", borderRadius: 7, display: "grid", placeItems: "center" }}>
//             <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
//           </div>
//           <span style={{ fontSize: "13.5px", fontWeight: 700 }}>Chola MS General Insurance</span>
//         </div>
//         <div style={{ width: 1, height: 20, background: "#E4E6EA" }} />
//         <div style={{ display: "flex", gap: 2 }}>
//           {["Survey Dashboard", "Call History", "Reports"].map((t, i) => (
//             <button key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? "#fff" : "#6B7280", background: i === 0 ? "#C8102E" : "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t}</button>
//           ))}
//         </div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontSize: 12, color: "#9CA3AF" }}>{now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
//           <button
//             onClick={() => fetchData(true)}
//             disabled={refreshing}
//             style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: refreshing ? "not-allowed" : "pointer", border: "1px solid #E4E6EA", background: "#fff", color: refreshing ? "#9CA3AF" : "#374151", fontFamily: "Inter,sans-serif", transition: "all .2s" }}
//           >
//             <span style={{ display: "inline-block", animation: refreshing ? "spin .7s linear infinite" : "none" }}>↺</span>
//             {refreshing ? "Refreshing…" : "Refresh"}
//           </button>
//         </div>
//       </nav>

//       <div style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 48px" }}>

//         {/* ── PAGE HEAD ── */}
//         <div style={{ marginBottom: 20 }}>
//           <h1 style={{ fontSize: 17, fontWeight: 700 }}>Customer Experience Dashboard</h1>
//           <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginTop: 3 }}>
//             Voice Survey Analytics &nbsp;·&nbsp; {rows.length} responses collected &nbsp;·&nbsp; Last updated {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
//           </p>
//         </div>

//         {/* ── 1. KPIs ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Overall Summary</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, minWidth: 0 }}>
//             <KpiCard icon="📊" label="Total Responses"    num={rows.length}   sub="Surveys completed"   accent fill={100} />
//             <KpiCard icon="⭐" label="Avg Recommendation" num={avg(q1vals)}   sub="Score out of 10"     accent fill={avg(q1vals)*10} />
//             <KpiCard icon="😊" label="Overall Satisfaction" num={ov}          sub="All questions avg"         fill={ov*10} />
//             <KpiCard icon="📞" label="Resolution Rating"  num={avg(q4vals)}   sub="Speed score /10"           fill={avg(q4vals)*10} />
//             <KpiCard icon="📄" label="Policy Clarity"     num={avg(q3vals)}   sub="Clarity score /10"         fill={avg(q3vals)*10} />
//             <KpiCard icon="🤝" label="Fair Treatment"     num={avg(q5vals)}   sub="Fairness score /10"        fill={avg(q5vals)*10} />
//           </div>
//         </div>

//         {/* ── 2. NPS + HISTOGRAM ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Recommendation Score Analysis</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>NPS Breakdown</h3>
//                 <span style={S.badgeRed}>NPS: {npsScore >= 0 ? "+" : ""}{npsScore}</span>
//               </div>
//               <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
//                 <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
//                   <NpsDonut prom={prom} pass={pass} det={det} />
//                   <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                     <div style={{ fontSize: 30, fontWeight: 700 }}>{npsScore >= 0 ? "+" : ""}{npsScore}</div>
//                     <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>NPS Score</div>
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   {[{ color: "#15803D", label: "Promoters", range: "(9–10)", n: prom }, { color: "#B45309", label: "Passives", range: "(7–8)", n: pass }, { color: "#C8102E", label: "Detractors", range: "(0–6)", n: det }].map((row) => (
//                     <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                       <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
//                       <span style={{ flex: 1, fontSize: "12.5px", color: "#374151" }}>{row.label} <span style={{ color: "#9CA3AF", fontSize: 11 }}>{row.range}</span></span>
//                       <span style={{ fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: "right" }}>{row.n}</span>
//                       <span style={{ fontSize: "11.5px", color: "#9CA3AF", minWidth: 34, textAlign: "right" }}>{pct(row.n, t)}%</span>
//                     </div>
//                   ))}
//                   <div style={{ display: "flex", height: 5, borderRadius: 5, overflow: "hidden", gap: 2, marginTop: 12 }}>
//                     <div style={{ width: `${pct(det, t)}%`, background: "#C8102E", opacity: 0.7 }} />
//                     <div style={{ width: `${pct(pass, t)}%`, background: "#B45309", opacity: 0.5 }} />
//                     <div style={{ width: `${pct(prom, t)}%`, background: "#15803D", opacity: 0.7 }} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Score Distribution</h3>
//                 <span style={S.badge}>Recommendation 0–10</span>
//               </div>
//               <div style={{ position: "relative", height: 210 }}>
//                 <Histogram data={q1vals} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 3. PER QUESTION ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Satisfaction by Question</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
//             {[
//               { title: "Policy Document Clarity", vals: rows.map((r) => r.q3), color: "#2563EB" },
//               { title: "Inquiry Resolution Speed", vals: rows.map((r) => r.q4), color: "#16A34A" },
//               { title: "Fairness of Interaction",  vals: rows.map((r) => r.q5), color: "#C8102E" },
//             ].map(({ title, vals, color }) => {
//               const score = avg(vals.map(toN));
//               const scoreColor = score >= 7 ? "#15803D" : score >= 5 ? "#B45309" : "#C8102E";
//               return (
//                 <div key={title} style={S.card}>
//                   <div style={S.cardHd}>
//                     <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>{title}</h3>
//                     <span style={{ ...S.badge, color: scoreColor, background: score >= 7 ? "#F0FDF4" : score >= 5 ? "#FFFBEB" : "#FDF2F3" }}>
//                       Avg {score} / 10
//                     </span>
//                   </div>
//                   {/* Donut + Bar side by side */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     {/* Donut */}
//                     <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
//                       <DonutGauge vals={vals} color={color} />
//                       <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                         <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{score}</div>
//                         <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1 }}>/ 10</div>
//                         <div style={{ marginTop: 4, fontSize: 10, fontWeight: 600, color: scoreColor }}>
//                           {score >= 7 ? "✓ Good" : score >= 5 ? "~ Avg" : "✗ Low"}
//                         </div>
//                       </div>
//                     </div>
//                     {/* Bar distribution */}
//                     <div style={{ flex: 1 }}>
//                       <BarMini vals={vals} color={color} />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── 4. IMPROVEMENT ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Improvement Areas</div>
//           <div style={S.card}>
//             <div style={S.cardHd}>
//               <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Improvement Area Analysis</h3>
//               <span style={S.badge}>Free Text · Q2</span>
//             </div>
//             {impAreas.length === 0 ? <p style={{ color: "#9CA3AF", fontSize: 13 }}>No data</p> : (
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 32px" }}>
//                 {impAreas.map(([label, count]) => (
//                   <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                     <span style={{ fontSize: "12.5px", color: "#374151", minWidth: 140, flexShrink: 0 }}>{label}</span>
//                     <div style={{ flex: 1, height: 6, background: "#F0F1F3", borderRadius: 6, overflow: "hidden" }}>
//                       <div style={{ height: "100%", width: `${pct(count, impTotal)}%`, background: "#C8102E", opacity: 0.75, borderRadius: 6 }} />
//                     </div>
//                     <span style={{ fontSize: "12.5px", fontWeight: 600, width: 36, textAlign: "right" }}>{pct(count, impTotal)}%</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── 6. RAW TABLE ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>All Feedback Records</div>
//           <div style={S.card}>
//             <div style={S.cardHd}>
//               <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Voice Survey Responses</h3>
//               <span style={S.badge}>{filtered.length} records</span>
//             </div>

//             {/* Filters */}
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
//               <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Filter:</span>
//               {[{ key: "all", label: "All" }, { key: "prom", label: "Promoters" }, { key: "det", label: "Detractors" }, ...insTypes.map((t) => ({ key: t, label: t.replace(" Insurance", "") }))].map(({ key, label }) => (
//                 <button key={key} onClick={() => setFilter(key)} style={{ padding: "4px 11px", borderRadius: 5, fontSize: 12, fontWeight: filter === key ? 600 : 500, cursor: "pointer", border: "1px solid", borderColor: filter === key ? "#C8102E" : "#E4E6EA", background: filter === key ? "#C8102E" : "#fff", color: filter === key ? "#fff" : "#6B7280", fontFamily: "Inter,sans-serif" }}>{label}</button>
//               ))}
//             </div>

//             {/* Table - ordered columns */}
//             {(() => {
//               const ORDERED_COLS = [
//                 { key: "name",  label: "Name",              find: (r) => r.name },
//                 { key: "phone", label: "Phone Number",       find: (r) => r.phone },
//                 { key: "ins",   label: "Insurance",          find: (r) => r.ins },
//                 { key: "q1",    label: "NPS Score",          find: (r) => r.q1 },
//                 { key: "q2",    label: "Improvement Area",   find: (r) => r.q2 },
//                 { key: "q3",    label: "Policy Clarity",     find: (r) => r.q3 },
//                 { key: "q4",    label: "Resolution Speed",   find: (r) => r.q4 },
//                 { key: "q5",    label: "Fair Treatment",     find: (r) => r.q5 },
//                 { key: "ts",    label: "Timestamp",          find: (r) => r.ts },
//               ];
//               return (
//                 <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
//                   <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", tableLayout: "fixed" }}>
//                     <thead>
//                       <tr>
//                         <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, width: 36 }}>#</th>
//                         {ORDERED_COLS.map((col) => (
//                           <th key={col.key} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.label}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filtered.map((row, i) => (
//                         <tr key={i} onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={(e) => e.currentTarget.style.background = ""}>
//                           <td style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#9CA3AF", fontSize: 11 }}>{i + 1}</td>
//                           {ORDERED_COLS.map((col) => {
//                             const val = col.find(row);
//                             const isNps = col.key === "q1";
//                             const isText = ["q3","q4","q5"].includes(col.key);
//                             return (
//                               <td key={col.key} style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "middle" }}>
//                                 {isNps && !isNaN(Number(val)) && Number(val) > 0 ? <ScoreBox n={Number(val)} /> : isText ? <TxtTag v={String(val ?? "")} /> : val === null || val === undefined || val === "" ? <span style={{ color: "#D1D5DB" }}>—</span> : String(val)}
//                               </td>
//                             );
//                           })}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               );
//             })()}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";
// Chart.register(...registerables);

// const API_URL = "http://localhost:8000/api/records";

// /* ── helpers ── */
// const avg = (a) => (a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0);
// const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
// const TM = {
//   "very satisfied": 9, satisfied: 7, neutral: 5, unsatisfied: 3,
//   "very fair": 9, fair: 7, fairly: 7, unfair: 3,
//   fast: 9, moderate: 6, slow: 3,
// };
// const toN = (v) => TM[(v || "").toLowerCase().trim()] ?? 5;
// const fmtD = (ts) => {
//   const d = new Date(ts);
//   return isNaN(d) ? ts : d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
// };

// /* ── chart hook ── */
// function useChart(ref, config) {
//   const inst = useRef(null);
//   useEffect(() => {
//     if (!ref.current) return;
//     if (inst.current) inst.current.destroy();
//     inst.current = new Chart(ref.current, config);
//     return () => inst.current?.destroy();
//     // eslint-disable-next-line
//   }, [JSON.stringify(config?.data)]);
// }

// /* ── sub-components ── */
// function KpiCard({ icon, label, num, sub, accent, fill }) {
//   return (
//     <div style={S.kpi}>
//       <div style={{ fontSize: 18, marginBottom: 10 }}>{icon}</div>
//       <div style={{ fontSize: "11.5px", fontWeight: 500, color: "#6B7280", marginBottom: 2 }}>{label}</div>
//       <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#C8102E" : "#111827", lineHeight: 1, marginBottom: 4 }}>{num}</div>
//       <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
//       <div style={{ height: 2, background: "#E4E6EA", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
//         <div style={{ height: "100%", width: `${fill}%`, background: "#C8102E", borderRadius: 2 }} />
//       </div>
//     </div>
//   );
// }

// function ScoreBox({ n }) {
//   const cls = n >= 9 ? { bg: "#F0FDF4", color: "#15803D" } : n >= 7 ? { bg: "#FFFBEB", color: "#B45309" } : { bg: "#FDF2F3", color: "#C8102E" };
//   return (
//     <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 5, textAlign: "center", lineHeight: "26px", fontSize: 12, fontWeight: 700, background: cls.bg, color: cls.color }}>{n}</span>
//   );
// }

// function TxtTag({ v }) {
//   const s = (v || "").toLowerCase();
//   let style = { fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500 };
//   if (s.includes("very sat") || s.includes("very fair") || s.includes("fast")) style = { ...style, background: "#F0FDF4", color: "#15803D" };
//   else if (s.includes("sat") || s.includes("fair") || s.includes("mod")) style = { ...style, background: "#F0F9FF", color: "#0369A1" };
//   else if (s.includes("neut")) style = { ...style, background: "#F0F1F3", color: "#6B7280" };
//   else style = { ...style, background: "#FDF2F3", color: "#C8102E" };
//   return <span style={style}>{v}</span>;
// }

// /* ── NPS donut ── */
// function NpsDonut({ prom, pass, det }) {
//   const ref = useRef(null);
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       labels: ["Detractors", "Passives", "Promoters"],
//       datasets: [{ data: [det, pass, prom], backgroundColor: ["#C8102E", "#B45309", "#15803D"], borderWidth: 3, borderColor: "#fff", hoverOffset: 4 }],
//     },
//     options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── histogram ── */
// function Histogram({ data }) {
//   const ref = useRef(null);
//   const dist = Array.from({ length: 11 }, (_, i) => data.filter((d) => d === i).length);
//   const colors = dist.map((_, i) => i <= 6 ? "rgba(200,16,46,0.55)" : i <= 8 ? "rgba(180,83,9,0.45)" : "rgba(21,128,61,0.55)");
//   useChart(ref, {
//     type: "bar",
//     data: { labels: ["0","1","2","3","4","5","6","7","8","9","10"], datasets: [{ data: dist, backgroundColor: colors, borderRadius: 5, borderSkipped: false }] },
//     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } }, y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } } } },
//   });
//   return <canvas ref={ref} />;
// }

// /* ── donut gauge for satisfaction scores ── */
// function DonutGauge({ vals, color }) {
//   const ref = useRef(null);
//   const nums = vals.map(toN);
//   const score = avg(nums);
//   const remaining = 10 - score;
//   useChart(ref, {
//     type: "doughnut",
//     data: {
//       datasets: [{
//         data: [score, remaining],
//         backgroundColor: [color, "#F0F1F3"],
//         borderWidth: 0,
//         hoverOffset: 0,
//       }],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       cutout: "78%",
//       plugins: { legend: { display: false }, tooltip: { enabled: false } },
//       animation: { animateRotate: true, duration: 800 },
//     },
//   });
//   return <canvas ref={ref} />;
// }



// /* ── mini bar chart for distribution ── */
// // Map numeric score back to human-readable labels
// const SCORE_LABELS = {
//   9: ["Very Satisfied", "Very Fast", "Very Fairly", "Extremely Fairly"],
//   7: ["Satisfied", "Fast", "Fairly", "Fair"],
//   6: ["Moderate", "Moderate"],
//   5: ["Neutral"],
//   3: ["Unsatisfied", "Slow", "Unfair"],
// };
// const scoreToLabel = (n) => {
//   const entry = SCORE_LABELS[n];
//   return entry ? entry[0] : `Score ${n}`;
// };

// // Group raw text values and count them
// function BarMini({ vals, color }) {
//   const ref = useRef(null);

//   // Count actual text values
//   const counts = {};
//   vals.forEach((v) => {
//     const k = (v || "Unknown").trim();
//     counts[k] = (counts[k] || 0) + 1;
//   });

//   // Sort by numeric score descending so bars go high→low
//   const scoreOrder = { "very satisfied": 9, "very fast": 9, "extremely fairly": 9,
//     "satisfied": 7, "fast": 7, "fairly": 7, "fair": 7,
//     "moderate": 6, "neutral": 5,
//     "unsatisfied": 3, "slow": 3, "unfair": 3, "not satisfied at all": 1,
//     "very slow": 2, "low": 3 };

//   const entries = Object.entries(counts).sort((a, b) => {
//     return (scoreOrder[b[0].toLowerCase()] ?? 5) - (scoreOrder[a[0].toLowerCase()] ?? 5);
//   });

//   const labels = entries.map(([k]) => k);
//   const data   = entries.map(([, v]) => v);

//   useChart(ref, {
//     type: "bar",
//     data: {
//       labels,
//       datasets: [{ data, backgroundColor: color + "55", borderColor: color, borderWidth: 1, borderRadius: 3, borderSkipped: false }],
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false, indexAxis: "y",
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           callbacks: {
//             title: (items) => items[0].label,
//             label: (c) => ` ${c.raw} response${c.raw !== 1 ? "s" : ""}`,
//           },
//         },
//       },
//       scales: {
//         x: { display: false, grid: { display: false }, border: { display: false }, ticks: { display: false } },
//         y: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#6B7280", font: { size: 9 } } },
//       },
//     },
//   });
//   return <div style={{ height: 110 }}><canvas ref={ref} /></div>;
// }

// /* ── styles ── */
// const S = {
//   kpi: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "16px 18px" },
//   card: { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "18px 20px" },
//   cardHd: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
//   badge: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#F0F1F3", color: "#6B7280" },
//   badgeRed: { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#FDF2F3", color: "#C8102E" },
//   secHd: { fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".7px", color: "#9CA3AF", marginBottom: 12 },
// };

// /* ══════════════════════════════════════════════
//    MAIN APP
// ══════════════════════════════════════════════ */
// export default function App() {
//   const [records, setRecords] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [now, setNow] = useState(new Date());

//   const [refreshing, setRefreshing] = useState(false);

//   const fetchData = (isRefresh = false) => {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);
//     setError(null);

//     fetch(API_URL)
//       .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
//       .then((data) => {
//         let rows = [];
//         if (Array.isArray(data?.records)) rows = data.records;
//         else if (Array.isArray(data?.data?.rows)) rows = data.data.rows;
//         else if (data?.fields && Array.isArray(data?.rows)) {
//           const cols = data.fields.map((f) => f.label || f.column_name || f.name);
//           rows = data.rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
//         } else if (Array.isArray(data)) rows = data;
//         else { setError("Unexpected API format"); setLoading(false); setRefreshing(false); return; }

//         setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
//         setRecords(rows);
//         setNow(new Date());
//         setLoading(false);
//         setRefreshing(false);
//       })
//       .catch((e) => { setError(e.message); setLoading(false); setRefreshing(false); });
//   };

//   useEffect(() => { fetchData(); }, []);

//   /* ── derive fields from whatever columns Zoho returns ── */
//   // Match column by checking if keyword appears inside column name
//   const findCol = (row, ...keywords) => {
//     const colKeys = Object.keys(row);
//     for (const kw of keywords) {
//       const found = colKeys.find((c) => c.toLowerCase().includes(kw.toLowerCase()));
//       if (found && row[found] !== undefined && row[found] !== "") return row[found];
//     }
//     return "";
//   };

//   const rows = records.map((r) => ({
//     raw: r,
//     name:  findCol(r, "name"),
//     phone: findCol(r, "phone", "mobile"),
//     ins:   findCol(r, "purchased"),
//     q1:    Number(findCol(r, "recommend", "likely", "scale of 0")) || 0,
//     q2:    findCol(r, "aspect", "improve"),
//     q3:    findCol(r, "clarity", "policy document"),
//     q4:    findCol(r, "speed", "inquir"),
//     q5:    findCol(r, "fairly", "treated"),
//     ts:    findCol(r, "timestamp"),
//   }));

//   /* ── filter ── */
//   const filtered = rows.filter((r) => {
//     if (filter === "all") return true;
//     if (filter === "prom") return r.q1 >= 9;
//     if (filter === "det") return r.q1 <= 6;
//     return r.ins === filter;
//   });

//   /* ── KPI data ── */
//   const q1vals = rows.map((r) => r.q1).filter(Boolean);
//   const q3vals = rows.map((r) => toN(r.q3));
//   const q4vals = rows.map((r) => toN(r.q4));
//   const q5vals = rows.map((r) => toN(r.q5));
//   const ov = +((avg(q1vals) + avg(q3vals) + avg(q4vals) + avg(q5vals)) / 4).toFixed(1);

//   /* ── NPS ── */
//   const t = rows.length || 1;
//   const prom = rows.filter((r) => r.q1 >= 9).length;
//   const pass = rows.filter((r) => r.q1 >= 7 && r.q1 <= 8).length;
//   const det = rows.filter((r) => r.q1 <= 6).length;
//   const npsScore = Math.round(((prom - det) / t) * 100);

//   /* ── improvement areas ── */
//   const cnt = {};
//   rows.forEach((r) => { const k = (r.q2 || "").trim(); if (k) cnt[k] = (cnt[k] || 0) + 1; });
//   const impAreas = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
//   const impTotal = impAreas.reduce((s, [, c]) => s + c, 0) || 1;

//   /* ── unique insurance types for filter ── */
//   const insTypes = [...new Set(rows.map((r) => r.ins).filter(Boolean))];

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 40, height: 40, border: "3px solid #E4E6EA", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
//         <p style={{ color: "#9CA3AF", marginTop: 16, fontSize: 13 }}>Loading dashboard…</p>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
//       <div style={{ background: "#fff", border: "1px solid #E4E6EA", borderRadius: 12, padding: "32px 36px", maxWidth: 480 }}>
//         <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
//         <h3 style={{ color: "#C8102E", marginBottom: 8 }}>Failed to load</h3>
//         <p style={{ color: "#6B7280", fontSize: 13 }}>{error}</p>
//         <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 12 }}>Make sure FastAPI is running on <code>localhost:8000</code></p>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "Inter,sans-serif", background: "#F5F6F8", color: "#111827", fontSize: 14, minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>

//       {/* ── NAV ── */}
//       <nav style={{ background: "#fff", borderBottom: "1px solid #E4E6EA", height: 58, display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 50 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 12 }}>
//           <div style={{ width: 32, height: 32, background: "#C8102E", borderRadius: 7, display: "grid", placeItems: "center" }}>
//             <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
//           </div>
//           <span style={{ fontSize: "13.5px", fontWeight: 700 }}>Chola MS General Insurance</span>
//         </div>
//         <div style={{ width: 1, height: 20, background: "#E4E6EA" }} />
//         <div style={{ display: "flex", gap: 2 }}>
//           {["Survey Dashboard"].map((t, i) => (
//             <button key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? "#fff" : "#6B7280", background: i === 0 ? "#C8102E" : "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t}</button>
//           ))}
//         </div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontSize: 12, color: "#9CA3AF" }}>{now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
//           <button
//             onClick={() => fetchData(true)}
//             disabled={refreshing}
//             style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: refreshing ? "not-allowed" : "pointer", border: "1px solid #E4E6EA", background: "#fff", color: refreshing ? "#9CA3AF" : "#374151", fontFamily: "Inter,sans-serif", transition: "all .2s" }}
//           >
//             <span style={{ display: "inline-block", animation: refreshing ? "spin .7s linear infinite" : "none" }}>↺</span>
//             {refreshing ? "Refreshing…" : "Refresh"}
//           </button>
//         </div>
//       </nav>

//       <div style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 48px" }}>

//         {/* ── PAGE HEAD ── */}
//         <div style={{ marginBottom: 20 }}>
//           <h1 style={{ fontSize: 17, fontWeight: 700 }}>Customer Experience Dashboard</h1>
//           <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginTop: 3 }}>
//             Voice Survey Analytics &nbsp;·&nbsp; {rows.length} responses collected &nbsp;·&nbsp; Last updated {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
//           </p>
//         </div>

//         {/* ── 1. KPIs ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Overall Summary</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, minWidth: 0 }}>
//             <KpiCard icon="📊" label="Total Responses"    num={rows.length}   sub="Surveys completed"   accent fill={100} />
//             <KpiCard icon="⭐" label="Avg Recommendation" num={avg(q1vals)}   sub="Score out of 10"     accent fill={avg(q1vals)*10} />
//             <KpiCard icon="😊" label="Overall Satisfaction" num={ov}          sub="All questions avg"         fill={ov*10} />
//             <KpiCard icon="📞" label="Resolution Rating"  num={avg(q4vals)}   sub="Speed score /10"           fill={avg(q4vals)*10} />
//             <KpiCard icon="📄" label="Policy Clarity"     num={avg(q3vals)}   sub="Clarity score /10"         fill={avg(q3vals)*10} />
//             <KpiCard icon="🤝" label="Fair Treatment"     num={avg(q5vals)}   sub="Fairness score /10"        fill={avg(q5vals)*10} />
//           </div>
//         </div>

//         {/* ── 2. NPS + HISTOGRAM ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Recommendation Score Analysis</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14 }}>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>NPS Breakdown</h3>
//                 <span style={S.badgeRed}>NPS: {npsScore >= 0 ? "+" : ""}{npsScore}</span>
//               </div>
//               <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
//                 <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
//                   <NpsDonut prom={prom} pass={pass} det={det} />
//                   <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                     <div style={{ fontSize: 30, fontWeight: 700 }}>{npsScore >= 0 ? "+" : ""}{npsScore}</div>
//                     <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>NPS Score</div>
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   {[{ color: "#15803D", label: "Promoters", range: "(9–10)", n: prom }, { color: "#B45309", label: "Passives", range: "(7–8)", n: pass }, { color: "#C8102E", label: "Detractors", range: "(0–6)", n: det }].map((row) => (
//                     <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                       <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
//                       <span style={{ flex: 1, fontSize: "12.5px", color: "#374151" }}>{row.label} <span style={{ color: "#9CA3AF", fontSize: 11 }}>{row.range}</span></span>
//                       <span style={{ fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: "right" }}>{row.n}</span>
//                       <span style={{ fontSize: "11.5px", color: "#9CA3AF", minWidth: 34, textAlign: "right" }}>{pct(row.n, t)}%</span>
//                     </div>
//                   ))}
//                   <div style={{ display: "flex", height: 5, borderRadius: 5, overflow: "hidden", gap: 2, marginTop: 12 }}>
//                     <div style={{ width: `${pct(det, t)}%`, background: "#C8102E", opacity: 0.7 }} />
//                     <div style={{ width: `${pct(pass, t)}%`, background: "#B45309", opacity: 0.5 }} />
//                     <div style={{ width: `${pct(prom, t)}%`, background: "#15803D", opacity: 0.7 }} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={S.card}>
//               <div style={S.cardHd}>
//                 <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Score Distribution</h3>
//                 <span style={S.badge}>Recommendation 0–10</span>
//               </div>
//               <div style={{ position: "relative", height: 210 }}>
//                 <Histogram data={q1vals} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── 3. PER QUESTION ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Satisfaction by Question</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14, minWidth: 0 }}>
//             {[
//               { title: "Policy Document Clarity", vals: rows.map((r) => r.q3), color: "#2563EB" },
//               { title: "Inquiry Resolution Speed", vals: rows.map((r) => r.q4), color: "#16A34A" },
//               { title: "Fairness of Interaction",  vals: rows.map((r) => r.q5), color: "#C8102E" },
//             ].map(({ title, vals, color }) => {
//               const score = avg(vals.map(toN));
//               const scoreColor = score >= 7 ? "#15803D" : score >= 5 ? "#B45309" : "#C8102E";
//               return (
//                 <div key={title} style={S.card}>
//                   <div style={S.cardHd}>
//                     <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>{title}</h3>
//                     <span style={{ ...S.badge, color: scoreColor, background: score >= 7 ? "#F0FDF4" : score >= 5 ? "#FFFBEB" : "#FDF2F3" }}>
//                       Avg {score} / 10
//                     </span>
//                   </div>
//                   {/* Donut + Bar side by side */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
//                     {/* Donut */}
//                     <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
//                       <DonutGauge vals={vals} color={color} />
//                       <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//                         <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{score}</div>
//                         <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1 }}>/ 10</div>
//                         <div style={{ marginTop: 3, fontSize: 9, fontWeight: 600, color: scoreColor }}>
//                           {score >= 7 ? "✓ Good" : score >= 5 ? "~ Avg" : "✗ Low"}
//                         </div>
//                       </div>
//                     </div>
//                     {/* Bar distribution */}
//                     <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
//                       <BarMini vals={vals} color={color} />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── 4. IMPROVEMENT ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>Improvement Areas</div>
//           <div style={S.card}>
//             <div style={S.cardHd}>
//               <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Improvement Area Analysis</h3>
//               <span style={S.badge}>Free Text · Q2</span>
//             </div>
//             {impAreas.length === 0 ? <p style={{ color: "#9CA3AF", fontSize: 13 }}>No data</p> : (
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 32px" }}>
//                 {impAreas.map(([label, count]) => (
//                   <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
//                     <span style={{ fontSize: "12.5px", color: "#374151", minWidth: 140, flexShrink: 0 }}>{label}</span>
//                     <div style={{ flex: 1, height: 6, background: "#F0F1F3", borderRadius: 6, overflow: "hidden" }}>
//                       <div style={{ height: "100%", width: `${pct(count, impTotal)}%`, background: "#C8102E", opacity: 0.75, borderRadius: 6 }} />
//                     </div>
//                     <span style={{ fontSize: "12.5px", fontWeight: 600, width: 36, textAlign: "right" }}>{pct(count, impTotal)}%</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── 6. RAW TABLE ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={S.secHd}>All Feedback Records</div>
//           <div style={S.card}>
//             <div style={S.cardHd}>
//               <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Voice Survey Responses</h3>
//               <span style={S.badge}>{filtered.length} records</span>
//             </div>

//             {/* Filters */}
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
//               <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Filter:</span>
//               {[{ key: "all", label: "All" }, { key: "prom", label: "Promoters" }, { key: "det", label: "Detractors" }, ...insTypes.map((t) => ({ key: t, label: t.replace(" Insurance", "") }))].map(({ key, label }) => (
//                 <button key={key} onClick={() => setFilter(key)} style={{ padding: "4px 11px", borderRadius: 5, fontSize: 12, fontWeight: filter === key ? 600 : 500, cursor: "pointer", border: "1px solid", borderColor: filter === key ? "#C8102E" : "#E4E6EA", background: filter === key ? "#C8102E" : "#fff", color: filter === key ? "#fff" : "#6B7280", fontFamily: "Inter,sans-serif" }}>{label}</button>
//               ))}
//             </div>

//             {/* Table - ordered columns */}
//             {(() => {
//               const ORDERED_COLS = [
//                 { key: "name",  label: "Name",              find: (r) => r.name },
//                 { key: "phone", label: "Phone Number",       find: (r) => r.phone },
//                 { key: "ins",   label: "Insurance",          find: (r) => r.ins },
//                 { key: "q1",    label: "NPS Score",          find: (r) => r.q1 },
//                 { key: "q2",    label: "Improvement Area",   find: (r) => r.q2 },
//                 { key: "q3",    label: "Policy Clarity",     find: (r) => r.q3 },
//                 { key: "q4",    label: "Resolution Speed",   find: (r) => r.q4 },
//                 { key: "q5",    label: "Fair Treatment",     find: (r) => r.q5 },
//                 { key: "ts",    label: "Timestamp",          find: (r) => r.ts },
//               ];
//               return (
//                 <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
//                   <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", tableLayout: "fixed" }}>
//                     <thead>
//                       <tr>
//                         <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, width: 36 }}>#</th>
//                         {ORDERED_COLS.map((col) => (
//                           <th key={col.key} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.label}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filtered.map((row, i) => (
//                         <tr key={i} onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={(e) => e.currentTarget.style.background = ""}>
//                           <td style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#9CA3AF", fontSize: 11 }}>{i + 1}</td>
//                           {ORDERED_COLS.map((col) => {
//                             const val = col.find(row);
//                             const isNps = col.key === "q1";
//                             const isText = ["q3","q4","q5"].includes(col.key);
//                             return (
//                               <td key={col.key} style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "middle" }}>
//                                 {isNps && !isNaN(Number(val)) && Number(val) > 0 ? <ScoreBox n={Number(val)} /> : isText ? <TxtTag v={String(val ?? "")} /> : val === null || val === undefined || val === "" ? <span style={{ color: "#D1D5DB" }}>—</span> : String(val)}
//                               </td>
//                             );
//                           })}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               );
//             })()}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";
Chart.register(...registerables);

const API_URL = "http://localhost:8000/api/records";

/* ── helpers ── */
const avg = (a) => (a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0);
const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
const TM = {
  // Policy Clarity
  "very satisfied": 9,
  "satisfied": 7,
  "neutral": 5,
  "unsatisfied": 3,
  "not satisfied at all": 1,

  // Fair Treatment
  "extremely fairly": 9,
  "very fairly": 9,
  "very fair": 9,
  "fairly": 7,
  "fair": 7,
  "unfair": 3,
  "very unfair": 1,

  // Resolution Speed
  "very fast": 9,
  "fast": 9,
  "moderate": 6,
  "low": 4,
  "slow": 3,
  "very slow": 1,
};
const toN = (v) => TM[(v || "").toLowerCase().trim()] ?? 5;

/* ── chart hook ── */
function useChart(ref, config) {
  const inst = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (inst.current) inst.current.destroy();
    inst.current = new Chart(ref.current, config);
    return () => inst.current?.destroy();
    // eslint-disable-next-line
  }, [JSON.stringify(config?.data)]);
}

/* ── KPI Card ── */
function KpiCard({ icon, label, num, sub, accent, fill }) {
  return (
    <div style={S.kpi}>
      <div style={{ fontSize: 18, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: "11.5px", fontWeight: 500, color: "#6B7280", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#C8102E" : "#111827", lineHeight: 1, marginBottom: 4 }}>{num}</div>
      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
      <div style={{ height: 2, background: "#E4E6EA", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${fill}%`, background: "#C8102E", borderRadius: 2 }} />
      </div>
    </div>
  );
}

/* ── Score Box ── */
function ScoreBox({ n }) {
  const cls = n >= 9 ? { bg: "#F0FDF4", color: "#15803D" } : n >= 7 ? { bg: "#FFFBEB", color: "#B45309" } : { bg: "#FDF2F3", color: "#C8102E" };
  return (
    <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 5, textAlign: "center", lineHeight: "26px", fontSize: 12, fontWeight: 700, background: cls.bg, color: cls.color }}>{n}</span>
  );
}

/* ── Text Tag ── */
function TxtTag({ v }) {
  const s = (v || "").toLowerCase();
  let style = { fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500 };
  if (s.includes("very sat") || s.includes("very fair") || s.includes("extremely") || s.includes("fast"))
    style = { ...style, background: "#F0FDF4", color: "#15803D" };
  else if (s.includes("sat") || s.includes("fair") || s.includes("mod"))
    style = { ...style, background: "#F0F9FF", color: "#0369A1" };
  else if (s.includes("neut"))
    style = { ...style, background: "#F0F1F3", color: "#6B7280" };
  else
    style = { ...style, background: "#FDF2F3", color: "#C8102E" };
  return <span style={style}>{v}</span>;
}

/* ── NPS Donut ── */
function NpsDonut({ prom, pass, det }) {
  const ref = useRef(null);
  useChart(ref, {
    type: "doughnut",
    data: {
      labels: ["Detractors", "Passives", "Promoters"],
      datasets: [{ data: [det, pass, prom], backgroundColor: ["#C8102E", "#B45309", "#15803D"], borderWidth: 3, borderColor: "#fff", hoverOffset: 4 }],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false } } },
  });
  return <canvas ref={ref} />;
}

/* ── Histogram ── */
function Histogram({ data }) {
  const ref = useRef(null);
  const dist = Array.from({ length: 11 }, (_, i) => data.filter((d) => d === i).length);
  const colors = dist.map((_, i) => i <= 6 ? "rgba(200,16,46,0.55)" : i <= 8 ? "rgba(180,83,9,0.45)" : "rgba(21,128,61,0.55)");
  useChart(ref, {
    type: "bar",
    data: { labels: ["0","1","2","3","4","5","6","7","8","9","10"], datasets: [{ data: dist, backgroundColor: colors, borderRadius: 5, borderSkipped: false }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: (items) => `Score: ${items[0].label}`, label: (c) => ` ${c.raw} response${c.raw !== 1 ? "s" : ""}` } } },
      scales: {
        x: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 } } },
        y: { grid: { color: "#F3F4F6" }, border: { color: "transparent" }, ticks: { color: "#9CA3AF", font: { size: 11 }, stepSize: 1 } },
      },
    },
  });
  return <canvas ref={ref} />;
}

/* ── Bar Mini (horizontal, actual text labels) ── */
function BarMini({ vals, color }) {
  const ref = useRef(null);
  const counts = {};
  vals.forEach((v) => { const k = (v || "Unknown").trim(); counts[k] = (counts[k] || 0) + 1; });
  const scoreOrder = {
    "very satisfied": 9, "very fast": 9, "extremely fairly": 9, "very fairly": 9, "very fair": 9,
    "satisfied": 7, "fast": 7, "fairly": 7, "fair": 7,
    "moderate": 6,
    "neutral": 5,
    "low": 4,
    "unsatisfied": 3, "slow": 3, "unfair": 3,
    "very slow": 1, "very unfair": 1, "not satisfied at all": 1,
  };
  const entries = Object.entries(counts).sort((a, b) =>
    (scoreOrder[b[0].toLowerCase()] ?? 5) - (scoreOrder[a[0].toLowerCase()] ?? 5)
  );
  const labels = entries.map(([k]) => k);
  const data = entries.map(([, v]) => v);
  useChart(ref, {
    type: "bar",
    data: { labels, datasets: [{ data, backgroundColor: color + "55", borderColor: color, borderWidth: 1, borderRadius: 3, borderSkipped: false }] },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: "y",
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: (items) => items[0].label, label: (c) => ` ${c.raw} response${c.raw !== 1 ? "s" : ""}` } } },
      scales: {
        x: { display: false, grid: { display: false }, border: { display: false }, ticks: { display: false } },
        y: { grid: { display: false }, border: { color: "transparent" }, ticks: { color: "#6B7280", font: { size: 9 } } },
      },
    },
  });
  return <div style={{ height: 110 }}><canvas ref={ref} /></div>;
}

/* ── Styles ── */
const S = {
  kpi:     { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "16px 18px" },
  card:    { background: "#fff", border: "1px solid #E4E6EA", borderRadius: 10, padding: "18px 20px" },
  cardHd:  { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  badge:   { fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#F0F1F3", color: "#6B7280" },
  badgeRed:{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#FDF2F3", color: "#C8102E" },
  secHd:   { fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".7px", color: "#9CA3AF", marginBottom: 12 },
};

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [records, setRecords] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    fetch(API_URL)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        let rows = [];
        if (Array.isArray(data?.records)) rows = data.records;
        else if (Array.isArray(data?.data?.rows)) rows = data.data.rows;
        else if (data?.fields && Array.isArray(data?.rows)) {
          const cols = data.fields.map((f) => f.label || f.column_name || f.name);
          rows = data.rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
        } else if (Array.isArray(data)) rows = data;
        else { setError("Unexpected API format"); setLoading(false); setRefreshing(false); return; }
        setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
        setRecords(rows);
        setNow(new Date());
        setLoading(false);
        setRefreshing(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const findCol = (row, ...keywords) => {
    const colKeys = Object.keys(row);
    for (const kw of keywords) {
      const found = colKeys.find((c) => c.toLowerCase().includes(kw.toLowerCase()));
      if (found && row[found] !== undefined && row[found] !== "") return row[found];
    }
    return "";
  };

  const rows = records.map((r) => ({
    raw: r,
    name:  findCol(r, "name"),
    phone: findCol(r, "phone", "mobile"),
    ins:   findCol(r, "purchased"),
    q1:    Number(findCol(r, "recommend", "likely", "scale of 0")) || 0,
    q2:    findCol(r, "aspect", "improve"),
    q3:    findCol(r, "clarity", "policy document"),
    q4:    findCol(r, "speed", "inquir"),
    q5:    findCol(r, "fairly", "treated"),
    ts:    findCol(r, "timestamp"),
  }));

  const filtered = rows.filter((r) => {
    if (filter === "all") return true;
    if (filter === "prom") return r.q1 >= 9;
    if (filter === "det") return r.q1 <= 6;
    return r.ins === filter;
  });

  const q1vals = rows.map((r) => r.q1).filter(Boolean);
  const q3vals = rows.map((r) => toN(r.q3));
  const q4vals = rows.map((r) => toN(r.q4));
  const q5vals = rows.map((r) => toN(r.q5));
  const ov = +((avg(q1vals) + avg(q3vals) + avg(q4vals) + avg(q5vals)) / 4).toFixed(1);

  const t = rows.length || 1;
  const prom = rows.filter((r) => r.q1 >= 9).length;
  const pass = rows.filter((r) => r.q1 >= 7 && r.q1 <= 8).length;
  const det  = rows.filter((r) => r.q1 <= 6).length;
  const npsScore = Math.round(((prom - det) / t) * 100);

  const cnt = {};
  rows.forEach((r) => { const k = (r.q2 || "").trim(); if (k) cnt[k] = (cnt[k] || 0) + 1; });
  const impAreas = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const impTotal = impAreas.reduce((s, [, c]) => s + c, 0) || 1;

  const insTypes = [...new Set(rows.map((r) => r.ins).filter(Boolean))];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E4E6EA", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
        <p style={{ color: "#9CA3AF", marginTop: 16, fontSize: 13 }}>Loading dashboard…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F6F8", fontFamily: "Inter,sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid #E4E6EA", borderRadius: 12, padding: "32px 36px", maxWidth: 480 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <h3 style={{ color: "#C8102E", marginBottom: 8 }}>Failed to load</h3>
        <p style={{ color: "#6B7280", fontSize: 13 }}>{error}</p>
        <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 12 }}>Make sure FastAPI is running on <code>localhost:8000</code></p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Inter,sans-serif", background: "#F5F6F8", color: "#111827", fontSize: 14, minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E4E6EA", height: 58, display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 12 }}>
          <div style={{ width: 32, height: 32, background: "#C8102E", borderRadius: 7, display: "grid", placeItems: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          </div>
          <span style={{ fontSize: "13.5px", fontWeight: 700 }}>Chola MS General Insurance</span>
        </div>
        <div style={{ width: 1, height: 20, background: "#E4E6EA" }} />
        <button style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "#C8102E", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
          Survey Dashboard
        </button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: refreshing ? "not-allowed" : "pointer", border: "1px solid #E4E6EA", background: "#fff", color: refreshing ? "#9CA3AF" : "#374151", fontFamily: "Inter,sans-serif", transition: "all .2s" }}
          >
            <span style={{ display: "inline-block", animation: refreshing ? "spin .7s linear infinite" : "none" }}>↺</span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "22px 28px 48px" }}>

        {/* PAGE HEAD */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700 }}>Customer Experience Dashboard</h1>
          <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginTop: 3 }}>
            Voice Survey Analytics &nbsp;·&nbsp; {rows.length} responses collected &nbsp;·&nbsp; Last updated {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* 1. KPIs */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.secHd}>Overall Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, minWidth: 0 }}>
            <KpiCard icon="📊" label="Total Responses"      num={rows.length}  sub="Surveys completed"  accent fill={100} />
            <KpiCard icon="⭐" label="Avg Recommendation"   num={avg(q1vals)}  sub="Score out of 10"    accent fill={avg(q1vals) * 10} />
            <KpiCard icon="😊" label="Overall Satisfaction" num={ov}           sub="All questions avg"        fill={ov * 10} />
            <KpiCard icon="📞" label="Resolution Rating"    num={avg(q4vals)}  sub="Speed score /10"          fill={avg(q4vals) * 10} />
            <KpiCard icon="📄" label="Policy Clarity"       num={avg(q3vals)}  sub="Clarity score /10"        fill={avg(q3vals) * 10} />
            <KpiCard icon="🤝" label="Fair Treatment"       num={avg(q5vals)}  sub="Fairness score /10"       fill={avg(q5vals) * 10} />
          </div>
        </div>

        {/* 2. NPS + HISTOGRAM */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.secHd}>Recommendation Score Analysis</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14 }}>
            <div style={S.card}>
              <div style={S.cardHd}>
                <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>NPS Breakdown</h3>
                <span style={S.badgeRed}>NPS: {npsScore >= 0 ? "+" : ""}{npsScore}</span>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
                  <NpsDonut prom={prom} pass={pass} det={det} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ fontSize: 30, fontWeight: 700 }}>{npsScore >= 0 ? "+" : ""}{npsScore}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>NPS Score</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[{ color: "#15803D", label: "Promoters", range: "(9–10)", n: prom },
                    { color: "#B45309", label: "Passives",  range: "(7–8)",  n: pass },
                    { color: "#C8102E", label: "Detractors",range: "(0–6)",  n: det  }].map((row) => (
                    <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: "12.5px", color: "#374151" }}>{row.label} <span style={{ color: "#9CA3AF", fontSize: 11 }}>{row.range}</span></span>
                      <span style={{ fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: "right" }}>{row.n}</span>
                      <span style={{ fontSize: "11.5px", color: "#9CA3AF", minWidth: 34, textAlign: "right" }}>{pct(row.n, t)}%</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", height: 5, borderRadius: 5, overflow: "hidden", gap: 2, marginTop: 12 }}>
                    <div style={{ width: `${pct(det,  t)}%`, background: "#C8102E", opacity: 0.7 }} />
                    <div style={{ width: `${pct(pass, t)}%`, background: "#B45309", opacity: 0.5 }} />
                    <div style={{ width: `${pct(prom, t)}%`, background: "#15803D", opacity: 0.7 }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardHd}>
                <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Score Distribution</h3>
                <span style={S.badge}>Recommendation 0–10</span>
              </div>
              <div style={{ position: "relative", height: 210 }}>
                <Histogram data={q1vals} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. SATISFACTION BY QUESTION */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.secHd}>Satisfaction by Question</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14, minWidth: 0 }}>
            {[
              { title: "Policy Document Clarity", vals: rows.map((r) => r.q3), color: "#2563EB" },
              { title: "Inquiry Resolution Speed", vals: rows.map((r) => r.q4), color: "#16A34A" },
              { title: "Fairness of Interaction",  vals: rows.map((r) => r.q5), color: "#C8102E" },
            ].map(({ title, vals, color }) => {
              const score = avg(vals.map(toN));
              const scoreColor = score >= 7 ? "#15803D" : score >= 5 ? "#B45309" : "#C8102E";
              return (
                <div key={title} style={S.card}>
                  <div style={S.cardHd}>
                    <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>{title}</h3>
                    <span style={{ ...S.badge, color: scoreColor, background: score >= 7 ? "#F0FDF4" : score >= 5 ? "#FFFBEB" : "#FDF2F3" }}>
                      Avg {score} / 10
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                    <div style={{ flexShrink: 0, textAlign: "center", background: score >= 7 ? "#F0FDF4" : score >= 5 ? "#FFFBEB" : "#FDF2F3", borderRadius: 12, padding: "12px 16px", minWidth: 72 }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{score}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>/ 10</div>
                      <div style={{ marginTop: 5, fontSize: 10, fontWeight: 600, color: scoreColor }}>
                        {score >= 7 ? "✓ Good" : score >= 5 ? "~ Avg" : "✗ Low"}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                      <BarMini vals={vals} color={color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. IMPROVEMENT AREAS */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.secHd}>Improvement Areas</div>
          <div style={S.card}>
            <div style={S.cardHd}>
              <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Improvement Area Analysis</h3>
              <span style={S.badge}>Free Text · Q2</span>
            </div>
            {impAreas.length === 0
              ? <p style={{ color: "#9CA3AF", fontSize: 13 }}>No data</p>
              : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 32px" }}>
                  {impAreas.map(([label, count]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F0F1F3" }}>
                      <span style={{ fontSize: "12.5px", color: "#374151", minWidth: 140, flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, height: 6, background: "#F0F1F3", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct(count, impTotal)}%`, background: "#C8102E", opacity: 0.75, borderRadius: 6 }} />
                      </div>
                      <span style={{ fontSize: "12.5px", fontWeight: 600, width: 36, textAlign: "right" }}>{pct(count, impTotal)}%</span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* 5. RAW TABLE */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.secHd}>All Feedback Records</div>
          <div style={S.card}>
            <div style={S.cardHd}>
              <h3 style={{ fontSize: "13.5px", fontWeight: 600 }}>Voice Survey Responses</h3>
              <span style={S.badge}>{filtered.length} records</span>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Filter:</span>
              {[{ key: "all", label: "All" }, { key: "prom", label: "Promoters" }, { key: "det", label: "Detractors" },
                ...insTypes.map((ins) => ({ key: ins, label: ins.replace(" Insurance", "") }))
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)} style={{ padding: "4px 11px", borderRadius: 5, fontSize: 12, fontWeight: filter === key ? 600 : 500, cursor: "pointer", border: "1px solid", borderColor: filter === key ? "#C8102E" : "#E4E6EA", background: filter === key ? "#C8102E" : "#fff", color: filter === key ? "#fff" : "#6B7280", fontFamily: "Inter,sans-serif" }}>{label}</button>
              ))}
            </div>

            {/* Table */}
            {(() => {
              const COLS = [
                { key: "name",  label: "Name",             find: (r) => r.name  },
                { key: "phone", label: "Phone Number",      find: (r) => r.phone },
                { key: "ins",   label: "Insurance",         find: (r) => r.ins   },
                { key: "q1",    label: "NPS Score",         find: (r) => r.q1    },
                { key: "q2",    label: "Improvement Area",  find: (r) => r.q2    },
                { key: "q3",    label: "Policy Clarity",    find: (r) => r.q3    },
                { key: "q4",    label: "Resolution Speed",  find: (r) => r.q4    },
                { key: "q5",    label: "Fair Treatment",    find: (r) => r.q5    },
                { key: "ts",    label: "Timestamp",         find: (r) => r.ts    },
              ];
              return (
                <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", tableLayout: "fixed" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, width: 36 }}>#</th>
                        {COLS.map((col) => (
                          <th key={col.key} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "#9CA3AF", fontWeight: 600, background: "#F0F1F3", borderBottom: "1px solid #E4E6EA", position: "sticky", top: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row, i) => (
                        <tr key={i} onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                          <td style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#9CA3AF", fontSize: 11 }}>{i + 1}</td>
                          {COLS.map((col) => {
                            const val = col.find(row);
                            const isNps  = col.key === "q1";
                            const isText = ["q3", "q4", "q5"].includes(col.key);
                            return (
                              <td key={col.key} style={{ padding: "9px 12px", borderBottom: "1px solid #F0F1F3", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                                {isNps && !isNaN(Number(val)) && Number(val) > 0
                                  ? <ScoreBox n={Number(val)} />
                                  : isText
                                  ? <TxtTag v={String(val ?? "")} />
                                  : val === null || val === undefined || val === ""
                                  ? <span style={{ color: "#D1D5DB" }}>—</span>
                                  : String(val)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  );
}