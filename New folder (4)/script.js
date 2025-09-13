// Underwater Ocean Dashboard JavaScript

// Interactive Map Variables

// Ocean Data - Will be loaded from API
let oceanData = [];

// Chart data and animations
const chartData = {
    temperature: {
        values: [18.2, 18.3, 18.4, 18.5, 18.6, 18.5, 18.4, 18.3, 18.2, 18.1, 18.0, 18.2, 18.4, 18.5, 18.6, 18.5],
        color: '#ff6b6b',
        label: 'Temperature (°C)'
    },
    pressure: {
        values: [4.2, 4.3, 4.4, 4.5, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 4.2, 4.4, 4.5, 4.6, 4.5],
        color: '#4ecdc4',
        label: 'Pressure (atm)'
    },
    salinity: {
        values: [34.8, 35.0, 35.1, 35.2, 35.3, 35.2, 35.1, 35.0, 34.9, 34.8, 34.7, 34.9, 35.1, 35.2, 35.3, 35.2],
        color: '#45b7d1',
        label: 'Salinity (ppt)'
    },
    oxygen: {
        values: [7.8, 8.0, 8.1, 8.2, 8.3, 8.2, 8.1, 8.0, 7.9, 7.8, 7.7, 7.9, 8.1, 8.2, 8.3, 8.2],
        color: '#96ceb4',
        label: 'Oxygen (mg/L)'
    }
};

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Load data from API first
    await loadOceanData();
    
    initializeCharts();
    initializeChatbot();
    initializeDataSelection();
    initializeEarthGlobe();
    startDataUpdates();
});

// Load ocean data from API
async function loadOceanData() {
    try {
        oceanData = await argoAPI.getOceanData();
        console.log('Loaded ocean data:', oceanData.length, 'floats');
        
        // Update statistics display
        updateStatistics();
        
        // Update chart data with real data
        updateChartDataWithRealData();
        
    } catch (error) {
        console.error('Failed to load ocean data:', error);
        // Fallback to empty array - the API will provide sample data
        oceanData = [];
    }
}

// Update statistics display
async function updateStatistics() {
    try {
        const stats = await argoAPI.getStatistics();
        
        // Update the marine stats section
        const statsContainer = document.querySelector('.stats-grid');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-satellite"></i>
                    </div>
                    <div class="stat-info">
                        <h4>ARGO Floats</h4>
                        <div class="stat-value">${stats.totalFloats}</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-thermometer-half"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Avg Temperature</h4>
                        <div class="stat-value">${stats.avgTemperature.toFixed(1)}°C</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-tint"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Avg Salinity</h4>
                        <div class="stat-value">${stats.avgSalinity.toFixed(1)} PSU</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Max Depth</h4>
                        <div class="stat-value">${stats.maxDepth}m</div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to update statistics:', error);
    }
}

// Update chart data with real ocean data
function updateChartDataWithRealData() {
    if (oceanData.length === 0) return;
    
    // Get temperature data from ocean floats
    const temperatures = oceanData.map(item => item.temperature).filter(t => t != null);
    const salinities = oceanData.map(item => item.salinity).filter(s => s != null);
    const pressures = oceanData.map(item => item.pressure).filter(p => p != null);
    const oxygenLevels = oceanData.map(item => item.oxygen).filter(o => o != null);
    
    if (temperatures.length > 0) {
        chartData.temperature.values = temperatures.slice(-16); // Last 16 values
    }
    if (salinities.length > 0) {
        chartData.salinity.values = salinities.slice(-16);
    }
    if (pressures.length > 0) {
        chartData.pressure.values = pressures.slice(-16);
    }
    if (oxygenLevels.length > 0) {
        chartData.oxygen.values = oxygenLevels.slice(-16);
    }
}

// Chart initialization
function initializeCharts() {
    const charts = ['tempCanvas', 'pressureCanvas', 'salinityCanvas', 'oxygenCanvas'];
    const chartTypes = ['temperature', 'pressure', 'salinity', 'oxygen'];
    
    charts.forEach((canvasId, index) => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            drawChart(canvas, chartTypes[index]);
        }
    });
}

