const jogo = {};
const sprites = new Image();
sprites.src = './sprites.png';
const som_punch = new Audio();
som_punch.src = './som.mp3'
let animation_frame = 0;
const canvas = document.querySelector('#game-canvas');
const contexto = canvas.getContext('2d');


function criaFlappyBird() {
    const FlappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 35,
        altura: 25,
        x: 10,
        y: 50,
        pulo: 4.6,
        gravidade: 0.25,
        velocidade: 0,
        frameAtual: 0,
        movimento: [
            { spriteX: 0, spriteY: 0, },
            { spriteX: 0, spriteY: 26, },
            { spriteX: 0, spriteY: 52, },
            { spriteX: 0, spriteY: 26, },
        ],
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
            );
        },
        atualizaFrame() {
            if ((animation_frame % 10) === 0) {
                FlappyBird.frameAtual = FlappyBird.frameAtual + 1
                FlappyBird.frameAtual = FlappyBird.frameAtual % FlappyBird.movimento.length
                FlappyBird.spriteX = FlappyBird.movimento[FlappyBird.frameAtual].spriteX;
                FlappyBird.spriteY = FlappyBird.movimento[FlappyBird.frameAtual].spriteY;
            }
        },
        atualiza() {
            if (fazColisao()) {
                som_punch.play();
                telaAtiva = telaGameOver;
                return;
            }
            FlappyBird.velocidade += FlappyBird.gravidade;
            FlappyBird.y = FlappyBird.y + FlappyBird.velocidade;
            FlappyBird.atualizaFrame();
        }
    }
    return FlappyBird;
}
function criaChao() {
    const Chao = {
        spriteX: 1,
        spriteY: 613,
        largura: 223,
        altura: 109,
        x: 0,
        y: canvas.height - 109,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = Chao.largura / 2;
            const movimentacao = Chao.x - movimentoDoChao;

            Chao.x = movimentacao % repeteEm;
        },

        desenha() {
            contexto.drawImage(
                sprites,
                Chao.spriteX, Chao.spriteY,
                Chao.largura, Chao.altura,
                Chao.x, Chao.y,
                Chao.largura, Chao.altura,
            );
            contexto.drawImage(
                sprites,
                Chao.spriteX, Chao.spriteY,
                Chao.largura, Chao.altura,
                (Chao.x + Chao.largura), Chao.y,
                Chao.largura, Chao.altura,
            )
        },

    }
    return Chao;
}
function criaBackground() {
    const Background = {
        spriteX: 390.5,
        spriteY: 0,
        largura: 275.5,
        altura: 206,
        x: 0,
        y: canvas.height - 227,
        desenha() {
            contexto.drawImage(
                sprites,
                Background.spriteX, Background.spriteY,
                Background.largura, Background.altura,
                Background.x, Background.y,
                Background.largura, Background.altura,
            );
            contexto.drawImage(
                sprites,
                Background.spriteX, Background.spriteY,
                Background.largura, Background.altura,
                Background.x + Background.largura, Background.y,
                Background.largura, Background.altura,
            );
            contexto.drawImage(
                sprites,
                Background.spriteX, Background.spriteY,
                Background.largura, Background.altura,
                Background.x + (Background.largura * 2), Background.y,
                Background.largura, Background.altura,
            );


        },
        atualiza() {
            Background.x = Background.x - 0.5;
            if (Background.x == -Background.largura) {
                Background.x = 0
            }
        }
    }
    return Background;
}
const Start = {
    spriteX: 130,
    spriteY: 0,
    largura: 188,
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
        );
    }
}
function criaCanos() {
    const Canos = {
        largura: 52,
        altura: 400,
        Background: {
            spriteX: 52,
            spriteY: 169,
            x: 200,
            y: -170,
        },
        Chao: {
            spriteX: 0,
            spriteY: 169,
        },
        pares: [],
        espacamentoEntreCanos: 80,
        desenha() {
            const espacamentoEntreCanos = 80;
            for (i = 0; i < Canos.pares.length; i++) {
                Canos.Background.x = Canos.pares[i].x;
                Canos.Background.y = Canos.pares[i].y;
                contexto.drawImage(
                    sprites,
                    Canos.Background.spriteX, Canos.Background.spriteY,
                    Canos.largura, Canos.altura,
                    Canos.Background.x, Canos.Background.y,
                    Canos.largura, Canos.altura,
                )
                const canoChaoX = Canos.Background.x;
                const canoChaoY = Canos.altura + espacamentoEntreCanos + Canos.Background.y
                contexto.drawImage(
                    sprites,
                    Canos.Chao.spriteX, Canos.Chao.spriteY,
                    Canos.largura, Canos.altura,
                    canoChaoX, canoChaoY,
                    Canos.largura, Canos.altura,
                )
            }
        },
        atualiza() {
            Canos.Background.x = Canos.Background.x - 2;
            const passou100Frames = (animation_frame % 100 === 0);
            if (passou100Frames) {
                const novoPar = {
                    x: canvas.clientWidth,
                    y: -150 * (Math.random() + 1)
                }
                Canos.pares.push(novoPar);
            }
            for (i = 0; i < Canos.pares.length; i++) {
                const par = Canos.pares[i];
                par.x = par.x - 2;
                if (par.x + Canos.largura <= 0) {
                    Canos.pares.shift();
                }
                if (fazColisaoObstaculo(par)) {
                    som_punch.play();
                    telaAtiva = telaGameOver;

                }
            } return;
        }
    }
    return Canos;
}
function inicializa() {
    jogo.FlappyBird = criaFlappyBird();
    jogo.Background = criaBackground();
    jogo.Chao = criaChao();
    jogo.Canos = criaCanos();
    jogo.Placar = criaPlacar();
}
function criaPlacar() {
    const Placar = {
        pontos: 0,
        desenha() {
            contexto.font = '25px "VT323"';
            contexto.textAlign = 'left';
            contexto.fillStyle = 'white';
            contexto.fillText('Pontuação: ' + Placar.pontos, 25, 35);
        },
        atualiza() {
            const intervaloDeFrames = 20;
            const passouOIntervalo = animation_frame % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                Placar.pontos = Placar.pontos + 1;
            }
        }
    }
    return Placar;
}
const GameOver = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: 50,
    y: 70,
    desenha() {
        contexto.drawImage(
            sprites,
            GameOver.spriteX, GameOver.spriteY,
            GameOver.largura, GameOver.altura,
            GameOver.x, GameOver.y,
            GameOver.largura, GameOver.altura
        );
        return;
    },
}
const Background = {
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.clientWidth, canvas.height)
    }
}
const ScreenStart = {
    desenha() {
        Background.desenha();
        jogo.Background.desenha();
        jogo.Chao.desenha();
        jogo.FlappyBird.desenha();
        Start.desenha();
    },
    click() {
        telaAtiva = ScreenGame;
    }
}
const ScreenGame = {
    desenha() {
        Background.desenha();
        jogo.Background.desenha();
        jogo.FlappyBird.desenha();
        jogo.FlappyBird.atualiza();
        jogo.Canos.desenha();
        jogo.Canos.atualiza();
        jogo.Chao.desenha();
        jogo.Chao.atualiza();
        jogo.Background.atualiza();
        jogo.Placar.desenha();
        jogo.Placar.atualiza();
    },
    click() {
        jogo.FlappyBird.pula();
    }
}
const telaGameOver = {
    desenha() {
        GameOver.desenha();
    },
    click() {
        inicializa();
        telaAtiva = ScreenGame;
        telaGameOver = ScreenStart;
    }
}

var telaAtiva = ScreenStart
function loop() {
    telaAtiva.desenha();
    requestAnimationFrame(loop);
    animation_frame = animation_frame + 1
}
function mudaTelaAtiva() {
    ScreenStart.click();
    ScreenGame.click();
}
function fazColisao() {
    if (jogo.FlappyBird.y < jogo.Chao.y - 30) {
        return false
    }
    else {
        return true
    }
}
function fazColisaoObstaculo(par) {
    if (jogo.FlappyBird.x + jogo.FlappyBird.largura >= par.x) {
        const alturaCabecaFlappy = jogo.FlappyBird.y;
        const alturaPeFlappy = jogo.FlappyBird.y + jogo.FlappyBird.altura;
        const bocaCanoBackgroundY = par.y + jogo.Canos.altura;
        const bocaCanoChaoY = par.y + jogo.Canos.altura + jogo.Canos.espacamentoEntreCanos;
        if (alturaCabecaFlappy <= bocaCanoBackgroundY) {
            return true
        }
        if (alturaPeFlappy >= bocaCanoChaoY) {
            return true
        }
    }
    return false;
}
window.addEventListener("click", mudaTelaAtiva)
inicializa();
loop();

