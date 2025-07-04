# Zenith - AI Prompt Management Application

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Prerequisites

1. Push your code to a GitHub repository
2. Enable GitHub Pages for your repository:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Select "GitHub Actions" as the source

### Configuration

Before deployment, make sure to:

1. Update the `homepage` field in `frontend/package.json` with your GitHub username:
   ```
   "homepage": "https://YOUR_USERNAME.github.io/Zenith"
   ```

2. Set up the following secret in your GitHub repository (if needed):
   - `REACT_APP_API_URL`: URL of your backend API

### Deployment Process

The deployment will automatically trigger when you:
- Push to the `main` branch
- Create a pull request to the `main` branch
- Manually trigger the workflow from the Actions tab

### Manual Deployment

You can manually trigger the deployment from the GitHub Actions tab in your repository.

## Local Development

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Backend Setup

Create a `.env` file inside the `backend` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
# PORT=5000
```

`MONGODB_URI`, `JWT_SECRET`, and `JWT_EXPIRES_IN` are required. `PORT` is optional and defaults to `5000`.
The backend expects a MongoDB database connection rather than Netlify DB or Postgres. An example configuration is provided in `backend/.env.example`.

## Building for Production

### Frontend

```bash
cd frontend
npm install
npm run build
```

### Backend

```bash
cd backend
npm install
npm start
```
