var xhttp = new XMLHttpRequest();

var url = "https://rawgit.com/MariaAdrover/LM_PRACTICA5/master/xml/formulari.xml";
var urlJavi = 'https://rawgit.com/shamshir/Prueba/master/questions.xml';
var urlInstrucciones = 'file:///C:/Users/miaad/Desktop/LM_PRACTICA5/formulari.html';
var urlTest = 'file:///C:/Users/miaad/Desktop/LM_PRACTICA5/formulari.html';

var xmlDoc = null;
var preguntaXML;
var preguntaHTML;
var tipoInput;
var formElement = null;

var min = 3;
var seg = 0;
var crono;
var finTiempo = false;

// Repuestas correctas para cada pregunta
var ok0 = [];
var ok1 = [];
var ok2 = [];
var ok3 = [];
var ok4 = [];
var ok5 = [];
var ok6 = [];
var ok7 = [];
var ok8 = [];
var ok9 = [];
var largo;

var nota = 0;
var notaReal;


window.onload = function(){
	
	preguntaHTML = document.getElementsByClassName('pregunta');	
	formElement = document.getElementById('formulario');
	
    // Carga el XML y rellena el HTML 
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			gestionarXml(this);
		}
	};

	xhttp.open("GET", url, true); //localhost no ha de funcionar
	xhttp.send();
	
	// Inicio el cronómetro	
	crono = setInterval(actualizarCrono, 1000);
	
	// Avisos al pulsar en los enlaces de la barra de navegación
	document.getElementById('instrucciones').onclick = function() {
		return confirm('¿Seguro que quieres dejar el test?');
	}
	
	document.getElementById('test').onclick = function() {
		return confirm('¿Seguro que quieres reiniciar el test?');
	}
	
	// Al enviar el formulario Comprobar, Corregir y mostrar la nota y las correcciones
	formElement.onsubmit = function() {
		
		if (comprobar()){
			alert("test comprobado");// ***********************QUITAR**************^***************
			clearInterval(crono);
			corregir();
			alert("test corregido");// ***********************QUITAR**************^***************
			presentarNota();
		}
		
		return false;
	}
}

// ************************************************************************
// **********************  Definición de funciones  ***********************
// ************************************************************************



// ************* Recoger datos del XML ******************

// ****************  preparar HTML **********************

function gestionarXml(dadesXml){
	var xmlDoc = dadesXml.responseXML;	
	preguntaXML = xmlDoc.getElementsByTagName("question");
	var tituloHTML = document.getElementsByClassName("title");
	var tituloXML = xmlDoc.getElementsByTagName("title");	
	var i;
	var j;
	var numOpciones;
	var numRespuestas;	
		
	for (i = 0; i < preguntaXML.length; i++) {
		tituloHTML[i].innerHTML = tituloXML[i].innerHTML;
		numOpciones = preguntaXML[i].getElementsByTagName('option').length;
		numRespuestas = preguntaXML[i].getElementsByTagName('answer').length;
		
		// Cuando la pregunta es un SELECT o SELECT MULTIPLE
		if (xmlDoc.getElementsByTagName('type')[i].innerHTML == 'select' || xmlDoc.getElementsByTagName('type')[i].innerHTML == 'multiple'){						
			var optionXML = [];
			
			optionXML = leerOptions (numOpciones, i);
			llenarSelect (optionXML, i);
		}
		
		// Cuando la pregunta es type CHECKBOX
		if (xmlDoc.getElementsByTagName('type')[i].innerHTML == 'checkbox') {			
			var optionXML = [];
			
			optionXML = leerOptions (numOpciones, i);
			llenarCheckbox (optionXML, i);
		}
		
		if (xmlDoc.getElementsByTagName('type')[i].innerHTML == 'radio') {
			var optionXML = [];
			
			optionXML = leerOptions (numOpciones, i);
			llenarRadio (optionXML, i);
		}
		
		// Almacena las respuestas correctas para cada pregunta en el array: ok[posicionArrayPreguntas]
		for (j = 0; j < numRespuestas; j++) {
			window['ok' + i][j] = preguntaXML[i].getElementsByTagName('answer')[j].innerHTML;
			
		}
		
	}

}

