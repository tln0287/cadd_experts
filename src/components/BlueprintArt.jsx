import { useId, useMemo } from 'react'

/**
 * Generated technical drawings used as artwork wherever a photograph
 * is not yet supplied (gallery, facilities, projects, low-end fallback).
 */
function gearPath(cx, cy, teeth, r1, r2) {
  const pts = []
  const step = (Math.PI * 2) / teeth
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    ;[[r1, 0], [r2, 0.2], [r2, 0.45], [r1, 0.65]].forEach(([r, f]) => {
      pts.push(`${(cx + Math.cos(a + step * f) * r).toFixed(1)},${(cy + Math.sin(a + step * f) * r).toFixed(1)}`)
    })
  }
  return `M${pts.join('L')}Z`
}

function Dim({ x1, y1, x2, y2, label, off = 14, vertical }) {
  if (vertical) {
    const x = x1 - off
    return (
      <g className="bp-dim">
        <path d={`M${x1 - 4} ${y1}H${x - 4}M${x1 - 4} ${y2}H${x - 4}M${x} ${y1}V${y2}M${x - 3} ${y1 + 3}l6 -6M${x - 3} ${y2 + 3}l6 -6`} />
        <text x={x - 6} y={(y1 + y2) / 2} transform={`rotate(-90 ${x - 6} ${(y1 + y2) / 2})`} textAnchor="middle">{label}</text>
      </g>
    )
  }
  const y = y1 + off
  return (
    <g className="bp-dim">
      <path d={`M${x1} ${y1 + 4}V${y + 4}M${x2} ${y1 + 4}V${y + 4}M${x1} ${y}H${x2}M${x1 - 3} ${y + 3}l6 -6M${x2 - 3} ${y + 3}l6 -6`} />
      <text x={(x1 + x2) / 2} y={y - 4} textAnchor="middle">{label}</text>
    </g>
  )
}

