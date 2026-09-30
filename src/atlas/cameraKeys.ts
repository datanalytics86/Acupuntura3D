import { useViewerStore } from "@/state/viewerStore";

const ZOOM_STEP = 1.15;

/** `+`/`=` zoom in, `-` zoom out, `0` resets. Returns true when the key was consumed. */
export function handleCameraKey(e: KeyboardEvent): boolean {
  if (e.ctrlKey || e.metaKey || e.altKey) return false;
  if (e.key === "+" || e.key === "=") {
    e.preventDefault();
    useViewerStore.getState().zoomBy(ZOOM_STEP);
    return true;
  }
  if (e.key === "-") {
    e.preventDefault();
    useViewerStore.getState().zoomBy(1 / ZOOM_STEP);
    return true;
  }
  if (e.key === "0") {
    e.preventDefault();
    useViewerStore.getState().resetAtlasCamera();
    return true;
  }
  return false;
}
