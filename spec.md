# Agenda Automation Station

## Current State
- Full Motoko backend with modules: registrations (submitRegistration, getAllRegistrations, updateRegistrationStatus, getCallerRegistrationStatus), shipments, employees, accounting, inventory, customers/suppliers, service requests, user profiles, payment accounts, authorization (admin/user roles), user approval
- React frontend with: LandingPage, PricingPage, BlogListingPage, BlogArticlePage, AdminApprovalPanel, DashboardLayout, and all module pages (Sales, Services, Logistics, Financial, Employee, Operations, BusinessIntelligence, DashboardHome)
- Marketing components: MarketingHeader, MarketingFooter, EmailCaptureForm, ReferralSection
- Admin panel at /admin/approvals -- shows pending registrations, approve/deny controls, protected by isCallerAdmin() check
- Payment flow: user pays via PayPal (jeffbasham41@gmail.com), submits transaction ID on registration form, admin manually approves

## Requested Changes (Diff)

### Add
- **AI Customer Service Chat Widget**: A 24/7 rule-based chat assistant widget fixed to the bottom-right of the landing page, pricing page, and public pages. It should answer FAQs about Agenda Automation Station (pricing, features, how to subscribe, PayPal payment process, how to get access after paying). It guides users through: 1) Choose a plan on /pricing, 2) Pay via PayPal to jeffbasham41@gmail.com, 3) Come back and register with transaction ID, 4) System auto-approves and grants access code. The chat widget should feel conversational and professional.
- **Auto-approval on transaction ID submission**: When a user submits their registration (name, email, plan, PayPal transaction ID), the system should immediately auto-approve them (call updateRegistrationStatus with #approved) right after submitRegistration succeeds, rather than requiring manual admin approval. This makes access fully automatic.
- **Access code display after registration**: Once registration is submitted and auto-approved, show the user a unique access code (generated from their principal + timestamp hash) and instructions to use it to log in. This is a frontend-generated display code.
- **Admin login instructions visible on /admin/approvals page**: Add a clear helper section at the top of the AdminApprovalPanel explaining: "To access admin, navigate to /admin/approvals and log in with Internet Identity. You are the admin if your account was the first to log in (or was manually assigned admin role)."

### Modify
- **Registration / payment flow on PricingPage**: After clicking "Pay via PayPal" button, the user is redirected to PayPal. When they return, show a registration form prominently with clear instructions: "Paid? Enter your details below to activate your account instantly." The form auto-submits and auto-approves.
- **LandingPage**: Add the AI chat widget component to the landing page.
- **AdminApprovalPanel**: Add a prominent info banner at the top explaining how to access the admin panel (for the platform owner). Keep all existing approve/deny functionality.

### Remove
- Nothing removed

## Implementation Plan
1. Create `AIChatWidget.tsx` component -- fixed bottom-right chat bubble, opens a chat panel, handles FAQ responses with a rule-based engine covering: pricing plans, PayPal payment instructions (jeffbasham41@gmail.com), how access works, features list, support questions. Has a pre-loaded greeting message. Supports a simple input field and sends responses.
2. Update `PricingPage.tsx` -- after PayPal button click, scroll to / show a registration form with: full name, email, subscription tier (pre-filled), PayPal transaction ID. On submit: call submitRegistration, then immediately call updateRegistrationStatus with #approved to auto-approve, then show a success state with generated access code.
3. Update `LandingPage.tsx` -- import and render `<AIChatWidget />` at bottom of page.
4. Update `PricingPage.tsx` -- also render `<AIChatWidget />`.
5. Update `AdminApprovalPanel.tsx` -- add info banner at top explaining admin access steps.
6. Validate: typecheck, lint, build pass.
