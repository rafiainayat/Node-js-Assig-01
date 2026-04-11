const {
  ensureTasksFile,
  readTasks,
  writeTasks,
  createTask,
} = require("./utils/fileHandler");

const command = process.argv[2];
const args = process.argv.slice(3);

function showHelp() {
  console.log(`
Task Manager Commands
  node app.js add "Task title"
  node app.js list
  node app.js edit <id> "Updated title"
  node app.js delete <id>
  `);
}

function parseTaskId(value) {
  const id = Number.parseInt(value, 10);

  if (Number.isNaN(id) || id <= 0) {
    console.error("Please enter a valid task ID.");
    return null;
  }

  return id;
}

function addTask(titleParts) {
  const title = titleParts.join(" ").trim();

  if (!title) {
    console.error("Task title is required.");
    return;
  }

  readTasks((readError, tasks) => {
    if (readError) {
      console.error("Error reading tasks:", readError.message);
      return;
    }

    const newTask = createTask(tasks, title);
    tasks.push(newTask);

    writeTasks(tasks, (writeError) => {
      if (writeError) {
        console.error("Error saving task:", writeError.message);
        return;
      }

      console.log(`Task added: ${newTask.id}. ${newTask.title}`);
    });
  });
}

function listTasks() {
  readTasks((error, tasks) => {
    if (error) {
      console.error("Error reading tasks:", error.message);
      return;
    }

    if (tasks.length === 0) {
      console.log("No tasks found.");
      return;
    }

    tasks.forEach((task) => {
      console.log(`${task.id}. ${task.title}`);
    });
  });
}

function editTask(idValue, titleParts) {
  const id = parseTaskId(idValue);
  const updatedTitle = titleParts.join(" ").trim();

  if (id === null) {
    return;
  }

  if (!updatedTitle) {
    console.error("Updated task title is required.");
    return;
  }

  readTasks((readError, tasks) => {
    if (readError) {
      console.error("Error reading tasks:", readError.message);
      return;
    }

    const task = tasks.find((item) => item.id === id);

    if (!task) {
      console.error(`Task with ID ${id} not found.`);
      return;
    }

    task.title = updatedTitle;

    writeTasks(tasks, (writeError) => {
      if (writeError) {
        console.error("Error updating task:", writeError.message);
        return;
      }

      console.log(`Task updated: ${task.id}. ${task.title}`);
    });
  });
}

function deleteTask(idValue) {
  const id = parseTaskId(idValue);

  if (id === null) {
    return;
  }

  readTasks((readError, tasks) => {
    if (readError) {
      console.error("Error reading tasks:", readError.message);
      return;
    }

    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (filteredTasks.length === tasks.length) {
      console.error(`Task with ID ${id} not found.`);
      return;
    }

    writeTasks(filteredTasks, (writeError) => {
      if (writeError) {
        console.error("Error deleting task:", writeError.message);
        return;
      }

      console.log(`Task deleted: ${id}`);
    });
  });
}

function runCommand() {
  switch (command) {
    case "add":
      addTask(args);
      break;
    case "list":
      listTasks();
      break;
    case "edit":
      editTask(args[0], args.slice(1));
      break;
    case "delete":
      deleteTask(args[0]);
      break;
    default:
      showHelp();
  }
}

ensureTasksFile((error) => {
  if (error) {
    console.error("Error preparing task storage:", error.message);
    return;
  }

  runCommand();
});
