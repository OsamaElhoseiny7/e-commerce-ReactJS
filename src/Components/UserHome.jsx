import { useContext, useEffect, useState } from "react"
import styles from '../Styles/userhome.module.css'
import TallCard from "./TallCard"
import { SearchResults, ProductsData } from "../contextAPI/ProductsProvider"
import axios from "axios"

const UserHome = () => {

    const [show, setShow]  = useState(0)
    const products = useContext(ProductsData)
    const searchResults = useContext(SearchResults)
    const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

    

    const initializingProducts = ()=>{
      if(width<=430){
         products?.length>=4 ? setShow(4) : setShow(products?.length)   
      }
      else{
         products?.length>=5 ? setShow(5) : setShow(products?.length)
      }
    }

    const handleShow = ()=>{
      if(width<=430){
        show===products?.length ? setShow(4) : show+4 > products?.length ? setShow(products?.length) : setShow(show+4)
      }
      else{
        show===products?.length ? setShow(5) : show+5 > products?.length ? setShow(products?.length) : setShow(show+5)
      }
        
    }

    useEffect(()=>{
        //  products.length!==0 && initializingProducts()
        if (!products || products.length === 0) return;

        if (width <= 430) {
          setShow(products.length >= 4 ? 4 : products.length);
        } else {
          setShow(products.length >= 5 ? 5 : products.length);
        }
    

    },[products, width])

    useEffect(()=>{

      const r=async()=>{

        try{
        const x=  await axios.get('https://book-store-api-mu.vercel.app/Books')
        console.log(x)
      }
      catch(error){
        console.log(error)
      }
      }
      r()
    },[])


   
  return (
    <>
    {searchResults?.length===0 &&
      <div className={styles.vehiclescontainer}>
        <p className={styles.blocktitle}>All Products</p>
        <div className={styles.cardscontainer}>
        {products?.length>0 && products?.slice(0,show).map((product)=>{
            return(
                <TallCard product={product} key={product._id}/>
            )
        })}
        </div>
          {products?.length>5 &&<div className={styles.showmore}><button onClick={handleShow}>{products?.length===show? 'show less' : 'show more'}</button></div>}
    </div>
    }
    </>
  )
}

export default UserHome