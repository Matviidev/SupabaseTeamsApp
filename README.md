# Supabase Teams Application

A full-stack application built with Supabase for team collaboration and product management.

## Features

- User authentication and management
- Team creation and collaboration
- Product management system
- Real-time updates
- Edge Functions for API endpoints

## Tech Stack

- **Backend**: Supabase Edge Functions (Deno/TypeScript)
- **Database**: PostgreSQL (Supabase)
- **Frontend**: React/TypeScript with Vite
- **UI/Styling**: Tailwind CSS, Radix UI
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)

## Project Structure

This project is split into two main components:

- `client/`: The React frontend application.
- `supabase/`: The Supabase project configuration, migrations, and Edge Functions.

```
├── supabase/
│   ├── functions/    # Supabase Edge Functions source code
│   ├── migrations/   # SQL migrations files
│   └── config.toml   # Supabase CLI configuration
├── client/
│   ├── src/          # React application source code
│   └── package.json  # Client dependencies and scripts
├── .env.example      # Template for environment variables
└── README.md
```

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

You need to have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Clone the repository

```bash
git clone https://github.com/Matviidev/SupabaseTeamsApp
cd SupabaseTeamsApp
```

### 2. Configure Environment Variables

Create a local environment file by copying the example and filling in your Supabase project details.

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

At a minimum, you will need to set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Set up Supabase Local Development

Start the local Supabase stack, which includes the database, auth, storage, and the Edge Functions runtime.

```bash
supabase start
```

This command will:

- Start all local services.
- Apply database migrations found in `supabase/migrations`.
- Start the local Studio interface at `http://localhost:54323`.

### 4. Run the Client Application

Navigate into the client directory and install dependencies, then start the development server.

```bash
cd client
npm install
npm run dev
```

The frontend application should now be running at `http://localhost:3000` (or the address shown in the console).

### 5. Deploy Functions (Optional)

If you modify any Edge Functions in `supabase/functions`, you can deploy them to your remote Supabase project:

```bash
# Ensure you are logged in to the CLI
supabase login

# Link the local project to your remote one (only needed once)
# supabase link --project-ref <your-project-id>

# Deploy all functions
supabase functions deploy --no-verify-jwt
```
