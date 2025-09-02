"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useTheme } from '../hooks/useTheme';

const faqData = [
  {
    id: 1,
    questionKey: "whatIsRafly",
    answerKey: "whatIsRaflyAnswer"
  },
  {
    id: 2,
    questionKey: "howToBuy",
    answerKey: "howToBuyAnswer"
  },
  {
    id: 3,
    questionKey: "productTypes",
    answerKey: "productTypesAnswer"
  },
  {
    id: 4,
    questionKey: "immediateAccess",
    answerKey: "immediateAccessAnswer"
  },
  {
    id: 5,
    questionKey: "sellProducts",
    answerKey: "sellProductsAnswer"
  },
  {
    id: 6,
    questionKey: "paymentMethods",
    answerKey: "paymentMethodsAnswer"
  },
  {
    id: 7,
    questionKey: "refunds",
    answerKey: "refundsAnswer"
  },
  {
    id: 8,
    questionKey: "fileProblems",
    answerKey: "fileProblemsAnswer"
  },
  {
    id: 9,
    questionKey: "promotions",
    answerKey: "promotionsAnswer"
  },
  {
    id: 10,
    questionKey: "contactSupport",
    answerKey: "contactSupportAnswer"
  }
];

export default function FAQSection() {
  const { theme } = useTheme();
  const t = useTranslations('FAQ');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box 
      component="section" 
      id="faq" 
      sx={{ 
        backgroundColor: 'var(--background)',
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'var(--primary)',
              fontWeight: 600,
              letterSpacing: 1,
              mb: 2,
              display: 'block'
            }}
            className='rafly-sub'
          >
            {t('subtitle')}
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              color: 'var(--foreground)',
              my: 2,
              mx: 'auto',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
            className='rafly-title'
          >
            {t('title')}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme === 'light' ? '#4b5563' : '#d1d5db',
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            {t('description')}
          </Typography>
        </Box>

        {/* FAQ Accordions */}
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {faqData.map((faq) => (
            <Accordion
              key={faq.id}
              expanded={expanded === `panel${faq.id}`}
              onChange={handleChange(`panel${faq.id}`)}
              sx={{
                mb: 2,
                borderRadius: '2px !important',
                backgroundColor: theme === 'light' ? '#ffffff' : '#5E3AFC1A',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '0 0 16px 0',
                  borderColor: 'var(--primary)',
                  // boxShadow: '0 4px 20px rgba(95, 58, 252, 0.15)',
                }
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease',
                      transform: expanded === `panel${faq.id}` ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1V15M1 8H15"
                        stroke="#EDF1FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Box>
                }
                sx={{
                  py: 2,
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: 'var(--foreground)',
                    fontSize: '1rem',
                  }}
                >
                  {t(`questions.${faq.questionKey}`)}
                </Typography>
              </AccordionSummary>
              
              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                  pt: 0,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: theme === 'light' ? '#4b5563' : '#d1d5db',
                    lineHeight: 1.6,
                  }}
                >
                  {t(`answers.${faq.answerKey}`)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
