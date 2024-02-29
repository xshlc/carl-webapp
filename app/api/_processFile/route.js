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
import fetch from 'node-fetch'

export async function POST(req) {
  try {
    const { fileUrl } = await req.json()

    // Fetch the file content from the provided URL
    const fileContent = await fetch(fileUrl).then(res => res.text())

    // Pass the fileUrl to the DirectoryLoader
    const loader = new DirectoryLoader(
      fileUrl, // Pass the file content as fileUrl
      {
        '.txt': path => new TextLoader(path),
        '.md': path => new TextLoader(path),
        '.pdf': path => new PDFLoader(path),
        '.png': path => new UnstructuredLoader(path),
        '.jpg': path => new UnstructuredLoader(path),
      },
    )

    const docs = await loader.load()
    const vectorDimensions = 1536

    const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

    // Create Pinecone index and update with docs
    await createPineconeIndex(client, indexName, vectorDimensions)
    await updatePinecone(client, indexName, docs)

    return NextResponse.json({
      data: 'Successfully created index and loaded data into Pinecone.',
    })
  } catch (error) {
    console.error('Error processing file:', error)
  }
}
