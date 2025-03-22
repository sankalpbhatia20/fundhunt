'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Upload, Link as LinkIcon, Building, Users, DollarSign } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { signIn } from 'next-auth/react'

const FUNDING_STAGES = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Growth",
  "Bridge"
]

const INDUSTRIES = [
  "SaaS",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "AI/ML",
  "Clean Tech",
  "EdTech",
  "Hardware",
  "Consumer",
  "Enterprise",
  "Other"
]

const FOUNDER_ASSESSMENT = [
  {
    id: 'resilience',
    question: "Your startup's biggest client just cancelled their contract. What's your first reaction?",
    type: "select",
    options: [
      "Immediately start planning how to replace the lost revenue",
      "Take time to analyze what went wrong and learn from it",
      "Focus on reassuring the team and maintaining morale",
      "Look for ways to win the client back"
    ]
  },
  {
    id: 'innovation',
    question: "A competitor just launched a similar product at half your price. Your response?",
    type: "select",
    options: [
      "Double down on premium features to justify our price",
      "Rapidly iterate to find new differentiation points",
      "Explore completely different market segments",
      "Reduce costs to match their pricing"
    ]
  },
  {
    id: 'leadership',
    question: "Your team strongly disagrees with your product vision. How do you handle it?",
    type: "select",
    options: [
      "Open a detailed discussion to understand their perspective",
      "Stand firm if you truly believe in your vision",
      "Find a middle ground that incorporates both views",
      "Let the team test their approach first"
    ]
  },
  {
    id: 'risk_tolerance',
    question: "You have an opportunity to 10x growth but it requires using 70% of your runway. What do you do?",
    type: "select",
    options: [
      "Take the risk if the data supports the opportunity",
      "Test the approach with 20% of runway first",
      "Look for ways to achieve similar growth more gradually",
      "Pass and focus on sustainable growth"
    ]
  },
  {
    id: 'adaptability',
    question: "Your core technology becomes obsolete due to a new innovation. Your next step?",
    type: "select",
    options: [
      "Rapidly pivot to incorporate the new technology",
      "Focus on aspects of your business that remain valuable",
      "Partner with companies using the new technology",
      "Double down on your existing customers' needs"
    ]
  }
]

const STEPS = [
  { id: 1, title: "Founder Details" },
  { id: 2, title: "Company Basics" },
  { id: 3, title: "Team & Traction" },
  { id: 4, title: "Investment Details" },
  { id: 5, title: "Founder Assessment" }
]

