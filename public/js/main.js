var frase = $("#frase").text(); // $ ou jQuery
var qtdPalavras = frase.split(" ").length;//quebra pelo espaço ou qualquer elemento
var tamanhoFrase = $("#tamanho-frase");
tamanhoFrase.text(qtdPalavras);//substitui o valor de texto

////////////////////////////////////////////////////////////////
var campo = $("#campo-digitacao");
//on = event
campo.on("input", function() {
    var conteudo = campo.val();

    var qtdPalavras = conteudo.split(/\S+/).length-1;//espressão regular que transforma um bloco de vários espaçoes em um só
    $("#contador-palavras").text(qtdPalavras);

    var qtdCaracteres = conteudo.length;
    $("#contador-caracteres").text(qtdCaracteres);
});
////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////
