
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Node } from './MapTypes';

interface NodeMarkerProps {
  node: Node;
  onNodeClick?: (node: Node) => void;
}

// Create custom icons for different node types
const createNodeIcon = (node: Node): L.DivIcon => {
  // Default values
  const size = 24;
  const baseColor = node.color || getDefaultColor(node.type);
  const highlightColor = node.isOptimized ? '#10b981' : node.isSelected ? '#3b82f6' : baseColor;
  
  return L.divIcon({
    className: 'custom-node-marker',
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${highlightColor}; 
        border: 2px solid #ffffff;
        border-radius: ${node.type === 'warehouse' ? '4px' : '50%'};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${getNodeIconContent(node.type)}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Helper to get default color by node type
const getDefaultColor = (type: string): string => {
  switch (type) {
    case 'warehouse': return '#ef4444'; // Red
    case 'factory': return '#f59e0b';   // Amber
    case 'retail': return '#3b82f6';    // Blue
    case 'distribution': return '#8b5cf6'; // Purple
    case 'supplier': return '#10b981';  // Emerald
    default: return '#6b7280';         // Gray
  }
};

// Helper to get icon content by node type
const getNodeIconContent = (type: string): string => {
  // You can add small SVG icons here if needed
  return '';
};

export const NodeMarker: React.FC<NodeMarkerProps> = ({ node, onNodeClick }) => {
  const handleNodeClick = () => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <Marker
      position={[node.latitude, node.longitude]}
      icon={createNodeIcon(node)}
      eventHandlers={{
        click: handleNodeClick,
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-medium">{node.name}</h3>
          <p className="text-sm capitalize">{node.type}</p>
          {node.capacity && <p className="text-sm">Capacity: {node.capacity}</p>}
          {node.demand && <p className="text-sm">Demand: {node.demand}</p>}
          {node.cost && <p className="text-sm">Cost: ${node.cost}</p>}
          {node.notes && <p className="text-sm text-gray-600">{node.notes}</p>}
        </div>
      </Popup>
    </Marker>
  );
};

export default NodeMarker;
