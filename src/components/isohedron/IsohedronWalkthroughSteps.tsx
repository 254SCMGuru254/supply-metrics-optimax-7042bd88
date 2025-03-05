
import { WalkthroughStep } from "@/components/ModelWalkthrough";

export const getIsohedronWalkthroughSteps = (): WalkthroughStep[] => {
  return [
    {
      title: "Add Territory Centers",
      description: "Click on the map to add facility locations. Each location will be the center of a territory or service area."
    },
    {
      title: "Generate Demand Points",
      description: "Use the 'Generate Demand Points' button to create random demand points around your facilities, or add more facilities to define territory boundaries."
    },
    {
      title: "Select Division Method",
      description: "Choose a territory division method: Voronoi tessellation creates territories based on proximity, K-means clustering groups similar points, and Hierarchical clustering builds a nested structure."
    },
    {
      title: "Set Balance Preferences",
      description: "Adjust balance factors to prioritize equal territory size, balanced demand distribution, or minimized distances. The balance weight slider controls how strongly these factors influence the division."
    },
    {
      title: "Run Territory Division",
      description: "Click 'Run Territory Division' to assign each demand point to a territory. Review the balance score and territory metrics to evaluate how well the territories are balanced."
    }
  ];
};
