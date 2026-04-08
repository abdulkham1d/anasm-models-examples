export async function headExists(url) {
    try {
      const r = await fetch(url, { method: 'HEAD' });
      return r.ok;
    } catch {
      return false;
    }
  }
  