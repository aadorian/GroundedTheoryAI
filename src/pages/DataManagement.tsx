import { Header } from '../components/layout/Header';
import { ContextPanel } from '../components/management/ContextPanel';
import { ArtifactsCrud } from '../components/crud/ArtifactsCrud';

export function DataManagement() {
  return (
    <>
      <Header title="Data Management" showBack backTo="/scientist/data-acquisition" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm text-gray-500 mb-4">
          Evaluate and contextualise artefacts. Define criteria for analysis (GTA-DCM curation metadata).
        </p>
        <ContextPanel />
        <ArtifactsCrud status="management" title="Management Artefacts" />
      </div>
    </>
  );
}
