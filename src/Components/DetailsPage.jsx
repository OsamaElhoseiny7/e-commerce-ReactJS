import { useContext, useLayoutEffect, useState } from 'react'
import styles from '../Styles/detailspage.module.css'
import { useParams } from 'react-router-dom'
import { ProductData, ProductsData, SearchResults } from '../contextAPI/ProductsProvider'
import DetailsCard from './DetailsCard'
import CategoryCard from './CategoryCard'

const DetailsPage = () => {
    const {productId} = useParams()
    const [category, setCategory] = useState([])
    const {fetchProductById, product} = useContext(ProductData)
    const products = useContext(ProductsData)
    const searchResults = useContext(SearchResults)

    const catchCategory = ()=>{
      const sameCategory = products?.filter((item)=> item.category===product?.category&& item._id!==productId)
      setCategory(sameCategory)
    }

    useLayoutEffect(()=>{
        fetchProductById(productId)
    },[productId])

    useLayoutEffect(()=>{
        catchCategory()
    },[product, products])

    console.log(category)

  return (
    <>
    {/* {searchResults?.length===0 && */}
    <div className={styles.detailspage}>
         {product && <DetailsCard product={product}/>}
         <hr className={styles.page}/>
         <div className={styles.suggestions}>
           {category.length!==0 &&
           <>
           <h3>You might also like</h3>
           <div className={styles.categorycontainer}>
             {category?.map((product)=><CategoryCard product={product}/>)}
           </div>
           </>
           }
         </div>
   </div>
    {/* } */}
    </>
  
  )
}

export default DetailsPage