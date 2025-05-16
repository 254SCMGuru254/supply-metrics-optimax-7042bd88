
export type ModelValueMetricsType = 
  | 'route-optimization'
  | 'inventory-management'
  | 'center-of-gravity'
  | 'heuristic'
  | 'network-optimization';

export interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
}

export interface BusinessImpactDetails {
  difficulty: string;
  timeToValue: string;
  dataReadiness: string;
  requirements: string[];
  teamRoles: string[];
  skillsNeeded: string[];
}

export interface BusinessValueReport {
  metrics: {
    name: string;
    value: string;
    icon: string;
  }[];
  implementationDetails: BusinessImpactDetails;
  caseStudies: CaseStudy[];
}
