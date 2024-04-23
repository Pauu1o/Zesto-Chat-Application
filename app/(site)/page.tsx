"use client";
import Image from "next/image";
import AuthForm from "./components/authform";
import Typewriter from "typewriter-effect";

export default function Home() {
  return (
    <div className="flex min-h-full justify-center  bg-neutral-900">
      {/* LEFT COL */}
      <div className="flex flex-col justify-center  sm:w-1/2">
        <div className="mx-auto max-w-md">
          <Image
            alt="logo"
            height="948"
            width="48"
            className="mx-auto w-auto"
            src="/images/orange.png"
          />

          <div className="text-center py-2 px-2 font-medium text-orange-500">
            Welcome To Zesto
          </div>
          <h2 className="mt-1 text-center text-2xl font-bold tracking-tight text-white">
            Sign in with your details
          </h2>
        </div>
        <div>
          {/* Authentication Form */}
          <AuthForm />
        </div>
      </div>

      {/* RIGHT COL */}
      <div className="flex bg-BGleft bg-no-repeat bg-cover w-full mx-auto hidden md:flex">
        <div className="mx-auto max-y-md max-w-lg flex items-center">
          <h1 className="text-white font-bold text-5xl text-center">
            <Typewriter
              options={{
                strings: ["Connect with People", "Create a Community"],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>
        </div>
      </div>
    </div>
  );
}
