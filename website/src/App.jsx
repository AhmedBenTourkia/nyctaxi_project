import Nav from './components/Nav'
import Hero from './components/Hero'
import PipelineSection from './components/PipelineSection'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import CodeViewer from './components/CodeViewer'
import TechStack from './components/TechStack'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#060d1a] text-slate-100">
      <Nav />
      <Hero />
      <PipelineSection />
      <AnalyticsDashboard />
      <CodeViewer />
      <TechStack />
      <Footer />
    </div>
  )
}
