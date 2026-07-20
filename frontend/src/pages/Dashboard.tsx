import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FolderKanban, GitBranch, MessageSquare, FileText, AlertCircle, RotateCw } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import WorkspaceCard from "../components/dashboard/WorkspaceCard";
import CreateWorkspaceModal from "../components/dashboard/CreateWorkspaceModal";
import { useAuth } from "../context/AuthContext";
import { listWorkspaces } from "../api/workspace";


export default function Dashboard() {

    const { user } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ["workspaces"],
        queryFn: listWorkspaces,
        retry: 1,
    });

    const workspaces = data ?? [];
    const totalRepos = workspaces.reduce((sum, w) => sum + w.repository_count, 0);

    const stats = [
        { label: "Workspaces", value: String(workspaces.length), icon: FolderKanban },
        { label: "Repositories", value: String(totalRepos), icon: GitBranch },
        { label: "Active chats", value: "—", icon: MessageSquare },
        { label: "Files indexed", value: "—", icon: FileText },
    ];

    return (
        <DashboardLayout breadcrumb={[{ label: "Dashboard" }]}>

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="font-display text-3xl font-medium text-parchment">
                        Welcome back, {user?.username ?? "there"}
                    </h1>
                    <p className="mt-1.5 text-sm text-parchment-dim">
                        Your AI software engineering workspace.
                    </p>
                </div>

                <Button onClick={() => setModalOpen(true)}>
                    <Plus size={16} />
                    New workspace
                </Button>

            </div>

            <div className="mt-9 grid grid-cols-2 divide-y divide-line rounded-sm border border-line bg-ink-raised sm:grid-cols-4 sm:divide-x sm:divide-y-0">

                {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (

                        <div key={stat.label} className="flex items-center gap-3 px-5 py-4">

                            <Icon size={15} className="shrink-0 text-olive-500" />

                            <div className="min-w-0">
                                <p className="font-display text-xl font-medium leading-none text-parchment">
                                    {stat.value}
                                </p>
                                <p className="mt-1.5 truncate text-xs text-parchment-dim">{stat.label}</p>
                            </div>

                        </div>

                    );

                })}

            </div>

            <div className="mt-12">

                <h2 className="font-display text-xl font-medium text-parchment">
                    Recent workspaces
                </h2>

                {
                    isLoading ? (

                        <div className="mt-8 flex justify-center">
                            <Spinner size={24} />
                        </div>

                    ) : isError ? (

                        <Card className="mt-5 flex flex-col items-center gap-4 border-dashed py-16 text-center">
                            <AlertCircle size={22} className="text-walnut-300" />
                            <p className="text-sm text-parchment-dim">
                                Couldn't load your workspaces. The backend may be unreachable.
                            </p>
                            <Button variant="secondary" onClick={() => refetch()} disabled={isRefetching}>
                                {isRefetching ? <Spinner size={15} /> : <RotateCw size={15} />}
                                Try again
                            </Button>
                        </Card>

                    ) : workspaces.length === 0 ? (

                        <Card className="mt-5 flex flex-col items-center gap-4 border-dashed py-16 text-center">
                            <p className="text-sm text-parchment-dim">
                                No workspaces yet. Create one to start mapping a repository.
                            </p>
                            <Button onClick={() => setModalOpen(true)}>
                                <Plus size={16} />
                                New workspace
                            </Button>
                        </Card>

                    ) : (

                        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {workspaces.map((workspace) => (
                                <WorkspaceCard key={workspace.id} workspace={workspace} />
                            ))}

                            <Card
                                className="flex cursor-pointer items-center justify-center border-dashed py-10 text-parchment-dim transition-colors hover:text-parchment"
                                onClick={() => setModalOpen(true)}
                            >
                                <span className="flex items-center gap-2 text-sm">
                                    <Plus size={16} />
                                    Create workspace
                                </span>
                            </Card>

                        </div>

                    )
                }

            </div>

            <CreateWorkspaceModal open={modalOpen} onClose={() => setModalOpen(false)} />

        </DashboardLayout>
    );
}
