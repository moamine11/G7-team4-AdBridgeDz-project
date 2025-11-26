// 'use client'

// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import { 
//   Facebook, 
//   Twitter, 
//   Linkedin, 
//   Search, 
//   Calendar, 
//   CheckCircle2, 
//   MapPin,
//   Phone,
//   Mail,
//   ArrowRight,
//   Shield,
//   TrendingUp,
//   Users,
//   Zap,
//   Star,
//   ArrowUpRight,
//   Eye,
//   Building,
//   Megaphone,
//   Target,
//   Heart,
//   Clock,
//   DollarSign
// } from 'lucide-react'

// // Animation variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.6,
//       when: "beforeChildren",
//       staggerChildren: 0.15
//     }
//   }
// }

// const itemVariants = {
//   hidden: { y: 15, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.4,
//       ease: "easeOut"
//     }
//   }
// }

// const slideInLeft = {
//   hidden: { x: -80, opacity: 0 },
//   visible: {
//     x: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut"
//     }
//   }
// }

// const slideInUp = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut"
//     }
//   }
// }

// const scaleIn = {
//   hidden: { scale: 1.1, opacity: 0 },
//   visible: {
//     scale: 1,
//     opacity: 1,
//     transition: {
//       duration: 1,
//       ease: "easeOut"
//     }
//   }
// }

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut"
//     }
//   }
// }

// const staggerContainer = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.08
//     }
//   }
// }

// export default function HomePage() {
//   const router = useRouter()
//   const [contactForm, setContactForm] = useState({
//     name: '',
//     email: '',
//     message: ''
//   })
//   const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
//   const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

//   const handleContactSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log('Contact form:', contactForm)
//     setContactForm({ name: '', email: '', message: '' })
//     alert('Thank you for your message! We will get back to you soon.')
//   }

//   const advertisingSpaces = [
//     {
//       type: "Digital Billboards",
//       locations: ["Algiers", "Oran", "Constantine"],
//       features: ["HD Display", "24/7 Operation", "Remote Content Update"],
//       price: "Starting from 15,000 DZD/week"
//     },
//     {
//       type: "Traditional Billboards",
//       locations: ["Highways", "City Centers", "Commercial Areas"],
//       features: ["Various Sizes", "Prime Locations", "Long-term Contracts"],
//       price: "Starting from 8,000 DZD/week"
//     },
//     {
//       type: "Indoor Screens",
//       locations: ["Shopping Malls", "Airports", "Business Centers"],
//       features: ["Captive Audience", "High Frequency", "Targeted Demographics"],
//       price: "Starting from 5,000 DZD/week"
//     },
//     {
//       type: "Transport Advertising",
//       locations: ["Buses", "Trams", "Taxis"],
//       features: ["Mobile Exposure", "City-wide Coverage", "Multiple Routes"],
//       price: "Starting from 3,000 DZD/week"
//     }
//   ]

//   // Feature data with explicit color classes
//   const features = [
//     { 
//       icon: Eye, 
//       id: "visibility", 
//       text: "High Visibility",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200",
//       iconColor: "text-blue-600",
//       hoverBgColor: "hover:bg-blue-100"
//     },
//     { 
//       icon: Target, 
//       id: "targeting", 
//       text: "Precision Targeting",
//       bgColor: "bg-teal-50",
//       borderColor: "border-teal-200",
//       iconColor: "text-teal-600",
//       hoverBgColor: "hover:bg-teal-100"
//     },
//     { 
//       icon: TrendingUp, 
//       id: "results", 
//       text: "Proven Results",
//       bgColor: "bg-purple-50",
//       borderColor: "border-purple-200",
//       iconColor: "text-purple-600",
//       hoverBgColor: "hover:bg-purple-100"
//     },
//     { 
//       icon: Shield, 
//       id: "verified", 
//       text: "Verified Partners",
//       bgColor: "bg-green-50",
//       borderColor: "border-green-200",
//       iconColor: "text-green-600",
//       hoverBgColor: "hover:bg-green-100"
//     }
//   ]

