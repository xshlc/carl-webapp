import React from 'react'

function EnrolledStudents({ course, students }) {
  return (
    <div>
      {/* <h4 className='text-[18px] font-medium pl-10'>Enrolled Students</h4> */}
      {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}
      <div className='overflow-x-auto rounded-lg border border-gray-200'>
        <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
          <thead className='ltr:text-left rtl:text-right'>
            <tr>
              <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                Name
              </th>
              <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                Email
              </th>
              <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                Major
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-200'>
            {students.map((item, index) => (
              <tr key={item.id || index}>
                <td className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                  {item.name}
                </td>
                <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                  {item.email}
                </td>
                <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                  {item.major}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EnrolledStudents
