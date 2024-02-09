// selecionando elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// funções
function saveTodo(text, done = 0, save = 1) {
    // criando elemento div
    const todo = document.createElement("div");
    // add uma class a div
    todo.classList.add("todo");

    // cirando elemento h3
    const todoTitle = document.createElement("h3");
    // recebendo input do usuario
    todoTitle.innerText = text;
    // add h3 a div
    todo.appendChild(todoTitle);

    // criando elementos buttons
    const doneBtn = document.createElement("button");
    // add class ao elemento button
    doneBtn.classList.add("finish-todo");
    // add icone ao button
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    // add elemento button a div
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeBtn);

    // utilizando dados da localStorage
    if(done) {
        todo.classList.add(done);
    }

    if(save) {
        saveTodoLocalStorage({text, done: 0});
    }

    // add a div filho a div pai
    todoList.appendChild(todo);

    todoInput.value = ""; // deixar input vazio novamente
    todoInput.focus(); // focar input
}

function toggleForms() {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

function udpdateTodo(text) {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            updateTodoLocalStorage(oldInputValue, text);
        }
    })
}

function getSearchInput(search) {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLocaleLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.includes(search)) {
            todo.style.display = "none";
        }
    })
}

function filterTodo(filterValue) {
    const todos = document.querySelectorAll(".todo");

    switch(filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
            break;
        case "done":
            todos.forEach((todo) => 
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;
        case "todo":
            todos.forEach((todo) => 
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;
        default:
            break;
    }
}

// eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue) {
        // save todo
        saveTodo(inputValue);
    }
})

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if(targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateTodoStatusLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        removeTodoLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue) {
        udpdateTodo(editInputValue);
    }

    toggleForms();
})

searchInput.addEventListener("keyup", (e)=> {
    const search = e.target.value;

    getSearchInput(search);
})

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodo(filterValue);
})

// local storage
const getTodoLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
}

const loadTodos = () => {
    const todos = getTodoLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    })
}

const saveTodoLocalStorage = (todo) => {
    
    // todos os todos do ls
    const todos = getTodoLocalStorage();
    // add novo todo no arr
    todos.push(todo);
    // salvar tudo no ls
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeTodoLocalStorage = () => {
    const todos = getTodoLocalStorage();

    const filterTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filterTodos));
}

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodoLocalStorage();

    todos.map((todo) => 
        todo.text === todoText ? (todo.done = !todo.done) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos));
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodoLocalStorage();

    todos.map((todo) => 
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();