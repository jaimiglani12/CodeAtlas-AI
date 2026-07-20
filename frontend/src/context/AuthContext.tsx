import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import * as authApi from "../api/auth";

interface User {

    id: number;

    username: string;

    email: string;

}

interface Context {

    user: User | null;

    loading: boolean;

    login: (
        username: string,
        password: string
    ) => Promise<void>;

    logout: () => void;

}

const AuthContext = createContext<Context>(
    {} as Context
);

export function AuthProvider({

    children,

}: {

    children: ReactNode;

}) {

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadUser() {

            try {

                const me = await authApi.me();

                setUser(me);

            } catch {

                localStorage.removeItem("token");

            }

            setLoading(false);

        }

        if (localStorage.getItem("token")) {

            loadUser();

        } else {

            setLoading(false);

        }

    }, []);

    async function login(

        username: string,

        password: string

    ) {

        const token = await authApi.login({

            username,

            password,

        });

        localStorage.setItem(

            "token",

            token.access_token

        );

        const me = await authApi.me();

        setUser(me);

    }

    function logout() {

        localStorage.removeItem("token");

        setUser(null);

    }

    return (

        <AuthContext.Provider

            value={{

                user,

                loading,

                login,

                logout,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}