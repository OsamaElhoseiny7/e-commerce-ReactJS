import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import { Children } from "react";
import { FetchUser } from "./UserProvider";


export const UserOrders = createContext()
export const UserOrder = createContext()


const OrdersProvider = ({children}) => {

    const [orders, setOrders] = useState([])
    const token = localStorage.getItem('token')
    const user = useContext(FetchUser)

    const fetchUserOrders = async()=>{
        if(!token) return
        try{
            const {data} = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/user/orders', {headers:{Authorization:`Bearer ${token}`}})
            setOrders(data?.orders)

        }
        catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        user?.orders?.length && fetchUserOrders()
    },[])

  return (
    <UserOrders.Provider value={{fetchUserOrders,orders}}>
        {children}
    </UserOrders.Provider>
  )
}

export default OrdersProvider