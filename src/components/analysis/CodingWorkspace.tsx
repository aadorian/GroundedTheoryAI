import { useState, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';

export function CodingWorkspace() {
  const { state, addCoding, addCode, activeResearcher } = useProject();
  const [selectedArtifactId, setSelectedArtifactId] = useState(
    state.artifacts.find((a) => a.status === 'analysis')?.id ?? state.artifacts[0]?.id
  );
  const [newCodeName, setNewCodeName] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const artifact = state.artifacts.find((a) => a.id === selectedArtifactId);
  const artifactCodings = state.codings.filter((c) => c.artifactId === selectedArtifactId);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !artifact || !contentRef.current) return;
    const range = sel.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) return;
    const text = sel.toString().trim();
    if (!text) return;

    const preRange = document.createRange();
    preRange.selectNodeContents(contentRef.current);
    preRange.setEnd(range.startContainer, range.startOffset);
    const start = preRange.toString().length;
    const end = start + text.length;

    const code = state.codes[0];
    if (code) addCoding(artifact.id, code.id, start, end, text);
    sel.removeAllRanges();
  };

  const renderHighlightedContent = () => {
    if (!artifact) return null;
    const content = artifact.content;
    const sorted = [...artifactCodings].sort((a, b) => a.start - b.start);
    const parts: React.ReactNode[] = [];
    let last = 0;

    sorted.forEach((coding) => {
      if (coding.start > last) {
        parts.push(<span key={`t-${last}`}>{content.slice(last, coding.start)}</span>);
      }
      const code = state.codes.find((c) => c.id === coding.codeId);
      parts.push(
        <mark
          key={coding.id}
          className="rounded px-0.5 cursor-pointer"
          style={{ backgroundColor: `${code?.color ?? '#6366f1'}33`, borderBottom: `2px solid ${code?.color ?? '#6366f1'}` }}
          title={code?.name}
        >
          {content.slice(coding.start, coding.end)}
        </mark>
      );
      last = coding.end;
    });
    if (last < content.length) parts.push(<span key={`t-${last}`}>{content.slice(last)}</span>);
    return parts;
  };

  const handleAddCode = () => {
    if (!newCodeName.trim()) return;
    addCode(newCodeName);
    setNewCodeName('');
  };

  return (
    <div className="flex h-full gap-4">
      <div className="w-48 shrink-0 bg-white rounded-xl border border-gray-200 p-3 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Documents</p>
        {state.artifacts
          .filter((a) => a.media === 'text')
          .map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedArtifactId(a.id)}
              className={`w-full text-left text-xs px-2 py-2 rounded-lg mb-1 truncate ${
                selectedArtifactId === a.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              {a.name}
            </button>
          ))}
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 text-sm">{artifact?.name ?? 'Select document'}</h4>
          <Badge variant="primary">Open Coding</Badge>
        </div>
        <div
          ref={contentRef}
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap select-text"
        >
          {artifact ? renderHighlightedContent() : 'Select a document to begin coding.'}
        </div>
        <p className="text-xs text-gray-400 px-5 py-2 border-t border-gray-100">
          Select text to apply first available code • Coding as {activeResearcher.name}
        </p>
      </div>

      <div className="w-56 shrink-0 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Codes</p>
        <div className="flex gap-1 mb-3">
          <input
            value={newCodeName}
            onChange={(e) => setNewCodeName(e.target.value)}
            placeholder="New code..."
            className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCode()}
          />
          <button onClick={handleAddCode} className="text-xs bg-blue-600 text-white px-2 rounded">
            +
          </button>
        </div>
        {state.codes
          .filter((c) => c.kind === 'code')
          .map((code) => (
            <div key={code.id} className="flex items-center gap-2 py-1.5 text-sm">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: code.color }} />
              <span className="text-gray-700">{code.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
