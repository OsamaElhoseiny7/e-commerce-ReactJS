import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from '../Styles/addproduct.module.css'

const MoreDetails = ({setDetailsLength, details, itemIndex, moreDetails, updateDetails, deleteFunc}) => {

    const handleChange = (event)=>{
        const {name,value} = event.target
        updateDetails(name, value)
    }

    const [textAreaValue, setTextAreaValue] = useState(moreDetails[`data${itemIndex}`])

    // useEffect(()=>{
    //         setTextAreaValue(det[`data${itemIndex}`])
    // },[det])

    const texTereaRef = useRef()
 
    const handleKey = (event)=>{
        const {key} = event
        const {value, name} = event.target
        const {length} = value
        if(key=== 'Backspace' && length===0 && itemIndex!==0){
            deleteFunc(name)
            setDetailsLength(details-1)
            event.preventDefault()
        }
         
        key==='Enter' && event.preventDefault()
        if(key==='Enter' && itemIndex===details-1 && length>=1){
             setDetailsLength(details+1);
             
        }     
    }

    useLayoutEffect(()=>{
        itemIndex===details-1 && texTereaRef.current.focus()
    },[details])
    

  return (
            <div className={styles.details}>
                <button className={styles.add} >
                    <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-circle-fill" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8"/>
                    </svg>    
                </button>
                <textarea key={itemIndex} type="text" name={`data${itemIndex}`} onKeyDown={handleKey} className={`${styles.ginput} ${styles.details}`} ref={texTereaRef} onChange={handleChange} value={textAreaValue}/>
            </div>
                  )
}

export default MoreDetails