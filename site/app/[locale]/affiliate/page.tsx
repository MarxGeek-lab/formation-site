"use client";

import React, { useEffect, useRef, useState } from "react";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Tabs,
  Tab,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAffiliationStore, useAuthStore } from "@/contexts/GlobalContext";
import { showToast } from "@/components/ToastNotification/ToastNotification";
import { hideLoader, showLoader } from "@/components/Loader/loaderService";
import { countries } from "@/data/country";
import LocalizedPrice from "@/components/LocalizedPrice2";
import { VerifiedUserSharp } from "@mui/icons-material";

const countriesList = [
  { name: 'Bénin', networks: ['MTN Bénin', 'Moov Bénin', 'Virement bancaire'] },
  { name: 'Côte d\'Ivoire', networks: ['MTN Côte d\'Ivoire', 'Moov Côte d\'Ivoire', 'Virement bancaire'] },
  { name: 'Togo', networks: ['Moov Togo', 'Togo Cell', 'Virement bancaire'] },
  { name: 'Sénégal', networks: ['Orange Sénégal', 'Tigo Sénégal', 'Virement bancaire'] },
  { name: 'Mali', networks: ['Orange Mali', 'Malitel', 'Virement bancaire'] },
  { name: 'Burkina Faso', networks: ['Orange Burkina Faso', 'Moov Burkina Faso', 'Virement bancaire'] },
  { name: 'Niger', networks: ['Orange Niger', 'Airtel Niger', 'Virement bancaire'] },
  { name: 'Ghana', networks: ['MTN Ghana', 'Vodafone Ghana', 'Virement bancaire'] },
  { name: 'Nigeria', networks: ['MTN Nigeria', 'Airtel Nigeria', 'Virement bancaire'] },
  { name: 'Cameroun', networks: ['MTN Cameroun', 'Orange Cameroun', 'Virement bancaire'] },
  { name: 'Rwanda', networks: ['MTN Rwanda', 'Airtel Rwanda', 'Virement bancaire'] },
  { name: 'Ouganda', networks: ['MTN Uganda', 'Airtel Uganda', 'Virement bancaire'] },
  { name: 'Kenya', networks: ['Safaricom (M-Pesa)', 'Airtel Kenya', 'Virement bancaire'] },
  { name: 'Afrique du Sud', networks: ['MTN South Africa', 'Vodacom South Africa', 'Virement bancaire'] },
  { name: 'Zambie', networks: ['MTN Zambia', 'Airtel Zambia', 'Virement bancaire'] },
  { name: 'Zimbabwe', networks: ['Econet Wireless', 'NetOne', 'Virement bancaire'] },
  { name: 'Malawi', networks: ['TNM Malawi', 'Airtel Malawi', 'Virement bancaire'] },
  { name: 'Mozambique', networks: ['Vodacom Mozambique', 'Movitel', 'Virement bancaire'] },
  { name: 'Namibie', networks: ['MTC Namibia', 'TN Mobile', 'Virement bancaire'] },
  { name: 'Botswana', networks: ['Mascom Wireless', 'Orange Botswana', 'Virement bancaire'] },
  { name: 'Eswatini', networks: ['MTN Eswatini', 'Eswatini Mobile', 'Virement bancaire'] },
  { name: 'Lesotho', networks: ['Vodacom Lesotho', 'Econet Telecom Lesotho', 'Virement bancaire'] },
  { name: 'Seychelles', networks: ['Airtel Seychelles', 'Cable & Wireless Seychelles', 'Virement bancaire'] },
  { name: 'Maurice', networks: ['Mauritius Telecom', 'Emtel', 'Virement bancaire'] },
  { name: 'Madagascar', networks: ['Telma Madagascar', 'Airtel Madagascar', 'Virement bancaire'] },
];


