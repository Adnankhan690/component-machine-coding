import { useEffect, useRef } from "react";
import { Todo } from "./useTodo";

interface TodoListProps {
    todos: Todo[];
    editId: { id: string, value: string };
    setEditTodo: React.Dispatch<React.SetStateAction<{ id: string, value: string }>>
    removeTodo: (id: string) => void;
    handleSave: () => void;

}

export default function TodoList({ todos,
    editId,
    setEditTodo,
    removeTodo,
    handleSave
}: TodoListProps) {
    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editId.id) {
            editInputRef.current?.focus()
        }

    }, [editId.id])

    return (
        <div>
            {todos.map((todo: Todo) => {
                return (
                    <div className="todo-list-wrapper">
                        {todo.id === editId.id &&
                            <input
                                // use autoFocus if this is rendered conditionally
                                // autoFocus
                                ref={editInputRef}
                                value={editId.value}
                                onChange={(e) => setEditTodo((prev) => {
                                    return {
                                        ...prev,
                                        value: e.target.value,
                                    }
                                })}
                            />
                        }
                        {todo.id !== editId.id && <p>{todo.name}</p>}
                        <div className="todo-action-btns">
                            {todo.id !== editId.id && (
                                <button onClick={() => {
                                    setEditTodo({
                                        id: todo.id,
                                        value: todo.name
                                    })
                                }}>edit</button>
                            )}
                            {todo.id === editId.id && (
                                <button onClick={handleSave}>Save</button>
                            )}
                            <button onClick={() => removeTodo(todo.id)}>delete</button>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}