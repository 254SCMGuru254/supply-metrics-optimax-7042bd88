
export type ModelValueMetricsType =
  | "route-optimization"
  | "inventory-management"
  | "network-optimization"
  | "center-of-gravity"
  | "heuristic";

export interface Metric {
  name: string;
  value: string | number;
  icon?: string;
}

export interface ImplementationRequirement {
  difficulty: "Low" | "Medium" | "High";
  timeToValue: string;
  dataReadiness: string;
  requirements: string[];
  teamRoles: string[];
  skillsNeeded: string[];
}

export interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
}

export interface BusinessValueReport {
  metrics?: Metric[];
  implementationRequirements?: ImplementationRequirement;
  caseStudies?: CaseStudy[];
}
