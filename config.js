/**
 * ====================================================================
 * CONFIGURAÇÕES DA PÁGINA — ESTANTE DE ANÁLISES CLÍNICAS
 * ====================================================================
 * Edite os valores abaixo para alterar links de checkout, preços,
 * contato e códigos de rastreamento próprios.
 */

window.PAGE_CONFIG = {
  // ------------------------------------------------------------------
  // 1. LINKS DE CHECKOUT (Substitua pelos seus links da Kiwify, Hotmart, Wiapy, etc.)
  // ------------------------------------------------------------------
  checkout: {
    // Oferta Principal: Pacote Completo (R$ 19,90)
    completo: "https://pay.wiapy.com/B-dUo-47XX_",

    // Oferta Básica: Pacote Básico (R$ 5,90) - Acionado no modal
    basico: "https://pay.wiapy.com/DCuLzrUDOFif",

    // Oferta Upsell: Pacote Completo com Desconto (R$ 12,90) - Acionado no modal
    upsell: "https://pay.wiapy.com/zspAtz1ICIZR",
  },

  // ------------------------------------------------------------------
  // 2. PREÇOS VISÍVEIS NA PÁGINA
  // ------------------------------------------------------------------
  precos: {
    completo: "19,90",
    completoDe: "147",
    basico: "5,90",
    upsell: "12,90",
    upsellDe: "47,90",
  },

  // ------------------------------------------------------------------
  // 3. SUPORTE / CONTATO
  // ------------------------------------------------------------------
  contato: {
    whatsapp: "https://wa.me/5515997367343?text=Olá,%20tenho%20dúvidas%20sobre%20a%20Estante%20de%20Análises%20Clínicas",
    email: "suporte@seudominio.com",
  },

  // ------------------------------------------------------------------
  // 4. SEUS PRÓPRIOS CÓDIGOS DE RASTREAMENTO (OPCIONAL)
  // Deixe em branco ("") se não quiser usar.
  // Nenhum código do dono antigo está ativo!
  // ------------------------------------------------------------------
  tracking: {
    metaPixelId: "", // Exemplo: "123456789012345"
    googleTagId: "", // Exemplo: "G-XXXXXXXXXX"
    tiktokPixelId: "", // Exemplo: "CXXXXXXXXXXXXXXX"
  }
};
