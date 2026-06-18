import JSZip from 'jszip';
import type {
  Artifact,
  Category,
  ChangeCategory,
  ChangeRecord,
  Code,
  Coding,
  Memo,
  ProjectState,
  ReportSection,
  ResearchQuestion,
  Theory,
  TypeOfStatus,
  TypeOfVote,
  Vote,
  VoteDecision,
} from '../types/domain';
import { PHASE_ORDER } from '../types/domain';
import { SEED_PROJECT } from '../lib/seedData';

const STORAGE_KEY = 'mentor-project-state';

type ProjectAction =
  | { type: 'LOAD'; payload: ProjectState }
  | { type: 'SET_ACTIVE_RESEARCHER'; researcherId: string }
  | { type: 'UPDATE_ARTIFACT'; id: string; updates: Partial<Artifact> }
  | { type: 'ADD_ARTIFACT'; artifact: Artifact }
  | { type: 'ADD_CHANGE'; record: ChangeRecord }
  | { type: 'ADD_CODING'; coding: Coding }
  | { type: 'ADD_CODE'; code: Code }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'UPDATE_THEORY'; theory: Theory }
  | { type: 'ADD_MEMO'; memo: Memo }
  | { type: 'ADD_VOTE'; vote: Vote }
  | { type: 'ADVANCE_PHASE'; artifactId: string; targetPhase: TypeOfStatus }
  | { type: 'BACKTRACK'; artifactId: string; targetPhase: TypeOfStatus; reason: string }
  | { type: 'UPDATE_RQ'; rq: ResearchQuestion }
  | { type: 'UPDATE_REPORT_SECTION'; section: ReportSection }
  | { type: 'UPDATE_SETTINGS'; updates: Partial<ProjectState['settings']> };

function loadState(): ProjectState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProjectState;
  } catch {
    /* use seed */
  }
  return SEED_PROJECT;
}

function saveState(state: ProjectState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function reducer(state: ProjectState, action: ProjectAction): ProjectState {
  let next: ProjectState;
  switch (action.type) {
    case 'LOAD':
      next = action.payload;
      break;
    case 'SET_ACTIVE_RESEARCHER':
      next = { ...state, activeResearcherId: action.researcherId };
      break;
    case 'UPDATE_ARTIFACT':
      next = {
        ...state,
        settings: { ...state.settings, updatedAt: new Date().toISOString() },
        artifacts: state.artifacts.map((a) =>
          a.id === action.id ? { ...a, ...action.updates } : a
        ),
      };
      break;
    case 'ADD_ARTIFACT':
      next = {
        ...state,
        artifacts: [...state.artifacts, action.artifact],
        settings: { ...state.settings, updatedAt: new Date().toISOString() },
      };
      break;
    case 'ADD_CHANGE':
      next = {
        ...state,
        changeLog: [action.record, ...state.changeLog],
        settings: { ...state.settings, updatedAt: new Date().toISOString() },
      };
      break;
    case 'ADD_CODING':
      next = { ...state, codings: [...state.codings, action.coding] };
      break;
    case 'ADD_CODE':
      next = { ...state, codes: [...state.codes, action.code] };
      break;
    case 'ADD_CATEGORY':
      next = { ...state, categories: [...state.categories, action.category] };
      break;
    case 'UPDATE_THEORY':
      next = { ...state, theory: action.theory };
      break;
    case 'ADD_MEMO':
      next = { ...state, memos: [...state.memos, action.memo] };
      break;
    case 'ADD_VOTE':
      next = { ...state, votes: [...state.votes, action.vote] };
      break;
    case 'ADVANCE_PHASE':
      next = {
        ...state,
        artifacts: state.artifacts.map((a) =>
          a.id === action.artifactId ? { ...a, status: action.targetPhase } : a
        ),
        settings: { ...state.settings, updatedAt: new Date().toISOString() },
      };
      break;
    case 'BACKTRACK':
      next = {
        ...state,
        artifacts: state.artifacts.map((a) =>
          a.id === action.artifactId ? { ...a, status: action.targetPhase } : a
        ),
        changeLog: [
          {
            id: `ch-${Date.now()}`,
            timestamp: new Date().toISOString(),
            authorId: state.activeResearcherId,
            category: 'artefact',
            action: `BACKTRACK: ${action.targetPhase}`,
            rationale: action.reason,
            status: 'committed',
          },
          ...state.changeLog,
        ],
        settings: { ...state.settings, updatedAt: new Date().toISOString() },
      };
      break;
    case 'UPDATE_RQ':
      next = {
        ...state,
        settings: {
          ...state.settings,
          updatedAt: new Date().toISOString(),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            researchQuestions: state.settings.theoreticalFramework.researchQuestions.map(
              (rq) => (rq.id === action.rq.id ? action.rq : rq)
            ),
          },
        },
      };
      break;
    case 'UPDATE_REPORT_SECTION':
      next = {
        ...state,
        settings: {
          ...state.settings,
          reportSections: state.settings.reportSections.map((s) =>
            s.id === action.section.id ? action.section : s
          ),
        },
      };
      break;
    case 'UPDATE_SETTINGS':
      next = {
        ...state,
        settings: { ...state.settings, ...action.updates, updatedAt: new Date().toISOString() },
      };
      break;
    default:
      next = state;
  }
  saveState(next);
  return next;
}

export function getNextPhase(current: TypeOfStatus): TypeOfStatus | null {
  const idx = PHASE_ORDER.indexOf(current);
  return idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null;
}

export function getPrevPhase(current: TypeOfStatus): TypeOfStatus | null {
  const idx = PHASE_ORDER.indexOf(current);
  return idx > 0 ? PHASE_ORDER[idx - 1] : null;
}

