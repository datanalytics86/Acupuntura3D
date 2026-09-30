import { Component, type ErrorInfo, type ReactNode } from "react";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { Disclaimer } from "@/ui/Disclaimer";

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
    const locale = useViewerStore.getState().locale;
    return (
      <div className="error-screen">
        <p>{t(locale, "errorBody")}</p>
        <Disclaimer />
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          {t(locale, "errorRetry")}
        </button>
      </div>
    );
  }
}
