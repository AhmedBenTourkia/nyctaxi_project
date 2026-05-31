import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { statCards, dailyTrips, vendorData, paymentTypes } from '../data/sampleMetrics'

const fmt = (n) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : n

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1a2e] border border-[#1e3a5f] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.stroke || p.fill }}>
          {p.name}: <span className="font-bold text-white">{prefix}{fmt(p.value)}{suffix}</span>
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard() {
  return (
    <section id="analytics" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 font-mono text-sm font-medium mb-3 tracking-widest uppercase">
            Gold Layer Output
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">Analytics Dashboard</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real aggregates from the Gold layer — January 2024 NYC yellow taxi data
            processed through the full medallion pipeline.
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className="card-dark rounded-2xl p-6 relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20"
                style={{ background: s.color, transform: 'translate(30%, -30%)' }}
              />
              <p className="text-3xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-sm font-medium text-slate-300">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Daily trip volume */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="card-dark rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-1">Daily Trip Volume</h3>
            <p className="text-xs text-slate-500 mb-5 font-mono">January 2024 · daily_trip_summary</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyTrips} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f50" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={fmt}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="trips"
                  name="Trips"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#22d3ee' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue trend */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-dark rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-1">Daily Revenue</h3>
            <p className="text-xs text-slate-500 mb-5 font-mono">total_amount · Gold layer</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyTrips} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f50" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => `$${fmt(v)}`}
                />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Trips by vendor */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="card-dark rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-1">Trips by Vendor</h3>
            <p className="text-xs text-slate-500 mb-5 font-mono">silver.yellow_trips_enriched · vendor field</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={vendorData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f50" />
                <XAxis
                  dataKey="vendor"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  tickLine={false}
                  width={80}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={fmt}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="trips" name="Trips" radius={[4, 4, 0, 0]}>
                  {vendorData.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Payment type distribution */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-dark rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-1">Payment Type Distribution</h3>
            <p className="text-xs text-slate-500 mb-5 font-mono">silver.yellow_trips_cleansed · payment_type</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {paymentTypes.map((d, i) => (
                      <Cell key={i} fill={d.color} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v}%`, '']}
                    contentStyle={{ background: '#0d1a2e', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: '#94a3b8' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {paymentTypes.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-slate-400">{d.name}</span>
                    <span className="text-xs font-bold text-white ml-auto pl-3">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
