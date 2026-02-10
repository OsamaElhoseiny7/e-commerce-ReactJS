import { useContext, useEffect, useState } from "react"
import styles from '../Styles/searchpage.module.css'
import TallCard from "./TallCard"
import { SearchResults } from "../contextAPI/ProductsProvider"
import { useLocation } from "react-router-dom"

const SearchResult = () => {

    const [show, setShow]  = useState()
    const searchResults = useContext(SearchResults)
    const location = useLocation().pathname
    const checkURL = location?.includes('/user/products/')
    const [pageWidth, setPageWidth] = useState(window.innerWidth)

    const initializingVehicles = async()=>{
        if(pageWidth<=430){
            searchResults?.length>=4 ? setShow(4) : setShow(searchResults?.length)
        }
        else{
            searchResults?.length>=5 ? setShow(5) : setShow(searchResults?.length)
        }
    }
    const handleShow = ()=>{
         if(pageWidth<=430){
             show===searchResults?.length ? setShow(4) : show+4 > searchResults?.length ? setShow(searchResults?.length) : setShow(show+4)
         }
         else{
             show===searchResults?.length ? setShow(5) : show+5 > searchResults?.length ? setShow(searchResults?.length) : setShow(show+5)
         }
       
    }

    useEffect(()=>{
         initializingVehicles()
    },[])
   
  return (
    <>
    { !checkURL &&
        <div className={styles.searchcontainer}>
        <p className={styles.blocktitle}>Searched Products</p>
        <div className={styles.cardscontainer}>
        {searchResults?.slice(0,show).map((product)=>{
            return(
                <TallCard product={product}/>
            )
        })}
        </div>
          {(searchResults?.length>5 || searchResults?.length>4) &&<div className={styles.showmore}><button onClick={handleShow}>{searchResults?.length===show? 'show less' : 'show more'}</button></div>
          }
    </div>
    }
    </>
  )
}

export default SearchResult