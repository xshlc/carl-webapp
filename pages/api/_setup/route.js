import { NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'
import {
  createPineconeIndex,
  updatePinecone,
} from '../../_utils/pineconeUtils.js'
import { indexName } from '../../../pineconeConfig.js'

export async function POST() {
  const loader = new DirectoryLoader('./documents', {
    '.txt': path => new TextLoader(path),
    '.md': path => new TextLoader(path),
    '.pdf': path => new PDFLoader(path),
    '.png': path => new UnstructuredLoader(path),
    '.jpg': path => new UnstructuredLoader(path),
  })

  const docs = await loader.load()
  const vectorDimensions = 1536

  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
  //   await client.init({
  //     apiKey: process.env.PINECONE_API_KEY || '',
  //     environment: process.env.PINECONE_ENVIRONMENT || '',
  //   })

  try {
    await createPineconeIndex(client, indexName, vectorDimensions)
    await updatePinecone(client, indexName, docs)
  } catch (err) {
    console.log('error: ', err)
  }

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...',
  })
}
