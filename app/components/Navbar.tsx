import Link from 'next/link'
import React from 'react'
import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <div className='flex justify-center'>
        <nav className='p-4 border border-gray-100 w-1/2 mt-8 rounded-3xl flex justify-between items-center text-white'>
            <div>
                <Link href="/" className='mx-4'>Logo</Link>
            </div>
            <div className='flex flex-row gap-8'>
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                
                <SignedIn>
                    <UserButton/>
                </SignedIn>
                <SignedOut>
                    <Link href="/sign-up">Sign Up</Link>
                    <Link href="/sign-in">Sign In</Link>
                </SignedOut>
                
            </div>
            
            
        
        </nav>
    </div>
    
  )
}

export default Navbar
