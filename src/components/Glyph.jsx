/** Engineering line icons (48×48, stroke = currentColor). */
const P = {
  plan: <><rect x="6" y="8" width="36" height="32" /><path d="M6 24h14v16M20 8v10M28 24h14M28 24v8" /><path d="M20 18a6 6 0 0 1 6 6" strokeDasharray="2 2" /></>,
  building: <><path d="M10 42V14l14-8 14 8v28" /><path d="M10 42h28M17 18h4M27 18h4M17 26h4M27 26h4M17 34h4M27 34h4" /><path d="M24 6v36" strokeDasharray="2 3" /></>,
  frame: <><path d="M8 42V10M24 42V10M40 42V10M8 10h32M8 22h32M8 34h32" /><path d="M8 22l16 12M24 22l16 12" strokeDasharray="2 2" /></>,
  road: <><path d="M14 44L20 4M34 44L28 4" /><path d="M24 8v6M24 20v6M24 32v6" /><path d="M4 30c10-4 30-4 40 0" strokeDasharray="2 2" /></>,
  truss: <><path d="M4 36h40L24 14z" /><path d="M14 36l5-16M24 36V14M34 36l-5-16M14 36l10-22M34 36L24 14" /></>,
  tower: <><path d="M16 44V6h16v38M12 44h24" /><path d="M16 14h16M16 22h16M16 30h16M16 38h16M24 6v38" /></>,
  iso: <><path d="M24 6l16 9v18l-16 9-16-9V15z" /><path d="M8 15l16 9 16-9M24 24v18" /><path d="M16 10.5l16 9" strokeDasharray="2 2" /></>,
  clash: <><rect x="6" y="14" width="22" height="22" /><rect x="20" y="8" width="22" height="22" /><path d="M20 14h8v16h-8z" fill="currentColor" fillOpacity=".25" /></>,
  layers: <><path d="M24 6l18 9-18 9-18-9z" /><path d="M6 24l18 9 18-9M6 33l18 9 18-9" /></>,
  calc: <><rect x="10" y="4" width="28" height="40" rx="2" /><rect x="15" y="9" width="18" height="8" /><path d="M16 24h4M28 24h4M16 31h4M28 31h4M16 38h4M28 38h4" /></>,
  beam: <><path d="M8 12h32M8 36h32M24 12v24" /><path d="M8 12v4h12M40 12v4H28M8 36v-4h12M40 36v-4H28" /><path d="M4 24h6M38 24h6" strokeDasharray="2 2" /></>,
  gantt: <><path d="M6 6v36h36" /><path d="M12 12h14M18 20h16M14 28h10M24 36h14" strokeWidth="3" /></>,
  gear: <><circle cx="24" cy="24" r="7" /><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4" /><circle cx="24" cy="24" r="14" /></>,
  car: <><path d="M4 32v-6l6-2 6-8h16l8 8 4 2v6z" /><circle cx="14" cy="33" r="4" /><circle cx="34" cy="33" r="4" /><path d="M18 18v6M30 18l4 6" /></>,
  bracket: <><path d="M8 40V8h10v22h22v10z" /><circle cx="13" cy="14" r="2" /><circle cx="34" cy="35" r="2" /><path d="M18 30l-6 6" strokeDasharray="2 2" /></>,
  shaft: <><path d="M4 20h10v8H4zM14 17h20v14H14zM34 21h10v6H34z" /><path d="M2 24h44" strokeDasharray="4 2 1 2" /></>,
  turbine: <><circle cx="24" cy="24" r="4" /><path d="M24 20c0-10 8-14 12-12-2 6-6 10-12 12zM28 24c10 0 14 8 12 12-6-2-10-6-12-12zM24 28c0 10-8 14-12 12 2-6 6-10 12-12zM20 24c-10 0-14-8-12-12 6 2 10 6 12 12z" /></>,
  mesh: <><path d="M6 40L24 6l18 34z" /><path d="M15 23h18M10 32h28M24 6l-9 17 9 17 9-17zM15 23l-5 9M33 23l5 9" /></>,
  tolerance: <><rect x="4" y="16" width="40" height="16" /><path d="M14 16v16M26 16v16" /><circle cx="9" cy="24" r="3" /><path d="M18 24h4M30 22h10M30 26h6" /></>,
  product: <><rect x="12" y="4" width="24" height="40" rx="6" /><circle cx="24" cy="36" r="3" /><path d="M16 10h16v20H16z" /></>,
  gearbox: <><rect x="6" y="10" width="36" height="28" rx="2" /><circle cx="18" cy="24" r="6" /><circle cx="31" cy="24" r="8" /><path d="M2 24h10M40 24h6" /></>,
  cnc: <><path d="M10 6h28v8H10zM22 14v12l2 4 2-4V14" /><path d="M6 42h36M10 36h28v6H10z" /><path d="M24 30v4" strokeDasharray="1 2" /></>,
  industry: <><path d="M4 42V22l10 6v-6l10 6v-6l10 6V8h8v34z" /><path d="M10 36h4M20 36h4M30 36h4" /></>,
  project: <><rect x="6" y="8" width="36" height="30" /><path d="M6 32l10-10 8 8 6-6 12 12" /><circle cx="32" cy="16" r="3" /></>,
  software: <><rect x="4" y="8" width="40" height="26" rx="2" /><path d="M16 42h16M24 34v8" /><path d="M14 26l6-10 4 6 4-4 6 8" /></>,
  mentor: <><circle cx="18" cy="14" r="6" /><path d="M6 40c0-8 6-14 12-14s12 6 12 14" /><path d="M32 12h12v10h-6l-4 4v-4h-2z" /></>,
  hands: <><path d="M10 26V12a3 3 0 0 1 6 0v10M16 20V8a3 3 0 0 1 6 0v12M22 20V10a3 3 0 0 1 6 0v12M28 22v-6a3 3 0 0 1 6 0v12c0 8-5 14-12 14s-12-6-12-12" /></>,
  career: <><path d="M6 40l10-12 8 6 18-22" /><path d="M32 12h10v10" /><path d="M6 44h36" /></>,
}

export default function Glyph({ name, size = 40, className = '' }) {
  return (
    <svg className={`glyph ${className}`} width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] || P.iso}
    </svg>
  )
}
