import AppMenuOverlay from '@/components/appMenuOverlay';
import { AuthProvider } from '@/context/authContext';
import { MenuProvider, useMenu } from '@/context/menuContext';
import { VehicleProvider } from '@/context/vehicleContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootContent() {
  const { menuOpen, closeMenu } = useMenu();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <AppMenuOverlay visible={menuOpen} onClose={closeMenu} />
    </>
  );
}

export default function Layout() {
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <MenuProvider>
            <VehicleProvider>
              <RootContent />
            </VehicleProvider>
          </MenuProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}
