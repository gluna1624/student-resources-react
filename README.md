# Student Resources Platform (React Version)

This project is a reimplementation of the original Student Resources Platform, switching from Vue.js to React, developed by Gregory Luna (gvl718) for CS-691 Spring 2025 at LIU. Below outlines the transition and current features as of March 16, 2025.

## Why I Switched from Vue to React
- **Popularity and Ecosystem**: React’s ~40-45% adoption vs. Vue’s 15-20% (2025 trends) offers a larger ecosystem, more libraries, and community support for future scalability.
- **Developer Experience**: JSX and hooks felt more intuitive than Vue’s templates, especially for managing state and dynamic UI like resource lists and forms.
- **Career**: React skills are in higher demand, aligning with job market trends.
- **Performance**: React’s virtual DOM and flexibility enabled snappier, custom UI (e.g., shadowed cards).
- **Fresh Start**: Vue hit Tailwind snags; React provided a cleaner slate—looks way better now!

## Project Features
- **Multi-Page App**: Built with React (Create React App, TypeScript) and React Router: Home, Resources, Add Resource, Login/Register, Admin.
- **Backend**: Reused from Vue project (Node.js/Express), connected to `student_resources` MySQL database on `localhost:3000`.
- **Inline Styles**: Gradient nav bar (`#2563eb` to `#1d4ed8`), shadowed cards/buttons, Roboto font—modern and polished UI.
- **Core Functionality**:
  - **Resource CRUD**: Create (file uploads via multer), Read (list with tags/upvotes), Update, Delete—all in `Resources.tsx` and `AddResource.tsx`.
  - **User Auth**: Register, login, logout with session handling (`Login.tsx`).
  - **Comments**: Per-resource comments with GET/POST routes (`Resources.tsx`).
- **Enhanced Features**:
  - **Tags (#1)**: Categorize resources (e.g., "Math", "Notes") via `tags` and `resource_tags` tables, added to `/resources` and `/add-resource`.
  - **Ratings/Upvotes (#2)**: Upvote button and count via `resource_ratings` table, integrated in `/resources`.
  - **Tutor Verification (#3)**: "✅" badge for verified users, admin dashboard (`Admin.tsx`) with `/admin/verify/:user_id` route.
  - **Resource Preview (#4)**: "Preview" button shows first 200 chars of files in a modal (`Resources.tsx`, `/resources/:id/preview` route).
  - **YouTube Links**: Add educational video URLs (e.g., `https://www.youtube.com/watch?v=...`) in `AddResource.tsx`, displayed as red "YouTube" links in `Resources.tsx`.

## Running the Project
- **Frontend**: `npm start -- --port 3001` (runs on `http://localhost:3001`).
- **Backend**: `node server.js` in `backend/` (runs on `http://localhost:3000`).
- **Database**: MySQL `student_resources` with tables: `users`, `resources` (now with `youtube_url`), `comments`, `tags`, `resource_tags`, `resource_ratings`.
- **Setup**: Ensure Node.js (v22.13.1), npm, and MySQL are installed; run `npm install` in root and `backend/`.

## Next Steps
- **#5 Test and Deploy**: Test all features locally, build with `npm run build`, deploy (e.g., Vercel).
- **Future**: Notifications (#5), advanced search (#6), admin dashboard enhancements (#7).