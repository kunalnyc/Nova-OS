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
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

export const WeatherApp = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mockWeatherData: WeatherData = {
    location: "New York, NY",
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    forecast: [
      { day: "Today", high: 24, low: 18, condition: "Partly Cloudy" },
      { day: "Tomorrow", high: 26, low: 19, condition: "Sunny" },
      { day: "Wednesday", high: 21, low: 15, condition: "Rainy" },
      { day: "Thursday", high: 23, low: 17, condition: "Cloudy" },
      { day: "Friday", high: 25, low: 20, condition: "Sunny" },
    ]
  };

  useEffect(() => {
    // Load default weather
    setWeather(mockWeatherData);
  }, []);

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
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock weather data for different cities
      const mockData = {
        ...mockWeatherData,
        location: searchQuery,
        temperature: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
      };
      
      setWeather(mockData);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (weather) {
      const updatedWeather = {
        ...weather,
        temperature: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
      };
      setWeather(updatedWeather);
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
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center glass-strong rounded-lg p-3">
                  <Droplets className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Humidity</div>
                  <div className="font-semibold">{weather.humidity}%</div>
                </div>
                <div className="text-center glass-strong rounded-lg p-3">
                  <Wind className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Wind</div>
                  <div className="font-semibold">{weather.windSpeed} km/h</div>
                </div>
                <div className="text-center glass-strong rounded-lg p-3">
                  <Eye className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Visibility</div>
                  <div className="font-semibold">{weather.visibility} km</div>
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