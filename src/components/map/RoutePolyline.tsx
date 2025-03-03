
import { Polyline } from "react-leaflet";
import { Node, Route } from "./MapTypes";
import L from "leaflet";

type RoutePolylineProps = {
  route: Route;
  fromNode: Node;
  toNode: Node;
  isOptimized: boolean;
};

export const RoutePolyline = ({ route, fromNode, toNode, isOptimized }: RoutePolylineProps) => {
  return (
    <Polyline
      positions={[
        [fromNode.latitude, fromNode.longitude] as L.LatLngTuple,
        [toNode.latitude, toNode.longitude] as L.LatLngTuple,
      ]}
      pathOptions={{
        color: isOptimized ? "#22c55e" : "#64748b",
        weight: Math.max(1, Math.min(8, route.volume / 100)),
        dashArray: route.isOptimized ? undefined : "5, 10",
      }}
    />
  );
};
