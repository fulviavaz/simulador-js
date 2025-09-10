// SCRIPT DO SIMULADOR
const inputs = {
  vendas: document.getElementById("vendas_input"),
  produto: document.getElementById("produto_input"),
  pontos: document.getElementById("pontos_input"),
  real: document.getElementById("real_input"),
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

  const pct_vendas_identificadas = 35 / 100.0;
  const valor_ponto_provisionado = 5 / 100.0;
  const pct_resgate_loja = 25 / 100.0;
  const lift = 2.5 / 100.0;
  const carga_tributaria = 0.0965;
  const taxa_selic = 0.12;

  const reais_identificados = vendas_loja * pct_vendas_identificadas;
  const pontos_dados = reais_identificados * pontos_por_real;
  const valor_pontos_provisionados =
    reais_identificados * valor_ponto_provisionado;
  const pontos_resgatados_loja = pontos_dados * pct_resgate_loja;
  const valor_por_ponto =
    pontos_necessarios > 0 ? valor_produto / pontos_necessarios : 0;
  const valor_pontos_dados_balde = reais_identificados * valor_por_ponto;
  const saldo_3 = valor_pontos_dados_balde;
  const saldo_4 = saldo_3 * pct_resgate_loja;
  const ganho_tributario = saldo_4 * carga_tributaria;
  const receita_financeira = ((saldo_3 + saldo_4) / 2) * taxa_selic;
  const lift_aplicado = lift * reais_identificados;
  const ganho_programa = ganho_tributario + lift_aplicado + receita_financeira;
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
