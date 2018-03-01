var xhttp = new XMLHttpRequest();

var url = "https://rawgit.com/MariaAdrover/LM_PRACTICA5/master/xml/formulari.xml";
var urlJavi = 'https://rawgit.com/shamshir/Prueba/master/questions.xml';

var xmlDoc = null;
var preguntaXML;
var preguntaHTML;
var tipoInput;

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

var testContestado = false;
var nota = 0;


window.onload = function(){
	
	preguntaHTML = document.getElementsByClassName('pregunta');	
	
    // Carga el XML y rellena el HTML 
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			gestionarXml(this);
		}
	};

	xhttp.open("GET", url, true); //localhost no ha de funcionar
	xhttp.send();
	
	// Empezar el test

// CREAR BOTON PARA EMPEZAR
// CREAR CONTADOR
	
	// Al enviar el formulario Comprobar y corregir
	document.getElementsByTagName('form')[0].onsubmit = function() {
		//comprobar();
		corregir();
		//if (testContestado) {
		//	corregir();
		//}
		
		
		window.alert("tu nota = " + nota);
		
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

// Inicia el test
function empezar() {
	// TO DO
}


// Inicia la cuenta atrás
function contador() {
	// TO DO
}



// *********************** ON SUBMIT **********************************************************
// ******************* Corregir el test *******************************************************

// Comprobar que se han contestado todas las preguntas
function comprobar() {
	// TO DO
	
	//return testContestado;
}


// 
function corregir() {
	for (i = 0; i < preguntaHTML.length; i++) {
		
		tipoInput = preguntaHTML[i].getElementsByTagName('input')[0];
		var tipoSelect = document.getElementsByTagName('form')[0].getElementsByTagName('select'); 
		
		if (tipoInput.type == 'text') {
			testContestado = true;
			corregirText(i);
			
		} else if (tipoInput == 'checkbox') {
			
		} else if (tipoInput == 'radio') {
			
		} else {
			
		}
	}
	
}

function corregirText(i) {
	var valor = preguntaHTML[i].getElementsByTagName('input')[i].value;
	
	if (i == 0) {
	
		if (valor.toUpperCase() == ok0[0].toUpperCase()) {
			nota++;
		}	
		
	} else {
		if (valor.toUpperCase() == ok1[0].toUpperCase()) {
			nota += 1;
		}
	}
}

function corregirSelect() {
	
}

