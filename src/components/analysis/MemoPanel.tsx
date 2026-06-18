import { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';

export function MemoPanel() {
  const { state, addMemo, getResearcher } = useProject();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'descriptive' | 'methodological' | 'conceptual' | 'reflective'>(
    'reflective'
  );

  const handleAdd = () => {
    if (!content.trim()) return;
    addMemo({
      title: title || 'Memo',
      content,
      relatedIds: [],
      type,
    });
    setTitle('');
    setContent('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col h-full">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Reflexivity Memos</h4>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {state.memos.map((memo) => {
          const author = getResearcher(memo.authorId);
          return (
            <div key={memo.id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800">{memo.title}</p>
                <Badge variant="outline">{memo.type}</Badge>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{memo.content}</p>
              <p className="text-xs text-gray-400 mt-2">{author?.name}</p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Memo title"
          className="w-full text-xs border border-gray-200 rounded px-2 py-1.5"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Reflexivity note..."
          className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 resize-none h-16"
        />
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="text-xs border border-gray-200 rounded px-2 py-1"
          >
            <option value="reflective">Reflective</option>
            <option value="methodological">Methodological</option>
            <option value="conceptual">Conceptual</option>
            <option value="descriptive">Descriptive</option>
          </select>
          <button
            onClick={handleAdd}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 ml-auto"
          >
            Add memo
          </button>
        </div>
      </div>
    </div>
  );
}
