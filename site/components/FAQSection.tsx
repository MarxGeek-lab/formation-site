"use client";

import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useTheme } from '../hooks/useTheme';
import styles from './FAQSection.module.scss';

const faqData = [
  {
    id: 1,
    questionKey: "whatAreFormations",
    answerKey: "whatAreFormationsAnswer"
  },
  {
    id: 2,
    questionKey: "howToAccess",
    answerKey: "howToAccessAnswer"
  },
  {
    id: 3,
    questionKey: "formationTypes",
    answerKey: "formationTypesAnswer"
  },
  {
    id: 4,
    questionKey: "certificateIncluded",
    answerKey: "certificateIncludedAnswer"
  },
  {
    id: 5,
    questionKey: "supportAvailable",
    answerKey: "supportAvailableAnswer"
  },
  {
    id: 6,
    questionKey: "refundPolicy",
    answerKey: "refundPolicyAnswer"
  }
];

export default function FAQSection() {
  const { theme } = useTheme();
  const t = useTranslations('FAQ');
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange = (panel: number) => {
    setExpanded(expanded === panel ? false : panel);
  };

  return (
    <Box className={styles.faqSection}>
      <Container maxWidth="lg">
        <Box className={styles.faqHeader}>
          <Typography className="rafly-sub">
            {t('subtitle')}
          </Typography>
          <Typography variant="h2" className="titlePageSection">
            {t('title')}
          </Typography>
          <Typography className={styles.faqDescription}>
            {t('description')}
          </Typography>
        </Box>

        <Box className={styles.faqList}>
          {faqData.map((faq) => (
            <Box
              key={faq.id}
              className={`${styles.faqItem} ${expanded === faq.id ? styles.expanded : ''}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => handleChange(faq.id)}
              >
                <span>{t(`questions.${faq.questionKey}`)}</span>
                <Box className={styles.faqIcon}>
                  {expanded === faq.id ? <Remove /> : <Add />}
                </Box>
              </button>
              {expanded === faq.id && (
                <Box className={styles.faqAnswer}>
                  <Typography>
                    {t(`answers.${faq.answerKey}`)}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
