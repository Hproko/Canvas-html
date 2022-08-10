//Script de manipulacao do canvas html5
//Feito por: Henrique Prokopenko
//Data: 08/08/22
//Disciplina de programacao web


//Definica de constantes
//----------------------------------------------------
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext('2d')

let holding_line = 0
let left = 0
let right = 0
let middle = 0
let reta_travada


//Definicao das classes
//-----------------------------------------------------
class reta {
    constructor (xi, yi, xf, yf) {
        this.xi = xi
        this.yi = yi
        this.xf = xf
        this.yf = yf
    }

    mod_ponta_esq (xi, yi) {
        this.xi = xi
        this.yi = yi
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

}


//Declaracao de funcoes 
//----------------------------------------------------
function init_canvas (){
    canvas.width = window.innerWidth / 1.5
    canvas.height = window.innerHeight / 1.5
}

function load_line () { 
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(500, 200)
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 3
    ctx.stroke()
}

function draw_line (xi, yi, xf, yf){
    ctx.beginPath()
    ctx.moveTo(xi, yi)
    ctx.lineTo(xf, yf)
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 3
    ctx.stroke()
}



function update_canvas () {
    
    ctx.clearRect (0, 0, canvas.width, canvas.height) 

    for (var i = 0; i < vetor_retas.length; i++){
        draw_line(vetor_retas[i].xi, vetor_retas[i].yi, vetor_retas[i].xf, vetor_retas[i].yf)
    }

}

const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    }
}

function is_on_any_line (x, y) {
    

    for (var i = 0; i < vetor_retas.length; i++){
        

        if ((x >= vetor_retas[i].getMiddle().x - 20 && x <= vetor_retas[i].getMiddle().x + 20) &&
            (y >= vetor_retas[i].getMiddle().y - 20 && y <= vetor_retas[i].getMiddle().y + 20)){
                console.log("middle")
                holding_line = 1
                reta_travada = i
                middle = 1
                break
        }

        if ((x >= vetor_retas[i].xi - 10 && x <= vetor_retas[i].xi + 10) && 
            (y >= vetor_retas[i].yi - 10 && y <= vetor_retas[i].yi + 10)){
                holding_line = 1
                reta_travada = i
                left = 1
                break
        }
    }
}


//Setando event listeners 
document.addEventListener("click", function (e) {
    let mousePos = getMousePos(canvas, e)


    if (mousePos.x >= 0 && mousePos.x <= canvas.width && mousePos.y >= 0 &&  mousePos.y <= canvas.height) {
        if (holding_line == 0)
            is_on_any_line(mousePos.x, mousePos.y)
        else {
            if (left == 1) {
                left = 0
                reta_travada = -2
            }

            if (middle == 1) {
                middle = 0
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
        update_canvas()
    }

})



document.addEventListener("contextmenu", 
function(e) 
{
    e.preventDefault();

}, false);
    



//Execucao principal do script
//---------------------Inicio----------------------
init_canvas()
load_line()

let vetor_retas = []
vetor_retas.push(new reta (0, 0, 500, 200))




    






