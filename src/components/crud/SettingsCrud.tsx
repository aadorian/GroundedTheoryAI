import { useState } from 'react';
import type { Participant, ConsensusCriteria, ReportSection } from '../../types/domain';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import { Badge } from '../shared/Badge';
import {
  CrudPanel,
  CrudActionButtons,
  CrudFormActions,
  CrudField,
  inputClass,
  textareaClass,
} from './CrudPanel';

export function ParticipantsCrud() {
  const crud = useDomainCrud();
  const items = crud.participants.list();

  return (
    <CrudPanel<Participant>
      title="Participants"
      items={items}
      createLabel="Add participant"
      onCreate={(data) =>
        crud.participants.create({
          anonymizedCode: String(data.anonymizedCode ?? 'P-000'),
          description: String(data.description ?? ''),
          isCoConstructor: Boolean(data.isCoConstructor),
        })
      }
      onUpdate={(id, data) => crud.participants.update(id, data)}
      onDelete={(id) => crud.participants.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 group">
          <div>
            <p className="text-sm font-medium text-gray-800">{item.anonymizedCode}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
            {item.isCoConstructor && <Badge variant="methodology">Co-constructor</Badge>}
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <ParticipantForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function ParticipantForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<Participant> | null;
  onSave: (data: Partial<Participant>) => void;
  onCancel: () => void;
}) {
  const [anonymizedCode, setAnonymizedCode] = useState(item?.anonymizedCode ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [isCoConstructor, setIsCoConstructor] = useState(item?.isCoConstructor ?? false);

  return (
    <>
      <CrudField label="Anonymized code">
        <input className={inputClass} value={anonymizedCode} onChange={(e) => setAnonymizedCode(e.target.value)} />
      </CrudField>
      <CrudField label="Description">
        <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
      </CrudField>
      <label className="flex items-center gap-2 text-sm mb-2">
        <input type="checkbox" checked={isCoConstructor} onChange={(e) => setIsCoConstructor(e.target.checked)} />
        Co-constructor (constructivist GT)
      </label>
      <CrudFormActions
        onSave={() => onSave({ anonymizedCode, description, isCoConstructor })}
        onCancel={onCancel}
      />
    </>
  );
}

export function ConsensusCriteriaCrud() {
  const crud = useDomainCrud();
  const items = crud.consensusCriteria.list();

  return (
    <CrudPanel<ConsensusCriteria>
      title="Consensus Criteria (RITL-C)"
      items={items}
      createLabel="Add criteria"
      onCreate={(data) =>
        crud.consensusCriteria.create({
          name: String(data.name ?? 'New criteria'),
          votingType: (data.votingType as ConsensusCriteria['votingType']) ?? 'majority',
          description: String(data.description ?? ''),
          active: data.active ?? true,
        })
      }
      onUpdate={(id, data) => crud.consensusCriteria.update(id, data)}
      onDelete={(id) => crud.consensusCriteria.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between py-2 border-b border-gray-50 group">
          <div>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-gray-400">{item.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{item.votingType}</Badge>
            <CrudActionButtons {...actions} />
          </div>
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <ConsensusForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function ConsensusForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<ConsensusCriteria> | null;
  onSave: (data: Partial<ConsensusCriteria>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [votingType, setVotingType] = useState<ConsensusCriteria['votingType']>(
    item?.votingType ?? 'majority'
  );
  const [active, setActive] = useState(item?.active ?? true);

  return (
    <>
      <CrudField label="Name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </CrudField>
      <CrudField label="Voting type">
        <select
          className={inputClass}
          value={votingType}
          onChange={(e) => setVotingType(e.target.value as ConsensusCriteria['votingType'])}
        >
          <option value="unanimous">Unanimous</option>
          <option value="majority">Majority</option>
          <option value="consensus">Consensus (2/3)</option>
        </select>
      </CrudField>
      <CrudField label="Description">
        <textarea className={textareaClass} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </CrudField>
      <label className="flex items-center gap-2 text-sm mb-2">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active
      </label>
      <CrudFormActions onSave={() => onSave({ name, description, votingType, active })} onCancel={onCancel} />
    </>
  );
}

export function ReportSectionsCrud() {
  const crud = useDomainCrud();
  const items = crud.reportSections.list();

  return (
    <CrudPanel<ReportSection>
      title="Report Sections"
      items={items}
      createLabel="Add section"
      onCreate={(data) =>
        crud.reportSections.create({
          title: String(data.title ?? 'New section'),
          content: String(data.content ?? ''),
          linkedArtifactIds: (data.linkedArtifactIds as string[]) ?? [],
        })
      }
      onUpdate={(id, data) => crud.reportSections.update(id, data)}
      onDelete={(id) => crud.reportSections.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 group">
          <div className="flex-1 pr-2">
            <p className="text-sm font-medium text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-500 line-clamp-2">{item.content}</p>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <ReportSectionForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function ReportSectionForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<ReportSection> | null;
  onSave: (data: Partial<ReportSection>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [content, setContent] = useState(item?.content ?? '');

  return (
    <>
      <CrudField label="Title">
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </CrudField>
      <CrudField label="Content">
        <textarea className={textareaClass} rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
      </CrudField>
      <CrudFormActions onSave={() => onSave({ title, content })} onCancel={onCancel} />
    </>
  );
}
