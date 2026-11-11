'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ShieldAlert, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TradersPro Uncaught Error:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#E0DCD6] dark:bg-[#1F1E1B] p-4 font-sans">
          <div className="w-full max-w-md bg-[#F2EEE9] dark:bg-[#2A2926] rounded-[24px] p-8 md:p-12 shadow-warm-raised border border-[#CAC8C0] dark:border-[#45433E] text-center space-y-6">
            <div className="w-16 h-16 bg-[#F0C9C1] rounded-full flex items-center justify-center text-[#8A2E22] dark:text-[#D98A7B] mx-auto shadow-sm animate-bounce-subtle">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#3E3B36] dark:text-[#EDE9E3] uppercase tracking-tight">System Interrupted</h2>
              <p className="text-xs text-[#7A756F] dark:text-[#A8A39B] font-bold uppercase tracking-widest leading-relaxed">
                An unexpected frontend event occurred. Please reload the console workspace.
              </p>
              {this.state.error && (
                <div className="text-[10px] bg-[#F2EEE9] dark:bg-[#33322E] border border-[#CAC8C0] dark:border-[#45433E] p-3 rounded-xl text-[#7A756F] dark:text-[#A8A39B] max-h-24 overflow-y-auto text-left font-mono break-all mt-2">
                  {this.state.error.toString()}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#CAC8C0] dark:border-[#45433E]">
              <button 
                onClick={this.handleReload}
                className="w-full py-3 px-6 rounded-full font-bold bg-[#B4E0CA] hover:bg-[#9CCDB4] text-[#1E3121] shadow-warm-pill min-h-[48px] flex items-center justify-center gap-2 cursor-pointer transition-all tap-scale"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
