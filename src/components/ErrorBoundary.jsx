import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 border border-red-200 rounded-lg m-4 max-w-2xl mx-auto font-mono">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">The application crashed with the following error:</p>
          <div className="bg-white p-4 rounded border border-red-100 overflow-auto max-h-96">
            <p className="font-bold text-red-600">{this.state.error && this.state.error.toString()}</p>
            <pre className="text-xs mt-2 text-gray-600 block">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
