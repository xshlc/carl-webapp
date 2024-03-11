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
//       upload.single('file')(req, res, async err => {
//         if (err) {
//           return res.status(400).json({ message: 'Error uploading file' })
//         }

//         const file = req.file
//         const { originalname, filename } = file

//         // Handle the file as needed
//         console.log('Uploaded file:', originalname)

//         // Construct the relative path to the temp folder inside the public directory
//         const tempFilePath = path.join('temp', filename)

//         // Pass the relative file path to the DirectoryLoader
//         const loader = new DirectoryLoader(tempFilePath, {
//           '.txt': path => new TextLoader(path),
//           '.md': path => new TextLoader(path),
//           '.pdf': path => new PDFLoader(path),
//           '.png': path => new UnstructuredLoader(path),
//           '.jpg': path => new UnstructuredLoader(path),
//         })

//         const docs = await loader.load()
//         const vectorDimensions = 1536

//         const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

//         // Create Pinecone index and update with docs
//         await createPineconeIndex(client, indexName, vectorDimensions)
//         await updatePinecone(client, indexName, docs)

//         // Respond with success message
//         res
//           .status(200)
//           .json('Successfully created index and loaded data into Pinecone.')
//       })
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

// export default async function handler(req, res) {
//   try {
//     if (req.method === 'POST') {
//       // Get the file from the 'temp' folder
//       const tempDir = path.join(process.cwd(), 'public', 'temp')
//       const file = req.body.file
//       const filePath = path.join(tempDir, file)

//       // Check if the file exists
//       if (!fs.existsSync(filePath)) {
//         return res.status(400).json({ message: 'File not found' })
//       }

//       // Load the file using the appropriate loader
//       const loader = new DirectoryLoader(filePath, {
//         '.txt': path => new TextLoader(path),
//         '.md': path => new TextLoader(path),
//         '.pdf': path => new PDFLoader(path),
//         '.png': path => new UnstructuredLoader(path),
//         '.jpg': path => new UnstructuredLoader(path),
//       })

//       const docs = await loader.load()
//       const vectorDimensions = 1536

//       const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

//       // Create Pinecone index and update with docs
//       await createPineconeIndex(client, indexName, vectorDimensions)
//       await updatePinecone(client, indexName, docs)

//       // Respond with success message
//       res
//         .status(200)
//         .json('Successfully created index and loaded data into Pinecone.')
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
      // Get the direct file path from the request body
      const filePath = req.body.filePath // Assuming the client sends the file path

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File not found' })
      }

      // Load the file using the TextLoader
      const loader = new TextLoader(filePath)

      // Load the file content
      const textContent = fs.readFileSync(filePath, 'utf-8')

      // Create a single document with the file content
      const doc = {
        metadata: { source: filePath },
        pageContent: textContent,
      }

      const vectorDimensions = 1536

      const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

      // Create Pinecone index and update with the document
      await createPineconeIndex(client, indexName, vectorDimensions)
      await updatePinecone(client, indexName, [doc])

      // Respond with success message
      res
        .status(200)
        .json('Successfully created index and loaded data into Pinecone.')
    } else {
      // If the request method is not POST, send a 405 Method Not Allowed status
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error processing file:', error)
    res.status(500).json({ message: 'Internal server error' })
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
