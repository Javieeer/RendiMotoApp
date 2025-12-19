import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppMenuOverlay({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <View pointerEvents={visible ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
      
      {/* FONDO */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: slideAnim.interpolate({
              inputRange: [0, 300],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* PANEL */}
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
            Menú
          </Text>
          <Text>Opción 1</Text>
          <Text>Opción 2</Text>
          <Text>Opción 3</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 260,
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
