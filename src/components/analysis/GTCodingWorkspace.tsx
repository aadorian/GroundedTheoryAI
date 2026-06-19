import { useState, useRef, useCallback } from 'react';
import { Highlighter, StickyNote } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';
import {
  GT_STAGE_LABELS,
  getUncodedCharacterRatio,
  type GTCodingStage,
} from '../../domain/gtAnalysis';
import { cn } from '../../lib/utils';

interface GTCodingWorkspaceProps {
  stage: GTCodingStage;
  onSelectionForMemo?: (payload: { text: string; start: number; end: number; artifactId: string }) => void;
}

export function GTCodingWorkspace({ stage, onSelectionForMemo }: GTCodingWorkspaceProps) {
  const { state, addCoding, addCode, activeResearcher } = useProject();
  const analysisArtifacts = state.artifacts.filter(
    (a) => a.status === 'analysis' && a.media === 'text'
  );
  const [selectedArtifactId, setSelectedArtifactId] = useState(
    analysisArtifacts[0]?.id ?? state.artifacts.find((a) => a.media === 'text')?.id ?? ''
  );
  const [activeCodeId, setActiveCodeId] = useState<string | null>(
    state.codes.find((c) => c.kind === 'code')?.id ?? null
  );
  const [pendingSelection, setPendingSelection] = useState<{
    text: string;
    start: number;
    end: number;
  } | null>(null);
  const [inVivoName, setInVivoName] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const artifact = state.artifacts.find((a) => a.id === selectedArtifactId);
  const artifactCodings = state.codings.filter((c) => c.artifactId === selectedArtifactId);
  const openCodes = state.codes.filter((c) => c.kind === 'code');
  const uncodedRatio = artifact ? getUncodedCharacterRatio(artifact, state.codings) : 1;
  const codedPercent = Math.round((1 - uncodedRatio) * 100);

  const resolveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !artifact || !contentRef.current) return null;
    const range = sel.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) return null;
    const text = sel.toString().trim();
    if (!text) return null;

    const preRange = document.createRange();
    preRange.selectNodeContents(contentRef.current);
    preRange.setEnd(range.startContainer, range.startOffset);
    const start = preRange.toString().length;
    const end = start + text.length;
    return { text, start, end };
  }, [artifact]);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    const selection = resolveSelection();
    if (!selection) return;
    setPendingSelection(selection);
    setInVivoName(selection.text.slice(0, 40));
    sel?.removeAllRanges();
  };

  const applyCode = (codeId: string) => {
    if (!pendingSelection || !artifact) return;
    addCoding(artifact.id, codeId, pendingSelection.start, pendingSelection.end, pendingSelection.text);
    setPendingSelection(null);
    setInVivoName('');
  };

  const createInVivoAndApply = () => {
    if (!pendingSelection || !artifact || !inVivoName.trim()) return;
    const code = addCode(inVivoName.trim());
    addCoding(artifact.id, code.id, pendingSelection.start, pendingSelection.end, pendingSelection.text);
    setActiveCodeId(code.id);
    setPendingSelection(null);
    setInVivoName('');
  };

  const applyActiveCode = () => {
    if (activeCodeId && pendingSelection) applyCode(activeCodeId);
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
          style={{
            backgroundColor: `${code?.color ?? '#6366f1'}33`,
            borderBottom: `2px solid ${code?.color ?? '#6366f1'}`,
          }}
          title={`${code?.name ?? 'Code'} — ${coding.textSnippet}`}
        >
          {content.slice(coding.start, coding.end)}
        </mark>
      );
      last = coding.end;
    });
    if (last < content.length) parts.push(<span key={`t-${last}`}>{content.slice(last)}</span>);
    return parts;
  };

  const stageHint =
    stage === 'open'
      ? 'Select text → create in-vivo code or apply existing code. Stay close to participant language.'
      : stage === 'focused'
        ? 'Apply your most significant codes. Compare how incidents vary across artefacts.'
        : stage === 'axial'
          ? 'Code properties and dimensions. Link segments that explain category relationships.'
          : 'Code segments that support or refine the emerging theory.';

  return (
    <div className="flex h-full min-h-[420px] gap-4">
      {/* Document list */}
      <div className="w-52 shrink-0 bg-white rounded-xl border border-gray-200 p-3 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Analysis Artefacts</p>
        {analysisArtifacts.length === 0 && (
          <p className="text-xs text-gray-400 px-1">No text artefacts in analysis phase.</p>
        )}
        {analysisArtifacts.map((a) => {
          const count = state.codings.filter((c) => c.artifactId === a.id).length;
          return (
            <button
              key={a.id}
              onClick={() => {
                setSelectedArtifactId(a.id);
                setPendingSelection(null);
              }}
              className={cn(
                'w-full text-left px-2 py-2 rounded-lg mb-1',
                selectedArtifactId === a.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              )}
            >
              <p className="text-xs font-medium truncate">{a.name}</p>
              <p className="text-[10px] text-gray-400">{count} codings</p>
            </button>
          );
        })}
      </div>

      {/* Transcript */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{artifact?.name ?? 'Select document'}</h4>
            {artifact && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                {codedPercent}% coded • {artifactCodings.length} segments
              </p>
            )}
          </div>
          <Badge variant="primary">{GT_STAGE_LABELS[stage]}</Badge>
        </div>

        <div
          ref={contentRef}
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap select-text"
        >
          {artifact ? renderHighlightedContent() : 'Advance artefacts to the analysis phase to begin coding.'}
        </div>

        {pendingSelection && (
          <div className="px-5 py-3 border-t border-blue-100 bg-blue-50 space-y-2">
            <p className="text-xs font-medium text-blue-800 flex items-center gap-1">
              <Highlighter size={14} />
              Selected: &ldquo;{pendingSelection.text.slice(0, 60)}
              {pendingSelection.text.length > 60 ? '…' : ''}&rdquo;
            </p>
            <div className="flex flex-wrap gap-2">
              {activeCodeId && (
                <button
                  onClick={applyActiveCode}
                  className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply active code
                </button>
              )}
              <div className="flex gap-1 flex-1 min-w-[200px]">
                <input
                  value={inVivoName}
                  onChange={(e) => setInVivoName(e.target.value)}
                  placeholder="In-vivo code name…"
                  className="flex-1 text-xs border border-blue-200 rounded-lg px-2 py-1.5 bg-white"
                  onKeyDown={(e) => e.key === 'Enter' && createInVivoAndApply()}
                />
                <button
                  onClick={createInVivoAndApply}
                  className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  + In-vivo
                </button>
              </div>
              {onSelectionForMemo && artifact && (
                <button
                  onClick={() => {
                    onSelectionForMemo({
                      text: pendingSelection.text,
                      start: pendingSelection.start,
                      end: pendingSelection.end,
                      artifactId: artifact.id,
                    });
                    setPendingSelection(null);
                  }}
                  className="text-xs px-3 py-1.5 border border-amber-200 text-amber-800 rounded-lg hover:bg-amber-50 flex items-center gap-1"
                >
                  <StickyNote size={12} />
                  Memo
                </button>
              )}
              <button
                onClick={() => setPendingSelection(null)}
                className="text-xs px-2 py-1.5 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {openCodes.map((code) => (
                <button
                  key={code.id}
                  onClick={() => applyCode(code.id)}
                  className="text-[10px] px-2 py-1 rounded-full border border-gray-200 hover:border-blue-300 bg-white flex items-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: code.color }} />
                  {code.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 px-5 py-2 border-t border-gray-100">{stageHint}</p>
      </div>

      {/* Code book sidebar */}
      <div className="w-56 shrink-0 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto flex flex-col">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Code Book</p>
        <p className="text-[10px] text-gray-400 mb-3">Click to set active code for quick application.</p>
        <div className="space-y-1 flex-1">
          {openCodes.map((code) => {
            const freq = state.codings.filter((c) => c.codeId === code.id).length;
            return (
              <button
                key={code.id}
                onClick={() => setActiveCodeId(code.id)}
                className={cn(
                  'w-full flex items-center gap-2 py-2 px-2 rounded-lg text-left text-sm transition-colors',
                  activeCodeId === code.id
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'hover:bg-gray-50'
                )}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: code.color }} />
                <span className="text-gray-700 flex-1 truncate">{code.name}</span>
                <span className="text-[10px] text-gray-400">{freq}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-3 pt-3 border-t border-gray-100">
          Coding as {activeResearcher.name}
        </p>
      </div>
    </div>
  );
}
