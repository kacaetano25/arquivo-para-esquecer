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

  // 1. Copia imagem original convertida para P&B (Esta parte está OK)
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
      result.pixels[idx + 3] = 255; // Garante que a imagem é opaca
    }
  }
  result.updatePixels(); // Atualiza após a primeira etapa

  // 2. Blocos desalinhados com mais força (COM A CORREÇÃO)
  let temp = result.get(); // <<-- CRIAMOS UMA CÓPIA SEGURA AQUI
  for (let i = 0; i < 100; i++) {
    let x = int(random(img.width));
    let y = int(random(img.height));
    let w = int(random(10, 100));
    let h = int(random(5, 40));
    let dx = int(random(-80, 80));
    let dy = int(random(-50, 50));
    // Agora usamos a cópia 'temp' como fonte, para evitar erros
    result.copy(temp, x, y, w, h, x + dx, y + dy, w, h); // <<-- MUDANÇA AQUI
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

function desbotarPorIndiferenca(img) {
  let result = createImage(img.width, img.height);
  img.loadPixels();
  result.loadPixels();

  // 1. Saturação reduzida
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let idx = 4 * (y * img.width + x);
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      let avg = (r + g + b) / 3;
      result.pixels[idx] = lerp(avg, r, 0.15);
      result.pixels[idx + 1] = lerp(avg, g, 0.15);
      result.pixels[idx + 2] = lerp(avg, b, 0.15);
      result.pixels[idx + 3] = 255;
    }
  }
  result.updatePixels();

  // 2. Névoa branca leve
  result.loadPixels();
  for (let i = 0; i < result.width * result.height; i++) {
    let p = i * 4;
    result.pixels[p] = lerp(result.pixels[p], 255, 0.08);
    result.pixels[p + 1] = lerp(result.pixels[p + 1], 255, 0.08);
    result.pixels[p + 2] = lerp(result.pixels[p + 2], 255, 0.08);
  }
  result.updatePixels();

  // 3. Blur leve (2x)
  let blurred1 = applyBoxBlur(result);
  let blurred2 = applyBoxBlur(blurred1);

  return blurred2;
}

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
      output.pixels[outIdx] = r / 9;
      output.pixels[outIdx + 1] = g / 9;
      output.pixels[outIdx + 2] = b / 9;
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
