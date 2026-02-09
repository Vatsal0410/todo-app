function TodoForm() {
  return (
    <form className="w-full max-w-3xl flex gap-3">
      <input
        placeholder="Type here"
        className="mt-4 w-full rounded border border-zinc-300 bg-zinc-50 p-2 dark:bg-zinc-800"
      />
      <button className="mt-4 rounded border border-gray-300 bg-zinc-50 p-2 dark:bg-zinc-800">
        Add
      </button>
    </form>
  );
}

export default TodoForm;
