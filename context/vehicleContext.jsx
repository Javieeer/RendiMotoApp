import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';

const VehicleContext = createContext(null);

const VEHICLE_KEY = 'activeVehicleId';

export function VehicleProvider({ children }) {

  const [vehiclesLoaded, setVehiclesLoaded] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);

  /* Load vehicles and set active vehicle */
  const loadVehicles = async (deliveryId, token) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/vehicles/delivery/${deliveryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    const list = data.body || [];

    if(!data.body || data.body.length === 0) {
      setVehiclesLoaded(true);
      setActiveVehicle(null);
      return;
    }

    const savedId = await AsyncStorage.getItem(VEHICLE_KEY);
    const found =  data.body.find(v => v.id === Number(savedId));
    
    if (found) {
      setActiveVehicle(found);
    } else {
      setActiveVehicle(data.body[0]);
      await AsyncStorage.setItem(VEHICLE_KEY, String(data.body[0].id));
    }

    setVehiclesLoaded(true);
    setVehicles(list);
  };

  /* Select a vehicle and save it to AsyncStorage */
  const selectVehicle = async (vehicle) => {
    setActiveVehicle(vehicle);
    await AsyncStorage.setItem(VEHICLE_KEY, String(vehicle.id));
  };

  /* Reset vehicles and active vehicle */
  const resetVehicles = () => {
    setVehicles([]);
    setActiveVehicle(null);
    setVehiclesLoaded(false);
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        activeVehicle,
        loadVehicles,
        selectVehicle,
        vehiclesLoaded,
        resetVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export const useVehicle = () => useContext(VehicleContext);
