'use client'
import React from 'react'
import UploadForm from './_components/UploadForm'
import { app } from '@/firebaseConfig'
import { getStorage } from 'firebase/storage'

function Upload() {
  const storage = getStorage(app)
  const uploadFile = file => {}
  return (
    <div className='p-5 px-8 md:px-28'>
      <h2 className='text-[20px] text-center m-5'>
        Start <strong className='text-primary'>Uploading</strong> Files and
        <strong className='text-primary'> Share</strong> it
      </h2>
      {/* <UploadForm uploadBtnClick={file => console.log(file)} /> */}
      <UploadForm uploadBtnClick={file => uploadFile(file)} />
    </div>
  )
}

export default Upload
