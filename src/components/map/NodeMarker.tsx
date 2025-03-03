
import { Marker, Popup } from "react-leaflet";
import { Node } from "./MapTypes";

type NodeMarkerProps = {
  node: Node;
  onNodeClick?: (node: Node) => void;
};

export const NodeMarker = ({ node, onNodeClick }: NodeMarkerProps) => {
  return (
    <Marker
      position={[node.latitude, node.longitude] as [number, number]}
      eventHandlers={{
        click: () => onNodeClick && onNodeClick(node),
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">{node.name}</h3>
          <p className="text-sm text-muted-foreground">Type: {node.type}</p>
          {node.capacity && (
            <p className="text-sm text-muted-foreground">
              Capacity: {node.capacity.toLocaleString()}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
