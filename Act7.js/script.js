let previous = document.querySelector('#pre');
        let play = document.querySelector('#play');
        let next = document.querySelector('#next');
        let title = document.querySelector('#title');
        let slider = document.querySelector('#duration_slider');
        let playIcon = document.querySelector('#playIcon');
        let albumCover = document.querySelector('#albumCover');

        let timer;
        let index_no = 0;
        let Playing_song = false;

        let track = document.createElement('audio');
        track.volume = 0.5;

        let audioContext = null;
        let analyser = null;
        let audioSource = null;
        let animationFrameId = null;
        const NBR_OF_BARS = 66;

       let All_song = [
  {
    name: "THE FATE OF OPHELIA",
    path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    image: "https://images.genius.com/8050faa3ef7f41398e421073bf30511b.1000x1000x1.png",
    color: "linear-gradient(135deg, #6DC36D 0%, #334155 100%)",
    barColor: "#02AC66"
  },
  {
    name: "6 DE FEBRERO",
    path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    image: "https://mrevistademilenio.com/wp-content/uploads/2025/06/Apertura.jpg-1.webp",
    color: "linear-gradient(135deg, #000066 0%, #003399 100%)",
    barColor: "#003399"
  },
  {
    name: "EYES CLOSED",
    path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    image: "https://i.scdn.co/image/ab67616d00001e028af5b74e90634123d95fe5fa",
    color: "linear-gradient(135deg, #333333 0%, #666666 100%)",
    barColor: "#666666"
  },
   {
    name: "GRAN VIA",
    path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    image: "https://i.scdn.co/image/ab67616d0000b2734b690afba75a356fcdad526e",
    color: "linear-gradient(135deg, #FF9966 0%, #FFCC99 100%)",
    barColor: "#FFCC99"
  },
   {
    name: "RAPIDO",
    path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    image: "https://i1.sndcdn.com/artworks-EKLP1IvbcPSH-0-t500x500.jpg",
    color: "linear-gradient(135deg, #024A86 0%, #312e81 100%)",
    barColor: "#000099"
  },
   {
    name: "SILENCIO",
    path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    image: "https://images.genius.com/ca04ef0dfa11617aed2b1e2415c54979.868x868x1.png",
    color: "linear-gradient(135deg, #996633 0%, #663300 100%)",
    barColor: "#663300"
  }
];


        function load_track(index_no) {
            clearInterval(timer);
            reset_slider();

            track.src = All_song[index_no].path;
            title.textContent = All_song[index_no].name;
            track.load();

            timer = setInterval(range_slider, 100);

            // Cambiar fondo
            document.body.style.background = All_song[index_no].color;
            
            // Cambiar imagen del álbum
            albumCover.src = All_song[index_no].image;
            albumCover.alt = All_song[index_no].name;
            
            // Actualizar colores de las barras
            updateBarsColor();
        }

        function justplay() {
            if (!Playing_song) {
                playsong();
            } else {
                pausesong();
            }
        }

        function reset_slider() {
            slider.value = 0;
        }

        function playsong() {
            track.play();
            Playing_song = true;
            playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
            
            // Inicializar visualizador
            if (!audioContext) {
                initializeVisualizer();
            }
        }

        function pausesong() {
            track.pause();
            Playing_song = false;
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        }

        function next_song() {
            if (index_no < All_song.length - 1) {
                index_no += 1;
            } else {
                index_no = 0;
            }
            
            load_track(index_no);
            playsong();
        }

        function previous_song() {
            if (index_no > 0) {
                index_no -= 1;
            } else {
                index_no = All_song.length - 1;
            }
            
            load_track(index_no);
            playsong();
        }

        function change_duration() {
            let slider_position = track.duration * (slider.value / 100);
            track.currentTime = slider_position;
        }

        function range_slider() {
            let position = 0;
            
            if (!isNaN(track.duration)) {
                position = track.currentTime * (100 / track.duration);
                slider.value = position;
            }

            if (track.ended) {
                next_song();
            }
        }

        function initializeVisualizer() {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            audioSource = audioContext.createMediaElementSource(track);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);

            const visualizerContainer = document.querySelector(".visualizer-container");
            visualizerContainer.innerHTML = '';
            
            for (let i = 0; i < NBR_OF_BARS; i++) {
                let bar = document.createElement("div");
                bar.setAttribute("id", "bar" + i);
                bar.className = "container_bar";
                bar.style.background = All_song[index_no].barColor;
                visualizerContainer.appendChild(bar);
            }

            renderFrame();
        }

        function renderFrame() {
            const frequencyData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(frequencyData);

            for (let i = 0; i < NBR_OF_BARS; i++) {
                const index = Math.floor((i / NBR_OF_BARS) * frequencyData.length);
                const fd = frequencyData[index];
                const bar = document.querySelector("#bar" + i);
                
                if (bar) {
                    const barHeight = Math.max(4, (fd / 255) * 150);
                    bar.style.height = barHeight + "px";
                }
            }

            animationFrameId = requestAnimationFrame(renderFrame);
        }

        function updateBarsColor() {
            for (let i = 0; i < NBR_OF_BARS; i++) {
                const bar = document.querySelector("#bar" + i);
                if (bar) {
                    bar.style.background = All_song[index_no].barColor;
                }
            }
        }

        // Cargar primera canción
        load_track(index_no);

        // Atajos de teclado
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                justplay();
            } else if (e.code === 'ArrowRight') {
                next_song();
            } else if (e.code === 'ArrowLeft') {
                previous_song();
            }
        });