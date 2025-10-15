# 🧠 Tasker

**[Live Demo →](https://tasker-jade-seven.vercel.app)**

**[Source Code →](https://github.com/shravzzv/tasker)**

Tasker is a **minimalist productivity app** built to help you organize your life effortlessly. It’s designed to be simple yet powerful — allowing you to **create, manage, and track todos** with ease. Whether you’re planning your next startup idea, managing personal goals, or tracking daily habits, Tasker helps you stay on top of everything — beautifully.

## ✨ Features

- ✅ **Authentication** – Secure sign-in with Google and GitHub
- 📝 **Create & Manage Todos** – Add, edit, and delete todos instantly
- 🖼️ **Custom Cover Images** – Upload and attach beautiful images to your todos
- 📦 **Supabase Storage Integration** – Store todo images seamlessly
- 📄 **Dynamic Todo Pages** – View each todo in detail
- 🧱 **Responsive UI** – Built with TailwindCSS and ShadCN for a clean, adaptive layout
- 🔒 **CAPTCHA Protection** – Prevent spam submissions securely
- 🚀 **Optimized Performance** – Built on top of Next.js App Router for speed and scalability

## 🛠️ Tech Stack

Tasker is built using modern, battle-tested technologies:

| Layer          | Technologies                       |
| -------------- | ---------------------------------- |
| **Frontend**   | Next.js 15, React 19, TypeScript   |
| **Backend**    | Supabase (Auth, Database, Storage) |
| **Styling**    | Tailwind CSS, ShadCN/UI            |
| **Deployment** | Vercel                             |

[![My Skills](https://skillicons.dev/icons?i=nextjs,typescript,supabase,vercel,tailwind,vscode)](https://skillicons.dev)

## ⚡ Quick Start

Clone and run Tasker locally in just a few steps:

```bash
# Clone the repository
git clone https://github.com/shravzzv/tasker.git

# Navigate into the project directory
cd tasker

# Install dependencies
npm install

# Run the app
npm run dev
```

Once running, open your browser and visit **[http://localhost:3000](http://localhost:3000)**

## 🧩 Folder Structure

```md
tasker/
├── app/
│ ├── dashboard/
│ ├── auth/
│ ├── api/
│ └── layout.tsx
├── components/
│ ├── ui/
│ ├── create-todo-form.tsx
│ ├── update-todo-form.tsx
│ ├── todo.tsx
│ └── google-auth-button.tsx
├── utils/
│ ├── supabase/
│ ├── delete-upload.ts
│ └── actions.ts
├── types/
│ └── todo.ts
└── public/
└── default todo cover image.jpg
```

## 🧠 Usage Guide

1. **Sign in** using your Google or GitHub account.
2. **Create a new todo** — add a title, description, and an optional cover image.
3. **View and edit** your todos anytime from your dashboard.
4. **Delete todos** when done (Tasker automatically deletes associated images).
5. **Stay organized** with a clean, responsive interface that adapts to your workflow.

## 🧑‍💻 How to Contribute

We welcome contributions! Whether it’s fixing a bug, improving UI, or adding new features — your help is appreciated 💪

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone [your-forked-repo-link]
   cd tasker
   ```

3. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Make your changes and commit:

   ```bash
   git add .
   git commit -m "Added new feature"
   ```

5. Push and open a Pull Request:

   ```bash
   git push origin feature/your-feature-name
   ```

6. That’s it! We’ll review your PR and merge it if it fits Tasker’s goals.

## 🐛 Issue Tracker

Found a bug? Want a feature? Open an issue here:
👉 [GitHub Issues](https://github.com/shravzzv/tasker/issues)

## 💬 Community & Links

Join the **Tasker Community** to share ideas, ask questions, or show your setups!

- 💬 **Discord Server:** [Join Here](https://discord.gg/mp8VHd5fyh)
- 🧵 **Reddit Community:** [r/tasker_app](https://www.reddit.com/r/tasker_app/)
- 🌐 **Website:** [Tasker on Vercel](https://tasker-jade-seven.vercel.app)
- 💻 **Source Code:** [GitHub Repo](https://github.com/shravzzv/tasker)

## 📜 License

Tasker is open-source and licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

## 💡 Vision

> “Productivity shouldn’t be complicated. Tasker helps you focus on what truly matters — your goals.”

The long-term goal of Tasker is to evolve into a **personal productivity hub** — integrating notes, habits, and scheduling into one minimalist interface.
