'use client';

import { Box, Container, Typography, Chip, Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, Checkbox, FormGroup } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './product.module.scss';
import ProductCard from '@/components/ProductCard';

import LUTsPhotoshop from '@/assets/images/veo3-768x432.jpg';
import icon from '@/assets/images/icon.webp'

// Mock data pour les produits
const productsData = {
  '10-luts-photoshop': {
    id: 1,
    title: '10 LUTS PHOTOSHOP',
    price: 14000,
    currency: 'CFA',
    category: 'Design graphique',
    subcategory: 'Outils premium',
    image: LUTsPhotoshop,
    description: {
      presentation: 'Offrez à vos photos et créations un rendu professionnel grâce à ce pack exclusif de 10 LUTs Photoshop spécialement conçus pour la correction colorimétrique.',
      opportunity: 'Ce pack a déjà été testé et validé par de nombreux créateurs, avec des résultats spectaculaires et une amélioration notable de la qualité visuelle de leurs projets.',
      benefits: [
        'Produit testé et approuvé : déjà utilisé par des professionnels avec des retours positifs',
        'Niche très demandée : la retouche photo et le design visuel sont en pleine croissance',
        'Valeur ajoutée forte : optimisation instantanée des images sans compétences avancées',
        'Utilisation universelle : compatible avec divers styles et projets visuels'
      ],
      target: [
        'Photographes amateurs et professionnels',
        'Graphistes et designers',
        'Créateurs de contenu (réseaux sociaux, YouTube, etc.)',
        'Agences de communication et marketing'
      ],
      includes: [
        '10 LUTs Photoshop prêts à l\'emploi',
        'Fichiers 100% modifiables',
        'Guide d\'installation rapide',
        'Accès instantané après paiement'
      ]
    },
    options: [
      {
        id: 'visual',
        type: 'radio',
        title: 'Option de Visuel de Publicité',
        choices: [
          { id: 'with-visual', label: 'Avec Visuel de Publicité', price: 2500, description: 'Commander un visuel de publicité pour votre produit' },
          { id: 'without-visual', label: 'Sans Visuel de Publicité', price: 0, description: 'Acheter le produit uniquement sans visuel de publicité', selected: true }
        ]
      },
      {
        id: 'support',
        type: 'checkbox',
        title: 'Options supplémentaires',
        choices: [
          { id: 'accompagnement', label: 'Accompagnement personnalisé 1 mois', price: 15000, description: 'Obtenez un accompagnement personnalisé d\'une durée de 1 mois avec nos experts !' }
        ]
      }
    ]
  }
};

// Mock data pour les produits similaires
const relatedProducts = [
  {
    id: 2,
    title: 'MASTERPACK +200 LUTS CINÉ',
    image: LUTsPhotoshop,
    category: 'Design graphique',
    price: '14 000 CFA',
    displayText: 'Pack complet de LUTs cinématographiques',
    features: ['200+ LUTs professionnels', 'Styles cinématographiques', 'Compatibilité universelle'],
    slug: 'masterpack-200-luts-cine'
  },
  {
    id: 3,
    title: 'PACK DE +25.000 EFFETS SONORES PRO',
    image: LUTsPhotoshop,
    category: 'Outils premium',
    price: '9 000 CFA',
    displayText: 'Collection d\'effets sonores professionnels',
    features: ['25 000+ effets sonores', 'Qualité studio', 'Formats multiples'],
    slug: 'pack-25000-effets-sonores'
  },
  {
    id: 4,
    title: '100.000 RESSOURCES DE MONTAGE VIDÉO',
    image: LUTsPhotoshop,
    category: 'Outils premium',
    price: '9 000 CFA',
    displayText: 'Ressources complètes pour montage vidéo',
    features: ['100 000+ ressources', 'Transitions et effets', 'Templates inclus'],
    slug: '100000-ressources-montage-video'
  }
];