//   // Contact information data
//   const contactInfo = [
//     { 
//       icon: Mail, 
//       text: "Email", 
//       value: "support@adbridgedz.dz",
//       bgColor: "bg-blue-100",
//       iconColor: "text-blue-600",
//       hoverBgColor: "hover:bg-blue-50"
//     },
//     { 
//       icon: Phone, 
//       text: "Phone", 
//       value: "+213 555 123 456",
//       bgColor: "bg-teal-100",
//       iconColor: "text-teal-600",
//       hoverBgColor: "hover:bg-teal-50"
//     },
//     { 
//       icon: MapPin, 
//       text: "Address", 
//       value: "Algiers, Algeria",
//       bgColor: "bg-purple-100",
//       iconColor: "text-purple-600",
//       hoverBgColor: "hover:bg-purple-50"
//     }
//   ]

//   // Social media data
//   const socialMedia = [
//     { icon: Facebook, name: "facebook", color: "hover:text-blue-600" },
//     { icon: Twitter, name: "twitter", color: "hover:text-blue-400" },
//     { icon: Linkedin, name: "linkedin", color: "hover:text-blue-700" }
//   ]

//   return (
//     <div className="min-h-screen flex flex-col font-sans">
//       {/* Navigation Header */}
//       <motion.header 
//         initial={{ y: -80, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo - Using the same logo from commented code */}
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg"></div>
//               <span className="text-xl font-bold text-gray-900">AdBridgeDZ</span>
//             </Link>

//             {/* Navigation Links */}
//             <nav className="hidden md:flex items-center space-x-6">
//               <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
//                 Home
//               </Link>
//               <a href="#explore-spaces" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
//                 Explore Spaces
//               </a>
//               <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
//                 How It Works
//               </a>
//               <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
//                 About
//               </Link>
//               <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
//                 Contact
//               </a>
//             </nav>

//             {/* Auth Buttons */}
//             <div className="flex items-center space-x-3">
//               <Link href="/login">
//                 <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-sm">
//                   Sign In
//                 </Button>
//               </Link>
//               <Link href="/account-type">
//                 <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-sm px-4">
//                   Get Started
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </motion.header>

