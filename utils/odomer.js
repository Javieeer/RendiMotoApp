export function getLastOdometer(movements = []) {
  const withOdometer = movements.filter(
    m => m.odometer !== null && m.odometer !== undefined
  );

  if (withOdometer.length === 0) return null;

  withOdometer.sort((a, b) => {
    if (a.date === b.date) return b.id - a.id;
    return new Date(b.date) - new Date(a.date);
  });

  return withOdometer[0].odometer;
}
