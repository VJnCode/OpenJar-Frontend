export default function SkeletonCard() {
  return (
    <div className="block">
      <div className="skeleton rounded-2xl aspect-[4/3] w-full" />
      <div className="pt-3 flex flex-col gap-2 px-1">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-1/2 rounded-lg" />
      </div>
    </div>
  );
}
