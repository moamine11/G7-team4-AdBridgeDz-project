'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, Settings, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Channel {
  id: string
  title: string
  description: string
  image: string
  agenciesCount: number
  category: string
}

const channels: Channel[] = [
  {
    id: '1',
    title: 'Billboard & Roadside Advertising',
    description: 'Highway Billboards, City Center Billboards, Illuminated Billboards, Bridge Panels',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOlvQ84WI02qwqswgawg5_hpfHjMB8wisQ8GG1KEN9TY2dalUf46Fx-Z9-03yiyqaUeKqKuCvCPNcmT_U11TZTyaCMisX6phoh-ZjxyBK3nWgdvmDXOC-DQHx7ye8GAX8CQ7NIvORJ3sRTrlO_KsIxtXeYzGvKCkWZkQg1Bf_2QjTk6a7cvqqr121JR167PcMM0DgVmmq64tuiK6HauH0GJIPb8SMqge8PM70gBCjW6Rb29_cHqv804wq7jw-3tUMV1b2E6UiHWPo',
    agenciesCount: 28,
    category: 'outdoor'
  },
  {
    id: '2',
    title: 'Digital Outdoor Screens (DOOH)',
    description: 'LED Screens, Digital Totems, Smart Displays',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrO2yX1Y9q1-LiDKfNDZpGYD4cVasECTXqos5Tv32Mgh2tcOgJjkg0kL6MFaIS24-l7fgHhTZFyvMJu9dLY4YH9Ptm7BxXfoc9Ax3-9v5fHh4mHtND6MzPXH-KvrGLAoh4egmSpbAmmi5HxURaswBsujY3ap5dk8_oBTcnDSqAgifPodqee19VfcSKLbLcgexhlPvNBaDqJ7dpW8kGcJG_3_ba6_JuHv9m8hZid0rOaAwHTT1uj58xIgzEzeKys2kbcMPCjvNO6Q4',
    agenciesCount: 19,
    category: 'digital'
  },
  {
    id: '3',
    title: 'Transit Advertising',
    description: 'Bus Ads, Taxi Branding, Tram & Metro Ads',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd1QiYeh9QoEavvZLOogc7AaTy1T3-ZP0zCdyuv7SvxUyphcd-Kb-4a9rAcb0PFz3MUEkaWQvYnZNYm8M62XKFJTucokVFMuyPJxm_qm0EiSK9ep_Luezt-sHyECoyizRmE7d58uu-tnXx95ioySGSHF8MKUjVtNTFfwLJBIPsTw2xP8P7OTzcOnn0fAvWujyi_l08RmU-ZZr5fkIRB6yrZ2g-uLVJ8Vv5MAYQs_j9KTIsUhzPGTmrJox1-uc-WcHDsKV1wJpiLco',
    agenciesCount: 15,
    category: 'transit'
  },
  {
    id: '4',
    title: 'Street Furniture Advertising',
    description: 'Bus Shelters, Benches, Kiosks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-aK0FP6SF0ZZa7jrKiMtvpSAN93RwMmlwnw4sYNBNdzAT-Eq6RX86wZOOiTSwMKgZV6AYMbYVgel8VntHUiKMtOHpl9jpuRoAYIH8iwPmzWqLAXJnJrXimFZKffeHAKKik83vQHETAee0_3FS90FRzHXTeyENNf1coP2qrXZ_nwT2kYa86vmkzAUCfv3ydImuHIy1owga2qMikzkK4danran3xmbEV8__tJOD8tRiySnEcWjDVtJlwAI_uLKWxSv9vfWLdKzduqA',
    agenciesCount: 12,
    category: 'outdoor'
  },
  {
    id: '5',
    title: 'Indoor Commercial Advertising',
    description: 'Mall Displays, Cinema Ads, Retail Screens',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4IpbNHFsvEi0u31dCyf5Q2jQgxubiMjLUKW_kV1mOf2D1ITn0JuOSMoGYs_oyve82XXI2W1VLYO3AzpwMbJiyQ9eKQQO2Qx5Fobk7V0PNTsOibSatSjorDTJXxrgCDGOCPpiW28q51SDnlHprKULrvhQUVpgVJjB8BGz3SI6Q2MZPSNykfQVkwsCt0JgqiOtPamZwusUyFoVcjQ1npXvPOY8S2Sqm7v-tmMifx9sdHKVp6Dn2Iyk06hVOapT-HGLA-N4Stl1b4lA',
    agenciesCount: 14,
    category: 'indoor'
  },
  {
    id: '6',
    title: 'Event & Temporary Advertising',
    description: 'Booths, Pop-ups, Festivals',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hLOaEd8AjfYQ-_aQrd8BEGZ-YdxeX1HdWR4w7irQF0bpy2j9MTdhdk8apPQq7cfMxxyylKgBIefJftIent1xwgJAQeD93B3kBHhwuxqZI7AkGaU-xdyAnyZllYPTCd1lEI4Jvncz56K_fwpOyUqd6TjputS8jXMjdu0I-Y5OmoaE_7q50Fgn9q0grzi3-Sop0UBi8KyM-STY_2x4P-qCREdIUKSe5bWcqMK6i2X3fA0bncJ8B5gHGsDfjqkUzPf-Dq7FGYF0cWc',
    agenciesCount: 9,
    category: 'event'
  },
  {
    id: '7',
    title: 'Creative & Production Services',
    description: 'Design, Printing, Installation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFEiG2UrPBvj0Ou3em7-70RfybGGrE0W9GxjPRcaGyZLeXcU5P9vCDLxJ7B78rWh6Wpml8xMuG5qrWGZhBSSRCqdQEXGB1os7Xs9lNHdswmAIUF6yPubIzDoxRCnIwbYTFr3riu9sP5XYg94Mo-prSgmqIqNpH5XgWqWXEvDcWRtkziqrm7t0SnS3VKqtRm02Z8MAWfiv48Y9KUKBHpVR0P_d9p169gyLqMIJs7zLMHMpNuhNdXUnTH2ohIZdBJKDKzfCl8YCZem8',
    agenciesCount: 22,
    category: 'premium'
  },
  {
    id: '8',
    title: 'Premium Ad Locations',
    description: 'Airports, Stadiums, Landmark Displays',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6PE4nTWGyP7v1OidxpqYthq1c-AOr4ECPLd4dPlQsYGxPkkJcbHOuxYXe_cS2q4MnZ-O9x1DqkR-3_5BRYF2r5C7xY-w8UrTJI72vrR7VNyYKWsfvRDkwmz0NHRSIJ9_x4JNDDauyd5M3oTKE0ItpaukMM5iZ-mnEvVoSHSJwMLfv_yG_oUYNDVsJz2filueB11uVCLv6shw68DrOyEoBUu9tlK70JaErOg5f1BjIml18MEvfvmC-t0yvGMpqBh-UHhG4h9nTN8Y',
    agenciesCount: 7,
    category: 'premium'
  },
  {
    id: '9',
    title: 'Digital Advertising (Online)',
    description: 'Social Media Ads, Google Ads, Video Ads',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9XGASdTS22TzqW2s5A07x8IvhylX0XEHIdzuBmE8o009GfCpWShkwFRVxBUDL-wYn-t89pEMc72ZSg54jYCMyoBOaEKTypKk2rYvXOpqZoXdeQVCtLVKGbN8GyMWs6xTd4iP6eIoMPFFfkcjE16E-RZonN8JhHe03RB_jPZ6h_eqtA5k7rGTrvtDnesB9l1IvHsaY_GFzyB6j3thV685RudD5k4n77A9GfRcU8GdBpBlWHlCBza-qkyxQNAJHmpDjZJ_wivUJUYc',
    agenciesCount: 30,
    category: 'digital'
  }
]