export default function ProductPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  const router = useRouter();
  const t = useTranslations('Product');
  
  const product = productsData[slug as keyof typeof productsData];
  
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: any}>({
    visual: 'without-visual',
    support: []
  });

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center">{t('productNotFound')}</Typography>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button onClick={() => router.push(`/${locale}/catalogue`)}>
            {t('backToCatalogue')}
          </Button>
        </Box>
      </Container>
    );
  }

  const handleOptionChange = (optionId: string, value: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const calculateTotal = () => {
    let total = product.price;
    
    // Ajouter le prix de l'option visuel
    const visualOption = product.options[0].choices.find(choice => choice.id === selectedOptions.visual);
    if (visualOption) {
      total += visualOption.price;
    }
    
    // Ajouter les prix des options supplémentaires
    selectedOptions.support.forEach((supportId: string) => {
      const supportOption = product.options[1].choices.find(choice => choice.id === supportId);
      if (supportOption) {
        total += supportOption.price;
      }
    });
    
    return total;
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} ${product.currency}`;
  };

  return (
    <Box sx={{ 
      backgroundColor: 'var(--background)', 
      py: { xs: 4, md: 8 },
      px: { xs: 0, sm: 6 },
      }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Image et description */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Image produit */}
            <Box className={styles.productImage}>
              <Image
                src={product.image}
                alt={product.title}
                width={640}
                height={360}
                className={styles.image}
              />
            </Box>

            {/* Description détaillée */}
            <Box className={styles.productDescription}>
              <Typography variant="h4" className={styles.sectionTitle}>
                {t('productPresentation')}
              </Typography>
              <Typography paragraph sx={{ mb: 3 }}>
                {product.description.presentation}
              </Typography>
              <Typography paragraph sx={{ mb: 4 }}>
                {product.description.opportunity}
              </Typography>

              <Typography variant="h4" className={styles.sectionTitle}>
                {t('whyGoldenOpportunity')}
              </Typography>
              <Box component="ul" className={styles.benefitsList}>
                {product.description.benefits.map((benefit, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    <Typography>{benefit}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="h4" className={styles.sectionTitle}>
                {t('targetAudience')}
              </Typography>
              <Box component="ul" className={styles.targetList}>
                {product.description.target.map((target, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    <Typography>{target}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="h4" className={styles.sectionTitle}>
                {t('includedInPack')}
              </Typography>
              <Box component="ul" className={styles.includesList}>
                {product.description.includes.map((item, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Box>

              <Box className={styles.winningProduct}>
                <Typography sx={{ fontWeight: 600 }}>
                  {t('winningProduct')}
                </Typography>
                <Typography>
                  {t('winningProductDescription')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Sidebar commande */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className={styles.orderSidebar}>
              <Card className={styles.orderCard}>
                <CardContent>
                  {/* En-tête produit */}
                  <Box className={styles.productHeader}>
                    <Box className={styles.productIcon}>
                      <Image src={icon} alt="Icon" width={60} height={60} />
                    </Box>
                    <Box>
                      <Typography variant="h3" className={styles.price}>
                        {formatPrice(calculateTotal())}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Options */}
                  <Box className={styles.optionsSection}>
                    {product.options.map((option) => (
                      <Box key={option.id} className={styles.optionGroup}>
                        <Typography variant="h6" className={styles.optionTitle}>
                          {option.id === 'visual' ? t('visualAdvertisingOption') : t('additionalOptions')}
                        </Typography>
                        
                        {option.type === 'radio' && (
                          <RadioGroup
                            value={selectedOptions[option.id]}
                            onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          >
                            {option.choices.map((choice) => (
                              <Box key={choice.id} className={styles.optionChoice}>
                                <FormControlLabel
                                  value={choice.id}
                                  control={<Radio />}
                                  label={
                                    <Box>
                                      <Box className={styles.choiceHeader}>
                                        <Typography>
                                          {choice.id === 'with-visual' ? t('withVisual') : 
                                           choice.id === 'without-visual' ? t('withoutVisual') :
                                           choice.label}
                                        </Typography>
                                        {choice.price > 0 && (
                                          <Typography variant="body2" className={styles.choicePrice}>
                                            +{formatPrice(choice.price)}
                                          </Typography>
                                        )}
                                      </Box>
                                      <Typography variant="body2" className={styles.choiceDescription}>
                                        {choice.id === 'with-visual' ? t('withVisualDescription') : 
                                         choice.id === 'without-visual' ? t('withoutVisualDescription') :
                                         choice.description}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Box>
                            ))}
                          </RadioGroup>
                        )}

                        {option.type === 'checkbox' && (
                          <FormGroup>
                            {option.choices.map((choice) => (
                              <Box key={choice.id} className={styles.optionChoice}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={selectedOptions[option.id].includes(choice.id)}
                                      onChange={(e) => {
                                        const currentValues = selectedOptions[option.id];
                                        const newValues = e.target.checked
                                          ? [...currentValues, choice.id]
                                          : currentValues.filter((id: string) => id !== choice.id);
                                        handleOptionChange(option.id, newValues);
                                      }}
                                    />
                                  }
                                  label={
                                    <Box>
                                      <Box className={styles.choiceHeader}>
                                        <Typography>
                                          {choice.id === 'accompagnement' ? t('personalizedSupport') : choice.label}
                                        </Typography>
                                        <Typography variant="body2" className={styles.choicePrice}>
                                          +{formatPrice(choice.price)}
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2" className={styles.choiceDescription}>
                                        {choice.id === 'accompagnement' ? t('personalizedSupportDescription') : choice.description}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Box>
                            ))}
                          </FormGroup>
                        )}
                      </Box>
                    ))}
                  </Box>

                  {/* Bouton d'achat */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    className={styles.buyButton}
                    onClick={() => {
                      // Redirection vers la page de paiement avec les données du produit
                      const checkoutData = {
                        product: product.id,
                        title: product.title,
                        price: calculateTotal(),
                        options: selectedOptions
                      };
                      
                      // Stocker les données dans le localStorage pour les récupérer sur la page paiement
                      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
                      
                      // Rediriger vers la page paiement
                      router.push(`/${locale}/paiement`);
                    }}
                  >
                    {t('buyNow')}
                  </Button>
                </CardContent>
                
              </Card>
              {/* Alternative abonnement */}
              <Box className={styles.subscriptionAlternative}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  my: 3
                }}>
                  <Box sx={{height: '1px', width: '100%', backgroundColor: 'var(--primary-border)'}} />
                  <Typography variant="body2" align="center">
                    {t('or')}
                  </Typography>
                  <Box sx={{height: '1px', width: '100%', backgroundColor: 'var(--primary-border)'}} />
                </Box>
                
                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                  {t('subscribeToSubscription')}
                </Typography>
                <Typography variant="body2" align="center" sx={{ mb: 3 }}>
                  {t('subscriptionDescription')}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push(`/${locale}/#tarification`)}
                >
                  {t('takeSubscription')}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Section Produits Similaires */}
        <Box sx={{ mt: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ 
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--foreground)',
                mb: 2
              }}>
                {t('similarProducts')}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'var(--muted-foreground)',
                fontSize: '1.1rem'
              }}>
                {t('discoverSimilarProducts')}
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {relatedProducts.map((relatedProduct) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={relatedProduct.id}>
                  <ProductCard
                    title={relatedProduct.title}
                    category={relatedProduct.category}
                    image={relatedProduct.image}
                    price={relatedProduct.price}
                    displayText={relatedProduct.displayText}
                    features={relatedProduct.features}
                    slug={relatedProduct.slug}
                    locale={locale}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}
