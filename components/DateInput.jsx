import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const formatDate = (date) => date.toISOString().split('T')[0];

export default function DateInput({ label, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const dateValue = value ? new Date(value) : new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.text}>
          {value ? value : 'Seleccionar fecha'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) {
              onChange(formatDate(date)); // ← YYYY-MM-DD
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  text: {
    fontSize: 15,
    color: '#111',
  },
});
