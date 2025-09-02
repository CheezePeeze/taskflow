import { createContext, useContext, useReducer, useEffect } from "react";
import {
  login as loginApi,
  register as registerApi,
} from "../services/authService";
import { getCurrentUser, updateMe } from "../services/userService";
import { getToken } from "../utils/authToken";

// User State
type User = { email: string; username: string } | null;

// Interface types for states
interface AuthState {
  user: User; // who is loged in or null
  token: string | null; // key access to thw server
  loading: boolean; // wether is loading smth (by loging in )
  error: string | null; // if there something went wrong
}

// Action types
type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { token: string; user: User } }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

//Initial state

const initialState: AuthState = {
  user: null,
  token: getToken() ?? null,
  loading: true,
  error: null,
};

//Reducer for controlling the state

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case "LOGIN_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      return { user: null, token: null, loading: false, error: null };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

//Creating a context with values {state,actions}

type AuthContextValue = {
  state: AuthState;
  //actions wraped in convinient methods - components dont talk directly to dispatch
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string, username: string): Promise<void>;
  logout(): void;
  refreshUser(): Promise<void>;
  setUserName(username: string): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

//Provider = source of truth
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  //When mounting: if there is a token - try to pull up the user
  useEffect(() => {
    const token = getToken(); // read directly, not through the state
    if (!token) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }
    (async () => {
      try {
        const me = await getCurrentUser();
        dispatch({ type: "SET_USER", payload: me });
      } catch {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    })();
  }, []);

  // ----------- actions -----------

  const login: AuthContextValue["login"] = async (email, password) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await loginApi(email, password); // { token }
      localStorage.setItem("token", data.token);
      const me = await getCurrentUser();
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: data.token, user: me },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error?.response?.data?.message ?? "Login failed",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const register: AuthContextValue["register"] = async (
    email,
    password,
    username
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await registerApi(email, password, username);
      await login(email, password); // after registration we log in immediately
    } catch (error: any) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error?.response?.data?.message ?? "Registration failed",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout: AuthContextValue["logout"] = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const refreshUser: AuthContextValue["refreshUser"] = async () => {
    try {
      const me = await getCurrentUser();
      dispatch({ type: "SET_USER", payload: me });
    } catch {
      logout();
    }
  };

  const setUserName: AuthContextValue["setUserName"] = async (username) => {
    try {
      const updated = await updateMe(username);
      dispatch({ type: "SET_USER", payload: updated });
    } catch {
      // you can show the toast if wish so
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, refreshUser, setUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx; // object, not array
};
export default useAuth;
