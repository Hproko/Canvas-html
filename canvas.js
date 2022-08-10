//Script de manipulacao do canvas html5
//Feito por: Henrique Prokopenko
//Data: 08/08/22
//Disciplina de programacao web


//Definica de constantes
//----------------------------------------------------
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext('2d')
const poli = document.getElementById("poli")
const clear = document.getElementById("limpa")
const new_reta = document.getElementById("new_color")

let holding_line = 0
let left = 0
let right = 0
let middle = 0
let reta_travada
let cor_atual = 'black'

//Definicao das classes
//-----------------------------------------------------
class Reta {
    constructor (xi, yi, xf, yf, cor_atual) {
        this.xi = xi
        this.yi = yi
        this.xf = xf
        this.yf = yf
        this.cor = cor_atual
    }

    mod_ponta_esq (xi, yi) {
        this.xi = xi
        this.yi = yi
    }

    mod_ponta_dir (xf, yf) {
        this.xf = xf
        this.yf = yf
    }

    mod_all (distX, distY) {

        if (((this.xi + distX <= canvas.width && this.xi + distX >= 0) && (this.xf + distX <= canvas.width && this.xf  + distX >= 0)) &&
           ((this.yi + distY <= canvas.height && this.yi + distY >= 0) && (this.yf + distY <= canvas.height && this.yf + distY >= 0))){
               this.xi += distX
               this.yi += distY
               this.xf += distX
               this.yf += distY
               
        }
    }

    getMiddle () {
        return {
            x : Math.abs((this.xf + this.xi)/2),
            y : Math.abs((this.yf + this.yi)/2)
        }
    }

    getEquation() {

        let a = (this.yf - this.yi)/(this.xf - this.yi)
        let b = (this.yf - a * this.xf)
        return {a , b}
    }
}


//Declaracao de funcoes 
//----------------------------------------------------
function init_canvas (){
    canvas.width = window.innerWidth / 1.3
    canvas.height = window.innerHeight / 1.3
}


function draw_line (xi, yi, xf, yf, cor){
    ctx.beginPath()
    ctx.moveTo(xi, yi)
    ctx.lineTo(xf, yf)
    ctx.strokeStyle = cor
    ctx.lineWidth = 3
    ctx.stroke()
}

function pointIsOnLine(m, c, x, y)
{
     let Epsilon = 20
    // SE (x, y) estiver na reta
    // vai satistazer a equacao
    if ((y >= ((m * x) + c) - Epsilon) && (y <= ((m * x) + c) + Epsilon))
        return true;
 
    return false;
}


function update_canvas () {
    
    ctx.clearRect (0, 0, canvas.width, canvas.height) 

    for (var i = 0; i < vetor_retas.length; i++){
        draw_line(vetor_retas[i].xi, vetor_retas[i].yi, vetor_retas[i].xf, vetor_retas[i].yf, vetor_retas[i].cor)
    }

}

const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    }
}

function gruda_mouse (x, y) {
    

    for (var i = 0; i < vetor_retas.length; i++){
        

        if ((x >= vetor_retas[i].xi - 10 && x <= vetor_retas[i].xi + 10) && 
            (y >= vetor_retas[i].yi - 10 && y <= vetor_retas[i].yi + 10)){
                holding_line = 1
                reta_travada = i
                left = 1
                break
        }
        
        if ((x >= vetor_retas[i].xf - 10 && x <= vetor_retas[i].xf + 10) && 
            (y >= vetor_retas[i].yf - 10 && y <= vetor_retas[i].yf + 10)){
        
                holding_line = 1
                reta_travada = i
                right = 1
                break
        }

        if ((x >= vetor_retas[i].getMiddle().x - 20 && x <= vetor_retas[i].getMiddle().x + 20) &&
            (y >= vetor_retas[i].getMiddle().y - 20 && y <= vetor_retas[i].getMiddle().y + 20)){
                holding_line = 1
                reta_travada = i
                middle = 1
                break
        }


    }
}

