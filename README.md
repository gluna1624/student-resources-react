# Student Resources Platform

## Original Vue Version (March 14, 2025)
- Multi-page Vue CLI app with Vue Router.
- Backend with Node.js/Express, MySQL (`student_resources`), file uploads.
- Features: CRUD, user auth, file uploads, comments.

## React Version (March 16, 2025)
- Switched to React for a fresh, modern frontend.
- **Why the Switch**:
  - **Popularity**: React’s ~40-45% adoption vs. Vue’s 15-20% offers a bigger ecosystem.
  - **Dev Experience**: JSX and hooks felt snappier than Vue templates.
  - **Career**: More React jobs out there.
  - **Performance**: Virtual DOM and flexibility for slick UIs.
  - **Fresh Start**: Vue had styling hiccups; React looks way better now!
- Reuses original backend with `student_resources` database.
- Inline styles: gradient backgrounds, shadowed cards, vibrant buttons.

## Running the Project
- Frontend: `npm start -- --port 3001` (`http://localhost:3001`).
- Backend: `node server.js` in `backend/` (`http://localhost:3000`).