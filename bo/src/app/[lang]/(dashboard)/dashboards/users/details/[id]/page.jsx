'use client';

// Next Imports
import { useParams } from 'next/navigation';

// React Imports
import { useEffect, useState } from 'react';

// Context Imports
import { useAdminStore } from '@/contexts/GlobalContext';
import CustomerDetails from '../../component';

// Component Imports

const CustomerDetailsPage = () => {
    const params = useParams();
    const { getUserDataById } = useAdminStore();
    const [userInfo, setUserInfo] = useState(null);

    const getUserInfo = async () => {
        if (params && params?.id) {
            try {
                const { data, status } = await getUserDataById(params?.id);
                setUserInfo(data);
            } catch (error) {
                console.error("Erreur lors de la récupération du client :", error);
            }
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    if (!userInfo) {
        // redirect('/not-found');
        return null; // Évite un rendu inutile
    }

    return userInfo ? <CustomerDetails fetchCustomer={getUserInfo} userData={userInfo} customerId={userInfo?.user?._id} /> : null;
};

export default CustomerDetailsPage;
