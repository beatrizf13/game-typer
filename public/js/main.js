var tempoInicial = $("#tempo-digitacao").text();

$(function(){
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    $("#botao-reiniciar").click(reiniciaJogo);
});//espera o html carregar e inicializa as funções

function atualizaTamanhoFrase() {
    var frase = $("#frase").text(); // $ ou jQuery
    var qtdPalavras = frase.split(" ").length;//quebra pelo espaço ou qualquer elemento
    var tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(qtdPalavras);//substitui o valor de texto
}

var campo = $("#campo-digitacao");
function inicializaContadores(){
    //on = event
    campo.on("input", function() {
        var conteudo = campo.val();

        var qtdPalavras = conteudo.split(/\S+/).length-1;//espressão regular que transforma um bloco de vários espaçoes em um só
        $("#contador-palavras").text(qtdPalavras);

        var qtdCaracteres = conteudo.length;
        $("#contador-caracteres").text(qtdCaracteres);
    });
}

function inicializaCronometro(){
    var tempoRestante = $("#tempo-digitacao").text();
    //escuta o event apenas uma vez
    campo.one("focus", function(){
        var conometroID = setInterval(function(){
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);
            if(tempoRestante<1){
                campo.attr("disabled", true);//atributos
                clearInterval(conometroID); //para intevalo
            }
        },1000);
    });
}

function reiniciaJogo(){
    campo.attr("disabled",false);
    campo.val("");
    $("#contador-palavras").text("0");
    $("#contador-caracteres").text("0");
    $("#tempo-digitacao").text(tempoInicial);
    // Adicionamos aqui \/
    inicializaCronometro();
}
