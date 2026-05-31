import { motion } from 'framer-motion'

const technologies = [
  {
    category: 'Data Platform',
    items: [
      { name: 'Databricks',     role: 'Cluster compute & job orchestration', icon: '⚡' },
      { name: 'Delta Lake',     role: 'ACID tables, SCD merges, time-travel', icon: '△' },
      { name: 'Unity Catalog',  role: 'Centralised metadata & governance',    icon: '🗂️' },
    ],
  },
  {
    category: 'Processing',
    items: [
      { name: 'PySpark',   role: 'Distributed ETL transformations', icon: '🔥' },
      { name: 'Python 3',  role: 'Utility modules & date helpers',  icon: '🐍' },
    ],
  },
  {
    category: 'AWS Serverless',
    items: [
      { name: 'AWS Lambda',      role: 'Trigger Databricks jobs & serve results', icon: 'λ' },
      { name: 'API Gateway',     role: 'REST endpoints for the frontend',          icon: '🔗' },
      { name: 'S3',              role: 'File upload landing & export storage',      icon: '🪣' },
      { name: 'CloudFront',      role: 'CDN for static frontend hosting',           icon: '🌐' },
    ],
  },
  {
    category: 'Storage & Cloud',
    items: [
      { name: 'Azure ABFSS', role: 'Cloud storage backend for volumes', icon: '☁️' },
      { name: 'Azure Blob',  role: 'Landing zone for raw parquet files', icon: '📦' },
    ],
  },
]

export default function TechStack() {
  return (
    <section id="stack" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 font-mono text-sm font-medium mb-3 tracking-widest uppercase">
            Technologies
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">Built With</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A modern data engineering stack spanning Databricks, Delta Lake, and AWS Serverless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {technologies.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
              className="card-dark rounded-2xl p-6"
            >
              <h3 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest mb-4">
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.items.map(tech => (
                  <div key={tech.name} className="flex items-center gap-4">
                    <span className="w-10 h-10 flex items-center justify-center bg-[#0d1a2e] rounded-xl text-lg border border-[#1e3a5f]/60 flex-shrink-0">
                      {tech.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">{tech.name}</p>
                      <p className="text-slate-500 text-xs">{tech.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
