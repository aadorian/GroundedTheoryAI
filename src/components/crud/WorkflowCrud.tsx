import { useState } from 'react';
import type { ActivityEntry, ChangeRecord, ChangeCategory, TypeOfMethod } from '../../types/domain';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';
import { formatDate } from '../../lib/utils';
import {
  CrudPanel,
  CrudActionButtons,
  CrudFormActions,
  CrudField,
  inputClass,
  textareaClass,
} from './CrudPanel';

const categoryLabels: Record<ChangeCategory, string> = {
  research_question: 'Research Question',
  methods: 'Methods',
  framework: 'Theoretical Framework',
  bibliography: 'Bibliography',
  artefact: 'Artefact',
};

export function ChangeLogCrud() {
  const crud = useDomainCrud();
  const { activeResearcher, getResearcher } = useProject();
  const items = crud.changeLog.list();

  return (
    <CrudPanel<ChangeRecord>
      title="Change Log (RITL-C)"
      items={items}
      createLabel="Record change"
      onCreate={(data) =>
        crud.changeLog.create({
          authorId: activeResearcher.id,
          category: (data.category as ChangeCategory) ?? 'research_question',
          action: String(data.action ?? 'MOD: update'),
          rationale: String(data.rationale ?? ''),
          proposal: data.proposal ? String(data.proposal) : undefined,
          status: (data.status as ChangeRecord['status']) ?? 'draft',
          note: data.note ? String(data.note) : undefined,
        })
      }
      onUpdate={(id, data) => crud.changeLog.update(id, data)}
      onDelete={(id) => crud.changeLog.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 group">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-800">{item.action}</p>
              <Badge variant={item.status === 'committed' ? 'committed' : 'outline'}>
                {item.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">{item.rationale}</p>
            <p className="text-xs text-gray-400 mt-1">
              {categoryLabels[item.category]} • {getResearcher(item.authorId)?.name} •{' '}
              {formatDate(item.timestamp)}
            </p>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <ChangeForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function ChangeForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<ChangeRecord> | null;
  onSave: (data: Partial<ChangeRecord>) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<ChangeCategory>(item?.category ?? 'research_question');
  const [action, setAction] = useState(item?.action ?? '');
  const [rationale, setRationale] = useState(item?.rationale ?? '');
  const [proposal, setProposal] = useState(item?.proposal ?? '');
  const [status, setStatus] = useState<ChangeRecord['status']>(item?.status ?? 'draft');
  const [note, setNote] = useState(item?.note ?? '');

  return (
    <>
      <CrudField label="Category">
        <select
          className={inputClass}
          value={category}
          onChange={(e) => setCategory(e.target.value as ChangeCategory)}
        >
          {Object.entries(categoryLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </CrudField>
      <CrudField label="Action">
        <input className={inputClass} value={action} onChange={(e) => setAction(e.target.value)} />
      </CrudField>
      <CrudField label="Rationale">
        <textarea className={textareaClass} rows={2} value={rationale} onChange={(e) => setRationale(e.target.value)} />
      </CrudField>
      <CrudField label="Proposal">
        <textarea className={textareaClass} rows={2} value={proposal} onChange={(e) => setProposal(e.target.value)} />
      </CrudField>
      <CrudField label="Note">
        <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
      </CrudField>
      <CrudField label="Status">
        <select
          className={inputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as ChangeRecord['status'])}
        >
          <option value="draft">Draft</option>
          <option value="committed">Committed</option>
        </select>
      </CrudField>
      <CrudFormActions
        onSave={() => onSave({ category, action, rationale, proposal, status, note })}
        onCancel={onCancel}
      />
    </>
  );
}

export function ActivitiesCrud() {
  const crud = useDomainCrud();
  const { activeResearcher } = useProject();
  const items = crud.activities.list();
  const artifacts = crud.artifacts.list();

  return (
    <CrudPanel<ActivityEntry>
      title="Field Activities"
      items={items}
      createLabel="Add activity"
      onCreate={(data) =>
        crud.activities.create({
          date: String(data.date ?? new Date().toISOString().slice(0, 10)),
          dayLabel: String(data.dayLabel ?? new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })),
          artifactId: String(data.artifactId ?? artifacts[0]?.id ?? ''),
          researcherId: activeResearcher.id,
          description: String(data.description ?? ''),
          instrumentType: (data.instrumentType as TypeOfMethod) ?? 'interview',
          taskTitle: String(data.taskTitle ?? 'Field work'),
        })
      }
      onUpdate={(id, data) => crud.activities.update(id, data)}
      onDelete={(id) => crud.activities.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 group">
          <div>
            <p className="text-sm font-medium text-gray-800">{item.taskTitle}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              {item.dayLabel} • {item.instrumentType}
            </p>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <ActivityForm item={item} artifacts={artifacts} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function ActivityForm({
  item,
  artifacts,
  onSave,
  onCancel,
}: {
  item: Partial<ActivityEntry> | null;
  artifacts: { id: string; name: string }[];
  onSave: (data: Partial<ActivityEntry>) => void;
  onCancel: () => void;
}) {
  const [taskTitle, setTaskTitle] = useState(item?.taskTitle ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [instrumentType, setInstrumentType] = useState<TypeOfMethod>(item?.instrumentType ?? 'interview');
  const [artifactId, setArtifactId] = useState(item?.artifactId ?? artifacts[0]?.id ?? '');
  const [dayLabel, setDayLabel] = useState(item?.dayLabel ?? '');

  return (
    <>
      <CrudField label="Task title">
        <input className={inputClass} value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
      </CrudField>
      <CrudField label="Description">
        <textarea className={textareaClass} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </CrudField>
      <CrudField label="Instrument">
        <select
          className={inputClass}
          value={instrumentType}
          onChange={(e) => setInstrumentType(e.target.value as TypeOfMethod)}
        >
          <option value="interview">Interview</option>
          <option value="observation">Observation</option>
          <option value="survey">Survey</option>
          <option value="focusgroup">Focus group</option>
          <option value="workshop">Workshop</option>
        </select>
      </CrudField>
      <CrudField label="Artefact">
        <select className={inputClass} value={artifactId} onChange={(e) => setArtifactId(e.target.value)}>
          {artifacts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </CrudField>
      <CrudField label="Day label">
        <input className={inputClass} value={dayLabel} onChange={(e) => setDayLabel(e.target.value)} placeholder="Mon, Jun 18" />
      </CrudField>
      <CrudFormActions
        onSave={() => onSave({ taskTitle, description, instrumentType, artifactId, dayLabel })}
        onCancel={onCancel}
      />
    </>
  );
}
