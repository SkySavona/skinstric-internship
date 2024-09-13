# Skinstric.ai Frontend Project

This repository is part of an internship project where I am contributing to the frontend development of **Skinstric**, an AI startup specializing in customized skincare products. The aim is to replace Skinstric’s outdated codebase with modern coding best practices and technologies, delivering a scalable and maintainable solution.

**Website:** [skinstric-internship.vercel.app](https://skinstric-internship.vercel.app)

![Screenshot 2024-09-12 at 6 40 53 PM](https://github.com/user-attachments/assets/82c94eb8-8b6a-4916-8193-76e0be403ad1)


## Project Overview

Skinstric.ai is an AI-powered skincare company that customizes skincare routines based on user profiles. The purpose of this internship task is to develop and modernize their website, improving its maintainability and performance. 

The site features a sophisticated user experience with modern UI components, animations, and APIs integrated to provide a seamless journey for users. This project provides an opportunity to validate my frontend development skills in a real-world scenario.

### Key Features

- AI-powered personalized skincare solutions
- User-friendly onboarding with location-based inputs using Google Maps API
- Dynamic animations with **GSAP** for improved user experience
- Responsive design for various screen sizes
- Session-based toasts and user notifications for interactive feedback

## Technologies Used

- **Next.js** - React framework for server-side rendering and optimized performance.
- **React** - A JavaScript library for building user interfaces.
- **TypeScript** - Type safety for better developer experience and error checking.
- **Tailwind CSS** - Utility-first CSS framework for fast and responsive design.
- **GSAP (GreenSock Animation Platform)** - High-performance animations.
- **Axios** - Promise-based HTTP client for making API requests.
- **Google Maps API** - Integrated for real-time location-based services.
- **React Toastify** - Notification management for session-based toasts.
- **Vercel** - Platform for deployment and hosting.

## Project Structure

```plaintext
├── public/                         # Static assets and public files
├── src/                            # Main application source code
│   ├── app/
│   │   ├── api/
│   │   │   └── submit/             # API route for form submission handling
│   │   │       └── route.ts
│   │   ├── components/ui/          # Reusable UI components
│   │   │   ├── Preloader.tsx       # Preloader component for loading states
│   │   │   └── SessionToast.tsx    # Toast notification component
│   │   ├── fonts/                  # Custom fonts used for the website
│   │   ├── introduction/           # Main onboarding and introduction page
│   │   │   └── page.tsx
│   │   └── layout.tsx              # Main layout for the application
│   └── globals.min.css             # Global stylesheets
├── .eslintrc.json                  # ESLint configuration for code linting
├── .gitignore                      # Files and directories to be ignored by Git
├── next.config.mjs                 # Next.js configuration file
├── package-lock.json               # Auto-generated lock file for dependencies
├── package.json                    # Project dependencies and scripts
├── postcss.config.mjs              # PostCSS configuration for CSS processing
├── README.md                       # Project documentation
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
```

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- Node.js (v16 or above)
- npm or yarn for package management

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/skinstric-frontend.git
   cd skinstric-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The site will be accessible at `http://localhost:3000`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

### Linting

Ensure code quality and consistency by running the lint command:

```bash
npm run lint
```

## Contribution Guidelines

If you'd like to contribute to this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request with a detailed description of what you've done.

Ensure your code adheres to the linting and formatting rules before submitting.

## License

This project is licensed under the MIT License.
