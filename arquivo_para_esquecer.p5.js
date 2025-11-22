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

function corromperSemRetorno(img) {
  let result = createImage(img.width, img.height);
  img.loadPixels();
  result.loadPixels();

  // 1. Converter para P&B
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
  result.updatePixels();

  // 2. Criar uma nova imagem para os blocos desalinhados
  let corrupted = createImage(img.width, img.height);
  corrupted.copy(result, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  
  // Aplicar desalinhamentos usando a imagem P&B como base
  for (let i = 0; i < 100; i++) {
    let x = int(random(img.width));
    let y = int(random(img.height));
    let w = int(random(10, 100));
    let h = int(random(5, 40));
    let dx = int(random(-80, 80));
    let dy = int(random(-50, 50));
    
    corrupted.copy(result, x, y, w, h, x + dx, y + dy, w, h);
  }

  // 3. Embaralhar brilho (Esta parte está OK)
  result.loadPixels();
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
  result.updatePixels();

  // 4. Ruído horizontal (Esta parte está OK)
  result.loadPixels();
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
