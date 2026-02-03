import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import GoogleLogin from "./pages/auth/GoogleLogin";
import UpdatePassword from "./pages/auth/UpdatePassword";
import SetProfile from "./pages/auth/SetProfile";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./components/layout/PublicRoute";
import PrivateRoute from "./components/layout/PrivateRoute";
import Products from "./pages/products/Products";
import Team from "./pages/team/Team";
import CreateProductPage from "./pages/products/CreateProductPage";
import AppLoader from "./components/Loader";
import AuthListener from "./store/auth/AuthListener";
import { useLoadingStore } from "./store/loading/useLoadingState";
import { useAuthStore } from "./store/auth/useAuthStore";
import CreateOrJoinTeam from "./pages/team/CreateOrJoinTeam";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Product from "./pages/products/Product";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});
function App() {
  const loading = useLoadingStore((state) => state.isLoading);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const shouldShowLoader = !isAuthReady || loading;
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <AuthListener />
      {!shouldShowLoader ? (
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/google-login"
              element={
                <PublicRoute>
                  <GoogleLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/update-password"
              element={
                <PublicRoute>
                  <UpdatePassword />
                </PublicRoute>
              }
            />
            <Route
              path="/set-profile"
              element={
                <PrivateRoute>
                  <SetProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-or-join-team"
              element={
                <PrivateRoute>
                  <CreateOrJoinTeam />
                </PrivateRoute>
              }
            />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/:productId"
              element={
                <PrivateRoute>
                  <Product />
                </PrivateRoute>
              }
            />
            <Route
              path="/team"
              element={
                <PrivateRoute>
                  <Team />
                </PrivateRoute>
              }
            />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreateProductPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <AppLoader />
      )}
    </QueryClientProvider>
  );
}

export default App;
