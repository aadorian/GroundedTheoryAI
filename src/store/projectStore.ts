import JSZip from 'jszip';
import type { Artifact, ProjectState } from '../types/domain';
import { PHASE_ORDER } from '../types/domain';
import { SEED_PROJECT } from '../lib/seedData';
import {
  applyProjectReducer,
  type ProjectAction,
  checkPrivacyForExport,
  createChangeRecord,
  createVote,
  evaluateConsensus,
  getNextPhase,
  getPrevPhase,
} from '../domain';

const STORAGE_KEY = 'mentor-project-state';

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
  const next = applyProjectReducer(state, action);
  saveState(next);
  return next;
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

export {
  loadState,
  reducer,
  STORAGE_KEY,
  getNextPhase,
  getPrevPhase,
  evaluateConsensus,
  createChangeRecord,
  createVote,
  checkPrivacyForExport,
  applyProjectReducer,
};
export type { ProjectAction, ProjectState, Artifact };
