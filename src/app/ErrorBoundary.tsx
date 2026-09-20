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
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#07090d] px-6 text-center text-zinc-200">
        <p className="display text-2xl text-amber-100">El atlas falló al cargar. Recargá la página.</p>
        <button
          type="button"
          className="rounded-full bg-amber-300/20 px-4 py-2 text-sm text-amber-100"
          onClick={() => window.location.reload()}
        >
          Recargar
        </button>
      </div>
    );
  }
}
