import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Event Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          alt="Event background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <Button
                className="w-full bg-white text-gray-700 border hover:bg-gray-50 
                  flex items-center justify-center gap-3"
                variant="outline"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Continue with Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
