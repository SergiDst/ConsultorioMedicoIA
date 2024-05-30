$(document).ready(function () {
    var artyom = new Artyom();

    artyom.initialize({
        lang: "es-ES",
        debug: true,
        listen: true,
        continuous: true,
        soundex: true,
        speed: 0.9,
        mode: "normal",
    })

    artyom.addCommands({
        indexes: ["hola"], // Captura cualquier palabra
        action: function () {
            artyom.say("hola")
        }
    })

    artyom.dontObey()

    /* $("#btnVoz").on("click", function () {

        artyom.initialize({
            lang: "es-ES",
            debug: true,
            listen: true,
            continuous: false,
            soundex: true,
            speed: 0.9,
            mode: "normal"
        })

        // Agregar comando para capturar texto
        artyom.addCommands({
            indexes: ["hola"], // Captura cualquier palabra
            action: function () {
                artyom.say("hola")
            }
        })

        artyom.redirectRecognizedTextOutput(function(text){
            $("#inputPregunta").val(text)
        });

        setTimeout(function () {
            artyom.fatality()
        }, 3000)
    }) */
    var promptsAnteriores = [];

    $("#buscar").on("click", () => {
        artyom.initialize({
            lang: "es-ES",
            debug: true,
            listen: true,
            continuous: false,
            soundex: true,
            speed: 0.9,
            mode: "normal"
        })


        // Agregar comando para capturar texto
        artyom.addCommands({
            indexes: ["hola"], // Captura cualquier palabra
            action: function () {
                artyom.say("hola")
            }
        })

        var promptActual = $("#inputPregunta").val();
        promptsAnteriores.push(promptActual);
        var cuerpo = {
            "model": "llama3",
            "prompt": $('#inputPregunta').val() + 'Soy un chatbot medico especializado',
            "stream": true
        }
        $.ajax({
            type: "POST",
            url: "http://localhost:11434/api/generate",
            data: JSON.stringify(cuerpo),
            xhrFields: {
                onprogress: function(e) {
                    var response = e.currentTarget.response;
                    var lines = response.split('\n');
                    var textoAnterior = $("#textaRespuesta").text()
                    
                    lines.forEach(function(line) {

                        if (line.trim() !== '') {
                            var responseObject = JSON.parse(line);
                            // Hacer algo con el objeto de respuesta, por ejemplo, imprimirlo
                            console.log(responseObject);
                            $("#textaRespuesta").text(`${textoAnterior}${responseObject.response}`);
                            // $("#conversacion").append('<p><strong>Tú:</strong> ' + promptActual + '</p>'); texto conversacion
                            // $("#conversacion").append('<p><strong>ChatBot:</strong> ' + responseObject.response + '</p>');
                        }
                        
                        //artyom.say()
                    }
                    
                );
                }
                
            
            },
            
        }).done(function(data){
            artyom.say($("#textaRespuesta").text())
            var nuevoParrafo = document.createElement('div')
            nuevoParrafo.textContent = document.getElementById('textarespuesta').value;
            document.getElementById('conversacion').appendChild(nuevoParrafo)
            console.log(data)
        });
        setTimeout(function () {
            artyom.fatality()
        }, 3000)
    });
});

