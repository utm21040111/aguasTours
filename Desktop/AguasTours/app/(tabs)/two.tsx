import React from 'react';
import { StyleSheet, Alert, View, Linking, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  nombreLugar: string;
  direccion: string;
  celular: string;
}

export default function TabTwoScreen() {
  const validationSchema = Yup.object().shape({
    nombreLugar: Yup.string().required('El nombre del lugar es requerido'),
    direccion: Yup.string().required('La dirección es requerida'),
    celular: Yup.string().matches(/^[0-9]+$/, 'El celular debe contener solo números').required('El celular es requerido'),
  });

  const enviarWhatsApp = async (values: FormValues) => {
    const phoneNumber = '4498054066'; // Reemplaza con el número de teléfono del destinatario
    const message = `Nombre del Lugar: ${values.nombreLugar}\nDirección: ${values.direccion}\nCelular: ${values.celular}`;
    const url = Platform.OS === 'android'
    ? `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    : `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url)
    .catch((error) => console.log('Error opening WhatsApp: ', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información del Lugar</Text>
      <Formik
        initialValues={{ nombreLugar: '', direccion: '', celular: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => enviarWhatsApp(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <TextInput
              label="Nombre del Lugar"
              onChangeText={handleChange('nombreLugar')}
              onBlur={handleBlur('nombreLugar')}
              value={values.nombreLugar}
              error={touched.nombreLugar && !!errors.nombreLugar}
            />
            {touched.nombreLugar && errors.nombreLugar && <Text style={styles.errorText}>{errors.nombreLugar}</Text>}

            <TextInput
              label="Dirección"
              onChangeText={handleChange('direccion')}
              onBlur={handleBlur('direccion')}
              value={values.direccion}
              error={touched.direccion && !!errors.direccion}
            />
            {touched.direccion && errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}

            <TextInput
              label="Celular"
              onChangeText={handleChange('celular')}
              onBlur={handleBlur('celular')}
              value={values.celular}
              keyboardType="phone-pad"
              error={touched.celular && !!errors.celular}
            />
            {touched.celular && errors.celular && <Text style={styles.errorText}>{errors.celular}</Text>}

            <Button mode="contained" onPress={()=>{handleSubmit()}} style={styles.button} buttonColor="#25D366" // Color verde WhatsApp
              textColor="white">
              Enviar WhatsApp
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});