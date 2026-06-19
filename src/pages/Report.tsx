import { Header } from '../components/layout/Header';
import { ReportSectionsCrud } from '../components/crud/SettingsCrud';
import { ReportBuilder } from '../components/report/ReportBuilder';
import { useProject } from '../context/ProjectContext';

export function Report() {
  const { exportMarkdown } = useProject();
  return (
    <>
      <Header
        title="Report"
        showBack
        backTo="/scientist/analysis"
        showExport
        onExport={() => exportMarkdown()}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm text-gray-500 mb-4">
          Final curated artefact for publication. Export to Markdown or RO-Crate (FAIR).
        </p>
        <ReportSectionsCrud />
        <ReportBuilder />
      </div>
    </>
  );
}
