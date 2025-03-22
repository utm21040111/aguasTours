import React from 'react';
import { StatusBar, Image, View, Text, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { ExternalLink } from './ExternalLink';

export default function ModalScreen() {
  return (
    <LinearGradient colors={['#191970', '#191970']} style={styles.container}>
      {/* Contenido de EditScreenInfo adaptado */}
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>
          AguasTours es una aplicación que muestra puntos de interés y recomendaciones locales en Aguascalientes,
          con funcionalidad básica como mapas, descripciones e imágenes.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink style={styles.helpLink} href="https://github.com/utm21040111?tab=repositories">
          <Text style={styles.helpLinkText}>
            Presiona aquí para ver más de mi trabajo
          </Text>
        </ExternalLink>
      </View>

      <StatusBar barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'} />
    </LinearGradient>
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
  getStartedContainer: {
    alignItems: 'stretch',
    marginHorizontal: 50,
    marginTop: 20,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF', // Texto blanco para contraste
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra para mejor legibilidad
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
    color: '#FFFFFF', // Texto blanco para contraste
    fontWeight: '900', // Texto en negrita para énfasis
  },
});