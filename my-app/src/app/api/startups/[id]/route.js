import { MongoClient, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(req, { params }) {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid startup ID format" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('fundhunt')
    
    const startup = await db.collection('startups').findOne({ 
      _id: new ObjectId(params.id)
    })
    
    if (!startup) {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, startup })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch startup details: " + error.message },
      { status: 500 }
    )
  }
} 