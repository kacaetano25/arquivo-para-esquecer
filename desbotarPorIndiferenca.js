// Função de blur suave que estava no seu código original do p5.js
function applyBoxBlur(img) {
  let output = createImage(img.width, img.height);
  img.loadPixels();
  output.loadPixels();

  for (let y = 1; y < img.height - 1; y++) {
    for (let x = 1; x < img.width - 1; x++) {
      let r = 0, g = 0, b = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          let idx = 4 * ((y + dy) * img.width + (x + dx));
          r += img.pixels[idx];
          g += img.pixels[idx + 1];
          b += img.pixels[idx + 2];
        }
      }
      let outIdx = 4 * (y * img.width + x);
      output.pixels[outIdx]     = r / 9;
      output.pixels[outIdx + 1] = g / 9;
      output.pixels[outIdx + 2] = b / 9;
      output.pixels[outIdx + 3] = 255;
    }
  }

  output.updatePixels();
  return output;
}
