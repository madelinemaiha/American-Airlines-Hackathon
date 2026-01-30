import {
  getStatusText,
  convert12hTo24h,
  formatArrivalTime12h,
  calculateProcessSteps,
} from "./lib.js";

import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("getStatusText - maps status to display text", () => {
  assertEquals(getStatusText("low"), "Light Traffic");
  assertEquals(getStatusText("medium"), "Moderate Wait");
  assertEquals(getStatusText("high"), "Heavy Traffic");
  assertEquals(getStatusText("unknown"), "Unknown");
});

Deno.test("convert12hTo24h - AM conversion", () => {
  assertEquals(convert12hTo24h(1, "00", "AM"), "01:00");
  assertEquals(convert12hTo24h(12, "30", "AM"), "00:30");
  assertEquals(convert12hTo24h(11, "45", "AM"), "11:45");
});

Deno.test("convert12hTo24h - PM conversion", () => {
  assertEquals(convert12hTo24h(1, "00", "PM"), "13:00");
  assertEquals(convert12hTo24h(12, "00", "PM"), "12:00");
  assertEquals(convert12hTo24h(11, "30", "PM"), "23:30");
});

Deno.test("formatArrivalTime12h - calculates arrival with AM/PM", () => {
  // 2:00 PM - 90 min = 12:30 PM
  assertEquals(formatArrivalTime12h("14:00", 90), "12:30 PM");
  // 8:00 AM - 60 min = 7:00 AM
  assertEquals(formatArrivalTime12h("08:00", 60), "7:00 AM");
  // 12:00 PM - 15 min = 11:45 AM
  assertEquals(formatArrivalTime12h("12:00", 15), "11:45 AM");
});

Deno.test("calculateProcessSteps - returns steps and total time", () => {
  const waitTimes = {
    parking: 5,
    shuttle: 8,
    bagCheck: 12,
    security: 15,
    securityPrecheck: 3,
    walk: 10,
  };

  const { steps, totalTime } = calculateProcessSteps({
    checkingBag: false,
    tsaPrecheck: false,
    waitTimes,
  });

  assertEquals(steps.length, 5); // parking, shuttle, security, walk, buffer
  assertEquals(steps[0].name, "Parking/Walk to Terminal");
  assertEquals(steps[0].time, 5);
  assertEquals(steps[4].name, "Buffer Time (Recommended)");
  assertEquals(steps[4].time, 15);

  const expectedTotal =
    5 + 8 + 15 + 10 + 15; // no bag check, no gate extra
  assertEquals(totalTime, expectedTotal);
});

Deno.test("calculateProcessSteps - includes bag check when checking bag", () => {
  const waitTimes = {
    parking: 5,
    shuttle: 8,
    bagCheck: 12,
    security: 15,
    securityPrecheck: 3,
    walk: 10,
  };

  const { steps, totalTime } = calculateProcessSteps({
    checkingBag: true,
    tsaPrecheck: false,
    waitTimes,
  });

  assertEquals(steps.length, 6); // parking, shuttle, bagCheck, security, walk, buffer
  const bagStep = steps.find((s) => s.name === "Bag Check");
  assertExists(bagStep);
  assertEquals(bagStep.time, 12);
  assertEquals(totalTime, 5 + 8 + 12 + 15 + 10 + 15);
});

Deno.test("calculateProcessSteps - uses TSA PreCheck when enabled", () => {
  const waitTimes = {
    parking: 5,
    shuttle: 8,
    security: 15,
    securityPrecheck: 3,
    walk: 10,
  };

  const { steps } = calculateProcessSteps({
    checkingBag: false,
    tsaPrecheck: true,
    waitTimes,
  });

  const securityStep = steps.find((s) => s.name === "TSA PreCheck");
  assertExists(securityStep);
  assertEquals(securityStep.time, 3);
});

Deno.test("calculateProcessSteps - handles empty options", () => {
  const { steps, totalTime } = calculateProcessSteps();
  assertEquals(steps.length, 5);
  assertEquals(totalTime, 5 + 8 + 15 + 10 + 15);
});
