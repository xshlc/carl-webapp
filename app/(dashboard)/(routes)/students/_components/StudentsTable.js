'use client'
import React, { useState, useEffect } from 'react'
import Constant from '@/app/_utils/Constant'


function StudentsTable({ onSelectStudents }) {
  const [selectAll, setSelectAll] = useState(false)
  const [checked, setChecked] = useState({})
  const [selectedStudents, setSelectedStudents] = useState([])

  useEffect(() => {
    const selectedIds = Object.keys(checked).filter(id => checked[id])
    onSelectStudents(selectedIds)
  }, [checked, onSelectStudents])

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    const newChecked = {}
    Constant.studentList.forEach(item => {
      newChecked[item.id] = newSelectAll
    })
    setChecked(newChecked)
  }

  // const toggleCheckbox = id => {
  //   setChecked(prev => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }))
  //   const allChecked = Constant.studentList.every(
  //     item => checked[item.id] || false,
  //   )
  //   setSelectAll(allChecked)
  // }
  const toggleCheckbox = id => {
    setChecked(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

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
                  checked={selectAll}
                  onChange={toggleSelectAll}
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
              <tr key={item.id}>
                <td className='px-4 py-2'>
                  <label className='sr-only' htmlFor={`Row${index + 1}`}>
                    Row {index + 1}
                  </label>
                  <input
                    className='h-5 w-5 rounded border-gray-300'
                    type='checkbox'
                    id={`Row${index + 1}`}
                    key={`checkbox-${item.id}`}
                    checked={checked[item.id] || false}
                    onChange={() => toggleCheckbox(item.id)}
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
