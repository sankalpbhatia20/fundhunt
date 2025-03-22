'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Download, Edit, Mail, Twitter, Linkedin, Copy, Edit2, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Add this helper function at the top level
const getRiskScoreColor = (score) => {
  if (score >= 80) return 'bg-red-500'
  if (score >= 60) return 'bg-orange-500'
  if (score >= 40) return 'bg-yellow-500'
  if (score >= 20) return 'bg-blue-500'
  return 'bg-green-500'
}

// Mock data for clients with more details
const mockClients = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '+1 234-567-8900',
    riskAssessment: 'Moderate',
    riskScore: 65,
    lastUpdate: '2024-01-15',
    nextAssessment: '2024-07-15',
    investmentGoals: 'Retirement planning',
    occupation: 'Software Engineer'
  },
  // ... other clients
]

const getRiskColor = (risk) => {
  switch (risk.toLowerCase()) {
    case 'conservative': return 'text-blue-600 bg-blue-50'
    case 'moderate': return 'text-yellow-600 bg-yellow-50'
    case 'aggressive': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

// Modify MarketingSection to accept activeSection prop
const MarketingSection = ({ activeSection }) => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Social Media Marketing Content</CardTitle>
          <CardDescription>Ready-to-share content for social media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LinkedIn Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Linkedin className="h-5 w-5 text-[#0077b5]" />
                <h3 className="font-semibold text-lg">LinkedIn Posts</h3>
              </div>
              
              {/* Thought Leadership */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Thought Leadership</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableContent
                    content={`🎯 Investment Insight: In today's market landscape, strategic portfolio diversification remains crucial. Our latest analysis reveals that balanced portfolios with proper risk management have shown remarkable resilience.

Key takeaways:
• Risk-adjusted returns outperforming benchmarks
• Strategic asset allocation driving consistent growth
• Long-term perspective yielding optimal results

#WealthManagement #InvestmentStrategy #FinancialPlanning`}
                    isEmailTemplate={false}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={() => shareToLinkedIn(`🎯 Investment Insight: In today's market landscape, strategic portfolio diversification remains crucial. Our latest analysis reveals that balanced portfolios with proper risk management have shown remarkable resilience.

Key takeaways:
• Risk-adjusted returns outperforming benchmarks
• Strategic asset allocation driving consistent growth
• Long-term perspective yielding optimal results

#WealthManagement #InvestmentStrategy #FinancialPlanning`)}
                      className="bg-[#0077b5] hover:bg-[#006396]"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`🎯 Investment Insight: In today's market landscape, strategic portfolio diversification remains crucial. Our latest analysis reveals that balanced portfolios with proper risk management have shown remarkable resilience.

Key takeaways:
• Risk-adjusted returns outperforming benchmarks
• Strategic asset allocation driving consistent growth
• Long-term perspective yielding optimal results

#WealthManagement #InvestmentStrategy #FinancialPlanning`);
                        toast({
                          title: "Copied",
                          description: "Content copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Market Update */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Market Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableContent
                    content={`📊 Market Update: Our latest analysis shows interesting trends in portfolio performance:

• Diversified portfolios showing strong resilience
• Alternative investments providing key advantages
• Risk management strategies paying off

Connect with me to learn how we can help optimize your investment strategy.

#MarketInsights #WealthManagement #InvestmentStrategy`}
                    isEmailTemplate={false}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={() => shareToLinkedIn(`📊 Market Update: Our latest analysis shows interesting trends in portfolio performance:

• Diversified portfolios showing strong resilience
• Alternative investments providing key advantages
• Risk management strategies paying off

Connect with me to learn how we can help optimize your investment strategy.

#MarketInsights #WealthManagement #InvestmentStrategy`)}
                      className="bg-[#0077b5] hover:bg-[#006396]"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`📊 Market Update: Our latest analysis shows interesting trends in portfolio performance:

• Diversified portfolios showing strong resilience
• Alternative investments providing key advantages
• Risk management strategies paying off

Connect with me to learn how we can help optimize your investment strategy.

#MarketInsights #WealthManagement #InvestmentStrategy`);
                        toast({
                          title: "Copied",
                          description: "Content copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Twitter Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                <h3 className="font-semibold text-lg">Twitter Posts</h3>
              </div>
              
              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableContent
                    content={`💡 Pro Tip: The key to long-term investment success isn't timing the market, it's time IN the market.

Data shows: Consistent investors outperform market timers by 2x.

#InvestingTips #WealthManagement`}
                    isEmailTemplate={false}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={() => shareToTwitter(`💡 Pro Tip: The key to long-term investment success isn't timing the market, it's time IN the market.

Data shows: Consistent investors outperform market timers by 2x.

#InvestingTips #WealthManagement`)}
                      className="bg-[#1DA1F2] hover:bg-[#1a94da]"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Share on Twitter
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`💡 Pro Tip: The key to long-term investment success isn't timing the market, it's time IN the market.

Data shows: Consistent investors outperform market timers by 2x.

#InvestingTips #WealthManagement`);
                        toast({
                          title: "Copied",
                          description: "Content copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableContent
                    content={`📈 Market Snapshot:
• Global markets showing resilience
• Tech sector leading gains
• Bond yields stabilizing

Key focus: Strategic asset allocation remains crucial.

#MarketUpdate #InvestmentStrategy`}
                    isEmailTemplate={false}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={() => shareToTwitter(`📈 Market Snapshot:
• Global markets showing resilience
• Tech sector leading gains
• Bond yields stabilizing

Key focus: Strategic asset allocation remains crucial.

#MarketUpdate #InvestmentStrategy`)}
                      className="bg-[#1DA1F2] hover:bg-[#1a94da]"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Share on Twitter
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`📈 Market Snapshot:
• Global markets showing resilience
• Tech sector leading gains
• Bond yields stabilizing

Key focus: Strategic asset allocation remains crucial.

#MarketUpdate #InvestmentStrategy`);
                        toast({
                          title: "Copied",
                          description: "Content copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Educational Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableContent
                    content={`🎓 Investing 101:

3 Keys to Portfolio Success:
1. Diversification
2. Regular rebalancing
3. Long-term perspective

Want to learn more? Let's connect!

#FinancialEducation #InvestingBasics`}
                    isEmailTemplate={false}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={() => shareToTwitter(`🎓 Investing 101:

3 Keys to Portfolio Success:
1. Diversification
2. Regular rebalancing
3. Long-term perspective

Want to learn more? Let's connect!

#FinancialEducation #InvestingBasics`)}
                      className="bg-[#1DA1F2] hover:bg-[#1a94da]"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Share on Twitter
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`🎓 Investing 101:

3 Keys to Portfolio Success:
1. Diversification
2. Regular rebalancing
3. Long-term perspective

Want to learn more? Let's connect!

#FinancialEducation #InvestingBasics`);
                        toast({
                          title: "Copied",
                          description: "Content copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Update the EditableContent component
const EditableContent = ({ content, templateId, onEmailShare, isEmailTemplate = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const { toast } = useToast()

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Changes saved",
      description: "Your template has been updated",
    })
  }

  const handleCancel = () => {
    setEditedContent(content)
    setIsEditing(false)
    toast({
      title: "Changes cancelled",
      description: "Your template remains unchanged",
    })
  }

  return isEditing ? (
    <div className="space-y-2">
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full min-h-[200px]"
      />
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={handleSave}
        >
          Save
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="relative">
        <p 
          className="text-gray-600 whitespace-pre-line"
          data-template={templateId}
        >
          {editedContent}
        </p>
      </div>
      <div className="flex gap-2">
        {isEmailTemplate && (
          <Button 
            size="sm"
            onClick={() => onEmailShare?.(editedContent)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(editedContent);
            toast({
              title: "Copied",
              description: "Template copied to clipboard",
            });
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Add these sharing utility functions
const shareToLinkedIn = (content) => {
  // LinkedIn sharing URL
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(content)}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=600');
};

const shareToTwitter = (content) => {
  // Twitter sharing URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

// Modify EmailTemplatesSection to accept activeSection prop
const EmailTemplatesSection = ({ activeSection }) => {
  const { toast } = useToast()

  const handleShareViaEmail = (subject, content) => {
    // Create a properly formatted mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Email Templates</CardTitle>
          <CardDescription>Pre-written templates for common scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Welcome Email */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Welcome New Client</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableContent
                  content={`Dear [Client Name],

I'm delighted to welcome you as a client of [Firm Name]. Thank you for trusting us with your financial future.

To ensure we start our journey together smoothly, here's what you can expect:
• A detailed welcome package will arrive shortly
• Your initial strategy session is scheduled for [Date]
• Access to our client portal (details enclosed)

If you have any questions before our meeting, please don't hesitate to reach out.

Best regards,
[Your Name]
[Your Title]
[Contact Information]`}
                  templateId="welcome"
                  isEmailTemplate={true}
                  onEmailShare={(content) => handleShareViaEmail("Welcome to [Firm Name]", content)}
                />
              </CardContent>
            </Card>

            {/* Portfolio Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quarterly Portfolio Review</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableContent
                  content={`Dear [Client Name],

I hope this email finds you well. As part of our ongoing commitment to your financial success, I've completed the quarterly review of your portfolio and would like to schedule time to discuss the results.

Key points for discussion:
• Portfolio performance review
• Market updates and outlook
• Any changes in your financial goals
• Rebalancing recommendations

Would [Day, Date] at [Time] work for you? We can meet in person or via video conference, whichever you prefer.

Best regards,
[Your Name]`}
                  templateId="portfolio-review"
                  isEmailTemplate={true}
                  onEmailShare={(content) => handleShareViaEmail("Quarterly Portfolio Review", content)}
                />
              </CardContent>
            </Card>

            {/* Market Volatility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Market Volatility Update</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableContent
                  content={`Hi [Client Name],

I wanted to reach out regarding the recent market volatility and provide some perspective on how it affects your portfolio.

Key points to remember:
• Your portfolio is strategically diversified
• Long-term strategy remains on track
• We've prepared for market fluctuations
• Your financial goals are still our priority

If you'd like to discuss this further, please don't hesitate to schedule a call.

Best regards,
[Your Name]`}
                  isEmailTemplate={true}
                  onEmailShare={(content) => handleShareViaEmail("Market Volatility Update", content)}
                />
              </CardContent>
            </Card>

            {/* Annual Review Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Annual Review Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableContent
                  content={`Hi [Client Name],

It's time for your annual financial review. These meetings are valuable opportunities to ensure your investment strategy continues to align with your goals.

During our meeting, we'll cover:
• Your financial goals and any changes
• Portfolio performance review
• Risk assessment update
• Tax planning considerations
• Estate planning review

Please click [link] to schedule a time that works best for you.

Looking forward to our discussion,
[Your Name]`}
                  isEmailTemplate={true}
                />
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm"
                    onClick={() => handleShareViaEmail(
                      "Annual Review Scheduling",
                      document.querySelector('[data-template="annual-review"]')?.textContent
                    )}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(document.querySelector('[data-template="annual-review"]')?.textContent);
                      toast({
                        title: "Copied",
                        description: "Template copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Life Event Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Life Event Follow-up</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableContent
                  content={`Hi [Client Name],

I hope you're doing well. Following our recent conversation about [life event], I wanted to reach out to discuss how we can adjust your financial strategy accordingly.

We should review:
• Current financial priorities
• Required portfolio adjustments
• Updated risk assessment
• New planning opportunities

Would you like to schedule a call to discuss these changes in detail?

Best regards,
[Your Name]`}
                  isEmailTemplate={true}
                />
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm"
                    onClick={() => handleShareViaEmail(
                      "Life Event Follow-up",
                      document.querySelector('[data-template="life-event"]')?.textContent
                    )}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(document.querySelector('[data-template="life-event"]')?.textContent);
                      toast({
                        title: "Copied",
                        description: "Template copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Retirement Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Retirement Planning Check-in</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableContent
                  content={`Hi [Client Name],

As we approach year-end, it's a good time to review your retirement planning progress and discuss any adjustments needed for the coming year.

Topics for discussion:
• Retirement savings progress
• Contribution strategies
• Investment allocation review
• Income planning strategies

Let's schedule a meeting to ensure you're on track for your retirement goals.

Best regards,
[Your Name]`}
                  isEmailTemplate={true}
                />
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm"
                    onClick={() => handleShareViaEmail(
                      "Retirement Planning Check-in",
                      document.querySelector('[data-template="retirement-planning"]')?.textContent
                    )}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(document.querySelector('[data-template="retirement-planning"]')?.textContent);
                      toast({
                        title: "Copied",
                        description: "Template copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  // Remove session-related code
  const [clients, setClients] = useState(mockClients)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [activeSection, setActiveSection] = useState('clients')
  const { toast } = useToast()

  const handleGenerateReport = (client) => {
    toast({
      title: "Report Generated",
      description: `Report for ${client.name} has been generated and downloaded.`,
    })
    // In a real app, this would trigger a PDF download
  }

  const handleScheduleAssessment = (client) => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a date for the next assessment.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Assessment Scheduled",
      description: `Next assessment for ${client.name} scheduled for ${format(selectedDate, 'PPP')}.`,
    })
    setIsScheduleOpen(false)
    setSelectedDate(null)
  }

  const handleEditClient = (formData) => {
    const updatedClients = clients.map(c => 
      c.id === selectedClient.id ? { ...c, ...formData } : c
    )
    setClients(updatedClients)
    setIsEditOpen(false)
    toast({
      title: "Profile Updated",
      description: "Client profile has been successfully updated.",
    })
  }

  // Client Card Actions Component
  const ClientActions = ({ client }) => (
    <div className="mt-4 flex space-x-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleGenerateReport(client)}
      >
        <Download className="w-4 h-4 mr-2" />
        Report
      </Button>
      
      <Dialog open={isScheduleOpen && selectedClient?.id === client.id} onOpenChange={setIsScheduleOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setSelectedClient(client)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Next Assessment</DialogTitle>
            <DialogDescription>
              Select a date for {client.name}'s next risk assessment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => handleScheduleAssessment(client)}>
              Schedule Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen && selectedClient?.id === client.id} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setSelectedClient(client)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client Profile</DialogTitle>
            <DialogDescription>
              Update {client.name}'s information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            handleEditClient(Object.fromEntries(formData))
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={client.name}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={client.email}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={client.phone}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  defaultValue={client.occupation}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="investmentGoals">Investment Goals</Label>
                <Input
                  id="investmentGoals"
                  name="investmentGoals"
                  defaultValue={client.investmentGoals}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="flex">
        {/* Side Navigation Panel */}
        <div className="w-72 min-h-screen bg-white border-r shadow-sm p-6 sticky top-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Advisor Hub</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your practice</p>
          </div>
          
          <nav className="space-y-1">
            <button
              onClick={() => setActiveSection('clients')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                activeSection === 'clients' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg 
                className={`w-5 h-5 ${activeSection === 'clients' ? 'text-blue-600' : 'text-gray-500'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Client Risk Assessments
            </button>
            <button
              onClick={() => setActiveSection('marketing')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                activeSection === 'marketing' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg 
                className={`w-5 h-5 ${activeSection === 'marketing' ? 'text-blue-600' : 'text-gray-500'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Social Media Marketing Content
            </button>
            <button
              onClick={() => setActiveSection('emails')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                activeSection === 'emails' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Mail className="w-5 h-5" />
              Email Templates
            </button>
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Overview</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {activeSection === 'clients' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Client Risk Assessments</CardTitle>
                        <CardDescription>Manage your client relationships</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {clients.map((client) => (
                            <motion.div
                              key={client.id}
                              whileHover={{ scale: 1.01 }}
                              className="p-6 rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
                            >
                              {/* Client Header */}
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                                  <p className="text-sm text-gray-500">{client.email}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(client.riskAssessment)}`}>
                                  {client.riskAssessment}
                                </span>
                              </div>

                              {/* Client Details Grid */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Contact Information</p>
                                    <div className="mt-1 space-y-1">
                                      <p className="text-sm text-gray-700">📱 {client.phone}</p>
                                      <p className="text-sm text-gray-700">💼 {client.occupation}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Investment Profile</p>
                                    <p className="text-sm text-gray-700">{client.investmentGoals}</p>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Assessment Timeline</p>
                                    <div className="mt-1 space-y-1">
                                      <p className="text-sm text-gray-700">
                                        Last Update: <span className="font-medium">{format(new Date(client.lastUpdate), 'MMM d, yyyy')}</span>
                                      </p>
                                      <p className="text-sm text-gray-700">
                                        Next Assessment: <span className="font-medium">{format(new Date(client.nextAssessment), 'MMM d, yyyy')}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Risk Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className={`w-2 h-2 rounded-full ${
                                        client.riskAssessment.toLowerCase() === 'conservative' ? 'bg-blue-500' :
                                        client.riskAssessment.toLowerCase() === 'moderate' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                      }`} />
                                      <p className="text-sm text-gray-700">{client.riskAssessment} Risk Profile</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Risk Assessment Score */}
                              <div className="mb-4">
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Risk Assessment Score</span>
                                    <div className="group relative">
                                      <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg mb-2">
                                        Score ranges:<br/>
                                        0-20: Very Conservative<br/>
                                        21-40: Conservative<br/>
                                        41-60: Moderate<br/>
                                        61-80: Aggressive<br/>
                                        81-100: Very Aggressive
                                      </div>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-gray-900">{client.riskScore}/100</span>
                                </div>
                                <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`absolute left-0 top-0 h-full transition-all duration-500 ${getRiskScoreColor(client.riskScore)}`}
                                    style={{ width: `${client.riskScore}%` }}
                                  />
                                  {/* Score markers */}
                                  <div className="absolute top-0 left-0 w-full h-full flex justify-between px-[1px]">
                                    {[20, 40, 60, 80].map((marker) => (
                                      <div 
                                        key={marker}
                                        className="w-px h-full bg-gray-300"
                                        style={{ left: `${marker}%` }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Conservative</span>
                                  <span>Moderate</span>
                                  <span>Aggressive</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 mt-4 pt-4 border-t">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleGenerateReport(client)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Report
                                </Button>
                                
                                <Dialog open={isScheduleOpen && selectedClient?.id === client.id} onOpenChange={setIsScheduleOpen}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => setSelectedClient(client)}
                                    >
                                      <Mail className="w-4 h-4 mr-2" />
                                      Schedule
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Schedule Next Assessment</DialogTitle>
                                      <DialogDescription>
                                        Select a date for {client.name}'s next risk assessment
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        className="rounded-md border"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={() => handleScheduleAssessment(client)}>
                                        Schedule Email
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <Dialog open={isEditOpen && selectedClient?.id === client.id} onOpenChange={setIsEditOpen}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => setSelectedClient(client)}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Client Profile</DialogTitle>
                                      <DialogDescription>
                                        Update {client.name}'s information
                                      </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={(e) => {
                                      e.preventDefault()
                                      const formData = new FormData(e.target)
                                      handleEditClient(Object.fromEntries(formData))
                                    }}>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="name">Name</Label>
                                          <Input
                                            id="name"
                                            name="name"
                                            defaultValue={client.name}
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="email">Email</Label>
                                          <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={client.email}
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="phone">Phone</Label>
                                          <Input
                                            id="phone"
                                            name="phone"
                                            defaultValue={client.phone}
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="occupation">Occupation</Label>
                                          <Input
                                            id="occupation"
                                            name="occupation"
                                            defaultValue={client.occupation}
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="investmentGoals">Investment Goals</Label>
                                          <Input
                                            id="investmentGoals"
                                            name="investmentGoals"
                                            defaultValue={client.investmentGoals}
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button type="submit">Save Changes</Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>

                                <Button 
                                  size="sm" 
                                  variant="default"
                                  className="ml-auto"
                                  asChild
                                >
                                  <Link href={`/client/${client.id}`}>
                                    View Full Profile
                                  </Link>
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and tools</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button asChild className="w-full" size="lg">
                          <Link href="/questionnaire">Manage Questionnaire</Link>
                        </Button>
                        <Button asChild className="w-full" size="lg" variant="outline">
                          <Link href="/new-client">Add New Client</Link>
                        </Button>
                        <Button asChild className="w-full" size="lg" variant="outline">
                          <Link href="/reports">Generate Reports</Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates and changes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[1,2,3].map((i) => (
                            <div key={i} className="flex items-center text-sm">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                              <span className="text-gray-600">Client assessment updated</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : activeSection === 'marketing' ? (
                <MarketingSection activeSection={activeSection} />
              ) : (
                <EmailTemplatesSection activeSection={activeSection} />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}