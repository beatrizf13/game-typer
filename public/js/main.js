var tempoInicial = $("#tempo-digitacao").text();
var campo = $("#campo-digitacao");

$(function(){
    iniciaJogo();
});//espera o html carregar e inicializa as funções

function iniciaJogo() {
    atualizaPlacar()
    trocaFrase();
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    inicializaMarcadores();
    $("#botao-reiniciar").click(reiniciaJogo);
    $("#botao-placar").click(mostraPlacar);
    $("#botao-frase-id").click(buscaFraseId);
    $("#botao-sync").click(sincronizaPlacar);
}

function inicializaContadores(){
    //on = event
    campo.on("input", function() {
        var conteudo = campo.val();

        // var qtdPalavras = conteudo.split(/\S+/).length-1;//espressão regular que transforma um bloco de vários espaçoes em um só
        // $("#contador-palavras").text(qtdPalavras);

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

function atualizaTempoFrase(tempo) {
    tempoInicial = tempo;
    $("#tempo-digitacao").text(tempo);
}

function atualizaTamanhoFrase() {
    var frase = $("#frase").text(); // $ ou jQuery
    var qtdPalavras = frase.length;
    // var qtdPalavras = frase.split(" ").length;//quebra pelo espaço ou qualquer elemento
    var tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(qtdPalavras);//substitui o valor de texto
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

function finalizaJogo() {
    campo.attr("disabled", true);//atributos
    campo.addClass("campo-desativado");
    inserePlacar();
}

function reiniciaJogo(){
    campo.attr("disabled",false);
    campo.val("");
    // $("#contador-palavras").text("0");
    $("#contador-caracteres").text("0");
    $("#tempo-digitacao").text(tempoInicial);
    campo.removeClass("campo-desativado");
    inicializaCronometro();
    campo.removeClass("borda-vermelha");
    campo.removeClass("borda-verde");
}

//////////////////////////////////////////////////
function sincronizaPlacar(){
    var placar = [];
    var linhas = $("tbody>tr");
    linhas.each(function(){
        var usuario = $(this).find("td:nth-child(1)").text();
        var palavras = $(this).find("td:nth-child(2)").text();

        var score = {
            usuario: usuario,
            pontos: palavras
        };
        placar.push(score);
    });

    $.post("http://localhost:3000/placar",
    {placar: placar},
    function(){});
}

function mostraPlacar(){
    $(".placar").stop().slideToggle(600);
    // $(".placar").toggleClass("invisivel");
}

function atualizaPlacar(){
    $.get("http://localhost:3000/placar",function(data){
        $(data).each(function(){
            var linha = novaLinhaPlacar(this.usuario, this.pontos);
            // linha.find(".botao-remover").click(removeLinhaPlacar);
            $("tbody").append(linha);
        });
    });
}

function validaDigitado() {
    var digitado = $("#campo-digitacao").val();
    var frase = $("#frase").text();
    var comparavel = frase.substr(0 , digitado.length);

    if(digitado == comparavel){
        return true;
    }
    else {
        return false;
    }
}

function inserePlacar(){

    if(!validaDigitado()) return;

    var corpoTabela = $(".placar").find("tbody");
    var usuario = "bea_trizf";
    var tamanhoDigitado = $("#contador-caracteres").text();
    var tamanhoFrase = $("#tamanho-frase").text();
    var pontos = Math.floor(((tamanhoDigitado*10)/(tamanhoFrase))*tamanhoFrase);

    var linha = novaLinhaPlacar(usuario,pontos);
    // linha.find(".botao-remover").click(removeLinhaPlacar);

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
    // var colunaRemover = $("<td>");

    // var link = $("<a>").attr("href","#").addClass("botao-remover");
    // var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");

    // Icone dentro do <a>
    // link.append(icone);

    // <a> dentro do <td>
    // colunaRemover.append(link);

    // Os três <td> dentro do <tr>
    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    // linha.append(colunaRemover);

    return linha;
}

// function removeLinhaPlacar (event){
//     event.preventDefault();
//     $(this).parent().parent().fadeOut(600);
//     setTimeout(function(){
//         $(this).parent().parent().remove();
//     } ,600);
//
// }
//////////////////////////////////////////////////
var frases = [
	{_id: 0, texto:'Vestibulum eget sagittis mauris, vel egestas magna. Curabitur ac gravida risus. Mauris quis consequat turpis. Morbi turpis diam, tincidunt ultrices tristique vel, malesuada scelerisque ex.', tempo: 15 },
	{_id: 1, texto:'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis eu finibus nunc, in tempus magna. Donec dapibus ut lorem vel accumsan. Duis id magna eu erat placerat scelerisque ac ac nunc. Suspendisse potenti.',tempo: 20 },
	{_id: 2, texto:'Etiam finibus lorem vitae ultrices dignissim. Nam laoreet hendrerit iaculis.', tempo: 10 },
	{_id: 3, texto:'Fusce et nulla vitae lacus sagittis rhoncus.', tempo: 5 },
	{_id: 4, texto:' Fusce eget sem non arcu tempus tempor a et justo.', tempo: 5 },
	{_id: 5, texto:'Aliquam nec ornare nisl.', tempo:5 },
	{_id: 6, texto:'Duis pellentesque dignissim dictum.', tempo: 5 },
	{_id: 7, texto:'Quisque luctus non purus at molestie. Nullam sit amet tempus elit. Fusce tempus et magna sed accumsan.', tempo: 10 },
	{_id: 8, texto:'Etiam interdum erat vitae libero feugiat, nec venenatis turpis varius. Ut dapibus, tellus in porta dapibus.', tempo: 10},
	{_id: 9, texto:'Nullam at metus ac elit auctor mollis. Nullam congue felis eu nisl pretium tempus. Donec eget aliquet massa. Integer quis tempus tellus.', tempo: 15},

	];
