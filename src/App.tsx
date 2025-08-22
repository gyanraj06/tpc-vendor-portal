import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthPage } from './pages/auth/AuthPage';
import { ProfileSetupPage } from './pages/auth/ProfileSetupPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { RecurringEventsVerificationPage } from './pages/events/RecurringEventsVerificationPage';
import { CreateEventPage } from './pages/events/CreateEventPage';
import { CreateRecurringEventPage } from './pages/events/CreateRecurringEventPage';
import { AllListingsPage } from './pages/listings/AllListingsPage';
import { VendorLandingPage } from './pages/landing/VendorLandingPage';
import { QuickGuidePage } from './pages/quick-guide/QuickGuidePage';
import { BookingsPage } from './pages/bookings/BookingsPage';
import { WebsiteBuilderPage } from './pages/website-builder/WebsiteBuilderPage';
import { SocialConnectPage } from './pages/social-connect/SocialConnectPage';
import { SherpaAIPage } from './pages/sherpa-ai/SherpaAIPage';
import { LearningsPage } from './pages/learnings/LearningsPage';
import { SustainabilityPage } from './pages/sustainability/SustainabilityPage';
import { Layout } from './components/layout/Layout';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <div className="App">
        <Routes>
          {/* Landing and Auth Routes - No Layout */}
          <Route path="/" element={<VendorLandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          
          {/* Dashboard Routes - With Layout */}
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/quick-guide" element={<Layout><QuickGuidePage /></Layout>} />
          <Route path="/all-listings" element={<Layout><AllListingsPage /></Layout>} />
          <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
          <Route path="/website-builder" element={<Layout><WebsiteBuilderPage /></Layout>} />
          <Route path="/social-connect" element={<Layout><SocialConnectPage /></Layout>} />
          <Route path="/sherpa-ai" element={<Layout><SherpaAIPage /></Layout>} />
          <Route path="/learnings" element={<Layout><LearningsPage /></Layout>} />
          <Route path="/sustainability" element={<Layout><SustainabilityPage /></Layout>} />
          <Route path="/edit-profile" element={<Layout><EditProfilePage /></Layout>} />
          <Route path="/recurring-events-verification" element={<Layout><RecurringEventsVerificationPage /></Layout>} />
          <Route path="/create-event" element={<Layout><CreateEventPage /></Layout>} />
          <Route path="/create-recurring-event" element={<Layout><CreateRecurringEventPage /></Layout>} />
        </Routes>
        </div>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
