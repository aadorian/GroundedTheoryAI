import { describe, expect, it } from 'vitest';
import { applyProjectReducer } from '../projectReducer';
import { createMinimalProjectState } from '../fixtures';
import { createDomainCrud } from './domainCrud';

describe('domain CRUD', () => {
  it('creates and deletes research questions', () => {
    let state = createMinimalProjectState();
    const dispatch = (action: Parameters<typeof applyProjectReducer>[1]) => {
      state = applyProjectReducer(state, action);
    };
    const crud = createDomainCrud(() => state, dispatch);

    const rq = crud.researchQuestions.create('New RQ?');
    expect(crud.researchQuestions.list()).toHaveLength(2);
    expect(crud.researchQuestions.get(rq.id)?.content).toBe('New RQ?');

    crud.researchQuestions.remove(rq.id);
    expect(crud.researchQuestions.list()).toHaveLength(1);
  });

  it('creates, updates, and deletes codes with cascade on codings', () => {
    let state = createMinimalProjectState({
      codings: [
        {
          id: 'cd1',
          artifactId: 'a-test',
          codeId: 'c-test',
          start: 0,
          end: 5,
          textSnippet: 'hello',
          researcherId: 'r1',
        },
      ],
    });
    const dispatch = (action: Parameters<typeof applyProjectReducer>[1]) => {
      state = applyProjectReducer(state, action);
    };
    const crud = createDomainCrud(() => state, dispatch);

    crud.codes.update('c-test', { name: 'Renamed' });
    expect(crud.codes.get('c-test')?.name).toBe('Renamed');

    crud.codes.remove('c-test');
    expect(crud.codes.list()).toHaveLength(0);
    expect(crud.codings.list()).toHaveLength(0);
  });

  it('manages consensus criteria CRUD', () => {
    let state = createMinimalProjectState({ researchTeam: { ...createMinimalProjectState().researchTeam, consensusCriteria: [] } });
    const dispatch = (action: Parameters<typeof applyProjectReducer>[1]) => {
      state = applyProjectReducer(state, action);
    };
    const crud = createDomainCrud(() => state, dispatch);

    const criteria = crud.consensusCriteria.create({
      name: 'Test vote',
      votingType: 'majority',
      description: 'Test',
      active: true,
    });
    expect(crud.consensusCriteria.list()).toHaveLength(1);

    crud.consensusCriteria.update(criteria.id, { active: false });
    expect(crud.consensusCriteria.get(criteria.id)?.active).toBe(false);

    crud.consensusCriteria.remove(criteria.id);
    expect(crud.consensusCriteria.list()).toHaveLength(0);
  });

  it('deletes artefacts and related codings', () => {
    let state = createMinimalProjectState({
      codings: [
        {
          id: 'cd1',
          artifactId: 'a-test',
          codeId: 'c-test',
          start: 0,
          end: 5,
          textSnippet: 'hello',
          researcherId: 'r1',
        },
      ],
    });
    const dispatch = (action: Parameters<typeof applyProjectReducer>[1]) => {
      state = applyProjectReducer(state, action);
    };
    const crud = createDomainCrud(() => state, dispatch);

    crud.artifacts.remove('a-test');
    expect(crud.artifacts.list()).toHaveLength(0);
    expect(crud.codings.list()).toHaveLength(0);
  });
});
