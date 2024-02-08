'use client'
import React from 'react'
import Link from 'next/link'
import Constant from '@/app/_utils/Constant'

function Courses() {
  return (
    <div>
      <h2 className='text-[26px] font-medium p-5'>My Courses:</h2>
      <div
        className='grid grid-cols-1 sm:grid-cols-2
        md:grid-cols-3 lg:grid-cols-4 mt-5 gap-5 m-5'
      >
        {Constant.courseList.map((item, index) => (
          <div
            className='border rounded-lg p-5
             cursor-pointer hover:border-purple-500'
            key={index}
          >
            <Link href='/courses/[name]' as={`/courses/${item.name}`}>
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Courses
