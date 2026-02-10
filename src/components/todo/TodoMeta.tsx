export default function TodoMeta({ priority, dueDate }) {
    return (
        <div className="flex gap-2 text-xs text-zinc-400">
            {priority !== undefined && (
                <span>Priority: {priority}</span>
            )}
            {dueDate && (
                <span>
                    Due: {new Date(dueDate).toLocaleDateString()}
                </span>
            )}
        </div>
    )
}