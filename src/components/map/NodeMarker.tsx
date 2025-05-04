
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Node } from './MapTypes';

export interface NodeMarkerProps {
  node: Node;
  onNodeClick?: (node: Node) => void;
}

export const NodeMarker: React.FC<NodeMarkerProps> = ({ node, onNodeClick }) => {
  const handleClick = () => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };
  
  // Default marker options
  const markerOptions: L.MarkerOptions = {
    title: node.name,
    riseOnHover: true
  };

  // Add custom icon based on node type or status
  if (node.type || node.isOptimized || node.isDisrupted) {
    const iconColor = node.isDisrupted ? 'red' : 
                     node.isOptimized ? 'green' : 
                     node.type === 'warehouse' ? 'blue' :
                     node.type === 'customer' ? 'orange' :
                     node.type === 'supplier' ? 'purple' : 'gray';
    
    markerOptions.icon = L.divIcon({
      className: `custom-marker ${iconColor}`,
      html: `<div style="background-color:${iconColor};" class="marker-pin"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
  }

  return (
    <Marker 
      position={[node.latitude, node.longitude]} 
      eventHandlers={{ click: handleClick }}
      {...markerOptions}
    >
      <Popup>
        <div>
          <h3 className="font-medium">{node.name}</h3>
          {node.type && <p>Type: {node.type}</p>}
          {node.capacity !== undefined && <p>Capacity: {node.capacity}</p>}
          {node.cost !== undefined && <p>Cost: ${node.cost.toFixed(2)}</p>}
          {node.weight !== undefined && <p>Weight: {node.weight}</p>}
        </div>
      </Popup>
    </Marker>
  );
};
