# The Layered Home

A Next.js project with App Router, Tailwind CSS, GSAP animations, and embedded Sanity Studio.

## Tech Stack

- **Next.js 16** with App Router
- **Tailwind CSS 4** for styling
- **GSAP** for animations
- **Sanity Studio** embedded in the app

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Sanity

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

To get your Sanity project ID:
1. Go to [sanity.io](https://www.sanity.io) and create a new project
2. Copy your project ID from the project settings
3. Add it to your `.env.local` file

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Access Sanity Studio

Navigate to [http://localhost:3000/studio](http://localhost:3000/studio) to access the embedded Sanity Studio.

## Project Structure

```
├── app/
│   ├── studio/[[...index]]/  # Embedded Sanity Studio route
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── GSAPExample.tsx        # Example GSAP component
├── sanity/
│   └── schemas/               # Sanity schema definitions
└── sanity.config.ts           # Sanity configuration
```

## Features

### GSAP Animations

GSAP is installed and ready to use. See `components/GSAPExample.tsx` for a basic example.

### Sanity Studio

The Sanity Studio is embedded at `/studio`. You can customize schemas in `sanity/schemas/index.ts`.

### Tailwind CSS

Tailwind CSS is configured and ready to use throughout your application.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Sanity Documentation](https://www.sanity.io/docs)
