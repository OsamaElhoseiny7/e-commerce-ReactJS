import {useNavigate} from 'react-router-dom'
import styles from '../Styles/successpage.module.css'
import { useContext } from 'react'
import { UserOrder } from '../contextAPI/UserProvider'
import { useEffect } from 'react'

const SuccessPage = () => {

  const params = window.location.search;
  const sessionId = params?.split('=')[1];
  const {lastOrder, paymentResult} = useContext(UserOrder)
  const navTo = useNavigate()
  // const subtotal= lastOrder?.subtotal?.toString()
  // const numBegin = parseInt(subtotal?.split('.')?.[0])
  
  // if(length)
  // const numEnd = subtotal?.split('.')?.[1]
  const x ={}
  const y = Object.keys(x)
  console.log(y.length)

 
  useEffect(()=>{
    sessionId&&paymentResult(sessionId)
  },[sessionId])

  return (
    <>
    {Object.keys(lastOrder).length!==0&&
      <div className={styles.successcontainer}>
        <div className={styles.successicon}>✔</div>
        <p className={styles.successtitle}>Payment Successful!</p>
        <p className={styles.successmsg}>Thank you for your purchase! Your payment has been processed successfully.</p>
        <div className={styles.successbody}>
            <div className={styles.top}>
              <div className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list-check" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"/>
              </svg>
              </div>
              <div className={styles.text}>
                <p>Order Summary</p>
                <p className={styles.orderid}>Order ID: <span>#{lastOrder?._id?.slice(5,10)}</span></p>
              </div>    
            </div>
            <hr />
            <div className={styles.middle}>
              <div className={styles.left}>
                <p>Payment Date: <span>{lastOrder?.createdAt?.fullDate}</span><span>{lastOrder?.createdAt?.fullTime}</span></p>
                <p>Amount Paid: <span>{lastOrder?.subtotal}</span></p>
              </div>

              <div className={styles.right}>
                <p className={styles.price}>{lastOrder?.subtotal}</p>
                <p className={styles.completed}>Completed</p>
              </div>
            </div>
            <hr />
            <div className={styles.bottom}>
              <div className={styles.btns}>
                <button onClick={()=>navTo('/user/home')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                </svg> Go to Home
                </button>
                <button onClick={()=>navTo('/user/orders')}>
                  <svg xmlns="http://www.w3.org/2000/svg"  className="bi bi-list-ul" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                </svg> View My Orders
                </button>
              </div>
              <p>You can go to the home page or view your orders for more details.</p>
            </div>
        </div>
      </div>
     }
    </>
  )
}

export default SuccessPage