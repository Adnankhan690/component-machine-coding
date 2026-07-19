import { useState, useRef, useEffect } from "react";
import "./todo.css";

interface TodoList {
  id: string,
  value: string,
  type: string,
  status: 'idle' | 'in-progress' | 'completed'
}

function Todo() {
  const [todo, setTodo] = useState("")
  const [todoList, setTodoList] = useState<TodoList[]>([])
  const [editId, setEditId] = useState('');
  const [editValue, setEditValue] = useState('');
  const todoItemRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);

  }

  const handleAddTodo = (todo: string) => {
    setTodoList((prev) => {
      return [...prev, {
        id: new Date().getTime().toString(),
        value: todo,
        type: "",
        status: "idle",
      }]
    })
    setTodo("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo(todo);
    }
  }

  const handleCompleteTodo = (id: string) => {
    setTodoList((prev) => {
      return prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: t.status === 'completed' ? 'idle' : 'completed'
          }

        }
        return t
      })
    })

  }

  const handleEditTodo = (todo: TodoList) => {
    setEditId(todo.id)
    setEditValue(todo.value)
  }

  const handleEditTodoValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  const editTodo = (id: string) => {
    setTodoList((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            value: editValue,
          }
        }
        return todo;
      })
    })
  }

  const handleEditTodoSubmit = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      editTodo(id);
      setEditId('');
    }

  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (todoItemRef.current && !todoItemRef.current.contains(event.target)) {
        editTodo(editId)
        setEditId('')
        console.log("outside", editId)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [editValue])

  return (
    <div>
      Enter task name
      <div className={"input-wrapper"}>
        <input
          placeholder={"Enter something"}
          value={todo}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <button disabled={todo.trim().length === 0} onClick={() => handleAddTodo(todo)}>Add</button>
      </div>

      <div>
        {todoList.map((t: TodoList) => {
          return (
            <div key={t.id} className="todo-list-wrapper">
              <input
                type="checkbox"
                onChange={() => handleCompleteTodo(t.id)}
              />
              <div className="todo-item">
                {editId === t.id ?
                  <input
                    ref={todoItemRef}
                    value={editValue}
                    onChange={(e) => handleEditTodoValue(e)}
                    onKeyDown={(e) => handleEditTodoSubmit(e, t.id)}

                  />
                  :
                  <p
                    className={t.status === 'completed' ? 'strike' : 'un-strike'}
                    onClick={() => handleEditTodo(t)}
                  >
                    {t.value}
                  </p>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Todo;