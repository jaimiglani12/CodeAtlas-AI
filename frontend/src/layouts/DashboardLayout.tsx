import type { ReactNode } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

interface Crumb {
    label: string;
    to?: string;
}

interface Props {
    children: ReactNode;
    breadcrumb: Crumb[];
    noPadding?: boolean;
}

export default function DashboardLayout({
    children,
    breadcrumb,
    noPadding = false,
}: Props) {
    return (
        <div className="flex h-screen bg-ink text-parchment">

            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">

                <Topbar breadcrumb={breadcrumb} />

                <main className={noPadding ? "flex-1 overflow-hidden" : "flex-1 overflow-auto p-8"}>
                    {children}
                </main>

            </div>

        </div>
    );
}
