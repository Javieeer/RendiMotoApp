import { StyleSheet, Text, View } from 'react-native';


export default function BalanceCard({ balance }) {

  if (!balance) return null;

  const isPositive = balance.balance >= 0;
  const income = balance.totalIncome ?? 0;
  const expense = balance.totalExpense ?? 0;
  const total = balance.balance ?? 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Balance del vehículo</Text>

      <View style={styles.row}>
        <Text style={styles.income}>💵 Ingresos</Text>
        <Text style={styles.incomeValue}>
          ${income.toLocaleString()}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.expense}>💸 Egresos</Text>
        <Text style={styles.expenseValue}>
          ${expense.toLocaleString()}
        </Text>
      </View>

      <View style={styles.divider} />

      <Text
        style={[
          styles.result,
          { color: isPositive ? '#2ECC71' : '#E74C3C' },
        ]}
      >
        {isPositive ? '📈' : '📉'} ${total.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  income: {
    color: '#2ECC71',
    fontWeight: '500',
  },
  incomeValue: {
    color: '#2ECC71',
    fontWeight: '600',
  },
  expense: {
    color: '#E74C3C',
    fontWeight: '500',
  },
  expenseValue: {
    color: '#E74C3C',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },
  result: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
});
