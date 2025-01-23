import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const TimeWidget: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [isDay, setIsDay] = useState<boolean>(true);
  const [angle, setAngle] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      updateTimeOfDay(now);
      updateAngle(now);
    }, 1000);

    // Initialize on first render
    const now = new Date();
    updateTimeOfDay(now);
    updateAngle(now);

    return () => clearInterval(timer);
  }, []);

  const updateTimeOfDay = (currentTime: Date) => {
    const hours = currentTime.getHours();
    setIsDay(hours >= 6 && hours < 18);
  };

  const updateAngle = (currentTime: Date) => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const calculatedAngle = (totalMinutes / (24 * 60)) * 360;
    setAngle(calculatedAngle);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getArcPath = (radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(radius, radius, radius, startAngle);
    const end = polarToCartesian(radius, radius, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const radius = 90; // Clock radius
  const size = radius * 2 + 20; // Adjusted size with padding
  const center = size / 2; // Center of the SVG

  return (
    <div className="flex flex-col items-center bg-gray-900 p-6 rounded-xl shadow-md">
      <div className="relative">
        {/* Clock Face */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Background Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#2d3748"
            strokeWidth="10"
          />
          {/* Time Arc */}
          <path
            d={getArcPath(center, 0, angle)}
            fill="none"
            stroke={isDay ? "#FDB813" : "#4B5563"}
            strokeWidth="4"
          />
          {/* Hour Markers */}
          {[0, 90, 180, 270].map((markAngle) => {
            const pos = polarToCartesian(
              center,
              center,
              radius - 10,
              markAngle
            );
            return (
              <circle key={markAngle} cx={pos.x} cy={pos.y} r="3" fill="#fff" />
            );
          })}
        </svg>
        {/* Time Display */}
        <div
          className="absolute text-center text-white font-bold"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="text-3xl">{formatTime(time)}</p>
        </div>
        {/* Sun/Moon Icon */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${polarToCartesian(center, center, radius + 25, angle).x}px`,
            top: `${polarToCartesian(center, center, radius + 25, angle).y}px`,
            transition: "all 1s linear",
          }}
        >
          {isDay ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-300" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeWidget;
