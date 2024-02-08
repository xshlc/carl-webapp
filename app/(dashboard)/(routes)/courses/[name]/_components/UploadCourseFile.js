'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import UploadForm from './UploadForm'
import CompleteCheck from './CompleteCheck'
import { app } from '@/firebaseConfig'
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from 'firebase/storage'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

function UploadCourseFile({ course }) {
  const router = useRouter()
  const [progress, setProgress] = useState()
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const [fileDocId, setFileDocId] = useState()
  const db = getFirestore(app)
  const storage = getStorage(app)

  const uploadFile = file => {
    const metadata = {
      contentType: file.type,
    }
    const storageRef = ref(storage, 'file-upload/' + file?.name)
    const uploadTask = uploadBytesResumable(storageRef, file, metadata)
    uploadTask.on('state_changed', snapshot => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
      setProgress(progress)
      progress == 100 &&
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          console.log('File available at', downloadURL)
          saveInfo(file, downloadURL)
        })
    })
  }

  const saveInfo = async (file, fileUrl) => {
    const docId = Date.now().toString()
    const collectionPath = `/Instructor/TestInstructor/Class/${course}/Material`
    setFileDocId(docId)
    await setDoc(doc(db, collectionPath, docId), {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: fileUrl,
    })
  }

  useEffect(() => {
    console.log('Trigger')

    progress == 100 &&
      setTimeout(() => {
        setUploadCompleted(true)
      }, 2000)
  }, [progress == 100])

  useEffect(() => {
    uploadCompleted &&
      setTimeout(() => {
        setUploadCompleted(false)
        console.log('FileDocId', fileDocId)
        router.push('/file-preview/' + fileDocId)
      }, 2000)
  }, [uploadCompleted == true])
  return (
    <div className='p-5 px-8 md:px-28 text-center'>
      <h2 className='text-[20px] text-center m-5'>
        <strong className='text-primary'>Upload</strong> Your{' '}
        <strong className='text-primary'>{course}</strong> Files
      </h2>
      <UploadForm
        uploadBtnClick={file => uploadFile(file)}
        progress={progress}
      />
      {/* {!uploadCompleted ? (
        <div>
          <h2 className='text-[20px] text-center m-5'>
            Start
            <strong className='text-primary'> Uploading </strong>
            File and <strong className='text-primary'> Share</strong> it
          </h2>
          <UploadForm
            uploadBtnClick={file => uploadFile(file)}
            progress={progress}
          />
        </div>
      ) : (
        <CompleteCheck />
      )} */}
    </div>
  )
}

export default UploadCourseFile
