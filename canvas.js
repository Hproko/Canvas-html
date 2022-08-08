

function load_line () {  
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 200);
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3
    ctx.stroke();
}


