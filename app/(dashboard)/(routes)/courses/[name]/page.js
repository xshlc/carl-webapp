import React from 'react'
import UploadCourseFile from './_components/UploadCourseFile'

function ManageCourse({ params }) {
  const decodedCourseName = decodeURIComponent(params.name)
  console.log({ params })
  return (
    <div>
      <div>
        <h2 className='text-[26px] font-medium p-5'>Manage Course</h2>
        <h4 className='text-[18px] font-medium pl-10'>{decodedCourseName}</h4>
      </div>
      <div>
        <UploadCourseFile course={decodedCourseName} />
      </div>
    </div>
  )
}

export default ManageCourse