// Draw individual chart
function drawChart(canvas, dataType) {
    const ctx = canvas.getContext('2d');
    const data = chartData[dataType];
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up chart area
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = padding + (chartWidth / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Draw data line
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const stepX = chartWidth / (data.values.length - 1);
    const minValue = Math.min(...data.values);
    const maxValue = Math.max(...data.values);
    const valueRange = maxValue - minValue;
    
    data.values.forEach((value, index) => {
        const x = padding + (stepX * index);
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = data.color;
    data.values.forEach((value, index) => {
        const x = padding + (stepX * index);
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Chatbot functionality
function initializeChatbot() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = generateBotResponse(message);
                addBotMessage(botResponse);
            }, 1000);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Add user message to chat
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add bot message to chat
function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate bot response
function generateBotResponse(userMessage) {
    const responses = {
        temperature: "The water temperature is currently 18.5°C, which is within the normal range for this depth. Temperature affects marine life metabolism and oxygen levels.",
        pressure: "Water pressure at 45m depth is 4.5 atmospheres. This pressure affects fish buoyancy and can impact their swim bladder function.",
        salinity: "Salinity levels are at 35.2 ppt (parts per thousand), which is typical for ocean water. This affects the density and buoyancy of marine organisms.",
        oxygen: "Dissolved oxygen levels are 8.2 mg/L, which is healthy for marine life. Oxygen levels decrease with depth and temperature increases.",
        fish: "I can see 247 fish in the monitoring area. The most common species include clownfish, angelfish, and various reef fish. They're attracted to the coral structures.",
        coral: "The coral reef is thriving with multiple species including brain coral, staghorn coral, and soft corals. They provide essential habitat for marine life.",
        jellyfish: "Jellyfish are present in the area. They're important for the ecosystem as they help control plankton populations and serve as food for larger marine animals.",
        seaweed: "Seaweed and marine plants are abundant, providing oxygen and serving as nursery grounds for juvenile fish. They also help stabilize the ocean floor.",
        visibility: "Current visibility is 15.2 meters, which is excellent for marine life observation. Clear water indicates good water quality and low sediment levels.",
        current: "Ocean current speed is 0.8 m/s, creating gentle water movement that helps distribute nutrients and oxygen throughout the reef ecosystem."
    };
    
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (message.includes(key)) {
            return response;
        }
    }
    
    // Default responses
    const defaultResponses = [
        "That's an interesting question about marine life! The underwater ecosystem is complex and fascinating. Could you be more specific about what you'd like to know?",
        "The ocean is full of mysteries! I can help explain ocean data, marine life behavior, or underwater phenomena. What would you like to explore?",
        "Great question! The marine environment is constantly changing. I can provide insights about the current ocean conditions and marine life in this area.",
        "The underwater world is amazing! I can help you understand how different factors like temperature, pressure, and salinity affect marine ecosystems.",
        "Fascinating! The ocean is a dynamic environment. I can explain how the data we're monitoring relates to marine life and ocean health."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Update data periodically
function startDataUpdates() {
    setInterval(() => {
        updateChartData();
        updateDisplayValues();
    }, 5000); // Update every 5 seconds
}

// Update chart data with slight variations
function updateChartData() {
    Object.keys(chartData).forEach(key => {
        const data = chartData[key];
        // Remove first value and add new random value
        data.values.shift();
        const lastValue = data.values[data.values.length - 1];
        const variation = (Math.random() - 0.5) * 0.2; // Small random variation
        data.values.push(Math.max(0, lastValue + variation));
    });
    
    // Redraw all charts
    initializeCharts();
}

// Update display values
function updateDisplayValues() {
    const valueElements = {
        'temperature': document.querySelector('.chart-container:nth-child(1) .chart-value'),
        'pressure': document.querySelector('.chart-container:nth-child(2) .chart-value'),
        'salinity': document.querySelector('.chart-container:nth-child(3) .chart-value'),
        'oxygen': document.querySelector('.chart-container:nth-child(4) .chart-value')
    };
    
    Object.keys(valueElements).forEach(key => {
        const element = valueElements[key];
        if (element) {
            const currentValue = chartData[key].values[chartData[key].values.length - 1];
            const unit = key === 'temperature' ? '°C' : 
                        key === 'pressure' ? ' atm' : 
                        key === 'salinity' ? ' ppt' : ' mg/L';
            element.textContent = currentValue.toFixed(1) + unit;
        }
    });
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to marine life
    const marineElements = document.querySelectorAll('.fish, .jellyfish, .starfish');
    marineElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add click effects to bubbles
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        bubble.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(2)';
            this.style.opacity = '0';
            setTimeout(() => {
                this.style.animation = '';
                this.style.transform = '';
                this.style.opacity = '';
            }, 500);
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'C' to focus chat input
    if (e.key === 'c' || e.key === 'C') {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.focus();
        }
    }
    
    // Press 'R' to refresh data
    if (e.key === 'r' || e.key === 'R') {
        updateChartData();
        updateDisplayValues();
    }
});

// Add some ambient sound effects (optional)
function playAmbientSound() {
    // This would require audio files and more complex implementation
    // For now, we'll just add a visual indicator
    console.log('Ambient ocean sounds would play here');
}

// Initialize ambient effects
document.addEventListener('DOMContentLoaded', function() {
    // Add some random particle effects
    setInterval(() => {
        createRandomParticle();
    }, 2000);
});

function createRandomParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
    particle.style.animationDelay = '0s';
    
    document.querySelector('.particle-container').appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 15000);
}

// Data Selection Interface Functions
function initializeDataSelection() {
    // Set default date values
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    document.getElementById('startDate').value = oneYearAgo.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
    
    // Initialize event listeners
    initializeDataSelectionEvents();
}

function initializeDataSelectionEvents() {
    // Time preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const days = parseInt(this.dataset.days);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
            
            document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
            document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
        });
    });
    
    // Region selector
    document.getElementById('regionSelect').addEventListener('change', function() {
        const customBounds = document.getElementById('customBounds');
        if (this.value === 'custom') {
            customBounds.style.display = 'block';
        } else {
            customBounds.style.display = 'none';
            setRegionBounds(this.value);
        }
    });
    
    // Action buttons
    document.getElementById('previewData').addEventListener('click', previewSelectedData);
    document.getElementById('searchData').addEventListener('click', searchSelectedData);
    document.getElementById('downloadData').addEventListener('click', showDownloadPanel);
    document.getElementById('resetSelection').addEventListener('click', resetDataSelection);
    
    // Close buttons
    document.getElementById('closePreview').addEventListener('click', () => {
        document.getElementById('dataPreviewPanel').style.display = 'none';
    });
    
    document.getElementById('closeDownload').addEventListener('click', () => {
        document.getElementById('downloadPanel').style.display = 'none';
    });
    
    // Download confirmation
    document.getElementById('confirmDownload').addEventListener('click', confirmDownload);
}

