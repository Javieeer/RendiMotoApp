import BackButton from '@/components/backButton';
import { StyleSheet, Text, View } from 'react-native';


export default function Header({ title }: { title: string }) {

  return (
    <View style={styles.container}>
      <BackButton label="Atras" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3EE',
    zIndex: 10,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
});
