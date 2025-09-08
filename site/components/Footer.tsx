"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { useTheme } from "../hooks/useTheme";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import logo from '@/assets/images/logo-1.webp';
import './Footer.scss'; 
import { hideLoader, showLoader } from "./Loader/loaderService";
import { useNewsletterStore } from "@/contexts/GlobalContext";

export default function Footer({ locale }: { locale: string }) {
  const { subscribe } = useNewsletterStore();
  const [email, setEmail] = useState("");
  const { theme } = useTheme();
  const t = useTranslations('Footer');
  const [openDialog, setOpenDialog] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
        showLoader();
        try {
            const res = await subscribe(email);
            console.log("res == ", res);
            if (res === 201) {
                setOpenDialog(true);
                setEmail("");
            } else {
                alert('cet email s\'est déjà à la newsletter.')
            }
        } catch (error) {
            alert(t("footer.subscriptionError"));
        } finally {
            hideLoader();
        }
    }
}

  return (
    <footer className={`footer ${theme === 'light' ? 'footer--light' : 'footer--dark'}`}>
      <div className="footer__container">
        <div className="footer__grid">
          {/* Logo Section */}
          <div className="footer__section">
            <a href={`/${locale}`} className="footer__logo">
              <Image
                src={logo}
                alt="Rafly Logo"
              />
            </a>
            <p className={`footer__description ${theme === 'light' ? 'footer__description--light' : 'footer__description--dark'}`}>
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className={`footer__title ${theme === 'light' ? 'footer__title--light' : 'footer__title--dark'}`}>{t('quickLinks')}</h3>
            <div className="footer__links">
              {/* <a 
                href={`/${locale}/connexion`} 
                className="footer__account-btn"
              >
                {t('myAccount')}
              </a> */}
              <nav className="footer__nav">
                <a href={`/${locale}#tarification`} className={`footer__nav-link ${theme === 'light' ? 'footer__nav-link--light' : 'footer__nav-link--dark'}`}>
                  {t('pricing')}
                </a>
                <a href={`/${locale}/catalogue`} className={`footer__nav-link ${theme === 'light' ? 'footer__nav-link--light' : 'footer__nav-link--dark'}`}>
                  {t('catalog')}
                </a>
                <a href={`/${locale}#produit-mystere`} className={`footer__nav-link ${theme === 'light' ? 'footer__nav-link--light' : 'footer__nav-link--dark'}`}>
                  {t('mysteryProduct')}
                </a>
                <a href={`/${locale}/affiliation`} className={`footer__nav-link ${theme === 'light' ? 'footer__nav-link--light' : 'footer__nav-link--dark'}`}>
                  {t('affiliation')}
                </a>
                <a href={`/${locale}/support`} className={`footer__nav-link ${theme === 'light' ? 'footer__nav-link--light' : 'footer__nav-link--dark'}`}>
                  {t('support')}
                </a>
                <a href={`/${locale}/politique-confidentialite`} className={`footer__nav-link ${theme === 'light' ? 'footer__nav-link--light' : 'footer__nav-link--dark'}`}>
                  {t('privacyPolicy')}
                </a>
              </nav>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer__section">
            <h3 className={`footer__title ${theme === 'light' ? 'footer__title--light' : 'footer__title--dark'}`}>{t('newsletter')}</h3>
            <p className={`footer__newsletter-description ${theme === 'light' ? 'footer__newsletter-description--light' : 'footer__newsletter-description--dark'}`}>
              {t('newsletterDescription')}
            </p>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleNewsletterSubmit(e)} className="footer__newsletter-form">
              <div className="footer__newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  className={`footer__newsletter-input ${theme === 'light' ? 'footer__newsletter-input--light' : 'footer__newsletter-input--dark'}`}
                />
                <button
                  type="submit"
                  className="footer__newsletter-btn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>{t('subscribe')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`footer__bottom ${theme === 'light' ? 'footer__bottom--light' : 'footer__bottom--dark'}`}>
          <div>
            <div className="footer__copyright">
              {t('copyright')}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
              Inscription à la newsletter
          </DialogTitle>
          <DialogContent>
              <Typography className={"messageDialog"}>
                  Votre email a bien été inscrit à la newsletter.
              </Typography>
          </DialogContent>
          <DialogActions>
              <Button variant="outlined" onClick={() => setOpenDialog(false)}>OK</Button>
          </DialogActions>
      </Dialog>
    </footer>
  );
}
