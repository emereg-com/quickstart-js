# Emereg Quickstart

This is a [Emereg](https://emereg.com) quickstart project.

## Getting Started
1. Create an Account and Project on [Emereg](https://emereg.com).
2. Get your API token: [Instructions](https://emeregpteltd.mintlify.app/quickstart).
3. Create a `.env.local` file in the root of the project and add the following:
    ```js
    EMEREG_API_TOKEN={api_token_from_platform}
    ```
4. Update `project_id` in `app/api/v/1/sessions`.
5. Start server with:
    ```sh
    npm i && npm run dev
    ```
6. Make a request on the updated API:
    ```sh
    curl --location 'localhost:3000/api/v1/sessions' \
    --header 'Content-Type: application/json' \
    --data '{}'
    ```

Note: review `next.config.mjs` for project settings.

# NextJS

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
