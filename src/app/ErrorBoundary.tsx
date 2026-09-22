import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Acupuntura3D ErrorBoundary", error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-desk px-6 text-center text-ink">
        <p className="display text-2xl">El atlas falló al cargar. Recargá la página.</p>
        <button
          type="button"
          className="stamp-btn"
          onClick={() => window.location.reload()}
        >
          Recargar
        </button>
      </div>
    );
  }
}
