export const calculateDurationAndPrice = (startDate, endDate, startTime, endTime, bookingData, durationType) => {
    if (!startDate || !endDate) return { duration: 0, unit: '', total: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startTimes = startTime || '00:00';
    const endTimes = endTime || '23:59';
    const price = bookingData?.property?.billing[durationType]?.price;

    let duration = 0;
    let unit = '';
    let total = 0;

    switch (durationType) {
      case 'hour':
        // Convertir les heures en millisecondes et ajouter les heures spécifiques
        const [startHour, startMinute] = startTimes.split(':').map(Number);
        const [endHour, endMinute] = endTimes.split(':').map(Number);
        const startDate = new Date(start.setHours(startHour, startMinute));
        const endDate = new Date(end.setHours(endHour, endMinute));
        
        duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
        unit = 'heure' + (duration > 1 ? 's' : '');
        total = price * duration;
        break;

      case 'day':
        duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        unit = 'jour' + (duration > 1 ? 's' : '');
        total = price * duration;
        break;

      case 'night':
        duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        unit = 'nuit' + (duration > 1 ? 's' : '');
        total = price * duration;
        break;

      case 'week':
        duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
        unit = 'semaine' + (duration > 1 ? 's' : '');
        total = price * duration;
        break;

      case 'month':
        // Calculer la différence en mois
        duration = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (end.getDate() < start.getDate()) {
          duration--; // Ajuster si le jour de fin est avant le jour de début
        }
        unit = 'mois';
        total = price * duration;
        break;

      case 'year':
        duration = end.getFullYear() - start.getFullYear();
        if (end.getMonth() < start.getMonth() || (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())) {
          duration--; // Ajuster si le mois/jour de fin est avant le mois/jour de début
        }
        unit = 'année' + (duration > 1 ? 's' : '');
        total = price * duration;
        break;

      case 'fixe':
        duration = 1;
        unit = 'fixe';
        total = price;
        break;

      default:
        duration = 0;
        unit = '';
        total = 0;
    }

    return { duration, unit, total };
  };