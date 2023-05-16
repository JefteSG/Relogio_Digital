const horas = document.getElementById('horas')
const minutos = document.getElementById('minutos')
const segundos = document.getElementById('segundos')
const data = document.getElementById('data')
const local = document.getElementById('local')
const temp = document.getElementById('temperatura')

const relogio = setInterval(function time() {
    let dateToday = new Date()
    let hr = dateToday.getHours()
    let min = dateToday.getMinutes()
    let sec = dateToday.getSeconds()
    let opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
    let dataFormatada = dateToday.toLocaleDateString('pt-BR', opcoes);

    if(hr < 10 ) hr = '0' + hr
    if(min < 10 ) min = '0' + min
    if(sec < 10 ) sec = '0' + sec

    horas.textContent = hr
    minutos.textContent = min
    segundos.textContent = sec
    data.textContent = dataFormatada

    if (hr >= 12 && hr < 18) {
     
        document.body.style.background = "linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)";
      } else if (hr >= 19 && hr < 23) {
        document.body.style.background = "linear-gradient(201deg, rgba(2,0,36,1) 0%, rgba(18,53,87,1) 78%, rgba(7,3,55,1) 100%)";
        
      } 

})


