# Quest Dashboard

A simple, modern dashboard for managing vendor's products, built with Vite, React, and a powerful modern stack.

## Features

- **Two-phase Authentication**
  - User login (JWT + simple refresh token mechanism)
  - Vendor creation flow

- **Product Management**
  - Add, update, and delete your products

- **Custom Form Inputs**
  - Enhanced user experience with custom input components

- **Tech Stack**
  - [Vite](https://vitejs.dev/) (CSR only)
  - [shadcn/ui](https://ui.shadcn.com/) for UI components
  - [TanStack Query](https://tanstack.com/query/latest) for data fetching and caching
  - [Zod](https://zod.dev/) for schema validation
  - [React Hook Form](https://react-hook-form.com/) for form management
  - [Tailwind CSS](https://tailwindcss.com/) for styling

- **APIs**
  - Uses two separate APIs:
    - **User API:** Handles authentication and user operations  
      _Source: `/src/services/user-api/`_
    - **Administration API:** Handles vendor and product management  
      _Source: `/src/services/admin-api/`_

- **Design**
  - Clean, simple, and responsive interface

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```
   ```bash
   npm build
   ```

**Folder Structure**

- **_src/components/_** – UI and dashboard components
- **_src/services/user-api/_** – User authentication and profile API logic
- **_src/services/admin-api/_** – Vendor and product management API logic
- **_src/context/_** – React context providers (e.g., user state)
- **_src/hooks/_** – Custom React hooks
