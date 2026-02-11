type TodoMetaProps = {
    priority?: number;
    dueDate?: Date;
}

export default function TodoMeta({priority, dueDate }: TodoMetaProps) {
    return (
        <div className="flex gap-2 text-xs text-zinc-400">
            {priority !== undefined && (
                <span>Priority: {priority}</span>
            )}
            {dueDate && (
                <span>
                    Due: {new Date(dueDate).toLocaleDateString('en-IN')}
                </span>
            )}
        </div>
    )
}