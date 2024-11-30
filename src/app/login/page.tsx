"use client"; // Ensure this component is treated as a Client Component

import { useState } from "react";
import { supabase } from "@/lib/client"; // Import your Supabase client helper
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DarkLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Login successful!");
          window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div className="text-white mask min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 opacity-90 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4"></div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              className="bg-gray-700 border-gray-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
            >
              Remember me
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full bg-primary hover:bg-black"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-sm text-center space-y-2 text-white">
            <a href="forget" className="hover:underline">
              Forgot your password?
            </a>
            <div>
              Don't have an account?{" "}
              <a href="./signup" className="hover:underline">
                Sign up
              </a>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
