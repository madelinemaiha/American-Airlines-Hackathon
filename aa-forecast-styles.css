import { getStatusText, convert12hTo24h, formatArrivalTime12h } from "./lib.js";

// Airport wait time data (simulated - in production, this would come from APIs)
const airportData = {
  DFW: {
    name: "Dallas/Fort Worth International Airport",
    terminals: ['A', 'B', 'C', 'D', 'E'],
    waitTimes: {
      parking: { base: 5, variance: 3, status: 'low' },
      shuttle: { base: 8, variance: 4, status: 'low' },
      bagCheck: { base: 12, variance: 6, status: 'medium' },
      security: { base: 15, variance: 10, status: 'medium' },
      securityPrecheck: { base: 3, variance: 2, status: 'low' },
      walk: { base: 10, variance: 5, status: 'low' },
      food: { base: 8, variance: 5, status: 'low' },
      rental: { base: 15, variance: 8, status: 'medium' }
    }
  },
  CLT: {
    name: "Charlotte Douglas International Airport",
    terminals: ['A', 'B', 'C', 'D', 'E'],
    waitTimes: {
      parking: { base: 4, variance: 2, status: 'low' },
      shuttle: { base: 7, variance: 3, status: 'low' },
      bagCheck: { base: 10, variance: 5, status: 'low' },
      security: { base: 18, variance: 12, status: 'medium' },
      securityPrecheck: { base: 3, variance: 2, status: 'low' },
      walk: { base: 8, variance: 4, status: 'low' },
      food: { base: 7, variance: 4, status: 'low' },
      rental: { base: 12, variance: 6, status: 'medium' }
    }
  },
  MIA: {
    name: "Miami International Airport",
    terminals: ['D', 'E', 'F', 'G', 'H', 'J'],
    waitTimes: {
      parking: { base: 6, variance: 4, status: 'low' },
      shuttle: { base: 10, variance: 5, status: 'medium' },
      bagCheck: { base: 15, variance: 8, status: 'medium' },
      security: { base: 20, variance: 15, status: 'high' },
      securityPrecheck: { base: 4, variance: 3, status: 'low' },
      walk: { base: 12, variance: 6, status: 'medium' },
      food: { base: 10, variance: 6, status: 'medium' },
      rental: { base: 18, variance: 10, status: 'high' }
    }
  },
  PHX: {
    name: "Phoenix Sky Harbor International Airport",
    terminals: ['3', '4'],
    waitTimes: {
      parking: { base: 5, variance: 3, status: 'low' },
      shuttle: { base: 8, variance: 4, status: 'low' },
      bagCheck: { base: 11, variance: 6, status: 'low' },
      security: { base: 14, variance: 9, status: 'medium' },
      securityPrecheck: { base: 3, variance: 2, status: 'low' },
      walk: { base: 9, variance: 5, status: 'low' },
      food: { base: 8, variance: 5, status: 'low' },
      rental: { base: 14, variance: 7, status: 'medium' }
    }
  },
  ORD: {
    name: "Chicago O'Hare International Airport",
    terminals: ['1', '2', '3', '5'],
    waitTimes: {
      parking: { base: 6, variance: 4, status: 'low' },
      shuttle: { base: 9, variance: 5, status: 'medium' },
      bagCheck: { base: 13, variance: 7, status: 'medium' },
      security: { base: 22, variance: 15, status: 'high' },
      securityPrecheck: { base: 4, variance: 3, status: 'low' },
      walk: { base: 11, variance: 6, status: 'medium' },
      food: { base: 9, variance: 6, status: 'medium' },
      rental: { base: 16, variance: 9, status: 'high' }
    }
  }
};

// Wait time categories with icons and labels
const waitTimeCategories = [
  { id: 'parking', label: 'Parking/Walk to Terminal', icon: 'fa-car', color: 'parking' },
  { id: 'shuttle', label: 'Airport Shuttle', icon: 'fa-bus', color: 'shuttle' },
  { id: 'bagCheck', label: 'Bag Check', icon: 'fa-suitcase', color: 'bag-check' },
  { id: 'security', label: 'Security Screening', icon: 'fa-shield-alt', color: 'security' },
  { id: 'walk', label: 'Walk to Gate', icon: 'fa-walking', color: 'walk' },
  { id: 'food', label: 'Food Lines', icon: 'fa-utensils', color: 'food' },
  { id: 'rental', label: 'Car Rental', icon: 'fa-car-side', color: 'rental' }
];

let currentAirport = 'DFW';
let currentWaitTimes = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  initializeWaitTimes();
  setupEventListeners();
  setupTimePicker();
  showResultPlaceholder();
  updateWaitTimes();
  setInterval(updateWaitTimes, 30000); // Update every 30 seconds
});

