import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CrudPanelProps<T extends { id: string }> {
  title: string;
  items: T[];
  emptyMessage?: string;
  renderItem: (item: T, actions: CrudItemActions) => ReactNode;
  renderForm: (
    item: Partial<T> | null,
    onSave: (data: Partial<T>) => void,
    onCancel: () => void
  ) => ReactNode;
  onCreate: (data: Partial<T>) => void;
  onUpdate: (id: string, data: Partial<T>) => void;
  onDelete: (id: string) => void;
  createLabel?: string;
  className?: string;
}

export interface CrudItemActions {
  onEdit: () => void;
  onDelete: () => void;
}

export function CrudPanel<T extends { id: string }>({
  title,
  items,
  emptyMessage = 'No items yet.',
  renderItem,
  renderForm,
  onCreate,
  onUpdate,
  onDelete,
  createLabel = 'Add',
  className,
}: CrudPanelProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = (data: Partial<T>) => {
    if (editingId) {
      onUpdate(editingId, data);
      setEditingId(null);
    } else {
      onCreate(data);
      setIsCreating(false);
    }
  };

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-5 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={14} />
            {createLabel}
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          {renderForm(null, handleSave, () => setIsCreating(false))}
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && !isCreating && (
          <p className="text-sm text-gray-400 py-4 text-center">{emptyMessage}</p>
        )}
        {items.map((item) =>
          editingId === item.id ? (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              {renderForm(item, handleSave, () => setEditingId(null))}
            </div>
          ) : (
            <div key={item.id} className="group flex items-start gap-2">
              <div className="flex-1 min-w-0">
                {renderItem(item, {
                  onEdit: () => setEditingId(item.id),
                  onDelete: () => {
                    if (confirm('Delete this item?')) onDelete(item.id);
                  },
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export function CrudActionButtons({ onEdit, onDelete }: CrudItemActions) {
  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <button
        onClick={onEdit}
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
        title="Edit"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
}

export function CrudFormActions({ onSave, onCancel, saveLabel = 'Save' }: FormActionsProps) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={onSave}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Check size={14} />
        {saveLabel}
      </button>
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <X size={14} />
        Cancel
      </button>
    </div>
  );
}

export function CrudField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-2">
      <span className="text-xs text-gray-500 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400';

export const textareaClass =
  'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400';
