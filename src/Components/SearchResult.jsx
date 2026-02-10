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

    const initializingVehicles = async()=>{
            searchResults?.length>=5 ? setShow(5) : setShow(searchResults?.length)
    }
    const handleShow = ()=>{
        show===searchResults?.length ? setShow(5) : show+5 > searchResults?.length ? setShow(searchResults?.length) : setShow(show+5)
    }

    useEffect(()=>{
         initializingVehicles()
    },[])
   
  return (
    <>
    { !checkURL &&
        <div className={styles.searchcontainer}>
        <p className={styles.blocktitle}>{'Searched Products'}</p>
        <div className={styles.cardscontainer}>
        {searchResults?.slice(0,show).map((product)=>{
            return(
                <TallCard product={product}/>
            )
        })}
        </div>
          {searchResults?.length>5 &&<div className={styles.showmore}><button onClick={handleShow}>{searchResults?.length===show? 'show less' : 'show more'}</button></div>
          }
    </div>
    }
    </>
  )
}

export default SearchResult