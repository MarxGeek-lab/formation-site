import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// On active le plugin
dayjs.extend(duration);

export function convertDate(date: string) {
  let lang = "fr";
  const dateDiff = Date.now() - dayjs(date).valueOf();
  const durationInMinutes = Math.floor(dayjs.duration(dateDiff).asMinutes());
  const durationInHours = Math.floor(dayjs.duration(dateDiff).asHours());
  const durationInDays = Math.floor(dayjs.duration(dateDiff).asDays());

  if (durationInMinutes < 60) {
    return lang === "fr"
      ? `il y a ${durationInMinutes} minute${durationInMinutes > 1 ? "s" : ""}`
      : `${durationInMinutes} minute${durationInMinutes > 1 ? "s" : ""} ago`;
  } else if (durationInHours < 24) {
    return lang === "fr"
      ? `il y a ${durationInHours} heure${durationInHours > 1 ? "s" : ""}`
      : `${durationInHours} hour${durationInHours > 1 ? "s" : ""} ago`;
  } else if (durationInDays < 2) {
    return lang === "fr"
      ? `il y a ${durationInDays} jour${durationInDays > 1 ? "s" : ""}`
      : `${durationInDays} day${durationInDays > 1 ? "s" : ""} ago`;
  } else {
    return dayjs(new Date(date)).locale("fr").format('lll');
  }
}

export function durationInDays(date: string) {
  const dateDiff = Date.now() - dayjs(date).valueOf();
  const durationInDays = Math.floor(dayjs.duration(dateDiff).asDays());

  return Math.abs(durationInDays);
}

// Function to convert datePost to "time ago" format
export function getTimeAgo(datePost: any) {
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