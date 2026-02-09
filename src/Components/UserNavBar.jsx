import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from '../Styles/usernavbar.module.css'
import { useContext, useState } from 'react'
import { SearchHandler } from '../contextAPI/ProductsProvider'
import { FetchUser } from '../contextAPI/UserProvider'

const UserNavBar = () => {

  const navTo = useNavigate()
  const user = useContext(FetchUser)
  const searchHandler = useContext(SearchHandler)
  const sidebarLocation = useLocation().pathname
  const sidebarShow = sidebarLocation.startsWith('/user') && sidebarLocation!=='/user/signup' && sidebarLocation!=='/user/login' && sidebarLocation!=='/'? true : false
  const navBarValues = ['home', 'categories', 'favorites', 'cart', 'orders', 'about']
  const mobileNavBar = ['home', 'categories', 'favorites', 'cart', 'orders', 'about']

  const handleSearch = (event)=>{
    const {value} = event.target
    const valueCondition = value.replace(/\s+/g, "").toLowerCase()  
    valueCondition=== ""? searchHandler(false) : searchHandler(value)
    console.log(value)
  }

  return (
    <>
     {<div className={sidebarShow? styles.usernavbar: styles.hidden}>
        <div className={styles.logo}>
            <p>O & T store</p>
        </div>
          <input type="text" onChange={handleSearch}/>
        <ul className={styles.desktopul}>
          { navBarValues.map((item)=><li style={{backgroundColor:sidebarLocation.includes(item) &&'rgb(70, 68, 68)'}}><Link to={`/user/${item}`}>{item}</Link></li>)}
        </ul>
        <ul className={`${styles.mobileul}`}>
          <li onClick={()=>navTo(`/user/home`)}>Home</li>
          <li onClick={()=>navTo(`/user/profile`)}>You</li>
          <li onClick={()=>navTo(`/user/cart`)}>Cart</li>
          <li onClick={()=>navTo(`/user/categories`)}>Menu</li>
        </ul>
          {user?.profilepicture?
            <div className={styles.profilepicture} onClick={()=>navTo('/user/profile')} style={{backgroundImage:`url(${user.profilepicture})`}}></div> :
          <svg onClick={()=>navTo('/user/profile')} xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className={`bi bi-person-circle ${styles.profilesvg}`} viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
          }    
        </div>}
    </>
  )
  
}

export default UserNavBar