import { useEffect, useState, type ReactNode } from "react";

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function WebGLGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(() => hasWebGL2());
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const onLost = (e: Event) => {
      e.preventDefault();
      setLost(true);
    };
    window.addEventListener("webglcontextlost", onLost, true);
    return () => window.removeEventListener("webglcontextlost", onLost, true);
  }, []);

  if (!ok) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-[#07090d] px-6 text-center text-zinc-300">
        <p className="display text-2xl text-amber-100">Este dispositivo no ofrece WebGL2.</p>
        <p className="max-w-md text-sm text-zinc-400">
          El atlas 3D necesita un navegador con WebGL2. Probá Chrome, Firefox o Edge actualizado, o otro equipo.
        </p>
        <button type="button" className="rounded-full bg-white/10 px-4 py-2 text-sm" onClick={() => setOk(hasWebGL2())}>
          Reintentar
        </button>
      </div>
    );
  }

  if (lost) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-[#07090d] px-6 text-center text-zinc-300">
        <p className="display text-2xl text-amber-100">WebGL se interrumpió. Recargá.</p>
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

  return children;
}
