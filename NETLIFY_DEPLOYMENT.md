# Deploying Phrasal Verbs Flashcards to Netlify

This guide will walk you through deploying your Phrasal Verbs Flashcards app to Netlify.

## Prerequisites

- A GitHub account
- Your code is pushed to a GitHub repository
- A Netlify account (you can sign up at [netlify.com](https://netlify.com) using your GitHub account)

## Deployment Steps

### 1. Push your latest changes to GitHub

Make sure all your latest changes are pushed to your GitHub repository:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push
```

### 2. Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com/)
2. Log in with your GitHub account
3. Click "New site from Git"
4. Select "GitHub" as your Git provider
5. Authorize Netlify to access your GitHub repositories if requested
6. Select your "flashcards" repository

### 3. Configure Deployment Settings

In the deployment configuration screen:

1. **Branch to deploy**: `main`
2. **Build command**: `npm run build` (This is already configured in your netlify.toml file)
3. **Publish directory**: `build` (This is already configured in your netlify.toml file)
4. Click "Deploy site"

### 4. Wait for Deployment

Netlify will now:
1. Clone your repository
2. Run your build command
3. Deploy your site

This process usually takes 1-3 minutes.

### 5. Set Up Custom Domain (Optional)

Once deployed, you can:
1. Click on "Domain settings"
2. Either use the free Netlify subdomain or configure your own custom domain

### 6. Enable HTTPS (Automatic)

Netlify automatically provisions SSL certificates for your site using Let's Encrypt.

### 7. Test Your PWA

1. Visit your deployed site on a mobile device
2. You should be prompted to "Add to Home Screen" after a few visits
3. Test that the app works offline by enabling airplane mode after loading the app

## Continuous Deployment

Any future changes you push to your GitHub repository will automatically trigger a new build and deployment on Netlify.

## Troubleshooting

If you encounter any issues with your deployment:

1. Check the deployment logs in Netlify
2. Ensure your service worker is correctly registered
3. Verify that your manifest.json is properly configured
