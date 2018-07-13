let tempoInicial = $("#tempo-digitacao").text();
let campo = $("#campo-digitacao");

$(function(){
    iniciaJogo();
});//espera o html carregar e inicializa as funções

const iniciaJogo = () => {
    atualizaPlacar()
    trocaFrase();
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    inicializaMarcadores();
    $("#botao-reiniciar").click(function(){
        reiniciaJogo();
        inicializaCronometro();
    });
    $("#botao-placar").click(mostraPlacar);
    $("#botao-frase-id").click(buscaFraseId);
    $("#botao-sync").click(sincronizaPlacar);

    $('#usuarios').selectize({
        create: true,
        sortField: 'text'
    });

    $(".tooltip").tooltipster({
        trigger: "custom"
    });

}

const inicializaContadores = () => {
    //on = event
    campo.on("input", function() {
        let conteudo = campo.val();

        // let qtdPalavras = conteudo.split(/\S+/).length-1;//espressão regular que transforma um bloco de vários espaçoes em um só
        // $("#contador-palavras").text(qtdPalavras);

        let qtdCaracteres = conteudo.length;
        $("#contador-caracteres").text(qtdCaracteres);
    });
}

const inicializaCronometro = () => campo.one("focus", function() {
    let tempoRestante = $("#tempo-digitacao").text();
    let cronometroID = setInterval(function() {
        tempoRestante--;
        $("#tempo-digitacao").text(tempoRestante);
        if (tempoRestante < 1) {
            clearInterval(cronometroID);
            finalizaJogo();
        }
    }, 1000);
});


const inicializaMarcadores = () => campo.on("input", function() {
    let frase = $("#frase").text();
    let digitado = campo.val();
    let comparavel = frase.substr(0 , digitado.length);

    if(digitado == comparavel) {
        campo.addClass("borda-verde");
        campo.removeClass("borda-vermelha");
    } else {
        campo.addClass("borda-vermelha");
        campo.removeClass("borda-verde");
    }
});


const atualizaTempoFrase = tempo => {
    tempoInicial = tempo;
    $("#tempo-digitacao").text(tempo);
}

const atualizaTamanhoFrase = () => {
    let frase = $("#frase").text(); // $ ou jQuery
    let qtdPalavras = frase.length;
    // let qtdPalavras = frase.split(" ").length;//quebra pelo espaço ou qualquer elemento
    let tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(qtdPalavras);//substitui o valor de texto
}

const buscaFraseId = () => {
    $("#spinner").toggle();
    let fraseId = $("#frase-id").val();
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

const trocaFrase = () => {
    $("#botao-frase").click(function(){
        reiniciaJogo();
        $("#spinner").toggle();
        $.get("http://localhost:3000/frases", function(data){
            i = Math.floor(Math.random() * data.length);
            $("#frase").text(data[i].texto);
            atualizaTempoFrase(data[i].tempo);
            atualizaTamanhoFrase();

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

const finalizaJogo = () => {
    campo.attr("disabled", true);//atributos
    campo.addClass("campo-desativado");
    inserePlacar();
}

const reiniciaJogo = () => {
    campo.attr("disabled",false);
    campo.val("");
    // $("#contador-palavras").text("0");
    $("#contador-caracteres").text("0");
    $("#tempo-digitacao").text(tempoInicial);
    campo.removeClass("campo-desativado");
    campo.removeClass("borda-vermelha");
    campo.removeClass("borda-verde");
}

//////////////////////////////////////////////////
const sincronizaPlacar = () => {
    let placar = [];
    let linhas = $("tbody>tr");
    linhas.each(function(){
        let usuario = $(this).find("td:nth-child(1)").text();
        let pontuacao = $(this).find("td:nth-child(2)").text();

        let score = {
            usuario: usuario,
            pontos: pontuacao
        };
        placar.push(score);
    });

    $.post("http://localhost:3000/placar", {placar: placar} , function(){
        $(".tooltip").tooltipster("open").tooltipster("content", "Sincronizado com sucesso!");
    }).fail(function(){
        $(".tooltip").tooltipster("open").tooltipster("content", "Falha ao sincronizar");
    }).always(function(){
        setTimeout(function() {
        $(".tooltip").tooltipster("close");
    }, 1200);
    });
}

const mostraPlacar = () => $(".placar").stop().slideToggle(600);

const atualizaPlacar = () => {
    $.get("http://localhost:3000/placar",function(data){
        $(data).each(function(){
            let linha = novaLinhaPlacar(this.usuario, this.pontos);
            // linha.find(".botao-remover").click(removeLinhaPlacar);
            $("tbody").append(linha);
        });
    });
}

const validaDigitado = () => {
    let digitado = $("#campo-digitacao").val();
    let frase = $("#frase").text();
    let comparavel = frase.substr(0 , digitado.length);

    if(digitado == comparavel) return true;
    else return false;
}

const inserePlacar = () => {

    if(!validaDigitado()) return;

    let corpoTabela = $(".placar").find("tbody");
    let usuario = $("#usuarios").val();
    let tamanhoDigitado = $("#contador-caracteres").text();
    let tamanhoFrase = $("#tamanho-frase").text();
    let extraCompleto = 0;
    if(tamanhoFrase == tamanhoDigitado) extraCompleto = 1000;
    let pontos = Math.floor((((tamanhoDigitado*10)/(tamanhoFrase))*tamanhoFrase) + extraCompleto);

    let linha = novaLinhaPlacar(usuario,pontos);
    // linha.find(".botao-remover").click(removeLinhaPlacar);

    corpoTabela.prepend(linha);

    $(".placar").slideDown(600);
    scrollPlacar();
}

const scrollPlacar = () => {
    let posicaoPlacar = $(".placar").offset().top;
    $("body").animate(
    {
        scrollTop: posicaoPlacar + "px"
    }, 1000);
}

const novaLinhaPlacar = (usuario,palavras) => {
    let linha = $("<tr>");
    let colunaUsuario = $("<td>").text(usuario);
    let colunaPalavras = $("<td>").text(palavras);
    // let colunaRemover = $("<td>");

    // let link = $("<a>").attr("href","#").addClass("botao-remover");
    // let icone = $("<i>").addClass("small").addClass("material-icons").text("delete");

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

// const removeLinhaPlacar = event => {
//     event.preventDefault();
//     $(this).parent().parent().fadeOut(600);
//     setTimeout(function(){
//         $(this).parent().parent().remove();
//     } ,600);
//
// }
//////////////////////////////////////////////////
