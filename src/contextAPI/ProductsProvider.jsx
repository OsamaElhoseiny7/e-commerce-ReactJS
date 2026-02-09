import { createContext, useEffect, useState } from "react"
import axios from "axios"

export const ProductsData = createContext()
export const ProductData = createContext()
export const SearchResults = createContext()
export const SearchHandler = createContext()


const ProductsProvider = ({children}) => {

    const [products, setProducts] = useState([])
    const [product, setProduct] = useState({})
    const [searchResults,setSearchResult] = useState([])

    const fetchProducts = async()=>{
         try{
            const products = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/products')
            setProducts(products.data.products)
            // console.log(vehicles.data.vehicles)
        }
        catch(error){
            console.log(error.message)
        }
    } 

    const fetchProductById = async(productId)=>{
           try{
            const {data} = await axios.get(`https://e-commerce-nodejs-production-a535.up.railway.app/products/${productId}`)
            setProduct(data.product)
        }
        catch(error){
            console.log(error.message)
        }
    }

    const handleSearch = (searchData)=>{
         const result = products?.filter(product=>product.title.replace(/\s+/g, "").toLowerCase().includes(searchData))
         setSearchResult(result)
    }

    useEffect(()=>{
        fetchProducts()
    },[])


  return (
    <>
        <ProductsData.Provider value={products}>
        <ProductData.Provider value={{fetchProductById, product}}>
        <SearchResults.Provider value={searchResults}>
        <SearchHandler.Provider value={handleSearch}>
            {children}
        </SearchHandler.Provider>    
        </SearchResults.Provider>
        </ProductData.Provider>    
        </ProductsData.Provider>
    </>
  )
}

export default ProductsProvider