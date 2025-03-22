import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req) {
  try {
    const client = await clientPromise
    const db = client.db('fundhunt')
    
    const data = await req.json()
    
    // Add timestamps
    data.createdAt = new Date()
    data.updatedAt = new Date()
    data.status = 'pending'

    // Insert into startups collection
    const startupResult = await db.collection('startups').insertOne(data)
    
    // Insert founder details
    const founderData = {
      ...data.founderDetails,
      startupId: startupResult.insertedId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.collection('founders').insertOne(founderData)

    return NextResponse.json({ 
      success: true, 
      message: "Startup submitted successfully",
      startupId: startupResult.insertedId.toString()
    })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to submit startup: " + error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('Connecting to MongoDB...')
    const client = await clientPromise
    const db = client.db('fundhunt')
    
    console.log('Fetching startups...')
    const startups = await db.collection('startups')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)  // Limit results for better performance
      .toArray()

    console.log(`Successfully fetched ${startups.length} startups`)
    
    return NextResponse.json({ 
      success: true, 
      startups: startups.map(startup => ({
        ...startup,
        _id: startup._id.toString()  // Convert ObjectId to string
      }))
    })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch startups",
        error: error.message 
      },
      { status: 500 }
    )
  }
} 