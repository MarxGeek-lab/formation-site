import React, { createContext, useContext, ReactNode } from "react";

// Interface pour définir les types des fonctions 
interface AdminContextType {
  getAccountSubmitted: () => Promise<void>;
}

// Création du contexte 
const AdminContext = createContext<AdminContextType>({
    getAccountSubmitted: async () => {},
});

// Hook personnalisé pour utiliser le contexte dans les composants
export const useAdminStore = (): AdminContextType => useContext(AdminContext);

// Composant fournisseur de contexte
export const AdminStoreProvider = ({ children }: { children: ReactNode }) => {

  const getAccountSubmitted = async (): Promise<void> => {};
 
  const context = {
    getAccountSubmitted
  };

  return <AdminContext.Provider value={context}>{children}</AdminContext.Provider>;
};
