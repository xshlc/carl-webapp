import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    // Extract the file URL from the request body
    const { fileUrl } = await req.json()
    console.log(fileUrl)

    return NextResponse.json({
      data: 'Embeddings generated and stored successfully.',
    })
  } catch (error) {
    console.error('Error processing file:', error)
  }
}
