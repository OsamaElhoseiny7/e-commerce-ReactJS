import { useContext, useEffect, useState } from "react"
import styles from '../Styles/categories.module.css'
import TallCard from "./TallCard"
import { SearchResults, ProductsData } from "../contextAPI/ProductsProvider"

const Categories = () => {

    const [show, setShow]  = useState(0)
    const products = useContext(ProductsData)
    const searchResults = useContext(SearchResults)
    const [pageHeight, setPageHeight] = useState(window.innerWidth)
    const categories = ['T-Shirts','Pants','Jackets','Hoodies','Dresses','Shoes','Socks','Accesorries','Suites']
    const [category, setCategory] = useState([])


    const initializingProducts = ()=>{
        if(pageHeight<=430){
            category?.length>=4 ? setShow(4) : setShow(category?.length)
        }
        else{
            category?.length>=5 ? setShow(5) : setShow(category?.length)
        }
    }

    const handleShow = ()=>{
        if(pageHeight<=430){
            show===category?.length ? setShow(4) : show+4 > category?.length ? setShow(category?.length) : setShow(show+4)
        }
        else{
            show===category?.length ? setShow(5) : show+5 > category?.length ? setShow(category?.length) : setShow(show+5)
        }
    }

    const handelCategory = (event)=>{
        const {category} = event.target.dataset
        const result = products?.filter((product)=>product.category===category) 
        setCategory(result)
    }

    useEffect(()=>{
        category.length!==0 && initializingProducts()
    },[category, pageHeight])

    useEffect(()=>{
        const tshirts = products?.filter((product)=>product?.category==='T-Shirts')
        setCategory(tshirts) 
    },[products])

   
  return (
    <>
    {searchResults?.length===0 &&
    <>
        {products?.length!==0 && <div className={styles.category}>
            <ul>
                {categories.map((item)=><li data-category={item} onClick={handelCategory} style={{color:category?.[0]?.category===item&&'greenyellow'}}>{item}</li>)}
            </ul>
        </div>}
        {category?.length>0 && 
              <div className={styles.categorycontainer}>
                <p className={styles.blocktitle}>{category?.[0].category}</p>
                <div className={styles.cardscontainer}>
                {category?.slice(0,show).map((product)=>{
                    return(
                        <TallCard product={product} key={product._id}/>
                    )
                })}
                </div>
                  {(category?.length>5 || category?.length>4) &&<div className={styles.showmore}><button onClick={handleShow}>{category?.length===show? 'show less' : 'show more'}</button></div>}
            </div>
        }
    </>
            }
    </>
  )
}

export default Categories