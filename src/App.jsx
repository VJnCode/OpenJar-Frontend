import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

import HomePage          from './pages/HomePage';
import RecipeDetailPage  from './pages/RecipeDetailPage';
import CreateRecipePage  from './pages/CreateRecipePage';
import ProfilePage       from './pages/ProfilePage';
import CategoriesPage    from './pages/CategoriesPage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import VerifyPage        from './pages/VerifyPage';
import CallbackPage      from './pages/CallbackPage';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"              element={<Navigate to="/home" replace />} />
            <Route path="/home"          element={<HomePage />} />
            <Route path="/recipe/:id"    element={<RecipeDetailPage />} />
            <Route path="/create"        element={<CreateRecipePage />} />
            <Route path="/profile/:id"   element={<ProfilePage />} />
            <Route path="/categories"    element={<CategoriesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/register"      element={<RegisterPage />} />
            <Route path="/verify"        element={<VerifyPage />} />
          </Route>
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
