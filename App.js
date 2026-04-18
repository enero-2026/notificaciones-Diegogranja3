import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [contador, setContador] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      await cargarContador();
      setIsLoaded(true);
    };

    init();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      guardarContador(contador);
    }
  }, [contador, isLoaded]);

  const pedirPermiso = async () => {
    await Notifications.requestPermissionsAsync();
  };

  const enviarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hola',
        body: `Contador actual: ${contador}`,
      },
      trigger: null,
    });
  };

  const incrementar = () => {
    setContador((prev) => prev + 1);
  };

  const guardarContador = async (valor) => {
    try {
      await AsyncStorage.setItem('contador', JSON.stringify(valor));
    } catch (e) {
      console.log('Error guardando');
    }
  };

  const cargarContador = async () => {
    try {
      const data = await AsyncStorage.getItem('contador');
      if (data !== null) {
        setContador(JSON.parse(data));
      }
    } catch (e) {
      console.log('Error cargando');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Notificaciones</Text>

        <Button title="Pedir permiso" onPress={pedirPermiso} />
        <Button title="Enviar notificacion" onPress={enviarNotificacion} />

        <Text style={styles.counterText}>Contador: {contador}</Text>
        <Button title="Incrementar" onPress={incrementar} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    marginTop: 50,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  counterText: {
    fontSize: 20,
  },
});
