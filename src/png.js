import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';

let initialized = false;

export async function svgToPng(svgString) {
  if (!initialized) {
    await initWasm(resvgWasm);
    initialized = true;
  }
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: 800 },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}
