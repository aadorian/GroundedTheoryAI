import type { ProjectState } from '../types/domain';

const INTERVIEW_1 = `Interviewer: How do you interpret the sociocultural messages in the photo murals of Montevideo?

Participant: The murals on 18 de Julio tell stories of resistance. You see faces of disappeared activists, symbols of memory, and also commercial branding creeping in. It's a tension between protest and spectacle.

Interviewer: Can you describe how communication happens through these murals?

Participant: People stop, photograph, share on social networks. The mural becomes a node in a network of meanings. Some are ephemeral—painted over within weeks—but the digital trace persists.

Interviewer: What role does the urban context play?

Participant: Montevideo's walls are a public archive. Unlike a museum, they're accessible, contested, and constantly rewritten by different social groups.`;

const INTERVIEW_2 = `Interviewer: What types of sociocultural communication do you observe in neighborhood murals?

Participant: In Palermo and Cordón, murals function as territorial markers. Youth groups, feminist collectives, and political parties all claim visual space.

Interviewer: How does this differ from other forms of urban communication?

Participant: Murals are slower, more deliberate. Graffiti tags are quick signatures; murals require planning, funding sometimes, community approval. The communication is layered—visual, symbolic, and often textual.`;

const INTERVIEW_3 = `Interviewer: Tell us about your experience documenting mural practices.

Participant: We walked the city for three months, photographing and interviewing muralists. The grounded approach revealed categories we didn't anticipate: memorial murals, commercial murals, and hybrid forms that blend both.`;

