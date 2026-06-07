import { useState, useEffect } from 'react'
import { Github, Linkedin, Menu, X } from 'lucide-react'

const links = [
  { label: 'Pipeline',  href: '#pipeline'  },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Code',      href: '#code'      },
  { label: 'Stack',     href: '#stack'     },
]

export default function Nav() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060d1a]/90 backdrop-blur-md border-b border-[#1e3a5f]/60 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-2xl">🚕</span>
          <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
            NYC Taxi Pipeline
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/AhmedBenTourkia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ahmed-ben-tourkia-248aba3aa/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a1628] border-t border-[#1e3a5f]/60 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
