import { useEffect, useRef, useState } from "react";
import { handleImage } from "../utils/handleImage.js";
import { useForm } from "react-hook-form";
import { X, Image, Send } from "lucide-react";
import toast from "react-hot-toast";

export const MessageInput = () => {
  const { register, setValue, handleSubmit, getValues, reset, watch } = useForm(
    {
      defaultValues: { text: "", img: null },
    }
  );
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const img = watch("img");

  const removeImage = () => {
    setValue("img", null);
    fileInputRef.current.value = "";
  };

  const handleFileChange = async (event) => {
    try {
      const image = await handleImage(event);
      setValue("img", image);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSendMessage = handleSubmit((data) => {
    console.log(data);
    reset();
  });

  return (
    <div className="p-4 w-full">
      {img && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={img}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            {...register("text")}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${img ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text && !img}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
