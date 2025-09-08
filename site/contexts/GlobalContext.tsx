import type {ReactNode} from "react";
import { AuthProvider } from "./AuthContext";
import { NewsletterProvider } from "./NewsletterStore";
import { OrderProvider } from "./OrderStore";
import { ProductProvider } from "./ProductStore";
import { PaymentProvider } from "./PaymentStore";
import { CommonProvider } from "./CommonContext";
import { PromoCodeProvider } from "./PromoContext";
import { SubscriptionProvider } from "./SubscriptionContext";

export const GlobalProvider = ({children}: {children: ReactNode}) => {
    return (
        <AuthProvider>  
            <NewsletterProvider>  
                <OrderProvider>
                    <ProductProvider>
                        <PaymentProvider>
                            <CommonProvider>
                                <PromoCodeProvider>
                                    <SubscriptionProvider>
                                        {children}
                                    </SubscriptionProvider>
                                </PromoCodeProvider>
                            </CommonProvider>
                        </PaymentProvider>
                    </ProductProvider>
                </OrderProvider>
            </NewsletterProvider>
        </AuthProvider>
    );
}

export { useAuthStore } from "./AuthContext";
export { useNewsletterStore } from "./NewsletterStore"; 
export { useOrderStore } from "./OrderStore"; 
export { useProductStore } from "./ProductStore"; 
export { usePaymentStore } from './PaymentStore';
export { useCommonStore } from './CommonContext';
export { usePromoCodeStore } from './PromoContext';
export { useSubscriptionContext } from './SubscriptionContext';