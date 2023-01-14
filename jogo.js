const sprites = new Image();
sprites.src = 'sprites.png';
const som_punch = new Audio();
som_punch.src = './som.mp3'

const canvas = document.querySelector('#game-canvas');
const contexto = canvas.getContext('2d');

const FlappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 35,
    altura: 25,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    pula() {
        FlappyBird.velocidade = -FlappyBird.pulo;
    },
    desenha() {
        contexto.drawImage(
            sprites,
            FlappyBird.spriteX, FlappyBird.spriteY,
            FlappyBird.largura, FlappyBird.altura,
            FlappyBird.x, FlappyBird.y,
            FlappyBird.largura, FlappyBird.altura,
        )
    },
    atualiza() {
        if (fazColisao(FlappyBird, Chao)) {
            som_punch.play();
            telaAtiva = ScreenStart;

            return;

        }
        FlappyBird.velocidade += FlappyBird.gravidade;
        FlappyBird.y = FlappyBird.y + FlappyBird.velocidade;
    },

}
function fazColisao() {
    const FlappyBirdY = FlappyBird.y + FlappyBird.altura;
    const ChaoY = Chao.y;

    if (FlappyBirdY >= ChaoY) {
        return true;
    }
    return false;
}
const Chao = {
    spriteX: 1,
    spriteY: 611,
    largura: 169,
    altura: 109,
    x: 0,
    y: canvas.height - 109,
    desenha() {
        contexto.drawImage(
            sprites,
            Chao.spriteX, Chao.spriteY,
            Chao.largura, Chao.altura,
            Chao.x, Chao.y,
            Chao.largura, Chao.altura,
        )

        contexto.drawImage(
            sprites,
            Chao.spriteX, Chao.spriteY,
            Chao.largura, Chao.altura,
            (Chao.x + Chao.largura), Chao.y,
            Chao.largura, Chao.altura,
        )
    }
}
const Background = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 206,
    x: 0,
    y: canvas.height - 227,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            Background.spriteX, Background.spriteY,
            Background.largura, Background.altura,
            Background.x, Background.y,
            Background.largura, Background.altura,
        )
        contexto.drawImage(
            sprites,
            Background.spriteX, Background.spriteY,
            Background.largura, Background.altura,
            (Background.x + Background.largura), Background.y,
            Background.largura, Background.altura,
        )

    }
}
const Start = {
    spriteX: 130,
    spriteY: 0,
    largura: 180,
    altura: 152,
    x: 70,
    y: 70,
    desenha() {
        contexto.drawImage(
            sprites,
            Start.spriteX, Start.spriteY,
            Start.largura, Start.altura,
            Start.x, Start.y,
            Start.largura, Start.altura,
        )
    }
}
const ScreenStart = {
    desenha() {
        Background.desenha();
        Chao.desenha();
        FlappyBird.desenha();
        Start.desenha();
    },
    click() {
        telaAtiva = ScreenGame;
        FlappyBird.pula();
    }
}
const ScreenGame = {
    desenha() {
        Background.desenha();
        Chao.desenha();
        FlappyBird.desenha();
        FlappyBird.atualiza();
    },
    click() {
        FlappyBird.pula();
    }
}

var telaAtiva = ScreenStart;

function loop() {

    telaAtiva.desenha();
    requestAnimationFrame(loop);
}
function mudaTelaAtiva() {
    ScreenStart.click();
}
window.addEventListener("click", mudaTelaAtiva);

loop();