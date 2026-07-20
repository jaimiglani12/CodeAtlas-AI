import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useAuth } from "../../context/AuthContext";

interface FormValues {
    username: string;
    password: string;
}

export default function LoginForm() {

    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<FormValues>();

    async function onSubmit(values: FormValues) {
        setError(null);
        try {
            await login(values.username, values.password);
            navigate("/dashboard");
        } catch {
            setError("That username or password didn't match. Try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
                <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                    Email
                </label>
                <Input
                    type="email"
                    placeholder="jai@company.com"
                    {...register("username", { required: true })}
                />
                {errors.username && (
                    <p className="mt-1.5 text-xs text-walnut-300">Enter your email.</p>
                )}
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                    Password
                </label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: true })}
                />
                {errors.password && (
                    <p className="mt-1.5 text-xs text-walnut-300">Enter your password.</p>
                )}
            </div>

            {error && (
                <div className="flex items-start gap-2 rounded-sm border border-walnut-700 bg-ink px-3.5 py-3 text-sm text-walnut-300">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size={16} /> : "Log in"}
            </Button>

            <p className="text-center text-sm text-parchment-dim">
                Don't have an account?{" "}
                <Link to="/signup" className="text-olive-500 hover:text-olive-300">
                    Sign up
                </Link>
            </p>

        </form>
    );
}
