"use client";

import { useState, useEffect } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Drawer, IconButton } from "@mui/material";
import { Search, FilterList, Close, MenuBook, Code, Smartphone, Web, Cloud, Security, Storage } from "@mui/icons-material";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/contexts/GlobalContext";
import styles from "./EbookSidebar.module.scss";

interface EbookSidebarProps {
  locale: string;
  onCategoryChange?: (category: string) => void;
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filters: any) => void;
}

const defaultCategories = [
  { id: "all", name: "Tous les e-books", icon: MenuBook },
  { id: "web", name: "Développement Web", icon: Web },
  { id: "mobile", name: "Développement Mobile", icon: Smartphone },
  { id: "backend", name: "Backend & API", icon: Code },
  { id: "cloud", name: "Cloud & DevOps", icon: Cloud },
  { id: "security", name: "Sécurité", icon: Security },
  { id: "database", name: "Base de données", icon: Storage },
];

const priceRanges = [
  { value: "all", label: "Tous les prix" },
  { value: "0-20", label: "0€ - 20€" },
  { value: "20-50", label: "20€ - 50€" },
  { value: "50-100", label: "50€ - 100€" },
  { value: "100+", label: "100€ et plus" },
];

const levels = [
  { value: "all", label: "Tous les niveaux" },
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

export default function EbookSidebar({ locale, onCategoryChange, onSearchChange, onFilterChange }: EbookSidebarProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { allProducts } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [level, setLevel] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);

  // Extract unique categories from products
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const productCategories = new Set<string>();
      allProducts.forEach(product => {
        if (product.category) {
          productCategories.add(product.category);
        }
      });

      // Map categories to icons
      const categoryIconMap: { [key: string]: any } = {
        web: Web,
        mobile: Smartphone,
        backend: Code,
        cloud: Cloud,
        security: Security,
        database: Storage,
      };

      const dynamicCategories = [
        { id: "all", name: "Tous les e-books", icon: MenuBook },
        ...Array.from(productCategories).map(cat => ({
          id: cat.toLowerCase(),
          name: cat,
          icon: categoryIconMap[cat.toLowerCase()] || Code,
        }))
      ];

      setCategories(dynamicCategories);
    }
  }, [allProducts]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange?.(categoryId);

    // Émettre un événement personnalisé pour la page d'accueil
    const event = new CustomEvent('categoryChange', { detail: { category: categoryId } });
    window.dispatchEvent(event);

    // Scroll vers la section formations
    setTimeout(() => {
      const formationsSection = document.getElementById('formations');
      if (formationsSection) {
        formationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    // Fermer le drawer mobile
    setMobileOpen(false);
  };

  const handleFilterChange = () => {
    onFilterChange?.({
      priceRange,
      level,
      category: selectedCategory,
      search: searchTerm,
    });
  };

  const sidebarContent = (
    <Box className={`${styles.sidebar} ${theme === 'light' ? styles.light : styles.dark}`}>
      {/* Header */}
      <Box className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>
          <MenuBook sx={{ mr: 1 }} />
          E-Books
        </h2>
        <IconButton 
          className={styles.closeButton}
          onClick={() => setMobileOpen(false)}
          sx={{ display: { lg: 'none' } }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Search */}
      <Box className={styles.searchSection}>
        <TextField
          fullWidth
          placeholder="Rechercher un e-book..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
          }}
          className={styles.searchInput}
          size="small"
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "8px",
              color: "rgba(255,255,255,0.85)", // texte blanc fumé
              border: "1px solid rgba(255,255,255,0.5)", // bord fumé
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.72)",
              boxShadow: "0 0 0 3px rgba(255,255,255,0.12)",
            },
             "& input::placeholder": {
              color: "rgba(255, 255, 255, 0.76)", // placeholder blanc très léger
            },
          }}
        />
      </Box>

      {/* Categories */}
      <Box className={styles.categoriesSection}>
        <h3 className={styles.sectionTitle}>
          <FilterList sx={{ fontSize: 18, mr: 0.5 }} />
          Catégories
        </h3>
        <Box className={styles.categoriesList}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.active : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <IconComponent sx={{ fontSize: 20, mr: 1 }} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </Box>
      </Box>

      {/* Filters */}
      {/* <Box className={styles.filtersSection}>
        <h3 className={styles.sectionTitle}>Filtres</h3>
        
        <FormControl fullWidth size="small" className={styles.filterControl}>
          <InputLabel>Prix</InputLabel>
          <Select
            value={priceRange}
            label="Prix"
            onChange={(e) => {
              setPriceRange(e.target.value);
              handleFilterChange();
            }}
          >
            {priceRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" className={styles.filterControl}>
          <InputLabel>Niveau</InputLabel>
          <Select
            value={level}
            label="Niveau"
            onChange={(e) => {
              setLevel(e.target.value);
              handleFilterChange();
            }}
          >
            {levels.map((lvl) => (
              <MenuItem key={lvl.value} value={lvl.value}>
                {lvl.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(priceRange !== "all" || level !== "all" || selectedCategory !== "all") && (
          <Box className={styles.activeFilters}>
            <p className={styles.activeFiltersLabel}>Filtres actifs:</p>
            <Box className={styles.chipContainer}>
              {selectedCategory !== "all" && (
                <Chip
                  label={categories.find(c => c.id === selectedCategory)?.name}
                  onDelete={() => handleCategoryChange("all")}
                  size="small"
                  color="primary"
                />
              )}
              {priceRange !== "all" && (
                <Chip
                  label={priceRanges.find(p => p.value === priceRange)?.label}
                  onDelete={() => {
                    setPriceRange("all");
                    handleFilterChange();
                  }}
                  size="small"
                  color="primary"
                />
              )}
              {level !== "all" && (
                <Chip
                  label={levels.find(l => l.value === level)?.label}
                  onDelete={() => {
                    setLevel("all");
                    handleFilterChange();
                  }}
                  size="small"
                  color="primary"
                />
              )}
            </Box>
          </Box>
        )}
      </Box> */}

      {/* CTA Button */}
      <Box className={styles.ctaSection}>
        <button 
          className={styles.ctaButton}
          onClick={() => router.push(`/${locale}/#formations`)}
        >
          <MenuBook sx={{ mr: 1 }} />
          Voir tous les e-books
        </button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <IconButton
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(true)}
        sx={{ 
          display: { lg: 'none' },
          position: 'fixed',
          left: 16,
          top: 100,
          zIndex: 1200,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          }
        }}
      >
        <FilterList />
      </IconButton>

      {/* Desktop Sidebar */}
      <Box
        className={styles.desktopSidebar}
        sx={{
          display: { xs: 'none', lg: 'block' },
          position: 'fixed',
          left: 0,
          top: 0,
          width: 250,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1100,
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
