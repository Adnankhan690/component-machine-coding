import { useState } from "react";

export interface Todo {
    id: string;
    name: string;
    status: 'idle' | 'success'
}

export default function useTodo() {
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [inputTodo, setInputTodo] = useState("");
    const [editTodo, setEditTodo] = useState<{ id: string, value: string }>({
        id: "",
        value: ""
    });

    const handleAddTodo = () => {
        if (!inputTodo.trim()) return;

        setTodoList((prev) => {
            return [...prev, {
                id: new Date().getTime().toString(),
                name: inputTodo,
                status: 'idle',
            }]
        })

        setInputTodo("");
    }

    const handleInputTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputTodo(text);
    }

    const handleRemoveTodo = (id: string) => {
        setTodoList((prev) => {
            return prev.filter((todo) => todo.id !== id);
        })
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddTodo();
        }
    }

    const handleSave = () => {
        setTodoList((prev) => {
            return prev.map((todo) => {
                if (todo.id === editTodo.id) {
                    return {
                        ...todo,
                        name: editTodo.value
                    }
                }
                return todo;
            })
        })
        setEditTodo({
            id: "",
            value: ""
        })
    }



    return {
        todos: todoList,
        setTodos: setTodoList,
        inputTodo,
        setInputTodo,
        addTodo: handleAddTodo,
        enterTodoText: handleInputTodo,
        removeTodo: handleRemoveTodo,
        onEnter: handleEnter,
        editId: editTodo,
        setEditTodo,
        handleSave

    }
}