import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[LifeQuest] Render error caught:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-void-950 p-8 text-center">
          <div className="max-w-md space-y-4">
            <span className="text-6xl">⚠️</span>
            <h1 className="font-display text-2xl font-black text-white">The Realm Has Cracked</h1>
            <p className="text-sm text-slate-400">
              An unexpected error occurred. Refreshing the page should restore the portal.
            </p>
            <p className="max-w-full overflow-auto rounded-lg bg-void-800 p-3 text-left font-mono text-xs text-rose-300">
              {this.state.error.message}
            </p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.reload(); }}
              className="rounded-lg bg-gradient-to-b from-arcane-400 to-arcane-600 px-6 py-2.5 font-semibold text-white shadow-glow"
            >
              Reload the Realm
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}