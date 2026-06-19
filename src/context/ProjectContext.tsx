import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import {
  reducer,
  loadState,
  getNextPhase,
  getPrevPhase,
  createChangeRecord,
  createVote,
  evaluateConsensus,
  exportProjectJson,
  exportMarkdownReport,
  exportRoCrate,
  downloadBlob,
  checkPrivacyForExport,
  type ProjectAction,
} from '../store/projectStore';
import type {
  Artifact,
  Category,
  ChangeCategory,
  Code,
  Coding,
  Memo,
  ProjectState,
  ReportSection,
  ResearchQuestion,
  Theory,
  TypeOfStatus,
  VoteDecision,
} from '../types/domain';
import { SEED_PROJECT } from '../lib/seedData';

interface ProjectContextValue {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  activeResearcher: ProjectState['researchTeam']['researchers'][0];
  getResearcher: (id: string) => ProjectState['researchTeam']['researchers'][0] | undefined;
  advanceArtifactPhase: (artifactId: string) => boolean;
  backtrackArtifact: (artifactId: string, targetPhase: TypeOfStatus, reason: string) => void;
  addChange: (
    category: ChangeCategory,
    action: string,
    rationale: string,
    status?: 'committed' | 'draft',
    note?: string
  ) => void;
  castVote: (
    targetId: string,
    targetType: 'code' | 'category' | 'theory' | 'phase_transition' | 'artefact',
    decision: VoteDecision
  ) => void;
  addCoding: (artifactId: string, codeId: string, start: number, end: number, text: string) => void;
  addCode: (name: string, color?: string) => Code;
  addMemo: (memo: Omit<Memo, 'id' | 'createdAt' | 'authorId'>) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  updateRQ: (rq: ResearchQuestion) => void;
  updateReportSection: (section: ReportSection) => void;
  updateTheory: (content: string) => void;
  addCategory: (name: string, codeIds: string[], level: 'descriptive' | 'analytical') => void;
  exportJson: () => Promise<void>;
  exportMarkdown: () => Promise<void>;
  exportRoCrateBundle: (acknowledgePrivate?: boolean) => Promise<void>;
  resetProject: () => void;
  getConsensusStatus: (
    targetId: string,
    votingType: 'unanimous' | 'majority' | 'consensus'
  ) => ReturnType<typeof evaluateConsensus>;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  const activeResearcher =
    state.researchTeam.researchers.find((r) => r.id === state.activeResearcherId) ??
    state.researchTeam.researchers[0];

  const getResearcher = useCallback(
    (id: string) => state.researchTeam.researchers.find((r) => r.id === id),
    [state.researchTeam.researchers]
  );

  const addChange = useCallback(
    (
      category: ChangeCategory,
      action: string,
      rationale: string,
      status: 'committed' | 'draft' = 'draft',
      note?: string
    ) => {
      dispatch({
        type: 'ADD_CHANGE',
        record: createChangeRecord(activeResearcher.id, category, action, rationale, status, note),
      });
    },
    [activeResearcher.id]
  );

  const advanceArtifactPhase = useCallback(
    (artifactId: string): boolean => {
      const artifact = state.artifacts.find((a) => a.id === artifactId);
      if (!artifact) return false;
      const next = getNextPhase(artifact.status);
      if (!next) return false;

      const criteria = state.researchTeam.consensusCriteria.find(
        (c) => c.name === 'Phase Transition' && c.active
      );
      if (criteria) {
        const transitionId = `${artifactId}-${next}`;
        const status = evaluateConsensus(
          state.votes,
          transitionId,
          state.researchTeam.researchers,
          criteria.votingType
        );
        if (!status.met) return false;
      }

      dispatch({ type: 'ADVANCE_PHASE', artifactId, targetPhase: next });
      addChange('artefact', `ADVANCE: ${artifact.status} → ${next}`, `Phase transition for ${artifact.name}`, 'committed');
      return true;
    },
    [state.artifacts, state.votes, state.researchTeam, addChange]
  );

  const backtrackArtifact = useCallback(
    (artifactId: string, targetPhase: TypeOfStatus, reason: string) => {
      dispatch({ type: 'BACKTRACK', artifactId, targetPhase, reason });
    },
    []
  );

  const castVote = useCallback(
    (
      targetId: string,
      targetType: 'code' | 'category' | 'theory' | 'phase_transition' | 'artefact',
      decision: VoteDecision
    ) => {
      dispatch({
        type: 'ADD_VOTE',
        vote: createVote(targetId, targetType, state.activeResearcherId, decision),
      });
    },
    [state.activeResearcherId]
  );