// Devuelve un array con el contenido de las options del XML
function leerOptions (numOpciones, i) {
	var optionXML = [];
	
	for (j=0; j<numOpciones; j++) { 
		optionXML[j] =  preguntaXML[i].getElementsByTagName("option")[j].innerHTML;
	}
	
	return optionXML;	
}


// Crea los input CHECKBOX en el HTML con los datos del XML
function llenarCheckbox (optionXML, pos) {

	for (i = 0; i < optionXML.length; i++) {
		var input = document.createElement("input");
		var label = document.createElement("label");

		label.innerHTML = optionXML[i];
		label.setAttribute("for", "p" + pos + "_" + i);
		input.type = "checkbox";
		input.value = i + 1; // No necesito poner el valor. QUITAR
		input.name = "p" + pos;
		input.id = "p" + pos + "_" + i;
		
		preguntaHTML[pos].appendChild(input);
		preguntaHTML[pos].appendChild(label);
		preguntaHTML[pos].appendChild(document.createElement("br"));
	}	
}


// Crea los input RADIO en el HTML con los datos del XML
function llenarRadio (optionXML, pos) {
	
	for (i = 0; i < optionXML.length; i++) {
		var input = document.createElement ('input');
		var label = document.createElement ('label');
		
		label.innerHTML = optionXML [i];
		label.setAttribute('for', "p" + pos + "_" + i);
		input.type = 'radio';
		input.value = i + 1; // No necesito poner el valor. QUITAR
		input.name = 'p' + pos;
		input.id = "p" + pos + "_" + i;
		
		preguntaHTML[pos].appendChild(input);
		preguntaHTML[pos].appendChild(label);		
		preguntaHTML[pos].appendChild(document.createElement("br"));
	}
	
}


// Crea los elementos OPTION en SELECT y SELECT MULTIPLE del HTML con los datos del XML
function llenarSelect (optionXML, pos) {
	var select = preguntaHTML[pos].getElementsByTagName('select')[0];
	
	for (i = 0; i < optionXML.length; i++) {
		var option = document.createElement("option");
		option.text = optionXML[i];		
		// option.innerHTML = optionXML[i]; Es lo mismo...
		
		option.value = i + 1;
		select.options.add(option);		
	}
}


// ********************* Empezar el TEST ******************************************************

// Inicia la cuenta atrás
function actualizarCrono() {
	var i;
	
	if (min >= 0 && seg > 0) {
		seg--;
		if (seg > 9) {
			document.getElementById('cronoN').innerHTML = min + ':' + seg;
		} else {		
			document.getElementById('cronoN').innerHTML = min + ':0' + seg;			
		}
	} else if (min > 0 && seg == 0) {
		min--;
		seg = 59;
		document.getElementById('cronoN').innerHTML = min + ':' + seg;		
	} else if  (min == 0 && seg == 0) {
		clearInterval(crono);
		alert("Lo sentimos, se acabó el tiempo, ¡has sido muy lent@!");
		presentarNota();
	}
}


// *********************** ON SUBMIT **********************************************************

