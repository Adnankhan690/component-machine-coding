import "./practice-todo.css"
import TodoList from "./todo-list";
import useTodo from "./useTodo";

export default function PracticeTodo() {
    const {
        todos,
        inputTodo,
        addTodo,
        enterTodoText,
        removeTodo,
        onEnter,
        editId,
        setEditTodo,
        handleSave
    } = useTodo();

    return (
        <div>
            <div className="todo-control-wrapper">
                <input autoFocus value={inputTodo} onChange={enterTodoText} placeholder="Enter you todo task"
                    onKeyDown={onEnter} />
                <button onClick={addTodo}>Add todo</button>
            </div>
            <div>
                <TodoList todos={todos} editId={editId} setEditTodo={setEditTodo} removeTodo={removeTodo} handleSave={handleSave} />
            </div>
        </div>
    )
}