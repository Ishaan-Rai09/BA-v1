import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative">
      {/* Back to Home Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>
      
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 text-white">
          Join <span className="bg-gradient-to-r from-luxury-gold to-luxury-darkGold bg-clip-text text-transparent">Blind Assistant</span>
        </h1>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <SignUp 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-none',
                headerTitle: 'text-white text-xl font-bold',
                headerSubtitle: 'text-white/70',
                socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all',
                formFieldLabel: 'text-white font-medium',
                formFieldInput: 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-luxury-gold focus:ring-luxury-gold/20',
                formButtonPrimary: 'bg-gradient-to-r from-luxury-gold to-luxury-darkGold text-black font-medium hover:shadow-lg transition-all',
                footerActionLink: 'text-luxury-gold hover:text-luxury-darkGold',
                identityPreviewText: 'text-white',
                identityPreviewEditButton: 'text-luxury-gold hover:text-luxury-darkGold'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
