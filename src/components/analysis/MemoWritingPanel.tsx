import { useState, useEffect } from 'react';
import { StickyNote } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import type { MemoType } from '../../types/domain';
import { Badge } from '../shared/Badge';

interface MemoWritingPanelProps {
  pendingSegment?: {
    text: string;
    start: number;
    end: number;
    artifactId: string;
  } | null;
  onClearPending?: () => void;
}

const MEMO_TYPE_HINTS: Record<MemoType, string> = {
  descriptive: 'Describe what is happening in the data without interpretation.',
  conceptual: 'Name patterns and relationships between categories.',
  methodological: 'Record coding decisions, saturation checks, team process.',
  reflective: 'Examine researcher positionality and co-construction with participants.',
};

export function MemoWritingPanel({ pendingSegment, onClearPending }: MemoWritingPanelProps) {
  const { state, addMemo, getResearcher } = useProject();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<MemoType>('conceptual');

  useEffect(() => {
    if (pendingSegment) {
      setTitle(`Memo: "${pendingSegment.text.slice(0, 30)}…"`);
      setContent(`Segment: "${pendingSegment.text}"\n\nAnalytic note: `);
      setType('conceptual');
    }
  }, [pendingSegment]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    addMemo({
      title: title || 'Analysis memo',
      content,
      relatedIds: pendingSegment ? [pendingSegment.artifactId] : [],
      type,
      segment: pendingSegment
        ? { start: pendingSegment.start, end: pendingSegment.end, text: pendingSegment.text }
        : undefined,
    });
    setTitle('');
    setContent('');
    onClearPending?.();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote size={16} className="text-amber-600" />
        <h4 className="text-sm font-semibold text-gray-900">Analytic Memos</h4>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Memo throughout analysis — not just at the end. Memos bridge coding and theory.
      </p>

      <div className="space-y-2 mb-3 shrink-0">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Memo title"
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MemoType)}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2"
        >
          <option value="conceptual">Conceptual</option>
          <option value="descriptive">Descriptive</option>
          <option value="methodological">Methodological</option>
          <option value="reflective">Reflective</option>
        </select>
        <p className="text-[10px] text-gray-400 italic">{MEMO_TYPE_HINTS[type]}</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your analytic memo…"
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none h-24"
        />
        <button
          onClick={handleSubmit}
          className="w-full text-xs py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Save memo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {state.memos.slice(0, 5).map((memo) => (
          <div key={memo.id} className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="flex items-center justify-between gap-1 mb-1">
              <p className="text-xs font-medium text-gray-800 truncate">{memo.title}</p>
              <Badge variant="outline">{memo.type}</Badge>
            </div>
            <p className="text-[10px] text-gray-600 line-clamp-2">{memo.content}</p>
            <p className="text-[10px] text-gray-400 mt-1">{getResearcher(memo.authorId)?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
