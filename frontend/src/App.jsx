import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DisclaimerBanner from './components/DisclaimerBanner';
import DashboardView from './components/DashboardView';
import InteractiveMapView from './components/InteractiveMapView';
import RiskAnalysisView from './components/RiskAnalysisView';
import ShelterDirectoryView from './components/ShelterDirectoryView';
import RouteDemoView from './components/RouteDemoView';
import AiAssistantView from './components/AiAssistantView';
import AdminPanelView from './components/AdminPanelView';
import ReportGeneratorModal from './components/ReportGeneratorModal';
import { getAdminMe } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check existing admin token on mount
  useEffect(() => {
    const token = localStorage.getItem('datheon_admin_token');
    if (token) {
      getAdminMe()
        .then(() => setIsAdminLoggedIn(true))
        .catch(() => {
          localStorage.removeItem('datheon_admin_token');
          setIsAdminLoggedIn(false);
        });
    }
  }, []);

  const handleOpenReportModal = (loc = null) => {
    setReportData(loc || selectedLocation || null);
    setIsReportModalOpen(true);
  };

  const handleNavigateToRouteFromLocation = (loc) => {
    setRouteOrigin(loc);
    setActiveTab('routes');
  };

  const handleSelectShelterForRoute = (shelter) => {
    setRouteDestination(shelter);
    setActiveTab('routes');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col selection:bg-flood-blue selection:text-white">
      {/* Top Hackathon Mandatory Disclaimer */}
      <DisclaimerBanner />

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => handleOpenReportModal(selectedLocation)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMapView
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onNavigateToRoute={handleNavigateToRouteFromLocation}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {activeTab === 'risk' && (
          <RiskAnalysisView onOpenReportModal={handleOpenReportModal} />
        )}

        {activeTab === 'shelters' && (
          <ShelterDirectoryView
            onSelectShelterForRoute={handleSelectShelterForRoute}
          />
        )}

        {activeTab === 'routes' && (
          <RouteDemoView
            initialOrigin={routeOrigin}
            initialDestination={routeDestination}
          />
        )}

        {activeTab === 'assistant' && (
          <AiAssistantView activeLocation={selectedLocation} />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}
      </main>

      {/* Report Generator Modal */}
      {isReportModalOpen && (
        <ReportGeneratorModal
          locationData={reportData}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
