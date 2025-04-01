import { useAuthStore } from "../store/useAuthStore";
import { Camera } from "lucide-react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { updateUserSchema } from "../../../shared/userValidation.js";
import { TextInput } from "../components/TextInput";
import { ErrorMessage } from "../components/ErrorMessage";
import { RadioButton } from "../components/RadioButton";
import { useEffect } from "react";
import classNames from "classnames";
import toast from "react-hot-toast";
import { Loading } from "../components/Loading.jsx";
import { handleImage } from "../utils/handleImage.js";

const Profile = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const loading = useAuthStore((state) => state.loading.updateProfile);
  const error = useAuthStore((state) => state.error.updateProfile);
  const updProfile = useAuthStore((state) => state.updProfile);

  const buttonClass = classNames(
    "w-full py-2.5 rounded-lg font-semibold transition-all duration-200",
    {
      "bg-primary text-white hover:bg-primary-focus": !error,
      "bg-gray-300 text-gray-500 cursor-not-allowed": error,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: joiResolver(updateUserSchema),
    defaultValues: {
      email: authUser.email,
      username: authUser.username,
      oldPassword: "",
      newPassword: "",
      gender: authUser.gender,
    },
  });

  const handleImageUpload = async (event) => {
    try {
      const picture = await handleImage(event);
      setValue("profilePicture", picture);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleFormSubmit = handleSubmit((data) => {
    updProfile(data);
  });

  const profilePicture = watch("profilePicture");

  // Reset the error status when the component unmounts
  useEffect(() => {
    return () => {
      useAuthStore.setState((state) => ({
        ...state.error,
        updateProfile: false,
      }));
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Update your profile information</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profilePicture || authUser.profilePicture}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {loading
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <TextInput
              name="email"
              type="email"
              {...register("email")}
              error={!!errors.email || error}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}

            <TextInput
              name="username"
              {...register("username")}
              error={!!errors.username || error}
            />
            {errors.username && (
              <ErrorMessage message={errors.username.message} />
            )}

            <TextInput
              name="oldPassword"
              type="password"
              {...register("oldPassword")}
              error={!!errors.oldPassword || error}
            />
            {errors.oldPassword && (
              <ErrorMessage message={errors.oldPassword.message} />
            )}

            <TextInput
              name="newPassword"
              type="password"
              {...register("newPassword")}
              error={!!errors.newPassword || error}
            />
            {errors.newPassword && (
              <ErrorMessage message={errors.newPassword.message} />
            )}

            <RadioButton
              name="gender"
              {...register("gender")}
              defaultChecked="male"
              options={[
                { label: "Male", value: "male", styleClass: "radio-primary" },
                { label: "Female", value: "female", styleClass: "radio-error" },
              ]}
            />
            <button type="submit" disabled={loading} className={buttonClass}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
