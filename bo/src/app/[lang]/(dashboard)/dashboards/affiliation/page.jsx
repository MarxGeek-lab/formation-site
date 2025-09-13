'use client';

import { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAdminAffiliationStore, useAuthStore } from "@/contexts/GlobalContext";
import AffiliateTable from "./components/AffiliateTable";
import PayoutHistoryTable from "./components/PayoutsTable";
import ActivityHistoryTable from "./components/Activity";
import CustomAvatar from "@/@core/components/mui/Avatar";
import { formatAmount } from "@/utils/formatAmount";

const Affiliation = () => {
  const { 
    getAllAffiliates, getAllPayouts,
    getAllActivities } = useAdminAffiliationStore();
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

        const totalAffiliates = data.length;
        const countFilleul = data.reduce((acc, affiliate) => {
          return acc + affiliate.referrals.length;
        }, 0);

        setAffiliateStats(prev => ({
          ...prev,
          totalAffiliates,
          countFilleul,
        }));
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
        setActivities(data);

        const totalEarnings = data.reduce((acc, p) => p.status === "paid" ? acc + p.amount : acc, 0);
        const totalCommissions = data.reduce((acc, p) => p.status === "paid" ? acc + p.commissionAmount : acc, 0);

        setAffiliateStats(prev => ({
          ...prev,
          totalEarnings,
          totalCommissions
        }));
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

  const stats = [
    {
      title: 'Total Affiliés',
      stats: affiliateStats?.totalAffiliates || 0,
      trendNumber: 18.2,
      avatarIcon: 'tabler-users',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Total Gains',
      stats: formatAmount(affiliateStats?.totalEarnings?.toFixed(2) || 0) +' FCFA',
      trendNumber: -8.7,
      avatarIcon: 'tabler-wallet',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
    },
    {
      title: 'Commissions',
      stats: formatAmount(affiliateStats?.totalCommissions?.toFixed(2) || 0) +' FCFA',
      trendNumber: -8.7,
      avatarIcon: 'tabler-wallet',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
    },
    {
      title: 'Total filleul',
      stats: affiliateStats?.countFilleul || 0,
      trendNumber: 4.3,
      avatarIcon: 'tabler-users',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
    }
  ]

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      
      {/* Stats en haut */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        {stats.map((list, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                background: '#5F3AFC', 
                boxShadow: 'none',
                border: '1px solid rgb(207, 207, 207)',
                borderBottom: '2px solid #5F3AFC'
              }}>
                <CardContent className=' h-[100px] flex items-center justify-between gap-2'>
                  <div className='flex flex-col items-start gap-1'>
                    <Typography variant='h6' color="white" whiteSpace={'nowrap'}>
                      {list.stats}</Typography>
                    <Typography fontSize={14} className="mt-2" color="white" whiteSpace={'nowrap'}>{list.title}</Typography>
                  </div>
                  <CustomAvatar color='#ffffff02' skin='#ffffff02'  variant='rounded' size={42}>
                    <i className={list.avatarIcon} style={{ color: '#5F3AFC' }} />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>
        ))}
      </Grid>
      

      {/* Onglets */}
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Affiliation tabs" sx={{ marginBottom: 2 }}>
        <Tab label="Affiliés" />
        <Tab label="Activités fileul" />
        <Tab label="Retrait" />
       
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

        {tabIndex === 2 && (
          <PayoutHistoryTable 
          fetchPayouts={fetchPayouts} 
          payouts={payouts} 
          />
        )}

        {tabIndex === 1 && (
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
