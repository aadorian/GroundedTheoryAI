import { Header } from '../components/layout/Header';
import { ContextPanel } from '../components/management/ContextPanel';

export function DataManagement() {
  return (
    <>
      <Header title="Data Management" showBack backTo="/scientist/data-acquisition" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm text-gray-500 mb-4">
          Evaluate and contextualise artefacts. Define criteria for analysis (GTA-DCM curation metadata).
        </p>
        <ContextPanel />
      </div>
    </>
  );
}
