import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import 'react-native-get-random-values';

type LocationType = { latitude: number; longitude: number } | null;

export default function App() {
  const [origin, setOrigin] = useState<LocationType>(null);
  const [destination, setDestination] = useState<LocationType>(null);
  const mapRef = useRef<MapView | null>(null);
  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY || "";
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(null);
  const [buttonIndex, setButtonIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  //const [nearbyPlaces, setNearbyPlaces] = useState<any>(); // Almacena lugares cercanos
  const [placeDetails, setPlaceDetails] = useState<any>(null); // Almacena detalles del lugar
  const [placePhotos, setPlacePhotos] = useState<string[]>([]); // Almacena URLs de fotos
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para el indicador de carga
  const [error, setError] = useState<string | null>(null);   // Estado para el mensaje de error
  const searchRef = useRef<any>(null);// Referencia para la barra de búsqueda
  

  const categoriasPermitidas = ['Teatro', 'Cine', 'Plaza', 'Parque', 'Museo', 'Restaurante'];

    // AÑADE placeId a los botones!
    // const buttons = [
    //     { label: "Cines", coordinate: { latitude: 21.880349, longitude: -102.262295 }, placeId: "ChIJN1t_tDeuEmsRUsoyGkmphY0" }, // Ejemplo, usa los IDs correctos
    //     { label: "Teatros", coordinate: { latitude: 21.857557, longitude: -102.291743 }, placeId: "ChIJD7f-S_euEmsR8f-X_sYmks8" },
    //     { label: "Restaurantes", coordinate: { latitude: 21.881457, longitude: -102.297878 }, placeId: "ChIJw-qJ6TeuEmsR5f-X_sYmks8" },
    //     { label: "Parques", coordinate: { latitude: 21.887989, longitude: -102.266078 }, placeId: "ChIJr-9_dDeuEmsR_f-X_sYmks8" },
    //     { label: "Plazas", coordinate: { latitude: 21.923890, longitude: -102.290520 }, placeId: "ChIJ38f-rDeuEmsR-f-X_sYmks8" },
    //     { label: "Museos", coordinate: { latitude: 21.883807, longitude: -102.295527 }, placeId: "ChIJG-lG6TeuEmsR0f-X_sYmks8" },
    // ];

    const buttons = [
        { label: "Cine", type: "movie_theater" },
        { label: "Teatro", type: "theater" },
        { label: "Restaurante", type: "restaurant" },
        { label: "Parque", type: "park" },
        { label: "Plaza", type: "shopping_mall" },
        { label: "Museo", type: "museum" },
    ];
    



    useEffect(() => {
        getLocationPermission();
    }, []);

    // useEffect para reaccionar a cambios en origin
    useEffect(() => {
        if (origin && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: origin.latitude,
                longitude: origin.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        }
    }, [origin]);


    async function getLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setError("Permiso de ubicación denegado");
            return;
        }
        try {
            let location = await Location.getCurrentPositionAsync({});
            setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            setError("No se pudo obtener la ubicación actual."); // Manejo de error si falla getCurrentPositionAsync
        }
    }


    

    // const handleButtonPress = (index: number) => {
    //     setButtonIndex(index);
    //     setDestination(buttons[index].coordinate);
    //     setSelectedPlace(buttons[index]);
    //     setSelectedButtonIndex(index);
    //     if (mapRef.current) {
    //         mapRef.current.animateToRegion({
    //             latitude: buttons[index].coordinate.latitude,
    //             longitude: buttons[index].coordinate.longitude,
    //             latitudeDelta: 0.05,
    //             longitudeDelta: 0.05,
    //         });
    //     }
    // };


    
    
    const buscarLugarMasCercano = async (
        category: string,
        userLocation: { latitude: number; longitude: number }
      ) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.latitude},${userLocation.longitude}&radius=5000&type=${category}&key=${GOOGLE_MAPS_API_KEY}`
          );
      
          const data = await response.json();
      
          if (data.results.length > 0) {
            const lugarMasCercano = data.results[0];
            console.log("Lugar más cercano encontrado:", lugarMasCercano);
      
            return lugarMasCercano;
          } else {
            console.log("No se encontraron lugares cercanos.");
            return null;
          }
        } catch (error) {
          console.error("Error al buscar el lugar más cercano:", error);
          return null;
        }
      };
      
    
      const handleButtonPress = async (categoryIndex: number) => {
        setSelectedButtonIndex(categoryIndex); 
        setButtonIndex(categoryIndex);
        setSelectedPlace(null); 
        setError(null); 
    
        const category = buttons[categoryIndex].type; 
    
        if (origin) {
            try {
                const place = await buscarLugarMasCercano(category, origin);
                if (place) {
                    const newDestination = {
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                    };
                    setDestination(newDestination);
                    setSelectedPlace(place); 
                    
                    if (mapRef.current) {
                        mapRef.current.animateToRegion({
                            ...newDestination,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        });
                    }
    
                    // Obtener detalles del lugar
                    if (place.place_id) {
                        await getPlaceDetailsAndPhotos(place.place_id);
                    }
                } else {
                    setError("No se encontraron lugares cercanos.");
                }
            } catch (err) {
                setError("Error al buscar lugares.");
            }
        } else {
            setError("Ubicación del usuario no disponible.");
        }
    };
    
    
    








    const clearSearch = () => {
        setDestination(null);
        setSelectedPlace(null);
        setSelectedButtonIndex(null);
        setPlaceDetails(null);
        setPlacePhotos([]);
        if (searchRef.current) {
            searchRef.current.clear();
        }
        //Centrar el mapa en el origen despues de limpiar
        if (mapRef.current && origin) {
               mapRef.current.animateToRegion({
                   latitude: origin.latitude,
                   longitude: origin.longitude,
                   latitudeDelta: 0.1,
                   longitudeDelta: 0.1,
               });
           }
    };

    const getPlaceDetailsAndPhotos = async (placeId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const detailsResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}&language=es`
            );

            if (!detailsResponse.ok) {
                throw new Error(`Error en la red: ${detailsResponse.status}`);
            }

            const detailsData = await detailsResponse.json();

            if (!detailsData.result) {
                setError("No se encontraron detalles del lugar.");
                return; // Importante: Salir de la función si no hay resultados
            }

            setPlaceDetails(detailsData.result);

            if (detailsData.result.photos) {
                const photos = detailsData.result.photos.map((photo: any) =>
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
                );
                setPlacePhotos(photos);
            } else {
                setPlacePhotos([]); // Limpiar fotos si no hay
            }

        } catch (error: any) { // Capturar cualquier error
            console.error("Error al obtener detalles y fotos:", error);
            setError(error.message || "Error al cargar detalles. Intente de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    ref={searchRef}
                    placeholder="Buscar lugares..."
                    onPress={async (data, details = null) => {
                        const location = details?.geometry?.location;
                        if (location) {
                            setDestination({
                                latitude: location.lat,
                                longitude: location.lng,
                            });
                            setSelectedPlace(null);
                            setSelectedButtonIndex(null);
                            setPlaceDetails(null);
                            setPlacePhotos([]);
                            if (mapRef.current) {
                                mapRef.current.animateToRegion({
                                    latitude: location.lat,
                                    longitude: location.lng,
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05,
                                });
                            }

                            if (data.place_id) {
                                await getPlaceDetailsAndPhotos(data.place_id);
                            }
                        }
                    }}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: "es",
                        location: origin ? `${origin.latitude},${origin.longitude}` : undefined,
                        radius: 15000, // Radio de búsqueda en metros
                        types: ['establishment', 'park', 'museum', 'movie_theater', 'theater', 'shopping_mall', 'restaurant', 'tourist_attraction', 'stadium', 'casino'], // Filtra por estos tipos
                        components: 'country:mx', // Opcional: limita a México
                    }}
                    fetchDetails={true}
                    styles={{
                        container: styles.searchBarContainer,
                        textInput: styles.searchInput,
                    }}
                    renderRightButton={() => (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>X</Text>
                        </TouchableOpacity>
                    )}
                />

                <ScrollView
                    horizontal
                    ref={scrollViewRef}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carouselContainer}
                >
                    {buttons.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.carouselButton,
                                { backgroundColor: index === buttonIndex ? "cornflowerblue" : "white" , },
                            ]}
                            onPress={() => handleButtonPress(index)}
                        >
                            <Text style={[styles.buttonText,{ color: index === buttonIndex ? "white" : "black" }, ]}>{button.label}</Text>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </View>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={origin ? {  // Usamos origin SI EXISTE
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                } : { // Valor por defecto
                    latitude: 21.892875,
                    longitude: -102.247621,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {origin && <Marker coordinate={origin} title="Ubicación actual" />}
                
                {destination && <Marker coordinate={destination} title="Destino" />}

                {origin && destination && (
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeWidth={5}
                        strokeColor="blue"
                    />
                )}
                {selectedPlace && (
                    <Marker
                        coordinate={{
                            latitude: selectedPlace.geometry.location.lat,
                            longitude: selectedPlace.geometry.location.lng,
                        }}
                        title={selectedPlace.name}
                        onPress={() => {
                            if (selectedPlace.place_id) {
                                getPlaceDetailsAndPhotos(selectedPlace.place_id);
                            } else {
                                setError("No se encontró el ID del lugar.");
                            }
                        }}
                    />
                )}

            </MapView>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}


             {/* Ventana de información */}
            {placeDetails && (
                <View style={styles.infoWindow}>
                    <Text style={styles.infoTitle}>{placeDetails.name}</Text>

                    {/* ScrollView horizontal para las fotos */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.photoCarousel}
                    >
                        {placePhotos && placePhotos.length > 0 ? (
                            placePhotos.map((photo: string, index: number) => (
                                <Image key={index} source={{ uri: photo }} style={styles.placePhoto} />
                            ))
                        ) : (
                            <Text>No hay fotos disponibles.</Text> // Mensaje si no hay fotos
                        )}
                    </ScrollView>

                    {/* Separador */}
                    <View style={styles.infoSeparator} />

                    {/* Sección de información general */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Información General</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Dirección:</Text>
                            <Text style={styles.infoText}>{placeDetails.formatted_address}</Text>
                        </View>
                    </View>

                    {/* Sección de contacto */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Contacto</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Teléfono:</Text>
                            <Text style={styles.infoText}>{placeDetails.formatted_phone_number}</Text>
                        </View>
                    </View>

                      {/* Mensaje de error (si hay) */}
                     {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity onPress={() => { setPlaceDetails(null); setPlacePhotos([]); setError(null); }}>
                         <Text style={styles.closeButton}>Cerrar</Text>
                     </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    searchContainer: {
        position: "absolute",
        top: 20,
        left: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: "transparent",
        paddingVertical: 10,
        borderRadius: 10,
    },
    searchBarContainer: {
        width: "100%",
        alignSelf: "center",
        zIndex: 2,
        textAlign: "center",
        
    },
    searchInput: {
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    infoWindow: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        backgroundColor: "white",
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    photoCarousel: {
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    closeButton: {
        marginTop: 10,
        color: "blue",
        textAlign: "right",
    },
    carouselContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        marginTop: 10,
    },
    carouselButton: {
        width: 110,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "white",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    clearButton: {
        height: 50,
        backgroundColor: "red",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    clearButtonText: {
        height: 45, // Match the height of the button
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        paddingHorizontal: 5,
        lineHeight: 40, // Match the height of the button
        textAlign: 'center', // Ensure horizontal centering
    },
    placePhoto: {
        width: 300, // Ajusta según sea necesario
        height: 200,
        borderRadius: 8,
        marginRight: 10, // Espacio entre fotos
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    infoSeparator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    infoSection: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3
    },
    infoLabel: {
        fontWeight: '500',
        marginRight: 8,
        width: 80 // Ajusta según el texto más largo
    },
    infoText: {
        flex: 1
    },
});