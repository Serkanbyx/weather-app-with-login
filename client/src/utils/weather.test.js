import { describe, it, expect } from "vitest";
import { getGradient, capitalizeFirst, WEATHER_GRADIENTS, FORECAST_GRADIENTS } from "./weather";

describe("getGradient", () => {
  it("returns correct gradient for known weather types", () => {
    expect(getGradient("Clear")).toBe(WEATHER_GRADIENTS.clear);
    expect(getGradient("Clouds")).toBe(WEATHER_GRADIENTS.clouds);
    expect(getGradient("Rain")).toBe(WEATHER_GRADIENTS.rain);
    expect(getGradient("Drizzle")).toBe(WEATHER_GRADIENTS.drizzle);
    expect(getGradient("Thunderstorm")).toBe(WEATHER_GRADIENTS.thunderstorm);
    expect(getGradient("Snow")).toBe(WEATHER_GRADIENTS.snow);
    expect(getGradient("Mist")).toBe(WEATHER_GRADIENTS.mist);
    expect(getGradient("Fog")).toBe(WEATHER_GRADIENTS.fog);
    expect(getGradient("Haze")).toBe(WEATHER_GRADIENTS.haze);
  });

  it("is case-insensitive", () => {
    expect(getGradient("CLEAR")).toBe(WEATHER_GRADIENTS.clear);
    expect(getGradient("rain")).toBe(WEATHER_GRADIENTS.rain);
    expect(getGradient("Snow")).toBe(WEATHER_GRADIENTS.snow);
  });

  it("returns default gradient for unknown weather", () => {
    expect(getGradient("Unknown")).toBe(WEATHER_GRADIENTS.default);
    expect(getGradient("Tornado")).toBe(WEATHER_GRADIENTS.default);
  });

  it("returns default gradient for null or undefined", () => {
    expect(getGradient(null)).toBe(WEATHER_GRADIENTS.default);
    expect(getGradient(undefined)).toBe(WEATHER_GRADIENTS.default);
  });

  it("uses custom gradient map when provided", () => {
    expect(getGradient("Clear", FORECAST_GRADIENTS)).toBe(FORECAST_GRADIENTS.clear);
    expect(getGradient("Rain", FORECAST_GRADIENTS)).toBe(FORECAST_GRADIENTS.rain);
  });

  it("returns custom map default for unknown weather with custom map", () => {
    expect(getGradient("Unknown", FORECAST_GRADIENTS)).toBe(FORECAST_GRADIENTS.default);
  });
});

describe("capitalizeFirst", () => {
  it("capitalizes the first letter of a string", () => {
    expect(capitalizeFirst("hello")).toBe("Hello");
    expect(capitalizeFirst("world")).toBe("World");
  });

  it("keeps the rest of the string unchanged", () => {
    expect(capitalizeFirst("clear sky")).toBe("Clear sky");
    expect(capitalizeFirst("broken clouds")).toBe("Broken clouds");
  });

  it("handles single character strings", () => {
    expect(capitalizeFirst("a")).toBe("A");
  });

  it("handles already capitalized strings", () => {
    expect(capitalizeFirst("Hello")).toBe("Hello");
  });

  it("returns empty string for empty input", () => {
    expect(capitalizeFirst("")).toBe("");
  });

  it("returns empty string for null or undefined", () => {
    expect(capitalizeFirst(null)).toBe("");
    expect(capitalizeFirst(undefined)).toBe("");
  });
});
