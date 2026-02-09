import styles from '../Styles/myfavorite.module.css'
import { useState, useEffect, useContext } from 'react'
import WideCard from './WideCard'
import { FetchUser } from '../contextAPI/UserProvider'
import { SearchResults, ProductsData } from '../contextAPI/ProductsProvider'

const MyFavorite = () => {

    const [favs,setFavs] =  useState([]) 
    const currentUser = useContext(FetchUser)
    const products = useContext(ProductsData)
    const searchResults = useContext(SearchResults)

    const fetchUserFavorites = async()=>{
            const favorites = currentUser?.favorites ?? []
                let favItems = []
                favorites?.forEach((fav)=>{
                    const favItem = products?.find(product=>product._id===fav.productId)
                    if(favItem) favItems = [...favItems, favItem]
                })        
                setFavs(favItems)
    }
   
    useEffect(()=>{
        fetchUserFavorites()
    },[currentUser, products])

  return (
    <div className={styles.fav}>
    {searchResults?.length===0 && <>
       <p className={styles.favtitle}>
        <svg xmlns="http://www.w3.org/2000/svg" className={`bi bi-heart-fill`} viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
        </svg> Favorite Products</p>
        <hr/>
        <div className={styles.favcontainer}>
            {favs?.map(product=>{return(
                <WideCard product={product}/>
            )})}
        </div>
    </>
        }
    </div>
  )
}

export default MyFavorite