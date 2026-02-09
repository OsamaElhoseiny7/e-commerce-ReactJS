import styles from '../Styles/categorycard.module.css'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'


const CategoryCard = ({product}) => {

    const [indicator,setIndicator] = useState(0)
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
        <div key={product._id} className={styles.tallcard}>
            <div className={styles.imgcontainer} onClick={()=>{navTo(`/user/products/${product._id}`); window.scrollTo({top:0, behavior:'smooth'})}}>
                <div className={styles.imgbg}  style={{ backgroundColor: fillColor }}></div>
                <img src={product.images[indicator]} alt="network error" className={styles.imgforimg} crossOrigin="anonymous"
                onLoad={(e) => {
                const color = extractFillColor(e.target);
                setFillColor(color);
                }} />
            </div>
                <h1 className={styles.title} onClick={()=>navTo(`/user/products/${product._id}`)}>{product.title}</h1>
            <div className={styles.price} onClick={()=>navTo(`/user/products/${product._id}`)}>
                <span>$</span><h1 className={styles.h1price}>{product.price}</h1>
            </div>
        </div>
    
  )
}

export default CategoryCard