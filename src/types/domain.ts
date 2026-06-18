export type TypeOfStatus =
  | 'problem_statement'
  | 'acquisition'
  | 'management'
  | 'analysis'
  | 'report';

export type TypeOfMedia = 'video' | 'text' | 'audio' | 'dataset' | 'software';
export type TypeOfAccess = 'public' | 'private';
export type TheoryType = 'classic' | 'constructivist' | 'straussian';
export type TypeOfMethod = 'interview' | 'observation' | 'survey' | 'focusgroup' | 'workshop';
export type ResearcherRole = 'Junior' | 'Senior';
export type TypeOfVote = 'unanimous' | 'majority' | 'consensus';
export type ChangeCategory =
  | 'research_question'
  | 'methods'
  | 'framework'
  | 'bibliography'
  | 'artefact';
export type ChangeStatus = 'committed' | 'draft';
export type VoteDecision = 'approve' | 'reject' | 'abstain';
export type MemoType = 'descriptive' | 'methodological' | 'conceptual' | 'reflective';

export interface CurationMetadata {
  format: string;
  source: string;
  dateCreated: string;
  consentObtained: boolean;
  preservationNotes?: string;
  participantId?: string;
}

export interface Artifact {
  id: string;
  hashID: string;
  name: string;
  content: string;
  type: 'interview' | 'observation' | 'document' | 'protocol' | 'bibliography';
  media: TypeOfMedia;
  access: TypeOfAccess;
  status: TypeOfStatus;
  responsibleId?: string;
  curation: CurationMetadata;
  description?: string;
  taskTitle?: string;
  instrumentType?: TypeOfMethod;
}

export interface Participant {
  id: string;
  anonymizedCode: string;
  description: string;
  isCoConstructor: boolean;
}

export interface ResearchQuestion {
  id: string;
  content: string;
}

export interface Method {
  id: string;
  type: TypeOfMethod;
  protocolContent: string;
  participantIds?: string[];
  location?: string;
  informantCount?: number;
}

export interface Tool {
  id: string;
  name: string;
  referenceURL?: string;
  version?: string;
}

export interface FieldOfStudy {
  subjectOfStudy: string;
  objectOfStudy: string;
  location: string;
}

export interface TheoreticalFramework {
  researchQuestions: ResearchQuestion[];
  methods: Method[];
  tools: Tool[];
  bibliographyContent: string;
  methodology: TheoryType;
  attachedDocuments?: { name: string; size: string; type: string }[];
}

export interface Researcher {
  id: string;
  name: string;
  role: ResearcherRole;
  color: string;
  initials: string;
}

export interface ResearchTeam {
  id: string;
  name: string;
  researchers: Researcher[];
  consensusCriteria: ConsensusCriteria[];
}

export interface ConsensusCriteria {
  id: string;
  name: string;
  votingType: TypeOfVote;
  description: string;
  active: boolean;
}

export interface Code {
  id: string;
  name: string;
  color: string;
  relatedCodeIds: string[];
  kind: 'code' | 'category';
}

export interface Category {
  id: string;
  name: string;
  codeIds: string[];
  relatedCategoryIds: string[];
  level: 'descriptive' | 'analytical';
}

export interface Theory {
  id: string;
  type: TheoryType;
  content: string;
  categoryIds: string[];
}

export interface Coding {
  id: string;
  artifactId: string;
  codeId: string;
  start: number;
  end: number;
  textSnippet: string;
  researcherId: string;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  relatedIds: string[];
  createdAt: string;
  type: MemoType;
  authorId: string;
  segment?: { start: number; end: number; text: string };
}

export interface ChangeRecord {
  id: string;
  timestamp: string;
  authorId: string;
  category: ChangeCategory;
  action: string;
  rationale: string;
  proposal?: string;
  status: ChangeStatus;
  note?: string;
}

export interface Vote {
  id: string;
  targetId: string;
  targetType: 'code' | 'category' | 'theory' | 'phase_transition' | 'artefact';
  researcherId: string;
  decision: VoteDecision;
  timestamp: string;
}

export interface ActivityEntry {
  id: string;
  date: string;
  dayLabel: string;
  artifactId: string;
  researcherId: string;
  description: string;
  instrumentType: TypeOfMethod;
  taskTitle: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  linkedArtifactIds: string[];
}

export interface ProjectSettings {
  projectName: string;
  subtitle: string;
  updatedAt: string;
  fieldOfStudy: FieldOfStudy;
  participants: Participant[];
  theoreticalFramework: TheoreticalFramework;
  reportSections: ReportSection[];
}

export interface ProjectState {
  settings: ProjectSettings;
  artifacts: Artifact[];
  codes: Code[];
  categories: Category[];
  theory: Theory | null;
  codings: Coding[];
  memos: Memo[];
  researchTeam: ResearchTeam;
  changeLog: ChangeRecord[];
  votes: Vote[];
  activities: ActivityEntry[];
  activeResearcherId: string;
}

export const PHASE_ORDER: TypeOfStatus[] = [
  'problem_statement',
  'acquisition',
  'management',
  'analysis',
  'report',
];

export const PHASE_LABELS: Record<TypeOfStatus, string> = {
  problem_statement: 'Problem Statement',
  acquisition: 'Data Acquisition',
  management: 'Data Management',
  analysis: 'Analysis',
  report: 'Report',
};
