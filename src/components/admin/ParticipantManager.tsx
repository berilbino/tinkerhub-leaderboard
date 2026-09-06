'use client';

import React, { useState, useRef } from 'react';
import { Participant } from '@/types/leaderboard';
import { 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Edit2, 
  Trash2, 
  Download, 
  X, 
  CheckCircle2, 
  Sparkles,
  Upload,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ParticipantManagerProps {
  leaderboardId: string;
  participants: Participant[];
  onAddParticipant: (name: string) => Promise<{ participant: Participant; accessCode: string } | null>;
  onAddParticipantsBulk?: (names: string[]) => Promise<{ added: { participant: Participant; accessCode: string }[]; skipped: string[] } | null>;
  onUpdateParticipant: (id: string, name: string) => Promise<boolean>;
  onDeleteParticipant: (id: string) => Promise<boolean>;
}

export function ParticipantManager({
  leaderboardId,
  participants,
  onAddParticipant,
  onAddParticipantsBulk,
  onUpdateParticipant,
  onDeleteParticipant,
}: ParticipantManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Add Participant Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newlyCreatedCode, setNewlyCreatedCode] = useState<string | null>(null);

  // Bulk Add Modal State
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [bulkResult, setBulkResult] = useState<{
    added: { participant: Participant; accessCode: string }[];
    skipped: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Participant Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtered Participants
  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.access_code_hint && p.access_code_hint.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopyCode = (code: string | null, id: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllCodes = () => {
    if (participants.length === 0) return;
    const text = participants
      .map((p) => `${p.name}: ${p.access_code_hint || 'Code assigned'}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsAdding(true);
    try {
      const res = await onAddParticipant(newName.trim());
      if (res) {
        setNewlyCreatedCode(res.accessCode);
        setNewName('');
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Bulk submit handler
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddParticipantsBulk) return;

    // Parse names from lines / commas
    const parsedNames = bulkText
      .split(/\r?\n|,/)
      .map((n) => n.trim())
      .filter(Boolean);

    if (parsedNames.length === 0) return;

    setIsBulkAdding(true);
    try {
      const res = await onAddParticipantsBulk(parsedNames);
      if (res) {
        setBulkResult(res);
        setBulkText('');
      }
    } finally {
      setIsBulkAdding(false);
    }
  };

  // File upload handler (.txt or .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      // Append or replace
      setBulkText((prev) => (prev.trim() ? `${prev.trim()}\n${content}` : content));
    };
    reader.readAsText(file);
    // Reset file input value so user can upload again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant || !editName.trim()) return;

    setIsUpdating(true);
    try {
      const success = await onUpdateParticipant(editingParticipant.id, editName.trim());
      if (success) {
        setEditModalOpen(false);
        setEditingParticipant(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (p: Participant) => {
    if (window.confirm(`Are you sure you want to delete participant "${p.name}"?`)) {
      await onDeleteParticipant(p.id);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EBEBE6]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl text-[#111111] uppercase tracking-wide">
              Participants
            </h2>
            <span className="bg-[#FAF9F5] border border-[#111111] text-[#111111] font-mono text-xs font-bold px-2 py-0.5 rounded-full">
              {participants.length}
            </span>
          </div>
          <p className="text-xs text-[#666666] font-medium">
            Manage participants and generate access codes for WhatsApp distribution.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setBulkResult(null);
              setBulkText('');
              setBulkModalOpen(true);
            }}
            className="bg-white hover:bg-[#FAF9F5] text-[#111111] font-bold text-xs px-3.5 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#D91E2E]" />
            <span>Bulk Import (Text / Excel)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewlyCreatedCode(null);
              setAddModalOpen(true);
            }}
            className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs px-3.5 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Participant</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search participant by name or code..."
          className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none transition-all"
        />
      </div>

      {/* Participants Table */}
      <div className="w-full bg-white border-2 border-[#111111] rounded-lg overflow-hidden retro-shadow">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF9F5] border-b-2 border-[#111111]">
              <th className="py-3 px-4 font-bold text-[#111111] uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 font-bold text-[#111111] uppercase tracking-wider">
                Access Code
              </th>
              <th className="py-3 px-4 font-bold text-[#111111] text-right uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEBE6]">
            {filteredParticipants.map((p) => (
              <tr key={p.id} className="hover:bg-[#FAF9F5] transition-colors">
                <td className="py-3 px-4 font-bold text-[#111111] uppercase">
                  {p.name}
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-xs bg-[#FAF9F5] border border-[#D9D9D4] px-2 py-1 rounded text-[#111111]">
                    {p.access_code_hint || '••••••••'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Copy Code */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(p.access_code_hint, p.id)}
                      title="Copy Access Code"
                      className="p-1.5 border border-[#D9D9D4] hover:border-[#111111] rounded bg-white text-[#111111] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    >
                      {copiedId === p.id ? (
                        <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#666666]" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingParticipant(p);
                        setEditName(p.name);
                        setEditModalOpen(true);
                      }}
                      title="Edit Participant"
                      className="p-1.5 border border-[#D9D9D4] hover:border-[#111111] rounded bg-white text-[#111111] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#666666]" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      title="Delete Participant"
                      className="p-1.5 border border-[#D9D9D4] hover:border-[#D91E2E] rounded bg-white text-[#666666] hover:text-[#D91E2E] hover:bg-[#FFF0F2] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredParticipants.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-[#666666] font-medium">
                  {participants.length === 0
                    ? 'No participants yet. Click "+ Add Participant" above to add one.'
                    : 'No participants match your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bottom Export Action */}
        {participants.length > 0 && (
          <div className="p-3 bg-[#FAF9F5] border-t-2 border-[#111111] flex items-center justify-between">
            <span className="text-[11px] text-[#666666] font-medium">
              Showing {filteredParticipants.length} of {participants.length} participants
            </span>
            <button
              type="button"
              onClick={handleCopyAllCodes}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#D91E2E] transition-colors cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span className="text-[#16A34A]">All Codes Copied!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Copy All Codes for WhatsApp</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Add Participant Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#111111] rounded-lg max-w-sm w-full p-5 retro-shadow relative">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg text-[#111111] uppercase mb-1">
              Add Participant
            </h3>
            <p className="text-xs text-[#666666] mb-4">
              Enter participant name. An access code will be generated automatically.
            </p>

            {newlyCreatedCode ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#DCFCE7] border border-[#86EFAC] rounded-md text-center">
                  <CheckCircle2 className="w-6 h-6 text-[#166534] mx-auto mb-1" />
                  <p className="text-xs font-bold text-[#166534] uppercase">
                    Participant Created!
                  </p>
                  <p className="text-[11px] text-[#166534] mt-0.5">Generated Access Code:</p>
                  <div className="font-mono font-black text-lg text-[#111111] bg-white border border-[#86EFAC] rounded py-1 px-2 mt-2">
                    {newlyCreatedCode}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newlyCreatedCode);
                      alert('Access code copied to clipboard!');
                    }}
                    className="flex-1 bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs py-2.5 rounded uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewlyCreatedCode(null)}
                    className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 px-4 rounded uppercase cursor-pointer"
                  >
                    + Add Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                    Participant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Nair"
                    className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-1.5 transition-all retro-btn-active cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAdding ? 'Adding...' : 'Add Participant'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {editModalOpen && editingParticipant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#111111] rounded-lg max-w-sm w-full p-5 retro-shadow relative">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg text-[#111111] uppercase mb-1">
              Edit Participant
            </h3>
            <p className="text-xs text-[#666666] mb-4">
              Update participant name. Access code remains unchanged.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Participant Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="text-xs text-[#666666]">
                <span>Access Code: </span>
                <span className="font-mono font-bold text-[#111111]">
                  {editingParticipant.access_code_hint || 'CW26-••••'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#111111] rounded-lg max-w-lg w-full p-6 retro-shadow relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setBulkModalOpen(false);
                setBulkResult(null);
              }}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Upload className="w-5 h-5 text-[#D91E2E]" />
              <h3 className="font-display text-lg text-[#111111] uppercase">
                Bulk Import Participants
              </h3>
            </div>
            <p className="text-xs text-[#666666] mb-4">
              Add all participants at once. Paste student names (one per line or comma-separated), or upload a <span className="font-bold text-[#111111]">.txt / .csv</span> file.
            </p>

            {bulkResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#DCFCE7] border border-[#86EFAC] rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-[#166534]" />
                    <p className="text-xs font-bold text-[#166534] uppercase">
                      Bulk Import Complete!
                    </p>
                  </div>
                  <p className="text-xs text-[#166534]">
                    Successfully added <span className="font-bold text-sm">{bulkResult.added.length}</span> participants with generated access codes.
                  </p>
                  {bulkResult.skipped.length > 0 && (
                    <p className="text-[11px] text-[#854D0E] mt-2 bg-[#FEF9C3] p-2 rounded border border-[#FDE047]">
                      ⚠️ Skipped {bulkResult.skipped.length} duplicate/blank names: {bulkResult.skipped.slice(0, 5).join(', ')}{bulkResult.skipped.length > 5 ? '...' : ''}
                    </p>
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto bg-[#FAF9F5] border border-[#D9D9D4] rounded p-3 text-xs space-y-1">
                  <p className="font-bold text-[#111111] text-[11px] uppercase pb-1 border-b border-[#EBEBE6]">
                    Added Participants & Codes:
                  </p>
                  {bulkResult.added.map((item) => (
                    <div key={item.participant.id} className="flex items-center justify-between py-0.5 font-mono text-[11px]">
                      <span className="font-sans font-bold text-[#111111]">{item.participant.name}</span>
                      <span className="text-[#D91E2E] font-bold">{item.accessCode}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const text = bulkResult.added
                        .map((item) => `${item.participant.name}: ${item.accessCode}`)
                        .join('\n');
                      navigator.clipboard.writeText(text);
                      alert('Copied new participant codes to clipboard!');
                    }}
                    className="flex-1 bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs py-2.5 rounded uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Newly Created Codes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBulkResult(null);
                      setBulkModalOpen(false);
                    }}
                    className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 px-4 rounded uppercase cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBulkSubmit} className="space-y-4">
                {/* File Upload Helper Box */}
                <div className="p-3 bg-[#FAF9F5] border-2 border-dashed border-[#D9D9D4] rounded-md text-center hover:border-[#111111] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bulk-file-upload"
                  />
                  <label
                    htmlFor="bulk-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <FileText className="w-6 h-6 text-[#666666]" />
                    <span className="text-xs font-bold text-[#111111] hover:underline">
                      Click to choose a .txt or .csv file
                    </span>
                    <span className="text-[10px] text-[#888888]">
                      Exported from Excel or a simple notepad list
                    </span>
                  </label>
                </div>

                <div className="text-center text-[10px] font-bold text-[#999999] uppercase tracking-wider">
                  — or paste names directly below —
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#111111] uppercase">
                      Student Names (One per line)
                    </label>
                    <span className="text-[10px] text-[#666666] font-medium">
                      {bulkText.split(/\r?\n|,/).filter((s) => s.trim().length > 0).length} names detected
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Rahul Nair\nAnanya Sharma\nVishnu Prasad\nDevika Menon\nAlex Joseph`}
                    className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium font-mono text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="bg-[#FEF9C3] p-2.5 rounded border border-[#FDE047] flex items-start gap-2 text-[11px] text-[#854D0E]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Each student will automatically receive their own unique access code. Duplicate names will be safely ignored.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isBulkAdding || !bulkText.trim()}
                  className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-1.5 transition-all retro-btn-active cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isBulkAdding
                      ? 'Importing Participants...'
                      : `Import ${bulkText.split(/\r?\n|,/).filter((s) => s.trim().length > 0).length || ''} Participants`}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
