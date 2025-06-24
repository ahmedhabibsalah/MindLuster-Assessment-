export const API_BASE_URL = "http://localhost:4000";

export const COLUMNS = {
  BACKLOG: "backlog",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  DONE: "done",
};

export const COLUMN_TITLES = {
  [COLUMNS.BACKLOG]: "Backlog",
  [COLUMNS.IN_PROGRESS]: "In Progress",
  [COLUMNS.REVIEW]: "Review",
  [COLUMNS.DONE]: "Done",
};

export const COLUMN_ORDER = [
  COLUMNS.BACKLOG,
  COLUMNS.IN_PROGRESS,
  COLUMNS.REVIEW,
  COLUMNS.DONE,
];

export const PAGE_SIZE = 10;

export const QUERY_KEYS = {
  TASKS: "tasks",
  TASKS_BY_COLUMN: "tasksByColumn",
};

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} column
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} TaskFormData
 * @property {string} title
 * @property {string} description
 * @property {string} column
 */

/**
 * @typedef {Object} TaskUpdateData
 * @property {number} id
 * @property {Partial<TaskFormData>} data
 */
