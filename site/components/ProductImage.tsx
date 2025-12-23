import { useState } from "react";
import styles from './ProductCard.module.scss';
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL2 } from "@/settings/constant";

const ProductImage = ({ product }: { product: any }) => {
  const [loading, setLoading] = useState(true);

  const imgSrc = product?.photos[0]
    ? API_URL2+ product.photos[0]
    : null;

  if (!imgSrc) return null;

  return (
    <div style={{ position: "relative", width: '100%' }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: 'var(--primary-light)'
          }}
        >
          {loading && <CircularProgress />}
        </div>
      )}
      <img
        src={imgSrc}
        alt={product?.name}
        className={styles.productImage}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
};

export default ProductImage;
