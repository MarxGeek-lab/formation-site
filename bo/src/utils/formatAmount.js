export const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Ajoute un espace tous les trois chiffres
};

export const formatNumberPhone = (value) => {
    return value.replace(/\B(?=(\d{2})+(?!\d))/g, ' '); // Ajoute un espace tous les trois chiffres
};