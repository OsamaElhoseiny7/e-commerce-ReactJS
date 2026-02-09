import styles from '../Styles/ordercard.module.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'


const OrderCard = ({item}) => {

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
        
         
  return (
    <>
        <div className={styles.ordercard}>
             <div className={styles.imgcontainer} style={{ backgroundColor: fillColor }} onClick={()=>navTo(`/user/products/${item.productId}`)}>
                <img src={item.image} alt="network error" className={styles.widecardimg} crossOrigin="anonymous"
                onLoad={(e) => {
                const color = extractFillColor(e.target);
                setFillColor(color);
                }} />
            </div>
            <div className={styles.orderData}>
                    <p className={styles.title} >{item.title}</p> 
                    <p className={styles.price}>${item.price}</p>
                <p>Qty ({item.quantity})</p>               
            </div>
        </div>
    </>
    
    // <WideCard vehicle={vehicle}/>
  )
}

export default OrderCard