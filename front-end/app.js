// App.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Image, 
  TouchableOpacity 
} from 'react-native';

// Este es el componente principal que renderiza tu pantalla
export default function App() {
  // Por ahora, al presionar las tarjetas solo imprimiremos un mensaje en la consola.
  const handlePress = (role) => {
    console.log('Rol seleccionado:', role);
    // Aquí es donde en el futuro pondrías la lógica de navegación.
  };

  return (
    // SafeAreaView asegura que el contenido no se superponga con el notch o la barra de estado de iOS.
    <SafeAreaView style={styles.container}>
      
      {/* Contenedor principal para centrar el contenido */}
      <View style={styles.mainContent}>
        
        {/* --- Título de la pantalla --- */}
        <Text style={styles.headerTitle}>Registro</Text>

        {/* --- Logo principal --- */}
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.logo} 
        />

        {/* --- Contenedor para las dos tarjetas de selección --- */}
        <View style={styles.selectionContainer}>

          {/* Tarjeta para "Trabajador" */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress('Trabajador')}
          >
            <Image 
              source={require('./assets/worker-avatar.png')} 
              style={styles.cardImage} 
            />
            <Text style={styles.cardText}>Trabajador</Text>
          </TouchableOpacity>

          {/* Tarjeta para "Usuario" */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress('Usuario')}
          >
            <Image 
              source={require('./assets/user-avatar.png')} 
              style={styles.cardImage} 
            />
            <Text style={styles.cardText}>Usuario</Text>
          </TouchableOpacity>
        </View>

        {/* --- Texto de instrucción debajo de las tarjetas --- */}
        <Text style={styles.instructionText}>
          Selecciona el tipo de cuenta con el que quieres registrarte.
        </Text>
      </View>
      
      {/* --- Footer con el link para iniciar sesión --- */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.loginLink}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Aquí definimos todos los estilos para que se parezca a la foto.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA', // Un fondo blanco ligeramente grisáceo
  },
  mainContent: {
    flex: 1, // Ocupa el espacio disponible
    alignItems: 'center', // Centra los elementos horizontalmente
    justifyContent: 'center', // Centra los elementos verticalmente
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain', // Asegura que la imagen se escale correctamente
    marginBottom: 50,
  },
  selectionContainer: {
    flexDirection: 'row', // Coloca las tarjetas una al lado de la otra
    justifyContent: 'space-around', // Crea espacio entre las tarjetas
    width: '100%', // Ocupa todo el ancho disponible
  },
  card: {
    width: 140,
    height: 160,
    backgroundColor: 'white',
    borderRadius: 20, // Bordes muy redondeados
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Sombra para Android
    elevation: 5,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Hace que la imagen sea un círculo perfecto
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600', // Semi-negrita
    color: '#34495E',
  },
  instructionText: {
    marginTop: 40,
    color: '#7F8C8D', // Un color de texto gris
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%', // Evita que el texto sea demasiado ancho
  },
  footer: {
    // Posiciona el footer en la parte inferior
    paddingBottom: 40, 
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  loginLink: {
    color: '#3498DB', // Color azul para el link
    fontWeight: 'bold',
  },
});