// Initialize wait times display
function initializeWaitTimes() {
  const grid = document.getElementById('wait-times-grid');
  grid.innerHTML = '';
  
  waitTimeCategories.forEach(category => {
    const card = createWaitTimeCard(category);
    grid.appendChild(card);
  });
}

// Create a wait time card
function createWaitTimeCard(category) {
  const card = document.createElement('div');
  card.className = 'wait-time-card';
  card.id = `wait-time-${category.id}`;
  
  const time = getWaitTime(category.id);
  const status = getWaitTimeStatus(category.id);
  
  card.innerHTML = `
    <div class="wait-time-header">
      <div class="wait-time-icon ${category.color}">
        <i class="fas ${category.icon}"></i>
      </div>
      <div class="wait-time-label">${category.label}</div>
    </div>
    <div class="wait-time-display">
      <span class="wait-time-value">${time}</span>
      <span class="wait-time-unit">min</span>
    </div>
    <div class="wait-time-status ${status}">${getStatusText(status)}</div>
    <div class="wait-time-update">Updated just now</div>
  `;
  
  return card;
}

// Get wait time for a category
function getWaitTime(categoryId) {
  const airport = airportData[currentAirport];
  if (!airport || !airport.waitTimes[categoryId]) return 0;
  
  const config = airport.waitTimes[categoryId];
  const variance = (Math.random() - 0.5) * 2 * config.variance;
  const time = Math.max(1, Math.round(config.base + variance));
  
  currentWaitTimes[categoryId] = time;
  return time;
}

// Get wait time status
function getWaitTimeStatus(categoryId) {
  const airport = airportData[currentAirport];
  if (!airport || !airport.waitTimes[categoryId]) return 'low';
  
  return airport.waitTimes[categoryId].status;
}

