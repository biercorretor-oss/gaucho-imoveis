// Gaucho Calc
// Versão 1.5
// Desenvolvido por Cristiano Bier
// Julho de 2026

let financiamentoCalculado = 0;
let rendaMinimaOriginal = 0;

function lerValor(id) {    
    
    let valor = document.getElementById(id).value;
    valor = valor.replace(/\./g, "");
    valor = valor.replace(",",".");
    return Number(valor || 0);
}




function calcular() {

    let avaliacao = lerValor("avaliacao");
    let venda = lerValor("venda");
    let financiado;

        if (financiamentoCalculado > 0) {

            financiado = financiamentoCalculado;

        } else {

            financiado = avaliacao * 0.80;

            
}

    let entrada = venda - financiado;
    let fgts = lerValor("fgts");
    let ato = lerValor("ato");
    let qtdAportes = Number(document.getElementById("qtdAportes").value || 0);
    let valorAporte = lerValor("valorAporte");
    let parcelas = Number(document.getElementById("parcelas").value || 0);
    let percentualPos = Number(document.getElementById("percentualPos").value || 0);
    let parcelasPos = Number(document.getElementById("parcelasPos").value || 0);
    let valorPos = venda * (percentualPos / 100);
    let saldo = venda - financiado - fgts - ato - (qtdAportes * valorAporte) - valorPos;
    let prazoFin = Number(document.getElementById("prazoFin").value || 0);
    let jurosAno = Number(document.getElementById("jurosAno").value || 0);
    let jurosMes = Math.pow(1 + (jurosAno / 100), 1 / 12) - 1;
    let rendaMinima = 0;
    let parcelaFin = 0;

    if (prazoFin > 0 && jurosMes > 0 && financiado > 0) {

    parcelaFin =
        financiado *
        (jurosMes * Math.pow(1 + jurosMes, prazoFin)) /
        (Math.pow(1 + jurosMes, prazoFin) - 1);

    rendaMinima = parcelaFin / 0.30;
         if (financiamentoCalculado == 0) {

            rendaMinimaOriginal = rendaMinima;
    }
}

document.getElementById("parcelaFin").value =
    parcelaFin.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

document.getElementById("rendaMinima").value =
    rendaMinimaOriginal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });


document.getElementById("financiado").value =
    financiado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

document.getElementById("entrada").value =
    entrada.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });


    document.getElementById("valorPos").value =
valorPos.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});

    let valorParcelaPos = 0;

      if (parcelasPos > 0) {
          valorParcelaPos = valorPos / parcelasPos;
}

         document.getElementById("valorParcelaPos").value =
         valorParcelaPos.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL"
});

if (parcelas <= 0) {
        document.getElementById("resultado").innerHTML = "Informe as parcelas";
        return;
    }

    let parcela = saldo / parcelas;

document.getElementById("resultado").innerHTML = 
    parcela.toLocaleString("pt-BR", { style: "currency", currency:"BRL"});
    atualizarStatus();
}

document.querySelectorAll('input:not([type="radio"])').forEach(campo => {

    campo.addEventListener("input", function () {

        if (
            (this.id === "prazoFin" || this.id === "jurosAno") &&
            lerValor("rendaInformada") > 0
        ) {

            recalcularPorRendaInformada();

        } else {

            calcular();

        }

    });

});

document.getElementById("limpar").addEventListener("click", function(){

    document.querySelectorAll('input[type="number"]').forEach(campo=>{
        campo.value="";
    });

    document.querySelector('input[name="posChaves"][value="nao"]').checked=true;

    document.getElementById("areaPosChaves").style.display="none";

    document.querySelectorAll('input').forEach(campo => {
    if (campo.type !== "radio") {
        campo.value = "";
    }
});

    document.getElementById("resultado").innerHTML="R$ 0,00";
        financiamentoCalculado = 0;
        rendaMinimaOriginal = 0;
        atualizarStatus();

document.getElementById("financiado").value = "";
document.getElementById("entrada").value = "";
document.getElementById("parcelaFin").value = "";
document.getElementById("rendaMinima").value = "";
document.getElementById("rendaInformada").value = "";
});

