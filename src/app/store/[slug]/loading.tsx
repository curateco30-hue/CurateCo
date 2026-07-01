import { Skeleton } from "@/components/ui/Skeleton";

export default function StorefrontLoading() {
  return (
    <div>
      <Skeleton className="h-[50vh] w-full rounded-none sm:h-[70vh]" />
      <div className="px-6 py-10 sm:px-12">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />
      </div>
      <div className="px-6 py-10 sm:px-12">
        <Skeleton className="mb-5 h-8 w-40" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
