import { useContext, useEffect, useState } from "react"
import styles from '../Styles/userprofile.module.css'
import {FetchUser, UpdateUser} from '../contextAPI/UserProvider'
import axios from "axios"
import { SearchResults, ProductsData } from '../contextAPI/ProductsProvider'
import { useNavigate } from "react-router-dom"


const UserProfile = () => {

  const user = useContext(FetchUser)
  const [countries,setCountries] = useState()
  const [currentcountryCities,setCurrentCountryCities] = useState()
  const [userRegion, setUserRegion] = useState({})
  const [favs,setFavs] =  useState([]) 
  const [updateUser,setUpdateUser] =  useState() 
  const [cart,setCart] =  useState([])
  const [error, setError] = useState('')
  const [file,setFile] =  useState()
  const [imgPreview,setImgPreview] =  useState('')
  const products = useContext(ProductsData)
  const navTo = useNavigate()
  const {updateUserMethod, updateResult} = useContext(UpdateUser)
  const searchResults = useContext(SearchResults)
  const [fillColor, setFillColor] = useState("#222");
  const [loadingState,setLoadingState] =  useState(false)

  const extractFillColor = (img) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const w = canvas.width;
  const h = canvas.height;
  const edge = 8;

  const isWide = w / h > 1.3;

  const data = isWide
    ? [
        ctx.getImageData(0, 0, w, edge).data,          // top
        ctx.getImageData(0, h - edge, w, edge).data   // bottom
      ]
    : [
        ctx.getImageData(0, 0, edge, h).data,          // left
        ctx.getImageData(w - edge, 0, edge, h).data   // right
      ];

  let r = 0, g = 0, b = 0, count = 0;

  data.forEach(arr => {
    for (let i = 0; i < arr.length; i += 40) {
      r += arr[i];
      g += arr[i + 1];
      b += arr[i + 2];
      count++;
    }
  });

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  const clamp = (v) => Math.min(245, Math.max(15, v));

  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
};
 

  const fetchUserCart = ()=>{
        const cart = user?.cart
        if(cart && cart?.length!==0){
          const firstItem = products?.find(product=>product._id===cart[0]?.productId)
          setCart(firstItem)                
        }
        else{
          setCart([])
        }
    }
  
  const fetchUserFavorites = async()=>{
        const favorites = user?.favorites
        if(favorites && favorites?.length!==0){
          const firstItem = products?.find(product=>product._id===favorites[0]?.productId)
          setFavs(firstItem)                
        }
        else{
          setFavs([])
        }      
      }

  

      
      const handleProfilePicture = (event)=>{
        event.target.files && setFile(event.target.files?.[0])
        const previewImg = URL.createObjectURL(event.target.files[0])
        setImgPreview(previewImg)
      }
      
      const handlePassword = async()=>{
        const code = await axios.get('http://localhost:5000/user/changepassword',{headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }})
        
        console.log(code.data.code)
      }
      
      const handleChange = (event)=>{
        const {name,value}  = event.target
        setUpdateUser(prev=>({...prev, [name]:value}))
      }
      
      const handelSubmit = async()=>{

        let error = ''
        const userNamaStatus = /^\S+$/.test(updateUser?.username)&&/^[a-zA-Z0-9]+$/.test(updateUser.username)&&updateUser?.username?.length >= 4  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateUser?.email) 
        // const passswordStatus = /[A-Z]/.test(password)&&/\d/.test(password)&&/[^a-zA-Z0-9]/.test(password)&&password.length >= 8  
        
        const formData = new FormData()
        updateUser && Object.entries(updateUser).forEach(([key, value])=>{
          formData.append(key, value)
        })
        userRegion && Object.entries(userRegion).forEach(([key, value])=>{
          formData.append(key, value)
        })
        file && formData.append('profilepicture', file)
        if(userNamaStatus && emailRegex){
          if(updateUser?.phonenumber){
            const numberRegExp = /^[0-9]+$/.test(updateUser?.phonenumber)
            if(numberRegExp){
              setLoadingState(true)
              updateUserMethod(formData)

            }
            else{
              error = 'Numbers are only accepted!'
            }
          }
          else{
              setLoadingState(true)
              updateUserMethod(formData)
            }
          } 
          else{
            if(!userNamaStatus){
              error = 'UserName must exclude spaces or special chars!'
            }
            else{
              error = 'Invalid Email!'
            } 
          }
          setError(error)
          setLoadingState(false)
        } 

        console.log(updateResult)

      useEffect(()=>{
          fetchUserFavorites()
          fetchUserCart()
          setUpdateUser({username:user?.username, email:user?.email, phonenumber:user?.phonenumber})
          setImgPreview(user?.profilepicture)
      },[user,products])
        
  // const countriesOptions = countries?.map(item=>{ return {value:item.country.slice(0,3), label:item.country, name:'country'}})

  const fetchAllCountries = async()=>{
    const allCountries = await axios.get('https://countriesnow.space/api/v0.1/countries')
    setCountries(allCountries?.data?.data)

    }


    const handleCountryChange = (event)=>{
      const currentCountry = event.target.value
      const countryData = countries.find(item=>item.iso2===currentCountry)
      const cities = countryData?.cities
      setCurrentCountryCities(cities)
      setUserRegion()
      setUserRegion((prev)=>({...prev, country:countryData?.country}))
    }

    const handleLogout = ()=>{
      localStorage.removeItem('token')
      navTo('/user/login')
    }

    const handleCityChange = (event)=>{
      const currentCity = event.target.value
      setUserRegion((prev)=>({...prev, city:currentCity}))
    }

    
  useEffect(()=>{
    fetchAllCountries()
  },[])


  return (
    <>
    {searchResults?.length==0 && <>
    
      <div className={styles.profilecontainer}>
        <div className={styles.leftblock} style={{width:cart?.length===0&&favs?.length===0 &&90+'%'}}>
          <div className={styles.profileimg}>
            <div className={styles.leftimg}>    
              <input type="file" accept="image/*" hidden  name="profilepicture" id="profilepicture" onChange={handleProfilePicture}/>
              <label htmlFor="profilepicture">
                <svg xmlns="http://www.w3.org/2000/svg"  className="bi bi-camera" viewBox="0 0 16 16">
                  <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
                  <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                </svg>
              </label>
              {imgPreview? 
              <div className={styles.profileimgcontainer} style={{backgroundImage:`url(${imgPreview})`}}>
              </div>
               : <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>}
              <div className={styles.imgtext}>
                <p className={styles.name}>{user?.username}</p>
                <p className={styles.email}><svg xmlns="http://www.w3.org/2000/svg"  class="bi bi-envelope-at" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
                <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z"/>
                </svg>{user?.email}</p>
              </div>
            </div>

            <div className={styles.rightimg}>
              <div className={styles.rightimgbtns}>
                <button className={styles.savebtn} onClick={handelSubmit}>Save Changes</button>
                <button className={styles.cancelbtn}>Cencel</button>
              </div>
              <button onClick={handleLogout} className={styles.logoutbtn}>Log Out</button>
            </div>
          </div>
          <div className={styles.userinfo}>
            <p>Personal Information</p>
            <form className={styles.edituser} onSubmit={(event)=> event.preventDefault()}>
              <div className={styles.left}>
                <div className={styles.top}>
                  <label htmlFor="username">User Name</label>
                  <input type="text" name="username" id="username" value={updateUser?.username} onChange={handleChange}/>
                  {error?.includes('UserName')&&<p>{error}</p>}
                </div>

                <div className={styles.bottom}>
                  <label htmlFor="phone">Phone Number</label>
                  <input type="text" name="phonenumber" id="phone" value={updateUser?.phonenumber} onChange={handleChange}/>
                  {error?.includes('Numbers')&&<p>{error}</p>}
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.top}>
                  <label htmlFor="email">Email Address</label>
                  <input type="text" name="email" id="email" value={updateUser?.email} onChange={handleChange}/>
                  {error?.includes('Email')&&<p>{error}</p>}
                  {updateResult?.includes('email')&&<p>{updateResult}</p>}
                </div>

                <div className={styles.bottom}>
                  <div className={styles.left}>
                    <label htmlFor="country">Country</label>
                    {/* <Select options={countriesOptions} isSearchable placeholder='Enter Your County' onChange={(selected)=>handleCountryChange(selected.label)}/> */}
                    <select name="country" onChange={handleCountryChange}>
                      <option value="" disabled selected>
                        Select your country
                      </option>
                    {countries?.map(country=>{
                      return ( <option value={country.iso2}>{country.country}</option> )
                    })}
                    </select>
                  </div>

                  <div className={styles.right}>
                    <label htmlFor="city">City</label>
                     {/* <Select options={currentcountryCities} isSearchable placeholder='Enter Your City' onChange={(selected)=>handleCityChange(selected.value)}/> */}
                       <select name="city" onChange={handleCityChange}>
                    {currentcountryCities?.map(city=>{
                      return ( <option value={city}>{city}</option> )
                    })}
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
           <div className={styles.password}>
            <p>Change Password</p>
            <div>
              <input type="passowrd" name="newpass" id="newpass" placeholder="🔐 New Password" />
              <input type="password" name="confirm" id="confirm" placeholder="🔐 Confirm New Password"/>
              <input type="button" value='Update' onClick={handlePassword}/>
            </div>
           </div>
        </div>

        {(cart?.length!==0||favs?.length!==0) &&<div className={styles.rightblock}>
          {favs?.length!==0 && <div className={styles.fav}>
            <p className={styles.head}><svg xmlns="http://www.w3.org/2000/svg" className={`bi bi-heart-fill`} viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
            </svg>Favorites</p>
            {favs?
            <>
             <div className={styles.imgcontainer}onClick={()=>navTo(`/user/products/${favs._id}`)} >
                 <div className={styles.imgbg}  style={{ backgroundColor: fillColor }}></div>
                                <img src={favs.images?.[0]} alt="network error" className={styles.widecardimg} crossOrigin="anonymous"
                                onLoad={(e) => {
                                const color = extractFillColor(e.target);
                                setFillColor(color);
                                }} />
             </div>
            <p className={styles.title} onClick={()=>navTo(`/user/products/${favs._id}`)}>{favs?.title}</p>
            <p className={styles.price}>${favs?.price}</p>
            </> : <div className={styles.empty}>No products in favorites yet.</div>
            }
            <button onClick={()=>navTo('/user/favorites')}>View Favorites</button>
          </div>}

          {cart?.length!==0 && <div className={styles.cart} style={{marginTop:favs?.length===0&&0+'px'}}>
            <p className={styles.head}> Shopping Cart</p>
            {cart?
            <>
            <div className={styles.imgcontainer} onClick={()=>navTo(`/user/products/${cart._id}`)}>
              <div className={styles.imgbg}  style={{ backgroundColor: fillColor }}></div>
                             <img src={cart.images?.[0]} alt="network error" className={styles.widecardimg} crossOrigin="anonymous"
                             onLoad={(e) => {
                             const color = extractFillColor(e.target);
                             setFillColor(color);
                             }} />
            </div>
            <p className={styles.title} onClick={()=>navTo(`/user/products/${cart._id}`)}>{cart?.title}</p>
            <p className={styles.price}>${cart?.price}</p>
            </> : <div className={styles.empty}> Your cart is empty.</div>
             }
            <button onClick={()=>navTo('/user/cart')}>View Cart</button>
          </div>}
        </div>}
      </div>
      {loadingState && <div className={styles.uploading}></div>}
    </>}
    </>
  )
}

export default UserProfile