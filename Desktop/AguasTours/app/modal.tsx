import { StatusBar, Image, View, Text, Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { LinearGradient } from 'expo-linear-gradient';

export default function ModalScreen() {
  return (
    <LinearGradient colors={['#191970', '#191970']} style={styles.container}>
      <Text style={styles.title}>AguasTours</Text>
      <Image source={require('./../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.separator} />
      <EditScreenInfo />
      <StatusBar barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'} />
    </LinearGradient>
    //<EditScreenInfo path="app/EditScreenInfo.tsx" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 25,
  },
  separator: {
    height: 2,
    width: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginVertical: 35,
    borderRadius: 5,
  },
});