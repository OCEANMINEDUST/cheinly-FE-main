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
import RiderEntry from "./pages/rider/Entry";
import RiderOnboarding from "./pages/rider/Onboarding";
import RiderDocumentReview from "./pages/rider/DocumentReview";
import RiderApproval from "./pages/rider/Approval";
import RiderLogin from "./pages/rider/Login";
import RiderDashboard from "./pages/rider/Dashboard";
import RiderHistory from "./pages/rider/History";
import RiderProfile from "./pages/rider/Profile";
import RiderOrderDetails from "./pages/rider/OrderDetails";
import RiderEnRoute from "./pages/rider/EnRoute";
import RiderDropoff from "./pages/rider/Dropoff";
import RiderDeliveryComplete from "./pages/rider/DeliveryComplete";
import RiderReportIssue from "./pages/rider/ReportIssue";
import RiderReturnSuccess from "./pages/rider/ReturnSuccess";
import RiderReturnSetup from "./pages/rider/ReturnSetup";
import RiderReturnActive from "./pages/rider/ReturnActive";
import RiderReleasePayment from "./pages/rider/ReleasePayment";
import RiderProfilePersonal from "./pages/rider/ProfilePersonal";
import RiderProfileBank from "./pages/rider/ProfileBank";
import RiderProfileSecurity from "./pages/rider/ProfileSecurity";
import { RiderRoute } from "./components/rider/RiderRoute";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerDispatch from "./pages/seller/Dispatch";
import SellerTracking from "./pages/seller/Tracking";
import SellerOrders from "./pages/seller/Orders";
import SellerTransactions from "./pages/seller/Transactions";

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
          {/* Rider flow */}
          <Route path="/rider" element={<RiderEntry />} />
          <Route path="/rider/login" element={<RiderLogin />} />
          <Route path="/rider/onboarding" element={<RiderOnboarding />} />
          <Route path="/rider/document-review" element={<RiderDocumentReview />} />
          <Route path="/rider/approval" element={<RiderApproval />} />
          <Route path="/rider/dashboard" element={<RiderRoute><RiderDashboard /></RiderRoute>} />
          <Route path="/rider/history" element={<RiderRoute><RiderHistory /></RiderRoute>} />
          <Route path="/rider/profile" element={<RiderRoute><RiderProfile /></RiderRoute>} />
          <Route path="/rider/order/:orderId" element={<RiderRoute><RiderOrderDetails /></RiderRoute>} />
          <Route path="/rider/order/:orderId/enroute" element={<RiderRoute><RiderEnRoute /></RiderRoute>} />
          <Route path="/rider/order/:orderId/dropoff" element={<RiderRoute><RiderDropoff /></RiderRoute>} />
          <Route path="/rider/order/:orderId/complete" element={<RiderRoute><RiderDeliveryComplete /></RiderRoute>} />
          <Route path="/rider/order/:orderId/report-issue" element={<RiderRoute><RiderReportIssue /></RiderRoute>} />
          <Route path="/rider/order/:orderId/return-success" element={<RiderRoute><RiderReturnSuccess /></RiderRoute>} />
          <Route path="/rider/order/:orderId/return" element={<RiderRoute><RiderReturnSetup /></RiderRoute>} />
          <Route path="/rider/order/:orderId/return-active" element={<RiderRoute><RiderReturnActive /></RiderRoute>} />
          <Route path="/rider/order/:orderId/release-payment" element={<RiderRoute><RiderReleasePayment /></RiderRoute>} />
          <Route path="/rider/profile/personal" element={<RiderRoute><RiderProfilePersonal /></RiderRoute>} />
          <Route path="/rider/profile/bank" element={<RiderRoute><RiderProfileBank /></RiderRoute>} />
          <Route path="/rider/profile/security" element={<RiderRoute><RiderProfileSecurity /></RiderRoute>} />
          {/* Seller flow */}
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/dispatch" element={<SellerDispatch />} />
          <Route path="/seller/tracking" element={<SellerTracking />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/transactions" element={<SellerTransactions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
