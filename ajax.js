document.querySelectorAll('a').forEach(link => {
    const conteudo = document.getElementById('Conteudo')

    link.onclick = function(e) {
        e.preventDefault()
        fetch(link.href) 
            .then(resp => resp.text())
            .then(html => conteudo.innerHTML = html)
            .then(load_reta => {
                    var c = document.getElementById("myCanvas");
                    var ctx = c.getContext("2d");
                    ctx.lineWidth = 4
                    ctx.strokeStyle = "#ff0000"
                    ctx.moveTo(300, 150);
                    ctx.lineTo(650, 300);
                    ctx.stroke();
                })
    }
})