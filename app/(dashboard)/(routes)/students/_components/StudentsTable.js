import React from 'react'
import Constant from '@/app/_utils/Constant'

function StudentsTable() {
  return (
    <div>
      {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}

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
            {/* Example formatting */}
            {/* <tr>
                <td className='px-4 py-2 m-5'>
                  <label className='sr-only' htmlFor='Row1'>
                    Row 1
                  </label>

                  <input
                    className='h-5 w-5 rounded border-gray-300'
                    type='checkbox'
                    id='Row1'
                  />
                </td>
                <td className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                  John Doe
                </td>
                <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                  24/05/1995
                </td>
              </tr> */}
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
