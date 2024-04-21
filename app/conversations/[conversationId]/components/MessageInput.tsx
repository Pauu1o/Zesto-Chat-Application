"use client";

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}
const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors,
}) => {
  return (
    <div className="relative w-full">
      {" "}
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-white font-light py-2 px-4 bg-neutral-800 w-full rounded-full focus:outline-none"
      ></input>
    </div>
  );
};

export default MessageInput;
