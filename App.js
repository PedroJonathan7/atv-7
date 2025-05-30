import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  StatusBar,
} from 'react-native';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState('Recife,PE');
  const [city, setCity] = useState('Recife,PE');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const API_KEY = '07487589';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      setWeather(null);

      const apiUrl = `https://api.hgbrasil.com/weather?key=${API_KEY}&city_name=${encodeURIComponent(
        cityName
      )}`;

      const response = await fetch(proxyUrl + apiUrl);
      if (!response.ok) throw new Error('Erro na resposta da API');

      const json = await response.json();
      if (json.results) {
        setWeather(json.results);
      } else {
        throw new Error('Cidade não encontrada');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (cityInput.trim() === '') {
      Alert.alert('Aviso', 'Digite uma cidade válida.');
      return;
    }
    Keyboard.dismiss();
    setCity(cityInput.trim());
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const colors = isDarkTheme
    ? {
        background: '#1E1E2F',
        card: '#2C2C3E',
        text: '#FFFFFF',
        subtext: '#AAAAAA',
        accent: '#007AFF',
        temp: '#FFD700',
        border: '#444',
      }
    : {
        background: '#F2F2F2',
        card: '#FFFFFF',
        text: '#000000',
        subtext: '#444444',
        accent: '#007AFF',
        temp: '#DAA520',
        border: '#CCCCCC',
      };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 40,
      backgroundColor: colors.background,
      minHeight: '100%',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      marginBottom: 25,
    },
    input: {
      flex: 1,
      height: 45,
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 15,
      color: colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      marginLeft: 10,
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    toggleButton: {
      alignSelf: 'flex-end',
      marginBottom: 15,
      backgroundColor: colors.accent,
      padding: 8,
      borderRadius: 6,
    },
    toggleText: {
      color: '#fff',
      fontSize: 14,
    },
    center: {
      alignItems: 'center',
    },
    errorText: {
      color: '#FF5C5C',
      fontSize: 16,
    },
    weatherContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
    },
    cityName: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    temperature: {
      fontSize: 64,
      fontWeight: 'bold',
      color: colors.temp,
      textAlign: 'center',
      marginBottom: 5,
    },
    description: {
      fontSize: 18,
      fontStyle: 'italic',
      color: colors.subtext,
      marginBottom: 15,
      textAlign: 'center',
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    detail: {
      color: colors.subtext,
      fontSize: 14,
    },
    forecastItem: {
      marginTop: 15,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    forecastDate: {
      fontWeight: '600',
      color: colors.text,
      fontSize: 16,
    },
    forecastDesc: {
      color: colors.subtext,
      fontSize: 14,
      marginVertical: 3,
    },
    forecastTemp: {
      color: colors.text,
      fontSize: 14,
    },
    footer: {
      marginTop: 40,
      textAlign: 'center',
      color: colors.subtext,
      fontSize: 12,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
      <Text style={styles.header}>Previsão do Tempo ☀️--🌙</Text>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
        <Text style={styles.toggleText}>{isDarkTheme ? 'Modo Claro ☀️' : 'Modo Escuro 🌙'}</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite cidade,UF (ex: Salvador,BA)"
          placeholderTextColor={colors.subtext}
          value={cityInput}
          onChangeText={setCityInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="words"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={{ marginTop: 10, color: colors.accent }}>Carregando dados do clima...</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      )}

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>Clima em {weather.city}</Text>
          <Text style={styles.temperature}>{weather.temp}°C</Text>
          <Text style={styles.description}>{weather.description}</Text>

          <View style={styles.detailsRow}>
            <Text style={styles.detail}>Humidade: {weather.humidity}%</Text>
            <Text style={styles.detail}>Vento: {weather.wind_speedy}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detail}>Nascer do sol: {weather.sunrise}</Text>
            <Text style={styles.detail}>Pôr do sol: {weather.sunset}</Text>
          </View>

          <Text style={[styles.cityName, { marginTop: 25, fontSize: 20 }]}>
            Previsão para os próximos dias
          </Text>

          {weather.forecast.map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastDate}>
                {day.date} - {day.weekday}
              </Text>
              <Text style={styles.forecastDesc}>{day.description}</Text>
              <Text style={styles.forecastTemp}>
                Min: {day.min}°C | Max: {day.max}°C
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.footer}>Feito por @jon.xrc e @_duduu.7</Text>
    </ScrollView>
  );
}