export const SEED_PROJECT: ProjectState = {
  activeResearcherId: 'r1',
  settings: {
    projectName: 'Curation and Exploration',
    subtitle: 'Research Project • MENTOR',
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    fieldOfStudy: {
      subjectOfStudy: 'Urban muralists and passersby',
      objectOfStudy: 'Sociocultural communication in photo murals of Montevideo',
      location: 'Montevideo, Uruguay',
    },
    participants: [
      { id: 'p1', anonymizedCode: 'P-001', description: 'Mural artist, Cordón', isCoConstructor: true },
      { id: 'p2', anonymizedCode: 'P-002', description: 'Communication student, FIC', isCoConstructor: true },
      { id: 'p3', anonymizedCode: 'P-003', description: 'Urban photographer', isCoConstructor: false },
    ],
    theoreticalFramework: {
      methodology: 'constructivist',
      researchQuestions: [
        {
          id: 'rq1',
          content:
            'What type of sociocultural communication are present in the photo murals of Montevideo?',
        },
        {
          id: 'rq2',
          content:
            'How do digital and physical reading practices hybridise in the circulation of mural meanings?',
        },
      ],
      methods: [
        {
          id: 'm1',
          type: 'interview',
          protocolContent:
            'Semi-structured interview protocol: (1) Introduction and consent, (2) Perception of murals, (3) Communication patterns, (4) Urban context, (5) Closing reflections.',
          location: 'Montevideo, Uruguay',
          informantCount: 23,
          participantIds: ['p1', 'p2', 'p3'],
        },
        {
          id: 'm2',
          type: 'observation',
          protocolContent:
            'Participant observation in mural districts: Palermo, Cordón, Ciudad Vieja. Field notes every session.',
          location: 'Montevideo, Uruguay',
        },
      ],
      tools: [
        { id: 't1', name: 'Mentor CAQDAS', version: '1.0.0', referenceURL: 'https://mentor.app' },
        { id: 't2', name: 'Google Drive', version: '2023', referenceURL: 'https://drive.google.com' },
        { id: 't3', name: 'Canva', version: '2023' },
      ],
      bibliographyContent:
        'Glaser, B. G., & Strauss, A. L. (1967). The Discovery of Grounded Theory.\nCharmaz, K. (2006). Constructing Grounded Theory.',
      attachedDocuments: [
        { name: 'The Discovery of Grounded Theory', size: '1.5kb', type: 'docx' },
      ],
    },
    reportSections: [
      {
        id: 'rs1',
        title: 'Background',
        content:
          'This study examines sociocultural communication in photo murals of Montevideo, applying constructivist Grounded Theory to understand how urban visual culture mediates social meaning.',
        linkedArtifactIds: ['a1'],
      },
      {
        id: 'rs2',
        title: 'Methods',
        content:
          'We conducted 23 semi-structured interviews and participant observation across mural districts. Descriptive and analytical coding manuals guided the iterative analysis.',
        linkedArtifactIds: ['a1', 'a2', 'a3'],
      },
      {
        id: 'rs3',
        title: 'Results',
        content:
          'Emerging categories include Resistance Memory, Digital Circulation, and Territorial Marking. Murals function as hybrid communication nodes bridging physical and digital networks.',
        linkedArtifactIds: ['a1', 'a2'],
      },
      {
        id: 'rs4',
        title: 'Conclusion',
        content:
          'Photo murals in Montevideo constitute a transmedia sociocultural communication system. Researchers must curate both physical artefacts and their digital traces for reproducibility.',
        linkedArtifactIds: [],
      },
    ],
  },
  researchTeam: {
    id: 'team1',
    name: 'MENTOR Research Group',
    researchers: [
      { id: 'r1', name: 'Regina Motz', role: 'Senior', color: '#2563eb', initials: 'RM' },
      { id: 'r2', name: 'Rosalia Winocur', role: 'Senior', color: '#7c3aed', initials: 'RW' },
      { id: 'r3', name: 'Soledad Morales', role: 'Junior', color: '#059669', initials: 'SM' },
      { id: 'r4', name: 'Magela Cabrera', role: 'Junior', color: '#d97706', initials: 'MC' },
    ],
    consensusCriteria: [
      {
        id: 'cc1',
        name: 'Coding Approval',
        votingType: 'majority',
        description: 'Majority vote required to approve open codes before categorisation.',
        active: true,
      },
      {
        id: 'cc2',
        name: 'Category Saturation',
        votingType: 'consensus',
        description: 'Team consensus required when declaring category saturation.',
        active: true,
      },
      {
        id: 'cc3',
        name: 'Phase Transition',
        votingType: 'unanimous',
        description: 'Unanimous approval to advance artefacts to the next research phase.',
        active: true,
      },
    ],
  },
  artifacts: [
    {
      id: 'a1',
      hashID: 'f2bdb03a014327e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      name: 'Interview Transcript - Participant A',
      content: INTERVIEW_1,
      type: 'interview',
      media: 'text',
      access: 'private',
      status: 'analysis',
      responsibleId: 'r2',
      description: 'Field interview on mural communication in 18 de Julio',
      taskTitle: 'Reading Interview',
      instrumentType: 'interview',
      curation: {
        format: 'Transcript (Markdown)',
        source: 'Field Interview',
        dateCreated: '2022-10-17',
        consentObtained: true,
        participantId: 'p1',
      },
    },
    {
      id: 'a2',
      hashID: '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
      name: 'Interview Transcript - Participant B',
      content: INTERVIEW_2,
      type: 'interview',
      media: 'text',
      access: 'private',
      status: 'management',
      responsibleId: 'r3',
      description: 'Interview on territorial mural markers',
      taskTitle: 'Survey Participants',
      instrumentType: 'interview',
      curation: {
        format: 'Transcript (Markdown)',
        source: 'Field Interview',
        dateCreated: '2022-07-22',
        consentObtained: true,
        participantId: 'p2',
      },
    },
    {
      id: 'a3',
      hashID: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      name: 'Observation Notes - Mural Districts',
      content: INTERVIEW_3,
      type: 'observation',
      media: 'text',
      access: 'private',
      status: 'acquisition',
      responsibleId: 'r4',
      description: 'Participant observation field notes',
      taskTitle: 'Workshop',
      instrumentType: 'observation',
      curation: {
        format: 'Field Notes',
        source: 'Researcher Observation',
        dateCreated: '2022-07-17',
        consentObtained: true,
      },
    },
    {
      id: 'a4',
      hashID: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      name: 'Descriptive Categories Manual',
      content:
        'Descriptive categories: (1) Visual Symbolism, (2) Textual Layer, (3) Urban Context, (4) Digital Trace, (5) Collective Memory.',
      type: 'document',
      media: 'text',
      access: 'public',
      status: 'analysis',
      responsibleId: 'r1',
      curation: {
        format: 'Coding Manual',
        source: 'Team Consensus',
        dateCreated: '2022-10-20',
        consentObtained: true,
      },
    },
    {
      id: 'a5',
      hashID: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
      name: 'Video Documentation - Mural Walk',
      content: '[Video placeholder: 12min walk-through of Cordón murals]',
      type: 'observation',
      media: 'video',
      access: 'private',
      status: 'acquisition',
      responsibleId: 'r2',
      description: 'Video documentation of mural sites',
      taskTitle: 'Reading Interview',
      instrumentType: 'interview',
      curation: {
        format: 'MP4 Video',
        source: 'Field Recording',
        dateCreated: '2022-10-17',
        consentObtained: true,
      },
    },
  ],
  codes: [
    { id: 'c1', name: 'Resistance Memory', color: '#ef4444', relatedCodeIds: [], kind: 'code' },
    { id: 'c2', name: 'Digital Circulation', color: '#3b82f6', relatedCodeIds: [], kind: 'code' },
    { id: 'c3', name: 'Territorial Marking', color: '#f59e0b', relatedCodeIds: [], kind: 'code' },
    { id: 'c4', name: 'Protest vs Spectacle', color: '#8b5cf6', relatedCodeIds: ['c1'], kind: 'code' },
    { id: 'c5', name: 'Public Archive', color: '#10b981', relatedCodeIds: [], kind: 'code' },
    { id: 'c6', name: 'Hybrid Communication', color: '#ec4899', relatedCodeIds: ['c2', 'c3'], kind: 'category' },
    { id: 'c7', name: 'Ephemeral Trace', color: '#6366f1', relatedCodeIds: ['c2'], kind: 'code' },
    { id: 'c8', name: 'Community Authorship', color: '#14b8a6', relatedCodeIds: [], kind: 'code' },
  ],
  categories: [
    {
      id: 'cat1',
      name: 'Memorial Communication',
      codeIds: ['c1', 'c4'],
      relatedCategoryIds: ['cat2'],
      level: 'descriptive',
    },
    {
      id: 'cat2',
      name: 'Transmedia Circulation',
      codeIds: ['c2', 'c7'],
      relatedCategoryIds: ['cat1', 'cat3'],
      level: 'analytical',
    },
    {
      id: 'cat3',
      name: 'Urban Territoriality',
      codeIds: ['c3', 'c5', 'c8'],
      relatedCategoryIds: ['cat2'],
      level: 'analytical',
    },
    {
      id: 'cat4',
      name: 'Sociocultural Hybridisation',
      codeIds: ['c6'],
      relatedCategoryIds: [],
      level: 'analytical',
    },
  ],
  theory: {
    id: 'th1',
    type: 'constructivist',
    content:
      'Photo murals in Montevideo function as transmedia sociocultural communication nodes. Physical walls and digital traces co-construct meaning through iterative community authorship, memorial practices, and territorial marking. The emerging theory posits that mural communication is neither purely protest nor spectacle, but a hybrid system where researchers and participants co-construct interpretive categories.',
    categoryIds: ['cat1', 'cat2', 'cat3', 'cat4'],
  },
  codings: [
    { id: 'cd1', artifactId: 'a1', codeId: 'c1', start: 52, end: 62, textSnippet: 'resistance', researcherId: 'r2' },
    { id: 'cd2', artifactId: 'a1', codeId: 'c2', start: 280, end: 298, textSnippet: 'share on social networks', researcherId: 'r2' },
    { id: 'cd3', artifactId: 'a1', codeId: 'c5', start: 380, end: 393, textSnippet: 'public archive', researcherId: 'r1' },
    { id: 'cd4', artifactId: 'a2', codeId: 'c3', start: 95, end: 114, textSnippet: 'territorial markers', researcherId: 'r3' },
    { id: 'cd5', artifactId: 'a2', codeId: 'c8', start: 120, end: 145, textSnippet: 'youth groups, feminist', researcherId: 'r3' },
  ],
  memos: [
    {
      id: 'm1',
      title: 'Reflexivity on mural authorship',
      content:
        'As researchers, we must acknowledge our position as urban observers. The constructivist lens requires treating participants as co-constructors of mural meaning.',
      relatedIds: ['a1'],
      createdAt: '2022-10-18T10:00:00Z',
      type: 'reflective',
      authorId: 'r1',
      segment: { start: 52, end: 62, text: 'resistance' },
    },
    {
      id: 'm2',
      title: 'Methodological note on saturation',
      content:
        'Category saturation appears reached for Memorial Communication. Team discussion scheduled to confirm consensus before theorisation.',
      relatedIds: ['cat1'],
      createdAt: '2022-10-19T14:30:00Z',
      type: 'methodological',
      authorId: 'r2',
    },
  ],
  changeLog: [
    {
      id: 'ch1',
      timestamp: '2022-10-20T05:20:00Z',
      authorId: 'r1',
      category: 'research_question',
      action: 'ADD: fixed RQ',
      rationale:
        'Refined RQ1 to explicitly reference sociocultural communication rather than generic mural content. Aligns with constructivist GT approach.',
      proposal: 'Updated research question wording for clarity and methodological rigour.',
      status: 'committed',
      note: 'The research question was reformulated after team review to better capture the hybrid digital-physical communication dimension observed in fieldwork.',
    },
    {
      id: 'ch2',
      timestamp: '2022-10-17T17:00:00Z',
      authorId: 'r2',
      category: 'artefact',
      action: 'ADD: Interview RW50011',
      rationale: 'New interview transcript uploaded from field session in Cordón.',
      status: 'committed',
    },
    {
      id: 'ch3',
      timestamp: '2022-10-15T09:00:00Z',
      authorId: 'r3',
      category: 'methods',
      action: 'MOD: Interview protocol v2',
      rationale: 'Added section on digital circulation based on pilot interviews.',
      status: 'committed',
    },
    {
      id: 'ch4',
      timestamp: '2022-10-12T11:00:00Z',
      authorId: 'r1',
      category: 'framework',
      action: 'ADD: Grounded Theory framework',
      rationale: 'Adopted constructivist GT as primary methodology.',
      status: 'committed',
    },
    {
      id: 'ch5',
      timestamp: '2022-10-10T08:00:00Z',
      authorId: 'r4',
      category: 'bibliography',
      action: 'ADD: Charmaz (2006)',
      rationale: 'Key reference for constructivist coding approach.',
      status: 'committed',
    },
    {
      id: 'ch6',
      timestamp: '2022-10-22T16:00:00Z',
      authorId: 'r2',
      category: 'artefact',
      action: 'MOD: Descriptive coding manual',
      rationale: 'Team consensus on 5 descriptive categories after reviewing 23 interviews.',
      status: 'draft',
    },
  ],
  votes: [
    { id: 'v1', targetId: 'c1', targetType: 'code', researcherId: 'r1', decision: 'approve', timestamp: '2022-10-19T10:00:00Z' },
    { id: 'v2', targetId: 'c1', targetType: 'code', researcherId: 'r2', decision: 'approve', timestamp: '2022-10-19T10:05:00Z' },
    { id: 'v3', targetId: 'c1', targetType: 'code', researcherId: 'r3', decision: 'approve', timestamp: '2022-10-19T10:10:00Z' },
    { id: 'v4', targetId: 'cat1', targetType: 'category', researcherId: 'r1', decision: 'approve', timestamp: '2022-10-20T09:00:00Z' },
    { id: 'v5', targetId: 'cat1', targetType: 'category', researcherId: 'r2', decision: 'approve', timestamp: '2022-10-20T09:05:00Z' },
  ],
  activities: [
    {
      id: 'act1',
      date: '2022-07-22',
      dayLabel: '22 JUL, WED',
      artifactId: 'a2',
      researcherId: 'r3',
      description: 'Description',
      instrumentType: 'interview',
      taskTitle: 'Reading Interview',
    },
    {
      id: 'act2',
      date: '2022-07-17',
      dayLabel: '17 JUL, WED',
      artifactId: 'a3',
      researcherId: 'r4',
      description: 'Description',
      instrumentType: 'observation',
      taskTitle: 'Survey Participants',
    },
    {
      id: 'act3',
      date: '2022-07-17',
      dayLabel: '17 JUL, WED',
      artifactId: 'a5',
      researcherId: 'r2',
      description: 'Description',
      instrumentType: 'interview',
      taskTitle: 'Workshop',
    },
    {
      id: 'act4',
      date: '2022-10-17',
      dayLabel: '17 OCT, MON',
      artifactId: 'a1',
      researcherId: 'r2',
      description: 'Interview session Cordón district',
      instrumentType: 'interview',
      taskTitle: 'Reading Interview',
    },
  ],
};

export function artifactDisplayId(artifactId: string): string {
  const map: Record<string, string> = {
    a1: 'RW50011',
    a2: 'SM59001',
    a3: 'MC52991',
    a4: 'RM51001',
    a5: 'RW50011',
  };
  return map[artifactId] ?? artifactId.toUpperCase();
}
