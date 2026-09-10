# 💻 Mini AI E-Commerce Frontend (Assignment 2)

React + TypeScript frontend application for the Mini AI E-Commerce Application. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and styled following the **Shadcn UI** modern SaaS dashboard aesthetic. Features **Google OAuth Sign-In**, **Product Catalog**, **Shopping Cart**, **Stripe Checkout**, **Customer Order History**, **Admin Dashboard**, and an **AI Customer Support Chat Widget**.

---

## 📋 Deliverables Overview

| Attribute | Specification |
| :--- | :--- |
| **Assignment** | Technical Interview Assignment 2 – Mini AI E-Commerce Application |
| **Total Development Time** | **24 Hours** |
| **Primary AI Coding Assistant** | **OpenAI Codex** |
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling & Components** | Tailwind CSS + Shadcn UI Aesthetic + Lucide Icons |

---

## 🤖 AI Tools & Development Usage

### **AI Assistant Used:** **OpenAI Codex**

### **How OpenAI Codex Was Utilized:**
* **Shadcn UI Component Architecture:** Designed reusable UI components (`button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `dialog.tsx`, `select.tsx`, `table.tsx`, `skeleton.tsx`) adhering to the minimalist Shadcn UI design system.
* **Page Layouts & Flows:** Built customer product listing, details view, shopping cart drawer, checkout review page, order tracking history, admin management dashboard, and AI support chat dialog.
* **OAuth & State Integration:** Integrated `@react-oauth/google` authentication flow, Cart Context state management, and async API integration with FastAPI backend.

---

## 🛍️ Key Features & Pages

* **Google Sign-In Authentication:** Seamless customer authentication using `@react-oauth/google`.
* **Product Catalog (`/`):** Responsive grid of featured products with stock status badges and quick view details.
* **Product Details (`/products/:id`):** Full product details, stock availability indicator, quantity counter, and Add to Cart actions.
* **Shopping Cart (`/cart`):** Cart item management with quantity adjustments, item removals, subtotal calculation, and checkout trigger.
* **Stripe Checkout (`/checkout`):** Order review, order creation call, and secure Stripe payment redirection.
* **Customer Order History (`/orders` & `/orders/:id`):** Personal order tracking with real-time status badges (`pending`, `paid`, `failed`, `cancelled`).
* **Admin Dashboard (`/admin`):** Tabbed interface for Product management (CRUD via dialog forms) and Order fulfillment status updates.
* **AI Support Chat Widget:** Interactive customer support chat modal connected to backend LangChain agent for catalog and order inquiries.

---

## 🛠️ Frontend Tech Stack

* **Core:** React 18 + TypeScript + Vite
* **Styling:** Tailwind CSS + Shadcn UI Design System
* **UI Components & Icons:** Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-slot`) + Lucide React
* **Authentication:** `@react-oauth/google`
* **Routing:** React Router v7

---

## 🚀 Setup & Local Execution Guide

### **Prerequisites**
* Node.js v18+ & `npm`

### **Installation**

```bash
# Navigate to frontend folder
cd Mini-Ecommerce-Website

# Install dependencies
npm install
```

### **Environment Configuration (`.env`)**
Create a `.env` file in `Mini-Ecommerce-Website/`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### **Development & Production Build Commands**

```bash
# Run local development server
npm run dev

# Run TypeScript type check and production bundle build
npm run build

# Preview production build locally
npm run preview
```

> Local development server will run at: `http://localhost:5173`
