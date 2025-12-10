import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PeriodPage from "./pages/PeriodPage";
import CoursePage from "./pages/CoursePage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import WatchPage from "./pages/WatchPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminNewCourse from "./pages/admin/AdminNewCourse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/periodo/:slug" element={<PeriodPage />} />
              <Route path="/aula/:slug" element={<CoursePage />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Student Routes */}
              <Route path="/minhas-aulas" element={<MyCoursesPage />} />
              <Route path="/assistir/:slug" element={<WatchPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminHome />} />
                <Route path="aulas" element={<AdminCourses />} />
                <Route path="aulas/nova" element={<AdminNewCourse />} />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
