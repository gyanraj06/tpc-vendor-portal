import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/auth/AuthPage';
import { ProfileSetupPage } from './pages/auth/ProfileSetupPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { RecurringEventsVerificationPage } from './pages/events/RecurringEventsVerificationPage';
import { CreateEventPage } from './pages/events/CreateEventPage';
import { AllListingsPage } from './pages/listings/AllListingsPage';
import { VendorLandingPage } from './pages/landing/VendorLandingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<VendorLandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/all-listings" element={<AllListingsPage />} />
          <Route path="/recurring-events-verification" element={<RecurringEventsVerificationPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;