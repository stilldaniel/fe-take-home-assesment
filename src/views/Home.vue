<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-8">
    <!-- Title -->
    <h1
      class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 text-center sm:text-left"
    >
       Battery Health Dashboard
    </h1>

    <!-- Schools -->
    <div
      v-for="school in schools"
      :key="school.school || school.academyId"
      class="mb-4 sm:mb-6 bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6"
    >
      <!-- School header -->
      <div
        class="flex flex-col max-[500px]:items-start sm:flex-row sm:items-center sm:justify-between mb-4 gap-2"
      >
        <h2
          class="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left"
        >
          {{ school.school || ('Academy ' + school.academyId) }}
        </h2>
        <span
          class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full self-center sm:self-auto"
          :class="
            school.issuesCount > 0
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          "
        >
          {{ school.issuesCount }} Issues
        </span>
      </div>

      <!-- Device list -->
      <ul
        v-if="school.unhealthyDevices && school.unhealthyDevices.length"
        class="divide-y divide-gray-200"
      >
        <li
          v-for="device in school.unhealthyDevices"
          :key="device.serialNumber"
          class="py-3 flex flex-col max-[500px]:items-start sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <div>
            <p class="font-medium text-gray-800 text-sm sm:text-base">
              Device {{ device.serialNumber }}
            </p>
            <p class="text-xs sm:text-sm text-gray-500">Serial Number</p>
          </div>

          <div>
            <span
              class="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold"
              :class="
                device.avgDailyUsage !== null && device.avgDailyUsage > 30
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              "
            >
              <!-- Safeguard against null -->
              {{
                device.avgDailyUsage !== null
                  ? device.avgDailyUsage.toFixed(1) + '% / day'
                  : 'N/A'
              }}
            </span>
          </div>
        </li>
      </ul>

      <!-- No unhealthy devices -->
      <p
        v-else
        class="text-green-700 bg-green-50 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-center sm:text-left"
      >
         All devices healthy
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { getUnhealthyDevices, type SchoolUnhealthy } from '../services/BatteryService'

export default {
  name: 'Home',
  data() {
    return {
      schools: [] as SchoolUnhealthy[]
    }
  },
  created() {
    try {
      this.schools = getUnhealthyDevices()
      console.log('Fetched schools:', this.schools)
    } catch (err) {
      console.error('Error loading schools:', err)
    }
  }
}
</script>
