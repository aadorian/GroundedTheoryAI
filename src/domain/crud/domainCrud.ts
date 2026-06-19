import type { Dispatch } from 'react';
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
  ProjectState,
  ReportSection,
  ResearchQuestion,
  Theory,
  Tool,
  TypeOfStatus,
} from '../../types/domain';
import { findById } from './collectionUtils';
import {
  buildActivity,
  buildArtifact,
  buildCategory,
  buildChangeRecord,
  buildCode,
  buildCoding,
  buildConsensusCriteria,
  buildMemo,
  buildMethod,
  buildParticipant,
  buildReportSection,
  buildResearchQuestion,
  buildTheory,
  buildTool,
  DEFAULT_ARTIFACT,
  DEFAULT_METHOD,
} from './factories';
import type { ProjectAction } from '../projectReducer';

type UpdateResult<T> = T | undefined;

export function createDomainCrud(
  getState: () => ProjectState,
  dispatch: Dispatch<ProjectAction>
) {
  const state = () => getState();
  const touch = () => ({ settings: { updatedAt: new Date().toISOString() } });

  return {
    artifacts: {
      list: (status?: TypeOfStatus) =>
        status ? state().artifacts.filter((a) => a.status === status) : state().artifacts,
      get: (id: string) => findById(state().artifacts, id),
      create: async (input: Partial<Omit<Artifact, 'id' | 'hashID'>> & { status?: TypeOfStatus }) => {
        const artifact = await buildArtifact({
          ...DEFAULT_ARTIFACT(input.status, state().activeResearcherId),
          ...input,
        });
        dispatch({ type: 'ADD_ARTIFACT', artifact });
        return artifact;
      },
      update: (id: string, updates: Partial<Artifact>): UpdateResult<Artifact> => {
        const current = findById(state().artifacts, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_ARTIFACT', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().artifacts, id)) return false;
        dispatch({ type: 'DELETE_ARTIFACT', id });
        return true;
      },
    },

    researchQuestions: {
      list: () => state().settings.theoreticalFramework.researchQuestions,
      get: (id: string) =>
        findById(state().settings.theoreticalFramework.researchQuestions, id),
      create: (content: string) => {
        const rq = buildResearchQuestion(content);
        dispatch({ type: 'ADD_RQ', rq });
        return rq;
      },
      update: (id: string, content: string): UpdateResult<ResearchQuestion> => {
        const current = findById(state().settings.theoreticalFramework.researchQuestions, id);
        if (!current) return undefined;
        const rq = { ...current, content };
        dispatch({ type: 'UPDATE_RQ', rq });
        return rq;
      },
      remove: (id: string) => {
        if (!findById(state().settings.theoreticalFramework.researchQuestions, id)) return false;
        dispatch({ type: 'DELETE_RQ', id });
        return true;
      },
    },

    methods: {
      list: () => state().settings.theoreticalFramework.methods,
      get: (id: string) => findById(state().settings.theoreticalFramework.methods, id),
      create: (input: Partial<Omit<Method, 'id'>> = {}) => {
        const method = buildMethod({ ...DEFAULT_METHOD(), ...input });
        dispatch({ type: 'ADD_METHOD', method });
        return method;
      },
      update: (id: string, updates: Partial<Method>): UpdateResult<Method> => {
        const current = findById(state().settings.theoreticalFramework.methods, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_METHOD', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().settings.theoreticalFramework.methods, id)) return false;
        dispatch({ type: 'DELETE_METHOD', id });
        return true;
      },
    },

    tools: {
      list: () => state().settings.theoreticalFramework.tools,
      get: (id: string) => findById(state().settings.theoreticalFramework.tools, id),
      create: (input: Omit<Tool, 'id'>) => {
        const tool = buildTool(input);
        dispatch({ type: 'ADD_TOOL', tool });
        return tool;
      },
      update: (id: string, updates: Partial<Tool>): UpdateResult<Tool> => {
        const current = findById(state().settings.theoreticalFramework.tools, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_TOOL', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().settings.theoreticalFramework.tools, id)) return false;
        dispatch({ type: 'DELETE_TOOL', id });
        return true;
      },
    },

    participants: {
      list: () => state().settings.participants,
      get: (id: string) => findById(state().settings.participants, id),
      create: (input: Omit<Participant, 'id'>) => {
        const participant = buildParticipant(input);
        dispatch({ type: 'ADD_PARTICIPANT', participant });
        return participant;
      },
      update: (id: string, updates: Partial<Participant>): UpdateResult<Participant> => {
        const current = findById(state().settings.participants, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_PARTICIPANT', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().settings.participants, id)) return false;
        dispatch({ type: 'DELETE_PARTICIPANT', id });
        return true;
      },
    },

    codes: {
      list: (kind?: Code['kind']) =>
        kind ? state().codes.filter((c) => c.kind === kind) : state().codes,
      get: (id: string) => findById(state().codes, id),
      create: (input: Omit<Code, 'id'>) => {
        const code = buildCode(input);
        dispatch({ type: 'ADD_CODE', code });
        return code;
      },
      update: (id: string, updates: Partial<Code>): UpdateResult<Code> => {
        const current = findById(state().codes, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_CODE', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().codes, id)) return false;
        dispatch({ type: 'DELETE_CODE', id });
        return true;
      },
    },

    categories: {
      list: () => state().categories,
      get: (id: string) => findById(state().categories, id),
      create: (input: Omit<Category, 'id'>) => {
        const category = buildCategory(input);
        dispatch({ type: 'ADD_CATEGORY', category });
        return category;
      },
      update: (id: string, updates: Partial<Category>): UpdateResult<Category> => {
        const current = findById(state().categories, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_CATEGORY', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().categories, id)) return false;
        dispatch({ type: 'DELETE_CATEGORY', id });
        return true;
      },
    },

    theory: {
      get: () => state().theory,
      create: (input: Omit<Theory, 'id'>) => {
        const theory = buildTheory(input);
        dispatch({ type: 'SET_THEORY', theory });
        return theory;
      },
      update: (updates: Partial<Theory>): UpdateResult<Theory> => {
        const current = state().theory;
        if (!current) return undefined;
        const theory: Theory = { ...current, ...updates };
        dispatch({ type: 'UPDATE_THEORY', theory });
        return theory;
      },
      remove: () => {
        dispatch({ type: 'SET_THEORY', theory: null });
        return true;
      },
    },

    codings: {
      list: (artifactId?: string) =>
        artifactId ? state().codings.filter((c) => c.artifactId === artifactId) : state().codings,
      get: (id: string) => findById(state().codings, id),
      create: (input: Omit<Coding, 'id'>) => {
        const coding = buildCoding(input);
        dispatch({ type: 'ADD_CODING', coding });
        return coding;
      },
      update: (id: string, updates: Partial<Coding>): UpdateResult<Coding> => {
        const current = findById(state().codings, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_CODING', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().codings, id)) return false;
        dispatch({ type: 'DELETE_CODING', id });
        return true;
      },
    },

    memos: {
      list: () => state().memos,
      get: (id: string) => findById(state().memos, id),
      create: (input: Omit<Memo, 'id' | 'createdAt'>) => {
        const memo = buildMemo(input);
        dispatch({ type: 'ADD_MEMO', memo });
        return memo;
      },
      update: (id: string, updates: Partial<Memo>): UpdateResult<Memo> => {
        const current = findById(state().memos, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_MEMO', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().memos, id)) return false;
        dispatch({ type: 'DELETE_MEMO', id });
        return true;
      },
    },

    changeLog: {
      list: () => state().changeLog,
      get: (id: string) => findById(state().changeLog, id),
      create: (input: Omit<ChangeRecord, 'id' | 'timestamp'>) => {
        const record = buildChangeRecord(input);
        dispatch({ type: 'ADD_CHANGE', record });
        return record;
      },
      update: (id: string, updates: Partial<ChangeRecord>): UpdateResult<ChangeRecord> => {
        const current = findById(state().changeLog, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_CHANGE', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().changeLog, id)) return false;
        dispatch({ type: 'DELETE_CHANGE', id });
        return true;
      },
    },

    activities: {
      list: () => state().activities,
      get: (id: string) => findById(state().activities, id),
      create: (input: Omit<ActivityEntry, 'id'>) => {
        const activity = buildActivity(input);
        dispatch({ type: 'ADD_ACTIVITY', activity });
        return activity;
      },
      update: (id: string, updates: Partial<ActivityEntry>): UpdateResult<ActivityEntry> => {
        const current = findById(state().activities, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_ACTIVITY', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().activities, id)) return false;
        dispatch({ type: 'DELETE_ACTIVITY', id });
        return true;
      },
    },

    reportSections: {
      list: () => state().settings.reportSections,
      get: (id: string) => findById(state().settings.reportSections, id),
      create: (input: Omit<ReportSection, 'id'>) => {
        const section = buildReportSection(input);
        dispatch({ type: 'ADD_REPORT_SECTION', section });
        return section;
      },
      update: (id: string, updates: Partial<ReportSection>): UpdateResult<ReportSection> => {
        const current = findById(state().settings.reportSections, id);
        if (!current) return undefined;
        const section = { ...current, ...updates };
        dispatch({ type: 'UPDATE_REPORT_SECTION', section });
        return section;
      },
      remove: (id: string) => {
        if (!findById(state().settings.reportSections, id)) return false;
        dispatch({ type: 'DELETE_REPORT_SECTION', id });
        return true;
      },
    },

    consensusCriteria: {
      list: () => state().researchTeam.consensusCriteria,
      get: (id: string) => findById(state().researchTeam.consensusCriteria, id),
      create: (input: Omit<ConsensusCriteria, 'id'>) => {
        const criteria = buildConsensusCriteria(input);
        dispatch({ type: 'ADD_CONSENSUS_CRITERIA', criteria });
        return criteria;
      },
      update: (id: string, updates: Partial<ConsensusCriteria>): UpdateResult<ConsensusCriteria> => {
        const current = findById(state().researchTeam.consensusCriteria, id);
        if (!current) return undefined;
        dispatch({ type: 'UPDATE_CONSENSUS_CRITERIA', id, updates });
        return { ...current, ...updates };
      },
      remove: (id: string) => {
        if (!findById(state().researchTeam.consensusCriteria, id)) return false;
        dispatch({ type: 'DELETE_CONSENSUS_CRITERIA', id });
        return true;
      },
    },

    project: {
      get: () => state().settings,
      update: (updates: Partial<ProjectState['settings']>) => {
        dispatch({ type: 'UPDATE_SETTINGS', updates });
        return { ...state().settings, ...updates };
      },
    },

    touch,
  };
}

export type DomainCrud = ReturnType<typeof createDomainCrud>;
