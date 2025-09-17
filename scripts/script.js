// SCRIPT DO SIMULADOR
const inputs = {
  vendas: document.getElementById("vendas_input"),
  produto: document.getElementById("produto_input"),
  pontos: document.getElementById("pontos_input"),
  real: document.getElementById("real_input"),
  pct_resgate_loja: document.getElementById("pct_resgate_loja_input"), // novo campo
};
const warningMessage = document.getElementById("warning-message");
const results = {
  ganhoTributario: document.getElementById("ganho_tributario"),
  liftAplicado: document.getElementById("lift_aplicado"),
  ganhoPrograma: document.getElementById("ganho_programa"),
  ganhoPctFinal: document.getElementById("ganho_pct_final"),
};
function parseInput(inputStr) {
  if (typeof inputStr !== "string" || !inputStr) {
    return 0.0;
  }
  try {
    const sanitizedStr = inputStr.replace(/\./g, "").replace(",", ".");
    const value = parseFloat(sanitizedStr);
    return isNaN(value) ? 0.0 : value;
  } catch (e) {
    return 0.0;
  }
}
function formatNumberBR(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function cleanAndWarn(event) {
  const inputElement = event.target;
  const originalValue = inputElement.value;
  let cleanedValue = originalValue;
  let wasCleaned = false;
  if (inputElement.id === "pontos_input") {
    cleanedValue = originalValue.replace(/[^0-9]/g, "");
  } else if (inputElement.id === "pct_resgate_loja_input") {
    cleanedValue = originalValue.replace(/[^0-9.,]/g, "");
  } else {
    cleanedValue = originalValue.replace(/[^0-9,.]/g, "");
  }
  if (originalValue !== cleanedValue) {
    inputElement.value = cleanedValue;
    wasCleaned = true;
  }
  warningMessage.style.display = wasCleaned ? "block" : "none";
  calculateAndDisplay();
}
function calculateAndDisplay() {
  const vendas_loja = parseInput(inputs.vendas.value);
  const valor_produto = parseInput(inputs.produto.value);
  const pontos_necessarios = parseInt(parseInput(inputs.pontos.value)) || 0;
  const pontos_por_real = parseInput(inputs.real.value);
  const valor_ponto_provisionado = 0.05;
  const pct_vendas_identificadas = 35; // em percentual, display igual ao Streamlit
  let pct_resgate_loja = parseInput(inputs.pct_resgate_loja.value) / 100.0;
  if (isNaN(pct_resgate_loja)) pct_resgate_loja = 0.0;
  const pct_resgatado_proprio = 0.65;
  const pct_resgatado_fora = 1 - pct_resgatado_proprio;
  const lift = 0.025;
  const breakage = 1 - pct_resgate_loja;
  const reais_identificados = (vendas_loja * pct_vendas_identificadas) / 100.0;
  const pontos_dados = reais_identificados * pontos_por_real;
  const valor_pontos_provisionados =
    reais_identificados * valor_ponto_provisionado;
  const pontos_resgatados_loja = pontos_dados * pct_resgate_loja;
  const valor_por_ponto =
    pontos_necessarios > 0 ? valor_produto / pontos_necessarios : 0;
  const pontos_outras_lojas_resgatados_na_loja = 300000.0;
  const carga_tributaria = 0.095;
  const total_resgatado_propria_loja =
    pontos_outras_lojas_resgatados_na_loja +
    pontos_resgatados_loja * pct_resgatado_proprio;
  const valor_pontos_dados_balde = reais_identificados * valor_por_ponto;
  const pontos_proprios_resgatados =
    pontos_resgatados_loja * pct_resgatado_proprio;
  const valor_pontos_resgatados_balde =
    pontos_proprios_resgatados * valor_por_ponto;
  const saldo_1 = valor_pontos_dados_balde - valor_pontos_resgatados_balde;
  const reembolso_outras_lojas =
    pontos_outras_lojas_resgatados_na_loja * valor_por_ponto;
  const saldo_2 = saldo_1 + reembolso_outras_lojas;
  const pontos_loja_resgatados_fora =
    pontos_resgatados_loja * pct_resgatado_fora;
  const custo_resgate_fora = pontos_loja_resgatados_fora * valor_por_ponto;
  const saldo_3 = saldo_2 - custo_resgate_fora;
  const saldo_4 = saldo_3 * (1 - breakage);
  const net_loja = reembolso_outras_lojas - custo_resgate_fora;
  const valor_pontos_provisionados_resgatados =
    pontos_resgatados_loja * valor_por_ponto;
  const ganho_tributario =
    valor_pontos_provisionados_resgatados * carga_tributaria;
  const lift_aplicado = lift * reais_identificados;
  const ganho_programa = net_loja + lift_aplicado + ganho_tributario;
  const ganho_pct_final =
    vendas_loja > 0 ? (ganho_programa / vendas_loja) * 100 : 0;
  results.ganhoTributario.textContent = `R$ ${formatNumberBR(
    ganho_tributario
  )}`;
  results.liftAplicado.textContent = `R$ ${formatNumberBR(lift_aplicado)}`;
  results.ganhoPrograma.textContent = `R$ ${formatNumberBR(ganho_programa)}`;
  results.ganhoPctFinal.textContent = `${formatNumberBR(ganho_pct_final)}%`;
}
Object.values(inputs).forEach((input) => {
  input.addEventListener("input", cleanAndWarn);
});
document.addEventListener("DOMContentLoaded", () => {
  calculateAndDisplay();
  document.getElementById(
    "copyright-year"
  ).textContent = `© Indico ${new Date().getFullYear()}`;
});
