import { NextRequest, NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import { queryPineconeVectorStoreAndQueryLLM } from '../../_utils/pineconeUtils'
import { indexName } from '../../../pineconeConfig'

export async function POST(req) {
  const body = await req.json()
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
  //   await pc.init({
  //     apiKey: process.env.PINECONE_API_KEY || '',
  //     environment: process.env.PINECONE_ENVIRONMENT || '',
  //   })

  const text = await queryPineconeVectorStoreAndQueryLLM(pc, indexName, body)

  return NextResponse.json({
    data: text,
  })
}
