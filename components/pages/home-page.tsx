'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight,
  Building2,
  Megaphone,
  Search,
  CalendarCheck,
  BarChart3,
  CheckCircle2,
  Globe2,
  Users2,
  ShieldCheck,
  FileText,
  Shield,
  Mail,
  Menu,
  X
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Logo from "@/components/ui/logo"

export default function HomePage() {
  const router = useRouter()
  const [faqReady, setFaqReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setFaqReady(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const teamMembers = [
    {
      name: 'Mohammed Amine Chaouchi',
      role: 'Team Leader & Developer',
      description: 'Oversees the project direction, coordinates collaboration, and contributes to core development tasks.',
      initials: 'MC'
    },
    {
      name: 'Chergui Mohammed',
      role: 'Scrum Master',
      description: 'Removes workflow blockers, and ensures smooth Agile processes within the team.',
      initials: 'CM'
    },
    {
      name: 'Kaouther Bensaddek',
      role: 'Product Owner',
      description: 'Defines the product vision, prioritizes features, and ensures the solution meets user and business needs.',
      initials: 'KB'
    },
    {
      name: 'Sonia Cherbel',
      role: 'Developer',
      description: 'Focuses on implementing key functionalities and assisting the team in delivering high-quality features.',
      initials: 'SC'
    },
    {
      name: 'Rabah Boucenna',
      role: 'Developer',
      description: 'Contributes to the development of core modules while ensuring code quality and performance.',
      initials: 'RB'
    },
  ];

  const faqs = [
    {
      question: 'What is AdBridgeDZ?',
      answer: 'AdBridgeDZ is a modern digital marketplace that connects businesses with premium outdoor advertising spaces across Algeria.'
    },
    {
      question: 'How do I list my advertising space?',
      answer: 'Sign up as an advertising agency, complete your profile, and list your available spaces with photos, locations, and pricing details.'
    },
    {
      question: 'How do I book advertising space?',
      answer: 'Browse available spaces, compare options, and book directly through our platform with instant confirmation and secure payments.'
    },
    {
      question: 'Which cities do you cover?',
      answer: 'We cover all major cities across Algeria including Algiers, Oran, Constantine, and many more with verified advertising locations.'
    }
  ];

  // --- FIX 1: Changed href from '#' to '#home' to prevent querySelector crash ---
  const navLinks = [
    { href: '#home', label: 'Home', scroll: true }, 
    { href: '#how-it-works', label: 'How It Works', scroll: true },
    { href: '#team', label: 'Team', scroll: true },
    { href: '#faq', label: 'FAQ', scroll: true },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // --- FIX 2: Added safety check for empty hash ---
    if (href.startsWith('#')) {
      e.preventDefault()
      
      if (href === '#') return; // Prevent crash if href is just '#'

      try {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } catch (error) {
        console.error("Scroll failed:", error)
      }
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-teal-500/30">
      
      {/* --- NAVBAR --- */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-teal-500/10 border-b border-teal-500/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Logo href="/" size="md" showHoverEffects={true} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors duration-200 rounded-lg group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full"></span>
                </a>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push('/account-type')}
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-slate-950/98 backdrop-blur-md border-t border-teal-500/20"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 space-y-3 border-t border-slate-800">
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push('/login')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-center border-slate-700 text-slate-300 hover:text-white hover:border-teal-500/50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      router.push('/account-type')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-center bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-teal-500/25"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* --- HERO SECTION --- */}
      {/* --- FIX 3: Added id="home" so the nav link works --- */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/times_square.jpg" 
            alt="Times Square" 
            className="w-full h-full object-cover opacity-60"
          />
          {/* Heavy Gradient Overlay for Text Readability & Seamless Transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium text-cyan-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              The Future of Outdoor Advertising
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
              Be Seen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500">
                Everywhere.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="max-w-2xl mx-auto text-xl text-slate-300 font-light leading-relaxed">
              AdBridgeDZ connects visionary brands with premium advertising spaces across Algeria. 
              Simple, transparent, and powerful.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => router.push('/account-type?type=company')}
                className="h-14 px-8 rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white font-semibold text-lg shadow-md hover:from-teal-600 hover:to-cyan-600 hover:scale-105 transition-all duration-300"
              >
                I Want to Advertise
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/account-type?type=agency')}
                className="h-14 px-8 rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 text-white font-semibold text-lg shadow-md border border-teal-500/30 hover:from-teal-600 hover:to-cyan-600 hover:text-white hover:scale-105 transition-all duration-300"
              >
                I Have Ad Service
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Concave Curve Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-slate-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}></div>
      </section>

      {/* --- TEAM MEMBERS SECTION --- */}
      <section id="team" className="py-10 px-2 sm:px-4 lg:px-8 bg-slate-950 relative z-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2 text-white">Meet the Team</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              The people behind AdBridgeDZ
            </p>
          </motion.div>
          <div className="flex flex-row flex-wrap justify-center gap-4 md:gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-2 border-teal-500/30 shadow-xl rounded-[2.5rem_1.5rem_2.5rem_1.5rem] p-4 md:p-6 min-w-[210px] max-w-xs hover:scale-105 hover:shadow-2xl hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-base md:text-lg font-bold text-white text-center mb-1">{member.name}</div>
                <div className="text-xs md:text-sm text-cyan-300 text-center font-semibold mb-1">{member.role}</div>
                <div className="text-xs text-slate-400 text-center">{member.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (ARCH CARDS) --- */}
      <section id="how-it-works" className="py-12 px-2 sm:px-4 lg:px-8 bg-slate-950 relative scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 text-white">How It Works</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">From discovery to campaign success, AdBridgeDZ guides you every step of the way. Here's how you can launch your next outdoor campaign with confidence and ease.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch">
            {[
              {
                icon: Search,
                step: 1,
                title: "Discover Spaces",
                desc: "Explore our interactive map and advanced filters to find the perfect advertising locations. View detailed analytics, photos, and real-time availability for each space.",
                color: "from-cyan-700 to-cyan-400"
              },
              {
                icon: CalendarCheck,
                step: 2,
                title: "Book Instantly",
                desc: "Select your dates, upload your creative, and confirm your booking in just a few clicks. Our platform ensures secure payments and instant confirmation.",
                color: "from-teal-700 to-teal-400"
              },
              {
                icon: BarChart3,
                step: 3,
                title: "Track & Optimize",
                desc: "Monitor your campaign's status, get performance insights, and receive post-campaign analytics. Optimize your strategy for even better results next time.",
                color: "from-teal-600 to-cyan-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative flex-1 min-w-[260px] group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[2.5rem]`} />
                <div className="relative h-full bg-slate-900 border border-slate-700/50 p-6 md:p-8 rounded-[2.5rem] text-center flex flex-col items-center hover:border-teal-500/50 shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-center mb-4">
                    <span className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${step.color} text-white font-bold text-lg md:text-xl shadow-lg mr-3`}>{step.step}</span>
                    <step.icon className="w-7 h-7 md:w-9 md:w-9 text-teal-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ / INFO (ACCORDION) --- */}
      <section id="faq" className="py-10 px-2 sm:px-4 lg:px-8 bg-slate-950 border-t border-slate-800/50 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Common Questions</h2>
          {faqReady && (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-slate-700/50 px-2 md:px-4 rounded-xl bg-slate-900/50">
                  <AccordionTrigger className="text-base md:text-lg hover:no-underline hover:text-teal-400 text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-sm md:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>


      {/* --- CURVED FOOTER SEPARATOR & FOOTER --- */}

      <footer className="relative pt-0 pb-12 px-4 sm:px-6 lg:px-8 border-t-0 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Curved SVG at the top of the footer */}
        <div className="absolute top-0 left-0 w-full pointer-events-none z-10">
          <svg
            className="w-full h-auto block rotate-180"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,100 L0,100 Z" fill="#020618" />
          </svg>
              </div>
        <div className="relative z-20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 pt-20">
          <div className="text-center md:text-left">
            <Logo href="/" size="md" showHoverEffects={false} className="mb-2" />
            <p className="text-slate-500 text-sm">© 2025 AdBridgeDZ. All rights reserved.</p>
            </div>
          <div className="flex flex-row gap-6 text-left">
            {/* --- FIX 4: Changed href='#' to href='/' to prevent dead links/crashes --- */}
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors font-medium text-base group"
            >
              <FileText className="w-5 h-5 text-teal-500 group-hover:scale-110 group-hover:text-teal-400 transition-transform" />
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors font-medium text-base group"
            >
              <Shield className="w-5 h-5 text-teal-500 group-hover:scale-110 group-hover:text-teal-400 transition-transform" />
              Terms of Service
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors font-medium text-base group"
            >
              <Mail className="w-5 h-5 text-teal-500 group-hover:scale-110 group-hover:text-teal-400 transition-transform" />
              Contact Support
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}