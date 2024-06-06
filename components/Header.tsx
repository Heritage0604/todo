'use client'
import Image from 'next/image'
import React from 'react'
import Avatar from 'react-avatar'
import {BiSearch} from 'react-icons/bi'
import { useBoardStore } from '@/store/BoardStore'

const Header = () => {
  
 const[searchString,setSearchString]=useBoardStore((state)=>[
    state.searchString,state.setSearchString
  ])
  return (
  <header>
    <div className='absolute top-0 left-0 w-full
            bg-gradient-to-br  from-pink-400 rounded-md
             to-[#0055D1] h-96 filter blur-3xl opacity-50 -z-50' />
     <div className='flex flex-col p-5 select-none
    md:flex-row rounded-b-2xl
     items-center bg-gray-500/10  justify-between'>
        
        <Image  src='https://links.papareact.com/c2cdd5'
        alt='Trello Logo'
        width={300}
        height={300}
        className='w-48 object-contain h-20 select-none '/>

        <div className=' flex items-center justify-end   w-80 md:w-full'>
            <form className=' mr-3 rounded-md bg-white p-4 flex flex-row'>
                <BiSearch className='h-6 w-6 mr-2 text-gray-400'/>
                <input placeholder='Search ' value={searchString} onChange={(e)=>setSearchString(e.target.value)} className='outline-none border-none'/>
                 
            </form>
            <Avatar name='Heritage Adegbite' size='50' round color='#0055D1'/>
        </div>
    </div>
  </header> 
  )
}

export default Header