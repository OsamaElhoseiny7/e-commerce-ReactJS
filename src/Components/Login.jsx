import { useEffect, useRef, useState, useContext } from 'react'
import axios from 'axios';
import styles from '../Styles/user_login.module.css'
import { useNavigate } from 'react-router-dom';
import { TokenHandler } from '../contextAPI/UserProvider';


const Login = () => {

  const [formTextData,setFormTextData] = useState()
  const navTo = useNavigate()
  const passwordRef = useRef()
  const[access, setAccess] = useState()
  const handleToken = useContext(TokenHandler)
  const [emailChecker, setEmailChecker] = useState(true)
  const [passwordChecker, setPasswordChecker] = useState(true)
  const [incorrectMSG, setIncorrectMSG] = useState()
  const [loadingState,setLoadingState] =  useState(false)
  const token = localStorage.getItem('token')

  useEffect(()=>{
     window.location.pathname.startsWith('/admin') ? setAccess('admin') : (window.location.pathname.startsWith('/user') || window.location.pathname==='/')  ? setAccess('user') : console.log('no user or admin is here!')
     token && navTo('/user/home')
  },[])
  

  const handleTextChange = (event)=>{
    const {name, value} = event.target
    setFormTextData((prev)=>({...prev,[name]:value}))
  }

  useEffect(()=>{
     const fetchProducts = async()=>{
         try{
            const products = await axios.get('https://e-commerce-2026-production.up.railway.app/products')
           console.log(products)
            // console.log(vehicles.data.vehicles)
        }
        catch(error){
          console.log(error)
          console.log('wrong')
        }
    } 
    fetchProducts()
  })

  const handleSubmit = async(event)=>{
    event.preventDefault()
    const {email} = formTextData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailStatus =  emailRegex.test(email)
    emailStatus ? setEmailChecker(true) : setEmailChecker(false)

    const {password} = formTextData
    const passswordStatus = /[A-Z]/.test(password)&&/\d/.test(password)&&/[^a-zA-Z0-9]/.test(password)&&password.length >= 8   
    passswordStatus ? setPasswordChecker(true) : setPasswordChecker(false)

     if(emailStatus && passswordStatus){
      setLoadingState(true)
       try{  
         const successMSG =  access==='user'? await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/user/login',formTextData) : await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/admin/login',formTextData)
         localStorage.setItem('token',successMSG.data.token)
         handleToken(successMSG.data.token)
         console.log(successMSG)
         access==="user"? navTo('/user/home') : navTo('/admin/home')
         setIncorrectMSG('')
       }
       catch(error){
         console.log(error)
         setIncorrectMSG(error?.response?.data?.message)
       }
       finally{
         setLoadingState(false)
       }
     }
  }

  return (
    <>
    <div className={styles.login}>
        <form action="POST" onSubmit={handleSubmit} className={styles.login_form}>
            <h1>Log in</h1>
        <hr/>
        <div className={styles.inputcontainer}>
          <input type="text" name='email' onChange={handleTextChange} placeholder='Email' maxLength={30} required className={styles.inputcontainer}/>
          {!emailChecker && <p> invalid email</p>}
          {incorrectMSG?.includes('email') && <p> Unmatched email</p>}
        </div>
        <div className={styles.inputcontainer}>
          <input type="password" name='password' onChange={handleTextChange}  placeholder='Password' maxLength={30} ref={passwordRef} required className={styles.inputcontainer}/>
          <div className={styles.eyesign} onMouseOver={()=>passwordRef.current.type='text'} onMouseOut={()=>passwordRef.current.type='password'}>👀</div>
          {!passwordChecker && <p> password should be at least 8 chars must have at least 1 special char, one capital char and a number</p>}
          {incorrectMSG?.includes('password') && <p> wrong password</p>}
        </div>
        <div className={styles.formbtns}>
          <input type="submit" value='Login' className={styles.formbtns}/>
          <input type="button" value='Sign up' onClick={()=>navTo('/user/signup')} className={styles.formbtns}/>
        </div>
        </form>
    </div>
     {loadingState && <div className={styles.uploading}></div>}
    </>
  )
}

export default Login