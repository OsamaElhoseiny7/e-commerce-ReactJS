import { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios';
import styles from '../Styles/user_signup.module.css'
import { useNavigate } from 'react-router-dom';
import { TokenHandler } from '../contextAPI/UserProvider';

const Signup = () => {

  const [formTextData,setFormTextData] = useState()
  const navTo = useNavigate()
  const passwordRef = useRef()
  const[access, setAccess] = useState()
  const handleToken = useContext(TokenHandler)
  const [emailChecker, setEmailChecker] = useState(true)
  const [emailExistance, setEmailExistance] = useState()
  const [passwordChecker, setPasswordChecker] = useState(true)
  const [userNameChecker, setUserNameChecker] = useState(true)
  const [loadingState,setLoadingState] =  useState(false)
  
  
  
  useEffect(()=>{
    window.location.pathname.startsWith('/admin') ? setAccess('admin') : (window.location.pathname.startsWith('/user') || window.location.pathname==='/')  ? setAccess('user') : console.log('no user or admin is here!')
  },[])
  
  const handleTextChange = (event)=>{
    const {name, value} = event.target
    setFormTextData((prev)=>({...prev,[name]:value}))
  }

  const handleSubmit = async(event)=>{
    event.preventDefault()
    
    const {email} = formTextData
    const {username} = formTextData
    const {password} = formTextData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const userNamaStatus = /^\S+$/.test(username)&&/^[a-zA-Z0-9]+$/.test(username)&&
    username?.length >= 4   
    const passswordStatus = /[A-Z]/.test(password)&&/\d/.test(password)&&/[^a-zA-Z0-9]/.test(password)&&password.length >= 8   
    
    const emailStatus =  emailRegex.test(email)
    emailStatus ? setEmailChecker(true) : setEmailChecker(false)

    passswordStatus ? setPasswordChecker(true) : setPasswordChecker(false)
    
    userNamaStatus ? setUserNameChecker(true) : setUserNameChecker(false) 

    let emailExistance = '';

    if(emailStatus && passswordStatus && userNamaStatus){
      setLoadingState(true)
      try{
        
          const successMSG =  access==='user'? await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/user/signup',formTextData) : await axios.post('https://e-commerce-nodejs-production-a535.up.railway.app/admin/signup',formTextData)
          localStorage.setItem('token',successMSG.data.token)
          handleToken(successMSG.data.token)
          access==="user"? navTo('/user/homepage') : navTo('/admin/homepage')
      }  
      catch(error){
        emailExistance = error.response.data.message
        console.log(`something went wrong while trying to sign you up! it's ${error.message}`)
      }
      setEmailExistance(emailExistance)
      setLoadingState(false)
    }
  }


  return (
    <>
    <div className={styles.signup}>
        <form action="POST" onSubmit={handleSubmit} className={styles.signup_form}>
            <h1>Sign up</h1>
        <hr/>
        <div className={styles.inputcontainer}>
          <input type="text" name={access==='user'?'username':'adminname'} onChange={handleTextChange} placeholder={access==='user'?'User Name':'Admin Name'} maxLength={30} required className={styles.inputcontainer}/>
          {!userNameChecker && <p> only char [a-z] and numbers are allowed. no speacial chars  or spaces. </p>}
        </div>
        <div className={styles.inputcontainer}>
          <input type="text" name='email' onChange={handleTextChange} placeholder='Email' maxLength={30} required className={styles.inputcontainer}/>
          {!emailChecker && <p> incorrect email</p>}
          {emailExistance?.includes('email') && <p> This email is already in use.</p>}
        </div>
        <div className={styles.inputcontainer}>
         <input type="password" name='password' onChange={handleTextChange}  placeholder='Password' maxLength={30} ref={passwordRef} required className={styles.inputcontainer}/>
        <div className={styles.eyesign} onMouseOver={()=>passwordRef.current.type='text'} onMouseOut={()=>passwordRef.current.type='password'}>👀</div>
         {!passwordChecker && <p> password should be at least 8 chars must have at least 1 special char, one capital char and a number</p>}
        </div>
        <div className={styles.formbtns}>
           <input type="submit" value='Sign up' className={styles.formbtns}/>
           <input type="button" value='Login' onClick={()=>navTo('/user/login')} className={styles.formbtns}/>
        </div>
        </form>
    </div>
    {loadingState && <div className={styles.uploading}></div>}
    </>
  )
}

export default Signup