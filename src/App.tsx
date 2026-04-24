import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import Success from "./pages/auth/Success";
import BuyerEntry from "./pages/buyer/Entry";
import BuyerProduct from "./pages/buyer/Product";
import BuyerShipping from "./pages/buyer/Shipping";
import BuyerPayment from "./pages/buyer/Payment";
import BuyerDashboard from "./pages/buyer/Dashboard";
import BuyerOrderDetails from "./pages/buyer/OrderDetails";
import BuyerReceipt from "./pages/buyer/Receipt";
import BuyerDeliveryConfirmation from "./pages/buyer/DeliveryConfirmation";
import BuyerAuthentication from "./pages/buyer/Authentication";
import BuyerDispute from "./pages/buyer/Dispute";
import BuyerMultiItemVerification from "./pages/buyer/MultiItemVerification";
import BuyerReportIssue from "./pages/buyer/ReportIssue";
import BuyerNegotiation from "./pages/buyer/Negotiation";
import BuyerPartialRefund from "./pages/buyer/PartialRefund";
import BuyerRefundSuccess from "./pages/buyer/RefundSuccess";
import BuyerReturnDispatch from "./pages/buyer/ReturnDispatch";
import BuyerRiderPayout from "./pages/buyer/RiderPayout";
import BuyerWrongItem from "./pages/buyer/WrongItem";
import BuyerRedelivery from "./pages/buyer/Redelivery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOtp />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/success" element={<Success />} />
          {/* Buyer flow (WhatsApp → product → shipping → payment → dashboard) */}
          <Route path="/buy" element={<BuyerEntry />} />
          <Route path="/buyer/product" element={<BuyerProduct />} />
          <Route path="/buyer/shipping" element={<BuyerShipping />} />
          <Route path="/buyer/payment" element={<BuyerPayment />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/order" element={<BuyerOrderDetails />} />
          <Route path="/buyer/receipt" element={<BuyerReceipt />} />
          <Route path="/buyer/confirm-delivery" element={<BuyerDeliveryConfirmation />} />
          <Route path="/buyer/authentication" element={<BuyerAuthentication />} />
          <Route path="/buyer/dispute" element={<BuyerDispute />} />
          <Route path="/buyer/verify-items" element={<BuyerMultiItemVerification />} />
          <Route path="/buyer/report-issue" element={<BuyerReportIssue />} />
          <Route path="/buyer/negotiation" element={<BuyerNegotiation />} />
          <Route path="/buyer/refund-partial" element={<BuyerPartialRefund />} />
          <Route path="/buyer/refund-success" element={<BuyerRefundSuccess />} />
          <Route path="/buyer/return-dispatch" element={<BuyerReturnDispatch />} />
          <Route path="/buyer/rider-payout" element={<BuyerRiderPayout />} />
          <Route path="/buyer/wrong-item" element={<BuyerWrongItem />} />
          <Route path="/buyer/redelivery" element={<BuyerRedelivery />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
