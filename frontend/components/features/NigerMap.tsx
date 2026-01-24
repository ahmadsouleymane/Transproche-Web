'use client';

import { useState } from 'react';

interface City {
  name: string;
  x: number;
  y: number;
  isCapital?: boolean;
}

interface Route {
  from: string;
  to: string;
  color: string;
}

const cities: City[] = [
  { name: 'Niamey', x: 85, y: 320, isCapital: true },
  { name: 'Dosso', x: 130, y: 340 },
  { name: 'Tahoua', x: 200, y: 230 },
  { name: 'Maradi', x: 280, y: 290 },
  { name: 'Zinder', x: 360, y: 280 },
  { name: 'Agadez', x: 320, y: 140 },
  { name: 'Arlit', x: 280, y: 60 },
  { name: 'Diffa', x: 480, y: 270 },
  { name: 'Tillabéri', x: 70, y: 260 },
  { name: "Birni N'Konni", x: 200, y: 280 },
];

const routes: Route[] = [
  { from: 'Niamey', to: 'Dosso', color: '#ea580c' },
  { from: 'Niamey', to: 'Tillabéri', color: '#ea580c' },
  { from: 'Dosso', to: "Birni N'Konni", color: '#ea580c' },
  { from: "Birni N'Konni", to: 'Tahoua', color: '#16a34a' },
  { from: "Birni N'Konni", to: 'Maradi', color: '#ea580c' },
  { from: 'Tahoua', to: 'Agadez', color: '#16a34a' },
  { from: 'Agadez', to: 'Arlit', color: '#16a34a' },
  { from: 'Maradi', to: 'Zinder', color: '#ea580c' },
  { from: 'Zinder', to: 'Diffa', color: '#2563eb' },
  { from: 'Zinder', to: 'Agadez', color: '#9333ea' },
];

const NigerMap = () => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const getCityByName = (name: string) => cities.find(c => c.name === name);

  const getRouteId = (route: Route) => `${route.from}-${route.to}`;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-4 md:p-8 overflow-hidden">
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-md z-10">
        <p className="text-xs font-semibold text-gray-700 mb-2">Légende</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary-600 rounded" />
            <span className="text-gray-600">Rimbo / Air Transport</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-600 rounded" />
            <span className="text-gray-600">SNTV</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-600 rounded" />
            <span className="text-gray-600">Diffa Express</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-600 rounded" />
            <span className="text-gray-600">STM Voyageurs</span>
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 550 400"
        className="w-full h-auto max-h-[500px]"
        style={{ minHeight: '300px' }}
      >
        {/* Niger country outline (simplified) */}
        <path
          d="M 50 350
             L 30 300
             L 40 250
             L 60 200
             L 100 150
             L 150 100
             L 200 60
             L 280 40
             L 350 50
             L 400 80
             L 450 100
             L 500 150
             L 520 200
             L 530 250
             L 520 300
             L 500 340
             L 450 360
             L 400 350
             L 350 340
             L 300 350
             L 250 360
             L 200 365
             L 150 360
             L 100 355
             Z"
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth="2"
          className="drop-shadow-sm"
        />

        {/* Sahara pattern in the north */}
        <defs>
          <pattern id="sahara" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#fcd34d" opacity="0.3" />
          </pattern>
        </defs>
        <path
          d="M 100 150 L 150 100 L 200 60 L 280 40 L 350 50 L 400 80 L 450 100 L 500 150 L 480 180 L 400 160 L 300 140 L 200 150 L 150 170 L 100 150 Z"
          fill="url(#sahara)"
        />

        {/* Routes with arrows */}
        <defs>
          <marker
            id="arrowhead-orange"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#ea580c" />
          </marker>
          <marker
            id="arrowhead-green"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a" />
          </marker>
          <marker
            id="arrowhead-blue"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
          </marker>
          <marker
            id="arrowhead-purple"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#9333ea" />
          </marker>
        </defs>

        {routes.map((route) => {
          const fromCity = getCityByName(route.from);
          const toCity = getCityByName(route.to);
          if (!fromCity || !toCity) return null;

          const routeId = getRouteId(route);
          const isHovered = hoveredRoute === routeId;

          // Calculate arrow position (slightly before the end)
          const dx = toCity.x - fromCity.x;
          const dy = toCity.y - fromCity.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const endX = toCity.x - (dx / length) * 15;
          const endY = toCity.y - (dy / length) * 15;

          const arrowId = route.color === '#ea580c' ? 'arrowhead-orange'
            : route.color === '#16a34a' ? 'arrowhead-green'
            : route.color === '#2563eb' ? 'arrowhead-blue'
            : 'arrowhead-purple';

          return (
            <g key={routeId}>
              <line
                x1={fromCity.x}
                y1={fromCity.y}
                x2={endX}
                y2={endY}
                stroke={route.color}
                strokeWidth={isHovered ? 4 : 2.5}
                strokeLinecap="round"
                markerEnd={`url(#${arrowId})`}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRoute(routeId)}
                onMouseLeave={() => setHoveredRoute(null)}
                opacity={hoveredRoute && !isHovered ? 0.3 : 1}
              />
            </g>
          );
        })}

        {/* Cities */}
        {cities.map((city) => {
          const isHovered = hoveredCity === city.name;
          const isConnected = hoveredRoute?.includes(city.name);

          return (
            <g
              key={city.name}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              {/* City marker */}
              <circle
                cx={city.x}
                cy={city.y}
                r={city.isCapital ? 10 : 7}
                fill={city.isCapital ? '#ea580c' : '#ffffff'}
                stroke={city.isCapital ? '#c2410c' : '#ea580c'}
                strokeWidth={2}
                className={`transition-all duration-200 ${isHovered || isConnected ? 'drop-shadow-lg' : ''}`}
                style={{
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                  transformOrigin: `${city.x}px ${city.y}px`,
                }}
              />

              {/* Capital star */}
              {city.isCapital && (
                <text
                  x={city.x}
                  y={city.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  ★
                </text>
              )}

              {/* City name label */}
              <text
                x={city.x}
                y={city.y - 12}
                textAnchor="middle"
                fill="#374151"
                fontSize={city.isCapital ? 12 : 10}
                fontWeight={city.isCapital || isHovered ? 'bold' : 'normal'}
                className="pointer-events-none"
              >
                {city.name}
              </text>
            </g>
          );
        })}

        {/* Title */}
        <text x="275" y="385" textAnchor="middle" fill="#6b7280" fontSize="11">
          Carte simplifiée du réseau de transport au Niger
        </text>
      </svg>

      {/* City info tooltip */}
      {hoveredCity && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <p className="font-semibold text-gray-900">{hoveredCity}</p>
          <p className="text-xs text-gray-500">
            {cities.find(c => c.name === hoveredCity)?.isCapital ? 'Capitale du Niger' : 'Chef-lieu de région'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NigerMap;
