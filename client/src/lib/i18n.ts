// Internationalization system - Auto-translates entire site based on selected country
export const COUNTRY_FLAGS = {
  "USA": "us",
  "Canada": "ca",
  "UK": "gb",
  "Germany": "de",
  "France": "fr",
  "Italy": "it",
  "Spain": "es",
  "Japan": "jp",
  "Australia": "au",
  "Brazil": "br",
  "Mexico": "mx",
  "Netherlands": "nl",
  "Singapore": "sg",
  "UAE": "ae",
  "China": "cn",
} as const;

export const COUNTRY_LANGUAGES = {
  "USA": "en",
  "Canada": "en",
  "UK": "en",
  "Germany": "de",
  "France": "fr",
  "Italy": "it",
  "Spain": "es",
  "Japan": "ja",
  "Australia": "en",
  "Brazil": "pt",
  "Mexico": "es",
  "Netherlands": "en",
  "Singapore": "en",
  "UAE": "en",
  "China": "zh",
} as const;

// Get flag SVG URL in high resolution (vector, scales to any size including 1080p+)
export function getFlagUrl(country: keyof typeof COUNTRY_FLAGS): string {
  const code = COUNTRY_FLAGS[country];
  // Using flagcdn.com - provides high-quality SVG flags
  return `https://flagcdn.com/${code}.svg`;
}

// Get 4K resolution flag (for displays that need raster)
export function getFlag4K(country: keyof typeof COUNTRY_FLAGS): string {
  const code = COUNTRY_FLAGS[country];
  return `https://flagcdn.com/w2560/${code}.png`; // 2560x1920 (4K)
}

