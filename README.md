# Lessonary — Personal Learning Studio

A private, browser-based AI study companion built from the Education & Curriculum Builder skill. It helps one learner plan study, ask a tutor questions, practice, and reflect on personal progress.

## Run it locally

1. Install Node.js 20.9 or later.
2. Open this folder in a terminal and run `npm install`.
3. Run `npm run dev` and open the local address printed in the terminal.

The app opens in **Demo mode** with a sample learner profile and a Grade 6 water-cycle study plan. Study plans, completed lessons, practice drafts, progress snapshots, and tutor chat are saved in that browser's local storage.

## Enable AI generation

1. Create an AI Gateway key in your Vercel AI Gateway account.
2. Copy `.env.example` to `.env.local`.
3. Add the key to `AI_GATEWAY_API_KEY`. The optional `AI_MODEL` defaults to `google/gemini-3.6-flash`.
4. Restart the development server.

The key stays on the server and is never stored in browser storage. AI generation supports study plans, practice questions and rubrics, personal progress snapshots, and tutor chat. Without a key, the app falls back to clearly indicated demo content.

## Included

- Personal learning dashboard with goals, streak, activity, and a next lesson.
- Study-plan builder with learner level, subject, timeframe, goal, and optional text notes.
- Private AI tutor chat with follow-up context and quick knowledge checks.
- Study space with guided lessons, quizzes, explanations, and saved completion.
- Practice lab with generated questions, answer guidance, and a four-level rubric.
- Personal progress snapshots from saved scores and optional self-reflection, with print support.
- Responsive layout for desktop and mobile screens.

## Current scope

This is a local-first individual MVP. The profile is sample data; saved work stays in the current browser. Sign-in, cloud sync, PDF extraction, and production privacy controls are not included. Classroom features can be added as a later phase. Review generated study material before relying on it.

## Checks

- `npm run typecheck`
- `npm run build`
