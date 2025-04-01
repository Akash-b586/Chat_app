import toast from "react-hot-toast";

const imgTypes = ["image/png", "image/jpeg", "image/jpg"];

export const handleImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size exceeds the limit of 5MB.");
    return;
  }

  if (!imgTypes.includes(file.type)) {
    toast.error("File type is not supported.");
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Error while reading the file");
  });
};