// Comprobar que se han contestado todas las preguntas
function comprobar() {
	var i;
	var j;
    var f=formElement;
    var contestado;
	alert("funcion COMPROBAR"); // ******************************************QUITAR****************************
   
	for (i = 0; i < preguntaHTML.length; i++) {
		
		if (i==0 || i==1) { // Comprueba text
			
			if (preguntaHTML[i].getElementsByTagName('input')[0].value == "") {
				alert("Has de contestar todas las preguntas. Por favor, contesta la pregunta " + (i+1));
				preguntaHTML[i].getElementsByTagName('input')[0].focus();
				
				return false;
			}
			
		} else if (i==2 || i==3) {  // Comprueba select
			if (preguntaHTML[i].getElementsByTagName('select')[0].selectedIndex == 0) {
				alert("Has de contestar todas las preguntas. Por favor, contesta la pregunta " + (i+1));
				preguntaHTML[i].getElementsByTagName('select')[0].focus();
				
				return false;
			}
			
		} else if (i==4 || i==5) {  // Comprueba multiple
			contestado = false;
			var sel = preguntaHTML[i].getElementsByTagName('select')[0]; 
			
			for (j = 0; j < sel.length; j++) {
				if (sel.options[j].selected) {
					contestado = true;
				}
			}

			if (!contestado) {
				alert("Has de contestar todas las preguntas. Por favor, contesta la pregunta " + (i+1));
				sel.focus();
				
				return false;				
			}
			
		} else if (i==6 || i==7) {  // Comprueba checkbox
			contestado = false;
			var che = preguntaHTML[i].getElementsByTagName('input'); 
			
			for (j = 0; j < che.length; j++) {
				if (che[j].checked) {
					contestado = true;
				}
			}

			if (!contestado) {
				alert("Has de contestar todas las preguntas. Por favor, contesta la pregunta " + (i+1));
				che[0].focus();
				
				return false;				
			}		
			
		} else {  // Comprueba radio
			contestado = false;
			var che = preguntaHTML[i].getElementsByTagName('input');
			
			for (j = 0; j < che.length; j++) {
				if (che[j].checked) {
					contestado = true;
				}
			}
			
			if (!contestado) {
				alert("Has de contestar todas las preguntas. Por favor, contesta la pregunta " + (i+1));
				che[0].focus();
				
				return false;				
			}
			
		}
		
	}
	
	return true;
}

// *************************************************************************************************************

// Corregir las preguntas
// Cada función corrige un tipo de pregunta y pone en la hoja de resultados:
// 1. Si la respuesta es CORRECTA o INCORRECTA
// 2. La puntuación conseguida en cada pregunta
// 3. Las respuestas correctas en el caso de que las respuestas seleccionadas no fueran correctas

function corregir() {
	alert("funcion CORREGIR"); // ******************************************QUITAR****************************
	
	for (i = 0; i < preguntaHTML.length; i++) {
		
		if (i==0 || i==1) {			
			corregirText(i);			
		} else if (i==2 || i==3) {			
			corregirSelect(i);			
		} else if (i==4 || i==5) {			
			corregirMultiple(i);			
		} else if (i==6 || i==7) {			
			corregirCheckbox(i);			
		} else {			
			corregirRadio(i);			
		}
	}	
}

// Respuesta correcta:
// Respuesta incorrecta:
function corregirText(i) {
	alert("funcion CORREGIRtext"); // ******************************************QUITAR****************************
	var valor = preguntaHTML[i].getElementsByTagName('input')[0].value;
	
	if (valor.toUpperCase() == (window['ok' + i][0].toUpperCase())) {
		nota++;
		var z = true;
		ponerBold("P " + (i+1), z);
		darExplicacion("CORRECTA. Puntuación: 1");
	} else {
		nota = nota - 0.2; // Quita 0.2 si contestas mal
		var z = false;
		ponerBold("P " + (i+1), z);		
		darExplicacion("INCORRECTA. Puntuación: -0.2");
		darExplicacion("Respuesta correcta: " + window['ok' + i][0]);
	}	
}

