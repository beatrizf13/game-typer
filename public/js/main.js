var tempoInicial = $("#tempo-digitacao").text();
var campo = $("#campo-digitacao");

$(function(){
    iniciaJogo();
});//espera o html carregar e inicializa as funções

function iniciaJogo() {
    trocaFrase();
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    inicializaMarcadores();
    $("#botao-reiniciar").click(reiniciaJogo);
    $("#botao-placar").click(mostraPlacar);
    $("#botao-frase-id").click(buscaFraseId);
}

function mostraPlacar(){
    $(".placar").stop().slideToggle(600);
    // $(".placar").toggleClass("invisivel");
}

function buscaFraseId(){
    $("#spinner").toggle();
    var fraseId = $("#frase-id").val();
    $.get("http://localhost:3000/frases",
    { id: fraseId},
    function(data){
        reiniciaJogo();
        $("#frase").text(data.texto);
        atualizaTamanhoFrase();
        atualizaTempoFrase(data.tempo);
    })
    .fail(function(){
        $("#erro").toggle();
        setTimeout(function(){
            $("#erro").toggle();
        },1500);
    })
    .always(function(){ //sempre escondendo o spinner
        $("#spinner").toggle();
    });
}

function trocaFrase(){
    $("#botao-frase").click(function(){
        $("#spinner").toggle();
        $.get("http://localhost:3000/frases", function(data){
            i = Math.floor(Math.random() * data.length);
            $("#frase").text(data[i].texto);
            atualizaTempoFrase(data[i].tempo);
            atualizaTamanhoFrase();
            reiniciaJogo();

        })
        .fail(function(){
            $("#erro").toggle();
            setTimeout(function(){
                $("#erro").toggle();
            },1500);
        })
        .always(function(){ //sempre escondendo o spinner
            $("#spinner").toggle();
        });
    });
}

function atualizaTempoFrase(tempo) {
    tempoInicial = tempo;
    $("#tempo-digitacao").text(tempo);
}

function atualizaTamanhoFrase() {
    var frase = $("#frase").text(); // $ ou jQuery
    var qtdPalavras = frase.split(" ").length;//quebra pelo espaço ou qualquer elemento
    var tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(qtdPalavras);//substitui o valor de texto
}

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
    //escuta o event apenas uma vez
    campo.one("focus", function(){
        var tempoRestante = $("#tempo-digitacao").text();
        var conometroID = setInterval(function(){
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);
            if(tempoRestante<1){
                clearInterval(conometroID); //para intevalo
                finalizaJogo();
            }
        },1000);
    });
}

function finalizaJogo() {
    campo.attr("disabled", true);//atributos
    campo.addClass("campo-desativado");
    inserePlacar();
}

function reiniciaJogo(){
    campo.attr("disabled",false);
    campo.val("");
    $("#contador-palavras").text("0");
    $("#contador-caracteres").text("0");
    $("#tempo-digitacao").text(tempoInicial);
    campo.removeClass("campo-desativado");
    inicializaCronometro();
    campo.removeClass("borda-vermelha");
    campo.removeClass("borda-verde");
}

function inicializaMarcadores() {
    campo.on("input", function() {
        var frase = $("#frase").text();
        var digitado = campo.val();
        var comparavel = frase.substr(0 , digitado.length);

        if(digitado == comparavel) {
            campo.addClass("borda-verde");
            campo.removeClass("borda-vermelha");
        } else {
            campo.addClass("borda-vermelha");
            campo.removeClass("borda-verde");
        }
    });
}

function inserePlacar(){
    var corpoTabela = $(".placar").find("tbody");
    var usuario = "Beatriz";
    var numPalavras = $("#contador-palavras").text();

    var linha = novaLinhaPlacar(usuario,numPalavras);
    linha.find(".botao-remover").click(removeLinha);

    corpoTabela.prepend(linha);

    $(".placar").slideDown(600);
    scrollPlacar();
}

function scrollPlacar() {
    var posicaoPlacar = $(".placar").offset().top;
    $("body").animate(
    {
        scrollTop: posicaoPlacar + "px"
    }, 1000);
}

function novaLinhaPlacar(usuario,palavras){
    var linha = $("<tr>");
    var colunaUsuario = $("<td>").text(usuario);
    var colunaPalavras = $("<td>").text(palavras);
    var colunaRemover = $("<td>");

    var link = $("<a>").attr("href","#").addClass("botao-remover");
    var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");

    // Icone dentro do <a>
    link.append(icone);

    // <a> dentro do <td>
    colunaRemover.append(link);

    // Os três <td> dentro do <tr>
    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    linha.append(colunaRemover);

    return linha;
}

function removeLinha(event){
    event.preventDefault();
    $(this).parent().parent().fadeOut(600);
    setTimeout(function(){
        $(this).parent().parent().remove();
    } ,600);

}
