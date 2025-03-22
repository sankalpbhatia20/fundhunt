import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("financial-advisor")
    
    const questionnaires = await db.collection("questionnaires")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(questionnaires)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questionnaires' },
      { status: 500 }
    )
  }
} 