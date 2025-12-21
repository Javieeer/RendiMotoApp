export function daysUntil(dateString) {

  const today = new Date();
  const target = new Date(dateString);

  /* Calculate the difference in milliseconds */
  const diff = target.getTime() - today.getTime();

  /* Return the number of days */
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}