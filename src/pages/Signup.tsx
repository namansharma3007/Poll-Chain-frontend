import { useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { testEmail } from "../utils/utils";

type SignupInput = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  avatar?: File;
};

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [signupInput, setSignupInput] = useState<SignupInput>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: undefined,
  });
  const [loadingSignup, setLoadingSignup] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const triggerUploadFile = () => {
    document.getElementById("avatar")?.click();
  };

  const handleFileRemove = () => {
    setSignupInput({ ...signupInput, avatar: undefined });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!e.target.files[0].type.includes("image")) {
        toast.error("Wrong file format!");
        handleFileRemove();
        return;
      }
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB!");
        handleFileRemove();
        return;
      }
      setSignupInput({ ...signupInput, avatar: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const flag = formValidation(signupInput);

    if (!flag.check) {
      toast.error(flag.message);
      return;
    }
    setLoadingSignup(true);
    try {
      const formData = new FormData();
      formData.append("username", signupInput.username);
      formData.append("email", signupInput.email);
      formData.append("password", signupInput.password);
      formData.append("confirmPassword", signupInput.confirmPassword);
      if (signupInput.avatar) {
        formData.append("avatar", signupInput.avatar);
      }
      const response = await signup(formData);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      setSignupInput({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        avatar: undefined,
      });
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingSignup(false);
    }
  };

  const formValidation = (signupInput: SignupInput) => {
    const { email, username, password, confirmPassword } = signupInput;

    if (!email || !username || !password || !confirmPassword) {
      return { check: false, message: "All fields are required." };
    }

    if (!testEmail(email)) {
      return { check: false, message: "Invalid email format" };
    }

    if (username.length < 6 || username.length > 20) {
      return {
        check: false,
        message: "Username must be between 6 and 20 characters long",
      };
    }

    if (password.length < 6 || password.length > 20) {
      return {
        check: false,
        message: "Password must be between 6 and 20 characters",
      };
    }

    if (password !== confirmPassword) {
      return { check: false, message: "Passwords do not match" };
    }

    return { check: true, message: null };
  };
  return (
    <div className="w-screen min-h-screen h-max bg-gray-900 flex justify-center items-center flex-col p-4">
      <div className="flex flex-col items-center gap-1 mb-4">
        <h2 className="text-3xl font-bold text-purple-600">Create Account</h2>
        <p className="text-gray-400">
          Join PollChain to create and participate in polls
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg w-full max-w-md mx-1"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-200 font-semibold">
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={signupInput.email}
            onChange={handleChange}
            placeholder="abc@email.com"
            className="rounded-lg h-10 px-2 outline-none bg-gray-700 text-white"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-gray-200 font-semibold">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={signupInput.username}
            onChange={handleChange}
            placeholder="abc123"
            className="rounded-lg h-10 px-2 outline-none bg-gray-700 text-white"
            required
          />
        </div>
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="password" className="text-gray-200 font-semibold">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={signupInput.password}
            onChange={handleChange}
            placeholder="******"
            min={6}
            className="rounded-lg h-10 pl-2 outline-none bg-gray-700 text-white pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-9 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="flex flex-col gap-1 relative">
          <label
            htmlFor="confirmPassword"
            className="text-gray-200 font-semibold"
          >
            Confirm password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            value={signupInput.confirmPassword}
            onChange={handleChange}
            placeholder="******"
            min={6}
            className="rounded-lg h-10 pl-2 outline-none bg-gray-700 text-white pr-10"
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-2 top-9 text-gray-400 hover:text-gray-200"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar" className="text-gray-200 font-semibold">
            Profile picture
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-2 truncate bg-gray-700 h-10 pr-3 pl-1 py-2 rounded-lg">
            <button
              type="button"
              onClick={triggerUploadFile}
              className="text-gray-400 hover:text-gray-200 font-semibold bg-gray-800 rounded-lg px-3 py-1"
            >
              Upload
            </button>
            {signupInput.avatar ? (
              <div className="flex items-center justify-between w-full gap-2 truncate">
                <span className="text-gray-400 truncate">
                  {signupInput.avatar.name}
                </span>
                <button
                  type="button"
                  onClick={handleFileRemove}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full gap-2 truncate">
                <span className="truncate text-gray-400">
                  Maximum file size: 5MB
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full">
          <button
            type="submit"
            disabled={loadingSignup}
            className={`text-white font-semibold rounded-lg h-10 w-full ${
              loadingSignup
                ? "cursor-not-allowed bg-purple-900"
                : "cursor-pointer bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loadingSignup ? (
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 rounded-full border-[3px] border-solid border-gray-900 border-l-transparent animate-spin"></div>
              </div>
            ) : (
              "Sign up"
            )}
          </button>
        </div>
      </form>
      <div className="flex gap-2 mt-4">
        <p className="text-gray-400">Already have an account?</p>
        <Link to="/login" className="text-purple-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
