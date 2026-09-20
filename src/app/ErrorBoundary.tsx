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
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#EFE6D2] px-6 text-center text-[#2A2118]">
        <p className="display text-2xl text-[#2A2118]">El atlas falló al cargar. Recargá la página.</p>
        <button
          type="button"
          className="rounded-full bg-[#8A6A3B] px-4 py-2 text-sm text-[#F7F1E4]"
          onClick={() => window.location.reload()}
        >
          Recargar
        </button>
      </div>
    );
  }
}
