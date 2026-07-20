import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, AlertCircle, RotateCw } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import RepositoryCard from "../components/workspace/RepositoryCard";
import UploadRepositoryModal from "../components/workspace/UploadRepositoryModal";
import { listRepositories } from "../api/repository";
import { getWorkspace } from "../api/workspace";

export default function Workspace() {

    const { workspaceId } = useParams();
    const id = Number(workspaceId);
    const [modalOpen, setModalOpen] = useState(false);

    const workspaceQuery = useQuery({
        queryKey: ["workspace", id],
        queryFn: () => getWorkspace(id),
        retry: 1,
        enabled: Number.isFinite(id),
    });

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["repositories", id],
        queryFn: () => listRepositories(id),
        retry: 1,
        enabled: Number.isFinite(id),
        refetchInterval: (query) => {
            const repos = query.state.data ?? [];
            const stillWorking = repos.some(
                (repo) => repo.index_status === "indexing" || repo.index_status === "pending"
            );
            return stillWorking ? 4000 : false;
        },
    });

    const repositories = data ?? [];
    const workspaceName = workspaceQuery.data?.name ?? `Workspace ${workspaceId}`;

    return (
        <DashboardLayout
            breadcrumb={[
                { label: "Dashboard", to: "/dashboard" },
                { label: workspaceName },
            ]}
        >

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="font-display text-2xl font-medium text-parchment">
                        {workspaceName}
                    </h1>
                    <p className="mt-1.5 text-sm text-parchment-dim">
                        {workspaceQuery.data?.description ||
                            `${repositories.length} repository${repositories.length === 1 ? "" : "ies"} in this workspace.`}
                    </p>
                </div>

                <Button onClick={() => setModalOpen(true)}>
                    <Plus size={16} />
                    Upload repository
                </Button>

            </div>

            {
                isLoading ? (

                    <div className="mt-14 flex justify-center">
                        <Spinner size={24} />
                    </div>

                ) : isError ? (

                    <Card className="mt-8 flex flex-col items-center gap-4 border-dashed py-16 text-center">
                        <AlertCircle size={22} className="text-walnut-300" />
                        <p className="text-sm text-parchment-dim">
                            Couldn't load repositories for this workspace.
                        </p>
                        <Button variant="secondary" onClick={() => refetch()} disabled={isRefetching}>
                            {isRefetching ? <Spinner size={15} /> : <RotateCw size={15} />}
                            Try again
                        </Button>
                    </Card>

                ) : repositories.length === 0 ? (

                    <Card className="mt-8 flex flex-col items-center gap-4 border-dashed py-16 text-center">
                        <p className="text-sm text-parchment-dim">
                            No repositories yet. Upload one to start surveying it.
                        </p>
                        <Button onClick={() => setModalOpen(true)}>
                            <Plus size={16} />
                            Upload repository
                        </Button>
                    </Card>

                ) : (

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {repositories.map((repo) => (
                            <RepositoryCard key={repo.id} repository={repo} />
                        ))}

                    </div>

                )
            }

            <UploadRepositoryModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                workspaceId={id}
            />

        </DashboardLayout>
    );
}
