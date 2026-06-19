import { useState } from 'react';
import type { Coding, Memo, Theory, MemoType, TheoryType, Code, Artifact } from '../../types/domain';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';
import {
  CrudPanel,
  CrudActionButtons,
  CrudFormActions,
  CrudField,
  inputClass,
  textareaClass,
} from './CrudPanel';

export function MemosCrud() {
  const crud = useDomainCrud();
  const { activeResearcher, getResearcher } = useProject();
  const items = crud.memos.list();

  return (
    <CrudPanel<Memo>
      title="Reflexivity Memos"
      items={items}
      createLabel="Add memo"
      onCreate={(data) =>
        crud.memos.create({
          title: String(data.title ?? 'Memo'),
          content: String(data.content ?? ''),
          relatedIds: (data.relatedIds as string[]) ?? [],
          type: (data.type as MemoType) ?? 'reflective',
          authorId: activeResearcher.id,
        })
      }
      onUpdate={(id, data) => crud.memos.update(id, data)}
      onDelete={(id) => crud.memos.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg group">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <Badge variant="outline">{item.type}</Badge>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{item.content}</p>
            <p className="text-xs text-gray-400 mt-1">{getResearcher(item.authorId)?.name}</p>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <MemoForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function MemoForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<Memo> | null;
  onSave: (data: Partial<Memo>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [content, setContent] = useState(item?.content ?? '');
  const [type, setType] = useState<MemoType>(item?.type ?? 'reflective');

  return (
    <>
      <CrudField label="Title">
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </CrudField>
      <CrudField label="Type">
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as MemoType)}>
          <option value="reflective">Reflective</option>
          <option value="methodological">Methodological</option>
          <option value="conceptual">Conceptual</option>
          <option value="descriptive">Descriptive</option>
        </select>
      </CrudField>
      <CrudField label="Content">
        <textarea className={textareaClass} rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
      </CrudField>
      <CrudFormActions onSave={() => onSave({ title, content, type })} onCancel={onCancel} />
    </>
  );
}

export function CodingsCrud() {
  const crud = useDomainCrud();
  const { getResearcher } = useProject();
  const items = crud.codings.list();
  const codes = crud.codes.list();
  const artifacts = crud.artifacts.list();

  return (
    <CrudPanel<Coding>
      title="Codings"
      items={items}
      createLabel="Add coding"
      onCreate={(data) =>
        crud.codings.create({
          artifactId: String(data.artifactId ?? artifacts[0]?.id ?? ''),
          codeId: String(data.codeId ?? codes[0]?.id ?? ''),
          start: Number(data.start ?? 0),
          end: Number(data.end ?? 0),
          textSnippet: String(data.textSnippet ?? ''),
          researcherId: String(data.researcherId ?? ''),
        })
      }
      onUpdate={(id, data) => crud.codings.update(id, data)}
      onDelete={(id) => crud.codings.remove(id)}
      renderItem={(item, actions) => {
        const code = codes.find((c: Code) => c.id === item.codeId);
        const artifact = artifacts.find((a: Artifact) => a.id === item.artifactId);
        return (
          <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 group">
            <div>
              <p className="text-sm font-medium text-gray-800">{code?.name ?? item.codeId}</p>
              <p className="text-xs text-gray-500 italic">&ldquo;{item.textSnippet}&rdquo;</p>
              <p className="text-xs text-gray-400 mt-1">
                {artifact?.name ?? item.artifactId} • {getResearcher(item.researcherId)?.name}
              </p>
            </div>
            <CrudActionButtons {...actions} />
          </div>
        );
      }}
      renderForm={(item, onSave, onCancel) => (
        <CodingForm item={item} codes={codes} artifacts={artifacts} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function CodingForm({
  item,
  codes,
  artifacts,
  onSave,
  onCancel,
}: {
  item: Partial<Coding> | null;
  codes: { id: string; name: string }[];
  artifacts: { id: string; name: string }[];
  onSave: (data: Partial<Coding>) => void;
  onCancel: () => void;
}) {
  const { activeResearcher } = useProject();
  const [artifactId, setArtifactId] = useState(item?.artifactId ?? artifacts[0]?.id ?? '');
  const [codeId, setCodeId] = useState(item?.codeId ?? codes[0]?.id ?? '');
  const [textSnippet, setTextSnippet] = useState(item?.textSnippet ?? '');
  const [start, setStart] = useState(String(item?.start ?? 0));
  const [end, setEnd] = useState(String(item?.end ?? 0));

  return (
    <>
      <CrudField label="Artefact">
        <select className={inputClass} value={artifactId} onChange={(e) => setArtifactId(e.target.value)}>
          {artifacts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </CrudField>
      <CrudField label="Code">
        <select className={inputClass} value={codeId} onChange={(e) => setCodeId(e.target.value)}>
          {codes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </CrudField>
      <CrudField label="Text snippet">
        <input className={inputClass} value={textSnippet} onChange={(e) => setTextSnippet(e.target.value)} />
      </CrudField>
      <div className="grid grid-cols-2 gap-2">
        <CrudField label="Start">
          <input type="number" className={inputClass} value={start} onChange={(e) => setStart(e.target.value)} />
        </CrudField>
        <CrudField label="End">
          <input type="number" className={inputClass} value={end} onChange={(e) => setEnd(e.target.value)} />
        </CrudField>
      </div>
      <CrudFormActions
        onSave={() =>
          onSave({
            artifactId,
            codeId,
            textSnippet,
            start: Number(start),
            end: Number(end),
            researcherId: item?.researcherId ?? activeResearcher.id,
          })
        }
        onCancel={onCancel}
      />
    </>
  );
}

export function TheoryCrud() {
  const crud = useDomainCrud();
  const theory = crud.theory.get();
  const categories = crud.categories.list();
  const items = theory ? [theory] : [];

  return (
    <CrudPanel<Theory>
      title="Emerging Theory"
      items={items}
      emptyMessage="No theory yet. Create one to document grounded findings."
      createLabel="Create theory"
      onCreate={(data) =>
        crud.theory.create({
          type: (data.type as TheoryType) ?? 'constructivist',
          content: String(data.content ?? ''),
          categoryIds: (data.categoryIds as string[]) ?? [],
        })
      }
      onUpdate={(id, data) => {
        if (theory?.id === id) crud.theory.update(data);
      }}
      onDelete={() => crud.theory.remove()}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 group">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{item.type}</Badge>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <TheoryForm item={item} categories={categories} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function TheoryForm({
  item,
  categories,
  onSave,
  onCancel,
}: {
  item: Partial<Theory> | null;
  categories: { id: string; name: string }[];
  onSave: (data: Partial<Theory>) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<TheoryType>(item?.type ?? 'constructivist');
  const [content, setContent] = useState(item?.content ?? '');
  const [categoryIds, setCategoryIds] = useState<string[]>(item?.categoryIds ?? []);

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <>
      <CrudField label="Methodology">
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as TheoryType)}>
          <option value="classic">Classic GT</option>
          <option value="constructivist">Constructivist GT</option>
          <option value="straussian">Straussian GT</option>
        </select>
      </CrudField>
      <CrudField label="Theory content">
        <textarea className={textareaClass} rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
      </CrudField>
      <CrudField label="Linked categories">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-2 py-1 text-xs rounded-full border ${
                categoryIds.includes(cat.id)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </CrudField>
      <CrudFormActions onSave={() => onSave({ type, content, categoryIds })} onCancel={onCancel} />
    </>
  );
}
