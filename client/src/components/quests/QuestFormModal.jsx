import React, { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { DIFFICULTIES, ATTRIBUTES } from '../../lib/constants.js';

const inputCls =
  'w-full rounded-lg border border-white/10 bg-void-900/80 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-arcane-400/50';

export function QuestFormModal({ open, onClose, onCreate, creating }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('daily');
  const [difficulty, setDifficulty] = useState('easy');
  const [attribute, setAttribute] = useState('discipline');

  const reset = () => {
    setTitle('');
    setDescription('');
    setType('daily');
    setDifficulty('easy');
    setAttribute('discipline');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({ title, description, type, difficulty, attribute });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Forge a New Quest">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Quest name *
          </label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read 20 pages"
            maxLength={120}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Description
          </label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What must the hero do?"
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Kind</label>
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="one_off">One-time</option>
              <option value="boss">Boss</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Difficulty
            </label>
            <select className={inputCls} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {Object.entries(DIFFICULTIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label} · +{v.xp} XP
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Attribute
            </label>
            <select className={inputCls} value={attribute} onChange={(e) => setAttribute(e.target.value)}>
              {Object.entries(ATTRIBUTES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.icon} {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={creating || !title.trim()}>
            {creating ? 'Forging…' : 'Forge Quest'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}