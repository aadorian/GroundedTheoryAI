import { FileText, MapPin, Users, FileType } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';

export function SummaryCards() {
  const { state } = useProject();
  const { theoreticalFramework, fieldOfStudy } = state.settings;
  const primaryMethod = theoreticalFramework.methods[0];
  const primaryRQ = theoreticalFramework.researchQuestions[0];
  const attachedDoc = theoreticalFramework.attachedDocuments?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Research Questions
        </h3>
        <p className="text-sm font-medium text-gray-800 mb-1">RQ 1</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{primaryRQ?.content}</p>
        <div>
          <p className="text-xs text-gray-400 mb-1">Methodology</p>
          <Badge variant="methodology">
            {theoreticalFramework.methodology === 'constructivist'
              ? 'Grounded Theory'
              : theoreticalFramework.methodology}
          </Badge>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Methods
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <FileText size={16} className="text-gray-400 shrink-0" />
            <span className="capitalize">{primaryMethod?.type ?? 'Interview'}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400 shrink-0" />
            <span>
              {primaryMethod?.location ?? fieldOfStudy.location}, Country
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Users size={16} className="text-gray-400 shrink-0" />
            <span>Informants: {primaryMethod?.informantCount ?? 23}</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Theoretical Framework
        </h3>
        {attachedDoc ? (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="p-2 bg-blue-100 rounded">
              <FileType size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{attachedDoc.name}</p>
              <p className="text-xs text-gray-400">{attachedDoc.size}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No documents attached</p>
        )}
      </div>
    </div>
  );
}
