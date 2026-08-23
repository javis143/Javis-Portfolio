export type UserType = 'Student' | 'Freelancer' | 'Engineer' | 'Technician' | 'Researcher' | 'Inventor' | 'Startup' | 'Company';

export interface OnboardingData {
  userType: UserType;
  specialty: string;
  country: string;
  city: string;
  reason: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  options?: { key: string; text: string }[];
  type: 'select' | 'multi-select' | 'text';
}

export interface ComponentRecommendation {
  id: string;
  requirement: string;
  candidates: {
    name: string;
    type: 'recommended' | 'alternative' | 'low-cost' | 'industrial';
    reason: string;
    advantages: string[];
    disadvantages: string[];
    interface: string;
    voltage: string;
    current: string;
    cost: number;
    availability: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    specs: Record<string, string>;
  }[];
}

export interface CalculationItem {
  id: string;
  name: string;
  inputs: Record<string, number>;
  formula: string;
  substitution: string;
  result: number;
  unit: string;
  assumptions: Record<string, string>;
}

export interface BomItem {
  id: string;
  item: string;
  component: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  supplier: string;
  availability: 'High' | 'Medium' | 'Low';
  purpose: string;
  alternative: string;
  status: 'Pending' | 'Ordered' | 'Delivered';
}

export interface CostingDetails {
  materialCost: number;
  engineeringFeePercent: number; // e.g. 30 for 30%
  engineeringFee: number;
  labor: number;
  transportation: number;
  testingFee: number;
  documentationFee: number;
  contingencyPercent: number; // e.g. 10 for 10%
  contingency: number;
  profitMarginPercent: number; // e.g. 20 for 20%
  profitMargin: number;
  totalEstimatedCost: number;
  clientQuotation: number;
}

export interface ProjectTask {
  id: string;
  name: string;
  phase: string;
  durationDays: number;
  dependencies: string[]; // task IDs
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  notes?: string;
  delayDays?: number;
}

export interface DecisionLogItem {
  id: string;
  decision: string;
  reason: string;
  rejectedOption: string;
  risk: string;
  date: string;
}

export interface RiskItem {
  id: string;
  risk: string;
  probability: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  severity: 'Critical' | 'Major' | 'Minor';
  mitigation: string;
}

export interface TestItem {
  id: string;
  testId: string;
  objective: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'Pending' | 'Pass' | 'Fail';
  notes: string;
}

export interface ProjectVersion {
  id: string;
  version: string;
  changes: string;
  changedBy: string;
  date: string;
  costImpact: string;
  timelineImpact: string;
  affectedDecisions: string[];
}

export interface ClientQuestionnaire {
  enabled: boolean;
  clientName: string;
  clientBrief: string;
  answers: Record<string, string>;
  convertedRequirements?: {
    functional: string[];
    nonFunctional: string[];
    technical: string[];
  };
}

export interface Subsystem {
  name: string;
  description: string;
  interfaces: string[];
}

export interface BuildSpecProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  userType: UserType;
  category: string;
  targetCountry: string;
  targetEnvironment: string;
  estimatedBudget: string;
  targetCompletionDate: string;
  createdAt: string;
  updatedAt: string;
  
  answers: Record<string, string>;
  questions: InterviewQuestion[];
  completenessScore: number;
  missingRequirements: string[];
  
  requirements: {
    functional: string[];
    nonFunctional: string[];
    technical: string[];
    environmental: string[];
    safety: string[];
  };
  
  architecture: Subsystem[];
  components: ComponentRecommendation[];
  calculations: CalculationItem[];
  bom: BomItem[];
  costing: CostingDetails;
  timeline: ProjectTask[];
  decisions: DecisionLogItem[];
  risks: RiskItem[];
  tests: TestItem[];
  versions: ProjectVersion[];
  clientQuestionnaire: ClientQuestionnaire;
}
