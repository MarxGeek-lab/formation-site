import { AuthProvider } from "./AuthContext";
import { PropertyProvider } from "./PropertyStore";
import { StatsProvider } from "./statsContext";
import { ReservationProvider } from "./ReservationStore";
import { CustomerProvider } from "./CustomerStore";
import { MessagesProvider } from "./MessagesStore";
import { ReviewProvider } from "./ReviewStore";
import { HelpCenterProvider } from "./HelpCenterContext";
import { CommonProvider } from "./CommonContext";
import { WalletProvider } from "./WalletContext";
import { PaymentProvider } from "./PaymentStore";
import { AdminProvider } from "./AdminContext";
import { NewsletterProvider } from "./NewsletterContext";
import { SiteSettingsProvider } from "./SiteSettingsContext";
import { WithdrawalProvider } from "./WithdrawalContext";
import { AnnoncesProvider } from "./AnnoncesContext";
import { OrderProvider } from "./orderStore";
import { SubscriptionProvider } from "./SubscriptionContext";
import { PromoCodeProvider } from "./PromoContext";
import { AdminAffiliationProvider } from "./AffiliationContext";
import { UserProvider } from "./UserStore";
import { ProductProvider } from "./ProductStore";

export const GlobalStoreProvider = ({ children }) => {
    return (
        <AuthProvider>  
            <AdminProvider>
                <UserProvider>
                    <ProductProvider>
                        <OrderProvider>
                        <NewsletterProvider>
                        <PromoCodeProvider>
                        <SiteSettingsProvider>
                            <SubscriptionProvider>
                        <WithdrawalProvider>
                            <AnnoncesProvider>
                        <ReservationProvider>
                             <PropertyProvider> 
                             <StatsProvider>
                                {/* <RentalProvider>  */}
                                    <CustomerProvider>
                                        <MessagesProvider>
                                            <ReviewProvider>
                                                <HelpCenterProvider>
                                                    <CommonProvider>
                                                        <WalletProvider>
                                                            <PaymentProvider>  
                                                                <AdminAffiliationProvider>   
                                                            {children}
                                                            </AdminAffiliationProvider>
                                                            </PaymentProvider>
                                                        </WalletProvider>
                                                    </CommonProvider>
                                                </HelpCenterProvider>
                                            </ReviewProvider>
                                        </MessagesProvider>
                                    </CustomerProvider>
                                 {/* </RentalProvider> */}
                                 </StatsProvider> 
                            </PropertyProvider> 
                        </ReservationProvider>
                        </AnnoncesProvider>
                        </WithdrawalProvider>
                        </SubscriptionProvider>
                        </SiteSettingsProvider>
                        </PromoCodeProvider>
                        </NewsletterProvider>
                        </OrderProvider>
                    </ProductProvider>
                </UserProvider>
            </AdminProvider>
        </AuthProvider>
    );
}

export { useAuthStore } from "./AuthContext";
export { useReservationStore } from "./ReservationStore"; 
export { usePropertyStore } from "./PropertyStore"; 
export { useStatsStore } from "./statsContext"; 
export { useCustomerStore } from './CustomerStore';
export { useMessagesStore } from './MessagesStore';
export { useReviewStore } from './ReviewStore';
export { useHelpCenterStore } from './HelpCenterContext';
export { useCommonStore } from "./CommonContext"; 
export { useWalletStore } from "./WalletContext";
export { usePaymentStore } from "./PaymentStore";
export { useAdminStore } from "./AdminContext";
export { useNewsletterStore } from "./NewsletterContext";
export { useSiteSettingsStore } from "./SiteSettingsContext";
export { useWithdrawalStore } from "./WithdrawalContext";
export { useAnnoncesStore } from "./AnnoncesContext";
export { useOrderStore } from "./orderStore";
export { useSubscriptionContext } from "./SubscriptionContext";
export { usePromoCodeStore } from "./PromoContext";
export { useAdminAffiliationStore } from "./AffiliationContext";
export { useUserStore } from "./UserStore";
export { useProductStore } from "./ProductStore";