  const addCoding = useCallback(
    (artifactId: string, codeId: string, start: number, end: number, text: string) => {
      const coding: Coding = {
        id: `cd-${Date.now()}`,
        artifactId,
        codeId,
        start,
        end,
        textSnippet: text,
        researcherId: state.activeResearcherId,
      };
      dispatch({ type: 'ADD_CODING', coding });
    },
    [state.activeResearcherId]
  );

  const addCode = useCallback(
    (name: string, color = '#6366f1'): Code => {
      const code: Code = {
        id: `c-${Date.now()}`,
        name,
        color,
        relatedCodeIds: [],
        kind: 'code',
      };
      dispatch({ type: 'ADD_CODE', code });
      addChange('artefact', `ADD: code "${name}"`, 'New open code created during analysis', 'draft');
      return code;
    },
    [addChange]
  );

  const addMemo = useCallback(
    (memo: Omit<Memo, 'id' | 'createdAt' | 'authorId'>) => {
      dispatch({
        type: 'ADD_MEMO',
        memo: {
          ...memo,
          id: `memo-${Date.now()}`,
          createdAt: new Date().toISOString(),
          authorId: state.activeResearcherId,
        },
      });
    },
    [state.activeResearcherId]
  );

  const updateArtifact = useCallback((id: string, updates: Partial<Artifact>) => {
    dispatch({ type: 'UPDATE_ARTIFACT', id, updates });
  }, []);

  const updateRQ = useCallback(
    (rq: ResearchQuestion) => {
      dispatch({ type: 'UPDATE_RQ', rq });
      addChange('research_question', `MOD: ${rq.id}`, rq.content, 'draft');
    },
    [addChange]
  );

  const updateReportSection = useCallback((section: ReportSection) => {
    dispatch({ type: 'UPDATE_REPORT_SECTION', section });
  }, []);

  const updateTheory = useCallback(
    (content: string) => {
      const theory: Theory = {
        id: state.theory?.id ?? 'th1',
        type: state.settings.theoreticalFramework.methodology,
        content,
        categoryIds: state.categories.map((c) => c.id),
      };
      dispatch({ type: 'UPDATE_THEORY', theory });
    },
    [state.theory, state.settings.theoreticalFramework.methodology, state.categories]
  );

  const addCategory = useCallback(
    (name: string, codeIds: string[], level: 'descriptive' | 'analytical') => {
      const category: Category = {
        id: `cat-${Date.now()}`,
        name,
        codeIds,
        relatedCategoryIds: [],
        level,
      };
      dispatch({ type: 'ADD_CATEGORY', category });
      addChange('framework', `ADD: category "${name}"`, `New ${level} category`, 'draft');
    },
    [addChange]
  );

  const exportJson = useCallback(async () => {
    const blob = await exportProjectJson(state);
    downloadBlob(blob, 'mentor-project.json');
  }, [state]);

  const exportMarkdown = useCallback(async () => {
    const blob = await exportMarkdownReport(state);
    downloadBlob(blob, 'mentor-report.md');
  }, [state]);

  const exportRoCrateBundle = useCallback(
    async (acknowledgePrivate = false) => {
      const { safe, privateCount } = checkPrivacyForExport(state.artifacts);
      if (!safe && !acknowledgePrivate) {
        alert(
          `Export contains ${privateCount} private artefact(s). Re-export with acknowledgment to proceed.`
        );
        return;
      }
      const blob = await exportRoCrate(state);
      downloadBlob(blob, 'mentor-project-rocrate.zip');
    },
    [state]
  );

  const resetProject = useCallback(() => {
    dispatch({ type: 'LOAD', payload: SEED_PROJECT });
  }, []);

  const getConsensusStatus = useCallback(
    (targetId: string, votingType: 'unanimous' | 'majority' | 'consensus') =>
      evaluateConsensus(state.votes, targetId, state.researchTeam.researchers, votingType),
    [state.votes, state.researchTeam.researchers]
  );

  return (
    <ProjectContext.Provider
      value={{
        state,
        dispatch,
        activeResearcher,
        getResearcher,
        advanceArtifactPhase,
        backtrackArtifact,
        addChange,
        castVote,
        addCoding,
        addCode,
        addMemo,
        updateArtifact,
        updateRQ,
        updateReportSection,
        updateTheory,
        addCategory,
        exportJson,
        exportMarkdown,
        exportRoCrateBundle,
        resetProject,
        getConsensusStatus,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}

export { useDomainCrud } from '../hooks/useDomainCrud';
export { getNextPhase, getPrevPhase };
