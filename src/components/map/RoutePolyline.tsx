
import React from 'react';
import { Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Route, Node } from './MapTypes';

export interface RoutePolylineProps {
  route: Route;
  fromNode: Node;
  toNode: Node;
  isOptimized?: boolean;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ 
  route, 
  fromNode, 
  toNode, 
  isOptimized = false 
}) => {
  const positions = [
    [fromNode.latitude, fromNode.longitude],
    [toNode.latitude, toNode.longitude]
  ];

  // Set color based on route status
  const color = route.isDisrupted ? '#ff0000' :
               isOptimized ? '#00c853' :
               '#3388ff';
  
  // Set weight based on flow amount if available
  const weight = route.flow ? Math.min(5 + (route.flow / 20), 12) : 3;
  
  // Set dash pattern for special routes
  const dashArray = route.isDisrupted ? '5, 10' :
                   isOptimized ? null : null;

  return (
    <Polyline 
      positions={positions as L.LatLngExpression[]} 
      pathOptions={{ 
        color: color,
        weight: weight,
        dashArray: dashArray,
        opacity: 0.8
      }}
    >
      {/* Replace Tooltip with a popup created on click using Leaflet's bindPopup */}
      {React.useEffect(() => {
        const polylines = document.querySelectorAll('.leaflet-interactive');
        const lastPolyline = polylines[polylines.length - 1];
        
        if (lastPolyline) {
          const popup = L.popup()
            .setContent(`
              <div>
                <p><strong>From:</strong> ${fromNode.name}</p>
                <p><strong>To:</strong> ${toNode.name}</p>
                ${route.distance ? `<p><strong>Distance:</strong> ${route.distance.toFixed(2)} km</p>` : ''}
                ${route.time ? `<p><strong>Time:</strong> ${route.time.toFixed(2)} hrs</p>` : ''}
                ${route.cost ? `<p><strong>Cost:</strong> $${route.cost.toFixed(2)}</p>` : ''}
                ${route.flow ? `<p><strong>Flow:</strong> ${route.flow} units</p>` : ''}
              </div>
            `);
          
          L.DomEvent.on(lastPolyline, 'click', (e) => {
            popup.setLatLng(e.latlng).openOn((e.target as any)._map);
            L.DomEvent.stopPropagation(e);
          });
        }
        
        return () => {
          if (lastPolyline) {
            L.DomEvent.off(lastPolyline, 'click');
          }
        };
      }, [])}
    </Polyline>
  );
};
