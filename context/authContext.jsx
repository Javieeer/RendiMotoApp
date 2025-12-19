import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/login');
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async ({ token, deliveryId }) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('deliveryId', String(deliveryId));

    setIsAuthenticated(true);
    router.replace('/home');
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'token',
      'deliveryId',
      'activeVehicleId',
    ]);

    setIsAuthenticated(false);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
