'use client'
import React from 'react'
import { useState } from 'react'
import UploadForm from './UploadForm'
import { app } from '@/firebaseConfig.js'
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from 'firebase/storage'
import { getDatabase, push, set } from 'firebase/database'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
//import fs from 'fs'
// cannot use fs in client side
// see:
// https://github.com/vercel/next.js/discussions/54176

function UploadCourseFile({ course }) {
  const [progress, setProgress] = useState()
  const [result, setResult] = useState('')
  const db = getFirestore(app)
  const storage = getStorage(app)
  const path = require('path')

  // const uploadFile = file => {
  //   const metadata = {
  //     contentType: file.type,
  //   }
  //   const storageRef = ref(storage, 'file-upload/' + file?.name)
  //   const uploadTask = uploadBytesResumable(storageRef, file, metadata)
  //   uploadTask.on('state_changed', snapshot => {
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //     console.log('Upload is ' + progress + '% done')
  //     // @ts-ignore
  //     setProgress(progress)
  //     progress == 100 &&
  //       getDownloadURL(uploadTask.snapshot.ref)
  //         .then(downloadURL => {
  //           console.log('File available at', downloadURL)
  //           saveInfo(file, downloadURL)
  //           vectorizeAndSaveFile(file)
  //         })
  //         .catch(error => console.log('Error getting download URL:', error))
  //   })
  // }

  const uploadFile = async file => {
    const metadata = {
      contentType: file.type,
    }

    // saving file locally
    // Save the file to a temporary folder inside the public directory
    const tempFolderPath = path.join(process.cwd(), 'public', 'temp')
    const tempFilePath = path.join(tempFolderPath, file.name)

    // Create the temporary folder if it doesn't exist
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath, { recursive: true })
    }

    // Create a writable stream to save the file
    const fileStream = fs.createWriteStream(tempFilePath)

    // Pipe the file data to the writable stream
    fileStream.write(file.data) // Assuming `file.data` contains the file content
    fileStream.end()

    fileStream.on('finish', async () => {
      console.log('File saved locally:', tempFilePath)
      // Continue with further processing, such as saving file information to a database
      // saveInfo(file, tempFilePath);
      vectorizeAndSaveFile(tempFilePath)
      //vectorizeAndSaveFile(file)
    })

    fileStream.on('error', err => {
      console.error('Error saving file:', err)
    })

    //// end of saving file locally

    const storageRef = ref(storage, 'file-upload/' + file?.name)
    const uploadTask = uploadBytesResumable(storageRef, file, metadata)

    uploadTask.on('state_changed', async snapshot => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')

      // @ts-ignore
      setProgress(progress)

      if (progress === 100) {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log('File available at', downloadURL)

          // // Save the file to a temporary folder inside the public directory
          // const tempFilePath = '/temp/' + file.name
          // console.log(tempFilePath)
          saveInfo(file, downloadURL)
        } catch (error) {
          console.log('Error:', error)
        }
      }
    })
  }

  // const vectorizeAndSaveFile = async file => {
  //   try {
  //     const formData = new FormData()
  //     formData.append('file', file) // Append the file itself

  //     // Log the FormData object to check if the file is appended correctly
  //     console.log('FormData:', formData)

  //     const result = await fetch('/api/test', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         // Make sure to include the necessary headers
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })

  //     const json = await result.json()
  //     console.log('result:', json)
  //   } catch (err) {
  //     console.error('Error:', err)
  //   }
  // }

  //// by file version 2
  // async function vectorizeAndSaveFile(file) {
  //   try {
  //     // Create a FormData object and append the file to it
  //     const formData = new FormData()
  //     formData.append('file', file)

  //     // Send a POST request to the "/api/test" endpoint
  //     const response = await fetch('/api/test', {
  //       method: 'POST',
  //       body: formData,
  //     })

  //     // Parse the JSON response
  //     const data = await response.json()

  //     // Log the response data
  //     console.log('Response:', data)

  //     // You can handle the response data here, if needed
  //   } catch (error) {
  //     console.error('Error:', error)
  //   }
  // }

  ///// by file path
  const vectorizeAndSaveFile = async tempFilePath => {
    try {
      const formData = new FormData()
      formData.append('file', tempFilePath.replace(process.cwd(), '')) // Pass the relative path

      const result = await fetch('/api/test', {
        method: 'POST',
        body: formData,
      })

      const json = await result.json()
      console.log('result: ', json)
    } catch (err) {
      console.log('err:', err)
    }
  }

  const saveInfo = async (file, fileUrl) => {
    const docId = Date.now().toString()
    const collectionPath = `/Instructor/TestInstructor/Class/${course}/Material`
    await setDoc(doc(db, collectionPath, docId), {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: fileUrl,
    })
  }
  return (
    <div className='p-5 px-8 md:px-28'>
      {/* <h2 className='text-[20px] text-center m-5'>
        Start <strong className='text-primary'>Uploading</strong> Files and
        <strong className='text-primary'> Share</strong> it
      </h2> */}
      {/* <UploadForm uploadBtnClick={file => console.log(file)} /> */}
      <UploadForm
        uploadBtnClick={file => uploadFile(file)}
        progress={progress}
      />
    </div>
  )
}

export default UploadCourseFile
