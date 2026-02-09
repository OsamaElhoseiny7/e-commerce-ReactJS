import { useNavigate } from 'react-router-dom'
import styles from '../Styles/admin_sidebar.module.css'


 const AdminSideBar = ()=>{
  const navTo = useNavigate()
  const sidebarLocation = window.location.pathname
  const sidebarShow = sidebarLocation.startsWith('/user') || sidebarLocation==='/' ? false : true
 
 
  return (
   
    <div className={sidebarShow ? styles.sidebar : styles.hidden}>
      <h1>🎲Dashboard </h1>
        <ul>
            <li name='home' onClick={()=>navTo('/admin')}>Home</li>
            <li onClick={()=>navTo('/admin/addproduct')}>Add Product</li>
            <li onClick={()=>navTo('/admin/vehicles/cars')}>Pants</li>
            <li onClick={()=>navTo('/admin/vehicles/bikes')}>T-Shirts</li>
            <li onClick={()=>navTo('/admin/vehicles')}>Display All Yours</li>
        </ul>
    </div>
    
  )
}

export default AdminSideBar
