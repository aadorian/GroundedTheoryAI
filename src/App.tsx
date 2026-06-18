import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CodeBook } from './pages/CodeBook';
import { ProblemStatement } from './pages/ProblemStatement';
import { DataAcquisition } from './pages/DataAcquisition';
import { DataManagement } from './pages/DataManagement';
import { Analysis } from './pages/Analysis';
import { Report } from './pages/Report';
import { Settings } from './pages/Settings';

function ScientistPage({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-full overflow-hidden">{children}</div>;
}

export default function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="codebook" element={<CodeBook />} />
            <Route
              path="scientist/problem-statement"
              element={
                <ScientistPage>
                  <ProblemStatement />
                </ScientistPage>
              }
            />
            <Route
              path="scientist/data-acquisition"
              element={
                <ScientistPage>
                  <DataAcquisition />
                </ScientistPage>
              }
            />
            <Route
              path="scientist/data-management"
              element={
                <ScientistPage>
                  <DataManagement />
                </ScientistPage>
              }
            />
            <Route
              path="scientist/analysis"
              element={
                <ScientistPage>
                  <Analysis />
                </ScientistPage>
              }
            />
            <Route
              path="scientist/report"
              element={
                <ScientistPage>
                  <Report />
                </ScientistPage>
              }
            />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}
