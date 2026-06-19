import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import { Badge } from '../shared/Badge';
import { ConsensusPanel } from './ConsensusPanel';
import { cn } from '../../lib/utils';

export function AxialCategoryPanel() {
  const { state } = useProject();
  const crud = useDomainCrud();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    state.categories[0]?.id ?? null
  );
  const openCodes = state.codes.filter((c) => c.kind === 'code');

  const selected = state.categories.find((c) => c.id === selectedCategoryId);

  const toggleCodeInCategory = (codeId: string) => {
    if (!selected) return;
    const codeIds = selected.codeIds.includes(codeId)
      ? selected.codeIds.filter((id) => id !== codeId)
      : [...selected.codeIds, codeId];
    crud.categories.update(selected.id, { codeIds });
  };

  const createCategory = () => {
    const name = prompt('Category name (axial / higher-order):');
    if (!name?.trim()) return;
    const cat = crud.categories.create({
      name: name.trim(),
      codeIds: [],
      relatedCategoryIds: [],
      level: 'analytical',
    });
    setSelectedCategoryId(cat.id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-indigo-600" />
          <h4 className="text-sm font-semibold text-gray-900">Axial Categories</h4>
        </div>
        <button onClick={createCategory} className="text-xs text-blue-600 font-medium hover:underline">
          + Category
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Relate open codes into categories. Specify properties (what) and dimensions (how much, when, where).
      </p>

      <div className="flex gap-2 flex-wrap mb-3">
        {state.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border transition-colors',
              selectedCategoryId === cat.id
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {cat.name}
            <span className="ml-1 opacity-60">({cat.codeIds.length})</span>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-800">{selected.name}</p>
            <Badge variant="outline">{selected.level}</Badge>
          </div>

          <div>
            <p className="text-[10px] uppercase text-gray-400 mb-2">Linked open codes</p>
            <div className="flex flex-wrap gap-1.5">
              {openCodes.map((code) => (
                <button
                  key={code.id}
                  onClick={() => toggleCodeInCategory(code.id)}
                  className={cn(
                    'text-[10px] px-2 py-1 rounded-full border flex items-center gap-1',
                    selected.codeIds.includes(code.id)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                      : 'bg-white border-gray-200 text-gray-600'
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: code.color }} />
                  {code.name}
                </button>
              ))}
            </div>
          </div>

          {selected.relatedCategoryIds.length > 0 && (
            <div>
              <p className="text-[10px] uppercase text-gray-400 mb-1">Related categories</p>
              <div className="flex flex-wrap gap-1">
                {selected.relatedCategoryIds.map((relId) => {
                  const rel = state.categories.find((c) => c.id === relId);
                  return rel ? (
                    <Badge key={relId} variant="muted">
                      {rel.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <ConsensusPanel
            targetId={selected.id}
            targetType="category"
            targetLabel={`Category saturation: ${selected.name}`}
            votingType="consensus"
          />
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-6">Select or create a category.</p>
      )}
    </div>
  );
}
