import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';

const VehicleContext = createContext(null);

const VEHICLE_KEY = 'activeVehicleId';

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);

  const loadVehicles = async (deliveryId, token) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/vehicles/delivery/${deliveryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    const list = data.body || [];

    setVehicles(list);

    if (list.length === 0) {
      setActiveVehicle(null);
      return;
    }

    const savedId = await AsyncStorage.getItem(VEHICLE_KEY);
    if (savedId) {
      const found = list.find(v => v.id === Number(savedId));
      if (found) {
        setActiveVehicle(found);
        return;
      }
    }

    setActiveVehicle(list[0]);
    await AsyncStorage.setItem(VEHICLE_KEY, String(list[0].id));
  };

  const selectVehicle = async (vehicle) => {
    setActiveVehicle(vehicle);
    await AsyncStorage.setItem(VEHICLE_KEY, String(vehicle.id));
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        activeVehicle,
        loadVehicles,
        selectVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export const useVehicle = () => useContext(VehicleContext);
