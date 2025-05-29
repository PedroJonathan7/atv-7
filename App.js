import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState("Recife,PE");

  // Configuração do axios para a API HG Brasil
  const api = axios.create({
    baseURL: "https://api.hgbrasil.com",
    params: {
      key: "07487589", // Sua chave de API
    },
    timeout: 5000,
  });

  const fetchWeatherData = async (cityName = city) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/weather", {
        params: {
          city_name: cityName,
        },
      });

      if (response.data?.results) {
        setWeatherData(response.data.results);
      } else {
        setError("Dados meteorológicos não disponíveis");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError(`Erro ao carregar dados: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleCityChange = (newCity) => {
    setCity(newCity);
    fetchWeatherData(newCity);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando dados meteorológicos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchWeatherData()}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum dado meteorológico disponível</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.cityName}>{weatherData.city}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>
      </View>

      <View style={styles.currentWeather}>
        <Image
          source={{
            uri: `https://assets.hgbrasil.com/weather/icons/conditions/${weatherData.condition_slug}.png`,
          }}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperature}>{weatherData.temp}°C</Text>
        <Text style={styles.condition}>{weatherData.description}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Sensação Térmica</Text>
          <Text style={styles.detailValue}>
            {weatherData.forecast[0].feels_like}°C
          </Text>
        </View>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Umidade</Text>
          <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
        </View>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Vento</Text>
          <Text style={styles.detailValue}>{weatherData.wind_speedy}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Previsão para os próximos dias</Text>

      <View style={styles.forecastContainer}>
        {weatherData.forecast.slice(0, 5).map((day, index) => (
          <View key={index} style={styles.forecastDay}>
            <Text style={styles.forecastWeekday}>
              {index === 0 ? "Hoje" : day.weekday}
            </Text>
            <Image
              source={{
                uri: `https://assets.hgbrasil.com/weather/icons/conditions/${day.condition}.png`,
              }}
              style={styles.forecastIcon}
            />
            <View style={styles.tempContainer}>
              <Text style={styles.forecastMax}>{day.max}°</Text>
              <Text style={styles.forecastMin}>{day.min}°</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite uma cidade (ex: São Paulo,SP)"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={() => handleCityChange(city)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleCityChange(city)}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  currentWeather: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2c3e50",
    marginVertical: 10,
  },
  condition: {
    fontSize: 20,
    color: "#7f8c8d",
    textTransform: "capitalize",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  forecastContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastDay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  forecastWeekday: {
    fontSize: 16,
    color: "#2c3e50",
    width: 80,
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
  tempContainer: {
    flexDirection: "row",
    width: 80,
    justifyContent: "space-between",
  },
  forecastMax: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
    textAlign: "right",
  },
  forecastMin: {
    fontSize: 16,
    color: "#3498db",
    textAlign: "right",
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#7f8c8d",
  },
  retryButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchButton: {
    backgroundColor: "#3498db",
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WeatherApp;