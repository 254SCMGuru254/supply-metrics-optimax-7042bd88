
import { KenyaLocation } from "../types/kenyaTypes";
import { locationColors } from "../utils/mapUtils";
import { Button } from "@/components/ui/button";

interface MapSidebarProps {
  selectedLocation: KenyaLocation | null;
}

export const MapSidebar = ({ selectedLocation }: MapSidebarProps) => {
  return (
    <div className="p-4 space-y-4 lg:border-l border-t lg:border-t-0 max-h-[600px] overflow-y-auto">
      <div>
        <h3 className="font-semibold mb-2">Location Legend</h3>
        <div className="space-y-1">
          {Object.entries(locationColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: color }} 
              />
              <span className="text-sm capitalize">
                {type.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Route Legend</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-500" />
            <span className="text-sm">Road Transport</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 border-t-2 border-dashed border-green-500" />
            <span className="text-sm">Rail Transport (SGR)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-purple-500" />
            <span className="text-sm">Air Transport</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-pink-500" />
            <span className="text-sm">Sea Transport</span>
          </div>
        </div>
      </div>

      {selectedLocation && (
        <div className="border p-3 rounded-md bg-muted/50">
          <h3 className="font-semibold">{selectedLocation.name}</h3>
          <p className="text-sm">Type: {selectedLocation.type.replace("_", " ")}</p>
          <p className="text-sm">Region: {selectedLocation.region}</p>
          {selectedLocation.capacity && (
            <p className="text-sm">Capacity: {selectedLocation.capacity} units</p>
          )}
          {selectedLocation.description && (
            <p className="text-sm mt-1">{selectedLocation.description}</p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">View Details</Button>
            <Button variant="outline" size="sm">Optimize</Button>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Key Supply Chain Corridors</h3>
        <div className="space-y-1 text-sm">
          <p>• Northern Corridor: Mombasa - Nairobi - Kampala</p>
          <p>• LAPSSET Corridor: Lamu - South Sudan - Ethiopia</p>
          <p>• Central Corridor: Dar es Salaam - Great Lakes Region</p>
          <p>• Nairobi - Addis Ababa Corridor</p>
          <p>• Mombasa - Bujumbura Corridor</p>
        </div>
      </div>
    </div>
  );
};
