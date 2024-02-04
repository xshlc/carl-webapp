'use client'
import React from 'react'
import Link from 'next/link'

function Dashboard() {
  const courseList = [
    {
      id: 1,
      name: 'CMPEN 270',
    },
    {
      id: 2,
      name: 'EE 211',
    },
    {
      id: 3,
      name: 'SWENG 411',
    },
  ]
  return (
    <div>
      <h2 className='text-[23px] font-medium p-5'>My Courses:</h2>
      <div
        className='grid grid-cols-1 sm:grid-cols-2
        md:grid-cols-3 lg:grid-cols-4 mt-5 gap-5'
      >
        {courseList.map((item, index) => (
          <div
            className='border rounded-lg p-3 ml-5 mr-5
            cursor-pointer hover:border-purple-300'
          >
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
