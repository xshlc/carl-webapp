import React from 'react'
import Constant from '@/app/_utils/Constant'

function CourseDropDown() {
  return (
    <div>
      <label
        htmlFor='HeadlineAct'
        className='block text-sm font-medium text-gray-900'
      >
        {' '}
        Courses{' '}
      </label>

      <select
        name='HeadlineAct'
        id='HeadlineAct'
        className='mt-2 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm'
      >
        <option value=''>Please select</option>
        {Constant.courseList.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CourseDropDown
