import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Modules from './components/Modules.jsx'
import Architecture from './components/Architecture.jsx'
import GetStarted from './components/GetStarted.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Modules />
        <Architecture />
        <GetStarted />
      </main>
      <Footer />
    </>
  )
}
