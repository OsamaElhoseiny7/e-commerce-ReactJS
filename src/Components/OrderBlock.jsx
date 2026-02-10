import styles from '../Styles/orderblock.module.css'
import { useEffect, useState } from 'react'
import OrderCard from './OrderCard';


const OrderBlock = ({order}) => {

    const orederId = "#" + order?._id?.slice(5,10)
    const [active,setActive] = useState(false)

    const handleClick = ()=>{
        setActive(!active)
    }

    console.log(active)

  return (
        <div className={styles.orderblock}  style={{marginBottom: active&&40+'px'}}>
            <div className={styles.orderdetails}>
                <p className={styles.orderid} onClick={handleClick}>Order: {orederId}</p>
                <hr />
                {active && <div>
                    <p>Ordered on:<span>{order.createdAt?.fullDate}</span>at:<span>{order.createdAt?.fullTime}</span></p>
                    <p>Quantity: {order.totalAmount} item(s)</p>
                    <p>Subtotal: ${order.subtotal}</p>
                    <p>Status: {order.status}</p>
                </div>}
            </div>
           {active && order?.products?.map((item)=>{
            return (
                <OrderCard key={item.productId} item={item}/>
            )
           })}
        </div>
  )
}

export default OrderBlock