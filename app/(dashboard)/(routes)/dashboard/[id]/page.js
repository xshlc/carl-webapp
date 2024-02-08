import React from 'react'

function ManageCourse({ params }) {
  console.log({ params })
  return (
    <div>
      <div>
        <h2 className='text-[26px] font-medium p-5'>Manage Course</h2>
        <h4 className='text-[18px] font-medium pl-10'>{params.id}</h4>
      </div>
    </div>
  )
}

export default ManageCourse
