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
  Vote,
} from '../types/domain';
import {
  removeById,
  updateById,
  upsertById,
} from './crud/collectionUtils';
import { createChangeRecord } from './changelog';

export type ProjectAction =
  | { type: 'LOAD'; payload: ProjectState }
  | { type: 'SET_ACTIVE_RESEARCHER'; researcherId: string }
  | { type: 'UPDATE_SETTINGS'; updates: Partial<ProjectState['settings']> }
  // Artifacts
  | { type: 'ADD_ARTIFACT'; artifact: Artifact }
  | { type: 'UPDATE_ARTIFACT'; id: string; updates: Partial<Artifact> }
  | { type: 'DELETE_ARTIFACT'; id: string }
  // Research questions
  | { type: 'ADD_RQ'; rq: ResearchQuestion }
  | { type: 'UPDATE_RQ'; rq: ResearchQuestion }
  | { type: 'DELETE_RQ'; id: string }
  // Methods
  | { type: 'ADD_METHOD'; method: Method }
  | { type: 'UPDATE_METHOD'; id: string; updates: Partial<Method> }
  | { type: 'DELETE_METHOD'; id: string }
  // Tools
  | { type: 'ADD_TOOL'; tool: Tool }
  | { type: 'UPDATE_TOOL'; id: string; updates: Partial<Tool> }
  | { type: 'DELETE_TOOL'; id: string }
  // Participants
  | { type: 'ADD_PARTICIPANT'; participant: Participant }
  | { type: 'UPDATE_PARTICIPANT'; id: string; updates: Partial<Participant> }
  | { type: 'DELETE_PARTICIPANT'; id: string }
  // Codes & categories
  | { type: 'ADD_CODE'; code: Code }
  | { type: 'UPDATE_CODE'; id: string; updates: Partial<Code> }
  | { type: 'DELETE_CODE'; id: string }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'UPDATE_CATEGORY'; id: string; updates: Partial<Category> }
  | { type: 'DELETE_CATEGORY'; id: string }
  // Theory
  | { type: 'SET_THEORY'; theory: Theory | null }
  | { type: 'UPDATE_THEORY'; theory: Theory }
  // Codings & memos
  | { type: 'ADD_CODING'; coding: Coding }
  | { type: 'UPDATE_CODING'; id: string; updates: Partial<Coding> }
  | { type: 'DELETE_CODING'; id: string }
  | { type: 'ADD_MEMO'; memo: Memo }
  | { type: 'UPDATE_MEMO'; id: string; updates: Partial<Memo> }
  | { type: 'DELETE_MEMO'; id: string }
  // Changelog & votes
  | { type: 'ADD_CHANGE'; record: ChangeRecord }
  | { type: 'UPDATE_CHANGE'; id: string; updates: Partial<ChangeRecord> }
  | { type: 'DELETE_CHANGE'; id: string }
  | { type: 'ADD_VOTE'; vote: Vote }
  | { type: 'DELETE_VOTE'; id: string }
  // Activities
  | { type: 'ADD_ACTIVITY'; activity: ActivityEntry }
  | { type: 'UPDATE_ACTIVITY'; id: string; updates: Partial<ActivityEntry> }
  | { type: 'DELETE_ACTIVITY'; id: string }
  // Report
  | { type: 'ADD_REPORT_SECTION'; section: ReportSection }
  | { type: 'UPDATE_REPORT_SECTION'; section: ReportSection }
  | { type: 'DELETE_REPORT_SECTION'; id: string }
  // Consensus criteria
  | { type: 'ADD_CONSENSUS_CRITERIA'; criteria: ConsensusCriteria }
  | { type: 'UPDATE_CONSENSUS_CRITERIA'; id: string; updates: Partial<ConsensusCriteria> }
  | { type: 'DELETE_CONSENSUS_CRITERIA'; id: string }
  // Lifecycle
  | { type: 'ADVANCE_PHASE'; artifactId: string; targetPhase: TypeOfStatus }
  | { type: 'BACKTRACK'; artifactId: string; targetPhase: TypeOfStatus; reason: string };

function touchSettings(state: ProjectState): ProjectState['settings'] {
  return { ...state.settings, updatedAt: new Date().toISOString() };
}

