import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function MovementItem({ movement }) {

  const router = useRouter();
  
  const isIncome = movement.type === 'INCOME';

  return (
      <TouchableOpacity
        onPress={() =>
        router.push({
          pathname: '/movements/detail',
          params: {
            movement: JSON.stringify(movement),
          },
        })
      }>
        <View style={styles.container}>
          <Text style={styles.icon}>
            {isIncome ? '➕' : '➖'}
          </Text>

          <View style={styles.info}>
            <Text style={styles.description}>
              {movement.description || 'Sin descripción'}
            </Text>
            <Text style={styles.date}>{movement.date}</Text>
          </View>

          <Text
            style={[
              styles.amount,
              { color: isIncome ? '#2ECC71' : '#E74C3C' },
            ]}
          >
            ${movement.amount.toLocaleString()}
          </Text>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  amount: {
    fontWeight: '700',
    fontSize: 15,
  },
});
