import { memo, useEffect, useRef, useState } from "react";

function TodoEditInput({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== initialValue) onSave(value);
        else onCancel();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSave(value);
        if (e.key === "Escape") onCancel();
      }}
      className="rounded border px-2 py-1"
    />
  );
}

export default memo(TodoEditInput);