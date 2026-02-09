import { useState, useLayoutEffect, useRef, useEffect } from 'react'
import axios from 'axios';
import styles from '../Styles/addproduct.module.css'
import { useNavigate } from 'react-router-dom';
import MoreDetails from './MoreDetails';

const AddProduct = () => {

  const [previewImgs,setPreviewImgs] = useState();
  const [formTextData,setFormTextData] = useState()
  const [files, setFiles] = useState()
  const [currentImg, setCurrentImg] = useState(0) // default value for showing first img
  const [selectState, setSelectState] = useState(false)
  const [detailsLength, setDetailsLength] = useState(1)
  const [detailsArray,setDetailsArray] = useState([])
  const [moreDetails,setMoreDetails] = useState([])
  const navTo = useNavigate()
  const categories = ['T-Shirts','Pants','Jackets','Hoodies','Dresses','Shoes','Socks','Accesorries','Suites']
  const boxRef = useRef();

//   console.log(formTextData)

const detailsNumber = (newval)=>{
  setDetailsLength(newval)
}

// const updateDetailsArray = (newval)=>{
//   setDetailsArray(newval)
// } 

  const handleChange = (event)=>{
    const {name, value} = event.target
    setFormTextData((prev)=>({...prev,[name]:value}))
  }

  const handleClick = (event)=>{
    const {value} = event.target.dataset
    setFormTextData((prev)=>({...prev,'category':value}))
  }
 
  const handleFileChange = (event)=>{
    const files = event.target.files
    const filesContainer = Object.entries(files).map(([key, value])=> value)
    const previewImgsURL = filesContainer.map(file=> URL.createObjectURL(file))
    setFiles(filesContainer)
    setPreviewImgs(previewImgsURL)
  }
  
  
  const moreDetailsHandler = (name, value)=>{
    setMoreDetails((prev)=>({...prev,[name]:value}))
  }
  
  console.log(moreDetails)
  
  const deleteHandler = (name)=>{
    const newDet = Object.entries(moreDetails).filter(([key,_])=> key!==name).
    map(([_,value],index)=>{ return {[`data${index}`]:value}})
    
    setMoreDetails({})
    
    newDet.forEach((detail)=>{
      setMoreDetails((prev)=>({...prev,...detail}))
    })    
  }
  
  const handleSubmit = async(event)=>{
    // setActive(true)
    event.preventDefault()
    const formData = new FormData()
    formTextData && Object.entries(formTextData).forEach(([key, value])=>{
      formData.append(key, value)
    })
    files &&files.forEach(file=>{
      formData.append('images', file)
    })

    moreDetails && Object.entries(moreDetails).forEach(([key, value])=>{
      formData.append('description', value)
    })
    
    try{  
      const successMSG =  await axios.post('http://localhost:5000/admin/addproduct',formData)
      console.log(successMSG.data.message)
      navTo('/admin/homepage')
    }
    catch(error){
      console.log("here is error message "+error.message)
    }
  }


  useLayoutEffect(()=>{
    setDetailsArray(Array.from({length:detailsLength}).map((_,index)=>{
          return ( <MoreDetails setDetailsLength={detailsNumber} details={detailsLength} key={index} itemIndex={index} moreDetails={moreDetails} updateDetails={moreDetailsHandler} deleteFunc={deleteHandler}/> )
    }))
  },[detailsLength])

  return (
    
    <div className={styles.newvehicle}>
        <div   className={styles.addvehicle_form}>
            <h1>Add New Product</h1>
        <hr/>
        <input required type="file" id="images" name='images' accept="image/*" onChange={handleFileChange} multiple/>
        <label htmlFor="images" className={styles.imglabel}>Choose Image(s) up to 8 ones</label>
       
           {files && <div className={styles.previewImg}>
                      <img src={previewImgs[currentImg]}  alt="network error!" />
                      <div className={styles.indicator}>
                      {files.map((file, index)=>{
                      return (
                      <div key={index} onClick={()=>setCurrentImg(index)}></div> //can be {index+1}
                      )})}
                      </div>
                    </div> }
        { files && <div className={styles.indicator}>
          {files.map((file, index)=>{
            return (
              <div key={index} onClick={()=>setCurrentImg(index)}></div> //can be {index+1}
            )})}
          </div>      
            }
        <input type="text" name='title' onChange={handleChange} placeholder='Title' className={styles.ginput} autoFocus/>
        <div className={styles.prodinfo} >
            <div className={styles.top}>
                <p>Add More About This Product</p>
            </div>
            {detailsLength!==0 && detailsArray}
        </div>
        <input type="number" name='price' onChange={handleChange} placeholder='PRICE' className={styles.ginput}/>
        {/* <select name="category" id="category" onChange={handleChange}>
            {categories.map((category,index)=><option key={index} value={category}>{category}</option>)}
        </select> */}
        <div className={styles.selection}>
            <input type="button" value="Choose A Category"onClick={()=>setSelectState(!selectState)}/>
            {selectState && <ul ref={boxRef} onMouseOut={()=>setSelectState(false)} onMouseOver={()=>setSelectState(true)}>
                {categories.map((category, index)=><li key={index} data-value={category} onClick={handleClick}>{category}</li>)}
            </ul>}
        </div>
        <input type="submit" value='Submit'onClick={handleSubmit}/>
        </div>
    </div>
  )
}

export default AddProduct