const horas = document.getElementById('horas');
const minutos = document.getElementById('minutos');
const segundos = document.getElementById('segundos');
const data = document.getElementById('data');
const localSpan = document.getElementById('local');
const temp = document.getElementById('temperatura');

// ⏰ Atualiza o relógio a cada segundo
setInterval(function time() {
    const dateToday = new Date();
    let hr = dateToday.getHours();
    let min = dateToday.getMinutes();
    let sec = dateToday.getSeconds();
    
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = dateToday.toLocaleDateString('pt-BR', opcoes);

    if (hr < 10) hr = '0' + hr;
    if (min < 10) min = '0' + min;
    if (sec < 10) sec = '0' + sec;

    horas.textContent = hr;
    minutos.textContent = min;
    segundos.textContent = sec;
    data.textContent = dataFormatada;

    const image_background = document.querySelector('.image-background');

    if (hr >= 6 && hr < 12) {
        document.body.style.background = "linear-gradient(90deg, #fddb92 0%, #d1fdff 100%)";
        image_background.src = "assets/css/image/floresta_manha.png";
    } else if (hr >= 12 && hr < 18) {
        document.body.style.background = "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)";
        image_background.src = "assets/css/image/floresta_tarde.png";
    } else {
        document.body.style.background = "linear-gradient(201deg, rgba(2,0,36,1) 0%, rgba(18,53,87,1) 78%, rgba(7,3,55,1) 100%)";
        image_background.src = "assets/css/image/floresta_noite.png";
    }
}, 1000);

// 📍 Atualiza o texto de localização
function setLocal(cidade, estado) {
    localSpan.textContent = `${cidade}, ${estado}`;
}

// 🌡 Atualiza temperatura com base na latitude e longitude
async function setTemperatura(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&timezone=auto`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.current_weather && data.current_weather.temperature !== undefined) {
            const temperatura = Math.round(data.current_weather.temperature);
            temp.textContent = temperatura + "°C";
        } else {
            throw new Error("Dados de temperatura não encontrados.");
        }
    } catch (err) {
        console.error("Erro ao obter temperatura:", err);
        temp.textContent = "--";
    }
}


// 📡 Obtém localização via navegador
function obterLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
                const data = await response.json();
                const cidade = data.address.city || data.address.town || data.address.village || "Cidade desconhecida";
                const estado = data.address.state || data.address.region || "";

                setLocal(cidade, estado);
                setTemperatura(lat, lon);
            } catch (err) {
                console.warn("Erro na API do Nominatim:", err);
                fallbackIP();
            }
        }, function(error) {
            console.warn("Permissão negada ou erro de geolocalização:", error);
            fallbackIP();
        });
    } else {
        console.warn("Geolocalização não suportada.");
        fallbackIP();
    }
}

// 🌐 Fallback usando IP
function fallbackIP() {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const cidade = data.city || "Cidade";
            const estado = data.region_code || "Estado";
            const lat = data.latitude;
            const lon = data.longitude;

            setLocal(cidade, estado);
            setTemperatura(lat, lon);
        })
        .catch(() => {
            localSpan.textContent = "Localização não disponível";
            temp.textContent = "--";
        });
}

obterLocalizacao();
