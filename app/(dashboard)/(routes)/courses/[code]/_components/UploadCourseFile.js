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
//import axios from 'axios'
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

  const uploadFile = file => {
    const metadata = {
      contentType: file.type,
    }
    console.log(file)
    const storageRef = ref(storage, 'file-upload/' + file?.name)
    const uploadTask = uploadBytesResumable(storageRef, file, metadata)
    uploadTask.on('state_changed', snapshot => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
      // @ts-ignore
      setProgress(progress)
      progress == 100 &&
        getDownloadURL(uploadTask.snapshot.ref)
          .then(downloadURL => {
            console.log('File available at', downloadURL)
            saveInfo(file, downloadURL)
            vectorizeAndSaveFile(file)
          })
          .catch(error => console.log('Error getting download URL:', error))
    })
  }

  const vectorizeAndSaveFile = async file => {
    try {
      const formData = new FormData()
      formData.append('file', file) // Append the file itself

      // log the FormData object to check if the file is appended correctly
      console.log('FormData:', formData)

      const result = await fetch('/api/test', {
        method: 'POST',
        body: formData,
        // Multipart: Boundary not found
        // headers: {
        //   // necessary headers
        //   'Content-Type': 'multipart/form-data',
        // },
      })

      // const response = await axios.post('/api/test', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })
      const json = await result.json()
      console.log('result:', json)
      //console.log('result:', response.data)
    } catch (err) {
      console.error('Error:', err)
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
