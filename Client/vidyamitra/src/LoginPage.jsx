import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👈 install lucide-react

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-lg"> {/* wider box for desktop */}
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mb-3">
            <span className="text-white text-2xl font-bold">🎓</span>
          </div>
          <h2 className="text-center text-2xl font-bold text-green-800">
            Welcome to EduRural
          </h2>
          <p className="text-center text-gray-600">
            Sign in to your teacher account
          </p>
        </div>

        {/* White Box (Form Section) */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <form className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="teacher@school.edu"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
              />
            </div>

            {/* Password with eye toggle */}
            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400 pr-10"
                />
                <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute inset-y-0 right-0 flex items-center bg-transparent p-0"
>
  {showPassword ? (
    <EyeOff className="h-4 w-4 text-gray-600 " />
  ) : (
    <Eye className="h-4 w-4 text-gray-600 " />
  )}
</button>

              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-green-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-green-600 text-Black font-semibold hover:bg-green-700"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Sign Up (Outside the Box) */}
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className="text-green-600 hover:underline">
            Sign up here
          </a>
        </p>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          EduRural Teacher Management System <br />
          Empowering rural education through technology
        </p>
      </div>
    </div>
  );
}

