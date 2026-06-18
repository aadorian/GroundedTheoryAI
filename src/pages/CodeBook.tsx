import { Header } from '../components/layout/Header';
import { useProject } from '../context/ProjectContext';
import { Badge } from '../components/shared/Badge';

export function CodeBook() {
  const { state } = useProject();

  return (
    <>
      <Header title="CodeBook" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Open Codes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {state.codes
              .filter((c) => c.kind === 'code')
              .map((code) => (
                <div
                  key={code.id}
                  className="p-3 rounded-lg border border-gray-100 flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: code.color }} />
                  <span className="text-sm text-gray-800">{code.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-3">
            {state.categories.map((cat) => (
              <div key={cat.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <Badge variant="outline">{cat.level}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cat.codeIds.map((codeId) => {
                    const code = state.codes.find((c) => c.id === codeId);
                    return code ? (
                      <Badge key={codeId} variant="muted">
                        {code.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
