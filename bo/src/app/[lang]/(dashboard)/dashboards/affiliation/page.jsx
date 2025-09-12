'use client';

import { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAdminAffiliationStore, useAuthStore } from "@/contexts/GlobalContext";
import AffiliateTable from "./components/AffiliateTable";
import PayoutHistoryTable from "./components/PayoutsTable";
import ActivityHistoryTable from "./components/Activity";

const Affiliation = () => {
  const { 
    getAllAffiliates, getAffiliateStats, getAllPayouts,
    getAllActivities, getAllActivitiesByAffiliate } = useAdminAffiliationStore();
  const { user } = useAuthStore();

  const [tabIndex, setTabIndex] = useState(0);
  const [allAffiliates, setAllAffiliates] = useState([]);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [activities, setActivities] = useState([]);

  // Récupérer la liste des affiliés
  const fetchAffiliates = async () => {
    if (user) {
      try {
        const { data } = await getAllAffiliates();
        setAllAffiliates(data);
        console.log("data == ", data)
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Récupérer les stats globales
  const fetchStats = async () => {
    if (user) {
      try {
        const { data } = await getAffiliateStats();
        setAffiliateStats(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Récupérer tous les paiements
  const fetchPayouts = async () => {
    if (user) {
      try {
        const { data } = await getAllPayouts();
        console.log("payout == ", data)
        setPayouts(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Récupérer toutes les activités
  const fetchActivities = async () => {
    if (user) {
      try {
        const { data } = await getAllActivities();
        console.log("activities == ", data)
        setActivities(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchAffiliates();
    // fetchStats();
    fetchPayouts();
    fetchActivities();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      
      {/* Stats en haut */}
      {affiliateStats && (
        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Total Affiliés</Typography>
              <Typography variant="h4">{affiliateStats.totalAffiliates || 0}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Total Revenus</Typography>
              <Typography variant="h4">{affiliateStats.totalEarnings || 0} F CFA</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Paiements effectués</Typography>
              <Typography variant="h4">{affiliateStats.totalPayouts || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Onglets */}
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Affiliation tabs" sx={{ marginBottom: 2 }}>
        <Tab label="Affiliés" />
        <Tab label="Paiements" />
        <Tab label="Activités" />
        {/* <Tab label="Créer un affilié" /> */}
      </Tabs>

      {/* Contenu des onglets */}
      <Box sx={{ padding: 2 }}>
        {tabIndex === 0 && (
          <AffiliateTable 
          fetchAffiliates={fetchAffiliates} 
          allAffiliates={allAffiliates} 
          />
        )}

{tabIndex === 1 && (
  <PayoutHistoryTable 
  fetchPayouts={fetchPayouts} 
  payouts={payouts} 
  />
)}

{tabIndex === 2 && (
  <ActivityHistoryTable
  fetchActivities={fetchActivities} 
  activities={activities} 
  />
)}

        {tabIndex === 3 && (
          <Box>
            <Typography variant="h6">Créer un affilié / Générer un lien</Typography>
            {/* Ici tu peux mettre un formulaire pour créer un affilié et générer un lien */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Affiliation;