const AffiliateBoard: React.FC = () => {
  const { user } = useAuthStore();
  const {
    getAffiliateProfile,
    getAffiliateStats,
    getAffiliateReferrals,
    withdrawAffiliateEarnings,

    createPayoutAffiliate,
    updatePayoutAffiliate,
    deletePayoutAffiliate,
    getAllPayoutsByAffiliate,
  } = useAffiliationStore();

  const [affiliateProfile, setAffiliateProfile] = useState<any>(null);
  const [affiliateStats, setAffiliateStats] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [withdrawStats, setWithdrawStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawal, setWithdrawal] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("MTN");
  const [open, setOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<string>("Bénin");
  const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const country = countriesList.find((c) => c.name === selectedCountry);
    setAvailableNetworks(country?.networks || []);
    setMethod(""); // Reset method when country changes
  }, [selectedCountry]);


  useEffect(() => {
    if (user) {
      // Charger les données
      (async () => {
        const profileRes = await getAffiliateProfile(user._id);
        if (profileRes.status === 200) {
          setAffiliateProfile(profileRes?.data);
          setReferrals(profileRes?.data?.referrals);
        }

        const statsRes = await getAffiliateStats(user._id);
        if (statsRes.status === 200) setAffiliateStats(statsRes.data);

        const refRes = await getAffiliateReferrals(user._id);
        if (refRes.status === 200) {
          setActivities(refRes.data)
          const balance = refRes.data.reduce((acc: number, p: any) => p.status === "paid" ? acc + p.commissionAmount : acc, 0);
          setBalance(balance);
        };

        fetchWithdrawals(user._id);
      })();
    }
  }, [user]);

  const currentBalance = balance - withdrawStats?.totalWithdraw;

  const handleCreateWithdraw = async () => {
    if (withdrawal) {
      handleEditWithdraw();
      return;
    }

    if (!user) {
      showToast("Vous devez être connecté pour effectuer un retrait", "error");
      return;
    }
    if (Number(amount) <= 0) {
      showToast("Le montant doit être supérieur à 0", "error");
      return;
    }

    if (!method) {
      showToast("Veuillez sélectionner une méthode de retrait", "error");
      return;
    }

    if (!selectedCountry) {
      showToast("Veuillez sélectionner un pays", "error");
      return;
    }

    if (Number(amount) > currentBalance) {
      showToast("Le montant doit être inférieur à votre solde", "error");
      return;
    }

    showLoader()
    try {
      const res = await createPayoutAffiliate(user._id, {
        amount,
        method, 
        country: selectedCountry,
      });
      hideLoader()
      if (res.status === 201) {
        fetchWithdrawals(user._id);
        showToast("Retrait créé avec succès", "success");
      } else if (res.status === 400) {
        showToast("Erreur création retrait. Veuillez vérifier votre solde", "error");
      }
    } catch (err) {
      console.error("Erreur création retrait :", err);
      showToast("Erreur création retrait", "error")
    } finally {
      hideLoader()
    }
  };
  
  const handleEditWithdraw = async () => {
    if (!withdrawal) return;
    showLoader()
    try {
      const res = await updatePayoutAffiliate(withdrawal._id, { amount, method });
      hideLoader()
      if (res.status === 200) {
        fetchWithdrawals(user._id);
        setWithdrawal(null);
        showToast("Retrait modifié avec succès", "success");
      } else if (res.status === 400) {
        showToast("Erreur modification retrait. Veuillez vérifier votre solde", "error");
      }
    } catch (err) {
      console.error("Erreur modification retrait :", err);
      showToast("Erreur modification retrait", "error");
    } finally {
      hideLoader()
    }
  };
  
  const handleDeleteWithdraw = async () => {
    setOpen(false);
    if (!withdrawal) return;
    showLoader()  
    try {
      const res = await deletePayoutAffiliate(withdrawal?._id);
      hideLoader()
      if (res.status === 200) {
        fetchWithdrawals(user._id);
        setWithdrawal(null);
        
        showToast("Retrait supprimé avec succès", "success");
      } 
    } catch (err) {
      console.error("Erreur suppression retrait :", err);
      showToast("Erreur suppression retrait", "error");
    } finally {
      hideLoader()
    }
  };
  
  const fetchWithdrawals = async (userId: string) => {
    try {
      const res = await getAllPayoutsByAffiliate(userId);
      if (res.status === 200) {
        setWithdrawals(res.data);
        const pending = res.data.filter((p: any) => p.status === "requested").length || 0;
        const paid = res.data.filter((p: any) => p.status === "paid").length || 0;
        const rejected = res.data.filter((p: any) => p.status === "rejected").length || 0;

        const totalWithdraw = res.data.reduce((acc: number, p: any) => p.status === "paid" ? acc + p.amount : acc, 0);
        const count = res.data.length;
        setWithdrawStats({ pending, paid, rejected, totalWithdraw, count });
      }
    } catch (err) {
      console.error("Erreur récupération retraits :", err);
      return [];
    }
  };

  const tabs = [
    { label: "Lien de parrainage", index: 0 },
    { label: "Filleuls", index: 1 },
    { label: "Activités", index: 2 },
    { label: "Retraits", index: 3 },
  ];

  const statsData = [
    {
      label: "Balance",
      value: currentBalance,
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 30 }} />,
    },
    {
      label: "Total retrait",
      value: withdrawStats?.totalWithdraw,
      icon: <PaidIcon sx={{ fontSize: 30 }} />,
    },
    {
      label: "Commission",
      value: (affiliateProfile?.commissionRate * 100).toFixed(0),
      icon: <MonetizationOnIcon sx={{ fontSize: 30 }} />,
    },
    // {
    //   label: "Conversions",
    //   value: affiliateStats?.conversions ?? 0,
    //   icon: <TrendingUpIcon sx={{ fontSize: 30 }} />,
    // },
  ];

  if (!affiliateProfile) {
    return (
      <Container maxWidth="lg" sx={{ padding: "160px 0", textAlign: "center" }}>
        <Typography variant="h6">
          Chargement de votre tableau de bord...
        </Typography>
        <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: "auto" }} />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord affilié
      </Typography>


      {/* ✅ Stats en haut */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsData.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              bgcolor: "var(--primary-light)", 
              color: "white", 
              borderLeft: '4px solid var(--primary)',
              // borderTopLeftRadius: '12px',
              // borderBottomLeftRadius: '12px',
              }}>
              <CardContent sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
                <Box display="flex" alignItems="center" gap={1}>
                  {stat.icon}
                  <Typography variant="subtitle2">{stat.label}</Typography>
                </Box>
                <Typography variant="h6" sx={{mt: 1}}>
                  <LocalizedPrice amount={stat.value} />
                  {/* {stat.value} */}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              bgcolor: "var(--primary-light)", 
              color: "white", 
              borderLeft: '4px solid var(--primary)',
              // borderTopLeftRadius: '12px',
              // borderBottomLeftRadius: '12px',
              }}>
              <CardContent sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
                <Box display="flex" alignItems="center" gap={1}>
                <VerifiedUserSharp sx={{ fontSize: 30 }} />
                  <Typography variant="subtitle2">Nombre de filleuls</Typography>
                </Box>
                <Typography variant="h6" sx={{mt: 1}}>
                  {affiliateProfile?.referrals.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
      </Grid>

      {/* Onglets */}
      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        variant="scrollable"                // ✅ permet de défiler horizontalement
        scrollButtons="auto"                // ✅ ajoute des boutons de défilement (optionnel)
        sx={{ mb: 2, borderBottom: '1px solid var(--primary-light)' }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.index}
            label={tab.label}
            sx={{ 
              fontSize: {xs: "12px", sm: "14px"},
              color: "white",
              "&.Mui-selected": { color: "var(--primary)", fontWeight: "bold" },
            }}
          />
        ))}
      </Tabs>

      {/* Contenu des onglets */}
      {tabIndex === 0 && (
        <Card sx={{
          background: 'var(--background)'
        }}>
          <CardContent>
            <Typography variant="h6">Votre lien de parrainage</Typography>
            <Typography variant="body1">{affiliateProfile?.referralLink}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() =>
                navigator.clipboard.writeText(affiliateProfile?.referralLink)
              }
            >
              Copier le lien
            </Button>
          </CardContent>
        </Card>
      )}

      {tabIndex === 1 && (
        <Card sx={{ background: "var(--background)" }}>
          <CardContent sx={{p: 0}}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Historique des filleuls
            </Typography>

            {referrals.length > 0 ? (
              <TableContainer component={Card} 
              sx={{ 
                bgcolor: "var(--primary-dark)",
                overflowY: "auto",
                height: "400px",
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Nom</TableCell>
                      <TableCell sx={{ color: "white" }}>Email</TableCell>
                      <TableCell sx={{ color: "white" }}>Date d’inscription</TableCell>
                      <TableCell sx={{ color: "white" }}>Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referrals.map((ref: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ color: "white" }}>
                          {ref.name ?? "—"}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {ref.email}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {ref.isActive ? "✅ Actif" : "❌ Inactif"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Aucun filleul pour le moment.</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabIndex === 2 && (
        <Card sx={{ background: "var(--background)" }}>
          <CardContent sx={{p: 0}}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activités
            </Typography>

            {activities.length > 0 ? (
              <TableContainer component={Card} sx={{ 
                bgcolor: "var(--primary-dark)",
                overflowY: "auto",
                height: "400px",
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Type</TableCell>
                      <TableCell sx={{ color: "white" }}>Montant</TableCell>
                      <TableCell sx={{ color: "white" }}>Commission</TableCell>
                      <TableCell sx={{ color: "white" }}>Statut</TableCell>
                      <TableCell sx={{ color: "white" }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activities.map((act: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ color: "white" }}>
                          {act.type === "order" ? "Commande" : act.type}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <LocalizedPrice amount={act.amount} />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <LocalizedPrice amount={act.commissionAmount} />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {act.status === "pending" && "⏳ En attente"}
                          {act.status === "approved" && "✅ Validé"}
                          {act.status === "rejected" && "❌ Rejeté"}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {new Date(act.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Aucune activité enregistrée.</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabIndex === 3 && (
        <Card sx={{ background: "var(--background)" }}>
          <CardContent sx={{p: 0}}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Retirer mes gains
            </Typography>

            {/* --- Mini Statistiques --- */}
            {/* <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: "var(--primary-light)", borderLeft: "4px solid orange", color: "white" }}>
                  <CardContent>
                    <Typography variant="subtitle2">Demande approuvée</Typography>
                    <Typography variant="h6" sx={{mt: 1}}>
                      {withdrawStats?.approved ?? 0} FCFA
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: "var(--primary-light)", borderLeft: "4px solid red", color: "white" }}>
                  <CardContent>
                    <Typography variant="subtitle2">Demande en attente</Typography>
                    <Typography variant="h6" sx={{mt: 1}}>
                      {withdrawStats?.pending ?? 0} FCFA
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: "var(--primary-light)", borderLeft: "4px solid red", color: "white" }}>
                  <CardContent>
                    <Typography variant="subtitle2">Demande refusée</Typography>
                    <Typography variant="h6" sx={{mt: 1}}>
                      {withdrawStats?.rejected ?? 0} FCFA
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ bgcolor: "var(--primary-light)", borderLeft: "4px solid red", color: "white" }}>
                  <CardContent>
                    <Typography variant="subtitle2">Demande total</Typography>
                    <Typography variant="h6" sx={{mt: 1}}>
                      {withdrawStats?.total ?? 0} FCFA
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid> */}

          <Box
            ref={formRef}
            component="form"
            sx={{
              mb: 3,
              mt: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              alignItems: "center",
            }}
            id="withdraw-form"
          >
            <TextField
              name="amount"
              label="Montant à retirer"
              type="number"
              fullWidth
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              sx={{
                width: { xs: "100%", sm: "200px" },
                "& .MuiInputBase-root": { height: 40 },
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "lightgray",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
              }}
            />

            {/* Sélection du pays */}
            <FormControl sx={{ width: { xs: "100%", sm: "200px" }, mt: { xs: 2, sm: 0 } }}>
              <InputLabel sx={{ color: "white", top: -10 }}>Pays</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                sx={{
                  // height: 40,
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "lightgray" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                  "& .MuiSelect-select": { padding: "10px 14px" },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                {countriesList.map((country) => (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sélection du réseau disponible */}
            <FormControl sx={{ width: { xs: "100%", sm: "200px" }, mt: { xs: 2, sm: 0 } }}>
              <InputLabel sx={{ color: "white", top: -10 }}>Méthode de paiement</InputLabel>
              <Select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                sx={{
                  // height: 40,
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "lightgray" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                  "& .MuiSelect-select": { padding: "10px 14px" },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                {availableNetworks.map((network) => (
                  <MenuItem key={network} value={network}>
                    {network}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleCreateWithdraw}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Demander un retrait
            </Button>
          </Box>


            {/* --- Liste des retraits --- */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mes demandes de retrait
            </Typography>

            {withdrawals.length > 0 ? (
              <TableContainer component={Card} 
              sx={{ 
                bgcolor: "var(--primary-dark)",
                overflowY: "auto",
                height: "400px",
                }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Montant</TableCell>
                      <TableCell sx={{ color: "white" }}>Pays</TableCell>
                      <TableCell sx={{ color: "white" }}>Méthode</TableCell>
                      <TableCell sx={{ color: "white" }}>Statut</TableCell>
                      <TableCell sx={{ color: "white" }}>Date</TableCell>
                      <TableCell sx={{ color: "white" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {withdrawals.map((wd: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ color: "white" }}>
                          <LocalizedPrice amount={wd.amount} />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {wd.country}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {wd.method}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {wd.status === "requested" && "⏳ En attente"}
                          {wd.status === "paid" && "✅ Payé"}
                          {wd.status === "canceled" && "❌ Annulé"}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {new Date(wd.requestedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {wd?.status === 'requested' && (
                            <>
                            <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setWithdrawal(wd);
                              setAmount(wd.amount);
                              setMethod(wd.method);
                              if (formRef.current) {
                                // Scroll jusqu'au formulaire
                                formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                                
                                // Remonter un peu plus haut (offset de 50px par exemple)
                                // window.scrollBy({ top: -150, left: 0, behavior: "smooth" });
                              }
                            }}
                          >
                            Modifier
                          </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => {
                                setOpen(true);
                                setWithdrawal(wd);
                              }}
                            >
                              Supprimer
                            </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Aucune demande de retrait.</Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'var(--background)',
            color: 'white',
          },
        }}>
        <DialogTitle>Supprimer la demande de retrait</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer la demande de retrait ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteWithdraw} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default AffiliateBoard;
