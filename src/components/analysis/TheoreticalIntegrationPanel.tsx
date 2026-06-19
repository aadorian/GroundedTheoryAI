import { useProject } from '../../context/ProjectContext';
import { useDomainCrud } from '../../hooks/useDomainCrud';
import { ConsensusPanel } from './ConsensusPanel';
import { Badge } from '../shared/Badge';

export function TheoreticalIntegrationPanel() {
  const { state } = useProject();
  const crud = useDomainCrud();
  const theory = state.theory;

  const handleTheoryChange = (content: string) => {
    if (theory) {
      crud.theory.update({ content });
    } else {
      crud.theory.create({
        type: state.settings.theoreticalFramework.methodology,
        content,
        categoryIds: state.categories.map((c) => c.id),
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Theoretical Integration</h4>
        <p className="text-xs text-gray-500">
          Selective coding: weave categories into a coherent explanatory framework. Identify the core
          category and its story.
        </p>
      </div>

      <textarea
        value={theory?.content ?? ''}
        onChange={(e) => handleTheoryChange(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none h-36 leading-relaxed"
        placeholder="Write the emerging grounded theory. How do categories interact? What is the core process or story?"
      />

      {theory && (
        <>
          <div>
            <p className="text-[10px] uppercase text-gray-400 mb-2">Integrated categories</p>
            <div className="flex flex-wrap gap-1">
              {theory.categoryIds.map((catId) => {
                const cat = state.categories.find((c) => c.id === catId);
                return cat ? (
                  <Badge key={catId} variant="primary">
                    {cat.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          <ConsensusPanel
            targetId={theory.id}
            targetType="theory"
            targetLabel="Theory elaboration — team consensus before report phase"
            votingType="consensus"
          />
        </>
      )}

      {!theory && state.categories.length > 0 && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
          Begin writing to create the emerging theory document. Categories will be linked automatically.
        </p>
      )}
    </div>
  );
}