//       {/* Hero Section - Using the same hero section structure from commented code */}
//       <motion.section 
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
//             {/* Left Section */}
//             <motion.div 
//               variants={slideInLeft}
//               className="space-y-8"
//             >
//               <div className="space-y-4">
//                 <motion.div 
//                   variants={itemVariants}
//                   className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 shadow-sm"
//                 >
//                   <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
//                   <span className="text-sm font-medium text-blue-900">
//                     Algeria's #1 Outdoor Advertising Platform
//                   </span>
//                 </motion.div>
//                 <motion.h1 
//                   variants={itemVariants}
//                   className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight"
//                 >
//                   Transform Your{' '}
//                   <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//                     Outdoor Ads
//                   </span>
//                 </motion.h1>
//                 <motion.p 
//                   variants={itemVariants}
//                   className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light"
//                 >
//                   Connect, discover, and book premium billboard spaces across Algeria with our digital marketplace.
//                 </motion.p>
//               </div>
//               <motion.div 
//                 variants={itemVariants}
//                 className="flex flex-col sm:flex-row gap-4 pt-4"
//               >
//                 <Button
//                   size="lg"
//                   className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-2xl px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                   onClick={() => router.push('/account-type')}
//                 >
//                   Get Started Free
//                   <ArrowUpRight className="w-5 h-5 ml-2" />
//                 </Button>
//                 <Link href="/login" className="flex-1 sm:flex-none">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="w-full border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 rounded-2xl px-10 py-7 text-lg font-semibold transition-all duration-300"
//                   >
//                     Sign In
//                   </Button>
//                 </Link>
//               </motion.div>
//               <motion.div 
//                 variants={itemVariants}
//                 className="flex items-center gap-6 pt-4 text-sm text-gray-600"
//               >
//                 <div className="flex items-center gap-2">
//                   <CheckCircle2 className="w-5 h-5 text-green-500" />
//                   <span>No credit card required</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle2 className="w-5 h-5 text-green-500" />
//                   <span>Free forever</span>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Right Section - Using the same hero illustration from commented code */}
//             <motion.div 
//               variants={scaleIn}
//               className="relative flex justify-center items-center"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-teal-200 rounded-3xl blur-3xl opacity-30"></div>
//               <img
//                 src="/hero_illustration.png"
//                 alt="Outdoor advertising illustration"
//                 className="relative w-full max-w-lg lg:max-w-xl object-contain transform hover:scale-105 transition-transform duration-500"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Value Proposition Section */}
//       <motion.section 
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//         variants={containerVariants}
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             {/* Left Content */}
//             <motion.div 
//               variants={slideInUp}
//               className="space-y-8"
//             >
//               <div className="space-y-6">
//                 <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
//                   Showcase your brand{' '}
//                   <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//                     where people actually look
//                   </span>
//                 </h2>
//                 <p className="text-xl text-gray-700 leading-relaxed font-light">
//                   Discover premium advertising spaces across Algeria — from strategic billboards to high-traffic 
//                   indoor screens — all in one smart, modern platform designed to help your business grow and 
//                   connect with your target audience effectively.
//                 </p>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-8 pt-8">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
//                   <div className="text-gray-600 font-light">Premium Locations</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-teal-600 mb-2">200+</div>
//                   <div className="text-gray-600 font-light">Verified Agencies</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
//                   <div className="text-gray-600 font-light">Cities Covered</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
//                   <div className="text-gray-600 font-light">Support</div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Right Content - Account Type Cards */}
//             <motion.div 
//               variants={staggerContainer}
//               className="space-y-6"
//             >
//               {/* Agency Card */}
//               <motion.div
//                 variants={itemVariants}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 className="group bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-2xl transition-all duration-500"
//               >
//                 <div className="flex items-start gap-6">
//                   <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
//                     <Megaphone className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Advertising Agency</h3>
//                     <p className="text-gray-700 leading-relaxed mb-6 font-light">
//                       List your advertising spaces, reach more clients, and grow your business. Manage your inventory and bookings efficiently with our powerful tools.
//                     </p>
//                     <Button 
//                       onClick={() => router.push('/account-type?type=agency')}
//                       className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 group"
//                     >
//                       Register as Agency
//                       <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Company Card */}
//               <motion.div
//                 variants={itemVariants}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 className="group bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-3xl p-8 hover:border-teal-300 hover:shadow-2xl transition-all duration-500"
//               >
//                 <div className="flex items-start gap-6">
//                   <div className="flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
//                     <Building className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Company</h3>
//                     <p className="text-gray-700 leading-relaxed mb-6 font-light">
//                       Find the perfect advertising spaces for your brand. Compare locations, prices, and traffic data to make informed decisions that drive results.
//                     </p>
//                     <Button 
//                       onClick={() => router.push('/account-type?type=company')}
//                       className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 group"
//                     >
//                       Register as Company
//                       <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Purpose/Description Section */}
//       <motion.section 
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//         variants={containerVariants}
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div 
//             variants={slideInUp}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
//               Revolutionizing Outdoor Advertising
//             </h2>
//             <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
//               AdBridgeDZ is transforming Algeria's advertising landscape with a seamless digital marketplace 
//               where businesses and agencies connect to discover and book premium billboard spaces effortlessly.
//             </p>
//           </motion.div>

//           <motion.div 
//             variants={staggerContainer}
//             className="grid md:grid-cols-3 gap-8 mt-16"
//           >
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5, scale: 1.05 }}
//               className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-blue-50 border border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
//             >
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <Search className="w-10 h-10 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Premium Spaces</h3>
//               <p className="text-gray-700 leading-relaxed font-light">
//                 Browse hundreds of verified outdoor advertising locations with detailed analytics, 
//                 real-time availability, and competitive pricing.
//               </p>
//             </motion.div>

