import type {ReactNode} from "react";
import { AuthProvider } from "./AuthContext";
import { NewsletterProvider } from "./NewsletterStore";
import { OrderProvider } from "./OrderStore";
import { ProductProvider } from "./ProductStore";
import { RentalProvider } from "./RentalStore";
import { PaymentProvider } from "./PaymentStore";
import { CommonProvider } from "./CommonContext";

export const GlobalProvider = ({children}: {children: ReactNode}) => {
    return (
        <AuthProvider>  
            <NewsletterProvider>  
                <OrderProvider>
                    <ProductProvider>
                    <RentalProvider>
                        <PaymentProvider>
                            <CommonProvider>
                                {children}
                            </CommonProvider>
                        </PaymentProvider>
                    </RentalProvider>
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
export { useRentalStore } from "./RentalStore"; 
export { usePaymentStore } from './PaymentStore';
export { useCommonStore } from './CommonContext';