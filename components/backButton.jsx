import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  label?: string;
};

export default function BackButton({ label = 'Volver' }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => router.back()}>
      <Text style={styles.text}>← {label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 14,
  },
});