# Student Resources Platform (React Version)

This project is a reimplementation of the original Student Resources Platform, switching from Vue.js to React. Below is why I made the switch:

## Why I Switched from Vue to React

- **Popularity and Ecosystem**: React is the most widely used frontend framework (around 40-45% adoption vs. Vue’s 15-20% as of 2025 trends), offering a massive ecosystem with more libraries, tools, and community support. I wanted to tap into that for future scalability.
- **Developer Experience**: React’s JSX and hooks felt more intuitive for me compared to Vue’s template syntax, especially for managing state and side effects in a project like this with dynamic resource lists and forms.
- **Job Market**: React skills are in higher demand, and switching aligns with my career goals—more opportunities to flex this muscle!
- **Performance and Flexibility**: While Vue’s lightweight nature was great, React’s virtual DOM and flexibility for custom UI (like the sleek cards here) gave me a snappier feel that I couldn’t resist.
- **A Fresh Start**: The Vue project was solid, but I hit some styling snags with Tailwind. React gave me a clean slate to rebuild it better, and damn, it looks way cooler now!

## Project Features
- Multi-page app with React Router: Home, Resources, Add Resource, Login/Register.
- Backend reused from Vue project, connected to `student_resources` MySQL database.
- Inline styles for a polished, modern UI—gradient backgrounds, shadowed cards, and vibrant buttons.

## Running the Project
- Frontend: `npm start -- --port 3001` (runs on `http://localhost:3001`).
- Backend: `node server.js` in `backend/` (runs on `http://localhost:3000`).
