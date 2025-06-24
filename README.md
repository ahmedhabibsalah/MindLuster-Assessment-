# Kanban ToDo App

A modern Kanban-style task management application built with React, Zustand, and React Query.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd kanban-todo-app
npm install
```

2. **Install json-server globally (if not already installed):**

```bash
npm install -g json-server
```

### Running the Application

#### Option 1: Run both API and frontend together

```bash
npm run dev:all
```

#### Option 2: Run separately

```bash
# Terminal 1: Start the mock API
npm run api

# Terminal 2: Start the React app
npm run dev
```

### Available Scripts

- `npm run dev` - Start React development server
- `npm run api` - Start json-server mock API
- `npm run dev:all` - Start both API and frontend concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing the API

After starting the API server, you can test the endpoints:

### Manual Testing

- **View all tasks:** http://localhost:4000/tasks
- **Filter by column:** http://localhost:4000/tasks?column=backlog
- **Search tasks:** http://localhost:4000/tasks?q=design
- **Pagination:** http://localhost:4000/tasks?\_page=1&\_limit=5

### Automated Testing

Run the API test script:

```bash
node test-api.js
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Board/          # Main Kanban board
│   ├── Column/         # Individual columns
│   ├── Task/           # Task components
│   ├── SearchBar/      # Search functionality
│   ├── TaskForm/       # Task creation/editing
│   └── Layout/         # App layout
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Zustand store
├── utils/              # Utilities and constants
├── types/              # Type definitions
└── styles/             # Global styles and theme
```

## 🛠 Technology Stack

- **Frontend:** React 18 + Vite
- **State Management:** Zustand
- **Data Fetching:** React Query
- **UI Library:** Material-UI
- **Drag & Drop:** @dnd-kit
- **Mock API:** json-server
- **Styling:** CSS Modules + Material-UI

## 📊 API Endpoints

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/tasks`                   | Get all tasks       |
| GET    | `/tasks?column=backlog`    | Get tasks by column |
| GET    | `/tasks?q=search`          | Search tasks        |
| GET    | `/tasks?_page=1&_limit=10` | Paginated tasks     |
| POST   | `/tasks`                   | Create new task     |
| PUT    | `/tasks/:id`               | Update task         |
| DELETE | `/tasks/:id`               | Delete task         |

## 🔧 Development Status

### ✅ Completed (Phase 1-2)

- [x] Project setup with Vite
- [x] Dependencies installation
- [x] Folder structure creation
- [x] Mock API with json-server
- [x] ESLint configuration
- [x] API endpoint testing

### 🚧 Next Steps (Phase 3)

- [ ] Zustand store setup
- [ ] React Query configuration
- [ ] Basic component structure
- [ ] Material-UI theme setup

## 🤝 Contributing

1. Follow the commit structure outlined in the development plan
2. Run `npm run lint` before committing
3. Test API endpoints after making changes
4. Update documentation as needed

## 📝 Notes

- The mock API runs on port 4000
- React dev server runs on port 5173 (Vite default)
- All task data is stored in `db.json`
- Use the test script to verify API functionality
