import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "../AuthSocialButton";
import { BsGithub } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { callbackify } from "util";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);
  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => toast.success("Registration Successful!"))
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("Check you inputs!"))
        .finally(() => setIsLoading(false));
    }
    if (variant === "LOGIN") {
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Wrong User Credentials!");
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Sucessfully Logged In!");
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Github Credentials!");
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Github Account Success!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className=" sm:mx-auto sm:max-w-md">
      <div className=" px-12 py-8 ">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              type="name"
              register={register}
              errors={errors}
            />
          )}

          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700  " />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-neutral-900 px-2 text-gray-400">
                {" "}
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-400">
          <div>
            {variant === "LOGIN" ? "New to Zesto?" : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