// Update all wait times
function updateWaitTimes() {
  waitTimeCategories.forEach(category => {
    const card = document.getElementById(`wait-time-${category.id}`);
    if (card) {
      const time = getWaitTime(category.id);
      const status = getWaitTimeStatus(category.id);
      
      card.querySelector('.wait-time-value').textContent = time;
      card.querySelector('.wait-time-status').className = `wait-time-status ${status}`;
      card.querySelector('.wait-time-status').textContent = getStatusText(status);
      card.querySelector('.wait-time-update').textContent = 'Updated just now';
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Airport selector
  document.getElementById('airport-select').addEventListener('change', (e) => {
    currentAirport = e.target.value;
    updateWaitTimes();
  });
  
  // Calculate button
  document.getElementById('calculate-btn').addEventListener('click', calculateArrivalTime);
}

// Custom time picker: syncs hour/minute/AM-PM selects to hidden input (HH:mm)
// Options are in numerical order (1-12, 00-55, AM then PM)
function setupTimePicker() {
  const hourSelect = document.getElementById('departure-hour');
  const minuteSelect = document.getElementById('departure-minute');
  const ampmSelect = document.getElementById('departure-ampm');
  const hiddenInput = document.getElementById('departure-time');

  function updateHiddenTime() {
    const hourVal = hourSelect.value;
    const minuteVal = minuteSelect.value;
    const ampmVal = ampmSelect.value;

    if (!hourVal || !minuteVal || !ampmVal) {
      hiddenInput.value = '';
    } else {
      hiddenInput.value = convert12hTo24h(hourVal, minuteVal, ampmVal);
    }
    hiddenInput.dispatchEvent(new Event('change'));
  }

  [hourSelect, minuteSelect, ampmSelect].forEach(el => {
    el.addEventListener('change', updateHiddenTime);
  });
}

// Show placeholder state for result box (before Calculate is pressed)
function showResultPlaceholder() {
  const card = document.getElementById('total-time-card');
  if (card) card.classList.remove('calculated');
  const flowMap = document.getElementById('flow-map');
  if (flowMap) flowMap.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Enter your flight details and click Calculate to see your optimal route</p>';
  const breakdownList = document.getElementById('breakdown-list');
  if (breakdownList) breakdownList.innerHTML = '';
}

// Reveal result box with actual data (after Calculate is pressed with valid info)
function showResultData() {
  const card = document.getElementById('total-time-card');
  if (card) card.classList.add('calculated');
}

// Calculate arrival time
function calculateArrivalTime() {
  const departureTime = document.getElementById('departure-time').value;
  
  if (!departureTime) {
    alert('Please enter your departure time');
    return;
  }
  
  updateProcessFlow();
}

// Update process flow
function updateProcessFlow() {
  const checkingBag = document.getElementById('checking-bag').checked;
  const tsaPrecheck = document.getElementById('tsa-precheck').checked;
  const departureTime = document.getElementById('departure-time').value;
  const gate = document.getElementById('gate').value;
  const terminal = document.getElementById('terminal').value;
  
  if (!departureTime) {
    showResultPlaceholder();
    return;
  }
  
  showResultData();
  
  // Calculate times for each step
  const steps = [];
  let totalTime = 0;
  
  // Step 1: Parking/Walk to Terminal
  const parkingTime = currentWaitTimes.parking || getWaitTime('parking');
  steps.push({ name: 'Parking/Walk to Terminal', time: parkingTime, icon: 'fa-car' });
  totalTime += parkingTime;
  
  // Step 2: Airport Shuttle (if needed)
  const shuttleTime = currentWaitTimes.shuttle || getWaitTime('shuttle');
  steps.push({ name: 'Airport Shuttle', time: shuttleTime, icon: 'fa-bus' });
  totalTime += shuttleTime;
  
  // Step 3: Bag Check (if checking bag)
  if (checkingBag) {
    const bagTime = currentWaitTimes.bagCheck || getWaitTime('bagCheck');
    steps.push({ name: 'Bag Check', time: bagTime, icon: 'fa-suitcase' });
    totalTime += bagTime;
  }
  
  // Step 4: Security
  const securityTime = tsaPrecheck 
    ? (currentWaitTimes.securityPrecheck || getWaitTime('securityPrecheck'))
    : (currentWaitTimes.security || getWaitTime('security'));
  steps.push({ 
    name: tsaPrecheck ? 'TSA PreCheck' : 'Security Screening', 
    time: securityTime, 
    icon: 'fa-shield-alt' 
  });
  totalTime += securityTime;
  
  // Step 5: Walk to Gate
  const walkTime = currentWaitTimes.walk || getWaitTime('walk');
  // Add extra time if gate is far from security
  const adjustedWalkTime = terminal && gate ? walkTime + Math.floor(Math.random() * 5) : walkTime;
  steps.push({ 
    name: `Walk to Gate ${gate || ''}`, 
    time: adjustedWalkTime, 
    icon: 'fa-walking' 
  });
  totalTime += adjustedWalkTime;
  
  // Add buffer time (15 minutes recommended)
  const bufferTime = 15;
  steps.push({ name: 'Buffer Time (Recommended)', time: bufferTime, icon: 'fa-clock' });
  totalTime += bufferTime;
  
  // Render process flow
  renderProcessFlow(steps);
  
  // Update total time
  document.getElementById('total-time').textContent = `${totalTime} min`;
  
  // Calculate and display arrival time
  document.getElementById('arrival-time').textContent = formatArrivalTime12h(
    departureTime,
    totalTime
  );
  
  // Render breakdown
  renderBreakdown(steps);
}

// Render process flow
function renderProcessFlow(steps) {
  const flowMap = document.getElementById('flow-map');
  flowMap.innerHTML = '<div class="flow-steps"></div>';
  const flowSteps = flowMap.querySelector('.flow-steps');
  
  steps.forEach((step, index) => {
    const stepElement = document.createElement('div');
    stepElement.className = 'flow-step';
    if (index === 0) stepElement.classList.add('active');
    
    stepElement.innerHTML = `
      <div class="flow-step-number">${index + 1}</div>
      <div class="flow-step-content">
        <div class="flow-step-name">
          <i class="fas ${step.icon}"></i> ${step.name}
        </div>
        <div class="flow-step-time">${step.time} minutes</div>
      </div>
    `;
    
    flowSteps.appendChild(stepElement);
    
    // Add arrow between steps (except last)
    if (index < steps.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'flow-step-arrow';
      arrow.innerHTML = '<i class="fas fa-arrow-down"></i>';
      flowSteps.appendChild(arrow);
    }
  });
}

// Render breakdown
function renderBreakdown(steps) {
  const breakdownList = document.getElementById('breakdown-list');
  breakdownList.innerHTML = '';
  
  steps.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'breakdown-item';
    
    item.innerHTML = `
      <div class="breakdown-item-name">
        <span>${index + 1}.</span>
        <i class="fas ${step.icon}"></i>
        <span>${step.name}</span>
      </div>
      <div class="breakdown-item-time">${step.time} min</div>
    `;
    
    breakdownList.appendChild(item);
  });
  
  // Add total
  const total = steps.reduce((sum, step) => sum + step.time, 0);
  const totalItem = document.createElement('div');
  totalItem.className = 'breakdown-item';
  totalItem.style.borderTop = '2px solid var(--aa-navy)';
  totalItem.style.marginTop = '1rem';
  totalItem.style.paddingTop = '1rem';
  totalItem.style.fontWeight = '700';
  
  totalItem.innerHTML = `
    <div class="breakdown-item-name">
      <span>Total Time</span>
    </div>
    <div class="breakdown-item-time" style="font-size: 1.3rem;">${total} min</div>
  `;
  
  breakdownList.appendChild(totalItem);
}

// Simulate real-time updates (in production, this would fetch from APIs)
function fetchRealTimeData() {
  // This would make API calls to:
  // - Airport security wait time APIs
  // - Airport operations APIs
  // - Historical data for predictions
  
  // For now, we simulate with realistic variations
  updateWaitTimes();
}