//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5, scale: 1.05 }}
//               className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-teal-50 border border-teal-100 hover:border-teal-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
//             >
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <Shield className="w-10 h-10 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Partners</h3>
//               <p className="text-gray-700 leading-relaxed font-light">
//                 Every agency and provider is thoroughly vetted for reliability, 
//                 ensuring quality service and peace of mind for your campaigns.
//               </p>
//             </motion.div>

//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5, scale: 1.05 }}
//               className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-purple-50 border border-purple-100 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
//             >
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <TrendingUp className="w-10 h-10 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">Maximize ROI</h3>
//               <p className="text-gray-700 leading-relaxed font-light">
//                 Compare locations, traffic data, and pricing to make data-driven decisions 
//                 that maximize your advertising return on investment.
//               </p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Explore Spaces Section */}
//       <motion.section 
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//         variants={containerVariants}
//         id="explore-spaces" 
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div 
//             variants={slideInUp}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//               Explore Advertising Spaces
//             </h2>
//             <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
//               Discover the perfect advertising solution for your brand from our curated selection of premium spaces across Algeria.
//             </p>
//           </motion.div>

//           {/* Quick Filter Buttons */}
//           <motion.div 
//             variants={staggerContainer}
//             className="flex flex-wrap justify-center gap-4 mb-12"
//           >
//             {["All Spaces", "Digital Billboards", "Traditional Billboards", "Indoor Screens", "Transport Ads"].map((filter, index) => (
//               <motion.div
//                 key={filter}
//                 variants={itemVariants}
//                 whileHover={{ scale: 1.05, y: -2 }}
//               >
//                 <Button 
//                   variant="outline" 
//                   className="rounded-full px-6 py-2 border-blue-200 text-blue-600 hover:bg-blue-50"
//                 >
//                   {filter}
//                 </Button>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Spaces Grid */}
//           <motion.div 
//             variants={staggerContainer}
//             className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
//           >
//             {advertisingSpaces.map((space, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 className="bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500"
//               >
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <h3 className="text-xl font-bold text-gray-900">{space.type}</h3>
//                     <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
//                   </div>

//                   <div className="space-y-3 mb-4">
//                     <div className="flex items-center gap-2">
//                       <MapPin className="w-4 h-4 text-blue-600" />
//                       <span className="text-sm text-gray-700 font-medium">Available in:</span>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {space.locations.map((location, locIndex) => (
//                         <span key={locIndex} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                           {location}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="space-y-2 mb-4">
//                     <div className="flex items-center gap-2">
//                       <Zap className="w-4 h-4 text-green-500" />
//                       <span className="text-sm text-gray-700 font-medium">Features:</span>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {space.features.map((feature, featureIndex) => (
//                         <span key={featureIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
//                           {feature}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <DollarSign className="w-4 h-4 text-green-500" />
//                       <span className="text-lg font-bold text-gray-900">{space.price}</span>
//                     </div>
//                     <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm">
//                       View Details
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>

//           <motion.div 
//             variants={itemVariants}
//             className="text-center mt-12"
//           >
//             <Button 
//               onClick={() => router.push('/explore-spaces')}
//               className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-2xl px-8 py-4 font-semibold group"
//             >
//               View All Spaces
//               <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//             </Button>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* How It Works Section */}
//       <motion.section 
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//         variants={containerVariants}
//         id="how-it-works" 
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div 
//             variants={slideInUp}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//               How It Works
//             </h2>
//             <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
//               Getting started with AdBridgeDZ is simple and straightforward. Follow these easy steps to launch your advertising campaign.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-3 gap-8 relative">
//             {/* Connecting Line */}
//             <motion.div 
//               initial={{ scaleX: 0 }}
//               whileInView={{ scaleX: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, delay: 0.3 }}
//               className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transform -translate-y-1/2 origin-left"
//             />

