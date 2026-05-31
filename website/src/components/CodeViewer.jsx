import { useState } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { snippets } from '../data/codeSnippets'

export default function CodeViewer() {
  const [activeId, setActiveId] = useState(snippets[0].id)
  const [copied,   setCopied]   = useState(false)

  const active = snippets.find(s => s.id === activeId) ?? snippets[0]

  const copy = () => {
    navigator.clipboard.writeText(active.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="code" className="py-24 px-6 bg-[#080f1e]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-cyan-400 font-mono text-sm font-medium mb-3 tracking-widest uppercase">
            Source Code
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">Pipeline Code</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real PySpark notebooks from the production pipeline. Select a layer to browse.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-dark rounded-2xl overflow-hidden border border-[#1e3a5f]/60"
        >
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-[#1e3a5f]/60 bg-[#0a1628]">
            {snippets.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`px-5 py-3.5 text-xs font-mono font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeId === s.id
                    ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* File path + description bar */}
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#1e3a5f]/40 bg-[#0a1628]/50">
            <div>
              <p className="text-xs font-mono text-slate-500 mb-1">{active.file}</p>
              <p className="text-sm text-slate-300">{active.description}</p>
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white border border-[#1e3a5f] hover:border-slate-500 transition-all flex-shrink-0"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Code block */}
          <div className="overflow-x-auto">
            <SyntaxHighlighter
              language="python"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: '#060d1a',
                fontSize: '0.8rem',
                lineHeight: '1.6',
                borderRadius: 0,
              }}
              showLineNumbers
              lineNumberStyle={{ color: '#2d4a6b', fontSize: '0.7rem', minWidth: '2.5em' }}
            >
              {active.code}
            </SyntaxHighlighter>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
