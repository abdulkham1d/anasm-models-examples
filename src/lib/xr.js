export async function getXRSupport() {
    const res = { ar: false, vr: false };
    try {
      if (navigator.xr?.isSessionSupported) {
        res.ar = await navigator.xr.isSessionSupported('immersive-ar');
        res.vr = await navigator.xr.isSessionSupported('immersive-vr');
      }
    } catch {}
    return res;
  }
  