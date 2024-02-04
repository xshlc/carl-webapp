import { AlignJustify } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function TopHeader({ setToggleBar }) {
  return (
    <div
      className='flex p-5 border-b 
    items-center justify-between
    md:justify-end'
    >
      <AlignJustify className='md:hidden' onClick={() => setToggleBar(true)} />
      <Image
        src='/carl-logo.png'
        alt='logo'
        width={50}
        height={50}
        className='md:hidden cursor-pointer'
      />
      {/* <UserButton /> */}
    </div>
  )
}

export default TopHeader
