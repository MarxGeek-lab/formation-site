export const formatAmount = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Ajoute un espace tous les trois chiffres
};

export const formatNumberPhone = (value: string): string => {
    return value.replace(/\B(?=(\d{2})+(?!\d))/g, ' '); // Ajoute un espace tous les trois chiffres
};