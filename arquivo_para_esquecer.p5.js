let img;
let processedImg;
let fraseFinal = '';

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  noLoop();
}

function draw() {
  background(240);
  if (processedImg) {
    image(processedImg, 0, 0, width, height);
  }
}

function handleFile(file) {
  if (file.type === 'image') {
    loadImage(file.data, loadedImage => {
      img = loadedImage;
      processedImg = img.get();
      image(processedImg, 0, 0, width, height);
    });
  } else {
    img = null;
  }
}

// Botão chama isso: applyEffect('urgencia'), 'retorno' ou 'indiferenca'
function applyEffect(mode) {
  if (!img) return;

  processedImg = img.get(); // reset

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
  for (let i = 0; i < 20; i++) {
    let y = int(random(gfx.height));
    let h = int(random(5, 20));
    let xShift = int(random(-30, 30));
    let strip = gfx.get(0, y, gfx.width, h);
    gfx.copy(strip, 0, 0, gfx.width, h, xShift, y, gfx.width, h);
  }
}

function corromperSemRetorno(gfx) {
  for (let i = 0; i < 5; i++) {
    let sx = int(random(gfx.width));
    let sy = int(random(gfx.height));
    let sw = int(random(10, 50));
    let sh = int(random(10, 50));
    gfx.copy(gfx, sx, sy, sw, sh, sx + int(random(-30, 30)), sy + int(random(-30, 30)), sw, sh);
  }

  // inverter vertical aleatório
  if (random() < 0.4) {
    gfx.loadPixels();
    for (let y = 0; y < gfx.height / 2; y++) {
      for (let x = 0; x < gfx.width; x++) {
        let i1 = 4 * (y * gfx.width + x);
        let i2 = 4 * ((gfx.height - 1 - y) * gfx.width + x);
        for (let c = 0; c < 4; c++) {
          let temp = gfx.pixels[i1 + c];
          gfx.pixels[i1 + c] = gfx.pixels[i2 + c];
          gfx.pixels[i2 + c] = temp;
        }
      }
    }
    gfx.updatePixels();
  }
}

function desbotarPorIndiferenca(gfx) {
  gfx.loadPixels();
  for (let y = 0; y < gfx.height; y++) {
    for (let x = 0; x < gfx.width; x++) {
      let i = 4 * (y * gfx.width + x);
      let r = gfx.pixels[i];
      let g = gfx.pixels[i + 1];
      let b = gfx.pixels[i + 2];
      let avg = (r + g + b) / 3;

      // Saturação mínima: 15% de cor original
      gfx.pixels[i]     = lerp(avg, r, 0.15);
      gfx.pixels[i + 1] = lerp(avg, g, 0.15);
      gfx.pixels[i + 2] = lerp(avg, b, 0.15);
    }
  }
  gfx.updatePixels();

  // aplicar blur leve 3x
  for (let i = 0; i < 3; i++) {
    gfx.filter(BLUR, 1);
  }
}
