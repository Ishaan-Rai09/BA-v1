import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-luxury-royal bg-clip-text text-transparent">
          Welcome to Blind Assistant
        </h1>
        <SignIn />
      </div>
    </div>
  )
}
