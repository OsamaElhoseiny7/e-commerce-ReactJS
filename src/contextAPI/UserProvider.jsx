import { createContext, useEffect, useState, useContext } from "react"
import axios from "axios"

export const FetchUser = createContext()
export const FetchUserMethod = createContext()
export const UpdateCart = createContext()
export const TokenHandler = createContext()
export const UpdateFavorites = createContext()
export const UpdateUser = createContext()
export const UserOrder = createContext()


const UserProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState({})
    const [lastOrder, setLastOrder] = useState({})
    const [updateResult, setUpdateResult] = useState('')
    const [token, setToken] = useState(localStorage.getItem('token'))
    const fetchUserMethod = useContext(FetchUserMethod)

    const handleToken = (token)=>{
        setToken(token)
    }

    const fetchUser = async()=>{
        try{
            const user = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/user/userdata',{headers:{
                        Authorization:`Bearer ${token}`
                    }})
    
            setCurrentUser(user.data.userData) 
        }
        catch(error){
            console.log(`some thing went wrong in user data ${error.message}`)
        }
    }

    const paymentResult = async(sessionId)=>{
        try{
            const varification =  await axios.post("https://e-commerce-nodejs-production-a535.up.railway.app/verify-payment", {sessionId},{headers:{Authorization:`Bearer ${token}`}});
            fetchUserMethod()
            setLastOrder(varification?.data?.order)
        }
         catch(error){
            error?.response?.data?.order&&setLastOrder(error?.response?.data?.order)
            console.log(error)
         } 
    }


    const updateFavorites = async(productId, favState)=>{
       if(favState === 'white' ){
           try{
               await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/user/addtofavorites',{productId},{headers:{
                   Authorization:`Bearer ${token}`
               }})

                const user = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/user/userdata',{headers:{
                        Authorization:`Bearer ${token}`
                    }})
    
                setCurrentUser(user.data.userData) 
                return ('rgb(180, 29, 29)')
            }
            catch(error){
                console.log(error.message)
            }
        }
        else{
             try{
               await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/user/removefromfavorites',{productId},{headers:{
                   Authorization:`Bearer ${token}`
               }})
                const user = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/user/userdata',{headers:{
                        Authorization:`Bearer ${token}`
                    }})
    
                setCurrentUser(user.data.userData) 
                return 'white'

            }
            catch(error){
                console.log(error.message)
            }
        }
    }

    const addToCart = async(productId)=>{
           try{
               await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/user/addtocart',{productId},{headers:{
                   Authorization:`Bearer ${token}`
               }})
               const user = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/user/userdata',{headers:{
                        Authorization:`Bearer ${token}`
                    }})
    
               setCurrentUser(user.data.userData)
            }
            catch(error){
                console.log(error.message)
            }
        }

    const removeFromCart = async(productId)=>{
           try{
               await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/user/removefromcart',{productId},{headers:{
                   Authorization:`Bearer ${token}`
               }})
               const user = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/user/userdata',{headers:{
                        Authorization:`Bearer ${token}`
                    }})
    
               setCurrentUser(user.data.userData)
            }
            catch(error){
                console.log(error.message)
            }
        }

    const updateUserMethod = async(newData)=>{
         try{
               await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/user/update',newData,{headers:{
                   Authorization:`Bearer ${token}`
               }})
               const user = await axios.get('https://e-commerce-nodejs-production-a535.up.railway.app/user/userdata',{headers:{
                        Authorization:`Bearer ${token}`
                    }})
    
                setCurrentUser(user.data.userData)
                setUpdateResult('data has been updated successfully')
            }
            catch(error){
                setUpdateResult(error.response?.data?.message)
            }
    }

    useEffect(()=>{
        token && fetchUser()
    },[token])


  return (
    <>
    <FetchUser.Provider value={currentUser}>
    <FetchUserMethod.Provider value={fetchUser}>
    <UpdateCart.Provider value={{addToCart,removeFromCart}}>
    <UpdateFavorites.Provider value={updateFavorites}>
    <TokenHandler.Provider value={handleToken}>
    <UpdateUser.Provider value={{updateUserMethod, updateResult}}>
    <UserOrder.Provider value={{lastOrder, paymentResult}}>
        {children}
    </UserOrder.Provider>
    </UpdateUser.Provider>    
    </TokenHandler.Provider>
    </UpdateFavorites.Provider>    
    </UpdateCart.Provider>    
    </FetchUserMethod.Provider>    
    </FetchUser.Provider>
    </>
  )
}

export default UserProvider