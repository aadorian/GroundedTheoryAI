import { generateHashID } from '../../lib/hash';
import type {
  ActivityEntry,
  Artifact,
  Category,
  ChangeRecord,
  Code,
  Coding,
  ConsensusCriteria,
  Memo,
  Method,
  Participant,
  ReportSection,
  ResearchQuestion,
  Theory,
  Tool,
  TypeOfMethod,
  TypeOfStatus,
} from '../../types/domain';
import { createEntityId } from './collectionUtils';

export async function buildArtifact(
  input: Omit<Artifact, 'id' | 'hashID'> & { id?: string; hashID?: string }
): Promise<Artifact> {
  const hashID = input.hashID ?? (await generateHashID(input.content));
  return {
    ...input,
    id: input.id ?? createEntityId('a'),
    hashID,
  };
}

export function buildResearchQuestion(content: string, id?: string): ResearchQuestion {
  return { id: id ?? createEntityId('rq'), content };
}

export function buildMethod(
  input: Omit<Method, 'id'> & { id?: string }
): Method {
  return { ...input, id: input.id ?? createEntityId('m') };
}

export function buildTool(input: Omit<Tool, 'id'> & { id?: string }): Tool {
  return { ...input, id: input.id ?? createEntityId('t') };
}

export function buildParticipant(
  input: Omit<Participant, 'id'> & { id?: string }
): Participant {
  return { ...input, id: input.id ?? createEntityId('p') };
}

export function buildCode(input: Omit<Code, 'id'> & { id?: string }): Code {
  return { ...input, id: input.id ?? createEntityId('c') };
}

export function buildCategory(input: Omit<Category, 'id'> & { id?: string }): Category {
  return { ...input, id: input.id ?? createEntityId('cat') };
}

export function buildTheory(input: Omit<Theory, 'id'> & { id?: string }): Theory {
  return { ...input, id: input.id ?? createEntityId('th') };
}

export function buildCoding(input: Omit<Coding, 'id'> & { id?: string }): Coding {
  return { ...input, id: input.id ?? createEntityId('cd') };
}

export function buildMemo(
  input: Omit<Memo, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): Memo {
  return {
    ...input,
    id: input.id ?? createEntityId('memo'),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function buildActivity(
  input: Omit<ActivityEntry, 'id'> & { id?: string }
): ActivityEntry {
  return { ...input, id: input.id ?? createEntityId('act') };
}

export function buildReportSection(
  input: Omit<ReportSection, 'id'> & { id?: string }
): ReportSection {
  return { ...input, id: input.id ?? createEntityId('rs') };
}

export function buildConsensusCriteria(
  input: Omit<ConsensusCriteria, 'id'> & { id?: string }
): ConsensusCriteria {
  return { ...input, id: input.id ?? createEntityId('cc') };
}

export function buildChangeRecord(
  input: Omit<ChangeRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): ChangeRecord {
  return {
    ...input,
    id: input.id ?? createEntityId('ch'),
    timestamp: input.timestamp ?? new Date().toISOString(),
  };
}

export const DEFAULT_ARTIFACT = (
  status: TypeOfStatus = 'acquisition',
  responsibleId?: string
): Omit<Artifact, 'id' | 'hashID'> => ({
  name: 'New Artefact',
  content: '',
  type: 'document',
  media: 'text',
  access: 'private',
  status,
  responsibleId,
  curation: {
    format: 'Document',
    source: 'Manual entry',
    dateCreated: new Date().toISOString().slice(0, 10),
    consentObtained: false,
  },
});

export const DEFAULT_METHOD = (type: TypeOfMethod = 'interview'): Omit<Method, 'id'> => ({
  type,
  protocolContent: '',
  location: '',
  informantCount: 0,
});
