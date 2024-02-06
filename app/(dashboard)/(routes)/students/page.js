import React from 'react'
import Constant from '@/app/_utils/Constant'
import CourseDropDown from './_components/CourseDropDown'
import StudentsTable from './_components/StudentsTable'

function Students() {
  return (
    <div>
      <div className='p-5 m-5 w-60'>
        <CourseDropDown />
      </div>
      <div className='p-10'>
        <StudentsTable />
      </div>
      <div
        className='flex flex-col items-center 
        justify-center pt-5 pb-6'
      >
        <button className='p-2 bg-primary text-white w-[30%] rounded-full mt-5 disabled:bg-gray-400'>
          Add Students
        </button>
      </div>
    </div>
  )
}

export default Students
