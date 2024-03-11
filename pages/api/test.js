// Import the necessary types from 'next'
//import { NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'
// import {
//   createPineconeIndex,
//   updatePinecone,
// } from '../../app/_utils/pineconeUtils.js'
import { indexName, timeout } from '../../pineconeConfig'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// @ts-ignore
//import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const upload = multer({ dest: 'uploads/' })

// export default async function handler(req, res) {
//   try {
//     if (req.method === 'POST') {
//       console.log('req.body:', req.body)
//       console.log('req.file:', req.file)
//       // Check if the request contains a file
//       if (!req.file) {
//         console.error('No file uploaded HERE')
//         return res.status(400).json({ message: 'No file uploaded' })
//       }

//       // Get the temporary file path
//       const tempFilePath = req.file.path
//       console.log('Temporary file path:', tempFilePath)

//       // Construct the absolute file path relative to the server's root directory
//       const filePath = path.join(
//         process.cwd(),
//         'public',
//         'temp',
//         req.file.originalname,
//       )
//       console.log('Absolute file path:', filePath)

//       // Move the file to the desired location
//       fs.renameSync(tempFilePath, filePath)

//       // Log the absolute file path for debugging
//       console.log('Absolute file path:', filePath)

//       // Proceed with any further processing here
//       // For example, you can call a function to vectorize and save the file to the Pinecone database
//       // createPineconeIndex(client, indexName, vectorDimension);
//       // updatePinecone(client, indexName, docs)

//       // Respond with success message
//       res.status(200).json({ message: 'File uploaded successfully', filePath })
//     } else {
//       // If the request method is not POST, send a 405 Method Not Allowed status
//       res.setHeader('Allow', ['POST'])
//       res.status(405).end(`Method ${req.method} Not Allowed`)
//     }
//   } catch (error) {
//     console.error('Error processing file:', error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { filePath } = req.body // Assuming the client sends the file path

      // Construct the absolute file path relative to the server's root directory
      const absoluteFilePath = path.join(
        process.cwd(),
        'public',
        'temp',
        filePath,
      )

      // Check if the file exists at the specified path
      if (!fs.existsSync(absoluteFilePath)) {
        return res.status(400).json({ message: 'File not found' })
      }

      // Load the file content
      const textContent = fs.readFileSync(absoluteFilePath, 'utf-8')

      // Create a single document with the file content
      const doc = {
        metadata: { source: absoluteFilePath },
        pageContent: textContent,
      }

      const vectorDimensions = 1536

      const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

      // Create Pinecone index and update with the document
      await createPineconeIndex(client, indexName, vectorDimensions)
      await updatePinecone(client, indexName, [doc])

      // Respond with success message
      return res.status(200).json({ message: 'File uploaded successfully' })
    } else {
      // If the request method is not POST, send a 405 Method Not Allowed status
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error processing file:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const createPineconeIndex = async (client, indexName, vectorDimension) => {
  // 1. Initiate index existence check
  console.log(`Checking "${indexName}"...`)
  // 2. Get list of existing indexes
  const existingIndexes = await client.listIndexes()
  // 3. If index doesn't exist, create it
  if (!existingIndexes.includes(indexName)) {
    // 4. Log index creation initiation
    console.log(`Creating "${indexName}"...`)
    // 5. Create index
    await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: vectorDimension,
        metric: 'cosine',
      },
    })
    // 6. Log successful creation
    console.log(`Creating index.... please wait for it to finish initializing.`)
    // 7. Wait for index initialization
    await new Promise(resolve => setTimeout(resolve, timeout))
  } else {
    // 8. Log if index already exists
    console.log(`"${indexName}" already exists.`)
  }
}

const updatePinecone = async (client, indexName, docs) => {
  console.log('Retrieving Pinecone index...')
  // 1. Retrieve Pinecone index
  const index = client.Index(indexName)
  // 2. Log the retrieved index name
  console.log(`Pinecone index retrieved: ${indexName}`)
  // 3. Process each document in the docs array
  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`)
    const txtPath = doc.metadata.source
    const text = doc.pageContent
    // 4. Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    })
    console.log('Splitting text into chunks...')
    // 5. Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text])
    console.log(`Text split into ${chunks.length} chunks`)
    console.log(
      `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`,
    )
    // 6. Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map(chunk => chunk.pageContent.replace(/\n/g, ' ')),
    )
    console.log('Finished embedding documents')
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`,
    )
    // 7. Create and upsert vectors in batches of 100
    const batchSize = 100
    let batch = []
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx]
      const vector = {
        id: `${txtPath}_${idx}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
        },
      }
      batch = [...batch, vector]
      // When batch is full or it's the last item, upsert the vectors
      if (batch.length === batchSize || idx === chunks.length - 1) {
        await index.upsert({
          upsertRequest: {
            vectors: batch,
          },
        })
        // Empty the batch
        batch = []
      }
    }
    // 8. Log the number of vectors updated
    console.log(`Pinecone index updated with ${chunks.length} vectors`)
  }
}
