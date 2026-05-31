import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, CheckCircle2, BookOpen, GitBranch, Loader2 } from 'lucide-react'

const LS = {
  landing:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.13)',  border: 'rgba(59,130,246,0.55)',  label: 'Landing'   },
  bronze:    { color: '#b45309', bg: 'rgba(180,83,9,0.13)',    border: 'rgba(180,83,9,0.55)',    label: 'Bronze'    },
  silver:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.13)', border: 'rgba(148,163,184,0.55)', label: 'Silver'    },
  gold:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.13)',  border: 'rgba(245,158,11,0.55)',  label: 'Gold'      },
  export:    { color: '#10b981', bg: 'rgba(16,185,129,0.13)',  border: 'rgba(16,185,129,0.55)',  label: 'Export'    },
  condition: { color: '#a855f7', bg: 'rgba(168,85,247,0.13)',  border: 'rgba(168,85,247,0.55)',  label: 'Gate'      },
}

const NODES = [
  { id: 'ingest_lookup',  short: 'ingest_lookup',         full: '00_ingest_lookup',            type: 'notebook',  layer: 'landing',   cx: 20, cy: 7  },
  { id: 'ingest_trips',   short: 'ingest_yellow_trips',   full: '00_ingest_yellow_trips',      type: 'notebook',  layer: 'landing',   cx: 72, cy: 7  },
  { id: 'cond_lookup',    short: 'continue? (lookup)',     full: 'continue_downstream_lookup',  type: 'condition', layer: 'condition', cx: 20, cy: 24 },
  { id: 'cond_trips',     short: 'continue? (trips)',      full: 'continue_downstream_trips',   type: 'condition', layer: 'condition', cx: 72, cy: 24 },
  { id: 'zone_lookup',    short: 'taxi_zone_lookup',       full: '02_taxi_zone_lookup',         type: 'notebook',  layer: 'silver',    cx: 20, cy: 43 },
  { id: 'raw',            short: 'yellow_trips_raw',       full: '01_yellow_trips_raw',         type: 'notebook',  layer: 'bronze',    cx: 72, cy: 43 },
  { id: 'cleansed',       short: 'yellow_trips_cleansed',  full: '02_yellow_trips_cleansed',    type: 'notebook',  layer: 'silver',    cx: 72, cy: 61 },
  { id: 'enriched',       short: 'yellow_trips_enriched',  full: '02_yellow_trips_enriched',    type: 'notebook',  layer: 'silver',    cx: 46, cy: 77 },
  { id: 'summary',        short: 'daily_trips_summary',    full: '03_daily_trips_summary',      type: 'notebook',  layer: 'gold',      cx: 20, cy: 93 },
  { id: 'export',         short: 'yellow_trips_export',    full: '04_yellow_trips_export',      type: 'notebook',  layer: 'export',    cx: 72, cy: 93 },
]

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]))

const EDGES = [
  { from: 'ingest_lookup', to: 'cond_lookup'                             },
  { from: 'ingest_trips',  to: 'cond_trips'                              },
  { from: 'cond_lookup',   to: 'zone_lookup', label: '= yes'             },
  { from: 'cond_trips',    to: 'raw',         label: '= yes'             },
  { from: 'zone_lookup',   to: 'enriched'                                },
  { from: 'raw',           to: 'cleansed'                                },
  { from: 'cleansed',      to: 'enriched',    note: 'AT_LEAST_ONE_SUCCESS' },
  { from: 'enriched',      to: 'summary'                                 },
  { from: 'enriched',      to: 'export'                                  },
]

// Execution order follows real Databricks job parallelism
const BATCHES = [
  { ids: ['ingest_lookup', 'ingest_trips'], ms: 2200 },
  { ids: ['cond_lookup',   'cond_trips'],   ms: 1000 },
  { ids: ['zone_lookup',   'raw'],          ms: 2500 },
  { ids: ['cleansed'],                      ms: 2800 },
  { ids: ['enriched'],                      ms: 2800 },
  { ids: ['summary',       'export'],       ms: 2000 },
]

