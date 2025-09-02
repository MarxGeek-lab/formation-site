const propertyKey = "proerpertyKey";
const notificationsKey = "notificationkey";
const reservationKey = "reservationKey";
const getUserKeyFavoris = (userId) => {
    return `user:${userId}:favorites`;
}

module.exports = {
    propertyKey,
    notificationsKey,
    reservationKey,
    getUserKeyFavoris
}