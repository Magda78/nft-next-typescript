import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import { Collection } from '../typings';
import { sanityClient, urlFor } from '../sanity';
import  Link  from 'next/link';

interface Props {
  collections: Collection[]
}


const Home = ({collections }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex w-full justify-between items-center border-b-2 p-2'>
      <h1>The <span className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>PAPAFAM</span> NFT Market Place</h1>
        </div>
      
      <main className=" bg-purple-900 flex w-full h-screen flex-1 flex-col items-center justify-center px-20 text-center">
      
      <div>
        
          {collections.map(collection => (
            <Link href={`/nft/${collection.slug.current}`}>
            <div className='flex flex-col justify-center items-center p-8 border-2 border-indigo-500'>
             <div className='h-[200px] w-[200px]  flex flex-col justify-center items-center bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 mb-10'>
                  <img src={urlFor(collection.mainImage).url()} className='cursor-pointer hover:scale-110 transition transform duration-200 easy-out'/>
                  
              </div>
            <div>
            <h1 className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>{collection.title}</h1>
              <p className='text-white mt-3'>{collection.description}</p>
              </div>
              </div>
            </Link>
          ))}
          </div>
        
      </main>

      
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async() => {
  const query = `
  *[_type == "collection"] {
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
  const collections = await sanityClient.fetch(query);

  return {
    props: {
      collections
    }
  }
}
