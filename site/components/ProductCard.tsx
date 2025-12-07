"use client";
import styles from './ProductCard.module.scss';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { generateSlug } from "@/utils/utils";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useTracking } from '@/utils/trackingPixel';
import { useEffect, useState } from "react";
import { useAuthStore } from "@/contexts/AuthContext";
import { formatPrice } from "@/utils/formatPrice";
import { getLocalizedPrice } from "@/utils/LocalizedPrice";
import ProductImage from './ProductImage';
import { Translate } from './Translate';
import ProductDetailsModal from './ProductDetailsModal';

interface ProductCardProps {
  product: any;
  locale: string;
}

export default function ProductCard({ 
  product, 
  locale 
}: ProductCardProps) {
  const router = useRouter();
  const t = useTranslations('Home');
  const { addToCart, cart } = useCart();
  const { addNotification } = useNotification();
  const { trackProductView, trackAddToCart } = useTracking();
  const [openDemo, setOpenDemo] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [price, setPrice] = useState("");

  const handleClick = () => {
    // Ouvrir le modal de détails au lieu de rediriger
    setOpenDetails(true);
    trackProductView(product._id);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const finalPrice = product?.pricePromo && product?.pricePromo !== 0 ? product.pricePromo : product.price;
      
      // Tracker l'ajout au panier
      trackAddToCart(product._id);
      
      // Ajouter au panier (synchronisation automatique avec backend)
      await addToCart({
        id: product._id,
        name: product.name,
        price: finalPrice,
        image: product?.photos?.[0] || '',
        category: product.category,
        type: 'achat'
      });

      if (typeof window.fbq !== "undefined") {
        window.fbq('track', 'AddToCart', {
          content_name: product.name,
          content_ids: [product.id],
          content_type: 'product',
          value: finalPrice,
        });
      }

      // Show success notification
      addNotification({
        type: 'success',
        message: 'Produit ajouté au panier',
        productName: product.name,
        productImage: product?.photos?.[0] || '',
        duration: 4000
      });
    } catch (error) {
      console.error('Erreur ajout au panier:', error);
      
      // Show error notification
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'ajout au panier',
        productName: product.name,
        duration: 4000
      });
    }
  };

  const renderImage = () => {
    if (product?.photos[0]) {
      if (product?.photos[0].startsWith('http://localhost:5000/')) {
        return (
          <img
            src={product?.photos[0]?.replace('http://localhost:5000/', 'https://api.rafly.me/')}
            alt={product?.name}
            width={300}
            height={200}
            className={styles.productImage}
          />
        )
      } else {
        return (
          <img
            src={product?.photos[0]}
            alt={product?.name}
            width={300}
            height={200}
            className={styles.productImage}
          />
        )
      }
    }
  }

  useEffect(() => {
    getLocalizedPrice(product.price).then(price => {
  // console.log("price ===", price);
      setPrice(price)
    });
    
  }, []);


  return (
    <>
      <div className={styles.productCard} onClick={handleClick}>
        <div className={styles.imageContainer}>
          {product?.photos?.length > 0 ? (
            <ProductImage product={product} />
          
          ) : (
            <div className={styles.imagePlaceholder}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect width="60" height="60" rx="12" fill="var(--primary)" fillOpacity="0.1"/>
                <path d="M20 25L30 35L40 25" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {product?.demoVideo && (
             <Button
                variant="contained"
                sx={{
                  position: "absolute",
                  right: 8,
                  bottom: 8,
                  px: 1,
                  py: 0.5,
                  borderRadius: "8px",
                  fontWeight: "600",
                  textTransform: "none",
                  fontSize: "15px",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  color: "#333",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.8)",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 6px 14px rgba(0,0,0,0.4)",
                    transform: "translateY(-2px)"
                  },
                }}
                onClick={(e) => { e.stopPropagation(); setOpenDemo(true); }}
              >
                <Translate text="Voir démo" lang={locale} />
              </Button>
          )}
        </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          <Translate text={product?.name} lang={locale} />
        </h3>
        <p className={styles.category}>
          <Translate text={product?.category} lang={locale} />
        </p>
        
        <div className={styles.priceSection}>
          {product?.pricePromo && product?.pricePromo !== 0 ? (
            <Box className={styles.priceContainer}
              sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Typography className={styles.price}>{product?.pricePromo} FCFA</Typography>
              <Typography sx={{
                textDecoration: 'line-through',
                color: 'red',
                whiteSpace: 'nowrap',
                fontSize: 13
                }}>{formatPrice(product?.price, 'USD', locale)}</Typography>
            </Box>
          ) : (
            <Box className={styles.priceContainer}>
              <span className={styles.price}>{price || 'F CFA '+product?.price}</span>
            </Box>
          )}
          <button className={styles.accessButton} onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            Acheter
          </button>
        </div>
      </div>
      </div>

      {/* Modal de détails du produit */}
      <ProductDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        product={product}
        locale={locale}
        price={price}
      />

      {/* Modal vidéo démo */}
      <Dialog
        open={openDemo}
        onClose={() => setOpenDemo(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "var(--background)",
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle>{t("videoDemo")}</DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxHeight: "70vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <video
              controls
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            >
              <source src={product?.demoVideo} type="video/mp4" />
              {t("browserNotSupported")}
            </video>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" size="small" variant="contained" onClick={() => setOpenDemo(false)}>{t("close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