// Respuesta correcta:
// Respuesta incorrecta:
function corregirSelect(i) {
	alert("funcion CORREGIRselect"); // ******************************************QUITAR****************************
    var select = preguntaHTML[i].getElementsByTagName('select')[0];
	var puntosMal = -(1/(select.options.length-1).toFixed(2));
	
    if ((select.selectedIndex)==(window['ok' + i][0])) {
        nota +=1;
		var z = true;
		ponerBold("P " + (i+1), z);
		darExplicacion("CORRECTA. Puntuación: 1");
    } else {
		nota += puntosMal // RESPUESTA INCORRECTA quita 1/numero de opciones que haya
		var z = false;
		ponerBold("P " + (i+1), z);
		darExplicacion("INCORRECTA. Puntuación: " + puntosMal.toFixed(2));
		darExplicacion("Respuesta correcta: " + (window['ok' + i][0]) + ". " + select[(window['ok' + i][0])].innerHTML);
	}	    
}

// Respuesta correcta:
// Respuesta incorrecta:
function corregirMultiple(p) {
	alert("funcion CORREGIRmultiple"); // ******************************************QUITAR****************************	
	var sel = preguntaHTML[p].getElementsByTagName('select')[0]; 
	var puntosBien =  1/((window['ok' + p]).length);
	var mal;
	var puntuacion = 0;
	var i;
	var j;

	for (i = 0; i < sel.length; i++){
		
		if (sel.options[i].selected) {
			mal = true;
			
			for (j = 0; j < (window['ok' + p]).length; j++) {
				
				if (i == (window['ok' + p][j])) {
					nota = nota + puntosBien;
					mal = false;
					puntuacion += puntosBien;
				} 			
			}
			
			if (mal) {
				nota = nota - (1/sel.length); // RESPUESTA INCORRECTA quita 1/numero de opciones
				puntuacion -= (1/sel.length);
			}
		}
	}

	if (puntuacion == 1) {
		var z = true;
		ponerBold("P " + (p+1), z);
		darExplicacion("CORRECTA. Puntuación: 1");
	} else {
		var z = false;
		ponerBold("P " + (p+1), z);
		darExplicacion("INCORRECTA. Puntuación: " + puntuacion.toFixed(2));
		darExplicacion("Respuesta/s correcta/s: "); 
		for (h = 0; h < (window['ok' + p]).length; h++) {
			var numero = parseInt(window['ok' + p][h]) + 1;
			darExplicacion(numero + ". " + sel.options[window['ok' + p][h]].innerHTML);			
		}		
	}
}

// Respuesta correcta:
// Respuesta incorrecta:
function corregirCheckbox(p) {
	alert("funcion CORREGIRcheckbox"); // ******************************************QUITAR****************************
	var che;
	var puntosBien =  1/((window['ok' + p]).length);
	var i;
	var j;
	var puntuacion = 0;
	
	if (p == 6) {
		che = formElement.p6;
	} else {
		che = formElement.p7;
	}
	
	for (i = 0; i < che.length; i++){
		
		if (che[i].checked) {
			
			mal = true;
			for (j = 0; j < (window['ok' + p]).length; j++) {
				
				if (i == (window['ok' + p][j])) {
					nota = nota + puntosBien;
					puntuacion += puntosBien;
					mal = false;
				} 				
			}
			
			if (mal) {
				nota = nota - (1/che.length); // RESPUESTA INCORRECTA quita 1/numero de opciones
				puntuacion -= (1/che.length);
			}
		}
	}

	if (puntuacion == 1) {
		var z = true;
		ponerBold("P " + (p+1), z);
		darExplicacion("CORRECTA. Puntuación: 1");
	} else {
		var z = false;		
		ponerBold("P " + (p+1), z);
		darExplicacion("INCORRECTA. Puntuación: " + puntuacion.toFixed(2));
		darExplicacion("Respuesta/s correcta/s: "); 
		for (h = 0; h < (window['ok' + p]).length; h++) {
			var numero = parseInt(window['ok' + p][h]) + 1;
			darExplicacion(numero + ". " + preguntaXML[p].getElementsByTagName("option")[(window['ok' + p][h])].innerHTML);	
			// PREGUNTAR PROFE    *************************	   COMO ACCEDER AL innerHTML del LABEL	
		}		
	}	
}

