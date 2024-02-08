'use client'
import React from 'react'
import UploadCourseFile from './_components/UploadCourseFile'
import EnrolledStudents from './_components/EnrolledStudents'
import { useState, useEffect } from 'react'
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore'
import app from '@/firebaseConfig.js'

function ManageCourse({ params }) {
  const decodedCourseName = decodeURIComponent(params.name)
  console.log({ params })

  const [studentsList, setStudentsList] = useState([])

  const db = getFirestore(app)
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(
        db,
        'Instructor',
        'TestInstructor',
        'Class',
        decodedCourseName,
      )
      const docSnap = await getDoc(docRef)
      console.log(docSnap.data())
      const courseStudents = docSnap.data()['course-students']

      const studentsData = []

      for (let studentRef of courseStudents) {
        const studentDocSnap = await getDoc(studentRef)

        studentsData.push(studentDocSnap.data())
      }
      console.log(studentsData)
      setStudentsList(studentsData)
    }

    fetchData()
  }, [])

  return (
    <div>
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-[26px] font-medium pl-10 m-5'>
          <strong>Manage Course</strong>
          <div className='text-primary pt-2 text-4xl'>{decodedCourseName}</div>
        </h2>
        <h4 className='text-[18px] font-medium pl-10'></h4>
      </div>
      <span className='flex items-center m-auto'>
        <span className='h-px flex-1 bg-gray-200'></span>
      </span>
      <div className='m-5 p-10 flex justify-evenly items-center'>
        <EnrolledStudents course={decodedCourseName} students={studentsList} />
      </div>
      <span className='flex items-center text-gray-500'>
        <span className='h-px flex-1 bg-gray-200'></span>
      </span>

      <div>
        <UploadCourseFile course={decodedCourseName} />
      </div>
    </div>
  )
}

export default ManageCourse
