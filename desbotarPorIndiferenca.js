// Efeito: Desbotar por Indiferença (versão forte + blur pesado)
// Espera um p5.Image como entrada e devolve um novo p5.Image processado.

function desbotarPorIndiferenca(inputImg, intensidade = 1) {
  let img = inputImg.get();

  img.loadPixels();
  let output = createImage(img.width, img.height);
  output.loadPixels();

  let baseGain       = 1.4;
  let baseBlowOut    = 80;
  let baseDesat      = 0.9;
  let baseBlurRadius = 4;

  function jitter(base, margem = 0.2) {
    let fator = 1 + random(-margem, margem) * intensidade;
    return base * fator;
  }

  let gain       = jitter(baseGain);
  let blowOut    = jitter(baseBlowOut);
  let desat      = jitter(baseDesat);
  desat = constrain(desat, 0, 1);

  let blurRadius = Math.round(
    constrain(jitter(baseBlurRadius, 0.25), 1, 12)
  );

  let w = img.width;
  let h = img.height;

  for (let i = 0; i < img.pixels.length; i += 4) {
    output.pixels[i]     = img.pixels[i];
    output.pixels[i + 1] = img.pixels[i + 1];
    output.pixels[i + 2] = img.pixels[i + 2];
    output.pixels[i + 3] = img.pixels[i + 3];
  }

  for (let y = blurRadius; y < h - blurRadius; y++) {
    for (let x = blurRadius; x < w - blurRadius; x++) {

      let sumR = 0, sumG = 0, sumB = 0;
      let samples = 0;

      for (let dy = -blurRadius; dy <= blurRadius; dy++) {
        for (let dx = -blurRadius; dx <= blurRadius; dx++) {
          let sx = x + dx;
          let sy = y + dy;

          let idx = 4 * (sy * w + sx);
          sumR += img.pixels[idx];
          sumG += img.pixels[idx + 1];
          sumB += img.pixels[idx + 2];
          samples++;
        }
      }

      let r = sumR / samples;
      let g = sumG / samples;
      let b = sumB / samples;

      r = (r * gain) + blowOut;
      g = (g * gain) + blowOut;
      b = (b * gain) + blowOut;

      let luma = 0.299 * r + 0.587 * g + 0.114 * b;
      r = lerp(r, luma, desat);
      g = lerp(g, luma, desat);
      b = lerp(b, luma, desat);

      let outIdx = 4 * (y * w + x);
      output.pixels[outIdx]     = constrain(r, 0, 255);
      output.pixels[outIdx + 1] = constrain(g, 0, 255);
      output.pixels[outIdx + 2] = constrain(b, 0, 255);
      output.pixels[outIdx + 3] = 255;
    }
  }

  output.updatePixels();
  return output;
}

if (typeof window !== 'undefined') {
  window.desbotarPorIndiferenca = desbotarPorIndiferenca;
}
if (typeof module !== 'undefined') {
  module.exports = desbotarPorIndiferenca;
}
