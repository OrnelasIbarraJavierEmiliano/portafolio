let trabajosPendientes = [];
    let trabajosPublicados = [];

    // Registrar un trabajo (pendiente de aprobación)
    function registrarTrabajo(){
        let titulo = document.getElementById("titulo").value;
        let descripcion = document.getElementById("descripcion").value;
        let correo = document.getElementById("correoCreador").value;

        if(!titulo || !descripcion || !correo){
            alert("Por favor completa todos los campos.");
            return;
        }

        let trabajo = {
            id: Date.now(),
            titulo,
            descripcion,
            creador: correo,
            candidatos: []
        };

        trabajosPendientes.push(trabajo);
        mostrarPendientes();
        alert("Trabajo registrado. Esperando aprobación del administrador.");
    }

    // Mostrar trabajos pendientes en el panel del admin
    function mostrarPendientes(){
        let cont = document.getElementById("admin-list");
        cont.innerHTML = "";

        trabajosPendientes.forEach(t => {
            cont.innerHTML += `
                <div class="job">
                    <strong>${t.titulo}</strong><br>
                    ${t.descripcion}<br><br>
                    <button onclick="aprobarTrabajo(${t.id})">Aprobar</button>
                </div>
            `;
        });
    }

    // Aprobar el trabajo
    function aprobarTrabajo(id){
        let trabajo = trabajosPendientes.find(t=>t.id===id);

        trabajosPublicados.push(trabajo);
        trabajosPendientes = trabajosPendientes.filter(t=>t.id!==id);

        mostrarPendientes();
        mostrarTrabajos();

        notificar(`El administrador aceptó tu trabajo: ${trabajo.titulo}`, trabajo.creador);
    }

    // Mostrar trabajos publicados
    function mostrarTrabajos(){
        let cont = document.getElementById("trabajos-list");
        cont.innerHTML = "";

        trabajosPublicados.forEach(t => {
            cont.innerHTML += `
                <div class="job">
                    <strong>${t.titulo}</strong><br>
                    ${t.descripcion}<br><br>
                    <input type="email" id="post-${t.id}" placeholder="Tu correo">
                    <button onclick="postular(${t.id})">Postularme</button>
                </div>
            `;
        });
    }

    // Postularse
    function postular(id){
        let trabajo = trabajosPublicados.find(t=>t.id===id);
        let correo = document.getElementById(`post-${id}`).value;

        if(!correo){
            alert("Ingresa tu correo para postularte.");
            return;
        }

        trabajo.candidatos.push({correo, estado: "pendiente"});

        notificar(`Un candidato se postuló a tu trabajo: ${trabajo.titulo}`, trabajo.creador);

        alert("Postulación enviada correctamente.");
    }

    // Simulación de notificaciones
    function notificar(mensaje, correo){
        let div = document.getElementById("notificaciones");
        div.innerHTML += `
            <div class="notification">
                <strong>Para:</strong> ${correo}<br>
                ${mensaje}
            </div>
        `;
    }