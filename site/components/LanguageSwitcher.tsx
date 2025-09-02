"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './LanguageSwitcher.module.scss';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
        aria-label="Change language"
      >
        <svg
          className={styles.translateIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className={styles.localeText}>{locale.toUpperCase()}</span>
        <svg
          className={`${styles.chevronIcon} ${isOpen ? styles.open : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            <button
              onClick={() => switchLanguage('fr')}
              className={`${styles.languageOption} ${locale === 'fr' ? styles.active : ''}`}
            >
              FR
            </button>
            <button
              onClick={() => switchLanguage('en')}
              className={`${styles.languageOption} ${locale === 'en' ? styles.active : ''}`}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
