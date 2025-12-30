import AppHeader from '@/components/appHeader';
import { useVehicle } from '@/context/vehicleContext';
import { daysUntil } from '@/utils/alerts';
import { Text, View } from 'react-native';

/* Componente de alerta */
function AlertCard({ title, days, type }) {

  const isExpired = days < 0;
  const absDays = Math.abs(days);

  const bg =
    isExpired ? '#F8D7DA' : absDays <= 30 ? '#FFF3CD' : '#D1E7DD';

  const color =
    isExpired ? '#842029' : absDays <= 30 ? '#664D03' : '#0F5132';

  return (
    <View
      style={{
        backgroundColor: bg,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color }}>
        {title}
      </Text>

      <Text style={{ marginTop: 6, color }}>
        {isExpired
          ? `Vencido hace ${absDays} días`
          : `Vence en ${absDays} días`}
      </Text>
    </View>
  );
}


export default function AlertsScreen() {

  const { activeVehicle } = useVehicle();

  /* Verificar si hay vehículo activo */
  if (!activeVehicle) {
    return (
      <>
        <AppHeader />
        <View style={{ padding: 16 }}>
          <Text>No hay vehículo seleccionado</Text>
        </View>
      </>
    );
  }

  /* SOAT */
  const rawSoatDate = daysUntil(activeVehicle.soatExpiration);
  const soatDate = rawSoatDate < 0 ? Math.abs(rawSoatDate) : rawSoatDate;
  const soatDays = 365 - soatDate;

  /* Tecnomecánica */
  const rawTecnoDate = daysUntil(activeVehicle.tecnoMecanicaExpiration);
  const tecnoDate = rawTecnoDate < 0 ? Math.abs(rawTecnoDate) : rawTecnoDate;
  const tecnoDays = 365 - tecnoDate;

  const showSoat = soatDays <= 30;
  const showTecno = tecnoDays <= 30;

  return (
    <>
      <AppHeader />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
          Alertas del vehículo
        </Text>

        {showSoat && (
          <AlertCard
            title="SOAT"
            days={soatDays}
            type="soat"
          />
        )}

        {showTecno && (
          <AlertCard
            title="Tecnomecánica"
            days={tecnoDays}
            type="tecno"
          />
        )}

        {!showSoat && !showTecno && (
          <View
            style={{
              backgroundColor: '#E7F5FF',
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#084298', fontWeight: '600' }}>
              ✅ No tienes alertas activas
            </Text>
            <Text style={{ color: '#084298', marginTop: 4 }}>
              SOAT y Tecnomecánica están al día
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
