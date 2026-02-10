import styles from '../Styles/usercart.module.css'
import { useState, useEffect, useContext } from 'react'
import WideCard from './WideCard'
import { FetchUser } from '../contextAPI/UserProvider'
import { SearchResults, ProductsData } from '../contextAPI/ProductsProvider'
import axios from 'axios'
import {loadStripe} from '@stripe/stripe-js'


const UserCart = () => {
    const [cart,setCart] =  useState([]) 
    const currentUser = useContext(FetchUser)
    const products = useContext(ProductsData)
    const searchResults = useContext(SearchResults)
    const token = localStorage.getItem('token')
    const [subtotal,setSubtotal] =  useState(0)
    const [quantity, setQuantity] =  useState(0)
    
    const fetchUserCart = ()=>{
      const cart = currentUser?.cart ?? []
      let totalprice=0;
      let cartItems = []
      let quantities = 0
      cart?.forEach((item)=>{
        const cartItem = products?.find(product=>product._id===item.productId)
        quantities += item.quantity
        if(cartItem){
          const fullItem = {...cartItem,'quantity':item.quantity}
          totalprice += fullItem.price * fullItem.quantity
          cartItems = [...cartItems, fullItem]
        }
      })
      setQuantity(quantities)
      setCart(cartItems)
      setSubtotal(Math.round(totalprice))        
    }

    console.log(cart)

    const handlePayment = async()=>{
      try{
        const stripe = await loadStripe('pk_test_51Ss1p9D5oVBwXl7bopYAW1xkcVK4g4NBMI1QF3mnHPuLjkLfVDJ1azV28pK5NoxAJSMkLk043HpNcVneu46MA92700LEEu606p')
        if (!stripe) {
      // Stripe.js didn't load, probably blocked
      alert(
        "Payment service is blocked. Please disable ad blockers or privacy extensions and refresh the page."
      );
      return;
    }
        const {data} = await axios.post("https://e-commerce-nodejs-production-a535.up.railway.app/create-checkout-session", {cart},{headers:{Authorization:`Bearer ${token}`}})
        console.log(data.url)
        window.location.href = data.url     
    }
      catch(error){console.log(error)}   
    }
   
    useEffect(()=>{
        fetchUserCart()
    },[currentUser, products])

  return (
    <div className={styles.cart}>
    {searchResults?.length===0&&<>
      <div className={styles.left}>    
         <p className={styles.cartTitle}>Shopping Cart</p>
            <hr />
          <div className={styles.cartcontainer}>
              {cart?.map(product=>{return(
                <WideCard key={product._id} product={product}/>
              )})}
          </div>
          <p className={styles.subtotal}>{`Subtotal (${quantity} items): `}<span>${subtotal}</span></p>
      </div>
      <div className={styles.right}>
              <p>{`Subtotal (${quantity} items): `}<span>${subtotal}</span></p>
              <button onClick={handlePayment} className={styles.proceedbtn}>Proceed to checkout</button>
      </div>
    </>
    }
    </div>
  )
}

export default UserCart