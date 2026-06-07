import { motion } from 'framer-motion'
import { ArrowDown, Github, ExternalLink } from 'lucide-react'

const badges = [
  { label: 'Databricks',   color: '#ef4444' },
  { label: 'PySpark',      color: '#f97316' },
  { label: 'Delta Lake',   color: '#3b82f6' },
  { label: 'AWS Lambda',   color: '#f59e0b' },
  { label: 'S3',           color: '#10b981' },
  { label: 'API Gateway',  color: '#a855f7' },
]

const stats = [
  { value: '3.2M',  label: 'Trips / Month' },
  { value: '5',     label: 'Pipeline Layers' },
  { value: '100%',  label: 'Cloud-Native' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden hero-grid"
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-700/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-8 tracking-wider"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          DATA ENGINEERING PORTFOLIO PROJECT
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-4"
        >
          <span className="text-white">NYC Yellow Taxi</span>
          <br />
          <span className="text-gradient">Data Pipeline</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A production-grade medallion architecture that ingests, cleanses, enriches, and aggregates
          large-scale taxi datasets using{' '}
          <span className="text-white font-medium">Databricks</span>,{' '}
          <span className="text-white font-medium">Delta Lake</span>, and{' '}
          <span className="text-white font-medium">AWS Serverless</span>.
        </motion.p>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {badges.map(b => (
            <span
              key={b.label}
              className="px-3 py-1 rounded-full text-xs font-mono font-medium border"
              style={{
                color: b.color,
                borderColor: `${b.color}40`,
                background: `${b.color}12`,
              }}
            >
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
        >
          <a
            href="#pipeline"
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
          >
            Explore the Pipeline
          </a>
          <a
            href="https://github.com/AhmedBenTourkia/nyctaxi_project"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 border border-[#1e3a5f] hover:border-cyan-500/50 text-slate-300 hover:text-white font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 card-dark"
          >
            <ExternalLink size={16} />
            View on GitHub
          </a>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center gap-12"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce"
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  )
}
