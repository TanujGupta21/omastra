import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-black mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-500 mb-6">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="px-6 py-2.5 bg-black text-bg font-bold rounded-xl hover:bg-black-hover transition-colors text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary


