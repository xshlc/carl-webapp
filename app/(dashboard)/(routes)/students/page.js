import React from 'react'
import Constant from '@/app/_utils/Constant'
import CourseDropDown from './_components/CourseDropDown'
import StudentsTable from './_components/StudentsTable'
import DropDownMenu from './_components/DropDownMenu'
import CourseSelect from './_components/CourseSelect'

function Students() {
  return (
    <div>
      <h2 className='text-[26px] font-medium p-5'>Manage Students</h2>
      <div className='ml-5'>
        <DropDownMenu />
      </div>

      {/* flex flex-col items-center justify-center pt-5 pb-6 */}
      <div className='m-5 w-40'>
        <CourseSelect />
      </div>
      <div className='pl-10 pr-10 pt-5'>
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
