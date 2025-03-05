
import { WalkthroughStep } from "@/components/ModelWalkthrough";

export const getNetworkWalkthroughSteps = (): WalkthroughStep[] => {
  return [
    {
      title: "Add Network Nodes",
      description: "Start by clicking on the map to add facility locations. Each click will add a new node at that location. Add at least two nodes to create a network."
    },
    {
      title: "Create Connections",
      description: "Once you've added multiple nodes, routes will automatically be created between them, forming a connected network with initial flow values."
    },
    {
      title: "Run Optimization Algorithm",
      description: "Click the 'Run Optimization' button to apply the network flow algorithm that minimizes transportation costs across your supply chain network."
    },
    {
      title: "Analyze Results",
      description: "After optimization, review the metrics panel to see the cost reduction and flow efficiency. Optimized routes will be highlighted on the map."
    },
    {
      title: "Refine Your Network",
      description: "Continue adding more nodes to create a more complex network, then re-run the optimization to see how the algorithm handles different scenarios."
    }
  ];
};
