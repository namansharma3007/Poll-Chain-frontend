import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

type LoginInput = { email: string; password: string };

export default function Login() {
  const { login, setUser } = useAuth();

  const [loginInput, setLoginInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      const response = await login(loginInput.email, loginInput.password);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      setUser(response.data.user)
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingLogin(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="w-screen h-screen bg-gray-900 flex justify-center items-center flex-col px-6">
      <div className="flex flex-col items-center gap-1 mb-4 mt-10">
        <h2 className="text-3xl font-bold text-purple-600">PollChain</h2>
        <p className="text-gray-400">Sign in to your account</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg w-full max-w-md"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-200 font-semibold">
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={loginInput.email}
            onChange={handleChange}
            placeholder="abc@pollchain.com"
            className="rounded-lg h-10 px-3 outline-none bg-gray-700 text-white"
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
            value={loginInput.password}
            onChange={handleChange}
            placeholder="******"
            min={6}
            className="rounded-lg h-10 pl-3 outline-none bg-gray-700 text-white pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-[38px] text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div>
          <button
            type="submit"
            disabled={loadingLogin}
            className={`text-white font-semibold rounded-lg h-10 w-full ${
              loadingLogin
                ? "cursor-not-allowed bg-purple-900"
                : "cursor-pointer bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loadingLogin ? (
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 rounded-full border-[3px] border-solid border-gray-900 border-l-transparent animate-spin"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
      <div className="flex gap-2 mt-4 flex-wrap items-center justify-center mb-10">
        <p className="text-gray-400">Don't have an account?</p>
        <Link to="/signup" className="text-purple-600 hover:underline">
          Sign up
        </Link>
      </div>
    </section>
  );
}