function setRegionBounds(region) {
    const bounds = {
        'global': { north: 90, south: -90, west: -180, east: 180 },
        'atlantic': { north: 70, south: 0, west: -80, east: 20 },
        'pacific': { north: 60, south: 0, west: 120, east: -120 },
        'indian': { north: 30, south: -60, west: 20, east: 120 },
        'mediterranean': { north: 45, south: 30, west: -6, east: 36 },
        'arctic': { north: 90, south: 60, west: -180, east: 180 },
        'southern': { north: -30, south: -90, west: -180, east: 180 }
    };
    
    if (bounds[region]) {
        document.getElementById('northLat').value = bounds[region].north;
        document.getElementById('southLat').value = bounds[region].south;
        document.getElementById('westLon').value = bounds[region].west;
        document.getElementById('eastLon').value = bounds[region].east;
    }
}

function getSelectionCriteria() {
    const criteria = {
        parameters: {
            temperature: document.getElementById('temp').checked,
            salinity: document.getElementById('salinity').checked,
            pressure: document.getElementById('pressure').checked,
            density: document.getElementById('density').checked,
            oxygen: document.getElementById('oxygen').checked,
            ph: document.getElementById('ph').checked,
            nitrate: document.getElementById('nitrate').checked,
            chlorophyll: document.getElementById('chlorophyll').checked
        },
        timeRange: {
            start: document.getElementById('startDate').value,
            end: document.getElementById('endDate').value
        },
        geographic: {
            region: document.getElementById('regionSelect').value,
            bounds: {
                north: parseFloat(document.getElementById('northLat').value),
                south: parseFloat(document.getElementById('southLat').value),
                west: parseFloat(document.getElementById('westLon').value),
                east: parseFloat(document.getElementById('eastLon').value)
            }
        },
        quality: document.querySelector('input[name="quality"]:checked').value,
        mission: {
            core: document.getElementById('core').checked,
            bgc: document.getElementById('bgc').checked,
            deep: document.getElementById('deep').checked
        },
        float: {
            id: document.getElementById('floatId').value,
            minDepth: parseFloat(document.getElementById('minDepth').value),
            maxDepth: parseFloat(document.getElementById('maxDepth').value)
        }
    };
    
    return criteria;
}

async function previewSelectedData() {
    const criteria = getSelectionCriteria();
    const previewPanel = document.getElementById('dataPreviewPanel');
    
    try {
        // Show loading state
        previewPanel.style.display = 'block';
        document.getElementById('totalProfiles').textContent = 'Loading...';
        document.getElementById('totalFloats').textContent = 'Loading...';
        document.getElementById('totalPoints').textContent = 'Loading...';
        document.getElementById('dateRange').textContent = 'Loading...';
        
        // Simulate API call (replace with actual Euro-Argo API)
        const previewData = await simulateDataPreview(criteria);
        
        // Update statistics
        document.getElementById('totalProfiles').textContent = previewData.totalProfiles;
        document.getElementById('totalFloats').textContent = previewData.totalFloats;
        document.getElementById('totalPoints').textContent = previewData.totalPoints;
        document.getElementById('dateRange').textContent = previewData.dateRange;
        
        // Update preview chart
        updatePreviewChart(previewData.chartData);
        
        // Update preview table
        updatePreviewTable(previewData.sampleData);
        
    } catch (error) {
        console.error('Preview error:', error);
        alert('Error loading data preview. Please try again.');
    }
}

async function searchSelectedData() {
    const criteria = getSelectionCriteria();
    
    try {
        // Show loading state
        const searchBtn = document.getElementById('searchData');
        const originalText = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchBtn.disabled = true;
        
        // Simulate API call (replace with actual Euro-Argo API)
        const searchResults = await simulateDataSearch(criteria);
        
        // Update ocean data with search results
        oceanData = searchResults;
        
        // Update charts with new data
        updateChartDataWithRealData();
        
        // Enable download button
        document.getElementById('downloadData').disabled = false;
        
        // Show success message
        showNotification('Data search completed successfully!', 'success');
        
        // Reset button
        searchBtn.innerHTML = originalText;
        searchBtn.disabled = false;
        
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Error searching data. Please try again.', 'error');
        
        // Reset button
        const searchBtn = document.getElementById('searchData');
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search Data';
        searchBtn.disabled = false;
    }
}

function showDownloadPanel() {
    document.getElementById('downloadPanel').style.display = 'block';
}

function resetDataSelection() {
    // Reset all form elements to default values
    document.getElementById('temp').checked = true;
    document.getElementById('salinity').checked = true;
    document.getElementById('pressure').checked = true;
    document.getElementById('density').checked = false;
    document.getElementById('oxygen').checked = false;
    document.getElementById('ph').checked = false;
    document.getElementById('nitrate').checked = false;
    document.getElementById('chlorophyll').checked = false;
    
    // Reset dates
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    document.getElementById('startDate').value = oneYearAgo.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
    
    // Reset region
    document.getElementById('regionSelect').value = 'global';
    document.getElementById('customBounds').style.display = 'none';
    setRegionBounds('global');
    
    // Reset quality and mission
    document.querySelector('input[name="quality"][value="all"]').checked = true;
    document.getElementById('core').checked = true;
    document.getElementById('bgc').checked = false;
    document.getElementById('deep').checked = false;
    
    // Reset float selection
    document.getElementById('floatId').value = '';
    document.getElementById('minDepth').value = '0';
    document.getElementById('maxDepth').value = '2000';
    
    // Hide panels
    document.getElementById('dataPreviewPanel').style.display = 'none';
    document.getElementById('downloadPanel').style.display = 'none';
    
    // Disable download button
    document.getElementById('downloadData').disabled = true;
    
    showNotification('Selection criteria reset to defaults', 'info');
}