//             {/* Step 1 */}
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5, scale: 1.05 }}
//               className="relative group text-center"
//             >
//               <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
//                 <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
//                   1
//                 </div>
//                 <div className="flex items-center gap-3 mb-4 justify-center">
//                   <Users className="w-8 h-8 text-blue-600" />
//                   <h3 className="text-xl font-bold text-gray-900">Create Account</h3>
//                 </div>
//                 <p className="text-gray-700 leading-relaxed font-light">
//                   Sign up as an advertiser looking for spaces or as an agency managing locations. 
//                   Complete your profile in just a few minutes.
//                 </p>
//               </div>
//             </motion.div>

//             {/* Step 2 */}
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5, scale: 1.05 }}
//               className="relative group text-center"
//             >
//               <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
//                 <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
//                   2
//                 </div>
//                 <div className="flex items-center gap-3 mb-4 justify-center">
//                   <Search className="w-8 h-8 text-teal-600" />
//                   <h3 className="text-xl font-bold text-gray-900">Find & Compare</h3>
//                 </div>
//                 <p className="text-gray-700 leading-relaxed font-light">
//                   Browse available spaces, use filters to find perfect matches, and compare 
//                   options based on location, price, and features.
//                 </p>
//               </div>
//             </motion.div>

//             {/* Step 3 */}
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5, scale: 1.05 }}
//               className="relative group text-center"
//             >
//               <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
//                 <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
//                   3
//                 </div>
//                 <div className="flex items-center gap-3 mb-4 justify-center">
//                   <Calendar className="w-8 h-8 text-green-600" />
//                   <h3 className="text-xl font-bold text-gray-900">Book & Launch</h3>
//                 </div>
//                 <p className="text-gray-700 leading-relaxed font-light">
//                   Reserve your chosen space, upload your creative content, and launch your campaign. 
//                   Track performance in real-time.
//                 </p>
//               </div>
//             </motion.div>
//           </div>

//           {/* Additional Features */}
//           <motion.div 
//             variants={staggerContainer}
//             className="grid md:grid-cols-3 gap-8 mt-16"
//           >
//             {[
//               { icon: Clock, text: "Quick Setup", description: "Get your advertising campaign running in less than 24 hours" },
//               { icon: Shield, text: "Secure Payments", description: "All transactions are secure and protected with encryption" },
//               { icon: TrendingUp, text: "Performance Tracking", description: "Monitor your campaign performance with detailed analytics" }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ y: -5, scale: 1.05 }}
//                 className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
//               >
//                 <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-2xl mb-4">
//                   <feature.icon className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h4 className="font-bold text-gray-900 mb-2">{feature.text}</h4>
//                 <p className="text-gray-700 font-light text-sm">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* CTA Section */}
//       <motion.section 
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         variants={fadeIn}
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-teal-600"
//       >
//         <motion.div 
//           variants={scaleIn}
//           className="max-w-4xl mx-auto text-center"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
//             Ready to Transform Your Advertising?
//           </h2>
//           <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
//             Join the platform that connects businesses with premium advertising spaces across Algeria.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button
//               size="lg"
//               className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
//               onClick={() => router.push('/account-type')}
//             >
//               Start Your Journey
//             </Button>
//             <a href="#explore-spaces">
//               <Button
//                 size="lg"
//                 className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 Explore Spaces
//               </Button>
//             </a>
//           </div>
//         </motion.div>
//       </motion.section>

//       {/* Contact Section */}
//       <motion.section 
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//         variants={containerVariants}
//         id="contact"
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div 
//             variants={slideInUp}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//               Get In Touch
//             </h2>
//             <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
//               Have questions? We're here to help. Send us a message and we'll respond promptly.
//             </p>
//           </motion.div>

//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Contact Information */}
//             <motion.div 
//               variants={slideInLeft}
//               className="space-y-8"
//             >
//               <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

