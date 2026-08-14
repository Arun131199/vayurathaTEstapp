import { Loading } from "@/components/table/loading";
import RecentExamTable from "@/components/table/RecentExamTable";
import { Suspense } from "react";
import { AdminResultRow } from "@/types/tableType";
import { getAdminResults } from "@/lib/actions/exam";
import { resultTableColumns } from "@/components/table/tableColumn ";

async function ResultsTable() {
    const rawResults = await getAdminResults();


    // backend returns "attemptId" -> map it to "id" for the generic Table component
    const results: AdminResultRow[] = rawResults.map((r: any) => ({
        ...r,
        id: r.attemptId,
    }));

    console.log(results)

    return (
        <RecentExamTable
            title="ALL RESULTS"
            columns={resultTableColumns}
            data={results}
            isFilter={true}
            expandable={true}
            filterOptions={["all", "PASS", "FAIL"]}
            showReview={true}
        />
    );
}

export default function Results() {
    return (
        <div className="p-4 space-y-4">
            <div>
                <h1 className="text-lg font-semibold text-white">Exam Results</h1>
                <p className="text-sm text-gray-400">All student attempts and scores</p>
            </div>
            <Suspense fallback={<Loading />}>
                <ResultsTable />
            </Suspense>
        </div>
    );
}