
function corromperSemRetorno(img) {
  let result = createImage(img.width, img.height);
  img.loadPixels();
  result.loadPixels();

  // 1. Copia imagem original convertida para P&B
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let idx = 4 * (y * img.width + x);
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      let gray = (r + g + b) / 3;
      result.pixels[idx] = gray;
      result.pixels[idx + 1] = gray;
      result.pixels[idx + 2] = gray;
      result.pixels[idx + 3] = 255;
    }
  }

  // 2. Blocos desalinhados com mais força
  for (let i = 0; i < 100; i++) {
    let x = int(random(img.width));
    let y = int(random(img.height));
    let w = int(random(10, 100));
    let h = int(random(5, 40));
    let dx = int(random(-80, 80));
    let dy = int(random(-50, 50));
    result.copy(result, x, y, w, h, x + dx, y + dy, w, h);
  }

  // 3. Embaralhar brilho (simula glitch)
  for (let i = 0; i < img.width * img.height * 0.2; i++) {
    let idx = int(random(img.width * img.height));
    let p = idx * 4;
    let val = result.pixels[p];
    if (random() < 0.5) {
      result.pixels[p] = 255 - val;
      result.pixels[p + 1] = 255 - val;
      result.pixels[p + 2] = 255 - val;
    }
  }

  // 4. Ruído horizontal
  for (let y = 0; y < img.height; y += 5) {
    if (random() < 0.4) {
      for (let x = 0; x < img.width; x++) {
        let p = 4 * (y * img.width + x);
        let g = random(256);
        result.pixels[p] = g;
        result.pixels[p + 1] = g;
        result.pixels[p + 2] = g;
      }
    }
  }

  result.updatePixels();
  return result;
}