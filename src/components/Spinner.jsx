export default function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center py-24" role="status" aria-label="Loading">
      <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