export default function SubmitStartup() {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/auth/signin')
    },
  })
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Founder Details (Primary founder/CEO)
    founderDetails: {
      name: '',
      role: 'CEO & Co-founder',
      email: '',
      phone: '',
      linkedin: '',
      background: '',
      experience: '',
      previousExits: '',
      education: '',
      achievements: '',
    },
    
    // Additional Co-founders - Initialize as an empty array
    coFounders: [],

    // Company Basics
    companyName: '',
    tagline: '',
    description: '',
    detailedDescription: '',
    industry: '',
    website: '',
    linkedinUrl: '',
    twitterUrl: '',
    location: '',
    founded: '',
    
    // Team & Traction
    teamSize: '',
    monthlyRevenue: '',
    monthlyGrowth: '',
    keyMetrics: '',
    highlights: ['', '', ''], // Allow up to 3 key highlights
    techStack: '',
    competitors: '',
    competitiveAdvantage: '',
    
    // Investment Details
    fundingStage: '',
    fundingAmount: '',
    previousFunding: '',
    currentInvestors: '',
    valuation: '',
    runwayMonths: '',
    useOfFunds: '',
    exitStrategy: '',
    
    // Founder Assessment
    resilience: '',
    innovation: '',
    leadership: '',
    risk_tolerance: '',
    adaptability: ''
  })

  // Add function to handle adding co-founders
  const addCoFounder = () => {
    setFormData(prev => ({
      ...prev,
      coFounders: [
        ...prev.coFounders,
        {
          name: '',
          role: '',
          email: '',
          phone: '',
          linkedin: '',
          background: '',
          experience: '',
          education: '',
        }
      ]
    }))
  }

  // Add function to handle removing co-founders
  const removeCoFounder = (index) => {
    setFormData(prev => ({
      ...prev,
      coFounders: prev.coFounders.filter((_, i) => i !== index)
    }))
  }

  // Update the updateForm function to handle nested arrays
  const updateForm = (field, value, index = null) => {
    setFormData(prev => {
      // Handle co-founder array updates
      if (field.startsWith('coFounders.') && index !== null) {
        const [_, nestedField] = field.split('.')
        const updatedCoFounders = [...prev.coFounders]
        updatedCoFounders[index] = {
          ...updatedCoFounders[index],
          [nestedField]: value
        }
        return {
          ...prev,
          coFounders: updatedCoFounders
        }
      }
      
      // Handle nested fields
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }
      }
      
      // Handle regular fields
      return { ...prev, [field]: value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/startups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: "Your startup has been submitted successfully. We'll review it shortly.",
        })
        router.push(`/startups/${data.startupId}`)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit startup. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('google', { 
        redirect: false
      })
      if (result?.ok) {
        router.push('/submit-startup')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive"
      })
    }
    setIsLoading(false)
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Primary Founder Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name *"
                  value={formData.founderDetails.name}
                  onChange={(e) => updateForm('founderDetails.name', e.target.value)}
                  required
                />
                <Input
                  placeholder="Email *"
                  type="email"
                  value={formData.founderDetails.email}
                  onChange={(e) => updateForm('founderDetails.email', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  value={formData.founderDetails.phone}
                  onChange={(e) => updateForm('founderDetails.phone', e.target.value)}
                />
                <Input
                  placeholder="LinkedIn Profile *"
                  type="url"
                  value={formData.founderDetails.linkedin}
                  onChange={(e) => updateForm('founderDetails.linkedin', e.target.value)}
                  required
                />
              </div>

              <Textarea
                placeholder="Professional Background *"
                value={formData.founderDetails.background}
                onChange={(e) => updateForm('founderDetails.background', e.target.value)}
                className="h-24"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Years of Experience"
                  type="number"
                  value={formData.founderDetails.experience}
                  onChange={(e) => updateForm('founderDetails.experience', e.target.value)}
                />
                <Input
                  placeholder="Previous Exits (if any)"
                  value={formData.founderDetails.previousExits}
                  onChange={(e) => updateForm('founderDetails.previousExits', e.target.value)}
                />
              </div>

              <Input
                placeholder="Education"
                value={formData.founderDetails.education}
                onChange={(e) => updateForm('founderDetails.education', e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Co-founders</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCoFounder}
                >
                  Add Co-founder
                </Button>
              </div>

              {formData.coFounders.map((coFounder, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Co-founder {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCoFounder(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name *</label>
                      <Input
                        value={coFounder.name}
                        onChange={(e) => updateForm(`coFounders.${index}.name`, e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        type="email"
                        value={coFounder.email}
                        onChange={(e) => updateForm(`coFounders.${index}.email`, e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        type="tel"
                        value={coFounder.phone}
                        onChange={(e) => updateForm(`coFounders.${index}.phone`, e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">LinkedIn Profile *</label>
                      <Input
                        type="url"
                        value={coFounder.linkedin}
                        onChange={(e) => updateForm(`coFounders.${index}.linkedin`, e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Professional Background *</label>
                      <Textarea
                        value={coFounder.background}
                        onChange={(e) => updateForm(`coFounders.${index}.background`, e.target.value)}
                        className="h-24"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Years of Experience</label>
                      <Input
                        type="number"
                        value={coFounder.experience}
                        onChange={(e) => updateForm(`coFounders.${index}.experience`, e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Education</label>
                      <Input
                        value={coFounder.education}
                        onChange={(e) => updateForm(`coFounders.${index}.education`, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <Input
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => updateForm('companyName', e.target.value)}
              />
              <Input
                placeholder="Tagline - One sentence description"
                value={formData.tagline}
                onChange={(e) => updateForm('tagline', e.target.value)}
              />
              <Textarea
                placeholder="Brief description of your company"
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                className="h-24"
              />
              <Textarea
                placeholder="Detailed description of your product, market, and business model"
                value={formData.detailedDescription}
                onChange={(e) => updateForm('detailedDescription', e.target.value)}
                className="h-32"
              />
              <Select
                value={formData.industry}
                onValueChange={(value) => updateForm('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) => updateForm('website', e.target.value)}
                  type="url"
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={formData.linkedinUrl}
                  onChange={(e) => updateForm('linkedinUrl', e.target.value)}
                  type="url"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => updateForm('location', e.target.value)}
                />
                <Input
                  placeholder="Founded Year"
                  value={formData.founded}
                  onChange={(e) => updateForm('founded', e.target.value)}
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Team & Traction</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Team Size *</label>
                <Input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => updateForm('teamSize', e.target.value)}
                  placeholder="e.g., 10"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Monthly Revenue</label>
                <Input
                  value={formData.monthlyRevenue}
                  onChange={(e) => updateForm('monthlyRevenue', e.target.value)}
                  placeholder="e.g., $50,000"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Monthly Growth (%)</label>
                <Input
                  value={formData.monthlyGrowth}
                  onChange={(e) => updateForm('monthlyGrowth', e.target.value)}
                  placeholder="e.g., 15"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Investment Requirements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={formData.fundingStage}
                  onValueChange={(value) => updateForm('fundingStage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Funding Stage *" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUNDING_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Raising Amount (USD) *"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.fundingAmount}
                  onChange={(e) => updateForm('fundingAmount', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Current Valuation (USD)"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.valuation}
                  onChange={(e) => updateForm('valuation', e.target.value)}
                />
                
                <Input
                  placeholder="Target Valuation (USD)"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.targetValuation}
                  onChange={(e) => updateForm('targetValuation', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Number of Current Investors"
                  type="number"
                  min="0"
                  value={formData.currentInvestorCount}
                  onChange={(e) => updateForm('currentInvestorCount', e.target.value)}
                />
                
                <Input
                  placeholder="Minimum Investment (USD)"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.minimumInvestment}
                  onChange={(e) => updateForm('minimumInvestment', e.target.value)}
                />
              </div>

              <Textarea
                placeholder="Current Investors (Optional - List notable investors)"
                value={formData.currentInvestors}
                onChange={(e) => updateForm('currentInvestors', e.target.value)}
                className="h-24"
              />

              <Textarea
                placeholder="Use of Funds *"
                value={formData.useOfFunds}
                onChange={(e) => updateForm('useOfFunds', e.target.value)}
                className="h-24"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Runway (months)"
                  type="number"
                  min="0"
                  value={formData.runwayMonths}
                  onChange={(e) => updateForm('runwayMonths', e.target.value)}
                />
                
                <Input
                  placeholder="Previous Funding Raised (USD)"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.previousFunding}
                  onChange={(e) => updateForm('previousFunding', e.target.value)}
                />
              </div>

              <Textarea
                placeholder="Exit Strategy"
                value={formData.exitStrategy}
                onChange={(e) => updateForm('exitStrategy', e.target.value)}
                className="h-24"
              />
            </div>
          </motion.div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-900">Founder Assessment</h3>
              <p className="text-gray-600">
                Help us understand your approach to entrepreneurship. There are no right or wrong answers.
              </p>
            </div>

            {FOUNDER_ASSESSMENT.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <label className="text-sm font-medium text-gray-900 mb-3 block">
                  {question.question}
                </label>
                <Select
                  value={formData[question.id]}
                  onValueChange={(value) => updateForm(question.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your approach..." />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options.map((option, i) => (
                      <SelectItem key={i} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            ))}
          </div>
        )
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-blue-900">List Your Startup</CardTitle>
                    <CardDescription className="text-blue-600">
                      {STEPS[currentStep - 1].title}
                    </CardDescription>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    Step {currentStep} of {STEPS.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {renderStep()}
                  
                  <div className="flex justify-between pt-8 border-t">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                      >
                        Back
                      </Button>
                    )}
                    
                    <Button
                      type={currentStep === STEPS.length ? "submit" : "button"}
                      onClick={currentStep === STEPS.length ? undefined : () => setCurrentStep(prev => prev + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {currentStep === STEPS.length ? "Submit" : "Next"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Progress Indicators */}
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <motion.div
                  key={step}
                  className={`h-2 w-16 rounded-full ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-blue-100'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: step * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
} 