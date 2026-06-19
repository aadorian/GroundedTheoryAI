import { useState } from 'react';
import type { Code, Category } from '../../types/domain';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import { Badge } from '../shared/Badge';
import {
  CrudPanel,
  CrudActionButtons,
  CrudFormActions,
  CrudField,
  inputClass,
} from './CrudPanel';

export function CodesCrud() {
  const crud = useDomainCrud();
  const items = crud.codes.list('code');

  return (
    <CrudPanel<Code>
      title="Open Codes"
      items={items}
      createLabel="Add code"
      onCreate={(data) =>
        crud.codes.create({
          name: String(data.name ?? 'New code'),
          color: String(data.color ?? '#6366f1'),
          relatedCodeIds: [],
          kind: 'code',
        })
      }
      onUpdate={(id, data) => crud.codes.update(id, data)}
      onDelete={(id) => crud.codes.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 group">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-800">{item.name}</span>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <CodeForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function CodeForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<Code> | null;
  onSave: (data: Partial<Code>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [color, setColor] = useState(item?.color ?? '#6366f1');
  return (
    <>
      <CrudField label="Code name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </CrudField>
      <CrudField label="Color">
        <input type="color" className="h-9 w-full" value={color} onChange={(e) => setColor(e.target.value)} />
      </CrudField>
      <CrudFormActions onSave={() => onSave({ name, color })} onCancel={onCancel} />
    </>
  );
}

export function CategoriesCrud() {
  const crud = useDomainCrud();
  const codes = crud.codes.list('code');
  const items = crud.categories.list();

  return (
    <CrudPanel<Category>
      title="Categories"
      items={items}
      createLabel="Add category"
      onCreate={(data) =>
        crud.categories.create({
          name: String(data.name ?? 'New category'),
          codeIds: (data.codeIds as string[]) ?? [],
          relatedCategoryIds: [],
          level: (data.level as Category['level']) ?? 'descriptive',
        })
      }
      onUpdate={(id, data) => crud.categories.update(id, data)}
      onDelete={(id) => crud.categories.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg group">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium text-gray-900">{item.name}</p>
              <Badge variant="outline">{item.level}</Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.codeIds.map((codeId) => {
                const code = codes.find((c: Code) => c.id === codeId);
                return code ? (
                  <Badge key={codeId} variant="muted">
                    {code.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <CategoryForm item={item} codes={codes} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function CategoryForm({
  item,
  codes,
  onSave,
  onCancel,
}: {
  item: Partial<Category> | null;
  codes: Code[];
  onSave: (data: Partial<Category>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [level, setLevel] = useState<Category['level']>(item?.level ?? 'descriptive');
  const [codeIds, setCodeIds] = useState<string[]>(item?.codeIds ?? []);

  const toggleCode = (id: string) => {
    setCodeIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <>
      <CrudField label="Category name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </CrudField>
      <CrudField label="Level">
        <select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value as Category['level'])}>
          <option value="descriptive">Descriptive</option>
          <option value="analytical">Analytical</option>
        </select>
      </CrudField>
      <CrudField label="Linked codes">
        <div className="flex flex-wrap gap-2">
          {codes.map((code) => (
            <button
              key={code.id}
              type="button"
              onClick={() => toggleCode(code.id)}
              className={`px-2 py-1 text-xs rounded-full border ${
                codeIds.includes(code.id)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              {code.name}
            </button>
          ))}
        </div>
      </CrudField>
      <CrudFormActions onSave={() => onSave({ name, level, codeIds })} onCancel={onCancel} />
    </>
  );
}
