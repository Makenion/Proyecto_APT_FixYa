// 🎯 ARCHIVO: app/(tabs2)/perfil-maestro.tsx (EDITADO)

import React, { useState } from 'react'; 
import { 
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity, 
  ScrollView, Image, Modal, Pressable, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

// --- Componente Reutilizable para cada opción del menú ---
const ListItem = ({ icon, text, onPress }: { icon: any; text: string; onPress?: () => void }) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.listItemContent}>
        <Ionicons name={icon} size={24} color="#555" style={styles.listItemIcon} />
        <Text style={styles.listItemText}>{text}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#BDBDBD" />
    </TouchableOpacity>
  );
};

// --- Datos de ejemplo (basados en la foto) ---
const maestroInfo = {
  id: 'maestro123', // 👈 1. ID AÑADIDO (para pasar a la siguiente pantalla)
  nombre: 'Esteban',
  apellido: 'Tamayo',
  rol: 'Carpintero',
  trabajosCompletados: 170,
  miembroDesde: '20/06/2020',
};

// --- Opciones del menú (Tus rutas personalizadas) ---
const menuOptions = [
  { icon: 'wallet-outline', text: 'Mi billetera', route: '/informacion-bancaria-maestro'},
  { icon: 'document-attach-outline', text: 'Documentos', route: '/documentos-maestro' },
  { icon: 'settings-outline', text: 'Configuración' },
  { icon: 'lock-closed-outline', text: 'Privacidad y seguridad' },
  { icon: 'log-out-outline', text: 'Cerrar sesión' }, 
];

export default function PerfilMaestroScreen() {
  const router = useRouter(); 
  const [modalVisible, setModalVisible] = useState(false);

  // --- Función de Logout (MODIFICADA) ---
  const handleLogout = () => {
    setModalVisible(false); 
    console.log('Cerrando sesión...');
    // Lógica para limpiar tokens/storage...
    
    router.replace('/'); 
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* --- Configura la barra de título --- */}
      <Stack.Screen 
        options={{
          headerShown: true, 
          title: '', 
          headerRight: () => ( 
            <TouchableOpacity 
              onPress={() => router.push('/informacion-personaluser-edit')} 
            >
              <Ionicons name="create-outline" size={24} color="#3498DB" style={{ marginRight: 15 }}/>
            </TouchableOpacity>
          ),
          headerShadowVisible: false, 
          headerStyle: { backgroundColor: '#F7F8FA' } 
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Header del Perfil --- */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://placehold.co/60x60/FAD7A0/C0392B?text=🧑' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.name}>{maestroInfo.nombre} {maestroInfo.apellido}</Text>
            <Text style={styles.role}>{maestroInfo.rol}</Text>
          </View>
        </View>

        {/* --- Tarjeta de Estadísticas --- */}
        <View style={styles.statsCard}>
          <Text style={styles.statsMainText}>
            <Text style={{fontWeight: 'bold'}}>{maestroInfo.trabajosCompletados}</Text> Trabajos completados
          </Text>
          <Text style={styles.statsSubText}>Miembro desde {maestroInfo.miembroDesde}</Text>
          <Text style={styles.qualityText}>Calidad alta ⭐</Text>
          
          {/* 👇 2. ONPRESS ACTUALIZADO 👇 */}
          <TouchableOpacity 
            onPress={() => router.push({
              // Ruta consistente con tus otras rutas (ej. documentos-maestro)
              pathname: '/reseñas-maestro', 
              params: { 
                maestroId: maestroInfo.id, 
                maestroNombre: maestroInfo.nombre 
              }
            })}
          >
            <Text style={styles.reviewLink}>Ver reseñas</Text>
          </TouchableOpacity>
        </View>

        {/* --- Menú de Opciones --- */}
        <View style={styles.menuContainer}>
          {menuOptions.map((option, index) => (
            <ListItem 
              key={index} 
              icon={option.icon} 
              text={option.text} 
              onPress={() => {
                if (option.text === 'Cerrar sesión') {
                  setModalVisible(true); 
                } else if (option.route) {
                  router.push(option.route as any); 
                } else {
                  console.log(`Presionado: ${option.text}`);
                }
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* --- MODAL DE CERRAR SESIÓN --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)} 
        >
          <Pressable 
            style={styles.modalContent} 
            onPress={() => {}} 
          >
            <Ionicons name="log-out-outline" size={70} color="#3498DB" style={{ marginBottom: 15 }} /> 
            
            <Text style={styles.modalTitle}>¿Seguro que deseas cerrar sesión?</Text>

            <TouchableOpacity 
              style={styles.modalButtonSolid} 
              onPress={handleLogout} // Llama a la función de logout
            >
              <Text style={styles.modalButtonTextSolid}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButtonCancel} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

// --- ESTILOS (Sin cambios) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }, 
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  role: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20, 
    paddingHorizontal: 15, 
    alignItems: 'center', 
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statsMainText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center', 
  },
  statsSubText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8, 
    textAlign: 'center', 
  },
  qualityText: {
    fontSize: 16, 
    color: '#2C3E50',
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center',
  },
  reviewLink: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden', 
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18, 
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    marginRight: 15,
  },
  listItemText: {
    fontSize: 16,
    color: '#34495E',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 25, 
    textAlign: 'center',
  },
  modalButtonSolid: { 
    backgroundColor: '#3498DB',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonTextSolid: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonCancel: { 
    marginTop: 15,
    padding: 10,
  },
  modalButtonTextCancel: {
    color: '#7F8C8D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});