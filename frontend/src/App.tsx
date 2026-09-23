/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AIAssistantChat } from "./components/AIAssistantChat";
import { ToastContainer } from "./components/common/Toast";

// Pages
import { Home } from "./pages/Home";
import { RestaurantDetails } from "./pages/RestaurantDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import { apiService } from "./services/api";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("Home");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number>(101);
  const [searchQuery, setSearchQuery] = useState<string>("" );

  // Route protection guard
  useEffect(() => {
    const protectedTabs = ["Cart", "Checkout", "Orders", "Profile"];
    if (protectedTabs.includes(currentTab)) {
      const user = apiService.getCurrentUser();
      if (!user) {
        setCurrentTab("Login");
      }
    }
  }, [currentTab]);

  // Handle switching tabs
  const handleTabChange = (tab: string) => {
    setSearchQuery("");
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectRestaurant = (id: number) => {
    setSelectedRestaurantId(id);
    setCurrentTab("RestaurantDetails");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    switch (currentTab) {
      case "Home":
        return (
          <Home
            onSelectRestaurant={handleSelectRestaurant}
            onChangeTab={handleTabChange}
            searchQuery={searchQuery}
            onSetSearchQuery={setSearchQuery}
          />
        );
      case "RestaurantDetails":
        return (
          <RestaurantDetails
            restaurantId={selectedRestaurantId}
            onBackToHome={() => handleTabChange("Home")}
            onChangeTab={handleTabChange}
          />
        );
      case "Cart":
        return (
          <Cart
            onBackToExplore={() => handleTabChange("Home")}
            onProceedToCheckout={() => handleTabChange("Checkout")}
            onChangeTab={handleTabChange}
          />
        );
      case "Checkout":
        return (
          <Checkout
            onBackToCart={() => handleTabChange("Cart")}
            onOrderPlacedSuccessfully={() => handleTabChange("Orders")}
            onChangeTab={handleTabChange}
          />
        );
      case "Orders":
        return (
          <Orders
            onExploreMoreRestaurants={() => handleTabChange("Home")}
            onChangeTab={handleTabChange}
          />
        );
      case "Profile":
        return (
          <Profile
            onBackToHome={() => handleTabChange("Home")}
            onChangeTab={handleTabChange}
          />
        );
      case "Login":
        return (
          <Login
            onLoginSuccess={() => handleTabChange("Home")}
            onGoToRegister={() => handleTabChange("Register")}
          />
        );
      case "Register":
        return (
          <Register
            onRegisterSuccess={() => handleTabChange("Home")}
            onGoToLogin={() => handleTabChange("Login")}
          />
        );
      default:
        return (
          <Home
            onSelectRestaurant={handleSelectRestaurant}
            onChangeTab={handleTabChange}
            searchQuery={searchQuery}
            onSetSearchQuery={setSearchQuery}
          />
        );
    }
  };

  const showHeaderFooter = currentTab !== "Login" && currentTab !== "Register";

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] font-sans text-gray-900 selection:bg-[#E23744]/20 selection:text-[#E23744]">
      {/* 1. GLOBAL NAVIGATION BAR */}
      {showHeaderFooter && (
        <Navbar
          currentTab={currentTab}
          onChangeTab={handleTabChange}
          onSearch={setSearchQuery}
        />
      )}

      {/* 2. DYNAMIC VIEW PORTAL */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* 3. GLOBAL FOOTER */}
      {showHeaderFooter && (
        <Footer 
          onChangeTab={handleTabChange}
        />
      )}

      {/* 4. FLOATING AI CONCIERGE */}
      {showHeaderFooter && <AIAssistantChat />}

      {/* 5. GLOBAL TOAST NOTIFICATIONS */}
      <ToastContainer />
    </div>
  );
}
