import * as api from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const Home = () => {
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const user = useAuthStore((state) => state.user);
  console.log(user);
  const queryClient = useQueryClient();
  // Zustand만 사용 (로컬 상태만 관리)
  //  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodoStore();
  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (inputText.trim()) {
  //       addTodo(inputText);
  //       setInputText("");
  //     }
  //   };

  //   const handleEdit = (id: string, text: string) => {
  //     setEditingId(id);
  //     setEditText(text);
  //   };

  //   const handleUpdate = (id: string) => {
  //     if (editText.trim()) {
  //       updateTodo(id, editText);
  //       setEditingId(null);
  //       setEditText("");
  //     }
  //   };

  //   const handleCancelEdit = () => {
  //     setEditingId(null);
  //     setEditText("");
  //   };

  // Todos 조회
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => api.getTodos(user?.id || ""),
  });
  // Todo 추가
  const addMutation = useMutation({
    mutationFn: api.addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Todo 수정
  const updateMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      api.updateTodo(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Todo 삭제
  const deleteMutation = useMutation({
    mutationFn: api.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Todo 토글
  const toggleMutation = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      api.toggleTodo(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addMutation.mutate(inputText);
      setInputText("");
    }
  };

  const handleEdit = (id: string, contents: string) => {
    setEditingId(id);
    setEditText(contents);
  };

  const handleUpdate = (id: string) => {
    if (editText.trim()) {
      updateMutation.mutate({ id, text: editText });
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-start p-6">
      <div className="w-[600px] bg-white rounded-lg shadow-md p-6">
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
              disabled={addMutation.isPending}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {addMutation.isPending ? "추가 중..." : "추가"}
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
                checked={todo.isDone}
                onChange={() =>
                  toggleMutation.mutate({
                    id: todo.id,
                    isDone: todo.isDone,
                  })
                }
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
                    disabled={updateMutation.isPending}
                    className="px-3 py-1 text-sm text-green-500 hover:bg-green-50 rounded disabled:opacity-50"
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
                      todo.isDone
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.contents}
                  </span>
                  <button
                    onClick={() => handleEdit(todo.id, todo.contents)}
                    className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-50 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(todo.id)}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
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
