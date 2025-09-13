// ARGO Data API Integration
class ArgoDataAPI {
    constructor() {
        this.baseURL = 'https://marinex1-jl8rbjs94tmzekuawzajhv.streamlit.app';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Enhanced ocean data with more realistic values
    async getOceanData() {
        const cacheKey = 'ocean_data';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // Simulate API call with enhanced data
            const data = await this.fetchArgoData();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.warn('API call failed, using enhanced sample data:', error);
            return this.getEnhancedSampleData();
        }
    }

    async fetchArgoData() {
        // This would be the actual API call to your Streamlit app
        const response = await fetch(`${this.baseURL}/api/argo-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    getEnhancedSampleData() {
        // Enhanced sample data based on the Streamlit app structure
        return [
            {
                id: 1,
                name: "ARGO Float 2902755",
                lat: 15.234,
                lng: 68.456,
                depth: 1847,
                temperature: 28.5,
                pressure: 4.2,
                salinity: 35.2,
                oxygen: 8.3,
                ph: 8.1,
                timestamp: "2024-01-15 14:30:00",
                region: "Arabian Sea",
                status: "Active",
                trajectory: [
                    {lat: 15.234, lng: 68.456, timestamp: "2024-01-15 14:30:00", depth: 0},
                    {lat: 15.245, lng: 68.467, timestamp: "2024-01-15 15:00:00", depth: 50},
                    {lat: 15.256, lng: 68.478, timestamp: "2024-01-15 15:30:00", depth: 100},
                    {lat: 15.267, lng: 68.489, timestamp: "2024-01-15 16:00:00", depth: 200},
                    {lat: 15.278, lng: 68.500, timestamp: "2024-01-15 16:30:00", depth: 500}
                ]
            },
            {
                id: 2,
                name: "ARGO Float 2902756",
                lat: 12.891,
                lng: 72.123,
                depth: 1923,
                temperature: 29.1,
                pressure: 3.8,
                salinity: 34.8,
                oxygen: 7.9,
                ph: 8.0,
                timestamp: "2024-01-15 14:25:00",
                region: "Arabian Sea",
                status: "Active",
                trajectory: [
                    {lat: 12.891, lng: 72.123, timestamp: "2024-01-15 14:25:00", depth: 0},
                    {lat: 12.902, lng: 72.134, timestamp: "2024-01-15 14:55:00", depth: 75},
                    {lat: 12.913, lng: 72.145, timestamp: "2024-01-15 15:25:00", depth: 150},
                    {lat: 12.924, lng: 72.156, timestamp: "2024-01-15 15:55:00", depth: 300},
                    {lat: 12.935, lng: 72.167, timestamp: "2024-01-15 16:25:00", depth: 600}
                ]
            },
            {
                id: 3,
                name: "ARGO Float 2902757",
                lat: 8.567,
                lng: 76.789,
                depth: 1756,
                temperature: 30.2,
                pressure: 4.8,
                salinity: 34.5,
                oxygen: 8.7,
                ph: 8.2,
                timestamp: "2024-01-15 14:20:00",
                region: "Indian Ocean",
                status: "Active",
                trajectory: [
                    {lat: 8.567, lng: 76.789, timestamp: "2024-01-15 14:20:00", depth: 0},
                    {lat: 8.578, lng: 76.800, timestamp: "2024-01-15 14:50:00", depth: 60},
                    {lat: 8.589, lng: 76.811, timestamp: "2024-01-15 15:20:00", depth: 120},
                    {lat: 8.600, lng: 76.822, timestamp: "2024-01-15 15:50:00", depth: 250},
                    {lat: 8.611, lng: 76.833, timestamp: "2024-01-15 16:20:00", depth: 500}
                ]
            },
            {
                id: 4,
                name: "ARGO Float 2902758",
                lat: 18.234,
                lng: 84.567,
                depth: 1998,
                temperature: 27.8,
                pressure: 5.5,
                salinity: 35.6,
                oxygen: 9.1,
                ph: 8.3,
                timestamp: "2024-01-15 14:15:00",
                region: "Bay of Bengal",
                status: "Active",
                trajectory: [
                    {lat: 18.234, lng: 84.567, timestamp: "2024-01-15 14:15:00", depth: 0},
                    {lat: 18.245, lng: 84.578, timestamp: "2024-01-15 14:45:00", depth: 80},
                    {lat: 18.256, lng: 84.589, timestamp: "2024-01-15 15:15:00", depth: 160},
                    {lat: 18.267, lng: 84.600, timestamp: "2024-01-15 15:45:00", depth: 320},
                    {lat: 18.278, lng: 84.611, timestamp: "2024-01-15 16:15:00", depth: 650}
                ]
            },
            {
                id: 5,
                name: "ARGO Float 2902759",
                lat: 5.789,
                lng: 80.123,
                depth: 1678,
                temperature: 31.1,
                pressure: 3.2,
                salinity: 34.2,
                oxygen: 7.5,
                ph: 8.1,
                timestamp: "2024-01-15 14:10:00",
                region: "Indian Ocean",
                status: "Active",
                trajectory: [
                    {lat: 5.789, lng: 80.123, timestamp: "2024-01-15 14:10:00", depth: 0},
                    {lat: 5.800, lng: 80.134, timestamp: "2024-01-15 14:40:00", depth: 70},
                    {lat: 5.811, lng: 80.145, timestamp: "2024-01-15 15:10:00", depth: 140},
                    {lat: 5.822, lng: 80.156, timestamp: "2024-01-15 15:40:00", depth: 280},
                    {lat: 5.833, lng: 80.167, timestamp: "2024-01-15 16:10:00", depth: 560}
                ]
            },
            {
                id: 6,
                name: "ARGO Float 2902760",
                lat: 22.456,
                lng: 88.789,
                depth: 2034,
                temperature: 26.5,
                pressure: 3.9,
                salinity: 35.9,
                oxygen: 8.1,
                ph: 8.0,
                timestamp: "2024-01-15 14:05:00",
                region: "Bay of Bengal",
                status: "Active",
                trajectory: [
                    {lat: 22.456, lng: 88.789, timestamp: "2024-01-15 14:05:00", depth: 0},
                    {lat: 22.467, lng: 88.800, timestamp: "2024-01-15 14:35:00", depth: 90},
                    {lat: 22.478, lng: 88.811, timestamp: "2024-01-15 15:05:00", depth: 180},
                    {lat: 22.489, lng: 88.822, timestamp: "2024-01-15 15:35:00", depth: 360},
                    {lat: 22.500, lng: 88.833, timestamp: "2024-01-15 16:05:00", depth: 720}
                ]
            },
            {
                id: 7,
                name: "ARGO Float 2902761",
                lat: 13.678,
                lng: 65.234,
                depth: 1845,
                temperature: 28.9,
                pressure: 4.1,
                salinity: 35.1,
                oxygen: 8.2,
                ph: 8.1,
                timestamp: "2024-01-15 14:00:00",
                region: "Arabian Sea",
                status: "Active",
                trajectory: [
                    {lat: 13.678, lng: 65.234, timestamp: "2024-01-15 14:00:00", depth: 0},
                    {lat: 13.689, lng: 65.245, timestamp: "2024-01-15 14:30:00", depth: 65},
                    {lat: 13.700, lng: 65.256, timestamp: "2024-01-15 15:00:00", depth: 130},
                    {lat: 13.711, lng: 65.267, timestamp: "2024-01-15 15:30:00", depth: 260},
                    {lat: 13.722, lng: 65.278, timestamp: "2024-01-15 16:00:00", depth: 520}
                ]
            },
            {
                id: 8,
                name: "ARGO Float 2902762",
                lat: 9.345,
                lng: 79.567,
                depth: 1712,
                temperature: 29.8,
                pressure: 3.6,
                salinity: 34.6,
                oxygen: 7.8,
                ph: 8.0,
                timestamp: "2024-01-15 13:55:00",
                region: "Indian Ocean",
                status: "Active",
                trajectory: [
                    {lat: 9.345, lng: 79.567, timestamp: "2024-01-15 13:55:00", depth: 0},
                    {lat: 9.356, lng: 79.578, timestamp: "2024-01-15 14:25:00", depth: 55},
                    {lat: 9.367, lng: 79.589, timestamp: "2024-01-15 14:55:00", depth: 110},
                    {lat: 9.378, lng: 79.600, timestamp: "2024-01-15 15:25:00", depth: 220},
                    {lat: 9.389, lng: 79.611, timestamp: "2024-01-15 15:55:00", depth: 440}
                ]
            }
        ];
    }

    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Get data by region
    async getDataByRegion(region) {
        const allData = await this.getOceanData();
        return allData.filter(item => item.region === region);
    }

    // Get data by temperature range
    async getDataByTemperature(minTemp, maxTemp) {
        const allData = await this.getOceanData();
        return allData.filter(item => 
            item.temperature >= minTemp && item.temperature <= maxTemp
        );
    }

    // Get data by depth range
    async getDataByDepth(minDepth, maxDepth) {
        const allData = await this.getOceanData();
        return allData.filter(item => 
            item.depth >= minDepth && item.depth <= maxDepth
        );
    }

    // Get nearest floats to a location
    async getNearestFloats(lat, lng, radius = 1000) {
        const allData = await this.getOceanData();
        return allData.filter(item => {
            const distance = this.calculateDistance(lat, lng, item.lat, item.lng);
            return distance <= radius;
        }).sort((a, b) => {
            const distA = this.calculateDistance(lat, lng, a.lat, a.lng);
            const distB = this.calculateDistance(lat, lng, b.lat, b.lng);
            return distA - distB;
        });
    }

    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Get statistics
    async getStatistics() {
        const allData = await this.getOceanData();
        const temperatures = allData.map(item => item.temperature);
        const salinities = allData.map(item => item.salinity);
        const depths = allData.map(item => item.depth);

        return {
            totalFloats: allData.length,
            activeFloats: allData.filter(item => item.status === 'Active').length,
            avgTemperature: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
            minTemperature: Math.min(...temperatures),
            maxTemperature: Math.max(...temperatures),
            avgSalinity: salinities.reduce((a, b) => a + b, 0) / salinities.length,
            minSalinity: Math.min(...salinities),
            maxSalinity: Math.max(...salinities),
            avgDepth: depths.reduce((a, b) => a + b, 0) / depths.length,
            maxDepth: Math.max(...depths),
            regions: [...new Set(allData.map(item => item.region))]
        };
    }
}

// Initialize the API
const argoAPI = new ArgoDataAPI();
