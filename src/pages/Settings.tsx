import { Header } from '../components/layout/Header';
import { useProject } from '../context/ProjectContext';
import { ParticipantsCrud, ConsensusCriteriaCrud } from '../components/crud/SettingsCrud';

export function Settings() {
  const { state, exportJson, exportRoCrateBundle, resetProject } = useProject();

  return (
    <>
      <Header title="Settings" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Project</h3>
          <p className="text-sm text-gray-700">{state.settings.projectName}</p>
          <p className="text-xs text-gray-400 mt-1">{state.settings.fieldOfStudy.location}</p>
        </div>

        <ParticipantsCrud />
        <ConsensusCriteriaCrud />

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Export & Data</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportJson()}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Export JSON
            </button>
            <button
              onClick={() => exportRoCrateBundle(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Export RO-Crate
            </button>
            <button
              onClick={() => {
                if (confirm('Reset to seed project?')) resetProject();
              }}
              className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
            >
              Reset project
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">GTA-OM Ontology View</h3>
          <p className="text-xs text-gray-500">
            Stub: computational representation of GTA-DCM (thesis Section 5.3). Full OWL editor out of scope for v1.
          </p>
        </div>
      </div>
    </>
  );
}
