'use client'
import React, { useState } from 'react'
import Constant from '@/app/_utils/Constant'

function CourseSelect({ onSelectCourse }) {
  const [selectedCourse, setSelectedCourse] = useState('')

  const handleChange = event => {
    const courseId = event.target.value
    setSelectedCourse(courseId)
    onSelectCourse(courseId)
  }
  return (
    <div>
      <label
        htmlFor='courses'
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400'
      >
        Select an option
      </label>
      <select
        id='courses'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        value={selectedCourse}
        onChange={handleChange}
      >
        <option value=''>Choose a course</option>
        {Constant.courseList.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CourseSelect