export function applyProjectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'LOAD':
      return action.payload;

    case 'SET_ACTIVE_RESEARCHER':
      return { ...state, activeResearcherId: action.researcherId };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...touchSettings(state), ...action.updates } };

    case 'ADD_ARTIFACT':
      return {
        ...state,
        artifacts: [...state.artifacts, action.artifact],
        settings: touchSettings(state),
      };

    case 'UPDATE_ARTIFACT':
      return {
        ...state,
        artifacts: updateById(state.artifacts, action.id, action.updates),
        settings: touchSettings(state),
      };

    case 'DELETE_ARTIFACT':
      return {
        ...state,
        artifacts: removeById(state.artifacts, action.id),
        codings: state.codings.filter((c) => c.artifactId !== action.id),
        settings: touchSettings(state),
      };

    case 'ADD_RQ':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            researchQuestions: [
              ...state.settings.theoreticalFramework.researchQuestions,
              action.rq,
            ],
          },
        },
      };

    case 'UPDATE_RQ':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            researchQuestions: updateById(
              state.settings.theoreticalFramework.researchQuestions,
              action.rq.id,
              action.rq
            ),
          },
        },
      };

    case 'DELETE_RQ':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            researchQuestions: removeById(
              state.settings.theoreticalFramework.researchQuestions,
              action.id
            ),
          },
        },
      };

    case 'ADD_METHOD':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            methods: [...state.settings.theoreticalFramework.methods, action.method],
          },
        },
      };

    case 'UPDATE_METHOD':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            methods: updateById(
              state.settings.theoreticalFramework.methods,
              action.id,
              action.updates
            ),
          },
        },
      };

    case 'DELETE_METHOD':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            methods: removeById(state.settings.theoreticalFramework.methods, action.id),
          },
        },
      };

    case 'ADD_TOOL':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            tools: [...state.settings.theoreticalFramework.tools, action.tool],
          },
        },
      };

    case 'UPDATE_TOOL':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            tools: updateById(state.settings.theoreticalFramework.tools, action.id, action.updates),
          },
        },
      };

    case 'DELETE_TOOL':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          theoreticalFramework: {
            ...state.settings.theoreticalFramework,
            tools: removeById(state.settings.theoreticalFramework.tools, action.id),
          },
        },
      };

    case 'ADD_PARTICIPANT':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          participants: [...state.settings.participants, action.participant],
        },
      };

    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          participants: updateById(state.settings.participants, action.id, action.updates),
        },
      };

    case 'DELETE_PARTICIPANT':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          participants: removeById(state.settings.participants, action.id),
        },
      };

    case 'ADD_CODE':
      return { ...state, codes: [...state.codes, action.code] };

    case 'UPDATE_CODE':
      return { ...state, codes: updateById(state.codes, action.id, action.updates) };

    case 'DELETE_CODE':
      return {
        ...state,
        codes: removeById(state.codes, action.id),
        codings: state.codings.filter((c) => c.codeId !== action.id),
        categories: state.categories.map((cat) => ({
          ...cat,
          codeIds: cat.codeIds.filter((id) => id !== action.id),
        })),
      };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] };

    case 'UPDATE_CATEGORY':
      return { ...state, categories: updateById(state.categories, action.id, action.updates) };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: removeById(state.categories, action.id),
        theory: state.theory
          ? {
              ...state.theory,
              categoryIds: state.theory.categoryIds.filter((id) => id !== action.id),
            }
          : null,
      };

    case 'SET_THEORY':
      return { ...state, theory: action.theory };

    case 'UPDATE_THEORY':
      return { ...state, theory: action.theory };

    case 'ADD_CODING':
      return { ...state, codings: [...state.codings, action.coding] };

    case 'UPDATE_CODING':
      return { ...state, codings: updateById(state.codings, action.id, action.updates) };

    case 'DELETE_CODING':
      return { ...state, codings: removeById(state.codings, action.id) };

    case 'ADD_MEMO':
      return { ...state, memos: [...state.memos, action.memo] };

    case 'UPDATE_MEMO':
      return { ...state, memos: updateById(state.memos, action.id, action.updates) };

    case 'DELETE_MEMO':
      return { ...state, memos: removeById(state.memos, action.id) };

    case 'ADD_CHANGE':
      return {
        ...state,
        changeLog: [action.record, ...state.changeLog],
        settings: touchSettings(state),
      };

    case 'UPDATE_CHANGE':
      return {
        ...state,
        changeLog: updateById(state.changeLog, action.id, action.updates),
        settings: touchSettings(state),
      };

    case 'DELETE_CHANGE':
      return {
        ...state,
        changeLog: removeById(state.changeLog, action.id),
        settings: touchSettings(state),
      };

    case 'ADD_VOTE':
      return { ...state, votes: upsertById(state.votes, action.vote) };

    case 'DELETE_VOTE':
      return { ...state, votes: removeById(state.votes, action.id) };

    case 'ADD_ACTIVITY':
      return { ...state, activities: [...state.activities, action.activity] };

    case 'UPDATE_ACTIVITY':
      return { ...state, activities: updateById(state.activities, action.id, action.updates) };

    case 'DELETE_ACTIVITY':
      return { ...state, activities: removeById(state.activities, action.id) };

    case 'ADD_REPORT_SECTION':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          reportSections: [...state.settings.reportSections, action.section],
        },
      };

    case 'UPDATE_REPORT_SECTION':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          reportSections: upsertById(state.settings.reportSections, action.section),
        },
      };

    case 'DELETE_REPORT_SECTION':
      return {
        ...state,
        settings: {
          ...touchSettings(state),
          reportSections: removeById(state.settings.reportSections, action.id),
        },
      };

    case 'ADD_CONSENSUS_CRITERIA':
      return {
        ...state,
        researchTeam: {
          ...state.researchTeam,
          consensusCriteria: [...state.researchTeam.consensusCriteria, action.criteria],
        },
      };

    case 'UPDATE_CONSENSUS_CRITERIA':
      return {
        ...state,
        researchTeam: {
          ...state.researchTeam,
          consensusCriteria: updateById(
            state.researchTeam.consensusCriteria,
            action.id,
            action.updates
          ),
        },
      };

    case 'DELETE_CONSENSUS_CRITERIA':
      return {
        ...state,
        researchTeam: {
          ...state.researchTeam,
          consensusCriteria: removeById(state.researchTeam.consensusCriteria, action.id),
        },
      };

    case 'ADVANCE_PHASE':
      return {
        ...state,
        artifacts: updateById(state.artifacts, action.artifactId, { status: action.targetPhase }),
        settings: touchSettings(state),
      };

    case 'BACKTRACK':
      return {
        ...state,
        artifacts: updateById(state.artifacts, action.artifactId, { status: action.targetPhase }),
        changeLog: [
          createChangeRecord(
            state.activeResearcherId,
            'artefact',
            `BACKTRACK: ${action.targetPhase}`,
            action.reason,
            'committed',
            undefined,
            () => `ch-backtrack-${action.artifactId}`
          ),
          ...state.changeLog,
        ],
        settings: touchSettings(state),
      };

    default:
      return state;
  }
}