// Respuesta correcta:
// Respuesta incorrecta:
function corregirRadio(p) {
	alert("funcion CORREGIRradio"); // ******************************************QUITAR****************************	
	var che;
	var numero = parseInt(window['ok' + p][0]);
	var i;
	var j;	
	
	if (p == 8) {
		che = formElement.p8;
	alert("1r if p = 8"); // ******************************************QUITAR****************************
	} else {
	alert("1r if p = 9"); // ******************************************QUITAR****************************
		che = formElement.p9;
	}
	
	for (i = 0; i < che.length; i++){
	alert("bucle che.length = " + che.length); // ******************************************QUITAR****************************
		
		if (che[i].checked) {
			alert("OPCION checkbox = " + (i+1) + "checkeada"); // ******************************************QUITAR****************************
				
			if (i == numero) {
				alert("OPCION checkbox " + (i+1) + " esta en las respuesta. CORRECTA"); // ******************************************QUITAR****************************
				nota += 1;
				var z = true;
				ponerBold("P " + (p+1), z);
				darExplicacion("CORRECTA. Puntuación: 1");
				
			} else {
				alert("OPCION checkbox " + (i+1) + " NO esta en las respuesta. INCORRECTA"); // ******************************************QUITAR****************************

				nota = nota - (1/(che.length)); // RESPUESTA INCORRECTA quita 1 / el numero de opciones que haya
				var z = false;
				alert("paso 1. ha puesto la nota" + (1/(che.length))); //QUITAR****************************
				ponerBold("P " + (p+1), z);
				alert("paso 2. ha puesto la NEGRITA"); //QUITAR****************************
				darExplicacion("INCORRECTA. Puntuación: -" + 1/(che.length).toFixed(2));
				alert("paso 3. ha puesto la PUNTUACION" + 1/(che.length).toFixed(2)); //QUITAR****************************
				darExplicacion("Respuesta correcta: " + (numero + 1) + ". " + preguntaXML[p].getElementsByTagName("option")[numero].innerHTML);
				alert("ha hecho el paso 4"); // QUITAR****************************
			}
		}
	}	
}


// *******************************************************************************************
// Gestionar la presentación de las respuestas y la nota *************************************

function inicializar() { // ES necesario utilizarlo?*********************
    document.getElementById('resultadosDiv').innerHTML = "";
    nota = 0.0;
}

// Creo el texto con <h3>
function ponerH(r) {
	var p = document.createElement("h3");
	var node = document.createTextNode(r);

	p.appendChild(node);
	document.getElementById('comentariosNota').appendChild(p);	
}

// Creo el texto con <b>
function ponerBold(r, z) {
	var p = document.createElement("b");
	var node = document.createTextNode(r);
	var i = document.createElement("i");
	if(z) {
		i.className = "fas fa-check";
	} else {
		i.className = "fas fa-times";
	}

	p.appendChild(node);
	document.getElementById('comentariosNota').appendChild(p);	
	document.getElementById('comentariosNota').appendChild(i);	
}

// Creo el texto con <p>
function darExplicacion(r){
	var p = document.createElement("p");
	var node = document.createTextNode(r);

	p.appendChild(node);
	document.getElementById('comentariosNota').appendChild(p);

}

// Mostrar las repuestas, puntuaciones de cada pregunta y la nota final
function presentarNota() {
	alert("funcion PRESENTARNOTA"); // ******************************************QUITAR****************************
	formElement.style.display = 'none';
	
	if (nota < 0) {			
		notaReal = nota;
		nota = 0;
		ponerH
		ponerH('NOTA FINAL: ' + nota + " sobre 10");		
		darExplicacion('... aunque la hemos redondeado ¡porque era negativa!');
		ponerH("Tu nota REAL es " + notaReal.toFixed(2) + " sobre 10");
	} else {		
		ponerH('NOTA FINAL: ' + nota.toFixed(2) + " sobre 10");
	}
	
	document.getElementById('nota').style.display = 'block';
}