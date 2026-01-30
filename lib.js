/**
 * OnTime - Pure logic functions (testable, no DOM dependency)
 */

/** Map status codes to display text */
export function getStatusText(status) {
  const statusMap = {
    low: "Light Traffic",
    medium: "Moderate Wait",
    high: "Heavy Traffic",
  };
  return statusMap[status] || "Unknown";
}

/** Convert 12h time to 24h HH:mm string */
export function convert12hTo24h(hour12, minute, ampm) {
  let hour = parseInt(String(hour12), 10);
  const min = String(minute).padStart(2, "0");
  if (ampm === "AM") {
    hour = hour === 12 ? 0 : hour;
  } else {
    hour = hour === 12 ? 12 : hour + 12;
  }
  return `${String(hour).padStart(2, "0")}:${min}`;
}

/** Format arrival time (departure - totalMinutes) as "X:XX AM/PM" */
export function formatArrivalTime12h(departureHHMM, totalMinutes) {
  const [hours, minutes] = departureHHMM.split(":").map(Number);
  const departureDate = new Date();
  departureDate.setHours(hours, minutes, 0, 0);
  const arrivalDate = new Date(
    departureDate.getTime() - totalMinutes * 60000
  );
  const hours12 = arrivalDate.getHours() % 12 || 12;
  const arrivalMinutes = String(arrivalDate.getMinutes()).padStart(2, "0");
  const ampm = arrivalDate.getHours() < 12 ? "AM" : "PM";
  return `${hours12}:${arrivalMinutes} ${ampm}`;
}

const BUFFER_TIME = 15;
const GATE_WALK_EXTRA = 2; // Fixed extra minutes when gate/terminal provided (replaces random)

/**
 * Calculate process steps and total time
 * @param {Object} options
 * @param {boolean} options.checkingBag
 * @param {boolean} options.tsaPrecheck
 * @param {Object} options.waitTimes - { parking, shuttle, bagCheck, security, securityPrecheck, walk }
 * @param {string} [options.gate]
 * @param {string} [options.terminal]
 */
export function calculateProcessSteps(options = {}) {
  const {
    checkingBag = false,
    tsaPrecheck = false,
    waitTimes = {},
    gate = "",
    terminal = "",
  } = options;

  const steps = [];
  let totalTime = 0;

  const parkingTime = waitTimes.parking ?? 5;
  steps.push({
    name: "Parking/Walk to Terminal",
    time: parkingTime,
    icon: "fa-car",
  });
  totalTime += parkingTime;

  const shuttleTime = waitTimes.shuttle ?? 8;
  steps.push({ name: "Airport Shuttle", time: shuttleTime, icon: "fa-bus" });
  totalTime += shuttleTime;

  if (checkingBag) {
    const bagTime = waitTimes.bagCheck ?? 12;
    steps.push({ name: "Bag Check", time: bagTime, icon: "fa-suitcase" });
    totalTime += bagTime;
  }

  const securityTime = tsaPrecheck
    ? (waitTimes.securityPrecheck ?? 3)
    : (waitTimes.security ?? 15);
  steps.push({
    name: tsaPrecheck ? "TSA PreCheck" : "Security Screening",
    time: securityTime,
    icon: "fa-shield-alt",
  });
  totalTime += securityTime;

  const walkTime = waitTimes.walk ?? 10;
  const walkExtra =
    terminal && gate ? GATE_WALK_EXTRA : 0;
  const adjustedWalkTime = walkTime + walkExtra;
  steps.push({
    name: `Walk to Gate ${gate || ""}`.trim(),
    time: adjustedWalkTime,
    icon: "fa-walking",
  });
  totalTime += adjustedWalkTime;

  steps.push({
    name: "Buffer Time (Recommended)",
    time: BUFFER_TIME,
    icon: "fa-clock",
  });
  totalTime += BUFFER_TIME;

  return { steps, totalTime };
}
