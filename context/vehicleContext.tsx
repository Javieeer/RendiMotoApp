import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const VehicleContext = createContext();

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/vehicles/delivery/4`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

        if (!isMounted) return;

        const vehicles = data?.body ?? [];

        setVehicles(vehicles);

        if (vehicles.length === 1) {
          setActiveVehicle(vehicles[0]);
        }
        if (vehicles.length > 0) {
          setActiveVehicle(vehicles[0]);
        }

      } catch (e) {
        console.error('Error cargando vehículos', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        activeVehicle,
        setActiveVehicle,
        loading,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export const useVehicle = () => useContext(VehicleContext);
