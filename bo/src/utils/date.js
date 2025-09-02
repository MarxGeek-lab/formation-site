
// Function to convert datePost to "time ago" format
export function getTimeAgo(datePost) {
    const currentDate = new Date();
    const postDate = new Date(datePost);

    const seconds = Math.floor((currentDate.getTime() - postDate.getTime()) / 1000);
    if (seconds < 60) {
        return `il y a ${seconds} secondes`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `il y a ${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `il y a ${hours} heures`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `il y a ${days} jours`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `il y a ${months} mois`;
    }

    const years = Math.floor(months / 12);
    return `il y a ${years} ans`;
}
