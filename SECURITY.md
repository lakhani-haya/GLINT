# Security Guidelines

## API Keys and Secrets

This project uses sensitive API keys and credentials that **must never be committed** to the repository.

### Protected Files

The following files are automatically ignored by git and should **never** be committed:

- `.env` - Environment variables for local development
- `.env.*` - Any environment-specific files (except `.env.example`)
- `glint-server/.env` - Server-side environment variables
- `*.pem`, `*.key` - Private keys and certificates
- `secrets.json` - Any secrets configuration files

### Setup Instructions

1. **Never commit your actual API keys**
   
2. **For the Glint Server:**
   ```bash
   cd glint-server
   cp .env.example .env
   # Edit .env and add your actual OpenAI API key
   ```

3. **Verify your .env is ignored:**
   ```bash
   git status
   # .env should NOT appear in the list of changes
   ```

### Environment Variables

The project uses the following environment variables:

#### glint-server/.env
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3000)

#### Root .env (optional)
- `EXPO_PUBLIC_API_BASE` - API base URL for the mobile app

### Before Committing

Always check that you haven't accidentally included sensitive files:

```bash
# Check what files are staged
git status

# Make sure no .env files or API keys are listed
git diff --cached
```

### What to Do If You Accidentally Commit a Secret

If you accidentally commit an API key or secret:

1. **Immediately revoke/rotate the exposed key** (e.g., regenerate your OpenAI API key)
2. Remove the file from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch glint-server/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if you have access): `git push --force`
4. Contact repository administrators if you don't have force push access

### Example .env File

See `glint-server/.env.example` for the template. Never commit the actual `.env` file.

## Reporting Security Issues

If you discover a security vulnerability, please email the repository owner privately rather than opening a public issue.
