'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { postsService } from '@/lib/services/posts-service'
import { bookingsService } from '@/lib/services/bookings-service'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'

interface BookSpacePageProps {
  spaceId?: string
}

export default function BookSpacePage({ spaceId }: BookSpacePageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  
  const [space, setSpace] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [campaignName, setCampaignName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const fetchSpace = async () => {
      if (!spaceId) return
      try {
        const data = await postsService.getPostById(spaceId)
        setSpace(data)
      } catch (error) {
        console.error('Failed to fetch space:', error)
        toast({
          title: "Error",
          description: "Failed to load space details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSpace()
  }, [spaceId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book a space.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    if (!startDate || !endDate) {
      toast({
        title: "Dates required",
        description: "Please select start and end dates.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await bookingsService.createBooking({
        post: spaceId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        campaignName, // Assuming backend accepts this or description
        notes: description // Assuming backend accepts this
      })
      
      toast({
        title: "Success",
        description: "Booking request sent successfully!",
      })
      router.push('/dashboard/bookings') // Redirect to company bookings
    } catch (error) {
      console.error('Booking failed:', error)
      toast({
        title: "Error",
        description: "Failed to submit booking request.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    )
  }

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Space not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-64 bg-gray-200">
            <img 
              src={space.images && space.images.length > 0 ? space.images[0] : '/placeholder-space.jpg'} 
              alt={space.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/placeholder-space.jpg'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold">{space.title}</h1>
              <p className="text-lg opacity-90">{space.city}, {space.address}</p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Price</p>
                <p className="text-2xl font-bold text-teal-600">{space.price} DZD <span className="text-sm text-gray-400 font-normal">/ day</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Type</p>
                <p className="text-lg font-medium text-gray-900">{space.type}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <Input 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Sale 2025"
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your campaign goals or any specific requirements..."
                  className="h-32"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking Request'
                  )}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  You won't be charged yet. The agency will review your request.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
