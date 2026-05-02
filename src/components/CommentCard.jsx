export default function CommentCard({ comment }) {
  const { content, userName, createdAt } = comment;
  const initial = (userName || 'A')[0].toUpperCase();
  const time = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <div className="flex gap-3 animate-slide-down">
      <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-zinc-900 font-bold text-sm">{initial}</span>
      </div>
      <div className="flex-1 bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-zinc-100 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-zinc-800 text-sm">{userName || 'Anonymous'}</span>
          {time && <span className="text-xs text-zinc-400">{time}</span>}
        </div>
        <p className="text-zinc-600 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
