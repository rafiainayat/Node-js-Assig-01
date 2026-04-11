const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "tasks.json");

function ensureTasksFile(callback) {
  fs.access(filePath, fs.constants.F_OK, (accessError) => {
    if (!accessError) {
      callback(null);
      return;
    }

    fs.writeFile(filePath, "[]", "utf8", (writeError) => {
      if (writeError) {
        callback(writeError);
        return;
      }

      callback(null);
    });
  });
}

function readTasks(callback) {
  fs.readFile(filePath, "utf8", (readError, data) => {
    if (readError) {
      callback(readError);
      return;
    }

    try {
      const tasks = data.trim() ? JSON.parse(data) : [];
      callback(null, tasks);
    } catch (parseError) {
      callback(parseError);
    }
  });
}

function writeTasks(tasks, callback) {
  fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf8", (writeError) => {
    if (writeError) {
      callback(writeError);
      return;
    }

    callback(null);
  });
}

function createTask(tasks, title) {
  const nextId =
    tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

  return {
    id: nextId,
    title,
  };
}

module.exports = {
  ensureTasksFile,
  readTasks,
  writeTasks,
  createTask,
};
