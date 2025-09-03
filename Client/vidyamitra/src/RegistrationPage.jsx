import React from "react";

function RegistrationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 text-white p-4 rounded-full">
            <span className="text-3xl">🎓</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Join EduRural
          </h2>
          <p className="text-gray-500 text-center">
            Create your teacher account and start managing your classes
          </p>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Create Account
        </h3>
        <p className="text-gray-500 mb-6">
          Fill in your details to get started
        </p>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              placeholder="Mukul"
              className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Last Name */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Shedge"
              className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="mukulshedge13@gmail.com"
              className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Phone */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* School Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name
            </label>
            <input
              type="text"
              placeholder="DYP Public School"
              className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Subject Specialization */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Specialization
            </label>
            <select className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400 focus:bg-green-50 focus:text-green-700">
              <option>Select your subject</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
            </select>
          </div>

          {/* Teaching Experience */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teaching Experience
            </label>
            <select className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400 focus:bg-green-50 focus:text-green-700">
              <option>Select experience</option>
              <option>0-1 years</option>
              <option>2-5 years</option>
              <option>5+ years</option>
            </select>
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Confirm Password */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 text-black border rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Terms */}
          <div className="md:col-span-2 flex items-center mt-2">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-green-600 font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-600 font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg border border-green-700"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            Sign in here
          </a>
        </p>

        <p className="text-center text-gray-400 text-xs mt-4">
          EduRural Teacher Management System
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;
