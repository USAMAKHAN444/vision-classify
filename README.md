# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/65dec110-bc66-4550-a7f4-dcc0720e75b2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/65dec110-bc66-4550-a7f4-dcc0720e75b2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OCR API Integration (HTTPS)

## API Integration

This application is integrated with the OCR categorization service at `https://gb-ocr-stage.vertekx.com/categorize`.

### Features
- **HTTPS Support**: Secure API communication
- **Automatic Retry**: Configurable retry logic with exponential backoff
- **Error Handling**: Comprehensive error handling and user-friendly messages
- **Timeout Management**: Configurable request timeouts
- **Environment Configuration**: Easy setup through environment variables

### Quick Start
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Upload documents through the Giveback Portal
4. Documents are automatically categorized using the OCR API

### Testing
Run the API test script to verify connectivity:
```bash
node test-api.js
```

For detailed API integration information, see [API_INTEGRATION.md](./API_INTEGRATION.md).

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/65dec110-bc66-4550-a7f4-dcc0720e75b2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
