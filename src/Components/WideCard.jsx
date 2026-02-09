import styles from '../Styles/widecard.module.css'
import { useState, useEffect, useContext, useRef } from 'react'
import {useNavigate} from 'react-router-dom'
import { FetchUser, UpdateCart, UpdateFavorites } from '../contextAPI/UserProvider'

const WideCard = ({product}) => {

    const [favState, setFavState] = useState([])
    const [quantity, setQuantity] = useState([])
    const [loadingState, setLoadingState] = useState(false)
    const updateFavorites = useContext(UpdateFavorites)
    const {addToCart, removeFromCart} = useContext(UpdateCart)
    const currentUser = useContext(FetchUser)
    const [fillColor, setFillColor] = useState("#222");
    const navTo = useNavigate()

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
        
            const intializingUserCartAndFavorites = ()=>{
            const favState = currentUser?.favorites?.find(item=>item.productId===product._id)
            favState?setFavState('rgba(210, 11, 11, 1)') : setFavState('white')   

            const cartState = currentUser?.cart?.find(item=>item.productId===product._id)
            cartState ? setQuantity(cartState.quantity) : setQuantity(null)
            }
            
            const handleFavorite = async()=>{
            setLoadingState(true)
            const productId = product._id
            const updatedFavoritesState =  await updateFavorites(productId, favState)
            setFavState(updatedFavoritesState)
            setLoadingState(false)
            }

            const cartIncreasement = async()=>{
            setLoadingState(true)
            addToCart(product._id)
            setLoadingState(false)
            }

            const cartDecreasement = async()=>{
            setLoadingState(true)
            removeFromCart(product._id)
            setLoadingState(false)
    }

    useEffect(()=>{
       intializingUserCartAndFavorites()
    },[currentUser])

  return (
    <>
        <div key={product?._id} className={styles.widecard}>
             <div className={styles.imgcontainer} onClick={()=>navTo(`/user/products/${product._id}`)}>
                 <div className={styles.imgbg}  style={{ backgroundColor: fillColor }}></div>
                <img src={product.images[0]} alt="network error" className={styles.widecardimg} crossOrigin="anonymous"
                onLoad={(e) => {
                const color = extractFillColor(e.target);
                setFillColor(color);
                }} />
            </div>
            <div className={styles.widecardData}>
                <p className={styles.title} onClick={()=>navTo(`/user/products/${product._id}`)}>{product?.title}</p>
                <p className={styles.colors}>colors: green/black/yellow</p>
                <div className={styles.btns}>
                        {quantity?
                        <div className={styles.cartbtn}>
                        <button onClick={cartDecreasement}>
                            {quantity===1?
                            <svg xmlns="http://www.w3.org/2000/svg" className={`bi bi-trash3 ${styles.trash}`} viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-dash" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                            </svg> 
                            }
                        </button>
                        
                        <p>{quantity}</p>
                        <button  onClick={cartIncreasement}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </button> 
                        </div> :
                        <div className={`${styles.cartbtn} ${styles.addtocart}`}>
                            <button onClick={cartIncreasement}> Add to cart</button>
                        </div> 
                        }
                    <button className={styles.favbtn}>
                        {favState==='rgba(210, 11, 11, 1)' ? <svg onClick={handleFavorite} xmlns="http://www.w3.org/2000/svg" fill='rgba(210, 11, 11, 1)' className={`bi bi-heart-fill`} viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                        </svg> :
                        <svg onClick={handleFavorite} xmlns="http://www.w3.org/2000/svg" fill='whitesmoke' className={`bi bi-heart-fill`} viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                        </svg>}
                    </button>
                </div>
                            
            </div>
                <div className={styles.price}>
                    <p>${product.price}</p>
                </div>
        </div>
        {loadingState && <div className={styles.uploading}></div>}
    </>
    
    // <WideCard vehicle={vehicle}/>
  )
}

export default WideCard