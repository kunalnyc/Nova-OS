import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Search,
  MapPin,
  RefreshCw
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  uvIndex: number;
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

export const WeatherApp = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("London");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load default weather for London
    fetchWeatherData("London");
  }, []);

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Using wttr.in API which provides weather data in JSON format without API key
      const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      
      if (!response.ok) {
        throw new Error('City not found or weather service unavailable');
      }
      
      const data = await response.json();
      
      if (!data.current_condition || !data.weather) {
        throw new Error('Invalid weather data received');
      }

      const current = data.current_condition[0];
      const location = data.nearest_area?.[0] || { areaName: [{ value: city }] };
      
      const weatherData: WeatherData = {
        location: `${location.areaName[0].value}${location.country ? `, ${location.country[0].value}` : ''}`,
        temperature: parseInt(current.temp_C),
        condition: current.weatherDesc[0].value,
        humidity: parseInt(current.humidity),
        windSpeed: parseInt(current.windspeedKmph),
        visibility: parseInt(current.visibility),
        feelsLike: parseInt(current.FeelsLikeC),
        uvIndex: parseInt(current.uvIndex || '0'),
        forecast: data.weather.slice(0, 5).map((day: any, index: number) => {
          const date = new Date();
          date.setDate(date.getDate() + index);
          
          return {
            date: date.toISOString().split('T')[0],
            day: index === 0 ? 'Today' : 
                 index === 1 ? 'Tomorrow' : 
                 date.toLocaleDateString([], { weekday: 'short' }),
            high: parseInt(day.maxtempC),
            low: parseInt(day.mintempC),
            condition: day.hourly[4]?.weatherDesc?.[0]?.value || 'Clear',
            icon: day.hourly[4]?.weatherCode || '113'
          };
        })
      };
      
      setWeather(weatherData);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, any> = {
      "Sunny": Sun,
      "Partly Cloudy": Cloud,
      "Cloudy": Cloud,
      "Rainy": CloudRain,
      "Drizzle": CloudDrizzle,
      "Snow": CloudSnow,
    };
    return icons[condition] || Cloud;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await fetchWeatherData(searchQuery.trim());
  };

  const handleRefresh = () => {
    if (searchQuery) {
      fetchWeatherData(searchQuery);
    }
  };

  if (!weather && !loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Cloud className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No weather data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface/20 p-4">
      {/* Search Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 glass border-glass-border bg-transparent"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading} size="sm">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 glass-strong rounded-lg border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading weather...</p>
          </div>
        </div>
      ) : weather ? (
        <div className="flex-1 space-y-4">
          {/* Current Weather Card */}
          <Card className="glass border-glass-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{weather.location}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date().toLocaleDateString([], { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">{weather.temperature}°</div>
                  <div className="text-sm text-muted-foreground">{weather.condition}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                {(() => {
                  const IconComponent = getWeatherIcon(weather.condition);
                  return <IconComponent className="w-20 h-20 text-primary" />;
                })()}
              </div>
              
              {/* Weather Details */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center glass-strong rounded-lg p-3">
                  <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Humidity</div>
                  <div className="font-semibold text-sm">{weather.humidity}%</div>
                </div>
                <div className="text-center glass-strong rounded-lg p-3">
                  <Wind className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Wind</div>
                  <div className="font-semibold text-sm">{weather.windSpeed} km/h</div>
                </div>
                <div className="text-center glass-strong rounded-lg p-3">
                  <Eye className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Visibility</div>
                  <div className="font-semibold text-sm">{weather.visibility} km</div>
                </div>
                <div className="text-center glass-strong rounded-lg p-3">
                  <Thermometer className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Feels Like</div>
                  <div className="font-semibold text-sm">{weather.feelsLike}°</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          <Card className="glass border-glass-border">
            <CardHeader>
              <CardTitle className="text-lg">5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weather.forecast.map((day, index) => {
                  const IconComponent = getWeatherIcon(day.condition);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 glass-strong rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <span className="font-medium">{day.day}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">{day.condition}</span>
                        <div className="text-right">
                          <span className="font-semibold">{day.high}°</span>
                          <span className="text-muted-foreground ml-1">{day.low}°</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};