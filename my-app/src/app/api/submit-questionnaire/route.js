import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req) {
  try {
    const data = await req.json()
    const client = await clientPromise
    const db = client.db("financial-advisor")
    
    // Store questionnaire response
    const result = await db.collection("questionnaires").insertOne({
      ...data,
      createdAt: new Date(),
    })

    return NextResponse.json({ 
      message: 'Questionnaire submitted successfully',
      id: result.insertedId 
    })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit questionnaire' },
      { status: 500 }
    )
  }
}

