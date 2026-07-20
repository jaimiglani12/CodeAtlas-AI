import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to continue exploring your repositories."
        >
            <LoginForm />
        </AuthLayout>
    );
}