async function confirmDownload() {
    const format = document.querySelector('input[name="format"]:checked').value;
    const progressDiv = document.getElementById('downloadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    try {
        // Show progress
        progressDiv.style.display = 'block';
        progressText.textContent = 'Preparing download...';
        progressFill.style.width = '0%';
        
        // Simulate download progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            progressFill.style.width = i + '%';
            progressText.textContent = `Downloading data... ${i}%`;
        }
        
        // Generate and download file
        const data = generateDownloadData(format);
        downloadFile(data, `ocean_data_${new Date().toISOString().split('T')[0]}.${format}`, format);
        
        progressText.textContent = 'Download completed!';
        showNotification('Data downloaded successfully!', 'success');
        
        // Hide progress after 2 seconds
        setTimeout(() => {
            progressDiv.style.display = 'none';
            document.getElementById('downloadPanel').style.display = 'none';
        }, 2000);
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Error downloading data. Please try again.', 'error');
        progressDiv.style.display = 'none';
    }
}

// Simulation functions (replace with actual Euro-Argo API calls)
async function simulateDataPreview(criteria) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        totalProfiles: Math.floor(Math.random() * 1000) + 100,
        totalFloats: Math.floor(Math.random() * 50) + 10,
        totalPoints: Math.floor(Math.random() * 10000) + 1000,
        dateRange: `${criteria.timeRange.start} to ${criteria.timeRange.end}`,
        chartData: generateSampleChartData(),
        sampleData: generateSampleTableData()
    };
}

async function simulateDataSearch(criteria) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate sample data based on criteria
    return generateSampleOceanData(criteria);
}

function generateSampleChartData() {
    const data = [];
    for (let i = 0; i < 30; i++) {
        data.push({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temperature: 20 + Math.random() * 10,
            salinity: 35 + Math.random() * 2,
            pressure: Math.random() * 1000
        });
    }
    return data;
}

function generateSampleTableData() {
    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            floatId: `2902${Math.floor(Math.random() * 1000)}`,
            date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            latitude: (Math.random() - 0.5) * 180,
            longitude: (Math.random() - 0.5) * 360,
            depth: Math.random() * 2000,
            temperature: (20 + Math.random() * 10).toFixed(2),
            salinity: (35 + Math.random() * 2).toFixed(2)
        });
    }
    return data;
}

function generateSampleOceanData(criteria) {
    const data = [];
    const numFloats = Math.floor(Math.random() * 20) + 5;
    
    for (let i = 0; i < numFloats; i++) {
        const lat = criteria.geographic.bounds.south + Math.random() * (criteria.geographic.bounds.north - criteria.geographic.bounds.south);
        const lng = criteria.geographic.bounds.west + Math.random() * (criteria.geographic.bounds.east - criteria.geographic.bounds.west);
        
        data.push({
            id: i + 1,
            name: `Float ${2902000 + i}`,
            lat: lat,
            lng: lng,
            temperature: (20 + Math.random() * 10).toFixed(1),
            salinity: (35 + Math.random() * 2).toFixed(1),
            pressure: (Math.random() * 10).toFixed(1),
            depth: Math.floor(Math.random() * 2000),
            oxygen: (5 + Math.random() * 3).toFixed(1),
            ph: (7.5 + Math.random() * 0.5).toFixed(2),
            timestamp: new Date().toISOString(),
            region: 'Indian Ocean',
            trajectory: generateTrajectory(lat, lng)
        });
    }
    
    return data;
}

