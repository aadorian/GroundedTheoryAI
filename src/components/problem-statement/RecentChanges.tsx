import { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';
import { ResearcherAvatar } from '../shared/ResearcherAvatar';
import { formatDate } from '../../lib/utils';
import type { ChangeCategory } from '../../types/domain';
import { cn } from '../../lib/utils';

const FILTER_TABS: { id: ChangeCategory | 'all' | 'view'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'research_question', label: 'Research Questions' },
  { id: 'methods', label: 'Methods' },
  { id: 'framework', label: 'Theoretical Frameworks' },
  { id: 'bibliography', label: 'Bibliography' },
  { id: 'view', label: 'View Changes' },
];

const categoryLabels: Record<ChangeCategory, string> = {
  research_question: 'Research Question',
  methods: 'Methods',
  framework: 'Theoretical Framework',
  bibliography: 'Bibliography',
  artefact: 'Artefact',
};

export function RecentChanges() {
  const { state, getResearcher, addChange, activeResearcher } = useProject();
  const [filter, setFilter] = useState<ChangeCategory | 'all' | 'view'>('all');
  const [showCommitForm, setShowCommitForm] = useState(false);
  const [rationale, setRationale] = useState('');

  const filtered =
    filter === 'all' || filter === 'view'
      ? state.changeLog
      : state.changeLog.filter((c) => c.category === filter);

  const latestCommitted = state.changeLog.find((c) => c.status === 'committed');
  const detailEntry = state.changeLog[0];

  const handleCommit = () => {
    if (!rationale.trim()) return;
    addChange('research_question', 'MOD: team update', rationale, 'committed');
    setRationale('');
    setShowCommitForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Recent Changes</h3>
        <button className="text-xs text-blue-600 font-medium hover:underline">View all</button>
      </div>

      {latestCommitted && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">{formatDate(latestCommitted.timestamp)}</p>
              <p className="text-sm font-semibold text-gray-900">{latestCommitted.action}</p>
            </div>
            <Badge variant="committed">Committed</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400 uppercase tracking-wide mb-1">Rationale</p>
              <p className="text-gray-600 leading-relaxed">{latestCommitted.rationale}</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase tracking-wide mb-1">Proposal</p>
              <p className="text-gray-600 leading-relaxed">
                {latestCommitted.proposal ?? latestCommitted.note ?? '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              filter === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {detailEntry && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {getResearcher(detailEntry.authorId) && (
                <ResearcherAvatar
                  initials={getResearcher(detailEntry.authorId)!.initials}
                  color={getResearcher(detailEntry.authorId)!.color}
                  size="sm"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Modified by {getResearcher(detailEntry.authorId)?.name ?? 'Unknown'}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(detailEntry.timestamp)} • Timestamp:{' '}
                  {new Date(detailEntry.timestamp).toISOString().slice(11, 16)} UTC
                </p>
              </div>
            </div>
            <Badge variant="muted">{categoryLabels[detailEntry.category]}</Badge>
          </div>
          {detailEntry.note && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Note</p>
              <p className="text-sm text-gray-600 leading-relaxed">{detailEntry.note}</p>
            </div>
          )}
        </div>
      )}

      {filtered.slice(0, 5).map((entry) => (
        <div
          key={entry.id}
          className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between text-sm"
        >
          <div>
            <span className="font-medium text-gray-800">{entry.action}</span>
            <span className="text-gray-400 ml-2 text-xs">
              {getResearcher(entry.authorId)?.name}
            </span>
          </div>
          <Badge variant={entry.status === 'committed' ? 'committed' : 'outline'}>
            {entry.status}
          </Badge>
        </div>
      ))}

      {showCommitForm ? (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Enter rationale for change (RITL-C)..."
            className="w-full text-sm border border-gray-200 rounded-lg p-3 mb-2 resize-none h-20"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCommit}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Commit as {activeResearcher.name}
            </button>
            <button
              onClick={() => setShowCommitForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCommitForm(true)}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          + Record change (RITL-C)
        </button>
      )}
    </div>
  );
}