export function evaluateConsensus(
  votes: Vote[],
  targetId: string,
  researchers: { id: string }[],
  votingType: TypeOfVote
): { met: boolean; approve: number; reject: number; total: number } {
  const relevant = votes.filter((v) => v.targetId === targetId);
  const approve = relevant.filter((v) => v.decision === 'approve').length;
  const reject = relevant.filter((v) => v.decision === 'reject').length;
  const total = researchers.length;

  let met = false;
  if (votingType === 'unanimous') met = approve === total && reject === 0;
  else if (votingType === 'majority') met = approve > total / 2;
  else met = approve >= Math.ceil(total * 0.66);

  return { met, approve, reject, total };
}

export function createChangeRecord(
  authorId: string,
  category: ChangeCategory,
  action: string,
  rationale: string,
  status: ChangeRecord['status'] = 'draft',
  note?: string
): ChangeRecord {
  return {
    id: `ch-${Date.now()}`,
    timestamp: new Date().toISOString(),
    authorId,
    category,
    action,
    rationale,
    status,
    note,
  };
}

export function createVote(
  targetId: string,
  targetType: Vote['targetType'],
  researcherId: string,
  decision: VoteDecision
): Vote {
  return {
    id: `v-${Date.now()}-${researcherId}`,
    targetId,
    targetType,
    researcherId,
    decision,
    timestamp: new Date().toISOString(),
  };
}

export async function exportProjectJson(state: ProjectState): Promise<Blob> {
  return new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
}

export async function exportMarkdownReport(state: ProjectState): Promise<Blob> {
  const { settings, theory, categories, codes } = state;
  let md = `# ${settings.projectName}\n\n${settings.subtitle}\n\n`;
  md += `## Research Questions\n\n`;
  settings.theoreticalFramework.researchQuestions.forEach((rq, i) => {
    md += `**RQ ${i + 1}:** ${rq.content}\n\n`;
  });
  md += `## Report Sections\n\n`;
  settings.reportSections.forEach((s) => {
    md += `### ${s.title}\n\n${s.content}\n\n`;
  });
  if (theory) {
    md += `## Emerging Theory\n\n${theory.content}\n\n`;
  }
  md += `## Categories (${categories.length})\n\n`;
  categories.forEach((c) => {
    md += `- **${c.name}** (${c.level})\n`;
  });
  md += `\n## Codes (${codes.length})\n\n`;
  codes.forEach((c) => {
    md += `- ${c.name}\n`;
  });
  return new Blob([md], { type: 'text/markdown' });
}

export async function exportRoCrate(state: ProjectState): Promise<Blob> {
  const zip = new JSZip();
  const { settings, artifacts, codes, categories, theory, researchTeam, memos } = state;

  const graph: Record<string, unknown>[] = [];
  const rootId = './';

  graph.push({
    '@id': 'ro-crate-metadata.json',
    '@type': 'CreativeWork',
    conformsTo: { '@id': 'https://w3id.org/ro/crate/1.1' },
    about: { '@id': rootId },
  });

  const hasPart: { '@id': string }[] = [];

  artifacts.forEach((art) => {
    const safeName = art.name.replace(/[^a-z0-9.-]/gi, '_');
    const filePath = `data/${art.id}_${safeName}.txt`;
    zip.file(filePath, art.content);
    hasPart.push({ '@id': filePath });
    graph.push({
      '@id': filePath,
      '@type': 'File',
      name: art.name,
      description: `hashID: ${art.hashID}. Status: ${art.status}. Access: ${art.access}.`,
      encodingFormat: 'text/plain',
      dateCreated: art.curation.dateCreated,
    });
  });

  researchTeam.researchers.forEach((r) => {
    graph.push({
      '@id': `#person-${r.id}`,
      '@type': 'Person',
      name: r.name,
      jobTitle: `${r.role} Researcher`,
    });
  });

  if (theory) {
    zip.file('data/theory.txt', theory.content);
    hasPart.push({ '@id': 'data/theory.txt' });
    graph.push({
      '@id': 'data/theory.txt',
      '@type': ['File', 'CreativeWork'],
      name: 'Grounded Theory',
      description: `Type: ${theory.type}. Categories: ${theory.categoryIds.join(', ')}`,
    });
  }

  graph.push({
    '@id': rootId,
    '@type': 'Dataset',
    name: settings.projectName,
    description: settings.subtitle,
    creator: researchTeam.researchers.map((r) => ({ '@id': `#person-${r.id}` })),
    hasPart,
    keywords: ['Grounded Theory', 'Qualitative Research', 'MENTOR', 'GTA-DCM'],
    variableMeasured: categories.map((c) => c.name),
    numberOfCodes: codes.length,
  });

  const metadata = {
    '@context': 'https://w3id.org/ro/crate/1.1/context',
    '@graph': graph,
  };

  zip.file('ro-crate-metadata.json', JSON.stringify(metadata, null, 2));
  zip.file(
    'project-summary.json',
    JSON.stringify(
      {
        project: settings.projectName,
        methodology: settings.theoreticalFramework.methodology,
        phases: PHASE_ORDER,
        artefactCount: artifacts.length,
        codeCount: codes.length,
        categoryCount: categories.length,
        memoCount: memos.length,
      },
      null,
      2
    )
  );

  return zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function checkPrivacyForExport(artifacts: Artifact[]): {
  safe: boolean;
  privateCount: number;
} {
  const privateCount = artifacts.filter((a) => a.access === 'private').length;
  return { safe: privateCount === 0, privateCount };
}

export { loadState, reducer, STORAGE_KEY };
export type { ProjectAction, ProjectState };
