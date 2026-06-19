import type {
  Artifact,
  Category,
  Code,
  ProjectState,
  ResearchTeam,
  Vote,
} from '../types/domain';

export function createMinimalArtifact(overrides: Partial<Artifact> = {}): Artifact {
  return {
    id: 'a-test',
    hashID: 'abc123',
    name: 'Test Interview',
    content: 'Sample transcript content.',
    type: 'interview',
    media: 'text',
    access: 'private',
    status: 'acquisition',
    responsibleId: 'r1',
    curation: {
      format: 'Transcript',
      source: 'Field',
      dateCreated: '2023-01-01',
      consentObtained: true,
    },
    ...overrides,
  };
}

export function createMinimalCode(overrides: Partial<Code> = {}): Code {
  return {
    id: 'c-test',
    name: 'Test Code',
    color: '#2563eb',
    relatedCodeIds: [],
    kind: 'code',
    ...overrides,
  };
}

export function createMinimalCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 'cat-test',
    name: 'Test Category',
    codeIds: ['c-test'],
    relatedCategoryIds: [],
    level: 'descriptive',
    ...overrides,
  };
}

export function createMinimalResearchers(count = 3): ResearchTeam['researchers'] {
  return Array.from({ length: count }, (_, i) => ({
    id: `r${i + 1}`,
    name: `Researcher ${i + 1}`,
    role: i === 0 ? 'Senior' : 'Junior',
    color: '#2563eb',
    initials: `R${i + 1}`,
  })) as ResearchTeam['researchers'];
}

export function createVote(
  targetId: string,
  researcherId: string,
  decision: Vote['decision']
): Vote {
  return {
    id: `v-${targetId}-${researcherId}`,
    targetId,
    targetType: 'code',
    researcherId,
    decision,
    timestamp: '2023-01-01T00:00:00.000Z',
  };
}

export function createMinimalProjectState(overrides: Partial<ProjectState> = {}): ProjectState {
  const researchers = createMinimalResearchers(3);
  return {
    activeResearcherId: 'r1',
    settings: {
      projectName: 'Test Project',
      subtitle: 'Research Project • MENTOR',
      updatedAt: '2023-01-01T00:00:00.000Z',
      fieldOfStudy: {
        subjectOfStudy: 'Subjects',
        objectOfStudy: 'Objects',
        location: 'Montevideo',
      },
      participants: [],
      theoreticalFramework: {
        researchQuestions: [{ id: 'rq1', content: 'What is the research question?' }],
        methods: [],
        tools: [],
        bibliographyContent: '',
        methodology: 'constructivist',
      },
      reportSections: [],
    },
    artifacts: [createMinimalArtifact()],
    codes: [createMinimalCode()],
    categories: [createMinimalCategory()],
    theory: null,
    codings: [],
    memos: [],
    researchTeam: {
      id: 'team1',
      name: 'Test Team',
      researchers,
      consensusCriteria: [],
    },
    changeLog: [],
    votes: [],
    activities: [],
    ...overrides,
  };
}
