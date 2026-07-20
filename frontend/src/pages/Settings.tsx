import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { LogOut, CheckCircle2, AlertCircle } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../api/auth";

export default function Settings() {

    const { user, logout } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const passwordMutation = useMutation({
        mutationFn: () => changePassword({ current_password: currentPassword, new_password: password }),
        onSuccess: () => {
            setCurrentPassword("");
            setPassword("");
            setConfirm("");
        },
    });

    const mismatch = password.length > 0 && confirm.length > 0 && password !== confirm;
    const canSubmit = currentPassword && password.length >= 8 && password === confirm;

    return (
        <DashboardLayout breadcrumb={[{ label: "Settings" }]}>

            <div className="mx-auto max-w-xl">

                <h1 className="font-display text-2xl font-medium text-parchment">
                    Settings
                </h1>

                <Card className="mt-7">

                    <h2 className="text-sm font-semibold text-parchment">Profile</h2>

                    <div className="mt-5 space-y-4">

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                                Username
                            </label>
                            <Input value={user?.username ?? ""} disabled />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                                Email
                            </label>
                            <Input value={user?.email ?? ""} disabled />
                        </div>

                    </div>

                </Card>

                <Card className="mt-6">

                    <h2 className="text-sm font-semibold text-parchment">Password</h2>

                    <form
                        className="mt-5 space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (canSubmit) passwordMutation.mutate();
                        }}
                    >

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                                Current password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    passwordMutation.reset();
                                }}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                                New password
                            </label>
                            <Input
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    passwordMutation.reset();
                                }}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                                Confirm password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirm}
                                onChange={(e) => {
                                    setConfirm(e.target.value);
                                    passwordMutation.reset();
                                }}
                            />
                            {mismatch && (
                                <p className="mt-1.5 text-xs text-walnut-300">Passwords don't match.</p>
                            )}
                        </div>

                        {passwordMutation.isError && (
                            <div className="flex items-start gap-2 rounded-sm border border-walnut-700 bg-ink px-3.5 py-3 text-sm text-walnut-300">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                {isAxiosError<{ detail?: string }>(passwordMutation.error)
                                    ? passwordMutation.error.response?.data?.detail ?? "Couldn't update your password. Try again."
                                    : "Couldn't update your password. Try again."}
                            </div>
                        )}

                        {passwordMutation.isSuccess && (
                            <div className="flex items-center gap-2 rounded-sm border border-olive-700 bg-olive-800 px-3.5 py-3 text-sm text-olive-300">
                                <CheckCircle2 size={16} className="shrink-0" />
                                Password updated.
                            </div>
                        )}

                        <Button type="submit" disabled={!canSubmit || passwordMutation.isPending}>
                            {passwordMutation.isPending ? <Spinner size={15} /> : "Update password"}
                        </Button>

                    </form>

                </Card>

                <Card className="mt-6">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-sm font-semibold text-parchment">Log out</h2>
                            <p className="mt-1 text-sm text-parchment-dim">
                                End your session on this device.
                            </p>
                        </div>

                        <Button variant="secondary" onClick={logout}>
                            <LogOut size={15} />
                            Log out
                        </Button>

                    </div>

                </Card>

            </div>

        </DashboardLayout>
    );
}
