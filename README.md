# AI Storefront 🛍️

AI Storefront is a modern web application that makes your e-commerce store accessible to AI assistants like Claude, ChatGPT, and other LLM-powered tools. By integrating our lightweight JavaScript library into your existing store, you can ensure your products are discoverable, properly described, and accurately recommended by AI tools.

## Features

-   **AI Agent Integration**: Make your store compatible with all major AI assistants
-   **Product Synchronization**: Automatically sync your product catalog from popular e-commerce platforms
-   **Detailed Analytics**: Track AI agent interactions, product impressions, and conversions
-   **Performance Monitoring**: Measure response times and schema health
-   **Easy Setup**: Simple JavaScript snippet integration for any website or e-commerce platform

## Tech Stack

-   **Frontend**: Next.js 15 with React 19, Tailwind CSS 4
-   **Backend**: Serverless API routes with Next.js
-   **Database**: Supabase (PostgreSQL)
-   **Authentication**: Supabase Auth
-   **Styling**: TailwindCSS
-   **Charts**: Recharts
-   **Deployment**: Vercel

## Getting Started

### Prerequisites

-   Node.js 18+ and npm/yarn
-   Supabase account
-   Vercel account (optional for deployment)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/ai-storefront.git
    cd ai-storefront
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn
    ```

3. Create a `.env.local` file with the following environment variables:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

4. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup

1. Set up the following tables in your Supabase project:

    - **sites**

        - `id` (uuid, primary key)
        - `domain` (text)
        - `user_id` (uuid, references auth.users)
        - `created_at` (timestamp with time zone)
        - `last_synced_at` (timestamp with time zone)

    - **products**

        - `id` (uuid, primary key)
        - `site_id` (uuid, references sites.id)
        - `title` (text)
        - `price` (decimal)
        - `image_url` (text)
        - `buy_url` (text)
        - `description` (text)
        - `created_at` (timestamp with time zone)
        - `last_synced_at` (timestamp with time zone)

    - **sync_events**
        - `id` (uuid, primary key)
        - `site_id` (uuid, references sites.id)
        - `event_type` (text)
        - `payload` (jsonb)
        - `created_at` (timestamp with time zone)

2. Set up the necessary RLS (Row Level Security) policies to secure your data.

## Deployment

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import your project into Vercel.
3. Add the environment variables in the Vercel project settings.
4. Deploy your application.

### Custom Domain Setup

1. Add your domain in the Vercel project settings.
2. Update your DNS records as instructed by Vercel.
3. Verify your domain.

## Store Integration

### Adding the JavaScript Snippet

Add the following script tag to your store's `<head>` section:

```html
<script src="https://yourdomain.com/injector.v1.js" async></script>
```

Replace `yourdomain.com` with your actual domain where the AI Storefront is hosted.

### Sitemap and Feed Integration

For bulk product sync, prepare either:

1. A product feed JSON URL (Shopify format or compatible)
2. A sitemap.xml URL that includes links to product pages

## Application Structure

-   `/app` - Next.js app directory
    -   `/api` - API routes
    -   `/components` - Reusable React components
    -   `/dashboard` - Dashboard pages
    -   `/utils` - Utility functions

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@aistorefront.com or open an issue in the GitHub repository.
