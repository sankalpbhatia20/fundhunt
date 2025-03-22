'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const CATEGORIES = {
  PERSONAL: "Personal Information",
  KNOWLEDGE: "Investment Knowledge & Experience",
  FINANCIAL: "Financial Situation",
  RISK: "Risk Profile",
  OBJECTIVES: "Investment Objectives"
};

const defaultQuestions = {
  [CATEGORIES.PERSONAL]: [
    {
      id: "name",
      question: "Full Name",
      type: "text"
    },
    {
      id: "dob",
      question: "Date of Birth",
      type: "date"
    },
    {
      id: "email",
      question: "Email Address",
      type: "email"
    }
  ],
  [CATEGORIES.KNOWLEDGE]: [
    {
      id: "inv_knowledge",
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
      id: "inv_experience",
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
      id: "knowledge_source",
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
    }
  ],
  [CATEGORIES.FINANCIAL]: [
    {
      id: "annual_income",
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
      id: "net_worth",
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
      id: "savings_percent",
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
      id: "emergency_fund",
      question: "In case of an unexpected financial emergency, how many months of expenses do you have in readily available savings?",
      type: "select",
      options: [
        "Less than 1 month",
        "1-3 months",
        "3-6 months",
        "6-12 months",
        "More than 12 months"
      ]
    }
  ],
  [CATEGORIES.RISK]: [
    {
      id: "risk_tolerance",
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
      id: "market_decline",
      question: "How would you react to a 20% decline in your investment portfolio?",
      type: "select",
      options: [
        "Sell everything to prevent further losses",
        "Sell some investments to reduce risk",
        "Do nothing and wait for recovery",
        "Buy more to take advantage of lower prices",
        "Significantly increase investment to maximize opportunity"
      ]
    }
  ],
  [CATEGORIES.OBJECTIVES]: [
    {
      id: "investment_horizon",
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
      id: "primary_objective",
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
      id: "investment_preferences",
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
};

export default function Questionnaire() {
  const [questions, setQuestions] = useState(defaultQuestions)
  const [newQuestion, setNewQuestion] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [editingQuestion, setEditingQuestion] = useState(null)
  const { toast } = useToast()
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [newQuestionData, setNewQuestionData] = useState({
    category: '',
    question: '',
    type: 'select',
    options: ['']
  })

  const addQuestion = async () => {
    try {
      if (newQuestionData.question.trim() !== '') {
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newQuestionData)
        });
        
        if (!response.ok) throw new Error('Failed to add question');
        
        const data = await response.json();
        setQuestions([...questions, data.question]);
        setNewQuestionData({
          category: '',
          question: '',
          type: 'select',
          options: ['']
        });
        
        toast({
          title: "Question Added",
          description: "Your new question has been added to the questionnaire.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    }
  }

  const removeQuestion = async (index) => {
    try {
      const questionId = questions[index]._id; // Assuming each question has an _id from MongoDB
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove question');

      setQuestions(questions.filter((_, i) => i !== index));
      toast({
        title: "Question Removed",
        description: "The question has been removed from the questionnaire.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove question",
        variant: "destructive",
      });
    }
  }

  const sendQuestionnaire = async () => {
    if (!clientEmail) {
      toast({
        title: "Error",
        description: "Please enter a client email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clientEmail,
          questions: questions,
          sentAt: new Date()
        })
      });

      if (!response.ok) throw new Error('Failed to send questionnaire');

      toast({
        title: "Questionnaire Sent",
        description: `Questionnaire has been sent to ${clientEmail}`,
      });
      setClientEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send questionnaire",
        variant: "destructive",
      });
    }
  }

  const handleEdit = (category, question) => {
    setEditingQuestion({
      category,
      question: { ...question }
    })
  }

  const handleSaveEdit = (category, editedQuestion) => {
    setQuestions(prev => ({
      ...prev,
      [category]: prev[category].map(q => 
        q.id === editedQuestion.id ? editedQuestion : q
      )
    }))
    setEditingQuestion(null)
    toast({
      title: "Question Updated",
      description: "The question has been successfully updated.",
    })
  }

  const handleRemove = (category, questionId) => {
    setQuestions(prev => ({
      ...prev,
      [category]: prev[category].filter(q => q.id !== questionId)
    }))
    toast({
      title: "Question Removed",
      description: "The question has been removed from the questionnaire.",
      variant: "destructive",
    })
  }

  const handleAddQuestion = () => {
    if (!newQuestionData.question.trim() || !newQuestionData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setQuestions(prev => ({
      ...prev,
      [newQuestionData.category]: [
        ...prev[newQuestionData.category],
        {
          id: Date.now().toString(),
          question: newQuestionData.question.trim(),
          type: newQuestionData.type,
          options: newQuestionData.type === 'text' ? [] : 
                  newQuestionData.options.filter(opt => opt.trim() !== '')
        }
      ]
    }))

    setIsAddingQuestion(false)
    setNewQuestionData({
      category: '',
      question: '',
      type: 'select',
      options: ['']
    })
    
    toast({
      title: "Question Added",
      description: "New question has been added successfully.",
    })
  }

  const EditQuestionModal = ({ isOpen, onClose, category, question, onSave }) => {
    const [editedQuestion, setEditedQuestion] = useState(question)

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Make changes to the question below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea
                value={editedQuestion.question}
                onChange={(e) => setEditedQuestion(prev => ({
                  ...prev,
                  question: e.target.value
                }))}
              />
            </div>
            
            {(editedQuestion.type === "select" || editedQuestion.type === "multiselect") && (
              <div className="space-y-2">
                <Label>Options</Label>
                {editedQuestion.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editedQuestion.options]
                        newOptions[index] = e.target.value
                        setEditedQuestion(prev => ({
                          ...prev,
                          options: newOptions
                        }))
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setEditedQuestion(prev => ({
                          ...prev,
                          options: prev.options.filter((_, i) => i !== index)
                        }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave(category, editedQuestion)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const AddQuestionModal = ({ isOpen, onClose }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Create a new question for the questionnaire
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newQuestionData.category}
                onChange={(e) => setNewQuestionData(prev => ({
                  ...prev,
                  category: e.target.value
                }))}
              >
                <option value="">Select a category</option>
                {Object.keys(CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>
                    {CATEGORIES[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Question Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newQuestionData.type}
                onChange={(e) => setNewQuestionData(prev => ({
                  ...prev,
                  type: e.target.value,
                  options: e.target.value === 'text' ? [] : ['']
                }))}
              >
                <option value="text">Text Input</option>
                <option value="select">Single Select</option>
                <option value="multiselect">Multi Select</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea
                value={newQuestionData.question}
                onChange={(e) => setNewQuestionData(prev => ({
                  ...prev,
                  question: e.target.value
                }))}
                placeholder="Enter your question here..."
              />
            </div>
            
            {(newQuestionData.type === "select" || newQuestionData.type === "multiselect") && (
              <div className="space-y-2">
                <Label>Answer Options</Label>
                {newQuestionData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestionData.options]
                        newOptions[index] = e.target.value
                        setNewQuestionData(prev => ({
                          ...prev,
                          options: newOptions
                        }))
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setNewQuestionData(prev => ({
                          ...prev,
                          options: prev.options.filter((_, i) => i !== index)
                        }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewQuestionData(prev => ({
                      ...prev,
                      options: [...prev.options, ""]
                    }))
                  }}
                >
                  Add Option
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Risk Assessment Questionnaire</h1>
          <p className="text-gray-600">Review and manage client questionnaire</p>
        </div>

        <div className="space-y-8">
          {Object.entries(defaultQuestions).map(([category, questions]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">{CATEGORIES[category]}</CardTitle>
                <CardDescription>
                  {questions.length} questions in this section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div 
                      key={question.id}
                      className="p-4 rounded-lg border bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-2">
                            {index + 1}. {question.question}
                          </p>
                          
                          {/* Display answer options */}
                          <div className="ml-6 mt-3 space-y-2">
                            {question.type === "select" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {question.options.map((option, i) => (
                                  <div 
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-600"
                                  >
                                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                                    <span>{option}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {question.type === "multiselect" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {question.options.map((option, i) => (
                                  <div 
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-600"
                                  >
                                    <div className="w-4 h-4 rounded border border-gray-300" />
                                    <span>{option}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {(question.type === "text" || question.type === "date" || question.type === "email") && (
                              <div className="text-sm text-gray-500 italic">
                                {question.type === "text" && "Text input field"}
                                {question.type === "date" && "Date input field"}
                                {question.type === "email" && "Email input field"}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleEdit(category, question)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemove(category, question.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={() => setIsAddingQuestion(true)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Add New Question
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>

        {/* Add Question Modal */}
        <AddQuestionModal
          isOpen={isAddingQuestion}
          onClose={() => {
            setIsAddingQuestion(false)
            setNewQuestionData({
              category: '',
              question: '',
              type: 'select',
              options: ['']
            })
          }}
        />

        {/* Your existing EditQuestionModal */}
        {editingQuestion && (
          <EditQuestionModal
            isOpen={!!editingQuestion}
            onClose={() => setEditingQuestion(null)}
            category={editingQuestion.category}
            question={editingQuestion.question}
            onSave={handleSaveEdit}
          />
        )}
      </motion.div>
    </div>
  )
}