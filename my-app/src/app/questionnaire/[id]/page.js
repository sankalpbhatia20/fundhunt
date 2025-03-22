'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const mockQuestionnaire = [
  {
    id: 1,
    question: "What is your current annual income from all sources?",
    type: "select",
    options: [
      "Less than $50,000",
      "$50,000 - $100,000",
      "$100,000 - $200,000",
      "$200,000 - $500,000",
      "More than $500,000"
    ]
  },
  {
    id: 2,
    question: "What is your total net worth (excluding primary residence)?",
    type: "select",
    options: [
      "Less than $100,000",
      "$100,000 - $500,000",
      "$500,000 - $2,000,000",
      "$2,000,000 - $5,000,000",
      "More than $5,000,000"
    ]
  },
  {
    id: 3,
    question: "Please indicate your level of investment knowledge:",
    type: "select",
    options: [
      "None - Very limited knowledge",
      "Basic - Understand fundamental concepts",
      "Good - Regular investor with broad knowledge",
      "Advanced - Professional experience or extensive knowledge"
    ]
  },
  {
    id: 4,
    question: "Which investment products do you have experience with? (Select all that apply)",
    type: "multiselect",
    options: [
      "Stocks/Equities",
      "Bonds/Fixed Income",
      "Mutual Funds",
      "ETFs",
      "Real Estate Investment Trusts (REITs)",
      "Options/Derivatives",
      "Cryptocurrencies",
      "Private Equity",
      "None"
    ]
  },
  {
    id: 5,
    question: "What is your primary source of investment knowledge?",
    type: "select",
    options: [
      "Personal investing experience",
      "Professional experience in finance",
      "Academic/Educational background",
      "Family/Friends",
      "Financial advisors",
      "Self-study (books, online resources)",
      "No significant knowledge source"
    ]
  },
  {
    id: 6,
    question: "What is your investment horizon (how long do you plan to invest)?",
    type: "select",
    options: [
      "Less than 3 years",
      "3-5 years",
      "5-10 years",
      "10-20 years",
      "More than 20 years"
    ]
  },
  {
    id: 7,
    question: "What percentage of your monthly income can you save/invest?",
    type: "select",
    options: [
      "0-10%",
      "11-20%",
      "21-30%",
      "31-40%",
      "More than 40%"
    ]
  },
  {
    id: 8,
    question: "In case of an unexpected financial emergency, how many months of expenses do you have in readily available savings?",
    type: "select",
    options: [
      "Less than 1 month",
      "1-3 months",
      "3-6 months",
      "6-12 months",
      "More than 12 months"
    ]
  },
  {
    id: 9,
    question: "What is your risk tolerance level?",
    type: "select",
    options: [
      "Conservative - Prefer to avoid risk and accept lower returns",
      "Moderately Conservative - Willing to accept small market fluctuations",
      "Moderate - Accept average market fluctuations",
      "Moderately Aggressive - Comfortable with above-average risk",
      "Aggressive - Willing to accept significant market volatility"
    ]
  },
  {
    id: 10,
    question: "What is your primary investment objective?",
    type: "select",
    options: [
      "Capital Preservation - Minimize risk of loss",
      "Income Generation - Regular income stream",
      "Balanced Growth - Mix of income and growth",
      "Capital Growth - Long-term appreciation",
      "Aggressive Growth - Maximum potential returns"
    ]
  },
  {
    id: 11,
    question: "How would you react to a 20% decline in your investment portfolio?",
    type: "select",
    options: [
      "Sell everything to prevent further losses",
      "Sell some investments to reduce risk",
      "Do nothing and wait for recovery",
      "Buy more to take advantage of lower prices",
      "Significantly increase investment to maximize opportunity"
    ]
  },
  {
    id: 12,
    question: "Do you have any specific investment preferences or restrictions?",
    type: "multiselect",
    options: [
      "Environmental, Social, and Governance (ESG) focused",
      "Socially Responsible Investing (SRI)",
      "Faith-based investing",
      "Specific sector exclusions",
      "Geographic restrictions",
      "No specific restrictions"
    ]
  }
]

export default function QuestionnaireForm() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [answers, setAnswers] = useState({})
  const [currentStep, setCurrentStep] = useState(0)

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = () => {
    // Validate all questions are answered
    const unansweredQuestions = mockQuestionnaire.filter(q => !answers[q.id])
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Please complete all questions",
        description: "Some questions are still unanswered.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Assessment Submitted",
      description: "Thank you for completing the risk assessment.",
    })
    router.push('/thank-you')
  }

  const nextStep = () => {
    if (currentStep < mockQuestionnaire.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const currentQuestion = mockQuestionnaire[currentStep]
  const progress = ((currentStep + 1) / mockQuestionnaire.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Risk Assessment Questionnaire</h1>
          <p className="text-gray-600">Help us understand your financial goals and risk tolerance</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentStep + 1} of {mockQuestionnaire.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion.question}
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentQuestion.type === "select" ? (
                <Select
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={(value) => handleChange(currentQuestion.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentQuestion.options.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : currentQuestion.type === "text" ? (
                <Textarea
                  placeholder="Enter your answer"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                />
              ) : (
                <Input
                  type="number"
                  placeholder="Enter a number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                />
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep === mockQuestionnaire.length - 1 ? (
              <Button onClick={handleSubmit}>Submit Assessment</Button>
            ) : (
              <Button onClick={nextStep}>Next Question</Button>
            )}
          </CardFooter>
        </Card>

        {/* Answer Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Review your answers before submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockQuestionnaire.map((q, index) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg ${
                    answers[q.id] ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">Question {index + 1}</div>
                  <div className="text-sm text-gray-600">
                    {answers[q.id] ? answers[q.id] : 'Not answered yet'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}