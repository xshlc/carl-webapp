import React from 'react'
import Constant from '@/app/_utils/Constant'

function StudentsTable() {
  return (
    <div>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
          <thead className='ltr:text-left rtl:text-right'>
            <tr>
              <th className='px-4 py-2'>
                <label htmlFor='SelectAll' className='sr-only'>
                  Select All
                </label>

                <input
                  type='checkbox'
                  id='SelectAll'
                  className='h-5 w-5 rounded border-gray-300'
                />
              </th>
              <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                Name
              </th>
              <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                Enrolled Courses
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-200'>
            {Constant.studentList.map((item, index) => (
              <tr>
                <td className='px-4 py-2'>
                  <label className='sr-only' htmlFor={`Row${index + 1}`}>
                    Row {index + 1}
                  </label>
                  <input
                    className='h-5 w-5 rounded border-gray-300'
                    type='checkbox'
                    id={`Row${index + 1}`}
                    key={item.id}
                  />
                </td>
                <td className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                  {item.name}
                </td>
                <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                  {item.courses.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentsTable
