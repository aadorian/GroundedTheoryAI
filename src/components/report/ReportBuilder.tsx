import { useProject } from '../../context/ProjectContext';
import { checkPrivacyForExport } from '../../store/projectStore';
import { Badge } from '../shared/Badge';

export function ReportBuilder() {
  const { state, updateReportSection, exportMarkdown, exportRoCrateBundle } = useProject();
  const { safe, privateCount } = checkPrivacyForExport(state.artifacts);

  return (
    <div className="space-y-4">
      {!safe && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
          Privacy check: {privateCount} private artefact(s) will be included unless you acknowledge
          during RO-Crate export.
        </div>
      )}

      {state.settings.reportSections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">{section.title}</h4>
            <Badge variant="muted">
              {section.linkedArtifactIds.length} linked artefacts
            </Badge>
          </div>
          <textarea
            value={section.content}
            onChange={(e) => updateReportSection({ ...section, content: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none h-28 leading-relaxed"
          />
        </div>
      ))}

      {state.theory && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">Emerging Theory (Summary)</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{state.theory.content}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => exportMarkdown()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Export Markdown Report
        </button>
        <button
          onClick={() => exportRoCrateBundle(false)}
          className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50"
        >
          Export RO-Crate (privacy check)
        </button>
        <button
          onClick={() => exportRoCrateBundle(true)}
          className="px-4 py-2 border border-orange-200 text-orange-700 text-sm rounded-lg hover:bg-orange-50"
        >
          Export RO-Crate (acknowledge private)
        </button>
      </div>
    </div>
  );
}
