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

          // Save the file to a temporary folder inside the public directory
          const tempFilePath = '/temp/' + file.name
          console.log(tempFilePath)
          saveInfo(file, downloadURL)
          vectorizeAndSaveFile(tempFilePath)
        } catch (error) {
          console.log('Error:', error)
        }
      }
    })
  }

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