//                 <div className="space-y-6">
//                   {contactInfo.map((contact, index) => (
//                     <motion.div
//                       key={index}
//                       whileHover={{ x: 5, scale: 1.02 }}
//                       className={`flex items-start gap-4 p-4 rounded-2xl ${contact.hoverBgColor} transition-all duration-300 cursor-pointer`}
//                     >
//                       <div className={`flex items-center justify-center w-12 h-12 ${contact.bgColor} rounded-2xl`}>
//                         <contact.icon className={`w-6 h-6 ${contact.iconColor}`} />
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-gray-900 mb-1">{contact.text}</h4>
//                         <a href={contact.text === "Email" ? `mailto:${contact.value}` : contact.text === "Phone" ? `tel:${contact.value}` : "#"} 
//                            className="text-blue-600 hover:text-blue-700 font-medium">
//                           {contact.value}
//                         </a>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <div className="mt-8 pt-6 border-t border-gray-200">
//                   <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
//                   <div className="flex gap-4">
//                     {socialMedia.map((social) => (
//                       <a 
//                         key={social.name}
//                         href="#" 
//                         className="text-gray-400 transition-colors duration-200 transform hover:scale-110"
//                         onMouseEnter={() => setHoveredSocial(social.name)}
//                         onMouseLeave={() => setHoveredSocial(null)}
//                         style={{ 
//                           color: hoveredSocial === social.name ? 
//                             (social.name === 'facebook' ? '#2563eb' : 
//                              social.name === 'twitter' ? '#60a5fa' : '#1d4ed8') : '#9ca3af'
//                         }}
//                       >
//                         <social.icon className="w-6 h-6" />
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Contact Form */}
//             <motion.div 
//               variants={slideInLeft}
//               className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200"
//             >
//               <form onSubmit={handleContactSubmit} className="space-y-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
//                     Full Name
//                   </label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={contactForm.name}
//                     onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
//                     placeholder="Enter your full name"
//                     className="w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
//                     Email Address
//                   </label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={contactForm.email}
//                     onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
//                     placeholder="your.email@example.com"
//                     className="w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
//                     Your Message
//                   </label>
//                   <Textarea
//                     id="message"
//                     value={contactForm.message}
//                     onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
//                     placeholder="Tell us how we can help you..."
//                     className="w-full min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300 resize-none"
//                     required
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl py-4 font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
//                 >
//                   Send Message
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </form>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Footer */}
//       <motion.footer 
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//         className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h4 className="font-bold text-gray-900 mb-4">AdBridgeDZ</h4>
//               <p className="text-gray-700 text-sm font-light">
//                 Algeria's premier digital marketplace for outdoor advertising, connecting businesses with premium billboard spaces.
//               </p>
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a href="#explore-spaces" className="text-gray-600 hover:text-blue-600 font-light">Explore Spaces</a>
//                 </li>
//                 <li>
//                   <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-light">How It Works</a>
//                 </li>
//                 <li>
//                   <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-light">Pricing</Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 mb-4">Company</h4>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <Link href="/about" className="text-gray-600 hover:text-blue-600 font-light">About</Link>
//                 </li>
//                 <li>
//                   <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-light">Contact</Link>
//                 </li>
//                 <li>
//                   <Link href="/blog" className="text-gray-600 hover:text-blue-600 font-light">Blog</Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a href="#" className="text-gray-600 hover:text-blue-600 font-light">Privacy Policy</a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-gray-600 hover:text-blue-600 font-light">Terms of Service</a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
//             <p className="font-light">&copy; 2024 AdBridgeDZ. All rights reserved.</p>
//             <div className="flex gap-4 mt-4 md:mt-0">
//               {socialMedia.map((social) => (
//                 <a 
//                   key={social.name}
//                   href="#" 
//                   className="text-gray-400 transition-colors duration-200 transform hover:scale-110"
//                   onMouseEnter={() => setHoveredSocial(social.name)}
//                   onMouseLeave={() => setHoveredSocial(null)}
//                   style={{ 
//                     color: hoveredSocial === social.name ? 
//                       (social.name === 'facebook' ? '#2563eb' : 
//                        social.name === 'twitter' ? '#60a5fa' : '#1d4ed8') : '#9ca3af'
//                   }}
//                 >
//                   <social.icon className="w-5 h-5" />
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </motion.footer>
//     </div>
//   )
// }


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
  Search,
  Calendar,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Star,
  ArrowUpRight,
  Eye,
  Building,
  Megaphone,
  Target,
  Heart,
  Clock,
  DollarSign
} from 'lucide-react'

