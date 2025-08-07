function desbotarPorIndiferenca(img) {
  let output = createImage(img.width, img.height);
  output.loadPixels();
  img.loadPixels();

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // Conversão para escala de cinza
      let gray = 0.3 * r + 0.59 * g + 0.11 * b;

      // Mistura de 85% cinza com 15% da cor original
      output.pixels[index]     = gray * 0.85 + r * 0.15;
      output.pixels[index + 1] = gray * 0.85 + g * 0.15;
      output.pixels[index + 2] = gray * 0.85 + b * 0.15;
      output.pixels[index + 3] = 255;
    }
  }

  output.updatePixels();

  // Aplicar blur 2 vezes para suavizar ainda mais
  output.filter(BLUR, 3);
  output.filter(BLUR, 3);

  return output;
}
