import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-surface relative overflow-hidden animate-fade-in transition-colors duration-300">
      <div className="absolute -top-[30%] -right-[15%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_70%)] rounded-full pointer-events-none animate-float-orb"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] rounded-full pointer-events-none animate-float-orb-reverse"></div>
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
};

export default SignInPage;
