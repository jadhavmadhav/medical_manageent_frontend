 






import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton"; 
import { CreateBillClient } from "./components/create-bill-client";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function CreateBillSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar skeleton */}
      <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* Body skeleton */}
      <div className="max-w-[1300px] mx-auto px-6 py-5 flex gap-4 items-start">
        {/* Main column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Bill info card */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-9 rounded-lg" />
              <Skeleton className="h-9 rounded-lg" />
              <Skeleton className="h-9 rounded-lg" />
            </div>
          </div>

          {/* Products card */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="flex flex-col items-center py-8 gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[295px] shrink-0 flex flex-col gap-4">
          {/* Patient */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 rounded-lg" />
          </div>
          {/* Doctor */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 rounded-lg" />
          </div>
          {/* Summary */}
          <div className="bg-slate-900 rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-20 bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-px w-full bg-slate-700 my-2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24 bg-slate-700" />
              <Skeleton className="h-8 w-20 bg-slate-700" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateBillPage({
  enterpriseId,
  bill_id,
}: {
  enterpriseId: string;
  bill_id?: string;
}) {
  return (
    <Suspense fallback={<CreateBillSkeleton />}>
      <CreateBillClient enterpriseId={enterpriseId} bill_id={bill_id} />
    </Suspense>
  );
}