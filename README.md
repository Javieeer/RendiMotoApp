# 🏍️ RendiMoto App

RendiMoto es una aplicación móvil para Android dirigida a domiciliarios que desean controlar la rentabilidad de su vehículo.\
Permite registrar ingresos y gastos, visualizar balances y mantener organizada la información operativa del día a día.

La app está desarrollada con Expo + React Native, y se comunica con un backend en Java + Spring Boot + mysql

Desarrollada por Javier Zapata como repaso de 3er semestre de Ing. En sistemas

## 🚀 Características principales

- Registro de ingresos y egresos
- Cálculo de balance y rentabilidad
- Autenticación segura
- Gestión de vehículos
- Interfaz optimizada para Android
- Diseño enfocado en uso real por domiciliarios

## 🆕 Novedades — v1.3

- ✅ Corrección del bug de navegación en Android
- - Ajuste de layouts para evitar superposición con la barra de navegación del sistema
- - Mejor visualización en dispositivos con botones virtuales activos
- Mejoras menores de estabilidad

## 🛠️ Tecnologías

- Frontend: Expo, React Native, Expo Router
- Backend: JAVA + Spring Boot, JWT, MySQL
- Build: EAS Build (APK)
- Plataforma objetivo: Android

## 📦 Instalación (desarrollo)

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Ejecutar en modo desarrollo:

   ```bash
   npx expo start
   ```
   
Nota: El proyecto está enfocado exclusivamente en Android.

## 🔐 Variables de entorno

La app utiliza variables públicas de Expo:

```bash
EXPO_PUBLIC_API_URL=https://tu-backend.com
```

Estas deben configurarse en:
- .env (desarrollo local)
- EAS Environment Variables (builds)

## 📱 Estado del proyecto

RendiMoto se encuentra en fase de pruebas reales con usuarios domiciliarios, con mejoras continuas basadas en feedback.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.