function isOnLine (xp, yp, x1, y1, x2, y2, maxDistance) {
    var dxL = x2 - x1, dyL = y2 - y1;  // line: vector from (x1,y1) to (x2,y2)
    var dxP = xp - x1, dyP = yp - y1;  // point: vector from (x1,y1) to (xp,yp)

    var squareLen = dxL * dxL + dyL * dyL;  // squared length of line
    var dotProd   = dxP * dxL + dyP * dyL;  // squared distance of point from (x1,y1) along line
    var crossProd = dyP * dxL - dxP * dyL;  // area of parallelogram defined by line and point

    // perpendicular distance of point from line
    var distance = Math.abs(crossProd) / Math.sqrt(squareLen);

    return (distance <= maxDistance && dotProd >= 0 && dotProd <= squareLen);
}

function is_on_any_line (x, y) {

    for (var i = 0; i < vetor_retas.length; i++) {

        let Equacao = vetor_retas[i].getEquation()

        if (isOnLine(x, y, vetor_retas[i].xi, vetor_retas[i].yi, vetor_retas[i].xf, vetor_retas[i].yf, 15)){

            vetor_retas.push(new Reta (x, y, vetor_retas[i].xf, vetor_retas[i].yf, vetor_retas[i].cor))
            vetor_retas.push(new Reta (vetor_retas[i].xi, vetor_retas[i].yi, x, y, vetor_retas[i].cor))
            vetor_retas.splice(i, 1)
            break

        }
    }
}

function cria_poligono (num_sides) {

    let lado = (2 * Math.PI)/num_sides
    let xi = canvas.width/2 + 200
    let yi = canvas.height/2
    let cor = document.getElementById("cor_poli").value

    for (var i = 0; i < num_sides; i++ ) {
        
        let angulo = lado  * (i+1)

        let xf = 200 * Math.cos(angulo) + canvas.width/2
        let yf = 200 * Math.sin(angulo) + canvas.height/2

        vetor_retas.push(new Reta (xi, yi ,xf, yf, cor))

        xi = xf
        yi = yf
    }
    
}


//Setando event listeners 
document.addEventListener("click", function (e) {
    
    let mousePos = getMousePos(canvas, e)

    if (mousePos.x >= 0 && mousePos.x <= canvas.width && mousePos.y >= 0 &&  mousePos.y <= canvas.height) {
        if (holding_line == 0)
            gruda_mouse(mousePos.x, mousePos.y)
        else {
            if (left == 1) {
                left = 0
                reta_travada = -2
            }

            if (middle == 1) {
                middle = 0
                reta_travada = -2
            }

            if (right == 1){
                right = 0
                reta_travada = -2
            }

            holding_line = 0
        }
            
    }

})

document.addEventListener("mousemove", function (e){
    
    let mousePos = getMousePos(canvas, e)

    if (holding_line == 1){    

        if (left == 1){
            
            vetor_retas[reta_travada].mod_ponta_esq(mousePos.x, mousePos.y)
        }

        if (middle == 1) {
            let distX = mousePos.x - vetor_retas[reta_travada].getMiddle().x
            let distY = mousePos.y - vetor_retas[reta_travada].getMiddle().y
            vetor_retas[reta_travada].mod_all(distX, distY)
        }

        if (right == 1) {
            vetor_retas[reta_travada].mod_ponta_dir(mousePos.x, mousePos.y)
        }
        update_canvas()
    }

})

limpa.addEventListener("click", () => {
    vetor_retas = []
    update_canvas()
})

poli.addEventListener("click", function (e) {
    let value = document.getElementById("value").value
    
    if (value < 3 || value > 8){
        alert("Numero de lados do poligono invalido")
        return
    }

    cria_poligono(value)

    update_canvas()
})

document.addEventListener("contextmenu", 
function (e)  
{
    e.preventDefault();
    let mousePos = getMousePos(canvas, e)

    is_on_any_line(mousePos.x, mousePos.y)
}, false);
    
new_reta.addEventListener("click", () => {
    cor_atual = document.getElementById("cor_reta").value
    vetor_retas.push(new Reta (0, 0, canvas.width/2, canvas.height/2, cor_atual))
    update_canvas()
})


//Execucao principal do script
//---------------------Inicio----------------------
init_canvas()

let vetor_retas = []

vetor_retas.push(new Reta (0, 0, canvas.width/2, canvas.height/2, cor_atual))

update_canvas()





    






