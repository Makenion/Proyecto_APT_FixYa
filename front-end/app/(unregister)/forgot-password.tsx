// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, Pressable, Image } from 'react-native';
// import {SafeAreaView} from "react-native-safe-area-context";
// import { useRouter } from 'expo-router';
//
// export default function ForgotPasswordScreen() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//
//   // --- ¡ESTA ES LA FUNCIÓN IMPORTANTE! ---
//   const handleSend = () => {
//     console.log('Enviando link de recuperación a:', email);
//     // Aquí llamarías a tu backend de Go para enviar el correo...
//
//     // Después, esta línea te lleva a la pantalla "Revisa tu correo"
//     router.push('/(auth)/verify-code');
//   };
//
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.mainContent}>
//         <Text style={styles.headerTitle}>Recupera tu contraseña</Text>
//
//         <Image source={require('../../assets/images/lock.jpeg')} style={styles.iconImage} />
//
//         <Text style={styles.subtitle}>
//           Ingresa el correo asociado a tu cuenta.
//         </Text>
//
//         <TextInput
//           style={styles.input}
//           placeholder="Correo electronico"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           placeholderTextColor="#999"
//         />
//
//         {/* Este botón llama a la función handleSend, que ahora navega */}
//         <Pressable style={styles.button} onPress={handleSend}>
//           <Text style={styles.buttonText}>Enviar</Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F7F8FA' },
//   mainContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
//   headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 40 },
//   iconImage: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//     alignSelf: 'center',
//     marginBottom: 30,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#7F8C8D',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   input: {
//     fontSize: 16,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#DDD',
//     marginBottom: 40,
//   },
//   button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
//   buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
// });