export function parseIsoTimestampToChatTime(
  isoTimestamp: string,
  includeDay: boolean = true
): string {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const hour = date.getHours() % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, "0");
  const period = date.getHours() >= 12 ? "PM" : "AM";
  if (!includeDay) {
    return `${hour}:${minute} ${period}`;
  }

  if (date >= today) {
    return `Today ${hour}:${minute} ${period}`;
  } else if (date >= yesterday) {
    return `Yesterday ${hour}:${minute} ${period}`;
  } else {
    return `${date.toLocaleDateString()} ${hour}:${minute} ${period}`;
  }
}

export function parseChatMessageTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Add a leading zero to minutes if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  // Determine whether the timestamp is for today or a different day
  const isToday = date.toDateString() === new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Format the timestamp string using the user's locale settings
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  let formattedDate: string;
  if (isToday) {
    formattedDate = date.toLocaleTimeString(undefined, options).toUpperCase();
  } else if (isYesterday) {
    formattedDate =
      "Yesterday, " + date.toLocaleTimeString(undefined, options).toUpperCase();
  } else {
    options.day = "numeric";
    options.month = "short";
    options.year = "numeric";
    formattedDate = date.toLocaleDateString(undefined, options).toUpperCase();
  }

  return formattedDate;
}
