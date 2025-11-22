let img;
let processedImg;
let fraseFinal = '';
let canvas;

function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  background(240);
  noLoop();
  
  // Configurar o listener do upload aqui
  let fileInput = document.getElementById('upload');
  fileInput.addEventListener('change', function(e) {
    handleFileSelect(e);
  });
}

function draw() {
  background(240);
  if (processedImg) {
    image(processedImg, 0, 0, width, height);
  } else if (img) {
    image(img, 0, 0, width, height);
  }
}

function handleFileSelect(evt) {
  let file = evt.target.files[0];
  
  if (file && file.type.startsWith('image')) {
    let reader = new FileReader();
    
    reader.onload = function(e) {
      loadImage(e.target.result, function(loadedImage) {
        img = loadedImage;
        
        // Redimensionar canvas para caber a imagem
        let maxSize = 400;
        let w = img.width;
        let h = img.height;
        
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = (h * maxSize) / w;
            w = maxSize;
          } else {
            w = (w * maxSize) / h;
            h = maxSize;
          }
        }
        
        resizeCanvas(w, h);
        processedImg = img; // Mostra a imagem original inicialmente
        redraw();
      });
    };
    
    reader.readAsDataURL(file);
  }
}

function applyEffect(mode) {
  if (!img) {
    alert('Por favor, selecione uma imagem primeiro!');
    return;
  }

  // Faz uma cópia limpa da imagem original antes de aplicar cada efeito
  let imageToProcess = img.get(); 

  if (mode === 'urgencia') {
    processedImg = rasgarComUrgencia(imageToProcess);
    fraseFinal = 'Imagem arrancada a tempo de evitar o pensamento.';
  } else if (mode === 'retorno') {
    processedImg = corromperSemRetorno(imageToProcess);
    fraseFinal = 'Arquivo danificado além do que se pode chamar de verdade.';
  } else if (mode === 'indiferenca') {
    processedImg = desbotarPorIndiferenca(imageToProcess);
    fraseFinal = 'Virou ausência, que é o jeito mais elegante de ficar.';
  }

  // Exibir nova imagem e frase
  redraw();
  document.getElementById('frase-final').innerText = fraseFinal;
}

// ========== EFEITOS (VERSÕES FINAIS E PODEROSAS) ========== //

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

// ===== CORROMPER SEM RETORNO – VERSÃO HEAVY METAL CORRIGIDA =====
function corromperSemRetorno(img) {

  // ---- PARÂMETROS AJUSTÁVEIS ----
  let numBlocks     = 180;   // quantidade de blocos desalinhados
  let minBlockW     = 20;    // largura mínima do bloco
  let maxBlockW     = 140;   // largura máxima do bloco
  let minBlockH     = 8;     // altura mínima
  let maxBlockH     = 60;    // altura máxima
  let maxShiftX     = 120;   // deslocamento horizontal
  let maxShiftY     = 70;    // deslocamento vertical

  let invertFraction = 0.35; // quantos pixels podem ser invertidos
  let invertProb     = 0.7;  // chance de inverter um pixel selecionado
  let lineStep       = 4;    // passo entre linhas horizontais
  let lineProb       = 0.6;  // probabilidade de uma linha virar ruído

  // ---- 1. Base em preto e branco ----
  let base = createImage(img.width, img.height);
  img.loadPixels();
  base.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let idx = 4 * (y * img.width + x);
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      let gray = (r + g + b) / 3;

      base.pixels[idx]     = gray;
      base.pixels[idx + 1] = gray;
      base.pixels[idx + 2] = gray;
      base.pixels[idx + 3] = 255;
    }
  }
  base.updatePixels();

  // ---- 2. Blocos desalinhados (GLITCH) ----
  let corrupted = createImage(img.width, img.height);
  corrupted.copy(base, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

  for (let i = 0; i < numBlocks; i++) {
    let x  = int(random(img.width));
    let y  = int(random(img.height));
    let w  = int(random(minBlockW, maxBlockW));
    let h  = int(random(minBlockH, maxBlockH));
    let dx = int(random(-maxShiftX, maxShiftX));
    let dy = int(random(-maxShiftY, maxShiftY));

    corrupted.copy(base, x, y, w, h, x + dx, y + dy, w, h);
  }

  // ---- 3. Pixel brightness scramble (inversões) ----
  corrupted.loadPixels();
  let totalPixels = img.width * img.height;
  let samples     = int(totalPixels * invertFraction);

  for (let i = 0; i < samples; i++) {
    let idx = int(random(totalPixels)) * 4;
    let val = corrupted.pixels[idx];

    if (random() < invertProb) {
      let inv = 255 - val;
      corrupted.pixels[idx]     = inv;
      corrupted.pixels[idx + 1] = inv;
      corrupted.pixels[idx + 2] = inv;
    }
  }

  // ---- 4. Ruído horizontal (faixas tipo VHS) ----
  for (let y = 0; y < img.height; y += lineStep) {
    if (random() < lineProb) {
      for (let x = 0; x < img.width; x++) {
        let p = 4 * (y * img.width + x);
        let g = random(30, 230);
        corrupted.pixels[p]     = g;
        corrupted.pixels[p + 1] = g;
        corrupted.pixels[p + 2] = g;
      }
    }
  }

  corrupted.updatePixels();
  return corrupted;
}

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


// Função para download
function downloadImage() {
  if (processedImg) {
    save(canvas, 'imagem_apagada.png');
  } else {
    alert('Por favor, aplique um efeito antes de baixar!');
  }
}
