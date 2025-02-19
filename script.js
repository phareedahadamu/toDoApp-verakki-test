// Display tasks
function updateDisplay() {
  const allTasks = fetchData();
  const taskDisplay = document.getElementById("taskDisplay");
  let child = taskDisplay.lastElementChild;
  while (child) {
    taskDisplay.removeChild(child);
    child = taskDisplay.lastElementChild;
  }
  if (!allTasks) {
    const noTasks = document.createElement("p");
    noTasks.innerHTML = "You have no tasks.";
    taskDisplay.appendChild(noTasks);
  }
  for (let x in allTasks) {
    if (!allTasks[x].isChecked) {
      createDisplay(x, allTasks);
    }
  }
}
updateDisplay();
// Clear All tasks
const clearBg = document.getElementById("clearBg");
const confirmClear = document.getElementById("confirmClear");
const cancelClear = document.getElementById("cancelClear");
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  clearBg.classList.remove("hidden");
});
cancelClear.addEventListener("click", () => {
  clearBg.classList.add("hidden");
});
confirmClear.addEventListener("click", () => {
  // !! TODO: Add clear functionalities
  //   console.log("Add functionalities");
  localStorage.clear();
  clearBg.classList.add("hidden");
  const ongoing = document.getElementById("ongoing");
  //   console.log(ongoing.classList[0] === "active");
  if (ongoing.classList[0] === "active") {
    updateDisplay();
  } else updateDisplay2();
});

// Add new task
const addBtn = document.getElementById("addBtn");
const bg = document.getElementById("background");
const addForm = document.getElementById("addForm");
const cancelAdd = document.getElementById("cancelAdd");
const task = document.getElementById("task");
const description = document.getElementById("description");
const dateTime = document.getElementById("dateTime");
addBtn.addEventListener("click", () => {
  bg.classList.remove("hidden");
});
cancelAdd.addEventListener("click", () => {
  task.value = null;
  dateTime.value = null;
  description.value = null;
  bg.classList.add("hidden");
});

addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get form data
  const myTask = task.value;
  const myDateTime = dateTime.value;

  const myDescription = description.value;
  const myObj = {
    task: myTask,
    description: myDescription ? myDescription : "nil",
    dateTime: myDateTime,
    isChecked: false,
  };
  putData(myObj);
  //   //   console.log(fetchData());
  //   console.log(myTask, myDateTime, myDescription);
  // !! TODO: Add clear functionalities
  description.value = null;
  task.value = null;
  dateTime.value = null;
  bg.classList.add("hidden");
  const ongoing = document.getElementById("ongoing");
  //   console.log(ongoing.classList[0] === "active");
  if (ongoing.classList[0] !== "active") {
    const completed = document.getElementById("completed");
    ongoing.classList.add("active");
    completed.classList.remove("active");
  }
  updateDisplay();
});

// Storage Interactions

function fetchData() {
  const data = localStorage.getItem("myTasks");
  return JSON.parse(data);
}

function putData(myObj) {
  const data = localStorage.getItem("myTasks");
  let myData;
  if (!data) {
    myData = JSON.stringify([myObj]);
  } else {
    const newData = JSON.parse(data);
    newData.unshift(myObj);
    myData = JSON.stringify(newData);
  }
  localStorage.setItem("myTasks", myData);
}
function updateData(data, isChecked) {
  //   console.log(data);
  const myData = JSON.stringify(data);
  localStorage.setItem("myTasks", myData);
  if (isChecked) updateDisplay();
  else updateDisplay2();
  //   console.log(isChecked);
}
function updateDisplay2() {
  const allTasks = fetchData();
  const taskDisplay = document.getElementById("taskDisplay");
  let child = taskDisplay.lastElementChild;
  while (child) {
    taskDisplay.removeChild(child);
    child = taskDisplay.lastElementChild;
  }
  if (!allTasks) {
    const noTasks = document.createElement("p");
    noTasks.innerHTML = "You have no tasks.";
    taskDisplay.appendChild(noTasks);
  }
  for (let x in allTasks) {
    if (allTasks[x].isChecked) {
      createDisplay(x, allTasks);
    }
  }
}
const ongoing = document.getElementById("ongoing");
const completed = document.getElementById("completed");
ongoing.addEventListener("click", () => {
  updateDisplay();
  completed.classList.remove("active");
  ongoing.classList.add("active");
});
completed.addEventListener("click", () => {
  updateDisplay2();
  completed.classList.add("active");
  ongoing.classList.remove("active");
});

