import styles from '../Styles/orders.module.css'
import { useEffect, useContext } from 'react'
import { SearchResults } from '../contextAPI/ProductsProvider'
import { UserOrders } from '../contextAPI/OrdersProvider'
import OrderBlock from './OrderBlock'

const Orders = () => {

    const searchResults = useContext(SearchResults)
    const {fetchUserOrders, orders} = useContext(UserOrders)

    useEffect(()=>{
        fetchUserOrders()
    },[])

   console.log(orders)

  return (
    <div className={styles.orders}>
    {searchResults?.length===0 && 
        <>
            <p className={styles.orderstitle}># Orders</p>
            {/* <hr className={styles.titleline}/> */}
            {orders?.length!==0 && orders?.map(order=>{return(
                <OrderBlock order={order} key={order._id} />
            )})}
        </>
    }
    </div>
  )
}

export default Orders