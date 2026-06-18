import { useState } from 'react';
import { Play, MessageSquare, FileText, UserRound } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { artifactDisplayId } from '../../lib/seedData';
import { Badge } from '../shared/Badge';
import { cn } from '../../lib/utils';

const ACQUISITION_TABS = [
  'All',
  'Collect External Data',
  'Collect Internal Data',
  'Explore Data',
  'Verify Reliability',
  'View Metadata',
  'Clean Data',
];

const instrumentIcons: Record<string, typeof MessageSquare> = {
  interview: MessageSquare,
  survey: FileText,
  workshop: UserRound,
  observation: FileText,
  focusgroup: UserRound,
};

export function AcquisitionTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACQUISITION_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            active === tab
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function RecentEntryCard() {
  const { state, getResearcher } = useProject();
  const entry = state.artifacts.find((a) => a.status === 'acquisition') ?? state.artifacts[0];
  const researcher = entry.responsibleId ? getResearcher(entry.responsibleId) : undefined;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-xs text-gray-400 mb-3 uppercase">
        {new Date(entry.curation.dateCreated).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">ID-Artifact</p>
          <p className="font-semibold text-gray-800">{artifactDisplayId(entry.id)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Instrument</p>
          <p className="font-medium text-gray-800 capitalize">{entry.instrumentType ?? entry.type}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Researcher</p>
          <p className="font-medium text-gray-800">{researcher?.name ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">TimeStamp</p>
          <p className="font-medium text-gray-800">17:00</p>
        </div>
      </div>
      {entry.media === 'video' && (
        <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg">
          <Play size={14} />
          Video
        </button>
      )}
    </div>
  );
}

export function UploadPanel() {
  const { dispatch, activeResearcher, addChange } = useProject();
  const [name, setName] = useState('');

  const handleUpload = async () => {
    if (!name.trim()) return;
    const content = 'Uploaded instrument placeholder content.';
    const artifact = {
      id: `a-${Date.now()}`,
      hashID: await (async () => {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(content));
        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      })(),
      name,
      content,
      type: 'document' as const,
      media: 'text' as const,
      access: 'private' as const,
      status: 'acquisition' as const,
      responsibleId: activeResearcher.id,
      description: 'Uploaded instrument',
      taskTitle: 'Upload Instrument',
      instrumentType: 'interview' as const,
      curation: {
        format: 'Document',
        source: 'Upload',
        dateCreated: new Date().toISOString().slice(0, 10),
        consentObtained: false,
      },
    };
    dispatch({ type: 'ADD_ARTIFACT', artifact });
    addChange('artefact', `ADD: ${name}`, 'Instrument uploaded via acquisition panel', 'committed');
    setName('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-800 mb-3">Upload</p>
      <div className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Upload Instrument"
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export function ActivityTimeline() {
  const { state, getResearcher } = useProject();

  const grouped = state.activities.reduce(
    (acc, act) => {
      if (!acc[act.dayLabel]) acc[act.dayLabel] = [];
      acc[act.dayLabel].push(act);
      return acc;
    },
    {} as Record<string, typeof state.activities>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Activity</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {Object.entries(grouped).map(([day, acts]) => (
          <div key={day}>
            {acts.map((act) => {
              const researcher = getResearcher(act.researcherId);
              const artifact = state.artifacts.find((a) => a.id === act.artifactId);
              const Icon = instrumentIcons[act.instrumentType] ?? MessageSquare;
              return (
                <div
                  key={act.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-20 shrink-0">
                    <p className="text-xs font-semibold text-gray-800">{day.split(',')[0]}</p>
                    <p className="text-xs text-gray-400">{day.split(',')[1]?.trim()}</p>
                  </div>
                  <div className="w-24 shrink-0 text-xs font-mono text-gray-600">
                    {artifact ? artifactDisplayId(artifact.id) : act.artifactId}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{researcher?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{act.description}</p>
                  </div>
                  <Badge variant="outline" className="gap-1 shrink-0">
                    <Icon size={12} />
                    <span className="capitalize">{act.instrumentType}</span>
                  </Badge>
                  <p className="text-sm text-gray-700 w-36 shrink-0 hidden md:block">
                    {act.taskTitle}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
