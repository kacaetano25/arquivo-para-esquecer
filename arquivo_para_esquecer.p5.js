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
        processedImg = createImage(img.width, img.height);
        processedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        
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
        redraw();
      });
    };
    
    reader.readAsDataURL(file);
  }
}

// Botão chama isso: applyEffect('urgencia'), 'retorno' ou 'indiferenca'
function applyEffect(mode) {
  if (!img) {
    alert('Por favor, selecione uma imagem primeiro!');
    return;
  }

  processedImg = createImage(img.width, img.height);
  processedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

  if (mode === 'urgencia') {
    rasgarComUrgencia(processedImg);
    fraseFinal = 'Imagem arrancada a tempo de evitar o pensamento.';
  } else if (mode === 'retorno') {
    corromperSemRetorno(processedImg);
    fraseFinal = 'Arquivo danificado além do que se pode chamar de verdade.';
  } else if (mode === 'indiferenca') {
    desbotarPorIndiferenca(processedImg);
    fraseFinal = 'Virou ausência, que é o jeito mais elegante de ficar.';
  }

  // Exibir nova imagem e frase
  redraw();
  document.getElementById('frase-final').innerText = fraseFinal;
}

// ========== EFEITOS ========== //

function rasgarComUrgencia(gfx) {
  gfx.loadPixels();
  
  // Criar faixas horizontais deslocadas
  for (let i = 0; i < 20; i++) {
    let y = int(random(gfx.height));
    let h = int(random(5, 20));
    let xShift = int(random(-30, 30));
    
    // Copiar pixels manualmente para evitar problemas
    let strip = [];
    for (let py = y; py < min(y + h, gfx.height); py++) {
      for (let px = 0; px < gfx.width; px++) {
        let idx = 4 * (py * gfx.width + px);
        strip.push([
          gfx.pixels[idx],
          gfx.pixels[idx + 1],
          gfx.pixels[idx + 2],
          gfx.pixels[idx + 3]
        ]);
      }
    }
    
    // Colar com deslocamento
    let stripIdx = 0;
    for (let py = y; py < min(y + h, gfx.height); py++) {
      for (let px = 0; px < gfx.width; px++) {
        let newX = px + xShift;
        if (newX >= 0 && newX < gfx.width && stripIdx < strip.length) {
          let idx = 4 * (py * gfx.width + newX);
          gfx.pixels[idx] = strip[stripIdx][0];
          gfx.pixels[idx + 1] = strip[stripIdx][1];
          gfx.pixels[idx + 2] = strip[stripIdx][2];
          gfx.pixels[idx + 3] = strip[stripIdx][3];
        }
        stripIdx++;
      }
    }
  }
  
  gfx.updatePixels();
}

function corromperSemRetorno(gfx) {
  gfx.loadPixels();
  
  // Aplicar glitch digital
  for (let i = 0; i < 10; i++) {
    let sx = int(random(gfx.width - 50));
    let sy = int(random(gfx.height - 50));
    let sw = int(random(10, 50));
    let sh = int(random(10, 50));
    let dx = sx + int(random(-30, 30));
    let dy = sy + int(random(-30, 30));
    
    // Copiar e colar blocos de pixels
    let block = [];
    for (let y = sy; y < min(sy + sh, gfx.height); y++) {
      for (let x = sx; x < min(sx + sw, gfx.width); x++) {
        let idx = 4 * (y * gfx.width + x);
        block.push([
          gfx.pixels[idx],
          gfx.pixels[idx + 1],
          gfx.pixels[idx + 2],
          gfx.pixels[idx + 3]
        ]);
      }
    }
    
    // Colar em nova posição
    let blockIdx = 0;
    for (let y = dy; y < min(dy + sh, gfx.height); y++) {
      for (let x = dx; x < min(dx + sw, gfx.width); x++) {
        if (x >= 0 && y >= 0 && x < gfx.width && y < gfx.height && blockIdx < block.length) {
          let idx = 4 * (y * gfx.width + x);
          // Misturar com inversão aleatória
          if (random() < 0.3) {
            gfx.pixels[idx] = 255 - block[blockIdx][0];
            gfx.pixels[idx + 1] = 255 - block[blockIdx][1];
            gfx.pixels[idx + 2] = 255 - block[blockIdx][2];
          } else {
            gfx.pixels[idx] = block[blockIdx][0];
            gfx.pixels[idx + 1] = block[blockIdx][1];
            gfx.pixels[idx + 2] = block[blockIdx][2];
          }
          gfx.pixels[idx + 3] = block[blockIdx][3];
        }
        blockIdx++;
      }
    }
  }
  
  // Adicionar ruído
  for (let i = 0; i < gfx.width * gfx.height * 0.1; i++) {
    let idx = int(random(gfx.width * gfx.height)) * 4;
    if (random() < 0.5) {
      let val = random() < 0.5 ? 0 : 255;
      gfx.pixels[idx] = val;
      gfx.pixels[idx + 1] = val;
      gfx.pixels[idx + 2] = val;
    }
  }
  
  gfx.updatePixels();
}

function desbotarPorIndiferenca(gfx) {
  gfx.loadPixels();
  
  for (let i = 0; i < gfx.pixels.length; i += 4) {
    let r = gfx.pixels[i];
    let g = gfx.pixels[i + 1];
    let b = gfx.pixels[i + 2];
    
    // Converter para cinza
    let gray = (r * 0.3 + g * 0.59 + b * 0.11);
    
    // Manter apenas 15% da cor original
    gfx.pixels[i] = gray * 0.85 + r * 0.15;
    gfx.pixels[i + 1] = gray * 0.85 + g * 0.15;
    gfx.pixels[i + 2] = gray * 0.85 + b * 0.15;
  }
  
  gfx.updatePixels();
  
  // Aplicar blur suave
  gfx.filter(BLUR, 2);
}

// Função para download
function downloadImage() {
  if (processedImg) {
    save(canvas, 'imagem_apagada.png');
  } else {
    alert('Por favor, aplique um efeito antes de baixar!');
  }
}
