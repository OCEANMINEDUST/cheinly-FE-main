# Cheinly Frontend

Frontend application for the Cheinly ecosystem — a multi-actor commerce, escrow, logistics, and fulfillment platform connecting buyers, sellers, riders, suppliers, and administrators.



# Overview

Cheinly is a modern commerce infrastructure platform designed to support:

* Buyer commerce experiences
* Seller operations and storefront management
* Rider logistics and delivery tracking
* Supplier inventory and fulfillment management
* Escrow-enabled transactions
* Real-time order lifecycle tracking
* AI-powered workflows and automation

This repository contains the frontend applications and shared UI packages powering the Cheinly ecosystem.



# Architecture

This project uses a monorepo architecture.

```txt
apps/
  buyer/
  seller/
  rider/
  supplier/
  admin/

packages/
  ui/
  auth/
  api/
  database/
  shared/
  config/
```



# Applications

## Buyer App

Features:

* Product discovery
* Secure checkout
* Escrow payments
* Real-time order tracking
* Wallet and transaction history
* Notifications
* Customer support



## Seller Dashboard

Features:

* Product management
* Inventory tracking
* Order management
* Escrow verification
* Sales analytics
* Store customization
* Logistics coordination



## Rider App

Features:

* Delivery management
* Route tracking
* Order pickup verification
* Delivery confirmation
* Earnings dashboard
* Live delivery updates


## Supplier Portal

Features:

* Inventory supply management
* Product fulfillment workflows
* Stock updates
* Supplier analytics
* Purchase requests
* Seller coordination



## Admin Dashboard

Features:

* Platform monitoring
* User management
* Dispute resolution
* Escrow management
* Fraud monitoring
* Analytics and reporting
* System configuration

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Zustand / Redux Toolkit
* React Query / TanStack Query
* Framer Motion
* React Hook Form
* Zod



## Backend Integration

* REST API (Axios client)
* MongoDB
* Cloudinary (Media Hosting)
* Node.js / Express (cheinly-BE)
* WebSockets
* Redis / BullMQ



## Infrastructure

* TurboRepo
* pnpm Workspaces
* Docker
* Railway / Vercel
* GitHub Actions



# Design System

The project uses a shared design system located in:

```txt
packages/ui
```

This package contains:

* Shared components
* Typography system
* Color tokens
* Buttons
* Inputs
* Cards
* Tables
* Modals
* Layout components
* Icons
* Loading states
* Toast notifications



# Getting Started

## Prerequisites

Install:

* Node.js >= 20
* pnpm
* Git



# Installation

```bash
git clone https://github.com/your-org/cheinly-frontend.git
```

```bash
cd cheinly-frontend
```

```bash
pnpm install
```



# Running Development Server

Run all apps:

```bash
pnpm dev
```

Run a specific app:

```bash
pnpm --filter buyer dev
```

```bash
pnpm --filter seller dev
```

```bash
pnpm --filter rider dev
```

```bash
pnpm --filter supplier dev
```

```bash
pnpm --filter admin dev
```



# Environment Variables

Create a `.env.local` file in each application.

Example:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
NEXT_PUBLIC_APP_ENV=
NEXT_PUBLIC_MAP_API_KEY=
NEXT_PUBLIC_PUSHER_KEY=
```



# Folder Structure

Example structure:

```txt
src/
  app/
  components/
  features/
  hooks/
  lib/
  services/
  store/
  styles/
  types/
  utils/
```



# State Management

The project uses:

* Zustand / Redux Toolkit for global state
* React Query for server state
* Context API where appropriate

---

# Authentication

Authentication supports:

* JWT authentication
* OAuth providers
* Role-based access control
* Multi-actor login flows
* Session persistence

Roles include:

* Buyer
* Seller
* Rider
* Supplier
* Admin



# Escrow Workflow

High-level flow:

1. Buyer places order
2. Funds held in escrow
3. Seller confirms order
4. Rider fulfills delivery
5. Buyer confirms receipt
6. Escrow releases payment



# API Integration

API utilities are shared inside:

```txt
packages/api
```

Features:

* Shared API clients
* Typed requests
* Request interceptors
* Error handling
* Authentication middleware
* Retry logic



# Code Quality

Tools used:

* ESLint
* Prettier
* Husky
* lint-staged
* TypeScript strict mode

Run linting:

```bash
pnpm lint
```

Run formatting:

```bash
pnpm format
```

Run type checks:

```bash
pnpm type-check
```



# Testing

Testing stack:

* Jest
* React Testing Library
* Playwright / Cypress

Run tests:

```bash
pnpm test
```



# Build

```bash
pnpm build
```



# Deployment

Supported platforms:

* Vercel
* Railway
* Docker
* AWS



# Performance Optimization

Strategies used:

* Code splitting
* Lazy loading
* Image optimization
* Dynamic imports
* Server-side rendering
* Edge rendering
* Caching strategies



# Security

Security practices:

* Role-based access control
* Secure token handling
* API validation
* CSRF protection
* Rate limiting
* Secure headers
* Environment variable protection



# Accessibility

Accessibility goals:

* Keyboard navigation
* ARIA labels
* Color contrast compliance
* Responsive design
* Screen reader support



# Contribution Guide

## Branch Naming

```txt
feature/
fix/
refactor/
hotfix/
```

Example:

```txt
feature/buyer-checkout-flow
```



# Commit Convention

```txt
feat:
fix:
refactor:
docs:
style:
test:
```

Example:

```txt
feat: implement escrow checkout workflow
```



# Pull Requests

Requirements:

* Pass linting
* Pass tests
* No TypeScript errors
* Include screenshots for UI changes
* Small focused commits



# Product Vision

Cheinly aims to build trusted commerce infrastructure for Africa by combining:

* Escrow technology
* Logistics infrastructure
* Supplier management
* Commerce tooling
* Real-time operations
* Financial trust systems



# Roadmap

Planned features:

* AI-powered recommendations
* Real-time dispatch optimization
* Wallet integrations
* Offline-first rider app
* Supplier analytics engine
* Marketplace APIs
* Embedded finance
* Fraud detection systems


# Maintainers

Maintained by the Cheinly Engineering Team.



# License

Proprietary — All rights reserved.

Copyright © 2026 Cheinly.


