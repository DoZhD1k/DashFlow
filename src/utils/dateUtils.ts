// utils/dateUtils.ts
export const formatDate = (dateStr: string): string => {
  const isoDateStr = `${dateStr.replace(" ", "T")}+00:00`;
  console.log("ISO Date String:", isoDateStr);
  const date = new Date(isoDateStr);
  console.log("Parsed Date Object:", date);

  if (isNaN(date.getTime())) {
    return "Некорректная дата";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Aqtau", // Часовой пояс UTC+5:00
  };

  const formattedDate = date.toLocaleString("ru-RU", options);
  console.log("Formatted Date:", formattedDate);
  return formattedDate;
};
