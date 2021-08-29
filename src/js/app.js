let pagina = 1;

const cita = {
  nombre:'',
  fecha: '',
  hora: '',
  servicios:[]
}


document.addEventListener('DOMContentLoaded', () => {
  iniciarApp();
})

let elemento;

function iniciarApp(){
  mostrarServicios()

  //resalta el div actual segun el tab al que se presiona
   mostrarSeccion()


  //oculta o muestra seccion segun el tab al que se presiona
  cambiarSeccion();

  paginaSiguiente();

  paginaAnterior();

  botonesPaginador();

  mostrarResumen();

  nombreCita();

  fechaCita();

  deshabilitarFechaAnterior();

  horaCita();
}

function mostrarSeccion(){//es el mismo codigo pero hace falta para que arranque en la pagina 1

  const seccionAnterior = document.querySelector('.mostrar-seccion')
  if(seccionAnterior){
    seccionAnterior.classList.remove('mostrar-seccion')
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add('mostrar-seccion');

  //eliminar la clase actual del tab anterior
  const tabAnterior = document.querySelector('.tabs .actual')
  if(tabAnterior){
    tabAnterior.classList.remove('actual')
  }
  //resalta el tab actual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);//esta sintaxis porque es un atributo
  tab.classList.add('actual')
}

function cambiarSeccion(){
  const enlaces = document.querySelectorAll('.tabs button');

  enlaces.forEach( enlace => {
    enlace.addEventListener('click', (e) =>{
      e.preventDefault();
      pagina = parseInt(e.target.dataset.paso);

      mostrarSeccion()

      botonesPaginador()
    })
  })
}

async function mostrarServicios(){
  try {
    const resultado = await fetch('./servicios.json');
    const db = await resultado.json();
    console.log(db);
    const {servicios} = db;

    servicios.forEach(element => {
       const {id, nombre, precio} = element;

       const nombreP = document.createElement('p');
       nombreP.textContent = `${nombre}`;
       nombreP.classList.add('nombre-servicio')

       const precioP = document.createElement('p')
       precioP.textContent = `$ ${precio}`;
       precioP.classList.add('precio-servicio')

       const div = document.createElement('div');
       div.classList.add('servicio')
       div.onclick = seleccionarServicios;


       div.appendChild(nombreP)
       div.appendChild(precioP)
       div.dataset.idServicio = id;
      //  div.setAttribute('data-id', `${id}`)

       document.querySelector('.listado-servicios').appendChild(div);

       console.log(nombreP);


      //  const nombreP = document.createElement('p');

    });
  } catch (error) {
    console.log(error);
  }
}
function seleccionarServicios(e){
  if(e.target.tagName === 'P'){
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }
  if(elemento.classList.contains('seleccionado')){
    elemento.classList.remove('seleccionado');

    const id = parseInt(elemento.dataset.idServicio)

    eliminarServicio(id);
  } else {
    elemento.classList.add('seleccionado');


    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre:elemento.firstElementChild.textContent,
      precio:elemento.firstElementChild.nextElementSibling.textContent
    }
    // console.log(servicioObj);

    agregarServicio(servicioObj);
  }

}

function eliminarServicio(id){
  const { servicios } = cita;
  cita.servicios = servicios.filter( servicio => servicio.id !== id)
  console.log(cita)
}
function agregarServicio(objeto){
  const {servicios} = cita;
     cita.servicios = [...servicios, objeto];
}

function paginaSiguiente(){
  const paginaSiguiente = document.querySelector('#siguiente');
  paginaSiguiente.addEventListener('click', ()=>{
    pagina++;
    console.log(pagina);
    botonesPaginador()

  })
}
function paginaAnterior(){
  const paginaSiguiente = document.querySelector('#anterior');
  paginaSiguiente.addEventListener('click', () => {
    pagina--;
   console.log(pagina);
   botonesPaginador()
  })
}
function botonesPaginador(){
  const paginaSiguiente = document.querySelector('#siguiente');
  const paginaAnterior = document.querySelector('#anterior');

  if(pagina===1){
    paginaAnterior.classList.add('ocultar')
  }  else if(pagina===3) {
    paginaSiguiente.classList.add('ocultar')
    paginaAnterior.classList.remove('ocultar')
    mostrarResumen();
  } else {
    paginaAnterior.classList.remove('ocultar')
    paginaSiguiente.classList.remove('ocultar')
  }
  mostrarSeccion()
}

