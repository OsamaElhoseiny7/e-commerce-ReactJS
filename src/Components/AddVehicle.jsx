import { useEffect, useState } from 'react'
import axios from 'axios';
import styles from '../Styles/add_vehicle.module.css'
import { useNavigate } from 'react-router-dom';

const AddVehicle = () => {

  const [previewImgs,setPreviewImgs] = useState();
  const [formTextData,setFormTextData] = useState()
  const [files, setFiles] = useState()
  const [category, setCategory] = useState('car')
  const [currentImg, setCurrentImg] = useState(0) // default value for showing first img
  const [active, setActive] = useState()
  const navTo = useNavigate()

  const handleTextChange = (event)=>{
    const {name, value} = event.target
    setFormTextData((prev)=>({...prev,[name]:value}))
  }

  const handleRadio = (event)=>{
    setCategory(event.target.value)
  }

  const handleFileChange = (event)=>{
    const files = event.target.files
    const filesContainer = Object.entries(files).map(([key, value])=> value)
    const previewImgsURL = filesContainer.map(file=> URL.createObjectURL(file))
    setFiles(filesContainer)
    setPreviewImgs(previewImgsURL)
  }
  
  const handleSubmit = async(event)=>{
    // setActive(true)
    event.preventDefault()
    const formData = new FormData()
    formTextData && Object.entries(formTextData).forEach(([key, value])=>{
    formData.append(key, value)
    })
    files &&files.forEach(file=>{
      formData.append('imgsUrl', file)
    })
    formData.append('category', category) 
   
    try{  
      const successMSG =  await axios.post('http://localhost:5000/admin/addvehicle',formData)
      console.log(successMSG.data.message)
      navTo('/admin/homepage')
    }
    catch(error){
      console.log("here is error message "+error.message)
    }


  }

  return (
    
    <div className={styles.newvehicle}>
        <form  onSubmit={handleSubmit} className={styles.addvehicle_form}>
            <h1>Add New Vehicle</h1>
        <hr/>
        <input type="file" id="imgUrl" name='imgsUrl' accept="image/*" onChange={handleFileChange} multiple/>
        <label htmlFor="imgUrl" className={styles.imglabel}>Choose Image/s {`up to 4 ones`}</label>
        <div className={styles.previewImg}> {files?  <img src={previewImgs[currentImg]}  alt="network error!" /> : 'No Images Have Been Uploaded Yet.'}</div>
        { files && <div className={styles.indicator}>
          {files.map((file, index)=>{
            return (
              <div key={index} onClick={()=>setCurrentImg(index)} className={active && styles.active}></div> //can be {index+1}
            )})}
          </div>      
            }
        <input type="text" name='title' onChange={handleTextChange} placeholder='TITLE' className={styles.ginput}/>
        <input type="text" name='describtion' onChange={handleTextChange} placeholder='DESCRIBETION' className={styles.ginput}/>
        <input type="number" name='price' onChange={handleTextChange} placeholder='PRICE' className={styles.ginput}/>
        <div className={styles.category}>
          <p> Category :</p>
          <div className={styles.car}>
            <input type="radio" id='car' name='category' value="car" onChange={handleRadio} checked />
            <label htmlFor="car">Car</label>
          </div>
          <div className={styles.bike}>
            <input type="radio" id='bike' name='category' value="bike" onChange={handleRadio} />
            <label htmlFor="bike">Bike</label>
          </div>
        </div>
        <input type="submit" value='Submit'/>
        </form>
    </div>
  )
}

export default AddVehicle