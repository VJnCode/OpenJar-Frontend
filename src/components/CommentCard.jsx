import { useState } from 'react';
import Avatar from './Avatar';

function timeLabel(createdAt) {
  if (!createdAt) return '';
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * A comment and its replies. All text is rendered as React text nodes (auto-escaped),
 * never as HTML, so user content cannot inject markup.
 */
export default function CommentCard({ comment, currentUserId, onReply, onDelete, depth = 0 }) {
  const { id, content, userName, userId, createdAt, deleted, replies = [] } = comment;
  const [replying, setReplying] = useState(false);
  const [text, setText]         = useState('');
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState('');

  const isMine  = currentUserId && userId === currentUserId && !deleted;

  const submitReply = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true); setError('');
    try {
      await onReply(id, text.trim());
      setText(''); setReplying(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this comment?')) return;
    setBusy(true); setError('');
    try { await onDelete(id); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex gap-3 animate-slide-down">
      {deleted
        ? <span className="w-9 h-9 rounded-full bg-field flex items-center justify-center flex-shrink-0 text-muted font-bold text-sm" aria-hidden="true">–</span>
        : <Avatar name={userName || 'OpenJar cook'} seed={userId} size="md" className="!w-9 !h-9 shadow-sm" />}
      <div className="flex-1 min-w-0">
        <div className="bg-surface rounded-2xl rounded-tl-sm px-4 py-3 border border-line shadow-sm">
          <div className="flex items-center justify-between mb-1 gap-3">
            <span className="font-semibold text-ink text-sm truncate">{deleted ? 'Deleted' : (userName || 'OpenJar cook')}</span>
            {timeLabel(createdAt) && <span className="text-xs text-muted flex-shrink-0">{timeLabel(createdAt)}</span>}
          </div>
          <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${deleted ? 'text-muted italic' : 'text-ink/75'}`}>
            {content}
          </p>
        </div>

        {!deleted && (
          <div className="flex items-center gap-4 mt-1.5 ml-2">
            {currentUserId && depth < 2 && (
              <button onClick={() => setReplying(r => !r)} className="text-xs font-semibold text-muted hover:text-ink">
                Reply
              </button>
            )}
            {isMine && (
              <button onClick={remove} disabled={busy} className="text-xs font-semibold text-muted hover:text-danger disabled:opacity-50">
                Delete
              </button>
            )}
          </div>
        )}

        {error && <p role="alert" className="text-xs text-danger mt-1 ml-2">{error}</p>}

        {replying && (
          <form onSubmit={submitReply} className="flex gap-2 mt-2">
            <input value={text} onChange={e => setText(e.target.value)} maxLength={2000} autoFocus
              placeholder={`Reply to ${userName || 'this comment'}…`} aria-label="Reply"
              className="flex-1 text-sm px-3 py-2 bg-surface border border-line rounded-xl focus:outline-none focus:border-brand" />
            <button type="submit" disabled={busy || !text.trim()}
              className="px-3 py-2 bg-brand text-white text-xs font-semibold rounded-xl disabled:opacity-40">
              {busy ? '…' : 'Reply'}
            </button>
          </form>
        )}

        {replies.length > 0 && (
          <div className="flex flex-col gap-3 mt-3 pl-2 border-l-2 border-line">
            {replies.map(r => (
              <CommentCard key={r.id} comment={r} currentUserId={currentUserId}
                onReply={onReply} onDelete={onDelete} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
