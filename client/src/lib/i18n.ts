// Internationalization system - Auto-translates entire site based on selected country
// Real countries with 600+ verified suppliers across PFAS, Buy America, EUDR frameworks
export const COUNTRY_FLAGS = {
  "USA": "us",
  "Brazil": "br",
  "China": "cn",
  "Australia": "au",
  "Indonesia": "id",
  "Singapore": "sg",
  "Netherlands": "nl",
  "Switzerland": "ch",
  "Ivory Coast": "ci",
  "Nigeria": "ng",
} as const;

export const COUNTRY_LANGUAGES = {
  "USA": "en",
  "Brazil": "pt",
  "China": "zh",
  "Australia": "en",
  "Indonesia": "en",
  "Singapore": "en",
  "Netherlands": "en",
  "Switzerland": "en",
  "Ivory Coast": "fr",
  "Nigeria": "en",
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
    
    // Hero Section
    worldsFirstBroker: "World's First Circular Compliance Broker",
    heroHeadline: "Virgin + Secondary Materials,",
    heroHeadlinePart2: "All Certified for",
    countriesVerified: "Countries • {count} Verified",
    
    // Hero Value Props
    circularEconomy: "Circular Economy",
    circularEconomyDesc: "Buy surplus certified materials at 30% discount",
    tripleCertification: "Triple Certification",
    tripleCertificationDesc: "PFAS + Buy America + EUDR verified",
    aiPoweredMatching: "AI-Powered Matching",
    aiPoweredMatchingDesc: "Smart surplus-to-demand connections",
    digitalPassports: "Digital Passports",
    digitalPassportsDesc: "GS1 + QR tracking for full traceability",
    heroDescription: "The only platform that combines Circular Economy with Multi-Framework Compliance. Buy verified primary or secondary materials, all certified across three regulatory domains.",
    
    // Home Page Sections
    pureBrokerModel: "Pure Broker Model - Zero Inventory Risk",
    howItWorks: "How BrokerChain Works",
    howItWorksDesc: "We connect buyers with verified suppliers. You get compliant materials, we earn commission.",
    
    // PFAS Section
    pfasFreePackaging: "PFAS-Free Packaging",
    pfasPackagingDesc: "Compostable containers, biodegradable films, recycled materials for food service and retail.",
    bpiCertified: "BPI Certified",
    bpiCertifiedDesc: "Verified compostable materials",
    stateCompliant: "{count}+ State Compliant",
    stateCompliantDesc: "CA, WA, NY, CO regulations covered",
    belowMarket: "{percent}% Below Market",
    belowMarketDesc: "Surplus and secondary materials",
    
    // Buy America Section
    buyAmericaSteel: "Buy America Steel",
    buyAmericaSteelDesc: "100% domestic steel, fasteners, components for federal contracts and infrastructure.",
    samGovVerified: "SAM.gov Verified",
    samGovVerifiedDesc: "Registered federal suppliers",
    metallurgicalProof: "Metallurgical Proof",
    metallurgicalProofDesc: "Full traceability to US mills",
    iatfCertified: "IATF 16949",
    iatfCertifiedDesc: "Automotive quality certified",
    
    // EUDR Section
    eudrCommodities: "EUDR Commodities",
    eudrCommoditiesDesc: "Zero-deforestation coffee, cocoa, palm oil with GPS-verified origin data.",
    gpsCoordinates: "GPS Coordinates",
    gpsCoordinatesDesc: "Polygon-level farm traceability",
    satelliteVerified: "Satellite Verified",
    satelliteVerifiedDesc: "Sentinel-2 imagery confirmation",
    euTracesNT: "EU TRACES NT",
    euTracesNTDesc: "Digital Product Passport ready",
    
    // GS1 + DPP Section
    gs1DppTracking: "GS1 + Digital Product Passport + QR Tracking",
    gs1DppTrackingDesc: "Every product has a unique GS1 barcode, DPP with full compliance documentation, and QR code for instant verification.",
    globalBarcode: "Global Barcode",
    globalBarcodeDesc: "Unique product ID",
    digitalPassport: "Digital Passport",
    digitalPassportDesc: "Full compliance docs",
    instantScan: "Instant Scan",
    instantScanDesc: "Mobile verification",
    traceable: "Traceable",
    traceableDesc: "Origin to delivery",
    howItWorksSteps: "How It Works:",
    step1: "Supplier registers product with GS1 barcode",
    step2: "We create Digital Product Passport with all certifications",
    step3: "QR code generated linking to DPP",
    step4: "Buyer scans QR → sees complete compliance history",
    scanToVerify: "Scan to verify",
    
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
    
    // Hero Section
    worldsFirstBroker: "Primeira Corretora Global de Conformidade Circular",
    heroHeadline: "Materiais Virgens + Secundários,",
    heroHeadlinePart2: "Todos Certificados para",
    countriesVerified: "Países • {count} Verificados",
    
    // Hero Value Props
    circularEconomy: "Economia Circular",
    circularEconomyDesc: "Compre materiais certificados excedentes com 30% de desconto",
    tripleCertification: "Certificação Tripla",
    tripleCertificationDesc: "PFAS + Buy America + EUDR verificados",
    aiPoweredMatching: "Correspondência com IA",
    aiPoweredMatchingDesc: "Conexões inteligentes de excedente para demanda",
    digitalPassports: "Passaportes Digitais",
    digitalPassportsDesc: "Rastreamento GS1 + QR para rastreabilidade total",
    heroDescription: "A única plataforma que combina Economia Circular com Conformidade Multi-Framework. Compre materiais primários ou secundários verificados, todos certificados em três domínios regulatórios.",
    
    // Home Page Sections
    pureBrokerModel: "Modelo de Corretagem Pura - Risco Zero de Estoque",
    howItWorks: "Como o BrokerChain Funciona",
    howItWorksDesc: "Conectamos compradores com fornecedores verificados. Você recebe materiais conformes, nós ganhamos comissão.",
    
    // PFAS Section
    pfasFreePackaging: "Embalagens Sem PFAS",
    pfasPackagingDesc: "Recipientes compostáveis, filmes biodegradáveis, materiais reciclados para alimentação e varejo.",
    bpiCertified: "Certificado BPI",
    bpiCertifiedDesc: "Materiais compostáveis verificados",
    stateCompliant: "{count}+ Estados Conformes",
    stateCompliantDesc: "Regulamentações CA, WA, NY, CO cobertas",
    belowMarket: "{percent}% Abaixo do Mercado",
    belowMarketDesc: "Materiais excedentes e secundários",
    
    // Buy America Section
    buyAmericaSteel: "Aço Buy America",
    buyAmericaSteelDesc: "100% aço doméstico, fixadores, componentes para contratos federais e infraestrutura.",
    samGovVerified: "Verificado SAM.gov",
    samGovVerifiedDesc: "Fornecedores federais registrados",
    metallurgicalProof: "Prova Metalúrgica",
    metallurgicalProofDesc: "Rastreabilidade completa até usinas dos EUA",
    iatfCertified: "IATF 16949",
    iatfCertifiedDesc: "Qualidade automotiva certificada",
    
    // EUDR Section
    eudrCommodities: "Commodities EUDR",
    eudrCommoditiesDesc: "Café, cacau, óleo de palma sem desmatamento com dados de origem verificados por GPS.",
    gpsCoordinates: "Coordenadas GPS",
    gpsCoordinatesDesc: "Rastreabilidade de fazenda em nível de polígono",
    satelliteVerified: "Verificado por Satélite",
    satelliteVerifiedDesc: "Confirmação de imagens Sentinel-2",
    euTracesNT: "EU TRACES NT",
    euTracesNTDesc: "Passaporte Digital de Produto pronto",
    
    // GS1 + DPP Section
    gs1DppTracking: "GS1 + Passaporte Digital de Produto + Rastreamento QR",
    gs1DppTrackingDesc: "Cada produto tem um código de barras GS1 único, DPP com documentação de conformidade completa e código QR para verificação instantânea.",
    globalBarcode: "Código de Barras Global",
    globalBarcodeDesc: "ID de produto único",
    digitalPassport: "Passaporte Digital",
    digitalPassportDesc: "Documentos de conformidade completos",
    instantScan: "Escaneamento Instantâneo",
    instantScanDesc: "Verificação móvel",
    traceable: "Rastreável",
    traceableDesc: "Da origem à entrega",
    howItWorksSteps: "Como Funciona:",
    step1: "Fornecedor registra produto com código de barras GS1",
    step2: "Criamos Passaporte Digital de Produto com todas as certificações",
    step3: "Código QR gerado vinculando ao DPP",
    step4: "Comprador escaneia QR → vê histórico completo de conformidade",
    scanToVerify: "Escanear para verificar",
    
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
    
    // Hero Section - Copy from EN (temporary)
    worldsFirstBroker: "World's First Circular Compliance Broker",
    heroHeadline: "Virgin + Secondary Materials,",
    heroHeadlinePart2: "All Certified for",
    countriesVerified: "Countries • {count} Verified",
    circularEconomy: "Circular Economy",
    circularEconomyDesc: "Buy surplus certified materials at 30% discount",
    tripleCertification: "Triple Certification",
    tripleCertificationDesc: "PFAS + Buy America + EUDR verified",
    aiPoweredMatching: "AI-Powered Matching",
    aiPoweredMatchingDesc: "Smart surplus-to-demand connections",
    digitalPassports: "Digital Passports",
    digitalPassportsDesc: "GS1 + QR tracking for full traceability",
    heroDescription: "The only platform that combines Circular Economy with Multi-Framework Compliance. Buy verified primary or secondary materials, all certified across three regulatory domains.",
    pureBrokerModel: "Pure Broker Model - Zero Inventory Risk",
    howItWorks: "How BrokerChain Works",
    howItWorksDesc: "We connect buyers with verified suppliers. You get compliant materials, we earn commission.",
    pfasFreePackaging: "PFAS-Free Packaging",
    pfasPackagingDesc: "Compostable containers, biodegradable films, recycled materials for food service and retail.",
    bpiCertified: "BPI Certified",
    bpiCertifiedDesc: "Verified compostable materials",
    stateCompliant: "{count}+ State Compliant",
    stateCompliantDesc: "CA, WA, NY, CO regulations covered",
    belowMarket: "{percent}% Below Market",
    belowMarketDesc: "Surplus and secondary materials",
    buyAmericaSteel: "Buy America Steel",
    buyAmericaSteelDesc: "100% domestic steel, fasteners, components for federal contracts and infrastructure.",
    samGovVerified: "SAM.gov Verified",
    samGovVerifiedDesc: "Registered federal suppliers",
    metallurgicalProof: "Metallurgical Proof",
    metallurgicalProofDesc: "Full traceability to US mills",
    iatfCertified: "IATF 16949",
    iatfCertifiedDesc: "Automotive quality certified",
    eudrCommodities: "EUDR Commodities",
    eudrCommoditiesDesc: "Zero-deforestation coffee, cocoa, palm oil with GPS-verified origin data.",
    gpsCoordinates: "GPS Coordinates",
    gpsCoordinatesDesc: "Polygon-level farm traceability",
    satelliteVerified: "Satellite Verified",
    satelliteVerifiedDesc: "Sentinel-2 imagery confirmation",
    euTracesNT: "EU TRACES NT",
    euTracesNTDesc: "Digital Product Passport ready",
    gs1DppTracking: "GS1 + Digital Product Passport + QR Tracking",
    gs1DppTrackingDesc: "Every product has a unique GS1 barcode, DPP with full compliance documentation, and QR code for instant verification.",
    globalBarcode: "Global Barcode",
    globalBarcodeDesc: "Unique product ID",
    digitalPassport: "Digital Passport",
    digitalPassportDesc: "Full compliance docs",
    instantScan: "Instant Scan",
    instantScanDesc: "Mobile verification",
    traceable: "Traceable",
    traceableDesc: "Origin to delivery",
    howItWorksSteps: "How It Works:",
    step1: "Supplier registers product with GS1 barcode",
    step2: "We create Digital Product Passport with all certifications",
    step3: "QR code generated linking to DPP",
    step4: "Buyer scans QR → sees complete compliance history",
    scanToVerify: "Scan to verify",
    
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
    
    // Hero Section
    worldsFirstBroker: "全球首个循环合规经纪平台",
    heroHeadline: "原料 + 二级材料，",
    heroHeadlinePart2: "全部认证符合",
    countriesVerified: "个国家 • {count} 已验证",
    
    // Hero Value Props
    circularEconomy: "循环经济",
    circularEconomyDesc: "以30%折扣购买经认证的剩余材料",
    tripleCertification: "三重认证",
    tripleCertificationDesc: "PFAS + 美国制造 + EUDR已验证",
    aiPoweredMatching: "AI智能匹配",
    aiPoweredMatchingDesc: "智能剩余到需求连接",
    digitalPassports: "数字护照",
    digitalPassportsDesc: "GS1 + 二维码跟踪全程可追溯",
    heroDescription: "唯一结合循环经济与多框架合规的平台。购买经验证的原材料或二级材料，全部通过三个监管领域认证。",
    
    // Home Page Sections
    pureBrokerModel: "纯经纪模式 - 零库存风险",
    howItWorks: "BrokerChain 如何运作",
    howItWorksDesc: "我们连接买家与经认证的供应商。您获得合规材料，我们赚取佣金。",
    
    // PFAS Section
    pfasFreePackaging: "无PFAS包装",
    pfasPackagingDesc: "可堆肥容器、可降解薄膜、用于食品服务和零售的回收材料。",
    bpiCertified: "BPI认证",
    bpiCertifiedDesc: "经验证的可堆肥材料",
    stateCompliant: "{count}+州合规",
    stateCompliantDesc: "CA、WA、NY、CO法规覆盖",
    belowMarket: "低于市场价{percent}%",
    belowMarketDesc: "剩余和二级材料",
    
    // Buy America Section
    buyAmericaSteel: "美国制造钢材",
    buyAmericaSteelDesc: "100%国内钢材、紧固件、联邦合同和基础设施的组件。",
    samGovVerified: "SAM.gov验证",
    samGovVerifiedDesc: "注册联邦供应商",
    metallurgicalProof: "冶金证明",
    metallurgicalProofDesc: "完全可追溯到美国轧钢厂",
    iatfCertified: "IATF 16949",
    iatfCertifiedDesc: "汽车质量认证",
    
    // EUDR Section
    eudrCommodities: "EUDR商品",
    eudrCommoditiesDesc: "零森林砍伐咖啡、可可、棕榈油，具有GPS验证的原产地数据。",
    gpsCoordinates: "GPS坐标",
    gpsCoordinatesDesc: "多边形级农场可追溯性",
    satelliteVerified: "卫星验证",
    satelliteVerifiedDesc: "Sentinel-2影像确认",
    euTracesNT: "欧盟TRACES NT",
    euTracesNTDesc: "数字产品护照就绪",
    
    // GS1 + DPP Section
    gs1DppTracking: "GS1 + 数字产品护照 + 二维码跟踪",
    gs1DppTrackingDesc: "每个产品都有唯一的GS1条形码、包含完整合规文档的DPP和用于即时验证的二维码。",
    globalBarcode: "全球条形码",
    globalBarcodeDesc: "唯一产品ID",
    digitalPassport: "数字护照",
    digitalPassportDesc: "完整合规文档",
    instantScan: "即时扫描",
    instantScanDesc: "移动验证",
    traceable: "可追溯",
    traceableDesc: "从原产地到交付",
    howItWorksSteps: "如何运作：",
    step1: "供应商使用GS1条形码注册产品",
    step2: "我们创建包含所有认证的数字产品护照",
    step3: "生成链接到DPP的二维码",
    step4: "买家扫描二维码 → 查看完整合规历史",
    scanToVerify: "扫描验证",
    
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
