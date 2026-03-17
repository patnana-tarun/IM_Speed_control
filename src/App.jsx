import React from 'react';
import DashboardLayout from './components/DashboardLayout';
import EmergencyStop from './components/EmergencyStop';
import SpeedControl from './components/SpeedControl';
import StatusIndicators from './components/StatusIndicators';
import SpeedGauge from './components/SpeedGauge';
import TelemetryCharts from './components/TelemetryCharts';

import PowerMetrics from './components/PowerMetrics';

function App() {
  return (
    <DashboardLayout>
      {/* 
         Responsive Grid:
         - Mobile (Default): 1 col
         - Laptop (lg): 12 col grid with 4/8 split
      */}
      <div className="flex flex-col gap-3 h-full min-h-0">

        {/* Row 1: Controls & Health (3 Equal Tabs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0 items-stretch">
          <div className="bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-stretch min-h-0 min-w-0 transition-all duration-300 hover:border-blue-500/50">
            <EmergencyStop />
          </div>
          <div className="bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-stretch min-h-0 min-w-0 transition-all duration-300 hover:border-blue-500/50">
            <SpeedControl />
          </div>
          <div className="bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-stretch min-h-0 min-w-0 transition-all duration-300 hover:border-blue-500/50">
            <StatusIndicators />
          </div>
        </div>

        {/* Row 2: Performance Metrics (RMS Voltage, Hz, etc) */}
        <div className="shrink-0">
          <PowerMetrics />
        </div>

        {/* Row 3: Visual Data (50/50 Split) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
          <div className="min-h-0 h-full">
            <SpeedGauge />
          </div>
          <div className="min-h-0 h-full">
            <TelemetryCharts />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default App;
