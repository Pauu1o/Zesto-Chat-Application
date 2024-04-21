"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";

const Form = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };
  return (
    <div className="py-4 px-4 text-white bg-neutral-900 border-neutral-800 border-t flex items-center gap-2 lg:gap-4 w-full">
      <form
        className="flex items-center gap-2 lg:gap-4 w-full text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          placeholder="Write Message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-orange-500 cursor-pointer hover:bg-orange-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
