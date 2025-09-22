"use client";

import Image from "next/image";
import styles from './ProductCard.module.scss';
import { useRouter } from 'next/navigation';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";

export default function ProductCard({ 
  title, 
  category, 
  price, 
  pricePromo, 
  image, 
  image2,
  demoVideo,
  demoVideo2
}) {
  const router = useRouter();
  const [openDemo, setOpenDemo] = useState(false);

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {(image || image2) ? (
          image ? (
          <Image
            src={URL.createObjectURL(image)}
            alt={title}
            width={300}
            height={200}
            className={styles.productImage}
          />
          ) : (
            <img
            src={image2}
            alt={title}
            width={300}
            height={200}
            className={styles.productImage}
          />
          )
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="12" fill="var(--primary)" fillOpacity="0.1"/>
              <path d="M20 25L30 35L40 25" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
         {(demoVideo || demoVideo2) && (
            <Button
              variant="contained"
              sx={{
                position: "absolute",
                left: 8,
                bottom: 8,
                px: 1.5,
                py: 0.5,
                borderRadius: "10px",
                fontWeight: "500",
                textTransform: "none",
                fontSize: "15px",
                backgroundColor: "rgba(255, 255, 255, 0.7)", // noir transparent
                color: "#333",
                transform: "translateY(-1px)",
                boxShadow: "0px 6px 14px rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)", // effet verre dépoli subtil
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0px 6px 14px rgba(0,0,0,0.4)",
                  transform: "translateY(-2px)"
                },
              }}
              onClick={() => setOpenDemo(true)}
            >
              Demo
            </Button>
          )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.category}>{category}</p>
        
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mb: 4,
          gap: '0.5rem'
        }}>
          {pricePromo && pricePromo !== 0 ? (
            <Box className={styles.priceContainer}
              sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Typography className={styles.price}>{pricePromo} FCFA</Typography>
              <Typography sx={{
                textDecoration: 'line-through',
                color: 'red',
                whiteSpace: 'nowrap',
                fontSize: 13
                }}>{price} FCFA</Typography>
            </Box>
          ) : (
            <Box className={styles.priceContainer}>
              <span className={styles.price}>{price} FCFA</span>
            </Box>
          )}
          <div className={styles.features}>
            <div className={styles.feature}>
              <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Licence incluse</span>
            </div>
          </div>
        </Box>
        
        <button className={styles.accessButton}>
          Accéder au produit
        </button>
      </div>
      {(demoVideo || demoVideo2) && (
       <Dialog
          open={openDemo}
          onClose={() => setOpenDemo(false)}
          maxWidth="sm" // limite la largeur
          fullWidth
          PaperProps={{
            sx: {
              background: "#333",
              borderRadius: "12px",
              overflow: "hidden", // supprime le scroll interne
            },
          }}
        >
          <DialogTitle>Démonstration du produit</DialogTitle>
          <DialogContent
            sx={{
              p: 0, // pas de padding autour
              overflow: "hidden", // empêche le scroll
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxHeight: "70vh", // limite la hauteur à l’écran
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#333",
              }}
            >
              {demoVideo ? (
                <video
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                  maxHeight: "70vh", // garde la vidéo responsive
                  objectFit: "contain", // pas de déformation
                  borderRadius: "8px",
                }}
              >
                <source src={URL.createObjectURL(demoVideo)} type="video/mp4" />
                
              </video>
              ) : (
                <video
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                  maxHeight: "70vh", // garde la vidéo responsive
                  objectFit: "contain", // pas de déformation
                  borderRadius: "8px",
                  backgroundColor: "#333",
                }}
              >
                <source src={demoVideo2} type="video/mp4" />
                
              </video>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{pt: 5}}>
            <Button color="error" size="small" variant="contained" className="" onClick={() => setOpenDemo(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