// Translation strings for all supported languages
export const translations = {
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    suppliers: "Suppliers",
    metrics: "Metrics",
    pfasCompliance: "PFAS/EPR Compliance",
    buyAmerica: "Buy America Act",
    eudrCompliance: "EUDR Compliance",
    content: "Content Generation",
    
    // Common
    selectCountry: "Select Country",
    selectFramework: "Select Framework",
    viewDetails: "View Details",
    generateRFQ: "Generate RFQ",
    filter: "Filter",
    search: "Search",
    
    // Frameworks
    pfasTitle: "PFAS-Free Packaging Suppliers",
    pfasDescription: "Certified suppliers for sustainable, PFAS-free food service packaging compliant with US state regulations",
    buyAmericaTitle: "Buy America Certified Suppliers",
    buyAmericaDescription: "100% domestic manufacturing for federal infrastructure projects and government contracts",
    eudrTitle: "EUDR Deforestation-Free Suppliers",
    eudrDescription: "Zero-deforestation verified agricultural commodities for EU market with polygon-level GPS tracking",
  },
  
  pt: {
    // Navigation
    home: "Início",
    dashboard: "Painel",
    suppliers: "Fornecedores",
    metrics: "Métricas",
    pfasCompliance: "Conformidade PFAS/EPR",
    buyAmerica: "Lei Buy America",
    eudrCompliance: "Conformidade EUDR",
    content: "Geração de Conteúdo",
    
    // Common
    selectCountry: "Selecionar País",
    selectFramework: "Selecionar Framework",
    viewDetails: "Ver Detalhes",
    generateRFQ: "Gerar RFQ",
    filter: "Filtrar",
    search: "Buscar",
    
    // Frameworks
    pfasTitle: "Fornecedores de Embalagens Sem PFAS",
    pfasDescription: "Fornecedores certificados para embalagens sustentáveis sem PFAS compatíveis com regulamentações dos EUA",
    buyAmericaTitle: "Fornecedores Certificados Buy America",
    buyAmericaDescription: "100% fabricação doméstica para projetos federais de infraestrutura e contratos governamentais",
    eudrTitle: "Fornecedores Livres de Desmatamento EUDR",
    eudrDescription: "Commodities agrícolas verificadas sem desmatamento para mercado da UE com rastreamento GPS de polígonos",
  },
  
  es: {
    // Navigation
    home: "Inicio",
    dashboard: "Panel",
    suppliers: "Proveedores",
    metrics: "Métricas",
    pfasCompliance: "Cumplimiento PFAS/EPR",
    buyAmerica: "Ley Buy America",
    eudrCompliance: "Cumplimiento EUDR",
    content: "Generación de Contenido",
    
    // Common
    selectCountry: "Seleccionar País",
    selectFramework: "Seleccionar Marco",
    viewDetails: "Ver Detalles",
    generateRFQ: "Generar RFQ",
    filter: "Filtrar",
    search: "Buscar",
    
    // Frameworks
    pfasTitle: "Proveedores de Envases Sin PFAS",
    pfasDescription: "Proveedores certificados para envases sostenibles sin PFAS conformes con regulaciones estatales de EE.UU.",
    buyAmericaTitle: "Proveedores Certificados Buy America",
    buyAmericaDescription: "100% fabricación doméstica para proyectos federales de infraestructura y contratos gubernamentales",
    eudrTitle: "Proveedores Libres de Deforestación EUDR",
    eudrDescription: "Productos agrícolas verificados sin deforestación para mercado de la UE con seguimiento GPS a nivel de polígono",
  },
  
  fr: {
    // Navigation
    home: "Accueil",
    dashboard: "Tableau de bord",
    suppliers: "Fournisseurs",
    metrics: "Métriques",
    pfasCompliance: "Conformité PFAS/EPR",
    buyAmerica: "Buy America Act",
    eudrCompliance: "Conformité EUDR",
    content: "Génération de Contenu",
    
    // Common
    selectCountry: "Sélectionner le Pays",
    selectFramework: "Sélectionner le Cadre",
    viewDetails: "Voir les Détails",
    generateRFQ: "Générer RFQ",
    filter: "Filtrer",
    search: "Rechercher",
    
    // Frameworks
    pfasTitle: "Fournisseurs d'Emballages Sans PFAS",
    pfasDescription: "Fournisseurs certifiés pour emballages durables sans PFAS conformes aux réglementations des États américains",
    buyAmericaTitle: "Fournisseurs Certifiés Buy America",
    buyAmericaDescription: "100% fabrication domestique pour projets d'infrastructure fédéraux et contrats gouvernementaux",
    eudrTitle: "Fournisseurs Sans Déforestation EUDR",
    eudrDescription: "Produits agricoles vérifiés sans déforestation pour marché UE avec suivi GPS au niveau du polygone",
  },
  
  de: {
    // Navigation
    home: "Startseite",
    dashboard: "Dashboard",
    suppliers: "Lieferanten",
    metrics: "Metriken",
    pfasCompliance: "PFAS/EPR-Konformität",
    buyAmerica: "Buy America Act",
    eudrCompliance: "EUDR-Konformität",
    content: "Inhaltsgenerierung",
    
    // Common
    selectCountry: "Land auswählen",
    selectFramework: "Framework auswählen",
    viewDetails: "Details anzeigen",
    generateRFQ: "RFQ generieren",
    filter: "Filtern",
    search: "Suchen",
    
    // Frameworks
    pfasTitle: "PFAS-freie Verpackungslieferanten",
    pfasDescription: "Zertifizierte Lieferanten für nachhaltige PFAS-freie Lebensmittelverpackungen gemäß US-Bundesstaatsvorschriften",
    buyAmericaTitle: "Buy America Zertifizierte Lieferanten",
    buyAmericaDescription: "100% inländische Fertigung für bundesstaatliche Infrastrukturprojekte und Regierungsaufträge",
    eudrTitle: "EUDR Entwaldungsfreie Lieferanten",
    eudrDescription: "Entwaldungsfreie verifizierte Agrarrohstoffe für EU-Markt mit polygonbasierter GPS-Verfolgung",
  },
  
  it: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    suppliers: "Fornitori",
    metrics: "Metriche",
    pfasCompliance: "Conformità PFAS/EPR",
    buyAmerica: "Buy America Act",
    eudrCompliance: "Conformità EUDR",
    content: "Generazione Contenuti",
    
    // Common
    selectCountry: "Seleziona Paese",
    selectFramework: "Seleziona Framework",
    viewDetails: "Vedi Dettagli",
    generateRFQ: "Genera RFQ",
    filter: "Filtra",
    search: "Cerca",
    
    // Frameworks
    pfasTitle: "Fornitori Imballaggi Senza PFAS",
    pfasDescription: "Fornitori certificati per imballaggi sostenibili senza PFAS conformi alle normative statali USA",
    buyAmericaTitle: "Fornitori Certificati Buy America",
    buyAmericaDescription: "100% produzione domestica per progetti infrastrutturali federali e contratti governativi",
    eudrTitle: "Fornitori Senza Deforestazione EUDR",
    eudrDescription: "Prodotti agricoli verificati senza deforestazione per mercato UE con tracciamento GPS a livello di poligono",
  },
  
  ja: {
    // Navigation
    home: "ホーム",
    dashboard: "ダッシュボード",
    suppliers: "サプライヤー",
    metrics: "メトリクス",
    pfasCompliance: "PFAS/EPR準拠",
    buyAmerica: "Buy America法",
    eudrCompliance: "EUDR準拠",
    content: "コンテンツ生成",
    
    // Common
    selectCountry: "国を選択",
    selectFramework: "フレームワークを選択",
    viewDetails: "詳細を見る",
    generateRFQ: "RFQを生成",
    filter: "フィルター",
    search: "検索",
    
    // Frameworks
    pfasTitle: "PFASフリー包装サプライヤー",
    pfasDescription: "米国州規制に準拠した持続可能なPFASフリー食品サービス包装の認定サプライヤー",
    buyAmericaTitle: "Buy America認定サプライヤー",
    buyAmericaDescription: "連邦インフラプロジェクトおよび政府契約向けの100%国内製造",
    eudrTitle: "EUDR森林破壊フリーサプライヤー",
    eudrDescription: "ポリゴンレベルのGPS追跡を備えたEU市場向けの森林破壊ゼロ検証済み農産物",
  },
  
  zh: {
    // Navigation
    home: "首页",
    dashboard: "仪表板",
    suppliers: "供应商",
    metrics: "指标",
    pfasCompliance: "PFAS/EPR合规",
    buyAmerica: "美国制造法案",
    eudrCompliance: "EUDR合规",
    content: "内容生成",
    
    // Common
    selectCountry: "选择国家",
    selectFramework: "选择框架",
    viewDetails: "查看详情",
    generateRFQ: "生成询价单",
    filter: "筛选",
    search: "搜索",
    
    // Frameworks
    pfasTitle: "无PFAS包装供应商",
    pfasDescription: "符合美国州法规的可持续无PFAS食品服务包装认证供应商",
    buyAmericaTitle: "美国制造认证供应商",
    buyAmericaDescription: "联邦基础设施项目和政府合同的100%国内制造",
    eudrTitle: "EUDR零森林砍伐供应商",
    eudrDescription: "具有多边形级GPS跟踪的欧盟市场零森林砍伐验证农产品",
  },
};

export type TranslationKey = keyof typeof translations.en;
export type Language = keyof typeof translations;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] || translations.en[key];
}
