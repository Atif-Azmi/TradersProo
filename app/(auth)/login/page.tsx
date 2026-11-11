import LoginForm from '@/components/LoginForm'
import AnimatedBars from '@/components/common/AnimatedBars'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 min-h-[700px]">
        {/* Interaction Side */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <LoginForm />
        </div>

        {/* Visual Side */}
        <div className="hidden lg:flex bg-[#D1E5E3] items-center justify-center p-20 relative overflow-hidden">
          {/* Living Ambient Glow Shift */}
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E5B5A8]/30 rounded-full blur-3xl animated-panel-bg" />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0D9488]/15 rounded-full blur-3xl animated-panel-bg"
            style={{ animationDelay: '-10s' }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Modern Abstract Animated Bars */}
            <AnimatedBars />

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Enterprise Infrastructure
              </h3>
              <p className="text-slate-600 font-medium mt-2">
                The next generation of business management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
