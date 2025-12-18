import { Text, View } from 'react-native';
import MovementItem from './movementItem';

export default function MovementsList({ movements }) {
  if (!movements || movements.length === 0) {
    return (
      <Text style={{ marginTop: 16, color: '#666' }}>
        No hay movimientos registrados
      </Text>
    );
  }

  return (
    <View style={{ marginTop: 16 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 12,
        }}
      >
        Últimos movimientos
      </Text>

      {movements.slice(0, 5).map((m) => (
        <MovementItem key={m.id} movement={m} />
      ))}
    </View>
  );
}
