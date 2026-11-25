import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary:${this.props.name || 'component'}]`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white border border-rose-200 rounded-xl p-4 text-sm text-rose-700">
          <div className="font-semibold">
            {this.props.name ? `${this.props.name} failed to load` : 'Something went wrong'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {this.state.error?.message || 'Unexpected error while rendering this section.'}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;