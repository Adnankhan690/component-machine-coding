import Todo from "./components/todo";
import PracticeTodo from "./components/practice-todo"

export default function ScreenTodo() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo Screen</h1> 
      <p>This is an empty placeholder screen for the Todo component.</p>
      {/* <Todo /> */}
      <PracticeTodo />
    </div>
  );
}
