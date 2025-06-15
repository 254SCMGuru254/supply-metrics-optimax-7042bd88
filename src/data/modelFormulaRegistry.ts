export interface SupplyChainModel {
  id: string;
  name: string;
  description: string;
  category: string;
  formulas: ModelFormula[];
}

export interface ModelFormula {
  id: string;
  name: string;
  description: string;
  formula: string;
  complexity: string;
  accuracy: string;
  useCase: string;
  backendFunction: string;
  inputs: ModelInput[];
  outputs: ModelOutput[];
}

export interface ModelInput {
  name: string;
  label: string;
  type: string;
  unit?: string;
  defaultValue?: any;
}

export interface ModelOutput {
  name: string;
  label: string;
  unit?: string;
}

// Category imports
import routeOptimization from "./model-formulas/routeOptimization";
import inventoryManagement from "./model-formulas/inventoryManagement";
import centerOfGravity from "./model-formulas/centerOfGravity";
import networkOptimization from "./model-formulas/networkOptimization";
import heuristicOptimization from "./model-formulas/heuristicOptimization";
import simulation from "./model-formulas/simulation";
import facilityLocation from "./model-formulas/facilityLocation";
import riskManagement from "./model-formulas/riskManagement";
import costModeling from "./model-formulas/costModeling";
import fleetManagement from "./model-formulas/fleetManagement";

// Registry export
export const modelFormulaRegistry: SupplyChainModel[] = [
  routeOptimization,
  inventoryManagement,
  centerOfGravity,
  networkOptimization,
  heuristicOptimization,
  simulation,
  facilityLocation,
  riskManagement,
  costModeling,
  fleetManagement,
];
