import LoginForm from '@/components/LoginForm'
import AnimatedBars from '@/components/common/AnimatedBars'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0DCD6] dark:bg-[#1F1E1B] p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-[#E9E4DE] dark:bg-[#2A2926] rounded-[24px] overflow-hidden shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] min-h-[700px]">
        {/* Interaction Side */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <LoginForm />
        </div>

        {/* Visual Side */}
        <div className="hidden lg:flex bg-[#E0DCD6] dark:bg-[#22211E] items-center justify-center p-20 relative overflow-hidden border-l border-[#CAC8C0]/60 dark:border-[#45433E]/60">
          {/* Living Ambient Glow Shift */}
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B4E0CA]/35 rounded-full blur-3xl animated-panel-bg" />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#88A993]/25 rounded-full blur-3xl animated-panel-bg"
            style={{ animationDelay: '-10s' }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Modern Abstract Animated Bars */}
            <AnimatedBars />

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-black text-[#3E3B36] dark:text-[#EDE9E3] tracking-tight">
                Enterprise Infrastructure
              </h3>
              <p className="text-[#7A756F] dark:text-[#A8A39B] font-medium mt-2">
                The next generation of business management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
