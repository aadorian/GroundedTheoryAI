import { describe, expect, it } from 'vitest';
import { applyProjectReducer } from './projectReducer';
import {
  createMinimalArtifact,
  createMinimalCategory,
  createMinimalCode,
  createMinimalProjectState,
} from './fixtures';

describe('projectReducer', () => {
  it('advances an artefact to the next ArtEModel-GT phase', () => {
    const state = createMinimalProjectState();
    const next = applyProjectReducer(state, {
      type: 'ADVANCE_PHASE',
      artifactId: 'a-test',
      targetPhase: 'management',
    });

    expect(next.artifacts.find((a) => a.id === 'a-test')?.status).toBe('management');
  });

  it('backtracks an artefact and records a committed changelog entry', () => {
    const state = createMinimalProjectState({
      artifacts: [createMinimalArtifact({ id: 'a-test', status: 'analysis' })],
    });

    const next = applyProjectReducer(state, {
      type: 'BACKTRACK',
      artifactId: 'a-test',
      targetPhase: 'acquisition',
      reason: 'More data required for saturation',
    });

    expect(next.artifacts.find((a) => a.id === 'a-test')?.status).toBe('acquisition');
    expect(next.changeLog[0]).toMatchObject({
      category: 'artefact',
      action: 'BACKTRACK: acquisition',
      rationale: 'More data required for saturation',
      status: 'committed',
      authorId: 'r1',
    });
  });

  it('adds codes, categories, and codings to project state', () => {
    const state = createMinimalProjectState({ codes: [], categories: [], codings: [] });
    const code = createMinimalCode({ id: 'c-new' });
    const category = createMinimalCategory({ id: 'cat-new' });

    let next = applyProjectReducer(state, { type: 'ADD_CODE', code });
    next = applyProjectReducer(next, { type: 'ADD_CATEGORY', category });
    next = applyProjectReducer(next, {
      type: 'ADD_CODING',
      coding: {
        id: 'cd1',
        artifactId: 'a-test',
        codeId: 'c-new',
        start: 0,
        end: 5,
        textSnippet: 'Sample',
        researcherId: 'r1',
      },
    });

    expect(next.codes).toHaveLength(1);
    expect(next.categories).toHaveLength(1);
    expect(next.codings).toHaveLength(1);
  });

  it('updates a research question in the theoretical framework', () => {
    const state = createMinimalProjectState();
    const next = applyProjectReducer(state, {
      type: 'UPDATE_RQ',
      rq: { id: 'rq1', content: 'Updated research question?' },
    });

    expect(next.settings.theoreticalFramework.researchQuestions[0].content).toBe(
      'Updated research question?'
    );
  });

  it('switches the active researcher', () => {
    const state = createMinimalProjectState();
    const next = applyProjectReducer(state, {
      type: 'SET_ACTIVE_RESEARCHER',
      researcherId: 'r2',
    });
    expect(next.activeResearcherId).toBe('r2');
  });

  it('adds and deletes report sections', () => {
    const state = createMinimalProjectState({ settings: { ...createMinimalProjectState().settings, reportSections: [] } });
    const withSection = applyProjectReducer(state, {
      type: 'ADD_REPORT_SECTION',
      section: { id: 'rs-new', title: 'Intro', content: 'Text', linkedArtifactIds: [] },
    });
    expect(withSection.settings.reportSections).toHaveLength(1);

    const removed = applyProjectReducer(withSection, { type: 'DELETE_REPORT_SECTION', id: 'rs-new' });
    expect(removed.settings.reportSections).toHaveLength(0);
  });
});
