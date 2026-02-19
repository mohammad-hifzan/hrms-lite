# Environment Variables Setup

This project uses environment variables for configuration. Follow these steps to set up:

## Backend (Django)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the following values:
   - `SECRET_KEY`: Generate a new secret key for production
   - `DEBUG`: Set to `False` in production
   - `ALLOWED_HOSTS`: Add your domain(s) in production
   - Database credentials: Update `DB_NAME`, `DB_USER`, `DB_PASSWORD`, etc.
   - `CORS_ALLOWED_ORIGINS`: Add your frontend URL(s) in production

## Frontend (React)

1. Copy the example environment file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `.env` and update:
   - `REACT_APP_API_BASE_URL`: Set to your Django backend URL (e.g., `http://localhost:8000/api/` for development)

## Important Notes

- Never commit `.env` files to version control (they're in `.gitignore`)
- Always use `.env.example` as a template for new environments
- Restart your servers after changing environment variables
- For React, environment variables must start with `REACT_APP_` to be accessible
