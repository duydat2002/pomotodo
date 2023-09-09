export const secondsFormat = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return `${minutes < 10 ? '0' + minutes : minutes}:${
    secondsLeft < 10 ? '0' + secondsLeft : secondsLeft
  }`;
};

export const secondsFormatToHM = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h:${minutes}m`;
};

export const secondsToHM = (seconds: number) => {
  if (seconds == 0) return {hours: 0, minutes: 0};

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return {hours, minutes};
};

export const secondsToMinutes = (seconds: number) => {
  return `${Math.floor(seconds / 60)}m`;
};
