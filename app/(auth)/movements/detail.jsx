import AppHeader from '@/components/appHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function MovementDetailScreen() {

  const { movement } = useLocalSearchParams();
  const router = useRouter();

  const parsed = JSON.parse(movement);

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar movimiento',
      '¿Seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const token = await AsyncStorage.getItem('token');

            await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/movements/${parsed.id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Alert.alert(
              'Eliminación exitosa',
              'El movimiento ha sido eliminado.',
              [
                { 
                  text: 'OK',
                  onPress: () => {router.replace('/home');} 
                }
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <>
      <AppHeader
        title="Detalle del movimiento" 
      />
      <View style={
        { padding: 20, 
          backgroundColor: '#f0f0f0',
        }
      } >
        <View
          style={{
            marginTop: 20,
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: parsed.type === 'INCOME' ? '#2ECC71' : '#E74C3C',
              marginBottom: 6,
            }}
          >
            {parsed.type === 'INCOME' ? 'INGRESO' : 'EGRESO'}
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              marginBottom: 4,
            }}
          >
            ${parsed.amount}
          </Text>

          <Text style={{ color: '#666' }}>
            {parsed.date}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            gap: 12,
          }}
        >
          {parsed.description && (
            <View>
              <Text style={{ color: '#888', fontSize: 12 }}>
                DESCRIPCIÓN
              </Text>
              <Text style={{ fontSize: 16 }}>
                {parsed.description}
              </Text>
            </View>
          )}

          <View>
            <Text style={{ color: '#888', fontSize: 12 }}>
              FECHA
            </Text>
            <Text style={{ fontSize: 16 }}>
              {parsed.date}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 32, gap: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3498DB',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={() =>
              router.push({
                pathname: './edit',
                params: {
                  movement: JSON.stringify(parsed),
                },
              })
            }
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              ✏️ Editar movimiento
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#f7e6e4ff',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={handleDelete}
          >
            <Text style={{ color: '#E74C3C', fontWeight: '600' }}>
              🗑️ Eliminar movimiento
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </>
  );
}
