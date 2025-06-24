# Kanban ToDo App

A modern, feature-rich Kanban-style task management application built with React, Material-UI, and advanced state management.

![Kanban Board Demo]
![screencapture-localhost-5173-2025-06-24-16_41_20](https://github.com/user-attachments/assets/f61e84b0-54ad-4f8c-b535-a1026d7c4890)


##  Features

###  User Interface

- **Modern Design**: Clean, intuitive interface with Material Design principles
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme adaptation with smooth transitions
- **Animations**: Smooth micro-interactions and visual feedback throughout the app

### 📋 Task Management

- **CRUD Operations**: Create, read, update, and delete tasks with full validation
- **Drag & Drop**: Intuitive task movement between columns with visual feedback
- **Real-time Search**: Instant filtering by title and description
- **Column Filtering**: Filter tasks by specific workflow stages
- **Pagination**: Both button-based and infinite scroll pagination options

###  Workflow Stages

- **Backlog**: Tasks waiting to be started
- **In Progress**: Currently active tasks
- **Review**: Tasks pending review or approval
- **Done**: Completed tasks

### 🚀 Performance & UX

- **Optimistic Updates**: Instant UI feedback for better user experience
- **Error Handling**: Comprehensive error boundaries and retry mechanisms
- **Loading States**: Skeleton screens and progress indicators
- **Accessibility**: Full keyboard navigation and screen reader support
- **Offline Support**: Basic offline functionality with data persistence

## 🛠 Technology Stack

### Frontend

- **React 18** - Modern React with hooks and concurrent features
- **Material-UI (MUI)** - Google's Material Design components
- **Zustand** - Lightweight state management
- **React Query** - Server state management with caching
- **@dnd-kit** - Modern drag and drop for React

### Build & Development

- **Vite** - Lightning-fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Axios** - HTTP client for API requests

### Backend (Mock)

- **JSON Server** - REST API mock server for development

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/kanban-todo-app.git
cd kanban-todo-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Install JSON Server globally**

```bash
npm install -g json-server
```

4. **Start the application**

```bash
# Start both API and frontend
npm run dev:all

# Or start separately
npm run api     # Starts mock API on port 4000
npm run dev     # Starts React app on port 5173
```

5. **Open in browser**

- Frontend: http://localhost:5173
- API: http://localhost:4000

## 📱 Usage Guide

### Creating Tasks

1. Click the **"Add Task"** button in the header
2. Fill in the task title and description
3. Select the initial column/status
4. Click **"Create"** to save

### Managing Tasks

- **Edit**: Click the three-dot menu on any task card
- **Delete**: Use the delete option in the task menu
- **Move**: Drag and drop tasks between columns
- **Search**: Use the search bar to find specific tasks
- **Filter**: Use the column filter to view specific categories

### Mobile Experience

- **Tab Navigation**: Swipe between columns using the tab interface
- **Touch Gestures**: Optimized touch interactions for mobile devices
- **Responsive Design**: Automatically adapts to screen size

### Keyboard Shortcuts

- `Enter` or `Space` - Open task for editing
- `Delete` - Delete selected task
- `Esc` - Close dialogs/forms
- `Tab` - Navigate between interactive elements

##  Customization

### Themes

The app uses Material-UI's theming system. Customize colors and typography in `src/styles/theme.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Your brand color
    },
    // ... other palette options
  },
});
```

### Column Configuration

Add or modify workflow columns in `src/utils/constants.js`:

```javascript
export const COLUMNS = {
  BACKLOG: "backlog",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  DONE: "done",
  // Add custom columns
};
```

## Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── Board/          # Main Kanban board
│   ├── Column/         # Column components
│   ├── Task/           # Task-related components
│   ├── SearchBar/      # Search and filtering
│   ├── TaskForm/       # Task creation/editing
│   ├── Layout/         # App layout components
│   ├── Loading/        # Loading states
│   ├── Error/          # Error handling
│   └── Notification/   # Toast notifications
├── hooks/              # Custom React hooks
│   ├── useTasks.js     # Task data management
│   ├── useInfiniteScroll.js  # Infinite scroll logic
│   └── useNotification.js    # Notification utilities
├── services/           # API services
│   ├── api.js          # Axios configuration
│   ├── taskService.js  # Task API methods
│   └── queryClient.jsx # React Query setup
├── store/              # State management
│   ├── taskStore.js    # Task-related state
│   └── notificationStore.js  # Notification state
├── utils/              # Utilities and constants
│   ├── constants.js    # App constants
│   └── helpers.js      # Helper functions
├── styles/             # Styling
│   └── theme.js        # Material-UI theme
```

### State Management

- **Zustand**: Client-side state (UI state, filters, pagination)
- **React Query**: Server state (API data, caching, synchronization)
- **Local State**: Component-specific state using React hooks

### Data Flow

1. **UI Actions** → Zustand stores or React Query mutations
2. **API Calls** → React Query manages caching and synchronization
3. **State Updates** → UI automatically re-renders
4. **Optimistic Updates** → Immediate UI feedback with rollback on error

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run api` - Start JSON Server
- `npm run dev:all` - Start both API and frontend

### API Endpoints

The mock API provides RESTful endpoints:

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/tasks`                   | Get all tasks       |
| GET    | `/tasks?column=backlog`    | Get tasks by column |
| GET    | `/tasks?q=search`          | Search tasks        |
| GET    | `/tasks?_page=1&_limit=10` | Paginated tasks     |
| POST   | `/tasks`                   | Create new task     |
| PUT    | `/tasks/:id`               | Update task         |
| DELETE | `/tasks/:id`               | Delete task         |

### Testing

```bash
# Test API endpoints
node test-api.js

# Manual testing checklist
- [ ] Create, edit, delete tasks
- [ ] Drag and drop between columns
- [ ] Search and filtering
- [ ] Responsive design
- [ ] Keyboard navigation
- [ ] Error scenarios
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create `.env.production` for production settings:

```env
VITE_API_URL=https://your-api-endpoint.com
VITE_APP_NAME=Your Kanban App
```

### Deployment Options

#### Vercel (Recommended)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

## Performance Optimization

### Implemented Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Virtual Scrolling**: Efficient handling of large lists
- **Memoization**: React.memo and useMemo for expensive operations
- **Debounced Search**: Reduced API calls during typing
- **Optimistic Updates**: Immediate UI feedback
- **Image Optimization**: Compressed assets and lazy loading

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## Accessibility

### Features

- **Keyboard Navigation**: Full app usability without mouse
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Focus Management**: Proper focus indicators and trapping
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences

### WCAG 2.1 Compliance

- **Level AA** compliance for color contrast
- **Level AAA** compliance for focus indicators
- Semantic HTML structure throughout
- Alternative text for all images and icons
