import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import PublicLayout from "./layouts/publicLayout/PublicLayout";
import SignInPage from "./routes/signInPage/signInPage";
import SignUpPage from "./routes/signUpPage/signUpPage";
import ProductPage from "./routes/productPage/ProductPage";
import SolutionsPage from "./routes/solutionsPage/SolutionsPage";
import PricingPage from "./routes/pricingPage/PricingPage";
import DevelopersPage from "./routes/developersPage/DevelopersPage";
import AboutPage from "./routes/aboutPage/AboutPage";
import CareersPage from "./routes/careersPage/CareersPage";
import BlogPage from "./routes/blogPage/BlogPage";
import ContactPage from "./routes/contactPage/ContactPage";
import PressPage from "./routes/pressPage/PressPage";
import PrivacyPolicyPage from "./routes/privacyPage/PrivacyPolicyPage";
import TermsPage from "./routes/termsPage/TermsPage";
import CookiePolicyPage from "./routes/cookiePage/CookiePolicyPage";
import AccessibilityPage from "./routes/accessibilityPage/AccessibilityPage";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <Homepage /> },
          { path: "/product", element: <ProductPage /> },
          { path: "/solutions", element: <SolutionsPage /> },
          { path: "/pricing", element: <PricingPage /> },
          { path: "/developers", element: <DevelopersPage /> },
          { path: "/about", element: <AboutPage /> },
          { path: "/careers", element: <CareersPage /> },
          { path: "/blog", element: <BlogPage /> },
          { path: "/contact", element: <ContactPage /> },
          { path: "/press", element: <PressPage /> },
          { path: "/privacy", element: <PrivacyPolicyPage /> },
          { path: "/terms", element: <TermsPage /> },
          { path: "/cookies", element: <CookiePolicyPage /> },
          { path: "/accessibility", element: <AccessibilityPage /> },
        ],
      },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/chats/:id", element: <ChatPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);