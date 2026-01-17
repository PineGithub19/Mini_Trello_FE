# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

# MiniTrelloFE

Frontend for a mini Trello-like task management application. This repository provides a modern, responsive, and accessible UI built with React, TypeScript, Vite, Tailwind CSS, and Shadcn UI components. The interface focuses on clarity, fast interactions, and a consistent design system across devices.

## Overview

MiniTrelloFE implements key Trello-inspired concepts: projects (boards), lists, tasks (cards), member management, and real-time notifications. It pairs a lightweight, secure authentication flow with protected routes, strong client-side validation, and predictable state management to make the app easy to extend and maintain.

## Key Features

- Built a modern and responsive frontend interface: a Trello-like UX optimized for desktop and mobile using React (v19), TypeScript, Vite for fast builds, Tailwind CSS for utility-first styling, and Shadcn UI for accessible primitives and consistent components.
- Light and Dark theme support: a theme system with persisted preferences, CSS variables and Tailwind integration to ensure a cohesive look across all screens and devices.
- Protected routing and authentication: `react-router-dom` (v7) powers nested and protected routes. Authentication uses JWT tokens exchanged with the backend; protected routes validate session state and redirect unauthenticated users to the login screen.
- Scalable state management: global state is managed with `zustand` for concise, performant stores, while React Context is used where scoped provider state or DI-style access is needed.
- Strong, reusable form handling: forms are built with `react-hook-form` and validated with `zod` schemas to ensure runtime and type-safe validation, clear error messages, and form components that can be reused across screens.
- Real-time notifications: Server-Sent Events (SSE) are used to push task updates and notifications to connected clients in real time, enabling immediate UI updates without polling.

## Architecture & Conventions

- Component structure: UI primitives live under `src/ui`, domain components under `src/projects`, `src/tasks`, `src/workspace`, and pages under `src/layouts` and `src/routes`.
- API client: centralized HTTP client and typed endpoints are in `src/query` and `src/routes/endpoints.ts` to keep network code consistent and easily mockable for tests.
- Stores & hooks: `src/store` and `src/hooks` contain `zustand` stores and reusable hooks (auth, projects, tasks, notifications) designed for composability.

## Getting Started

Prerequisites: Node.js (>=18) and npm or pnpm.

Install and run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

The frontend expects a compatible backend (see the backend repository link below) that exposes authentication endpoints and SSE notification streams.

## Backend & Demo

Backend Repository: https://github.com/PineGithub19/Mini_Trello

Demo video: (add YouTube demo link here)

## Contributing

Contributions are welcome. Please open issues for feature requests or bugs, and send pull requests with focused commits and a short description of the change.

## License

Specify your license here.
