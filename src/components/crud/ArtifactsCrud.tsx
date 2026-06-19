import { useState } from 'react';
import type { Artifact, TypeOfStatus } from '../../types/domain';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import { useProject } from '../../context/ProjectContext';
import { artifactDisplayId } from '../../lib/seedData';
import { Badge } from '../shared/Badge';
import {
  CrudPanel,
  CrudActionButtons,
  CrudFormActions,
  CrudField,
  inputClass,
  textareaClass,
} from './CrudPanel';

interface ArtifactsCrudProps {
  status?: TypeOfStatus;
  title?: string;
}

export function ArtifactsCrud({ status = 'acquisition', title = 'Artefacts' }: ArtifactsCrudProps) {
  const crud = useDomainCrud();
  const { activeResearcher } = useProject();
  const items = crud.artifacts.list(status);

  return (
    <CrudPanel<Artifact>
      title={title}
      items={items}
      createLabel="Add artefact"
      onCreate={async (data) => {
        await crud.artifacts.create({
          ...(data as Partial<Artifact>),
          status,
          responsibleId: activeResearcher.id,
        });
      }}
      onUpdate={(id, data) => crud.artifacts.update(id, data)}
      onDelete={(id) => crud.artifacts.remove(id)}
      renderItem={(item, actions) => (
        <div className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 group">
          <div>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-400 font-mono">{artifactDisplayId(item.id)}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{item.type}</Badge>
              <Badge variant={item.access === 'private' ? 'committed' : 'primary'}>
                {item.access}
              </Badge>
            </div>
          </div>
          <CrudActionButtons {...actions} />
        </div>
      )}
      renderForm={(item, onSave, onCancel) => (
        <ArtifactForm item={item} onSave={onSave} onCancel={onCancel} />
      )}
    />
  );
}

function ArtifactForm({
  item,
  onSave,
  onCancel,
}: {
  item: Partial<Artifact> | null;
  onSave: (data: Partial<Artifact>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [content, setContent] = useState(item?.content ?? '');
  const [type, setType] = useState<Artifact['type']>(item?.type ?? 'document');
  const [access, setAccess] = useState<Artifact['access']>(item?.access ?? 'private');

  return (
    <>
      <CrudField label="Name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </CrudField>
      <CrudField label="Type">
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as Artifact['type'])}>
          <option value="interview">Interview</option>
          <option value="observation">Observation</option>
          <option value="document">Document</option>
          <option value="protocol">Protocol</option>
          <option value="bibliography">Bibliography</option>
        </select>
      </CrudField>
      <CrudField label="Access">
        <select className={inputClass} value={access} onChange={(e) => setAccess(e.target.value as Artifact['access'])}>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </CrudField>
      <CrudField label="Content">
        <textarea className={textareaClass} rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
      </CrudField>
      <CrudFormActions onSave={() => onSave({ name, content, type, access })} onCancel={onCancel} />
    </>
  );
}
