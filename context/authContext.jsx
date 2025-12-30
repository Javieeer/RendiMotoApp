import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useVehicle } from './vehicleContext';

const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  const router = useRouter();
  const { resetVehicles } = useVehicle();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* Check authentication status on app start */
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const deliveryId = await AsyncStorage.getItem('deliveryId');
      const userName = await AsyncStorage.getItem('userName');

      if (token && deliveryId && userName) {
        setIsAuthenticated(true);
        setUser({
          id: Number(deliveryId),
          name: userName,
        });
      } else {
        setIsAuthenticated(false);
        router.replace('/');
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  /* Login user and store credentials */
  const login = async ({ token, deliveryId, userName }) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('deliveryId', String(deliveryId));
    await AsyncStorage.setItem('userName', userName);

    setUser({
      id: Number(deliveryId),
      name: userName,
    });

    setIsAuthenticated(true);
    router.replace('/home');
  };

  /* Logout user and clear all stored data */
  const logout = async () => {
    await AsyncStorage.clear();

    resetVehicles();
    setUser(null);
    setIsAuthenticated(false);
    /* AsyncStorage.clear(); */
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
