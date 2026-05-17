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
        <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] p-4 font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto animate-bounce-subtle">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic">System Interrupted</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                An unexpected frontend event occurred. Please reload the console workspace.
              </p>
              {this.state.error && (
                <div className="text-[10px] bg-slate-50 border border-slate-100 p-3 rounded-lg text-slate-500 max-h-24 overflow-y-auto text-left font-mono break-all mt-2">
                  {this.state.error.toString()}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-50">
              <button 
                onClick={this.handleReload}
                className="w-full tp-button-primary py-3 shadow-xl shadow-[#0D9488]/20 min-h-[44px] flex items-center justify-center gap-2 cursor-pointer bg-slate-900 hover:bg-slate-800 transition-all text-white"
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
