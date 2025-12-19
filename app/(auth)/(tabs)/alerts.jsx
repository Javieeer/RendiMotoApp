import AppHeader from '@/components/appHeader';
import { Text, View } from 'react-native';

export default function AlertsScreen() {

  return (
    <>
      <AppHeader />
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Alertas de vehículo</Text>
        <Text>SOAT / Tecno próximos a vencer</Text>
      </View>
    </>
  );
}
