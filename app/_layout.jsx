import { VehicleProvider } from '@/context/vehicleContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <VehicleProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </VehicleProvider>
  );
}