 
# TaskSync-A Task Management Application

TaskSync is a modern task management web application designed to streamline collaboration and productivity. Built with **React**, **Tailwind CSS**, **Express.js**, **MongoDB** TaskSync enables users to create, manage, and sync tasks in real time.

## 🌍 Live Demo

Check out the live version: [TaskSync Live](https://tasksync-5e233.web.app) 

## 🚀 Features

- 📝 **Task Management** – Create, edit, and delete tasks seamlessly.
- 🔄 **Drag & Drop** – Reorder tasks using an intuitive drag-and-drop interface.
- 📢 **Real-time Updates** – Keep tasks in sync across devices.
- 🎨 **Modern UI/UX** – Beautifully designed with Tailwind CSS and Framer Motion animations.
- 🔔 **Notifications** – Get real-time updates with SweetAlert2.
- 🔒 **Authentication** – Secure user authentication powered by Firebase.
- 📊 **Offline Support** – Leverage LocalForage for better offline experience.

## 🛠️ Technologies Used

- **Frontend:** React, React Router, Tailwind CSS
- **State Management:** React Query
- **Backend & Authentication:** Firebase, Express.js, MongoDB
- **UI Enhancements:** react-icon, hello-pangea-dnd, SweetAlert2
- **Development Tools:** Vite, ESLint, PostCSS


## 📂 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Development](#development)
- [License](#license)
- [Contributors](#contributors)

---

## 🛠 Installation

Ensure you have **Node.js** and **npm** installed. Then, follow these steps:

```sh
# Clone the repository
git clone https://github.com/TaiebaTasnim/TaskSync.git

# Navigate to the project directory
cd TaskSync

# Install dependencies
npm install
```

## 🚀 Usage

Start the development server:

```sh
npm run dev
```

For production build:

```sh
npm run build
```

Run the preview server:

```sh
npm run preview
```

## ⚙️ Configuration

Create a `.env` file in the root directory and configure the following environment variables:

```plaintext
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📦 Dependencies

**Main Dependencies:**
- [`react`](https://react.dev/) – Core React library.
- [`react-router-dom`](https://reactrouter.com/) – Routing.
- [`axios`](https://axios-http.com/) – HTTP client.
- [`firebase`](https://firebase.google.com/) – Backend services.
- [`socket.io-client`](https://socket.io/) – Real-time communication.
- [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd) – Drag & drop support.
- [`framer-motion`](https://www.framer.com/motion/) – Animations.
- [`sweetalert2`](https://sweetalert2.github.io/) – Beautiful alerts.
- [`tailwindcss`](https://tailwindcss.com/) – Utility-first CSS framework.

**Development Dependencies:**
- [`vite`](https://vitejs.dev/) – Fast development environment.
- [`eslint`](https://eslint.org/) – Linter for cleaner code.
- [`@vitejs/plugin-react`](https://vitejs.dev/) – Vite plugin for React.

## 🔧 Development

### Linting
Run ESLint to check for issues:

```sh
npm run lint
```

### Formatting
Ensure consistent code style with:

```sh
npm run format
```



---

