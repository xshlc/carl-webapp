import React from 'react'
import Constant from '../_utils/Constant'

function Hero() {
  return (
    <div>
      <section className='bg-gray-50'>
        <div className='mx-auto max-w-screen-xl px-4 py-32 lg:flex'>
          <div className='mx-auto max-w-xl text-center'>
            <h1 className='text-3xl font-extrabold sm:text-5xl'>
              <span className='text-primary'>CARL{'\n'}</span> 
              <span className='text-secondary text-black'>Teacher Dashboard</span>
            </h1>

            <p className='mt-4 sm:text-xl/relaxed text-gray-700'>
              {Constant.desc}
            </p>

            <div className='mt-8 flex flex-wrap justify-center gap-4'>
              <a
                className='block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto'
                href='/dashboard'
              >
                Get Started
              </a>

              <a
                className='block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow hover:text-blue-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto'
                href='/about'
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
