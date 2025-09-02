'use client';

// Next Imports
import { useParams } from 'next/navigation';

// React Imports
import { useEffect, useState } from 'react';

// Context Imports
import { useCustomerStore } from '@/contexts/GlobalContext';
import CustomerDetails from '../../component';

// Component Imports

const CustomerDetailsPage = () => {
    const params = useParams();
    const { getCustomersById } = useCustomerStore();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            if (params && params?.id) {
                try {
                    const { data, status } = await getCustomersById(params?.id);
                    setCustomer(data);
                } catch (error) {
                    console.error("Erreur lors de la récupération du client :", error);
                }
            }
        };

        fetchCustomer();
    }, []);

    if (!customer) {
        // redirect('/not-found');
        return null; // Évite un rendu inutile
    }

    return customer ? <CustomerDetails customerData={customer} customerId={customer?.customer?._id} /> : null;
};

export default CustomerDetailsPage;
