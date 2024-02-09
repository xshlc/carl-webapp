'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Constant from '@/app/_utils/Constant'
import { app } from '@/firebaseConfig.js'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

function Courses() {
  const [courses, setCourses] = useState([])

  const db = getFirestore(app)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const classCollectionRef = collection(
          db,
          'Instructor',
          'TestInstructor',
          'Class',
        )
        const classSnapshot = await getDocs(classCollectionRef)

        const coursesData = []
        classSnapshot.forEach(doc => {
          coursesData.push({ id: doc.id, ...doc.data() })
        })
        setCourses(coursesData)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }

    fetchCourses()
  }, [])
  return (
    <div>
      <h2 className='text-[26px] font-medium p-5'>My Courses:</h2>
      <div
        className='grid grid-cols-1 sm:grid-cols-2
        md:grid-cols-3 lg:grid-cols-4 mt-5 gap-5 m-5'
      >
        {courses.map((item, index) => (
          <div
            className='border rounded-lg p-5
             cursor-pointer hover:border-purple-500'
            key={index}
          >
            <Link href='/courses/[code]' as={`/courses/${item.code}`}>
              <h4 className='text-purple-900'>{item.code}</h4>
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Courses
