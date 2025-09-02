import dayjs from "dayjs";

export function convertDate(date) {
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

export function durationInDays(date) {
  const dateDiff = Date.now() - dayjs(date).valueOf();
  const durationInDays = Math.floor(dayjs.duration(dateDiff).asDays());

  return Math.abs(durationInDays);
}
