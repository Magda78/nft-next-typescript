import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import type { GetServerSideProps, NextPage } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings'
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast, { Toaster } from 'react-hot-toast'
import Typewriter from 'typewriter-effect';

interface Props {
    collection: Collection
}

function NFTItemPage({collection}: Props) {

  const[claimedSupply, setClaimedSupply] = useState<number>(0);
  const[totalSupply, setTotalSupply] = useState<BigNumber>();
  const[loading, setLoading] = useState<boolean>(true);
  const[price, setPrice] = useState<string>();
  const [nftName, setNftName] = useState<string>();
  const [nftProperties, setNFTProperties] = useState<string>()

    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();
    const nftDrop = useNFTDrop(collection.address);

    useEffect(()=> {
if(!nftDrop) return;
const fetchNFTDropData = async() => {
  setLoading(true)
const claimed = await nftDrop.getAllClaimed();
const total = await nftDrop.totalSupply();
setClaimedSupply(claimed.length);
setTotalSupply(total);
setLoading(false)

}
const fetchPrice = async() => {
const claimConditions = await nftDrop.claimConditions.getAll();
setPrice(claimConditions?.[0].currencyMetadata.displayValue)
}

fetchNFTDropData();
fetchPrice();
    },[nftDrop]);


    const mintNFT = () => {
      setLoading(true)
      const notifications = toast.loading('Minting...', {
        style: {
          padding: '20px',
          color: 'white',
          background: 'purple'
        }
      });
      if(!nftDrop || !address) return;
      const quantity = 1;
      nftDrop.claimTo(address, quantity).then(async(tx) => {
        const receipt = tx[0].receipt;
        const claimedTockenId = tx[0].id;
        const claimedNFT = await tx[0].data();
       setNftName(claimedNFT?.metadata?.name);
       //const obj = claimedNFT?.metadata?.properties;
       //const keys=Object.keys(obj).join()
       //setNFTProperties(keys)
       
       //setNFTProperties(Object.entries(claimedNFT?.metadata?.properties))
       //for (const property in claimedNFT?.metadata?.properties) {
         //console.log(`${property}: claimedNFT?.metadata?.properties[${property}] `)
       //}

        toast('Succesfully Minted',{
          duration: 8000,
          style: {
            padding: '20px',
            color: 'white',
            background: 'purple'
          }
        })
        console.log(receipt)
        console.log(claimedTockenId)
        console.log(claimedNFT)

      }).catch(err => {
        toast('Something went wrong', {
          style: {
            padding: '20px',
            color: 'red',
            background: 'purple'
          }
        })
        console.log(err)
      }).finally(()=>{
setLoading(false);
toast.dismiss(notifications);
      })
    }
   
{console.log(address)}

  return (
      <div id='main' className='relative flex flex-col md:h-screen md:flex md:flex-row'>
        <Toaster position='bottom-center'/>
   <div className='bg-purple-900 h-2/3 p-10 flex flex-col justify-center items-center md:h-screen'>
        <div className='h-[200px] w-[200px]  flex justify-center items-center bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 mb-10'>
            <div className='p-20 relative bg-red-800 '>
            <Image src={urlFor(collection.previewImage).url()} layout='fill' objectFit='cover' className='hover:scale-110 transition transform duration-200 easy-out'/>
            </div>
           
        </div>
        <h1 className='md:text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>{collection.nftCollectionName}</h1>
        <p className='mt-5 md:text-center text-white text-md'>{collection.description}</p>
    </div>
    < div className='mt-10 flex flex-col items-center p-5 w-full'>
        <div className='flex w-full justify-between items-center border-b-2 p-2'>
            <Link href='/'>
            <h1>The <span className='cursor-pointer text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>PAPAFAM</span> NFT Market Place</h1>
            </Link>
        
        <button onClick={() => address ? disconnect() :connectWithMetamask()} className='cursor-pointer bg-pink-500 pr-3 pl-3 pt-2 pb-2 text-white rounded-lg hover:bg-purple-500 '>{address ? 'SignOut' :'SignIn'}</button>
        
        </div>
        {address && (
            <p className='text-center mb-8 text-purple-500'>You are logged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>
        )}
        <div className='relative h-[300px] w-[300px] mt-10'>
        
            <Image src={urlFor(collection.mainImage).url()} layout='fill' objectFit='contain' />
        </div>
        <div className='mt-8 mb-8 flex flex-col justify-center items-center'>
            <h1 className='text-4xl text-center font-bold'>{collection.title}</h1>
            {loading ? <p className='animate-pulse'>Loading Supply Count...</p> : <p>{claimedSupply}/{totalSupply?.toString()} NFT's claimed</p>}
            {loading && (
              <img  src='https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif' className='w-40 h-40 object-contain'  />
            )}
        </div>
            <button onClick={mintNFT} disabled={loading || claimedSupply === totalSupply?.toNumber() || !address} className='disabled:bg-red-700 mb-5 text-white cursor-pointer w-full px-3 py-3 mt-10 bg-gradient-to-r from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-lg hover:bg-gradient-to-r hover:from-pink-500 via-purple-500 to-indigo-500'>
              {loading ? (
<>Loading...</>
              ): (
                claimedSupply === totalSupply?.toNumber() ?(
<>Sold Out</>
                ):
                (!address) ? (
<>SignIn to Mint</>
                ): 
                (
                 <span>Mint NFT {price}ETH</span>
                )
              )} 
             
              </button>
              {
                nftName && (
                  <div className='absolute text-purple-600 top-0'>
                    <Typewriter
        onInit={(typewriter) => {
          typewriter.typeString(`You pick ${nftName}!!!!! `)
            .callFunction(() => {
              console.log('String typed out!');
            })
            .pauseFor(2500)
            .deleteAll()
            .callFunction(() => {
              console.log('All strings were deleted');
            })
            .start();
        }}
      />
                  </div>
                )
              }
 </div>
      </div>
 
  )
}

export default NFTItemPage

export const getServerSideProps: GetServerSideProps = async({params}) => {
    const query = `
    *[_type == "collection" && slug.current == $id][0] {
      _id,
      title,
      address,
      description,
      nftCollectionName,
      mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
      current
    }
    }
    }
    `
    const collection = await sanityClient.fetch(query, {
        id: params?.id
    });

    if(!collection) {
        return {
            notFound: true
        }
    }
  
    return {
      props: {
        collection
      }
    }
  }
  