import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";

interface Props {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-ink">
                <Spinner size={28} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
