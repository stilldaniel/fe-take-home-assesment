import { describe, it, expect } from "vitest"
import {
  calculateDeviceUsage,
  getUnhealthyDevices,
  type Reading
} from "../BatteryService"

describe("calculateDeviceUsage", () => {
  it("returns correct daily usage for simple 100% → 90% in 12 hours", () => {
    const readings: Reading[] = [
      { powerLevel: 100, timestamp: "2023-01-01T09:00:00Z" },
      { powerLevel: 90, timestamp: "2023-01-01T21:00:00Z" }
    ]
    const result = calculateDeviceUsage(readings)
    expect(result).toBeCloseTo(20, 1) // 20% per day
  })

  it("ignores charging events (increase in power)", () => {
    const readings: Reading[] = [
      { powerLevel: 80, timestamp: "2023-01-01T09:00:00Z" },
      { powerLevel: 60, timestamp: "2023-01-01T21:00:00Z" },
      { powerLevel: 100, timestamp: "2023-01-02T09:00:00Z" } // charging
    ]
    const result = calculateDeviceUsage(readings)
    expect(result).toBeCloseTo(40, 1) // Expect exactly 40% per day
  })

  it("returns null if only one reading exists", () => {
    const readings: Reading[] = [
      { powerLevel: 100, timestamp: "2023-01-01T09:00:00Z" }
    ]
    const result = calculateDeviceUsage(readings)
    expect(result).toBe(null) // not enough data
  })
})

describe("getUnhealthyDevices", () => {
  it("returns empty list if no data", () => {
    const result = getUnhealthyDevices([]) // inject empty dataset
    expect(result).toEqual([])
  })

  it("flags device as unhealthy if >30% daily usage", () => {
    const mockData = [
      {
        academyId: 1,
        serialNumber: "ABC123",
        batteryLevel: 1.0, // 100%
        timestamp: "2023-01-01T09:00:00Z"
      },
      {
        academyId: 1,
        serialNumber: "ABC123",
        batteryLevel: 0.5, // 50%
        timestamp: "2023-01-01T21:00:00Z"
      }
    ]
    const result = getUnhealthyDevices(mockData)
    expect(result[0].issuesCount).toBe(1)
    expect(result[0].unhealthyDevices[0].serialNumber).toBe("ABC123")
    expect(result[0].unhealthyDevices[0].avgDailyUsage).toBeGreaterThan(30)
  })
})
