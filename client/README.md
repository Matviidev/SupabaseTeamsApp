# Team Products Management App  

A collaborative platform where users can **create or join a team** and manage their team’s products together.  
The entire application is powered by **Supabase services** (Auth, Database, Edge Functions, Realtime, and Storage).  

---

## ✨ Features  

### 🔐 Authentication  
- Email & Password with **account verification**  
- **Google Auth**  
- Forgot password support  
- On first login, users can:  
  - **Create a new team** (with a unique invite code generated automatically)  
  - OR **join an existing team** using an invite code  

### 👥 Team Management  
- Each user belongs to **one team only**  
- Teams can be created instantly, or joined via invite code  
- Users interact only within their own team  

### 📦 Product Management  
- Full **CRUD operations** on products within a team  
- Product structure:  
  - Title  
  - Description  
  - Image  
  - Status (`Draft` | `Active` | `Deleted`)  
- Rules:  
  - Products can be edited only while in **Draft** status  
  - Deleting a product → sets status to **Deleted** (not permanently removed)  
  - **Cron task** deletes “Deleted” products older than 2 weeks  
- Enhanced features:  
  - Table display with **pagination**  
  - **Filters**: status, creation/update date, creator  
  - **Full-text search** by title & description  

### 🟢 Realtime Presence  
- Display which team members are **online/offline** in real time (via Supabase Realtime)  

### 🛠 Supabase Integration  
- Supabase **Auth** for authentication  
- Supabase **UI** for auth components  
- Supabase **Database** with Row-Level Security (RLS)  
- Supabase **Storage** for product images  
- Supabase **Edge Functions** for backend logic (with shared utils folder)  
- Supabase **Realtime** for online/offline status  
- Supabase **Migrations** for schema management  
- Local development supported with **Supabase containers**  

---

## 🏗️ Tech Stack  

**Frontend**  
- [React 19](https://react.dev/)  
- [React Router v7](https://reactrouter.com/)  
- [Zustand](https://zustand-demo.pmnd.rs/) – state management  
- [TailwindCSS v4](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)  
- [Lucide Icons](https://lucide.dev/)  
- [TanStack Query](https://tanstack.com/query/latest) for server state caching  
- [Axios](https://axios-http.com/)  
- [Shadcn UI](https://ui.shadcn.com/) components  

**Backend (via Supabase Edge Functions)**  
- [Supabase JS](https://supabase.com/docs/reference/javascript) as ORM  
- [Supabase Auth](https://supabase.com/auth)  
- [Supabase Database](https://supabase.com/database)  
- [Supabase Storage](https://supabase.com/storage)  
- [Supabase Realtime](https://supabase.com/realtime)  

**Tooling**  
- [Vite](https://vitejs.dev/) – build tool  
- [TypeScript](https://www.typescriptlang.org/)  
- [ESLint](https://eslint.org/)  

---

## ⚙️ Environment Variables  

Create a `.env` file in the project root with:  

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🚀 Getting Started  

### 1. Clone the repository  
```bash
git clone https://github.com/plinadev/team-products-management-app.git
cd team-products-management-app
```

### 2. Install dependencies  
```bash
npm install
```

### 3. Setup Supabase  
- Create a new project in [Supabase](https://supabase.com/)  
- Copy the project’s **URL** and **Anon Key** → paste into `.env`  
- Apply database schema using Supabase migrations  

### 4. Run locally  
```bash
npm run dev
```
The app will be available at: **http://localhost:5173**  

---

## 📦 Deployment  

- Check out depolyed application [here](https://team-products-management-app.vercel.app) 

---
