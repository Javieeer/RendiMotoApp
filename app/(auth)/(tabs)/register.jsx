import AppHeader from '@/components/appHeader';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  
  const router = useRouter();

  return (
    <>
      <AppHeader />
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.income]}
          onPress={() => router.push('/movements/create?type=INCOME')}
        >
          <Text style={styles.text}>➕ Registrar ingreso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.expense]}
          onPress={() => router.push('/movements/create?type=EXPENSE')}
        >
          <Text style={styles.text}>➖ Registrar egreso</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  button: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  income: {
    backgroundColor: '#2ECC71',
  },
  expense: {
    backgroundColor: '#E74C3C',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
