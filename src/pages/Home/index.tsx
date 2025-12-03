// import { useQuery } from "@tanstack/react-query";
import { getTotos } from "@/services/api";
import { useTodoStore } from "@/stores/todoStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Home = () => {
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodoStore();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText("");
    }
  };

  const handleEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleUpdate = (id: string) => {
    if (editText.trim()) {
      updateTodo(id, editText);
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const { data: todosFromDB } = useQuery({
    queryKey: ["todos"],
    queryFn: getTotos,
  });

  console.log("todos from DB:", todosFromDB);
  console.log("todos from store:", todos);

  console.log(todosFromDB);
  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-start p-6">
      <div className="w-[600px] bg-white rounded-lg shadow-md p-6 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Todo List</h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="할 일을 입력하세요..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              추가
            </button>
          </div>
        </form>

        {/* Todo List */}
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />

              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(todo.id)}
                    className="px-3 py-1 text-sm text-green-500 hover:bg-green-50 rounded"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleEdit(todo.id, todo.text)}
                    className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-50 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded"
                  >
                    삭제
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            할 일이 없습니다. 새로운 할 일을 추가해보세요!
          </p>
        )}
      </div>
    </div>
  );
};
