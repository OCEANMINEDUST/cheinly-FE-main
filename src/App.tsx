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
import BuyerDisputes from "./pages/buyer/Disputes";
import BuyerAccountSettings from "./pages/buyer/AccountSettings";
import BuyerMultiItemVerification from "./pages/buyer/MultiItemVerification";
import BuyerReportIssue from "./pages/buyer/ReportIssue";
import BuyerNegotiation from "./pages/buyer/Negotiation";
import BuyerPartialRefund from "./pages/buyer/PartialRefund";
import BuyerRefundSuccess from "./pages/buyer/RefundSuccess";
import BuyerReturnDispatch from "./pages/buyer/ReturnDispatch";
import BuyerRiderPayout from "./pages/buyer/RiderPayout";
import BuyerWrongItem from "./pages/buyer/WrongItem";
import BuyerRedelivery from "./pages/buyer/Redelivery";
import BuyerOrders from "./pages/buyer/Orders";
import BuyerTransactions from "./pages/buyer/Transactions";
import BuyerHelp from "./pages/buyer/Help";
import BuyerAIChatbot from "./pages/buyer/AIChatbot";
import BuyerSendPackage from "./pages/buyer/SendPackage";
import BuyerPickupTracking from "./pages/buyer/PickupTracking";
import BuyerSellerCatalog from "./pages/buyer/SellerCatalog";
import BuyerPackingSlip from "./pages/buyer/PackingSlip";
import BuyerBrowse from "./pages/buyer/Browse";
import BuyerLogin from "./pages/buyer/Login";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerDispatch from "./pages/seller/Dispatch";
import SellerTracking from "./pages/seller/Tracking";
import SellerOrders from "./pages/seller/Orders";
import SellerTransactions from "./pages/seller/Transactions";
import SellerDispute from "./pages/seller/Dispute";
import SellerDisputes from "./pages/seller/Disputes";
import SellerNegotiate from "./pages/seller/Negotiate";
import SellerEscalate from "./pages/seller/Escalate";
import SellerAccountSettings from "./pages/seller/AccountSettings";
import SellerFulfillmentSettings from "./pages/seller/FulfillmentSettings";
import SellerAIChatbot from "./pages/seller/AIChatbot";
import HelpCentre from "./pages/help/HelpCentre";
import HelpArticle from "./pages/help/HelpArticle";
import HelpContact from "./pages/help/HelpContact";
import HelpAgent from "./pages/help/HelpAgent";
import InviteCompose from "./pages/invite/InviteCompose";
import InvitedLanding from "./pages/invite/InvitedLanding";
import InvitedDashboard from "./pages/invite/InvitedDashboard";
import InvitedWithdraw from "./pages/invite/InvitedWithdraw";
import InvitedTransaction from "./pages/invite/InvitedTransaction";
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierOnboarding from "./pages/supplier/Onboarding";
import SupplierOrders from "./pages/supplier/Orders";
import SupplierTransactions from "./pages/supplier/Transactions";
import SupplierFulfillment from "./pages/supplier/Fulfillment";
import SupplierInvite from "./pages/supplier/Invite";
import SupplierDisputeReview from "./pages/supplier/DisputeReview";
import SupplierDisputes from "./pages/supplier/Disputes";
import SupplierReturnTracking from "./pages/supplier/ReturnTracking";
import SupplierReturnInspection from "./pages/supplier/ReturnInspection";
import SupplierAccountOverview from "./pages/supplier/AccountOverview";
import SupplierSettingsKyc from "./pages/supplier/SettingsKyc";
import SupplierPerformance from "./pages/supplier/Performance";
import SupplierTierProgress from "./pages/supplier/TierProgress";
import SupplierMarketLookup from "./pages/supplier/MarketLookup";
import SupplierAccountSettings from "./pages/supplier/AccountSettings";
import SupplierAIChatbot from "./pages/supplier/AIChatbot";
import { RoleAccessRoute } from "./components/shared/RoleAccessRoute";
import BioStore from "./pages/store/BioStore";
import ProductPublic from "./pages/store/ProductPublic";
import ChatPage from "./pages/chat/ChatPage";
import Policies from "./pages/Policies";
import { SEOManager } from "./components/SEOManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SEOManager />
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
          <Route path="/buyer/disputes" element={<BuyerDisputes />} />
          <Route path="/buyer/verify-items" element={<BuyerMultiItemVerification />} />
          <Route path="/buyer/report-issue" element={<BuyerReportIssue />} />
          <Route path="/buyer/negotiation" element={<BuyerNegotiation />} />
          <Route path="/buyer/refund-partial" element={<BuyerPartialRefund />} />
          <Route path="/buyer/refund-success" element={<BuyerRefundSuccess />} />
          <Route path="/buyer/return-dispatch" element={<BuyerReturnDispatch />} />
          <Route path="/buyer/rider-payout" element={<BuyerRiderPayout />} />
          <Route path="/buyer/wrong-item" element={<BuyerWrongItem />} />
          <Route path="/buyer/redelivery" element={<BuyerRedelivery />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/buyer/transactions" element={<BuyerTransactions />} />
          <Route path="/buyer/help" element={<BuyerHelp />} />
          <Route path="/buyer/ai-chatbot" element={<BuyerAIChatbot />} />
          <Route path="/buyer/send-package" element={<BuyerSendPackage />} />
          <Route path="/buyer/pickup-tracking" element={<BuyerPickupTracking />} />
          <Route path="/buyer/settings" element={<BuyerAccountSettings />} />
          <Route path="/buyer/seller/:username" element={<BuyerSellerCatalog />} />
          <Route path="/buyer/packing-slip" element={<BuyerPackingSlip />} />
          <Route path="/buyer/browse" element={<BuyerBrowse />} />
          <Route path="/buyer/login" element={<BuyerLogin />} />
          {/* Seller flow */}
          <Route path="/seller" element={<RoleAccessRoute required="seller"><SellerDashboard /></RoleAccessRoute>} />
          <Route path="/seller/dashboard" element={<RoleAccessRoute required="seller"><SellerDashboard /></RoleAccessRoute>} />
          <Route path="/seller/dispatch" element={<RoleAccessRoute required="seller"><SellerDispatch /></RoleAccessRoute>} />
          <Route path="/seller/tracking" element={<RoleAccessRoute required="seller"><SellerTracking /></RoleAccessRoute>} />
          <Route path="/seller/orders" element={<RoleAccessRoute required="seller"><SellerOrders /></RoleAccessRoute>} />
          <Route path="/seller/transactions" element={<RoleAccessRoute required="seller"><SellerTransactions /></RoleAccessRoute>} />
          <Route path="/seller/dispute" element={<RoleAccessRoute required="seller"><SellerDispute /></RoleAccessRoute>} />
          <Route path="/seller/disputes" element={<RoleAccessRoute required="seller"><SellerDisputes /></RoleAccessRoute>} />
          <Route path="/seller/negotiate" element={<RoleAccessRoute required="seller"><SellerNegotiate /></RoleAccessRoute>} />
          <Route path="/seller/escalate" element={<RoleAccessRoute required="seller"><SellerEscalate /></RoleAccessRoute>} />
          <Route path="/seller/settings" element={<RoleAccessRoute required="seller"><SellerAccountSettings /></RoleAccessRoute>} />
          <Route path="/seller/fulfillment" element={<RoleAccessRoute required="seller"><SellerFulfillmentSettings /></RoleAccessRoute>} />
          <Route path="/seller/ai-chatbot" element={<RoleAccessRoute required="seller"><SellerAIChatbot /></RoleAccessRoute>} />
          {/* Help Centre (shared) */}
          <Route path="/help" element={<HelpCentre />} />
          <Route path="/help/article/:slug" element={<HelpArticle />} />
          <Route path="/help/contact" element={<HelpContact />} />
          <Route path="/help/agent" element={<HelpAgent />} />
          {/* Invite seller flow */}
          <Route path="/buyer/invite-seller" element={<InviteCompose />} />
          <Route path="/invite/seller/:token" element={<InvitedLanding />} />
          <Route path="/invite/transaction/:token" element={<InvitedTransaction />} />
          <Route path="/invited/:token/dashboard" element={<InvitedDashboard />} />
          <Route path="/invited/:token/withdraw" element={<InvitedWithdraw />} />
          {/* Supplier flow */}
          <Route path="/supplier" element={<RoleAccessRoute required="supplier"><SupplierDashboard /></RoleAccessRoute>} />
          <Route path="/supplier/dashboard" element={<RoleAccessRoute required="supplier"><SupplierDashboard /></RoleAccessRoute>} />
          <Route path="/supplier/onboarding" element={<RoleAccessRoute required="supplier"><SupplierOnboarding /></RoleAccessRoute>} />
          <Route path="/supplier/orders" element={<RoleAccessRoute required="supplier"><SupplierOrders /></RoleAccessRoute>} />
          <Route path="/supplier/transactions" element={<RoleAccessRoute required="supplier"><SupplierTransactions /></RoleAccessRoute>} />
          <Route path="/supplier/fulfillment" element={<RoleAccessRoute required="supplier"><SupplierFulfillment /></RoleAccessRoute>} />
          <Route path="/supplier/invite/:orderId" element={<RoleAccessRoute required="supplier"><SupplierInvite /></RoleAccessRoute>} />
          <Route path="/supplier/dispute-review" element={<RoleAccessRoute required="supplier"><SupplierDisputeReview /></RoleAccessRoute>} />
          <Route path="/supplier/disputes" element={<RoleAccessRoute required="supplier"><SupplierDisputes /></RoleAccessRoute>} />
          <Route path="/supplier/return-tracking" element={<RoleAccessRoute required="supplier"><SupplierReturnTracking /></RoleAccessRoute>} />
          <Route path="/supplier/return-inspection" element={<RoleAccessRoute required="supplier"><SupplierReturnInspection /></RoleAccessRoute>} />
          <Route path="/supplier/account" element={<RoleAccessRoute required="supplier"><SupplierAccountOverview /></RoleAccessRoute>} />
          <Route path="/supplier/settings-kyc" element={<RoleAccessRoute required="supplier"><SupplierSettingsKyc /></RoleAccessRoute>} />
          <Route path="/supplier/performance" element={<RoleAccessRoute required="supplier"><SupplierPerformance /></RoleAccessRoute>} />
          <Route path="/supplier/tier-progress" element={<RoleAccessRoute required="supplier"><SupplierTierProgress /></RoleAccessRoute>} />
          <Route path="/supplier/market-lookup" element={<RoleAccessRoute required="supplier"><SupplierMarketLookup /></RoleAccessRoute>} />
          <Route path="/supplier/settings" element={<RoleAccessRoute required="supplier"><SupplierAccountSettings /></RoleAccessRoute>} />
          <Route path="/supplier/ai-chatbot" element={<RoleAccessRoute required="supplier"><SupplierAIChatbot /></RoleAccessRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* Public storefront + chat */}
          <Route path="/u/:username" element={<BioStore />} />
          <Route path="/p/:productId" element={<ProductPublic />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
