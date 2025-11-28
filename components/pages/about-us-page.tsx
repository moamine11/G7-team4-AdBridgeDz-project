// app/about-us/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Users,
  Target,
  Eye,
  Shield,
  TrendingUp,
  Star,
  CheckCircle2,
  Heart,
  Zap,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
}

const slideInLeft = {
  hidden: { x: -80, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
}

const slideInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

export default function AboutUsPage() {
  const router = useRouter()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', contactForm)
    setContactForm({ name: '', email: '', message: '' })
    alert('Thank you for your message! We will get back to you soon.')
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
  ]

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
  ]

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'Make outdoor advertising accessible, transparent, and efficient for businesses of all sizes across Algeria.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'Transform Algeria\'s advertising landscape through innovative technology and seamless connections between brands and spaces.',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Shield,
      title: 'Our Values',
      description: 'Innovation, transparency, accessibility, and passion for Algerian technological advancement.',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const offerings = [
    {
      icon: '🏢',
      title: 'Diverse Advertising Spaces',
      description: 'From digital billboards to traditional posters, we offer varied advertising options across Algeria.'
    },
    {
      icon: '⚡',
      title: 'Quick & Easy Booking',
      description: 'Simple process to find, compare, and book advertising spaces in minutes with instant confirmation.'
    },
    {
      icon: '🛡️',
      title: 'Verified Partners',
      description: 'All our advertising spaces and partners are thoroughly verified for quality and reliability.'
    }
  ]

  const contactInfo = [
    { 
      icon: Mail, 
      text: "Email", 
      value: "support@adbridgedz.dz",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      hoverBgColor: "hover:bg-blue-50"
    },
    { 
      icon: Phone, 
      text: "Phone", 
      value: "+213 555 123 456",
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
      hoverBgColor: "hover:bg-teal-50"
    },
    { 
      icon: MapPin, 
      text: "Address", 
      value: "Algiers, Algeria",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      hoverBgColor: "hover:bg-purple-50"
    }
  ]

  const socialMedia = [
    { icon: Facebook, name: "facebook", color: "hover:text-blue-600" },
    { icon: Twitter, name: "twitter", color: "hover:text-blue-400" },
    { icon: Linkedin, name: "linkedin", color: "hover:text-blue-700" }
  ]

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            variants={slideInUp}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 shadow-sm mx-auto"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-blue-900">
                About AdBridgeDZ
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
              >
                Transforming
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent text-3xl md:text-4xl lg:text-5xl">
                  Algerian Advertising
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-700 leading-relaxed font-light max-w-2xl mx-auto"
              >
                We are a passionate Algerian team dedicated to revolutionizing outdoor advertising through technology, innovation, and seamless connections.
              </motion.p>
            </div>

            {/* Check Items */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Algerian Innovation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Verified Partners</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Who We Are Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              variants={slideInUp}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Who We Are
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed font-light">
                  We are a young and ambitious Algerian team passionate about technology, marketing, and innovation. 
                  Our goal is to make advertising more accessible, transparent, and efficient for businesses, 
                  agencies, and entrepreneurs across Algeria.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed font-light">
                  AdBridgeDZ is developed by dedicated students and professionals committed to transforming 
                  the advertising landscape in Algeria through cutting-edge technology and user-centric design.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-gray-600 font-light">Algerian Team</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
                  <div className="text-gray-600 font-light">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                  <div className="text-gray-600 font-light">Spaces Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-gray-600 font-light">Cities Covered</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              className="space-y-6"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex items-start gap-6">
                    <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                      <p className="text-gray-700 leading-relaxed font-light">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* What We Offer Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={slideInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What We Offer
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
              Comprehensive advertising solutions designed to connect businesses with their target audience effectively.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {offerings.map((offering, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-blue-50 border border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {offering.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{offering.title}</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  {offering.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Meet the Team Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={slideInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
              The passionate individuals behind AdBridgeDZ, committed to transforming Algeria's advertising landscape.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {member.initials}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-700 leading-relaxed font-light text-sm">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQs Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={slideInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
              Find answers to common questions about our platform and services.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={slideInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
              Have questions about AdBridgeDZ? We're here to help you get started.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div 
              variants={slideInLeft}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  {contactInfo.map((contact, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className={`flex items-start gap-4 p-4 rounded-2xl ${contact.hoverBgColor} transition-all duration-300 cursor-pointer`}
                    >
                      <div className={`flex items-center justify-center w-12 h-12 ${contact.bgColor} rounded-2xl`}>
                        <contact.icon className={`w-6 h-6 ${contact.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{contact.text}</h4>
                        <a href={contact.text === "Email" ? `mailto:${contact.value}` : contact.text === "Phone" ? `tel:${contact.value}` : "#"} 
                           className="text-blue-600 hover:text-blue-700 font-medium">
                          {contact.value}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    {socialMedia.map((social) => (
                      <a 
                        key={social.name}
                        href="#" 
                        className="text-gray-400 transition-colors duration-200 transform hover:scale-110"
                        onMouseEnter={() => setHoveredSocial(social.name)}
                        onMouseLeave={() => setHoveredSocial(null)}
                        style={{ 
                          color: hoveredSocial === social.name ? 
                            (social.name === 'facebook' ? '#2563eb' : 
                             social.name === 'twitter' ? '#60a5fa' : '#1d4ed8') : '#9ca3af'
                        }}
                      >
                        <social.icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              variants={slideInLeft}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200"
            >
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300 resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl py-4 font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">AdBridgeDZ</h4>
              <p className="text-gray-700 text-sm font-light">
                Algeria's premier digital marketplace for outdoor advertising, connecting businesses with premium billboard spaces.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#explore-spaces" className="text-gray-600 hover:text-blue-600 font-light">Explore Spaces</a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-light">How It Works</a>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-light">Pricing</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about-us" className="text-gray-600 hover:text-blue-600 font-light">About</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-light">Contact</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-blue-600 font-light">Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 font-light">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 font-light">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p className="font-light">&copy; 2025 AdBridgeDZ. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {socialMedia.map((social) => (
                <a 
                  key={social.name}
                  href="#" 
                  className="text-gray-400 transition-colors duration-200 transform hover:scale-110"
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{ 
                    color: hoveredSocial === social.name ? 
                      (social.name === 'facebook' ? '#2563eb' : 
                       social.name === 'twitter' ? '#60a5fa' : '#1d4ed8') : '#9ca3af'
                  }}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}