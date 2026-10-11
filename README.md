# ModVault Frontend – Full-Stack Java Garage Management System

ModVault Frontend is a modern, responsive, high-performance web dashboard built with React 18, Vite, and Lucide Icons, reproducing the exact dashboard UI design, layout, metrics, charts, vehicles, and build planners.

---

## 🎨 UI Features Included
- **Exact Visual Fidelity:** Matches the design, dark navy sidebar, cards, pills, typography, vehicle photography, badges, and layout.
- **Left Sidebar Navigation:**
  - Dashboard (Active showcase)
  - My Garage (Full vehicle inventory)
  - Modifications (Build tracking)
  - Maintenance (Service schedule)
  - Fuel & Expenses (Ledger & fill-ups)
  - Analytics (Deep fleet telemetry)
  - Community (Enthusiast feed & updates)
  - Tools: Cost Calculator, Compatibility Check, Service Reminders, Reports
  - "Your Dream Build Starts Here" Call to Action box
  - User Profile footer (Geethika)
- **Top Header:** Interactive search bar, live notification badge, dark mode toggle, and profile dropdown.
- **Top Metrics Row:**
  - Total Vehicles (2 in garage, +1 new badge)
  - Pending Maintenance (3 due soon, 2 overdue badge)
  - Monthly Fuel Cost (₹ 4,320, ↓ 12% vs last month)
  - Total Expenses (₹ 18,750, ↓ 8% vs last month)
- **Interactive Visualizations:**
  - **Fuel & Expense Overview:** Dual Bar & Spline Chart with hover tooltips, filter dropdown (Last 6 months), and tabs.
  - **Expense Breakdown:** Animated Donut Chart with central total (₹ 18,750) and full legend breakdown.
- **Interactive Modals & CRUD Actions:**
  - Register new vehicle modal
  - Add modification modal
  - Log maintenance service modal
  - Add fuel / expense entry modal
  - Build & running cost calculator modal
  - Part compatibility checker modal
  - Stock vs Modified build comparison modal

---

## 🛠 Tech Stack
- **Framework:** React 18
- **Tooling:** Vite 5
- **Icons:** Lucide React
- **Styling:** Custom CSS with CSS variables, light/dark mode support, responsive grid

---

## 🚀 Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
If running with the Spring Boot backend locally, Vite automatically proxies `/api` to `http://localhost:8080`.
For production, create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root:
   ```bash
   vercel
   ```
3. Set the environment variable `VITE_API_BASE_URL` in the Vercel dashboard pointing to your deployed Spring Boot backend API.
