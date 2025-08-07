function rasgarComUrgencia(img) {
  let rasgada = createImage(img.width, img.height);
  img.loadPixels();
  rasgada.loadPixels();

  let maxOffset = int(random(60, 130));
  let sliceHeight = int(random(5, 15));

  for (let y = 0; y < img.height; y += sliceHeight) {
    let offsetX = int(random(-maxOffset, maxOffset));
    let glitchChance = random();
    let invertChance = random();

    for (let x = 0; x < img.width; x++) {
      for (let i = 0; i < sliceHeight; i++) {
        let srcY = y + i;
        let dstY = y + i;
        if (srcY < img.height && dstY < img.height) {
          let srcIndex = 4 * ((srcY * img.width) + x);

          let xTarget = (invertChance < 0.3) ? img.width - x - 1 + offsetX : x + offsetX;
          xTarget = constrain(xTarget, 0, img.width - 1);
          let dstIndex = 4 * ((dstY * img.width) + xTarget);

          if (glitchChance < 0.2) {
            // buraco branco
            rasgada.pixels[dstIndex + 0] = 255;
            rasgada.pixels[dstIndex + 1] = 255;
            rasgada.pixels[dstIndex + 2] = 255;
            rasgada.pixels[dstIndex + 3] = 255;
          } else {
            for (let j = 0; j < 4; j++) {
              rasgada.pixels[dstIndex + j] = img.pixels[srcIndex + j];
            }
          }
        }
      }
    }
  }

  rasgada.updatePixels();
  return rasgada;
}
