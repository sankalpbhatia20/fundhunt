// These are the MongoDB collection schemas we'll create

const collections = {
  users: {
    indexes: [
      { key: { email: 1 }, unique: true }
    ],
    fields: {
      name: String,
      email: String,
      image: String,
      userType: { type: String, enum: ['founder', 'investor'] },
      membershipTier: { type: String, enum: ['free', 'pro'], default: 'free' },
      createdAt: Date,
      lastLogin: Date,
      profile: {
        bio: String,
        linkedin: String,
        twitter: String,
        phone: String,
        location: String,
        investmentPreferences: {
          industries: [String],
          stages: [String],
          ticketSize: {
            min: Number,
            max: Number
          }
        }
      }
    }
  },
  
  startups: {
    indexes: [
      { key: { companyName: 1 }, unique: true },
      { key: { industry: 1 } },
      { key: { fundingStage: 1 } },
      { key: { location: 1 } }
    ],
    fields: {
      founderId: String,
      companyName: String,
      tagline: String,
      description: String,
      detailedDescription: String,
      industry: String,
      fundingStage: String,
      fundingAmount: Number,
      valuation: Number,
      teamSize: String,
      location: String,
      monthlyRevenue: Number,
      growth: String,
      highlights: [String],
      founded: Date,
      website: String,
      linkedinUrl: String,
      twitterUrl: String,
      videoPitch: String,
      techStack: [String],
      competitors: [String],
      competitiveAdvantage: String,
      status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'] },
      metrics: {
        monthlyGrowth: Number,
        runwayMonths: Number,
        customerCount: Number,
        arr: Number
      },
      investment: {
        currentRound: String,
        targetAmount: Number,
        minTicket: Number,
        maxTicket: Number,
        previousFunding: Number,
        currentInvestors: [String],
        useOfFunds: String,
        exitStrategy: String
      },
      createdAt: Date,
      updatedAt: Date
    }
  },

  founders: {
    indexes: [
      { key: { email: 1 }, unique: true },
      { key: { startupId: 1 } }
    ],
    fields: {
      userId: String,
      startupId: String,
      name: String,
      role: String,
      email: String,
      phone: String,
      linkedin: String,
      background: String,
      experience: String,
      education: String,
      previousExits: String,
      achievements: [String],
      assessment: {
        resilience: String,
        innovation: String,
        leadership: String,
        risk_tolerance: String,
        adaptability: String
      },
      createdAt: Date,
      updatedAt: Date
    }
  },

  investments: {
    indexes: [
      { key: { investorId: 1, startupId: 1 }, unique: true }
    ],
    fields: {
      investorId: String,
      startupId: String,
      amount: Number,
      equity: Number,
      status: { type: String, enum: ['interested', 'negotiating', 'committed', 'completed'] },
      notes: String,
      terms: {
        valuation: Number,
        investmentType: String,
        boardSeat: Boolean,
        proRata: Boolean
      },
      createdAt: Date,
      updatedAt: Date
    }
  },

  analytics: {
    indexes: [
      { key: { startupId: 1 } },
      { key: { date: 1 } }
    ],
    fields: {
      startupId: String,
      date: Date,
      metrics: {
        pageViews: Number,
        uniqueVisitors: Number,
        investorViews: Number,
        shortlists: Number,
        contactRequests: Number
      }
    }
  },

  shortlisted: {
    indexes: [
      { key: { userId: 1, startupId: 1 }, unique: true }
    ],
    fields: {
      userId: String,
      startupId: String,
      createdAt: Date,
      notes: String
    }
  }
}

export default collections 