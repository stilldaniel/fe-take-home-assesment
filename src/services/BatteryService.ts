import batteryData from "../data/battery.json"

export type Reading = {
  powerLevel: number
  timestamp: string
}

export type DeviceUsage = {
  serialNumber: string
  avgDailyUsage: number | null
}

export type SchoolUnhealthy = {
  school: string
  issuesCount: number
  unhealthyDevices: DeviceUsage[]
}


export function calculateDeviceUsage(readings: Reading[]): number | null {
  if (readings.length < 2) {
    return null // not enough data = unknown
  }

  readings.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  let totalDrop = 0
  let totalTime = 0 // in hours

  for (let i = 1; i < readings.length; i++) {
    const prev = readings[i - 1]
    const curr = readings[i]

    const hours =
      (new Date(curr.timestamp).getTime() -
        new Date(prev.timestamp).getTime()) /
      (1000 * 60 * 60)

    // Only count drops (ignore charging events)
    if (curr.powerLevel < prev.powerLevel) {
      const drop = prev.powerLevel - curr.powerLevel
      totalDrop += drop
      totalTime += hours
    }
  }

  if (totalTime <= 0) {
    return 0 // no measurable drop = 0% per day
  }

  // Normalize to 24 hours
  return (totalDrop / totalTime) * 24
}

/**
 * Get unhealthy devices grouped by academy (school)
 * @param data optional dataset (used for tests)
 */
export function getUnhealthyDevices(data: any[] = batteryData): SchoolUnhealthy[] {
  const devicesBySchool: Record<string, Record<string, Reading[]>> = {}

  data.forEach((entry: any) => {
    const school = `Academy ${entry.academyId}`
    const { serialNumber, batteryLevel, timestamp } = entry

    if (!devicesBySchool[school]) {
      devicesBySchool[school] = {}
    }

    if (!devicesBySchool[school][serialNumber]) {
      devicesBySchool[school][serialNumber] = []
    }

    devicesBySchool[school][serialNumber].push({
      powerLevel: batteryLevel * 100, // convert 0.68 = 68%
      timestamp
    })
  })

  const result: SchoolUnhealthy[] = []

  for (const school in devicesBySchool) {
    const devices = devicesBySchool[school]
    const unhealthyDevices: DeviceUsage[] = []

    for (const serialNumber in devices) {
      const avgDailyUsage = calculateDeviceUsage(devices[serialNumber])

      if (avgDailyUsage !== null && avgDailyUsage > 30) {
        unhealthyDevices.push({
          serialNumber,
          avgDailyUsage
        })
      }
    }

    result.push({
      school,
      unhealthyDevices,
      issuesCount: unhealthyDevices.length
    })
  }

  // Sort schools by number of issues (descending)
  result.sort((a, b) => b.issuesCount - a.issuesCount)

  return result
}