const delBg = document.getElementById("delBg");
// const editBg = document.getElementById("editBg");
const cancelDel = document.getElementById("cancelDel");
cancelDel.addEventListener("click", () => {
  delBg.classList.add("hidden");
  const deleteActions = document.getElementById("deleteActions");
  let lastChild = deleteActions.lastElementChild;
  let count = deleteActions.childElementCount;
  while (count > 1) {
    deleteActions.removeChild(lastChild);
    lastChild = deleteActions.lastElementChild;
    count = deleteActions.childElementCount;
  }
});
function createDisplay(x, allTasks) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
  const sub = document.createElement("div");
  const par = document.createElement("p");
  const inp = document.createElement("input");
  inp.setAttribute("type", "checkbox");
  inp.setAttribute("name", allTasks[x].id);
  inp.checked = allTasks[x].isChecked;
  inp.addEventListener("change", (e) => {
    // console.log("checked");
    const newTasks = allTasks.slice();
    if (e.currentTarget.checked) {
      newTasks[x] = {
        ...newTasks[x],
        isChecked: true,
      };
    } else {
      newTasks[x] = {
        ...newTasks[x],
        isChecked: false,
      };
    }
    updateData(newTasks, e.currentTarget.checked);
  });
  par.innerHTML =
    allTasks[x].task.slice(0, 1).toUpperCase() + allTasks[x].task.slice(1);
  sub.appendChild(inp);
  sub.appendChild(par);
  const sub2 = document.createElement("div");
  const del = document.createElement("img");
  const edit = document.createElement("img");
  del.setAttribute("src", "./assets/delete.svg");
  del.setAttribute("alt", x);
  del.id = "delIcon";
  del.addEventListener("click", (e) => {
    deleted(e);
  });
  edit.setAttribute("src", "./assets/edit.svg");
  edit.setAttribute("alt", x);
  edit.id = "editIcon";
  edit.addEventListener("click", (e) => {
    edited(e);
  });

  //   edit.addEventListener("click", () => {
  //     editBg.classList.remove("hidden");
  //   });
  sub2.appendChild(edit);
  sub2.appendChild(del);
  wrapper.appendChild(sub);
  if (allTasks[x].description !== "nil") {
    const desc = document.createElement("p");
    desc.innerHTML = allTasks[x].description;
    wrapper.appendChild(desc);
  }
  const date = document.createElement("p");
  date.innerHTML =
    new Date(allTasks[x].dateTime).toDateString() +
    "  |  " +
    new Date(allTasks[x].dateTime).toLocaleTimeString();
  wrapper.appendChild(date);
  wrapper.appendChild(sub2);
  taskDisplay.appendChild(wrapper);
}

function deleted(e) {
  delBg.classList.remove("hidden");
  const confirmDel = document.createElement("button");
  confirmDel.name = e.currentTarget.alt;
  confirmDel.id = "confirmDel";
  confirmDel.innerHTML = "Delete";
  const deleteActions = document.getElementById("deleteActions");
  deleteActions.appendChild(confirmDel);
  confirmDel.addEventListener("click", (e) => {
    const allTasks = fetchData();

    const newData = allTasks.slice();
    const checked = !allTasks[e.currentTarget.name].isChecked ? true : false;
    newData.splice(e.currentTarget.name, 1);
    // console.log(newData);
    // console.log(allTasks);
    // console.log(e.currentTarget.name);
    updateData(newData, checked);
    deleteActions.removeChild(confirmDel);
    delBg.classList.add("hidden");
  });
}

const editBg = document.getElementById("editBg");
const cancelEdit = document.getElementById("cancelEdit");
cancelEdit.addEventListener("click", () => {
  editBg.classList.add("hidden");
  const editActions = document.getElementById("editActions");
  let lastChild = editActions.lastElementChild;

  let count = editActions.childElementCount;
  while (count > 1) {
    editActions.removeChild(lastChild);
    lastChild = editActions.lastElementChild;
    count = editActions.childElementCount;
  }
});
function edited(e) {
  const idx = e.currentTarget.alt;
  editBg.classList.remove("hidden");
  const allTasks = fetchData();
  const editTask = document.getElementById("editTask");
  editTask.value = allTasks[idx].task;
  const editDescription = document.getElementById("editDescription");
  editDescription.value =
    allTasks[idx].description === "nil" ? null : allTasks[idx].description;
  const editDateTime = document.getElementById("editDateTime");
  editDateTime.value = allTasks[idx].dateTime;

  const confirmEdit = document.createElement("button");
  confirmEdit.name = idx;
  confirmEdit.id = "confirmEdit";
  confirmEdit.innerHTML = "Update";
  const editActions = document.getElementById("editActions");
  editActions.appendChild(confirmEdit);
  confirmEdit.addEventListener("click", (e) => {
    const myTasks = fetchData();
    const checked = !myTasks[e.currentTarget.name].isChecked ? true : false;
    const newObj = {
      ...myTasks[e.currentTarget.name],
      task: editTask.value,
      description: editDescription.value,
      dateTime: editDateTime.value,
    };
    // console.log(newObj);
    myTasks[e.currentTarget.name] = newObj;
    updateData(myTasks, checked);
    editActions.removeChild(confirmEdit);
    editBg.classList.add("hidden");
  });
}
