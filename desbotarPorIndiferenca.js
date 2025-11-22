function desbotarPorIndiferenca(img) {
  let output = createImage(img.width, img.height);
  img.loadPixels();
  output.loadPixels();

  // Configuração da "violência"
  // blowOut: quanto de luz extra adicionamos (simula o sol queimando a foto)
  let blowOut = 70; 
  // desat: fator de dessaturação (0 a 1) - empalidece as cores
  let desatFactor = 0.3; 

  for (let y = 1; y < img.height - 1; y++) {
    for (let x = 1; x < img.width - 1; x++) {
      let sumR = 0, sumG = 0, sumB = 0;
      
      // 1. BLUR: Média dos vizinhos (perda de definição)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          let idx = 4 * ((y + dy) * img.width + (x + dx));
          sumR += img.pixels[idx];
          sumG += img.pixels[idx + 1];
          sumB += img.pixels[idx + 2];
        }
      }
      
      let r = sumR / 9;
      let g = sumG / 9;
      let b = sumB / 9;

      // 2. EXCESSO DE LUZ (Han: positividade excessiva)
      // Adiciona brilho forçado para "lavar" a imagem
      r = r + blowOut;
      g = g + blowOut;
      b = b + blowOut;

      // 3. PERDA DE DIFERENÇA (Dessaturação)
      // Calcula a luminosidade e mistura o pixel com ela (tira a cor)
      let luma = 0.3 * r + 0.59 * g + 0.11 * b;
      r = lerp(r, luma, desatFactor);
      g = lerp(g, luma, desatFactor);
      b = lerp(b, luma, desatFactor);

      // Garante que não passe de 255
      let outIdx = 4 * (y * img.width + x);
      output.pixels[outIdx]     = constrain(r, 0, 255);
      output.pixels[outIdx + 1] = constrain(g, 0, 255);
      output.pixels[outIdx + 2] = constrain(b, 0, 255);
      output.pixels[outIdx + 3] = 255;
    }
  }

  output.updatePixels();
  return output;
}
