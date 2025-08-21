#  Battery Health Dashboard

This project is a solution to the **Front-End Engineer Coding Exercise**.  
It analyzes battery data from multiple schools, detects devices with unhealthy battery usage, and presents the results in a simple dashboard.

---

##  Features
- Parses raw `battery.json` input data.
- Groups devices by **academy (school)**.
- Calculates **average daily battery usage**:
  - Weights intervals by duration.
  - Ignores charging events.
  - Marks usage as *unknown* if only one reading is present.
- Flags devices as **unhealthy** if they consume more than **30% per day**.
- Ranks schools by the number of unhealthy devices.
- Responsive, clean UI built with **Vue 3 + Vite + TailwindCSS**.

---

##  Design Choices
- **Weighted calculation**: Battery drops are normalized to 24 hours to get `%/day`.
- **Charging ignored**: If a reading shows an increase in battery, it’s skipped.
- **Data-driven approach**: The service layer (`BatteryService.ts`) is independent of the UI, making it reusable and testable.
- **Sorting**: Schools are displayed in descending order of unhealthy device count.

---

## Tech Stack
- **Vue 3** with Composition API
- **Vite** for fast builds
- **TailwindCSS** for styling
- **Vitest** for unit testing
- **TypeScript** for type safety

---

##  Project Structure

src/
├── data/ # Battery dataset (battery.json)
├── services/
│ ├── BatteryService.ts # Core logic
│ └── tests/BatteryService.test.ts
├── views/
│ └── Home.vue # Dashboard UI
├── App.vue
├── main.ts
└── router/index.ts


---

##  Getting Started

### 1. Install dependencies
```bash
npm install


2. Run the development server
npm run dev
Then visit: http://localhost:5173

3. Run unit tests
npm run test

 Assumptions

- Devices with only one reading cannot have usage calculated → usage is unknown.

- Chrome is the only required browser.

- A device is unhealthy if average usage > 30%/day.

- The dataset provided (battery.json) is trusted as valid input.

 Possible Improvements (If Given More Time)

- Add pagination or search for large datasets.

- Visualize trends with charts (battery drop over time).

- Show top schools/devices in summary cards.

- Deploy live preview (e.g., Netlify or Vercel).

 Author

Developed by Ogundipe Daniel
Frontend Developer 