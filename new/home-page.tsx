'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  Mail
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HomePage() {
  const router = useRouter()
  const [faqReady, setFaqReady] = useState(false)

  useEffect(() => {
    setFaqReady(true)
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

  // Team members and FAQ from About Us page
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

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium text-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              The Future of Outdoor Advertising
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
              Be Seen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400">
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
                className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400 text-white font-semibold text-lg shadow-md hover:from-blue-700 hover:to-teal-600 hover:scale-105 transition-all duration-300"
              >
                I Want to Advertise
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/account-type?type=agency')}
                className="h-14 px-8 rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 text-white font-semibold text-lg shadow-md border-none hover:from-blue-700 hover:to-teal-600 hover:text-white hover:scale-105 transition-all duration-300"
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
      <section className="py-10 px-2 sm:px-4 lg:px-8 bg-slate-950 relative z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Meet the Team</h2>
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
                className="flex flex-col items-center bg-gradient-to-br from-slate-900/80 to-blue-900/80 border-2 border-blue-700/30 shadow-xl rounded-[2.5rem_1.5rem_2.5rem_1.5rem] p-4 md:p-6 min-w-[210px] max-w-xs hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-base md:text-lg font-bold text-white text-center mb-1">{member.name}</div>
                <div className="text-xs md:text-sm text-blue-300 text-center font-semibold mb-1">{member.role}</div>
                <div className="text-xs text-slate-400 text-center">{member.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (ARCH CARDS) --- */}
      <section className="py-12 px-2 sm:px-4 lg:px-8 bg-slate-950 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">How It Works</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">From discovery to campaign success, AdBridgeDZ guides you every step of the way. Here’s how you can launch your next outdoor campaign with confidence and ease.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch">
            {[
              {
                icon: Search,
                step: 1,
                title: "Discover Spaces",
                desc: "Explore our interactive map and advanced filters to find the perfect advertising locations. View detailed analytics, photos, and real-time availability for each space.",
                color: "from-blue-700 to-blue-400"
              },
              {
                icon: CalendarCheck,
                step: 2,
                title: "Book Instantly",
                desc: "Select your dates, upload your creative, and confirm your booking in just a few clicks. Our platform ensures secure payments and instant confirmation.",
                color: "from-purple-700 to-purple-400"
              },
              {
                icon: BarChart3,
                step: 3,
                title: "Track & Optimize",
                desc: "Monitor your campaign’s status, get performance insights, and receive post-campaign analytics. Optimize your strategy for even better results next time.",
                color: "from-teal-700 to-teal-400"
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
                <div className="relative h-full bg-slate-900 border border-white/10 p-6 md:p-8 rounded-[2.5rem] text-center flex flex-col items-center hover:border-white/20 shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-center mb-4">
                    <span className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${step.color} text-white font-bold text-lg md:text-xl shadow-lg mr-3`}>{step.step}</span>
                    <step.icon className="w-7 h-7 md:w-9 md:h-9 text-white" />
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
      <section className="py-10 px-2 sm:px-4 lg:px-8 bg-slate-950 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Common Questions</h2>
          {faqReady && (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-white/10 px-2 md:px-4 rounded-xl bg-white/5">
                  <AccordionTrigger className="text-base md:text-lg hover:no-underline hover:text-blue-400">
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

      <footer className="relative pt-0 pb-12 px-4 sm:px-6 lg:px-8 border-t-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0E1937 0%, #101C3F 60%, #192A54 100%)' }}>
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
            <h4 className="text-2xl font-bold text-white mb-2">AdBridgeDZ</h4>
            <p className="text-slate-500 text-sm"> 2025 AdBridgeDZ. All rights reserved.</p>
          </div>
          <div className="flex flex-row gap-6 text-left">
            <Link
              href="#"
              className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors font-medium text-base group"
            >
              <FileText className="w-5 h-5 text-blue-500 group-hover:scale-110 group-hover:text-blue-400 transition-transform" />
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors font-medium text-base group"
            >
              <Shield className="w-5 h-5 text-blue-500 group-hover:scale-110 group-hover:text-blue-400 transition-transform" />
              Terms of Service
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors font-medium text-base group"
            >
              <Mail className="w-5 h-5 text-blue-500 group-hover:scale-110 group-hover:text-blue-400 transition-transform" />
              Contact Support
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
