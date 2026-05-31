import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#1e3a5f]/60 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-white font-bold text-lg">Ahmed Ben Tourkia</p>
          <p className="text-slate-500 text-sm mt-1">Data Engineer · Databricks · AWS · PySpark</p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/AhmedBenTourkia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ahmed-ben-tourkia-248aba3aa/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
          <a
            href="mailto:ahmedbentourkia2@gmail.com"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm"
          >
            <Mail size={16} /> Email
          </a>
        </div>

        <p className="text-slate-600 text-xs">
          © 2024 · NYC Yellow Taxi Pipeline Portfolio
        </p>
      </div>
    </footer>
  )
}
