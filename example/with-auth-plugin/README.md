# Payload CMS Example Application to Test Run the Auth Plugin

### To Test Any Provider:

1. **Create a `.env` File**

   - Copy the variable names for the required plugin from the `.env.example` file into your new `.env` file.
   - Fill in the necessary values for these variables.

2. **Update the `payload.config.ts` File**

   - Modify `payload.config.ts` to test the required provider and configurations. Make sure the environment variable names match those in your `.env` file.

3. **Start the Local Dev Server**
   - Run `pnpm dev` to start the local development server.
