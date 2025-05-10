
import React, { useCallback } from 'react';
import { Polyline } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { Node, Route, MapPathOptions } from './MapTypes';

interface RoutePolylineProps {
  route: Route;
  fromNode: Node;
  toNode: Node;
  isOptimized?: boolean;
  onClick?: (route: Route) => void;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  route,
  fromNode,
  toNode,
  isOptimized = false,
  onClick
}) => {
  const handleRouteClick = useCallback(() => {
    if (onClick) {
      onClick(route);
    }
  }, [onClick, route]);

  // Calculate path options based on route properties
  const getPathOptions = (): MapPathOptions => {
    const baseOptions: MapPathOptions = {
      weight: 3,
      opacity: 0.8,
    };

    // Style for optimized routes
    if (isOptimized || route.isOptimized) {
      return {
        ...baseOptions,
        color: '#10b981', // Emerald-500
        weight: 4,
        opacity: 0.9,
      };
    }

    // Style for selected routes
    if (route.isSelected) {
      return {
        ...baseOptions,
        color: '#3b82f6', // Blue-500
        weight: 4,
        opacity: 1,
      };
    }

    // Default style based on transportation mode
    switch (route.mode) {
      case 'air':
        return { ...baseOptions, color: '#a78bfa', dashArray: '5, 5' }; // Violet
      case 'rail':
        return { ...baseOptions, color: '#f59e0b', dashArray: '10, 5' }; // Amber
      case 'ship':
        return { ...baseOptions, color: '#0ea5e9', dashArray: '10, 10' }; // Sky
      case 'multimodal':
        return { ...baseOptions, color: '#8b5cf6', dashArray: '15, 5, 5, 5' }; // Purple
      case 'truck':
      default:
        return { ...baseOptions, color: '#ef4444' }; // Red
    }
  };

  // Cast the coordinates explicitly as LatLngTuple[] to satisfy TypeScript
  const positions: LatLngTuple[] = [
    [fromNode.latitude, fromNode.longitude],
    [toNode.latitude, toNode.longitude]
  ];

  // Using the onClick prop directly with Polyline's eventHandlers
  if (onClick) {
    return (
      <Polyline
        positions={positions}
        pathOptions={getPathOptions()}
        eventHandlers={{
          click: handleRouteClick
        }}
      />
    );
  }

  // Render without click handler
  return (
    <Polyline
      positions={positions}
      pathOptions={getPathOptions()}
    />
  );
};

export default RoutePolyline;