function generateTrajectory(startLat, startLng) {
    const trajectory = [];
    const numPoints = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < numPoints; i++) {
        trajectory.push({
            lat: startLat + (Math.random() - 0.5) * 0.1,
            lng: startLng + (Math.random() - 0.5) * 0.1,
            timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    return trajectory;
}

function updatePreviewChart(chartData) {
    const canvas = document.getElementById('dataPreviewCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simple line chart
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    chartData.forEach((point, index) => {
        const x = padding + (index / (chartData.length - 1)) * chartWidth;
        const y = padding + chartHeight - (point.temperature / 40) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#60a5fa';
    ctx.font = '14px Inter';
    ctx.fillText('Temperature (°C)', 10, 20);
}

function updatePreviewTable(sampleData) {
    const tbody = document.getElementById('previewTableBody');
    tbody.innerHTML = '';
    
    sampleData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.floatId}</td>
            <td>${row.date}</td>
            <td>${row.latitude.toFixed(4)}</td>
            <td>${row.longitude.toFixed(4)}</td>
            <td>${row.depth.toFixed(0)}</td>
            <td>${row.temperature}</td>
            <td>${row.salinity}</td>
        `;
        tbody.appendChild(tr);
    });
}

function generateDownloadData(format) {
    const data = oceanData.map(item => ({
        float_id: item.name,
        latitude: item.lat,
        longitude: item.lng,
        temperature: item.temperature,
        salinity: item.salinity,
        pressure: item.pressure,
        depth: item.depth,
        oxygen: item.oxygen,
        ph: item.ph,
        timestamp: item.timestamp
    }));
    
    switch (format) {
        case 'csv':
            return convertToCSV(data);
        case 'json':
            return JSON.stringify(data, null, 2);
        case 'netcdf':
            return convertToNetCDF(data);
        default:
            return JSON.stringify(data, null, 2);
    }
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    return csvContent;
}

function convertToNetCDF(data) {
    // Simplified NetCDF representation (in real implementation, use proper NetCDF library)
    return `netcdf ocean_data {
dimensions:
    profile = ${data.length} ;
variables:
    float latitude(profile) ;
    float longitude(profile) ;
    float temperature(profile) ;
    float salinity(profile) ;
    float pressure(profile) ;
data:
${data.map((item, i) => `    latitude[${i}] = ${item.latitude} ;`).join('\n')}
${data.map((item, i) => `    longitude[${i}] = ${item.longitude} ;`).join('\n')}
${data.map((item, i) => `    temperature[${i}] = ${item.temperature} ;`).join('\n')}
${data.map((item, i) => `    salinity[${i}] = ${item.salinity} ;`).join('\n')}
${data.map((item, i) => `    pressure[${i}] = ${item.pressure} ;`).join('\n')}
}`;
}

function downloadFile(content, filename, format) {
    const mimeTypes = {
        'csv': 'text/csv',
        'json': 'application/json',
        'netcdf': 'application/x-netcdf'
    };
    
    const blob = new Blob([content], { type: mimeTypes[format] || 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#60a5fa'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 3D Earth Globe Functions
let scene, camera, renderer, controls, earth, dataPoints = [], trajectories = [], raycaster, mouse, selectedPoint = null;
let showDataPoints = true, showTrajectories = false, showHeatmap = false, autoRotate = false;

function initializeEarthGlobe() {
    // Initialize Three.js scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = document.getElementById('earthGlobe');
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.5;
    
    // Set camera position
    camera.position.set(0, 0, 3);
    controls.target.set(0, 0, 0);
    
    // Create Earth
    createEarth();
    
    // Add data points
    addDataPoints();
    
    // Add trajectories
    addTrajectories();
    
    // Initialize event listeners
    initializeGlobeControls();
    
    // Add mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createEarth() {
    // Create Earth geometry
    const geometry = new THREE.SphereGeometry(1, 64, 32);
    
    // Create Earth material with texture
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const bumpTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.02,
        shininess: 1000
    });
    
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    
    // Add atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.02, 64, 32);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x4da6ff,
        transparent: true,
        opacity: 0.1
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add stars
    createStars();
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.8
    });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function addDataPoints() {
    oceanData.forEach((data) => {
        const point = createDataPoint(data);
        dataPoints.push(point);
        if (showDataPoints) {
            scene.add(point);
        }
    });
}

function createDataPoint(data) {
    // Convert lat/lng to 3D coordinates
    const phi = (90 - data.lat) * (Math.PI / 180);
    const theta = (data.lng + 180) * (Math.PI / 180);
    
    const radius = 1.01; // Slightly above Earth surface
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // Create point geometry
    const geometry = new THREE.SphereGeometry(0.02, 8, 8);
    const color = getPointColor(data.temperature);
    const material = new THREE.MeshBasicMaterial({ color: color });
    
    const point = new THREE.Mesh(geometry, material);
    point.position.set(x, y, z);
    point.userData = data;
    
    // Add pulsing animation
    point.scale.set(1, 1, 1);
    
    return point;
}

function getPointColor(temperature) {
    if (temperature < 15) return 0x0066cc; // Cold - Blue
    if (temperature < 20) return 0x4dabf7; // Cool - Light Blue
    if (temperature < 25) return 0x69db7c; // Moderate - Green
    if (temperature < 30) return 0xffd43b; // Warm - Yellow
    return 0xff6b6b; // Hot - Red
}

function addTrajectories() {
    oceanData.forEach((data) => {
        if (data.trajectory && data.trajectory.length > 1) {
            const trajectory = createTrajectory(data.trajectory);
            trajectories.push(trajectory);
            if (showTrajectories) {
                scene.add(trajectory);
            }
        }
    });
}

function createTrajectory(trajectoryData) {
    const points = [];
    
    trajectoryData.forEach(point => {
        const phi = (90 - point.lat) * (Math.PI / 180);
        const theta = (point.lng + 180) * (Math.PI / 180);
        
        const radius = 1.02; // Slightly above Earth surface
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        points.push(new THREE.Vector3(x, y, z));
    });
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.7
    });
    
    return new THREE.Line(geometry, material);
}

function initializeGlobeControls() {
    // Data points toggle
    document.getElementById('toggleDataPoints').addEventListener('click', () => {
        showDataPoints = !showDataPoints;
        dataPoints.forEach(point => {
            if (showDataPoints) {
                scene.add(point);
            } else {
                scene.remove(point);
            }
        });
        document.getElementById('toggleDataPoints').classList.toggle('active', showDataPoints);
    });
    
    // Trajectories toggle
    document.getElementById('toggleTrajectories').addEventListener('click', () => {
        showTrajectories = !showTrajectories;
        trajectories.forEach(trajectory => {
            if (showTrajectories) {
                scene.add(trajectory);
            } else {
                scene.remove(trajectory);
            }
        });
        document.getElementById('toggleTrajectories').classList.toggle('active', showTrajectories);
    });
    
    // Heat map toggle
    document.getElementById('toggleHeatmap').addEventListener('click', () => {
        showHeatmap = !showHeatmap;
        // Heat map implementation would go here
        document.getElementById('toggleHeatmap').classList.toggle('active', showHeatmap);
    });
    
    // Reset view
    document.getElementById('resetGlobeView').addEventListener('click', () => {
        camera.position.set(0, 0, 3);
        controls.target.set(0, 0, 0);
        controls.update();
    });
    
    // Auto rotate toggle
    document.getElementById('toggleAutoRotate').addEventListener('click', () => {
        autoRotate = !autoRotate;
        controls.autoRotate = autoRotate;
        document.getElementById('toggleAutoRotate').classList.toggle('active', autoRotate);
    });
    
    // Close info panel
    document.getElementById('closeGlobeInfo').addEventListener('click', () => {
        document.getElementById('globeInfoPanel').classList.remove('show');
    });
    
    // Mouse click for data point selection
    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
}

function onMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(dataPoints);
    
    if (intersects.length > 0) {
        const selectedData = intersects[0].object.userData;
        showDataInfo(selectedData);
    }
}

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(dataPoints);
    
    if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
    } else {
        renderer.domElement.style.cursor = 'default';
    }
}

function showDataInfo(data) {
    const infoPanel = document.getElementById('globeInfoPanel');
    const infoContent = document.getElementById('globeInfoContent');
    
    infoContent.innerHTML = `
        <h4>${data.name}</h4>
        <div class="data-item">
            <span class="data-label">Location:</span>
            <span class="data-value">${data.lat.toFixed(4)}°, ${data.lng.toFixed(4)}°</span>
        </div>
        <div class="data-item">
            <span class="data-label">Depth:</span>
            <span class="data-value">${data.depth}m</span>
        </div>
        <div class="data-item">
            <span class="data-label">Temperature:</span>
            <span class="data-value">${data.temperature}°C</span>
        </div>
        <div class="data-item">
            <span class="data-label">Pressure:</span>
            <span class="data-value">${data.pressure} atm</span>
        </div>
        <div class="data-item">
            <span class="data-label">Salinity:</span>
            <span class="data-value">${data.salinity} ppt</span>
        </div>
        <div class="data-item">
            <span class="data-label">Oxygen:</span>
            <span class="data-value">${data.oxygen} mg/L</span>
        </div>
        <div class="data-item">
            <span class="data-label">pH:</span>
            <span class="data-value">${data.ph}</span>
        </div>
        <div class="data-item">
            <span class="data-label">Last Update:</span>
            <span class="data-value">${data.timestamp}</span>
        </div>
    `;
    
    infoPanel.classList.add('show');
    
    // Fly to the selected point
    const phi = (90 - data.lat) * (Math.PI / 180);
    const theta = (data.lng + 180) * (Math.PI / 180);
    
    const targetX = 1.5 * Math.sin(phi) * Math.cos(theta);
    const targetY = 1.5 * Math.cos(phi);
    const targetZ = 1.5 * Math.sin(phi) * Math.sin(theta);
    
    // Animate camera to the point
    animateCameraTo(targetX, targetY, targetZ);
}

function animateCameraTo(x, y, z) {
    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(x, y, z);
    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(0, 0, 0);
    
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        camera.position.lerpVectors(startPosition, endPosition, easeProgress);
        controls.target.lerpVectors(startTarget, endTarget, easeProgress);
        controls.update();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Animate data points
    dataPoints.forEach((point, index) => {
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time + index) * 0.1;
        point.scale.setScalar(scale);
    });
    
    // Render the scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('earthGlobe');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}


function addMapMarkers() {
    oceanData.forEach((data) => {
        const marker = createMapMarker(data);
        markers.push(marker);
        if (showDataPoints) {
            marker.addTo(map);
        }
    });
}

function createMapMarker(data) {
    // Create custom icon based on temperature
    const iconColor = getMarkerColor(data.temperature);
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 20px;
            height: 20px;
            background: ${iconColor};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            animation: pulse 2s infinite;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const marker = L.marker([data.lat, data.lng], { icon: customIcon });
    
    // Add popup with basic info
    marker.bindPopup(`
        <div style="color: #333; font-family: 'Inter', sans-serif;">
            <h4 style="color: #60a5fa; margin: 0 0 10px 0;">${data.name}</h4>
            <p style="margin: 5px 0; color: #555;"><strong>Temperature:</strong> ${data.temperature}°C</p>
            <p style="margin: 5px 0; color: #555;"><strong>Depth:</strong> ${data.depth}m</p>
            <p style="margin: 5px 0; color: #555;"><strong>Pressure:</strong> ${data.pressure} atm</p>
            <button onclick="showDetailedInfo(${data.id})" style="
                background: #60a5fa;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 12px;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='#3b82f6'" onmouseout="this.style.background='#60a5fa'">View Details & Trajectory</button>
        </div>
    `);

    // Add click event for detailed info
    marker.on('click', () => {
        showDetailedInfo(data.id);
    });

    return marker;
}

function getMarkerColor(temperature) {
    if (temperature < 0) return '#60a5fa'; // Blue for cold
    if (temperature < 10) return '#3b82f6'; // Light blue
    if (temperature < 20) return '#10b981'; // Green
    if (temperature < 25) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red for hot
}

function addMapTrajectories() {
    oceanData.forEach((data) => {
        if (data.trajectory && data.trajectory.length > 1) {
            const polyline = createMapTrajectory(data.trajectory);
            polylines.push(polyline);
            if (showTrajectories) {
                polyline.addTo(map);
            }
        }
    });
}

function createMapTrajectory(trajectoryData) {
    const latLngs = trajectoryData.map(point => [point.lat, point.lng]);
    
    const polyline = L.polyline(latLngs, {
        color: '#60a5fa',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5'
    });

    return polyline;
}

function showDetailedInfo(dataId) {
    const data = oceanData.find(d => d.id === dataId);
    if (!data) return;

    const infoPanel = document.getElementById('mapInfoPanel');
    const infoContent = document.getElementById('infoContent');
    
    // Clear any existing trajectory highlights
    clearTrajectoryHighlights();
    
    // Highlight the trajectory for this point
    highlightTrajectory(dataId);
    
    infoContent.innerHTML = `
        <h4>${data.name}</h4>
        <div class="data-item">
            <span class="data-label">Location:</span>
            <span class="data-value">${data.lat.toFixed(4)}°, ${data.lng.toFixed(4)}°</span>
        </div>
        <div class="data-item">
            <span class="data-label">Depth:</span>
            <span class="data-value">${data.depth}m</span>
        </div>
        <div class="data-item">
            <span class="data-label">Temperature:</span>
            <span class="data-value">${data.temperature}°C</span>
        </div>
        <div class="data-item">
            <span class="data-label">Pressure:</span>
            <span class="data-value">${data.pressure} atm</span>
        </div>
        <div class="data-item">
            <span class="data-label">Salinity:</span>
            <span class="data-value">${data.salinity} ppt</span>
        </div>
        <div class="data-item">
            <span class="data-label">Oxygen:</span>
            <span class="data-value">${data.oxygen} mg/L</span>
        </div>
        <div class="data-item">
            <span class="data-label">pH:</span>
            <span class="data-value">${data.ph}</span>
        </div>
        <div class="data-item">
            <span class="data-label">Last Update:</span>
            <span class="data-value">${data.timestamp}</span>
        </div>
        <div class="trajectory-info">
            <h5 style="color: #60a5fa; margin: 15px 0 10px 0;">Trajectory Points:</h5>
            <div class="trajectory-list">
                ${data.trajectory.map((point, index) => `
                    <div class="trajectory-point">
                        <span class="point-number">${index + 1}</span>
                        <span class="point-coords">${point.lat.toFixed(4)}°, ${point.lng.toFixed(4)}°</span>
                        <span class="point-time">${point.timestamp}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    infoPanel.classList.add('show');
    
    // Center map on the selected marker and fit trajectory
    if (data.trajectory && data.trajectory.length > 0) {
        const trajectoryBounds = L.latLngBounds(data.trajectory.map(p => [p.lat, p.lng]));
        map.fitBounds(trajectoryBounds, { padding: [20, 20] });
    } else {
        map.setView([data.lat, data.lng], 6);
    }
}

function initializeMapControls() {
    const toggleTrajectories = document.getElementById('toggleTrajectories');
    const toggleDataPoints = document.getElementById('toggleDataPoints');
    const resetView = document.getElementById('resetView');
    const toggleHeatmap = document.getElementById('toggleHeatmap');
    const closeInfo = document.getElementById('closeInfo');
    const searchLocation = document.getElementById('searchLocation');
    const locationSearch = document.getElementById('locationSearch');

    if (toggleTrajectories) {
        toggleTrajectories.addEventListener('click', () => {
            showTrajectories = !showTrajectories;
            polylines.forEach(polyline => {
                if (showTrajectories) {
                    polyline.addTo(map);
                } else {
                    map.removeLayer(polyline);
                }
            });
            toggleTrajectories.classList.toggle('active', showTrajectories);
        });
    }

    if (toggleDataPoints) {
        toggleDataPoints.addEventListener('click', () => {
            showDataPoints = !showDataPoints;
            markers.forEach(marker => {
                if (showDataPoints) {
                    marker.addTo(map);
                } else {
                    map.removeLayer(marker);
                }
            });
            toggleDataPoints.classList.toggle('active', showDataPoints);
        });
    }

    if (toggleHeatmap) {
        toggleHeatmap.addEventListener('click', () => {
            showHeatmap = !showHeatmap;
            if (showHeatmap) {
                createHeatmap();
            } else {
                removeHeatmap();
            }
            toggleHeatmap.classList.toggle('active', showHeatmap);
        });
    }

    if (resetView) {
        resetView.addEventListener('click', () => {
            if (markers.length > 0) {
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
            } else {
                map.setView([20, 0], 2);
            }
        });
    }

    if (closeInfo) {
        closeInfo.addEventListener('click', () => {
            document.getElementById('mapInfoPanel').classList.remove('show');
        });
    }

    // Search functionality
    if (searchLocation && locationSearch) {
        searchLocation.addEventListener('click', () => {
            const searchTerm = locationSearch.value.trim();
            if (searchTerm) {
                searchForLocation(searchTerm);
            }
        });

        locationSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = locationSearch.value.trim();
                if (searchTerm) {
                    searchForLocation(searchTerm);
                }
            }
        });
    }
}

// Search for location and show nearest floats
async function searchForLocation(searchTerm) {
    try {
        // Reference locations from the Streamlit app
        const referenceLocations = {
            "Chennai": [13.0827, 80.2707],
            "Mumbai": [19.0760, 72.8777],
            "Kochi": [9.9312, 76.2673],
            "Kolkata": [22.5726, 88.3639],
            "Visakhapatnam": [17.6868, 83.2185],
            "Bengaluru": [12.9716, 77.5946],
            "Arabian Sea": [15.0, 65.0],
            "Bay of Bengal": [15.0, 87.0],
            "Indian Ocean": [-20.0, 80.0],
            "Equator": [0.0, 80.0],
            "Maldives": [3.2028, 73.2207],
            "Sri Lanka": [7.8731, 80.7718]
        };

        const location = referenceLocations[searchTerm];
        if (location) {
            const [lat, lng] = location;
            
            // Center map on the location
            map.setView([lat, lng], 6);
            
            // Find nearest floats
            const nearestFloats = await argoAPI.getNearestFloats(lat, lng, 500); // 500km radius
            
            // Clear existing highlights
            clearTrajectoryHighlights();
            
            // Highlight nearest floats
            nearestFloats.slice(0, 5).forEach((float, index) => {
                const marker = markers.find(m => m.options.dataId === float.id);
                if (marker) {
                    // Create a special highlight marker
                    const highlightMarker = L.circleMarker([float.lat, float.lng], {
                        radius: 15,
                        fillColor: '#ff6b6b',
                        color: '#ffffff',
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 0.7
                    }).addTo(map);

                    highlightMarker.bindPopup(`
                        <div style="color: #333; font-family: 'Inter', sans-serif;">
                            <h5 style="color: #ff6b6b; margin: 0 0 5px 0;">Nearest Float to ${searchTerm}</h5>
                            <p style="margin: 2px 0;"><strong>Distance:</strong> ${argoAPI.calculateDistance(lat, lng, float.lat, float.lng).toFixed(1)} km</p>
                            <p style="margin: 2px 0;"><strong>Temperature:</strong> ${float.temperature}°C</p>
                            <p style="margin: 2px 0;"><strong>Salinity:</strong> ${float.salinity} PSU</p>
                        </div>
                    `);

                    // Remove highlight after 10 seconds
                    setTimeout(() => {
                        map.removeLayer(highlightMarker);
                    }, 10000);
                }
            });

            // Show info about the search
            const infoPanel = document.getElementById('mapInfoPanel');
            const infoContent = document.getElementById('infoContent');
            
            infoContent.innerHTML = `
                <h4>Search Results for "${searchTerm}"</h4>
                <div class="data-item">
                    <span class="data-label">Location:</span>
                    <span class="data-value">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</span>
                </div>
                <div class="data-item">
                    <span class="data-label">Nearest Floats:</span>
                    <span class="data-value">${nearestFloats.length} found</span>
                </div>
                <div class="data-item">
                    <span class="data-label">Search Radius:</span>
                    <span class="data-value">500 km</span>
                </div>
                <div class="search-results">
                    <h5 style="color: #60a5fa; margin: 15px 0 10px 0;">Nearest ARGO Floats:</h5>
                    <div class="results-list">
                        ${nearestFloats.slice(0, 5).map((float, index) => `
                            <div class="result-item">
                                <span class="result-number">${index + 1}</span>
                                <span class="result-name">${float.name}</span>
                                <span class="result-distance">${argoAPI.calculateDistance(lat, lng, float.lat, float.lng).toFixed(1)} km</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            infoPanel.classList.add('show');
            
        } else {
            // Search in ocean data for partial matches
            const matchingFloats = oceanData.filter(float => 
                float.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                float.region.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (matchingFloats.length > 0) {
                // Show matching floats
                const firstMatch = matchingFloats[0];
                map.setView([firstMatch.lat, firstMatch.lng], 6);
                
                // Highlight matching floats
                matchingFloats.forEach(float => {
                    const marker = markers.find(m => m.options.dataId === float.id);
                    if (marker) {
                        marker.openPopup();
                    }
                });
            } else {
                alert(`Location "${searchTerm}" not found. Try searching for: Mumbai, Chennai, Arabian Sea, Bay of Bengal, etc.`);
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('Search failed. Please try again.');
    }
}

function createHeatmap() {
    // Create a simple heatmap effect using circles
    const heatmapData = oceanData.map(data => ({
        lat: data.lat,
        lng: data.lng,
        intensity: Math.abs(data.temperature) / 30 // Normalize temperature
    }));

    heatmapData.forEach(point => {
        const circle = L.circle([point.lat, point.lng], {
            radius: 100000, // 100km radius
            fillColor: getHeatmapColor(point.intensity),
            fillOpacity: 0.3,
            color: 'transparent',
            weight: 0
        });
        
        if (!heatmapLayer) {
            heatmapLayer = L.layerGroup();
        }
        heatmapLayer.addLayer(circle);
    });

    if (heatmapLayer) {
        heatmapLayer.addTo(map);
    }
}

function removeHeatmap() {
    if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
        heatmapLayer = null;
    }
}

function getHeatmapColor(intensity) {
    // Create a color gradient from blue (cold) to red (hot)
    const colors = [
        '#60a5fa', // Blue
        '#3b82f6', // Light blue
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#ef4444'  // Red
    ];
    
    const index = Math.floor(intensity * (colors.length - 1));
    return colors[Math.min(index, colors.length - 1)];
}

// Trajectory highlighting functions
let highlightedTrajectory = null;
let trajectoryMarkers = [];

function highlightTrajectory(dataId) {
    const data = oceanData.find(d => d.id === dataId);
    if (!data || !data.trajectory) return;

    // Create highlighted trajectory line
    const latLngs = data.trajectory.map(point => [point.lat, point.lng]);
    highlightedTrajectory = L.polyline(latLngs, {
        color: '#ff6b6b',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);

    // Add trajectory point markers
    data.trajectory.forEach((point, index) => {
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 6,
            fillColor: '#ff6b6b',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        // Add popup for trajectory point
        marker.bindPopup(`
            <div style="color: #333; font-family: 'Inter', sans-serif;">
                <h5 style="color: #ff6b6b; margin: 0 0 5px 0;">Point ${index + 1}</h5>
                <p style="margin: 2px 0;"><strong>Time:</strong> ${point.timestamp}</p>
                <p style="margin: 2px 0;"><strong>Location:</strong> ${point.lat.toFixed(4)}°, ${point.lng.toFixed(4)}°</p>
            </div>
        `);

        trajectoryMarkers.push(marker);
    });
}

function clearTrajectoryHighlights() {
    // Remove highlighted trajectory
    if (highlightedTrajectory) {
        map.removeLayer(highlightedTrajectory);
        highlightedTrajectory = null;
    }

    // Remove trajectory markers
    trajectoryMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    trajectoryMarkers = [];
}
