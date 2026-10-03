# TEDxRSET Website

A modern, responsive website for **TEDxRSET**, the independently organized TEDx event of Rajagiri School of Engineering & Technology (RSET), Kochi.

**Live site:** [ADD YOUR LIVE LINK HERE]

> This independent TEDx event is operated under license from TED.

---

## About

TEDxRSET brings speakers, students and the wider community together around ideas worth spreading. This website presents the event: what it is, who is speaking, and how to take part.

## Features

- Responsive layout that works on phones, tablets and desktops
- Event hero section with the TEDxRSET branding
- Speakers section
- About TEDx and about the event
- Team section
- Registration / contact call-to-action
- Link to the official TEDx program

## Tech Stack

| Area | Technology |
|---|---|
| Language | TypeScript |
| UI library | React |
| Routing / framework | TanStack Router / TanStack Start |
| Styling | Tailwind CSS |
| Build tool | Vite |
| Package manager | Bun / npm |

## Project Structure

```
src/
├── assets/        Images and static media
├── components/    Reusable UI components
├── hooks/         Custom React hooks
├── lib/           Helper functions
├── routes/        Pages (each file is a route)
└── styles.css     Global styles
public/            Favicon and public files
```

## Getting Started

**Requirements:** Node.js 18 or later (or Bun)

```bash
# 1. Clone the repository
git clone https://github.com/gourimulloth/event-showcase-pro.git
cd event-showcase-pro

# 2. Install dependencies
npm install        # or: bun install

# 3. Start the development server
npm run dev        # or: bun run dev
```

Open the local address printed in the terminal (usually `http://localhost:8080` or `http://localhost:5173`).

### Build for production

```bash
npm run build
```

## How It Was Built

This site was built with **Lovable** (an AI app builder) as the starting point, then customized by me for TEDxRSET.

**My customizations:**
- Rebranded the whole site for TEDxRSET (name, logo, colors, text)
- [Add what you changed, e.g. content for speakers and team]
- [Add a section or feature you added yourself]
- Removed the default template branding and metadata
- Connected the project to GitHub and set up deployment

## Deployment

The project can be deployed for free on Vercel or Netlify by importing this GitHub repository.

## Author

**Gouri**, B.Tech Computer Science and Engineering, RSET Kochi

## Acknowledgements

- [TED](https://www.ted.com/tedx) for the TEDx program
- [Lovable](https://lovable.dev) for the initial project scaffold