// Cubic bezier: bottom of source → top of target
const getPath = (f, t) => {
  const x1 = f.cx, y1 = f.cy + 4.8
  const x2 = t.cx, y2 = t.cy - 4.8
  const my = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`
}

export default function PipelineSection() {
  const [activeSet, setActiveSet] = useState(new Set())
  const [doneSet,   setDoneSet]   = useState(new Set())
  const [running,   setRunning]   = useState(false)

  const runAnimation = async () => {
    setRunning(true)
    setActiveSet(new Set())
    setDoneSet(new Set())
    for (const batch of BATCHES) {
      setActiveSet(new Set(batch.ids))
      await new Promise(r => setTimeout(r, batch.ms))
      setDoneSet(prev => new Set([...prev, ...batch.ids]))
      setActiveSet(new Set())
    }
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setActiveSet(new Set())
    setDoneSet(new Set())
  }

  return (
    <section id="pipeline" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-cyan-400 font-mono text-sm font-medium mb-3 tracking-widest uppercase">
            Architecture
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">Databricks Job DAG</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The actual{' '}
            <code className="text-cyan-400 font-mono text-sm px-1.5 py-0.5 bg-cyan-500/10 rounded">nyc_taxi_job</code>{' '}
            from Databricks Asset Bundles — two parallel ingestion tracks, conditional gates,
            a convergence point, and a final fan-out to Gold and Export.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={running ? reset : runAnimation}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              running
                ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            {running
              ? <><RotateCcw size={14} /> Reset</>
              : <><Play size={14} /> Run Job Animation</>}
          </button>
        </div>

        {/* DAG — Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:block relative w-full rounded-2xl overflow-hidden border border-[#1e3a5f]/60"
          style={{ paddingBottom: '72%', background: '#040a14' }}
        >
          <div className="absolute inset-0">

            {/* Subtle horizontal layer bands */}
            {[
              { label: 'Landing',      top: '0%',   height: '15%', color: '#3b82f6' },
              { label: 'Gate',         top: '15%',  height: '18%', color: '#a855f7' },
              { label: 'Bronze/Silver',top: '33%',  height: '37%', color: '#94a3b8' },
              { label: 'Gold/Export',  top: '83%',  height: '17%', color: '#f59e0b' },
            ].map(band => (
              <div
                key={band.label}
                className="absolute left-0 right-0 flex items-center"
                style={{ top: band.top, height: band.height }}
              >
                <div
                  className="absolute inset-0 opacity-[0.025]"
                  style={{ background: band.color }}
                />
                <span
                  className="absolute left-3 text-[9px] font-mono font-semibold tracking-widest uppercase opacity-30"
                  style={{ color: band.color }}
                >
                  {band.label}
                </span>
              </div>
            ))}

            {/* SVG: edges */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {EDGES.map(edge => {
                const f = nodeMap[edge.from]
                const t = nodeMap[edge.to]
                const isDone   = doneSet.has(edge.from)   && doneSet.has(edge.to)
                const isActive = doneSet.has(edge.from)   && (activeSet.has(edge.to) || doneSet.has(edge.to))
                const color    = isDone || isActive ? '#22d3ee' : '#1e3a5f'
                const opacity  = isDone || isActive ? 0.95 : 0.3
                const path     = getPath(f, t)

                return (
                  <g key={`${edge.from}-${edge.to}`} filter={isActive ? 'url(#glow)' : undefined}>
                    {/* Edge path */}
                    <path
                      d={path}
                      fill="none"
                      stroke={color}
                      strokeWidth="0.45"
                      strokeDasharray="2.2 1.6"
                      opacity={opacity}
                      className={isActive && !isDone ? 'flow-line' : ''}
                    />

                    {/* Arrowhead dot at target */}
                    <circle
                      cx={t.cx}
                      cy={t.cy - 4.8}
                      r="0.7"
                      fill={color}
                      opacity={opacity}
                    />

                  </g>
                )
              })}
            </svg>

            {/* Node cards */}
            {NODES.map(node => {
              const ls       = LS[node.layer]
              const isActive = activeSet.has(node.id)
              const isDone   = doneSet.has(node.id)
              const Icon     = node.type === 'condition' ? GitBranch : BookOpen

              return (
                <div
                  key={node.id}
                  className="absolute"
                  style={{
                    left: `${node.cx}%`,
                    top:  `${node.cy}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '165px',
                    zIndex: 10,
                  }}
                >
                  <div
                    className="rounded-xl px-3 py-2.5 border transition-all duration-300"
                    style={{
                      background: isActive || isDone ? ls.bg : 'rgba(6,13,26,0.95)',
                      borderColor: isActive
                        ? ls.border
                        : isDone
                        ? ls.color + '55'
                        : '#1e3a5f60',
                      boxShadow: isActive
                        ? `0 0 16px ${ls.color}55, 0 0 32px ${ls.color}22`
                        : isDone
                        ? `0 0 8px ${ls.color}25`
                        : 'none',
                    }}
                  >
                    {/* Top row: layer label + status icon */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          size={10}
                          style={{ color: isActive || isDone ? ls.color : '#334155' }}
                        />
                        <span
                          className="text-[9px] font-mono uppercase tracking-wider font-semibold"
                          style={{ color: isActive || isDone ? ls.color : '#334155' }}
                        >
                          {ls.label}
                        </span>
                      </div>
                      {isDone
                        ? <CheckCircle2 size={11} style={{ color: ls.color }} />
                        : isActive
                        ? <Loader2 size={11} className="animate-spin" style={{ color: ls.color }} />
                        : null}
                    </div>

                    {/* Task key */}
                    <p
                      className="text-[10px] font-mono font-medium leading-tight"
                      style={{ color: isActive || isDone ? '#e2e8f0' : '#475569' }}
                    >
                      {node.short}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* DAG — Mobile vertical fallback */}
        <div className="md:hidden space-y-2">
          {NODES.map(node => {
            const ls       = LS[node.layer]
            const isActive = activeSet.has(node.id)
            const isDone   = doneSet.has(node.id)
            return (
              <div
                key={node.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300"
                style={{
                  borderColor: isActive ? ls.border : isDone ? ls.color + '40' : '#1e3a5f50',
                  background: isActive ? ls.bg : 'rgba(10,22,40,0.8)',
                }}
              >
                <span className="text-[9px] font-mono font-bold uppercase w-14 flex-shrink-0" style={{ color: ls.color }}>
                  {ls.label}
                </span>
                <span className="text-xs font-mono text-slate-300 flex-1">{node.full}</span>
                {isDone && <CheckCircle2 size={12} style={{ color: ls.color }} />}
                {isActive && <Loader2 size={12} className="animate-spin" style={{ color: ls.color }} />}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-5 mt-8">
          {Object.entries(LS).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: val.color }} />
              <span className="text-xs text-slate-400 font-mono">{val.label}</span>
            </div>
          ))}
        </div>

        {/* Source note */}
        <p className="text-center text-xs text-slate-600 font-mono mt-4">
          Source: <span className="text-slate-500">databricks.yml · nyc_taxi_job · github.com/AhmedBenTourkia/nyctaxi_project</span>
        </p>

      </div>
    </section>
  )
}
