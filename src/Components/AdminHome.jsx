import { useNavigate } from 'react-router-dom'
import styles from '../Styles/admin_home.module.css'

const AdminHome = () => {

  const navTo = useNavigate()
  return (
    <>
    <div className={styles.home}>
        <div className={styles.head}>
        <h1>Hello Osama👋🏻,</h1>
        <input type="text"  placeholder='⌕ Search'/>
        </div>
        <div className={styles.body}>
          <h2>Main Operations</h2>
          <div className={styles.divcontainer}>
            <div onClick={()=>navTo('/admin/addvehicle')}><p>+</p><p>Add Vehicle</p></div>
            <div onClick={()=>navTo('/admin/vehicles/cars')}><p>+</p><p>Cars</p></div>
            <div onClick={()=>navTo('/admin/vehicles/bikes')}><p>+</p><p>Bikes</p></div>
            <div onClick={()=>navTo('/admin/vehicles')}><p>+</p><p>All Vehicles</p></div>
          </div>
        </div>
    </div>
    </>
  )
}

export default AdminHome