const categories = [
  { id: 'all', label: 'All' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'digital', label: 'Digital' },
  { id: 'transit', label: 'Transit' },
  { id: 'indoor', label: 'Indoor' },
  { id: 'event', label: 'Event' },
  { id: 'premium', label: 'Premium' }
]

export default function AdvertisingChannelsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChannels = channels.filter((channel) => {
    const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory
    const matchesSearch = 
      channel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleChannelClick = (channelId: string) => {
    router.push(`/agencies?channel=${channelId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white">
      {/* Header with Search */}
      <header className="sticky top-0 z-40 w-full border-b border-blue-100/80 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center group -ml-2 flex-shrink-0">
              <div className="relative">
                <img
                  src="/Adbridgelogo.png"
                  alt="AdBridgeDZ"
                  className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                  style={{ transform: 'scale(2)', transformOrigin: 'left center' }}
                />
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search advertising spaces or agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <Link href="/login">
                <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  <img
                    alt="User profile avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVp1IbSrlohcNvo4Z_znB1Dl1Nf84t93pIIkn8B-CsCQW4jdWABgiEjFgOLlF-C36AXH5FH52ZP46dRSeEnkX_6DjFhnjI0pkXTVqbtiWkgB0VCCreCj4jtwRen5pl0035J2glUMZ2Vy0pRgzseHtdyn2oThUnIcDwp5V7C-zToF-JlJcBwrGcPanXgO6V92lRcuvB_W8dOTciQ9_RS3t4dE79y1IRDmYQ2ru_0hR25GTYjK-W_kezQMOuoVZCWk8d8YrZtCvZDOA"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Page Header */}
        <section className="text-center mb-10 lg:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Advertising Channel
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the type of advertising space you need. Explore categories and connect with verified Algerian agencies.
          </p>
        </section>

        {/* Category Filters */}
        <section className="mb-10 lg:mb-12">
          <div className="relative">
            <div className="flex space-x-2 overflow-x-auto pb-4 justify-center scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex-shrink-0 px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/25"
                      : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-teal-300"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Channels Grid */}
        <section>
          {filteredChannels.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No channels found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id)}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/40 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      alt={channel.title}
                      src={channel.image}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/Adbridgelogo.png'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {channel.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {channel.description}
                    </p>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {channel.agenciesCount} {channel.agenciesCount === 1 ? 'Agency' : 'Agencies'}
                      </span>
                      <span className="font-semibold text-teal-600 group-hover:text-teal-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