const DRAW = {
  building: () => (
    <>
      <path className="bp-ln2" d="M30 250H370" />
      <path className="bp-ln" pathLength="1" d="M120 250V70H280V250M112 70H288V62H112Z" />
      {[100, 130, 160, 190, 220].map((y) => <path key={y} className="bp-ln2" d={`M120 ${y}H280`} />)}
      {[0, 1, 2, 3, 4, 5].map((r) => [0, 1, 2, 3].map((c) => (
        <rect key={`${r}${c}`} className="bp-ln" pathLength="1" x={130 + c * 38} y={76 + r * 30} width="26" height="18" />
      )))}
      <path className="bp-acc" pathLength="1" d="M186 250V226H214V250" />
      <Dim x1={120} y1={250} x2={280} y2={250} label="24 000" off={18} />
      <Dim x1={120} y1={62} x2={120} y2={250} label="18 600" off={22} vertical />
    </>
  ),
  plan: () => (
    <>
      <path className="bp-ln" pathLength="1" d="M60 50H340V240H60Z" strokeWidth="3" />
      <path className="bp-ln" pathLength="1" d="M170 50V150M170 180V240M60 140H130M240 50V110M240 140V240M240 140H340" />
      <path className="bp-ln2" pathLength="1" d="M130 140A30 30 0 0 1 160 170M170 150A30 30 0 0 1 200 180M240 110A30 30 0 0 1 270 140" />
      <text className="bp-txt" x="110" y="100" textAnchor="middle">BED 01</text>
      <text className="bp-txt" x="205" y="100" textAnchor="middle">LIVING</text>
      <text className="bp-txt" x="290" y="200" textAnchor="middle">KITCHEN</text>
      <text className="bp-txt" x="110" y="200" textAnchor="middle">BED 02</text>
      <path className="bp-acc" d="M200 270V20M30 145H370" strokeDasharray="10 4 2 4" />
      <Dim x1={60} y1={240} x2={340} y2={240} label="14 000" off={20} />
    </>
  ),
  gear: () => (
    <>
      <path className="bp-acc" d="M200 20V280M60 150H340" strokeDasharray="10 4 2 4" />
      <path className="bp-ln" pathLength="1" d={gearPath(200, 150, 28, 96, 110)} />
      <circle className="bp-ln2" cx="200" cy="150" r="103" strokeDasharray="4 3" />
      <circle className="bp-ln" pathLength="1" cx="200" cy="150" r="30" />
      <path className="bp-ln" d="M193 120V112H207V120" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        return <circle key={i} className="bp-ln2" cx={200 + Math.cos(a) * 62} cy={150 + Math.sin(a) * 62} r="14" />
      })}
      <Dim x1={90} y1={262} x2={310} y2={262} label="Ø 220 · Z 28 · m 4" off={0} />
    </>
  ),
  bridge: () => (
    <>
      <path className="bp-ln" pathLength="1" d="M20 120H380M20 132H380" />
      <path className="bp-ln" pathLength="1" d="M40 132Q120 40 200 132Q280 40 360 132" />
      {[60, 80, 100, 120, 140, 160, 180, 220, 240, 260, 280, 300, 320, 340].map((x) => {
        const t = ((x - 40) % 160) / 160
        const y = 132 - 92 * 4 * t * (1 - t) * 0.92
        return <path key={x} className="bp-ln2" d={`M${x} 120V${y.toFixed(0)}`} />
      })}
      <path className="bp-ln" pathLength="1" d="M190 132V230H210V132M30 132V230M370 132V230" />
      <path className="bp-acc" d="M20 210Q50 200 80 210T140 210T200 210T260 210T320 210T380 210" strokeDasharray="6 4" />
      <Dim x1={40} y1={240} x2={200} y2={240} label="SPAN 40 000" off={12} />
      <Dim x1={200} y1={240} x2={360} y2={240} label="SPAN 40 000" off={12} />
    </>
  ),
  section: () => (
    <>
      <path className="bp-ln" pathLength="1" d="M120 60H280V80H210V220H280V240H120V220H190V80H120Z" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} className="bp-hatch" d={`M${122 + i * 12} 78l16 -16`} />)}
      <path className="bp-acc" d="M200 40V260M100 150H300" strokeDasharray="10 4 2 4" />
      <Dim x1={120} y1={240} x2={280} y2={240} label="b = 160" off={20} />
      <Dim x1={120} y1={60} x2={120} y2={240} label="h = 180" off={20} vertical />
      <text className="bp-txt" x="300" y="150">tw = 20</text>
      <text className="bp-txt" x="300" y="72">tf = 20</text>
    </>
  ),
  iso: () => (
    <>
      <path className="bp-ln" pathLength="1" d="M200 60L310 120V210L200 270L90 210V120Z" />
      <path className="bp-ln" pathLength="1" d="M90 120L200 180L310 120M200 180V270" />
      <path className="bp-ln2" d="M200 60V150L90 210M200 150L310 210" strokeDasharray="6 4" />
      <path className="bp-acc" pathLength="1" d="M200 120L255 150V195L200 225L145 195V150Z" />
      <path className="bp-ln2" d="M60 270L200 190M200 190L340 270M200 190V20" strokeDasharray="2 4" />
      <text className="bp-txt" x="340" y="268">X</text>
      <text className="bp-txt" x="52" y="268">Z</text>
      <text className="bp-txt" x="206" y="26">Y</text>
    </>
  ),
  piston: () => (
    <>
      <path className="bp-ln" pathLength="1" d="M150 40H250V130H150Z" />
      <path className="bp-ln2" d="M150 56H250M150 66H250M150 76H250" />
      <circle className="bp-ln" pathLength="1" cx="200" cy="105" r="12" />
      <path className="bp-ln" pathLength="1" d="M190 112L178 222M210 112L222 222" />
      <circle className="bp-ln" pathLength="1" cx="200" cy="232" r="34" />
      <circle className="bp-acc" cx="200" cy="232" r="14" />
      <path className="bp-acc" d="M200 20V280" strokeDasharray="10 4 2 4" />
      <Dim x1={150} y1={40} x2={250} y2={40} label="Ø 100 BORE" off={-16} />
      <Dim x1={150} y1={105} x2={150} y2={232} label="L 127" off={30} vertical />
    </>
  ),
  truss: () => (
    <>
      <path className="bp-ln" pathLength="1" d="M30 200H370L200 70Z" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const x = 30 + (i + 1) * (340 / 8)
        const yTop = x < 200 ? 200 - ((x - 30) / 170) * 130 : 200 - ((370 - x) / 170) * 130
        const nx = 30 + (i + 2) * (340 / 8)
        return (
          <g key={i}>
            <path className="bp-ln2" d={`M${x} 200V${yTop.toFixed(0)}`} />
            {x < 200 ? <path className="bp-ln2" d={`M${x} ${yTop.toFixed(0)}L${nx} 200`} /> : <path className="bp-ln2" d={`M${x} ${yTop.toFixed(0)}L${x - 340 / 8} 200`} />}
          </g>
        )
      })}
      {[30, 370].map((x) => <path key={x} className="bp-acc" d={`M${x} 200l-10 16h20z`} />)}
      {[80, 140, 200, 260, 320].map((x) => <path key={x} className="bp-acc" d={`M${x} 30V${x === 200 ? 60 : 80}M${x - 5} ${x === 200 ? 52 : 72}l5 8 5 -8`} />)}
      <Dim x1={30} y1={220} x2={370} y2={220} label="SPAN 18 000" off={14} />
    </>
  ),
}

export default function BlueprintArt({ variant = 'building', title, animate = true, className = '' }) {
  const id = useId().replace(/:/g, '')
  const Body = DRAW[variant] || DRAW.building
  const sheet = useMemo(() => `${variant.slice(0, 3).toUpperCase()}-${(variant.length * 37) % 900 + 100}`, [variant])
  return (
    <svg className={`bp-art ${animate ? 'is-animated' : ''} ${className}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title || `${variant} technical drawing`}>
      <defs>
        <pattern id={`g${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" className="bp-grid" />
        </pattern>
      </defs>
      <rect width="400" height="300" className="bp-bg" />
      <rect width="400" height="300" fill={`url(#g${id})`} />
      <rect x="8" y="8" width="384" height="284" className="bp-frame" />
      <Body />
      <g className="bp-title">
        <rect x="272" y="266" width="120" height="26" />
        <text x="278" y="277">{(title || variant).toUpperCase().slice(0, 22)}</text>
        <text x="278" y="288">CADD-EXPERTS · {sheet}</text>
      </g>
    </svg>
  )
}
