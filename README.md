# Supabase Teams Application

A full-stack application built with Supabase for team collaboration and product management.

## Features

- User authentication and management
- Team creation and collaboration
- Product management system
- Real-time updates
- Edge Functions for API endpoints

## Tech Stack

- **Backend**: Supabase Edge Functions
- **Database**: PostgreSQL (Supabase)
- **Frontend**: React/TypeScript
- **Authentication**: Supabase Auth
- **Deployment**: Supabase

## Project Structure

```
├── supabase/
│   ├── functions/
│   │   └── api/
│   │       ├── users/
│   │       ├── teams/
│   │       ├── products/
│   │       ├── common/
│   │       ├── utils/
│   │       └── db/
└── client/
    ├── src/
    └── public/
```

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up Supabase project
4. Run migrations
5. Start development server

## Environment Variables

Copy `.env.example` to `.env.local` and configure your Supabase credentials.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License