document.getElementsByName("posChaves").forEach(opcao => {

    opcao.addEventListener("change", function () {

        if (this.value === "sim") {
            document.getElementById("areaPosChaves").style.display = "block";
        } else {
                document.getElementById("areaPosChaves").style.display = "none";
                document.getElementById("percentualPos").value = "";
                document.getElementById("valorPos").value = "";
                document.getElementById("parcelasPos").value = "";
                document.getElementById("valorParcelaPos").value = "";

    calcular();
        }

    });

});

window.addEventListener("load", function () {

    setTimeout(function () {

        document.getElementById("splash").classList.add("ocultar");

        setTimeout(function () {
            document.getElementById("splash").style.display = "none";
        }, 500);

    }, 1500);

});

function formatarMoeda(campo) {

    let valor = campo.value;

    // Mantém apenas números e vírgula
    valor = valor.replace(/[^\d,]/g, "");

    // Permite apenas uma vírgula
    let partes = valor.split(",");
    if (partes.length > 2) {
        valor = partes[0] + "," + partes.slice(1).join("");
        partes = valor.split(",");
    }

    // Formata o milhar
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    campo.value = partes.join(",");
}

function completarCentavos(campo) {

    let valor = campo.value;

    if (valor === "") return;

    if (!valor.includes(",")) {
        campo.value = valor + ",00";
    } else {

        let partes = valor.split(",");

        if (partes[1].length === 0) {
            campo.value += "00";
        } else if (partes[1].length === 1) {
            campo.value += "0";
        }

    }

}

document.querySelectorAll(".moeda").forEach(campo => {

    campo.addEventListener("input", function () {

        formatarMoeda(this);
        calcular();

    });

    campo.addEventListener("blur", function () {

        completarCentavos(this);
        calcular();

    });
});

document.getElementById("menuBotao").addEventListener("click", function(){

    let menu = document.getElementById("menuSuspenso");

    if(menu.style.display=="block"){

        menu.style.display="none";}
           else{

           menu.style.display="block";

    }

});

function atualizarRendaInformada(){

}

function calcularFinanciamentoMaximo(parcela, jurosMes, prazo) {

    if (parcela <= 0 || jurosMes <= 0 || prazo <= 0) {
        return 0;
    }

    let financiamento =
        parcela *
        ((Math.pow(1 + jurosMes, prazo) - 1) /
        (jurosMes * Math.pow(1 + jurosMes, prazo)));

    return financiamento;

}

function recalcularPorRendaInformada() {

    let renda = lerValor("rendaInformada");

    if (renda <= 0) {

        financiamentoCalculado = 0;
        calcular();
        return;

    }

    let avaliacao = lerValor("avaliacao");
    let venda = lerValor("venda");

    let prazoFin = Number(document.getElementById("prazoFin").value || 0);
    let jurosAno = Number(document.getElementById("jurosAno").value || 0);

    if (prazoFin <= 0 || jurosAno <= 0) return;

    let jurosMes = Math.pow(1 + (jurosAno / 100), 1 / 12) - 1;

    let parcelaMaxima = renda * 0.30;

    financiamentoCalculado =
        calcularFinanciamentoMaximo(
            parcelaMaxima,
            jurosMes,
            prazoFin
        );

    let limiteCEF = avaliacao * 0.80;

    if (financiamentoCalculado > limiteCEF) {

        financiamentoCalculado = limiteCEF;

    }

    calcular();

}

document.getElementById("rendaInformada").addEventListener("input", function () {

    formatarMoeda(this);

    if (this.value.trim() == "") {

        financiamentoCalculado = 0;
        calcular();

    } else {

        recalcularPorRendaInformada();

    }

});

document.getElementById("rendaInformada").addEventListener("blur", function () {

    completarCentavos(this);


});

function atualizarStatus(){

    let status = document.getElementById("statusSimulacao");

    if(financiamentoCalculado > 0){

        status.value = "🟢 Renda inf.";
        status.style.color = "#27ae60";
        status.style.fontWeight = "bold";

    }else{

        status.value = "🟠 Renda mín.";
        status.style.color = "#f39c12";
        status.style.fontWeight = "bold";

    }

}

function atualizarCalculoCompleto(){

    if (lerValor("rendaInformada") > 0){
        recalcularPorRendaInformada();
    }else{
        calcular();
    }

}

