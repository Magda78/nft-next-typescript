import React from 'react';
import Image from 'next/image';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";


function NFTItemPage() {

    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();

{console.log(address)}
  return (
      <div className='flex flex-col md:flex-row md:h-screen'>
   <div className='bg-purple-900 h-2/3 p-10 flex flex-col justify-center items-center md:h-screen'>
        <div className='h-[200px] w-[200px]  flex justify-center items-center bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 mb-10'>
            <div className='p-20 relative bg-red-800 '>
            <Image src='/img/pic1.webp' layout='fill' objectFit='cover' className='hover:scale-110 transition transform duration-200 easy-out'/>
            </div>
           
        </div>
        <h1 className='md:text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>PAPAFAM Apes</h1>
        <p className='mt-5 md:text-center text-white text-md'>A Collection of PAPAFAM Apes, who live & breath React.</p>
    </div>
    < div className='mt-10 flex flex-col items-center p-5 w-full'>
        <div className='flex w-full justify-between items-center border-b-2 p-2'>
        <h1>The <span className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>PAPAFAM</span> NFT Market Place</h1>
        <button onClick={() => address ? disconnect() :connectWithMetamask()} className='cursor-pointer bg-pink-500 pr-3 pl-3 pt-2 pb-2 text-white rounded-lg hover:bg-purple-500 '>{address ? 'SignOut' :'SignIn'}</button>
        
        </div>
        {address && (
            <p className='text-center mb-8 text-purple-500'>You are logged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>
        )}
        <div className='relative h-[300px] w-[300px] mt-10'>
        
            <Image src='/img/pic2.png' layout='fill' objectFit='contain' />
        </div>
        <div className='mt-8 mb-8'>
            <h1 className='text-4xl text-center'>The <span className='font-bold'>PAPAFAM Ape</span> Coding Club | NFT Drop</h1>
        </div>
            <button className='mb-5 text-white cursor-pointer w-full px-3 py-3 mt-10 bg-gradient-to-r from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-lg hover:bg-gradient-to-r hover:from-pink-500 via-purple-500 to-indigo-500'>Mint NFT</button>
 </div>
      </div>
 
  )
}

export default NFTItemPage