function mostrarResumen(){
  const { fecha, hora, servicios, nombre } = cita;
  const resumenDiv = document.querySelector('.contenido-resumen');



   while(resumenDiv.firstChild){
     resumenDiv.removeChild(resumenDiv.firstChild);
   }


  if(Object.values(cita).includes('')){//extrae los valores del objeto
    const noServicios = document.createElement('p');
    noServicios.textContent = 'faltan datos de servicio, fecha, hora o nombre ';
    noServicios.classList.add('invalidar-cita');
    resumenDiv.appendChild(noServicios);
    return;
  }
  const headingCita = document.createElement('h3');
  headingCita.textContent = 'Resumen de cita'

  const nombreCita = document.createElement('p');
  nombreCita.innerHTML  = `<span> Nombre: </span> ${nombre}`;

  const horaCita = document.createElement('p');
  horaCita.innerHTML = `<span> Hora: </span> ${hora}`;

  const fechaCita = document.createElement('p');
  fechaCita.innerHTML = `<span> Fecha: </span> ${fecha}`;

  const serviciosCita = document.createElement('div')
  serviciosCita.classList.add('resumen-servicios');

  const headingServicios = document.createElement('h3');
  headingServicios.textContent = 'Resumen de Servicios'

  serviciosCita.appendChild(headingServicios);

  let cantidad = 0;



  servicios.forEach( servicio => {
    const {nombre, precio} = servicio;

    const contenedorServicios = document.createElement('div');
    contenedorServicios.classList.add('contenedor-servicios')

    const textoServicio = document.createElement('p');
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement('p');
    precioServicio.textContent = precio;
    precioServicio.classList.add('precio');

    const totalServicio = precio.split('$');
    cantidad += parseInt(totalServicio[1].trim());

    contenedorServicios.appendChild(textoServicio);
    contenedorServicios.appendChild(precioServicio);

    serviciosCita.appendChild(contenedorServicios);

  });

  console.log(cantidad);

  resumenDiv.appendChild(headingCita)
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(horaCita);
  resumenDiv.appendChild(fechaCita);

  resumenDiv.appendChild(serviciosCita);

  const cantidadPagar = document.createElement('p');
  cantidadPagar.innerHTML=`<span>Total a Pagar: </span> $ ${cantidad}`;

  resumenDiv.appendChild(cantidadPagar);

}

function nombreCita(){
  const nombreInput = document.querySelector('#nombre');

  nombreInput.addEventListener('input', e => {
    const  nombreTexto = e.target.value.trim();
  if(nombreTexto==='' || nombreTexto.length < 3) {
       mostrarALerta('nombre no valido','error');
      console.log('kdhlhslhg');
    } else {
      const alerta = document.querySelector('.alerta');
      if(alerta){
        alerta.remove()
      }
      cita.nombre = nombreTexto;
      // console.log(cita);
    }
  })
}
function mostrarALerta(mensaje, tipo){

  const alertaPrevia = document.querySelector('.alerta');
  if(alertaPrevia){
    return;
  }


  const alerta = document.createElement('div')
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');

  if(tipo === 'error') {
    alerta.classList.add('error')
  }
  const formulario = document.querySelector('.formulario');
  formulario.appendChild( alerta )

  setTimeout(() => {
    alerta.remove()
  }, 3000);
}

function fechaCita(){
  const fechaInput = document.querySelector('#fecha');
  fechaInput.addEventListener('input', e => {

    const dia = new Date(e.target.value).getUTCDay();//retorna el numero del dia del 0(domingo) al 6
    console.log(dia);

    if([0].includes(dia)){
      e.preventDefault();
      fechaInput.value = '';

      mostrarALerta('el domingo no abrimos', 'error');

    } else {
      cita.fecha = fechaInput.value;
    }
  })
}

function deshabilitarFechaAnterior(){
   const inputFecha = document.querySelector('#fecha');

   const fechaAhora = new Date();
   const year = fechaAhora.getFullYear();
   const month = fechaAhora.getMonth() + 1;
   const day = fechaAhora.getDate();

   //formato deseado: AAAA-MM-DD

   const fechaDeshabilitar = `${year}-${month}-${day}`

   console.log(fechaDeshabilitar);
   inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
  const inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', e => {

     const horaCita = e.target.value;
     const hora = horaCita.split(':')

     if(hora[0]<10 || hora[0]>18){
       mostrarALerta('no valida', 'error');

       setTimeout(() => {

         inputHora.value = '';
       }, 2000);
     } else {
       console.log(' valida');
       cita.hora = horaCita;
     }
  });
}