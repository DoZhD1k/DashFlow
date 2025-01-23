import TimeWidget from "../components/home/TimeWidget";
import WeatherWidget from "../components/home/WeatherWidget";
import HotLinksWidget from "../components/home/HotLinksWidget";
import { SystemSettingsWidget } from "../components/home/SystemSettingsWidget";
import CalendarWidget from "../components/home/CalendarWidget";
import ToDoWidget from "~/components/home/ToDoWidget";
import SystemMetricsWidget from "~/components/home/SystemMetricsWidget";
import MusicPlayerWidget from "~/components/home/MusicPlayerWidget";
import { CurrencyRatesWidget } from "~/components/home/CurrencyRatesWidget";
export const Home: React.FC = () => {
  return (
    <div className="min-h-screen  transition-colors duration-300">
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TimeWidget />
        <CalendarWidget />
        <HotLinksWidget />
        <WeatherWidget />
        <MusicPlayerWidget />
        <CurrencyRatesWidget />
        <ToDoWidget />
        <SystemMetricsWidget />
        <SystemSettingsWidget />
      </main>
    </div>
  );
};
