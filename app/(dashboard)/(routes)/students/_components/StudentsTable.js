'use client'
import React, { useState, useEffect } from 'react'

function StudentsTable({ students, onSelectStudents }) {
  const [selectAll, setSelectAll] = useState(false)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    const selectedIds = Object.keys(checked).filter(id => checked[id])
    onSelectStudents(selectedIds)
  }, [checked, onSelectStudents])

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    const newChecked = {}
    students.forEach(item => {
      newChecked[item.id] = newSelectAll
    })
    setChecked(newChecked)

    // Get the IDs of the selected students
    const selectedIds = Object.keys(newChecked).filter(key => newChecked[key])
    onSelectStudents(selectedIds)
  }

  const toggleCheckbox = id => {
    setChecked(prev => ({
      ...prev,
      [id]: !prev[id],
    }))

    // Get the IDs of the selected students
    const selectedIds = Object.keys(checked).filter(key => checked[key])
    console.log(selectedIds)
    onSelectStudents(selectedIds)
  }

  return (
    <div>
      <div className='overflow-x-auto rounded-lg border border-gray-200'>
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
                <td className='px-4 py-2'>
                  <label className='sr-only' htmlFor={`Row${item.id}`}>
                    Row {item.id}
                  </label>
                  <input
                    className='h-5 w-5 rounded border-gray-300'
                    type='checkbox'
                    id={`Row${item.id}`}
                    key={`checkbox-${item.id}`}
                    checked={checked[item.id] || false}
                    onChange={() => toggleCheckbox(item.id)}
                  />
                </td>
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

export default StudentsTable
