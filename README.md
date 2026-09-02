# Pathwise — roadmap & dependency visualizer

A concept tool for planning work as a dependency graph, then managing that same work as a kanban board, both views share one source of truth, so moving a task in the board updates it in the graph and vice versa.

**[Live demo →](https://pathwise-roadmap-visualizer-ku5dj5ks4-sami-hamilton.vercel.app/)**

## Features

- **Graph view**: drag tasks around a pannable, zoomable canvas. Curved, arrowed connector lines show what's blocked by what, automatically updating as you reposition nodes.
- **Board view**: a kanban board of the same tasks, drag cards between columns to change status. Add custom workflow columns with your own name and color.
- **Task details**: click any task (in either view) to open a panel where you can edit its title and description, change its status, and manage its dependencies, both what's blocking it and what it's blocking.
- **Sample data**: launches with a pre-built product-launch roadmap so it's immediately demo-able. Fully editable, and resettable back to the sample at any time.

## Design

A dark, "Midnight Ops" visual style, near-black canvas, violet accent, and status colors (amber, coral, green, slate) borrowed from common dev-tool conventions (Linear, Height). Built to make dependency graphs specifically easy to scan against a dark background.

## Stack

React + Vite, Tailwind CSS v4. No backend, board state persists to `localStorage` so it survives a refresh. Built through hands-on collaboration with AI tools, directing the architecture, interaction design, and debugging myself.

## Run it locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx              app shell, view switching, modals
  context/              board state: tasks, columns, dependencies, persistence
  views/                GraphView (canvas/nodes/edges) and BoardView (kanban)
  components/           top bar, task drawer, new task/column modals, color picker
  data/                 sample seed data and color options
```
