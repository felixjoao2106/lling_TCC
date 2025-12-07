import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Photographers from "./pages/Photographers";
import Profile from "./pages/Profile";
import BecomePhotographer from "./pages/BecomePhotographer";
import Auth from "./pages/Auth";

// User Pages
import Bookings from "./pages/Bookings";
import Messages from "./pages/Messages";
import UserDashboard from "./pages/user/UserDashboard";
import Favorites from "./pages/user/Favorites";
import Reviews from "./pages/user/Reviews";
import UserSettings from "./pages/user/UserSettings";

// Photographer Pages
import PhotographerDashboard from "./pages/photographer/PhotographerDashboard";
import PhotographerSettings from "./pages/photographer/PhotographerSettings";
import Services from "./pages/photographer/Services";
import Checkouts from "./pages/photographer/Checkouts";
import Portfolio from "./pages/photographer/Portfolio";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/login" component={Auth} />
      <Route path="/cadastro" component={Auth} />
      <Route path="/explore" component={Explore} />
      <Route path="/photographers" component={Photographers} />
      <Route path="/profile/:id" component={Profile} />
      <Route path="/become-photographer" component={BecomePhotographer} />
      
      {/* User Routes */}
      <Route path="/bookings" component={Bookings} />
      <Route path="/messages" component={Messages} />
      <Route path="/user/dashboard" component={UserDashboard} />
      <Route path="/user/favorites" component={Favorites} />
      <Route path="/user/reviews" component={Reviews} />
      <Route path="/user/settings" component={UserSettings} />
      
      {/* Photographer Routes */}
      <Route path="/photographer/dashboard" component={PhotographerDashboard} />
      <Route path="/photographer/settings" component={PhotographerSettings} />
      <Route path="/photographer/settings/:page" component={PhotographerSettings} />
      <Route path="/photographer/services" component={Services} />
      <Route path="/photographer/checkouts" component={Checkouts} />
      <Route path="/photographer/portfolio" component={Portfolio} />
      
      {/* Legacy redirect */}
      <Route path="/dashboard" component={PhotographerDashboard} />
      
      {/* Fallback Routes */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
