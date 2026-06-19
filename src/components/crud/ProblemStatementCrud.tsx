import { useState } from 'react';
import type { ResearchQuestion, Method, Tool } from '../../types/domain';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import {
  CrudPanel,
  CrudActionButtons,
  CrudFormActions,
  CrudField,
  inputClass,
  textareaClass,
} from './CrudPanel';

export function ResearchQuestionsCrud() {
  const crud = useDomainCrud();
  const items = crud.researchQuestions.list();

  return (
    <CrudPanel<ResearchQuestion>
      title="Research Questions"
      items={items}
      createLabel="Add RQ"
      onCreate={(data) => crud.researchQuestions.create(String(data.content ?? ''))}
      onUpdate={(id, data) => crud.researchQuestions.update(id, String(data.content ?? ''))}
      onDelete={(id) => crud.researchQuestions.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 group">
          <p className="text-sm text-gray-700 flex-1 pr-2">{item.content}</p>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <RQForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function RQForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<ResearchQuestion> | null;
  onSave: (data: Partial<ResearchQuestion>) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(item?.content ?? '');
  return (
    <>
      <CrudField label="Research question">
        <textarea
          className={textareaClass}
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CrudField>
      <CrudFormActions onSave={() => onSave({ content })} onCancel={onCancel} />
    </>
  );
}

export function MethodsCrud() {
  const crud = useDomainCrud();
  const items = crud.methods.list();

  return (
    <CrudPanel<Method>
      title="Methods"
      items={items}
      createLabel="Add method"
      onCreate={(data) => crud.methods.create(data as Partial<Method>)}
      onUpdate={(id, data) => crud.methods.update(id, data)}
      onDelete={(id) => crud.methods.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 group">
          <div>
            <p className="text-sm font-medium text-gray-800 capitalize">{item.type}</p>
            <p className="text-xs text-gray-400">
              {item.location} • {item.informantCount ?? 0} informants
            </p>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <MethodForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function MethodForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<Method> | null;
  onSave: (data: Partial<Method>) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState(item?.type ?? 'interview');
  const [location, setLocation] = useState(item?.location ?? '');
  const [informantCount, setInformantCount] = useState(String(item?.informantCount ?? 0));
  const [protocolContent, setProtocolContent] = useState(item?.protocolContent ?? '');

  return (
    <>
      <CrudField label="Type">
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as Method['type'])}>
          <option value="interview">Interview</option>
          <option value="observation">Observation</option>
          <option value="survey">Survey</option>
          <option value="focusgroup">Focus group</option>
          <option value="workshop">Workshop</option>
        </select>
      </CrudField>
      <CrudField label="Location">
        <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
      </CrudField>
      <CrudField label="Informants">
        <input
          type="number"
          className={inputClass}
          value={informantCount}
          onChange={(e) => setInformantCount(e.target.value)}
        />
      </CrudField>
      <CrudField label="Protocol">
        <textarea
          className={textareaClass}
          rows={3}
          value={protocolContent}
          onChange={(e) => setProtocolContent(e.target.value)}
        />
      </CrudField>
      <CrudFormActions
        onSave={() =>
          onSave({
            type,
            location,
            informantCount: Number(informantCount),
            protocolContent,
          })
        }
        onCancel={onCancel}
      />
    </>
  );
}

export function ToolsCrud() {
  const crud = useDomainCrud();
  const items = crud.tools.list();

  return (
    <CrudPanel<Tool>
      title="Tools & Software"
      items={items}
      createLabel="Add tool"
      onCreate={(data) =>
        crud.tools.create({
          name: String(data.name ?? 'New tool'),
          referenceURL: data.referenceURL ? String(data.referenceURL) : undefined,
          version: data.version ? String(data.version) : undefined,
        })
      }
      onUpdate={(id, data) => crud.tools.update(id, data)}
      onDelete={(id) => crud.tools.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 group">
          <div>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            {item.referenceURL && (
              <a href={item.referenceURL} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                {item.referenceURL}
              </a>
            )}
            {item.version && <p className="text-xs text-gray-400">v{item.version}</p>}
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <ToolForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function ToolForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<Tool> | null;
  onSave: (data: Partial<Tool>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [referenceURL, setReferenceURL] = useState(item?.referenceURL ?? '');
  const [version, setVersion] = useState(item?.version ?? '');

  return (
    <>
      <CrudField label="Name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </CrudField>
      <CrudField label="Reference URL">
        <input className={inputClass} value={referenceURL} onChange={(e) => setReferenceURL(e.target.value)} />
      </CrudField>
      <CrudField label="Version">
        <input className={inputClass} value={version} onChange={(e) => setVersion(e.target.value)} />
      </CrudField>
      <CrudFormActions
        onSave={() => onSave({ name, referenceURL: referenceURL || undefined, version: version || undefined })}
        onCancel={onCancel}
      />
    </>
  );
}
