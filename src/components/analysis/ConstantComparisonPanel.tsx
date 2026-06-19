import { GitCompare } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { findConstantComparisonGroups } from '../../domain/gtAnalysis';
import { Badge } from '../shared/Badge';

export function ConstantComparisonPanel() {
  const { state, getResearcher } = useProject();
  const groups = findConstantComparisonGroups(state);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <GitCompare size={16} className="text-blue-600" />
        <h4 className="text-sm font-semibold text-gray-900">Constant Comparison</h4>
      </div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Compare incidents coded with the same label across artefacts. Ask: How does this property vary?
        What conditions surround it?
      </p>

      {groups.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">
          Code the same concept in at least two artefacts to enable comparison.
        </p>
      ) : (
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.codeId} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                <span className="text-sm font-medium text-gray-800">{group.codeName}</span>
                <Badge variant="muted">{group.instances.length} incidents</Badge>
              </div>
              <div className="space-y-2">
                {group.instances.map((inst, i) => (
                  <div key={`${inst.artifactId}-${i}`} className="text-xs bg-gray-50 rounded px-2 py-1.5">
                    <p className="text-gray-400 mb-0.5">
                      {inst.artifactName} • {getResearcher(inst.researcherId)?.name}
                    </p>
                    <p className="text-gray-700 italic">&ldquo;{inst.snippet}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