// Animation variants
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
      ease: "easeOut"
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
      ease: "easeOut"
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
      ease: "easeOut"
    }
  }
}

const scaleIn = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
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

export default function HomePage() {
  const router = useRouter()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', contactForm)
    setContactForm({ name: '', email: '', message: '' })
    alert('Thank you for your message! We will get back to you soon.')
  }

  const advertisingSpaces = [
    {
      type: "Digital Billboards",
      locations: ["Algiers", "Oran", "Constantine"],
      features: ["HD Display", "24/7 Operation", "Remote Content Update"],
      price: "Starting from 15,000 DZD/week"
    },
    {
      type: "Traditional Billboards",
      locations: ["Highways", "City Centers", "Commercial Areas"],
      features: ["Various Sizes", "Prime Locations", "Long-term Contracts"],
      price: "Starting from 8,000 DZD/week"
    },
    {
      type: "Indoor Screens",
      locations: ["Shopping Malls", "Airports", "Business Centers"],
      features: ["Captive Audience", "High Frequency", "Targeted Demographics"],
      price: "Starting from 5,000 DZD/week"
    },
    {
      type: "Transport Advertising",
      locations: ["Buses", "Trams", "Taxis"],
      features: ["Mobile Exposure", "City-wide Coverage", "Multiple Routes"],
      price: "Starting from 3,000 DZD/week"
    }
  ]

  // Feature data with explicit color classes
  const features = [
    {
      icon: Eye,
      id: "visibility",
      text: "High Visibility",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      hoverBgColor: "hover:bg-blue-100"
    },
    {
      icon: Target,
      id: "targeting",
      text: "Precision Targeting",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      iconColor: "text-teal-600",
      hoverBgColor: "hover:bg-teal-100"
    },
    {
      icon: TrendingUp,
      id: "results",
      text: "Proven Results",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-600",
      hoverBgColor: "hover:bg-purple-100"
    },
    {
      icon: Shield,
      id: "verified",
      text: "Verified Partners",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      hoverBgColor: "hover:bg-green-100"
    }
  ]

  // Contact information data
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

  // Social media data
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
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Section */}
            <motion.div
              variants={slideInLeft}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 shadow-sm"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-blue-900">
                    Algeria's #1 Outdoor Advertising Platform
                  </span>
                </motion.div>
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight"
                >
                  Transform Your{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Outdoor Ads
                  </span>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light"
                >
                  Connect, discover, and book premium billboard spaces across Algeria with our digital marketplace.
                </motion.p>
              </div>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-2xl px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => router.push('/account-type')}
                >
                  Get Started Free
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
                <Link href="/login" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 rounded-2xl px-10 py-7 text-lg font-semibold transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-6 pt-4 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Free forever</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Section - Hero illustration */}
            <motion.div
              variants={scaleIn}
              className="relative flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-teal-200 rounded-3xl blur-3xl opacity-30"></div>
              <img
                src="/hero_illustration.png"
                alt="Outdoor advertising illustration"
                className="relative w-full max-w-lg lg:max-w-xl object-contain transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Value Proposition Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={slideInUp}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Showcase your brand{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    where people actually look
                  </span>
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed font-light">
                  Discover premium advertising spaces across Algeria — from strategic billboards to high-traffic
                  indoor screens — all in one smart, modern platform designed to help your business grow and
                  connect with your target audience effectively.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600 font-light">Premium Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">200+</div>
                  <div className="text-gray-600 font-light">Verified Agencies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                  <div className="text-gray-600 font-light">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-gray-600 font-light">Support</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Account Type Cards */}
            <motion.div
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* Agency Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Advertising Agency</h3>
                    <p className="text-gray-700 leading-relaxed mb-6 font-light">
                      List your advertising spaces, reach more clients, and grow your business. Manage your inventory and bookings efficiently with our powerful tools.
                    </p>
                    <Button
                      onClick={() => router.push('/account-type?type=agency')}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 group"
                    >
                      Register as Agency
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Company Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-3xl p-8 hover:border-teal-300 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Company</h3>
                    <p className="text-gray-700 leading-relaxed mb-6 font-light">
                      Find the perfect advertising spaces for your brand. Compare locations, prices, and traffic data to make informed decisions that drive results.
                    </p>
                    <Button
                      onClick={() => router.push('/account-type?type=company')}
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 group"
                    >
                      Register as Company
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Purpose/Description Section */}
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Revolutionizing Outdoor Advertising
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              AdBridgeDZ is transforming Algeria's advertising landscape with a seamless digital marketplace
              where businesses and agencies connect to discover and book premium billboard spaces effortlessly.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-blue-50 border border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Premium Spaces</h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Browse hundreds of verified outdoor advertising locations with detailed analytics,
                real-time availability, and competitive pricing.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-teal-50 border border-teal-100 hover:border-teal-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Partners</h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Every agency and provider is thoroughly vetted for reliability,
                ensuring quality service and peace of mind for your campaigns.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-purple-50 border border-purple-100 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Maximize ROI</h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Compare locations, traffic data, and pricing to make data-driven decisions
                that maximize your advertising return on investment.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Explore Spaces Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        id="explore-spaces"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={slideInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Explore Advertising Spaces
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
              Discover the perfect advertising solution for your brand from our curated selection of premium spaces across Algeria.
            </p>
          </motion.div>

          {/* Quick Filter Buttons */}
          <motion.div
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {["All Spaces", "Digital Billboards", "Traditional Billboards", "Indoor Screens", "Transport Ads"].map((filter, index) => (
              <motion.div
                key={filter}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  {filter}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Spaces Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
          >
            {advertisingSpaces.map((space, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{space.type}</h3>
                    <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 font-medium">Available in:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {space.locations.map((location, locIndex) => (
                        <span key={locIndex} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 font-medium">Features:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {space.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-lg font-bold text-gray-900">{space.price}</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <Button
              onClick={() => router.push('/explore-spaces')}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-2xl px-8 py-4 font-semibold group"
            >
              View All Spaces
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={slideInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
              Getting started with AdBridgeDZ is simple and straightforward. Follow these easy steps to launch your advertising campaign.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transform -translate-y-1/2 origin-left"
            />

            {/* Step 1 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="relative group text-center"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  1
                </div>
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Create Account</h3>
                </div>
                <p className="text-gray-700 leading-relaxed font-light">
                  Sign up as an advertiser looking for spaces or as an agency managing locations.
                  Complete your profile in just a few minutes.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="relative group text-center"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  2
                </div>
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Search className="w-8 h-8 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">Find & Compare</h3>
                </div>
                <p className="text-gray-700 leading-relaxed font-light">
                  Browse available spaces, use filters to find perfect matches, and compare
                  options based on location, price, and features.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="relative group text-center"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  3
                </div>
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Book & Launch</h3>
                </div>
                <p className="text-gray-700 leading-relaxed font-light">
                  Reserve your chosen space, upload your creative content, and launch your campaign.
                  Track performance in real-time.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Additional Features */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { icon: Clock, text: "Quick Setup", description: "Get your advertising campaign running in less than 24 hours" },
              { icon: Shield, text: "Secure Payments", description: "All transactions are secure and protected with encryption" },
              { icon: TrendingUp, text: "Performance Tracking", description: "Monitor your campaign performance with detailed analytics" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-2xl mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{feature.text}</h4>
                <p className="text-gray-700 font-light text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-teal-600"
      >
        <motion.div
          variants={scaleIn}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Advertising?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the platform that connects businesses with premium advertising spaces across Algeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push('/account-type')}
            >
              Start Your Journey
            </Button>
            <a href="#explore-spaces">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Spaces
              </Button>
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50"
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
              Have questions? We're here to help. Send us a message and we'll respond promptly.
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