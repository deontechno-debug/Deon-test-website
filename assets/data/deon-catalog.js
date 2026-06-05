/* ============================================================
   DEON CONTENT RELATIONSHIP MODEL  (window.DEON_CATALOG)
   Single source of truth for the whole Industry ecosystem.
   Entities cross-reference by id only:
     Market → Segment → Application → Product Family → Product
                                   ↘ Resource ↙
   Applications are FIRST-CLASS and reused across markets.
   Consumed via the query API in assets/deon-data.js.
   Content is placeholder-grade; structure is production-grade.
   ============================================================ */
(function () {
  'use strict';

  var MARKETS = [
    { id: "electronics", name: "Electronics", slug: "electronics", page: "electronics.html",
      tagline: "Electronic adhesive solutions for the next generation of devices",
      segments: ["pcb-assembly", "displays", "battery-packs", "consumer-electronics"], status: "live" },
    { id: "automotive", name: "Automotive & Transportation", slug: "automotive", page: "#",
      tagline: "Bonding, protecting and insulating across the modern vehicle",
      segments: ["wire-harnessing", "interior-components", "surface-protection-auto", "ev-battery-systems"], status: "planned" },
    { id: "electrical", name: "Electrical & Insulation", slug: "electrical", page: "#",
      tagline: "Insulation and assembly solutions for electrical equipment",
      segments: ["cable-harnessing", "transformer-insulation", "motor-winding", "electrical-assembly"], status: "planned" },
    { id: "packaging", name: "Packaging & Logistics", slug: "packaging", page: "#",
      tagline: "Secure, efficient and sustainable packaging solutions",
      segments: ["carton-sealing", "palletising", "tamper-evidence"], status: "planned" },
    { id: "appliance", name: "Appliance Manufacturing", slug: "appliance", page: "#",
      tagline: "Bonding, sealing and insulation for durable appliances",
      segments: ["appliance-assembly", "insulation-sealing", "trim-fixation"], status: "planned" },
    { id: "hvac-metal", name: "HVAC & Metal Processing", slug: "hvac-metal", page: "#",
      tagline: "Masking, joining and protection for metal and HVAC",
      segments: ["surface-masking", "duct-sealing", "metal-protection"], status: "planned" },
    { id: "construction", name: "Construction & Building Components", slug: "construction", page: "#",
      tagline: "Sealing, mounting and protection for building components",
      segments: ["facade-mounting", "sealing-glazing", "site-protection"], status: "planned" },
    { id: "renewable", name: "Renewable Energy", slug: "renewable", page: "#",
      tagline: "Bonding and protection for solar and energy storage",
      segments: ["pv-module-assembly", "battery-storage", "wind-components"], status: "planned" }
  ];

  // Segments belong to a market and group applications.
  var SEGMENTS = [
    { id: "pcb-assembly", name: "PCB Assembly", marketId: "electronics",
      summary: "Bonding, masking and thermal control across densely populated boards.",
      applications: ["component-fixation", "solder-masking", "heat-sink-bonding", "emi-shielding"] },
    { id: "displays", name: "Displays", marketId: "electronics",
      summary: "Optically matched bonding and sealing for display modules.",
      applications: ["display-frame-bonding", "optical-lamination", "gasketing-sealing"] },
    { id: "battery-packs", name: "Battery Packs", marketId: "electronics",
      summary: "Insulation, fixation and thermal management for battery assemblies.",
      applications: ["cell-insulation", "busbar-insulation", "cell-fixation", "heat-sink-bonding"] },
    { id: "consumer-electronics", name: "Consumer Electronics", marketId: "electronics",
      summary: "Discreet, rework-friendly bonding for compact devices.",
      applications: ["housing-cosmetic-bonding", "speaker-module-mounting", "rework-fixation", "surface-protection", "emi-shielding", "gasketing-sealing"] },

    // Automotive & Transportation
    { id: "wire-harnessing", name: "Wire Harnessing", marketId: "automotive", summary: "Bundling, abrasion protection and noise damping for wire harnesses.", applications: ["wire-harness-wrapping"] },
    { id: "interior-components", name: "Interior Components", marketId: "automotive", summary: "Bonding and sealing of trims, panels and interior assemblies.", applications: ["gasketing-sealing", "surface-protection"] },
    { id: "surface-protection-auto", name: "Surface Protection", marketId: "automotive", summary: "Masking and temporary protection through paint and assembly.", applications: ["surface-protection", "paint-masking"] },
    { id: "ev-battery-systems", name: "EV Battery Systems", marketId: "automotive", summary: "Insulation, fixation and thermal management for EV battery packs.", applications: ["cell-insulation", "busbar-insulation", "cell-fixation", "heat-sink-bonding"] },

    // Electrical & Insulation
    { id: "cable-harnessing", name: "Cable Harnessing", marketId: "electrical", summary: "Bundling and protection of cables and looms.", applications: ["wire-harness-wrapping"] },
    { id: "transformer-insulation", name: "Transformer Insulation", marketId: "electrical", summary: "Dielectric interlayer insulation for transformers.", applications: ["layer-insulation"] },
    { id: "motor-winding", name: "Motor Winding", marketId: "electrical", summary: "Insulation and fixation for motor and generator windings.", applications: ["coil-fixation", "layer-insulation"] },
    { id: "electrical-assembly", name: "Electrical Assembly", marketId: "electrical", summary: "Component fixation and insulation in electrical equipment.", applications: ["component-fixation", "busbar-insulation"] },

    // Packaging & Logistics
    { id: "carton-sealing", name: "Carton Sealing", marketId: "packaging", summary: "Reliable carton closure across temperatures and speeds.", applications: ["carton-sealing-app"] },
    { id: "palletising", name: "Palletising & Unitising", marketId: "packaging", summary: "Strapping and bundling for safe load unitisation.", applications: ["pallet-securing"] },
    { id: "tamper-evidence", name: "Tamper Evidence", marketId: "packaging", summary: "Security closures that protect brand and product integrity.", applications: ["tamper-evidence-app"] },

    // Appliance Manufacturing
    { id: "appliance-assembly", name: "Appliance Assembly", marketId: "appliance", summary: "Component fixation and thermal control in appliances.", applications: ["component-fixation", "heat-sink-bonding"] },
    { id: "insulation-sealing", name: "Insulation & Sealing", marketId: "appliance", summary: "Gasketing, sealing and surface protection.", applications: ["gasketing-sealing", "surface-protection"] },
    { id: "trim-fixation", name: "Trim & Panel Fixation", marketId: "appliance", summary: "Discreet bonding of trims, panels and badges.", applications: ["surface-protection", "gasketing-sealing"] },

    // HVAC & Metal Processing
    { id: "surface-masking", name: "Surface Masking", marketId: "hvac-metal", summary: "Paint and surface masking for metal processing.", applications: ["paint-masking"] },
    { id: "duct-sealing", name: "Duct Sealing", marketId: "hvac-metal", summary: "Sealing and joining of ducts, foils and metal.", applications: ["duct-sealing-app"] },
    { id: "metal-protection", name: "Metal Protection", marketId: "hvac-metal", summary: "Temporary protection of finished metal surfaces.", applications: ["surface-protection"] },

    // Construction & Building Components
    { id: "facade-mounting", name: "Facade Mounting", marketId: "construction", summary: "Structural mounting of panels and facade elements.", applications: ["panel-mounting"] },
    { id: "sealing-glazing", name: "Sealing & Glazing", marketId: "construction", summary: "Gasketing and sealing for glazing and components.", applications: ["gasketing-sealing"] },
    { id: "site-protection", name: "Site Protection", marketId: "construction", summary: "Temporary protection of surfaces on site.", applications: ["surface-protection"] },

    // Renewable Energy
    { id: "pv-module-assembly", name: "PV Module Assembly", marketId: "renewable", summary: "Mounting and sealing of solar module components.", applications: ["panel-mounting", "gasketing-sealing"] },
    { id: "battery-storage", name: "Battery Storage", marketId: "renewable", summary: "Insulation and fixation for energy-storage packs.", applications: ["cell-insulation", "busbar-insulation", "cell-fixation"] },
    { id: "wind-components", name: "Wind Components", marketId: "renewable", summary: "Structural bonding and protection for wind components.", applications: ["blade-bonding"] }
  ];

  // Applications — FIRST-CLASS entities, reusable across markets/segments.
  // markets[] longer than one = cross-market connective tissue.
  var APPLICATIONS = [
    { id: "component-fixation", name: "Component Fixation", slug: "component-fixation",
      markets: ["electronics"], segments: ["pcb-assembly"],
      summary: "Holding SMDs, shields and connectors in place before and during reflow.",
      challenges: ["Low-profile bonding on fine-pitch components", "Surviving reflow temperatures up to 260°C", "Repositionable yet secure placement"],
      productFamilies: ["thin-double-sided-pet-tapes", "high-temperature-masking-tapes"],
      resources: ["res-pcb-guide"] },
    { id: "solder-masking", name: "Solder Masking", slug: "solder-masking",
      markets: ["electronics"], segments: ["pcb-assembly"],
      summary: "Protecting gold fingers, contacts and openings from solder and flux.",
      challenges: ["Clean, residue-free removal after soldering", "Withstanding wave and reflow temperatures", "Sharp masking edges on fine features"],
      productFamilies: ["high-temperature-masking-tapes"],
      resources: ["res-pcb-guide"] },
    { id: "heat-sink-bonding", name: "Heat-Sink Bonding & Thermal Management", slug: "heat-sink-bonding",
      markets: ["electronics", "appliance", "automotive"], segments: ["pcb-assembly", "battery-packs"],
      summary: "Thermally coupling heat sinks, spreaders and modules to dissipate heat without fasteners.",
      challenges: ["Heat transfer plus mechanical bond in one step", "Filling gaps on uneven surfaces", "Long-term reliability under thermal cycling"],
      productFamilies: ["thermally-conductive-tapes"],
      resources: ["res-pcb-guide", "res-battery-guide"] },
    { id: "emi-shielding", name: "EMI Shielding & Grounding", slug: "emi-shielding",
      markets: ["electronics", "automotive"], segments: ["pcb-assembly", "consumer-electronics"],
      summary: "Electrically conductive bonding for shielding cans, gaskets and grounding paths.",
      challenges: ["Low, stable contact resistance", "Conformability to shield geometry", "Corrosion resistance at the bond line"],
      productFamilies: ["emi-shielding-tapes"],
      resources: ["res-pcb-guide"] },
    { id: "display-frame-bonding", name: "Display Frame Bonding", slug: "display-frame-bonding",
      markets: ["electronics"], segments: ["displays"],
      summary: "Mounting the display panel to the housing with thin, high-strength tapes.",
      challenges: ["Thin bezels with high bond strength", "Bonding to low-surface-energy plastics", "Shock and drop resistance"],
      productFamilies: ["high-bond-double-sided-tapes"],
      resources: ["res-display-brochure"] },
    { id: "optical-lamination", name: "Optical Lamination", slug: "optical-lamination",
      markets: ["electronics"], segments: ["displays"],
      summary: "Bonding cover lenses and touch sensors with optically clear adhesives.",
      challenges: ["Zero haze and no trapped bubbles", "Refractive-index matching", "Reworkability of expensive modules"],
      productFamilies: ["optically-clear-adhesives"],
      resources: ["res-display-brochure"] },
    { id: "gasketing-sealing", name: "Gasketing & Sealing", slug: "gasketing-sealing",
      markets: ["electronics", "appliance", "automotive"], segments: ["displays", "consumer-electronics"],
      summary: "Foam tapes that cushion, gasket and seal perimeters against dust and moisture.",
      challenges: ["Consistent compression and sealing", "Ingress protection (IP) ratings", "Vibration damping"],
      productFamilies: ["foam-sealing-tapes", "acoustic-foam-tapes"],
      resources: ["res-display-brochure"] },
    { id: "cell-insulation", name: "Cell-to-Cell Insulation", slug: "cell-insulation",
      markets: ["electronics", "automotive"], segments: ["battery-packs"],
      summary: "Dielectric films and tapes between cylindrical or pouch cells.",
      challenges: ["High dielectric strength in thin layers", "Flame retardancy across the pack", "Accommodating cell swelling"],
      productFamilies: ["electrical-insulation-tapes", "flame-retardant-tapes"],
      resources: ["res-battery-guide"] },
    { id: "busbar-insulation", name: "Busbar & Terminal Insulation", slug: "busbar-insulation",
      markets: ["electronics", "automotive"], segments: ["battery-packs"],
      summary: "Protecting high-voltage busbars and terminals from short circuits.",
      challenges: ["High-voltage isolation", "Conformability around terminals", "Thermal and flame resistance"],
      productFamilies: ["electrical-insulation-tapes", "flame-retardant-tapes"],
      resources: ["res-battery-guide"] },
    { id: "cell-fixation", name: "Cell & Module Fixation", slug: "cell-fixation",
      markets: ["electronics", "automotive"], segments: ["battery-packs"],
      summary: "Bonding cells and modules to withstand vibration and shock.",
      challenges: ["High shear strength under vibration", "Accommodating swelling and tolerance", "Lightweight, fastener-free assembly"],
      productFamilies: ["structural-bonding-tapes"],
      resources: ["res-battery-guide"] },
    { id: "housing-cosmetic-bonding", name: "Housing & Cosmetic Bonding", slug: "housing-cosmetic-bonding",
      markets: ["electronics"], segments: ["consumer-electronics"],
      summary: "Mounting covers, trims and cosmetic parts with thin, invisible tapes.",
      challenges: ["Invisible, ultra-thin bond lines", "Bonding to coated and textured plastics", "High initial tack for fast assembly"],
      productFamilies: ["thin-bonding-tapes", "high-bond-double-sided-tapes"],
      resources: ["res-consumer-overview"] },
    { id: "speaker-module-mounting", name: "Speaker & Module Mounting", slug: "speaker-module-mounting",
      markets: ["electronics"], segments: ["consumer-electronics"],
      summary: "Acoustic-grade foams that mount, seal and cushion speaker and sensor modules.",
      challenges: ["Acoustic sealing", "Vibration and shock damping", "Thin profile in tight cavities"],
      productFamilies: ["acoustic-foam-tapes", "foam-sealing-tapes"],
      resources: ["res-consumer-overview"] },
    { id: "rework-fixation", name: "Rework-Friendly Fixation", slug: "rework-fixation",
      markets: ["electronics"], segments: ["consumer-electronics"],
      summary: "Stretch-release tapes for serviceable, repairable assemblies.",
      challenges: ["Residue-free removal for repair", "Secure hold during use", "Battery and module serviceability"],
      productFamilies: ["stretch-release-tapes"],
      resources: ["res-consumer-overview"] },
    { id: "surface-protection", name: "Surface Protection", slug: "surface-protection",
      markets: ["electronics", "automotive", "appliance", "construction", "hvac-metal"], segments: ["consumer-electronics", "surface-protection-auto", "metal-protection", "site-protection"],
      summary: "Temporary protective films that shield finished surfaces through assembly and transport.",
      challenges: ["Clean removal with no residue or marking", "UV and ageing stability", "Reliable adhesion without lifting"],
      productFamilies: ["surface-protection-films", "thin-bonding-tapes"],
      resources: ["res-consumer-overview", "res-industrial-guide"] },

    // ---- Cross-market industrial applications (drive the non-electronics markets) ----
    { id: "wire-harness-wrapping", name: "Wire Harness Wrapping", slug: "wire-harness-wrapping",
      markets: ["automotive", "electrical"], segments: ["wire-harnessing", "cable-harnessing"],
      summary: "Bundling, abrasion protection and noise damping for wire harnesses and cable looms.",
      challenges: ["Abrasion and heat protection", "Noise and rattle damping", "Hand-tearable, fast application"],
      productFamilies: ["pvc-electrical-tapes", "cloth-harness-tapes"], resources: ["res-industrial-guide"] },
    { id: "layer-insulation", name: "Layer & Winding Insulation", slug: "layer-insulation",
      markets: ["electrical"], segments: ["transformer-insulation", "motor-winding"],
      summary: "Dielectric interlayer insulation for transformers, coils and windings.",
      challenges: ["High dielectric strength", "Thermal-class endurance", "Conformable to windings"],
      productFamilies: ["polyester-tapes", "electrical-insulation-tapes"], resources: ["res-industrial-guide"] },
    { id: "coil-fixation", name: "Coil & Winding Fixation", slug: "coil-fixation",
      markets: ["electrical"], segments: ["motor-winding"],
      summary: "Securing windings and coils against vibration and thermal cycling.",
      challenges: ["Vibration resistance", "Thermal endurance", "Thin, consistent profile"],
      productFamilies: ["polyester-tapes", "structural-bonding-tapes"], resources: ["res-industrial-guide"] },
    { id: "carton-sealing-app", name: "Carton Sealing", slug: "carton-sealing",
      markets: ["packaging"], segments: ["carton-sealing"],
      summary: "Reliable closure of cartons across temperatures, substrates and line speeds.",
      challenges: ["Adhesion to recycled board", "Cold-temperature performance", "High-speed machine application"],
      productFamilies: ["bopp-packaging-tapes"], resources: ["res-industrial-guide"] },
    { id: "pallet-securing", name: "Pallet & Load Securing", slug: "pallet-securing",
      markets: ["packaging"], segments: ["palletising"],
      summary: "Strapping and bundling for safe pallet and load unitisation.",
      challenges: ["High tensile holding power", "Clean removal", "Edge-tear resistance"],
      productFamilies: ["filament-strapping-tapes", "bopp-packaging-tapes"], resources: ["res-industrial-guide"] },
    { id: "tamper-evidence-app", name: "Tamper Evidence", slug: "tamper-evidence",
      markets: ["packaging"], segments: ["tamper-evidence"],
      summary: "Security closures that reveal tampering and protect brand integrity.",
      challenges: ["Visible tamper indication", "Substrate versatility", "Print and branding capability"],
      productFamilies: ["specialty-industrial-tapes"], resources: ["res-industrial-guide"] },
    { id: "paint-masking", name: "Paint & Surface Masking", slug: "paint-masking",
      markets: ["automotive", "hvac-metal"], segments: ["surface-protection-auto", "surface-masking"],
      summary: "Sharp paint lines and surface masking through coating and curing.",
      challenges: ["Clean, sharp edge lines", "High-temperature curing", "Residue-free removal"],
      productFamilies: ["masking-tapes", "high-temperature-masking-tapes"], resources: ["res-industrial-guide"] },
    { id: "duct-sealing-app", name: "Duct & Joint Sealing", slug: "duct-sealing",
      markets: ["hvac-metal", "construction"], segments: ["duct-sealing"],
      summary: "Sealing and joining of ducts, foils and metal components.",
      challenges: ["Air-tight sealing", "Temperature resistance", "Adhesion to metal and foil"],
      productFamilies: ["foil-tapes", "foam-sealing-tapes"], resources: ["res-industrial-guide"] },
    { id: "panel-mounting", name: "Panel & Facade Mounting", slug: "panel-mounting",
      markets: ["construction", "renewable"], segments: ["facade-mounting", "pv-module-assembly"],
      summary: "Structural mounting of panels, trims and facade elements.",
      challenges: ["Long-term weather durability", "High static load", "Thermal-expansion accommodation"],
      productFamilies: ["high-bond-double-sided-tapes", "foam-sealing-tapes"], resources: ["res-industrial-guide"] },
    { id: "blade-bonding", name: "Component & Blade Bonding", slug: "blade-bonding",
      markets: ["renewable"], segments: ["wind-components"],
      summary: "Structural bonding and protection for wind and energy components.",
      challenges: ["High structural strength", "Weather and UV durability", "Vibration-fatigue resistance"],
      productFamilies: ["structural-bonding-tapes", "surface-protection-films"], resources: ["res-industrial-guide"] }
  ];

  // Product families group products and map to applications.
  var PRODUCT_FAMILIES = [
    { id: "high-temperature-masking-tapes", name: "High-Temperature Masking Tapes", slug: "high-temperature-masking-tapes", note: "PET & polyimide backings to 260°C" },
    { id: "thermally-conductive-tapes", name: "Thermally Conductive Tapes", slug: "thermally-conductive-tapes", note: "Bond and dissipate heat in one step" },
    { id: "thin-double-sided-pet-tapes", name: "Thin Double-Sided PET Tapes", slug: "thin-double-sided-pet-tapes", note: "High-shear component fixation" },
    { id: "optically-clear-adhesives", name: "Optically Clear Adhesives", slug: "optically-clear-adhesives", note: "Haze-free lamination" },
    { id: "high-bond-double-sided-tapes", name: "High-Bond Double-Sided Tapes", slug: "high-bond-double-sided-tapes", note: "Thin-bezel frame mounting" },
    { id: "foam-sealing-tapes", name: "Foam Sealing Tapes", slug: "foam-sealing-tapes", note: "Cushioning and ingress protection" },
    { id: "electrical-insulation-tapes", name: "Electrical Insulation Tapes", slug: "electrical-insulation-tapes", note: "High dielectric strength" },
    { id: "flame-retardant-tapes", name: "Flame-Retardant Tapes", slug: "flame-retardant-tapes", note: "UL 94 V-0 rated backings" },
    { id: "structural-bonding-tapes", name: "Structural Bonding Tapes", slug: "structural-bonding-tapes", note: "Vibration-resistant fixation" },
    { id: "stretch-release-tapes", name: "Stretch-Release Tapes", slug: "stretch-release-tapes", note: "Residue-free removal & rework" },
    { id: "acoustic-foam-tapes", name: "Acoustic Foam Tapes", slug: "acoustic-foam-tapes", note: "Sealing and sound management" },
    { id: "thin-bonding-tapes", name: "Thin Bonding Tapes", slug: "thin-bonding-tapes", note: "Invisible cosmetic mounting" },
    { id: "emi-shielding-tapes", name: "EMI Shielding & Conductive Tapes", slug: "emi-shielding-tapes", note: "Low-resistance grounding" },
    { id: "pvc-electrical-tapes", name: "PVC Electrical Tapes", slug: "pvc-electrical-tapes", note: "Insulation & harness bundling" },
    { id: "cloth-harness-tapes", name: "Cloth Harness Tapes", slug: "cloth-harness-tapes", note: "Abrasion protection & noise damping" },
    { id: "polyester-tapes", name: "Polyester (PET) Tapes", slug: "polyester-tapes", note: "Thermal-class electrical insulation" },
    { id: "bopp-packaging-tapes", name: "BOPP Packaging Tapes", slug: "bopp-packaging-tapes", note: "Carton sealing across temperatures" },
    { id: "filament-strapping-tapes", name: "Filament & Strapping Tapes", slug: "filament-strapping-tapes", note: "High-tensile bundling & unitising" },
    { id: "masking-tapes", name: "Masking Tapes", slug: "masking-tapes", note: "Sharp lines, clean removal" },
    { id: "foil-tapes", name: "Aluminium Foil Tapes", slug: "foil-tapes", note: "Sealing, shielding & heat reflection" },
    { id: "surface-protection-films", name: "Surface Protection Films", slug: "surface-protection-films", note: "Temporary protection through assembly" },
    { id: "specialty-industrial-tapes", name: "Specialty Industrial Tapes", slug: "specialty-industrial-tapes", note: "Tamper, security & custom solutions" }
  ];

  // Individual products — the 24 SKUs (single source of truth; the product
  // database on market pages should read from here). t = total thickness (µm).
  var PRODUCTS = [
    { id: "deon-61562", name: "DEON® 61562 Optically Clear Adhesive", familyId: "optically-clear-adhesives", t: 25, adhesive: "specialty", backing: "none", desc: "25µm moisture-control transparent transfer tape" },
    { id: "deon-ltc-58720", name: "DEON® LTC 58720", familyId: "structural-bonding-tapes", t: 25, adhesive: "low temperature activated reactive adhesive", backing: "none", desc: "25µm low-temperature reactive structural bonding film" },
    { id: "deon-60860", name: "DEON® 60860", familyId: "emi-shielding-tapes", t: 58, adhesive: "conductive acrylic", backing: "tin-plated copper", desc: "58µm single-sided high-conductivity charge-collector tape" },
    { id: "deon-60827", name: "DEON® 60827", familyId: "emi-shielding-tapes", t: 64, adhesive: "conductive acrylic", backing: "aluminium foil", desc: "64µm single-sided black electrically conductive aluminium tape" },
    { id: "deon-70697", name: "DEON® 70697 Bond & Detach®", familyId: "stretch-release-tapes", t: 1300, adhesive: "specialty", backing: "none", desc: "1300µm double-sided black Bond & Detach tape" },
    { id: "deon-68878", name: "DEON® 68878", familyId: "thin-double-sided-pet-tapes", t: 150, adhesive: "acrylic", backing: "PET", desc: "150µm double-sided transparent film tape with 75% bio-based content" },
    { id: "deon-68879", name: "DEON® 68879", familyId: "thin-double-sided-pet-tapes", t: 200, adhesive: "acrylic", backing: "PET", desc: "200µm double-sided transparent film tape with 75% bio-based content" },
    { id: "deon-60735", name: "DEON® 60735", familyId: "thermally-conductive-tapes", t: 50, adhesive: "acrylic", backing: "none", desc: "50µm black thermal-management tape" },
    { id: "deon-60619", name: "DEON® 60619 Bond & Detach®", familyId: "stretch-release-tapes", t: 250, adhesive: "specialty", backing: "none", desc: "250µm double-sided white Bond & Detach tape" },
    { id: "deon-8853-pv41", name: "DEON® 8853 PV41", familyId: "thin-bonding-tapes", t: 50, adhesive: "tackified acrylic", backing: "ultra thin non-woven", desc: "50µm double-sided translucent non-woven tape" },
    { id: "deon-62510", name: "DEON® 62510", familyId: "high-bond-double-sided-tapes", t: 100, adhesive: "acrylic", backing: "PET", desc: "100µm double-sided high-temperature mounting tape" },
    { id: "deon-51970", name: "DEON® 51970", familyId: "thin-bonding-tapes", t: 80, adhesive: "acrylic", backing: "none", desc: "80µm transparent transfer adhesive" },
    { id: "deon-4965", name: "DEON® 4965", familyId: "high-bond-double-sided-tapes", t: 205, adhesive: "acrylic", backing: "PET", desc: "205µm double-sided PET-reinforced mounting tape" },
    { id: "deon-60150", name: "DEON® 60150", familyId: "emi-shielding-tapes", t: 120, adhesive: "conductive acrylic", backing: "aluminium foil", desc: "120µm EMI-shielding conductive tape" },
    { id: "deon-75721", name: "DEON® 75721", familyId: "structural-bonding-tapes", t: 300, adhesive: "low temperature activated reactive adhesive", backing: "none", desc: "300µm reactive structural bonding film" },
    { id: "deon-68546", name: "DEON® 68546", familyId: "high-bond-double-sided-tapes", t: 175, adhesive: "tackified acrylic", backing: "PET", desc: "175µm double-sided film tape for display bonding" },
    { id: "deon-88321", name: "DEON® 88321", familyId: "thin-bonding-tapes", t: 90, adhesive: "tackified acrylic", backing: "ultra thin non-woven", desc: "90µm thin non-woven mounting tape" },
    { id: "deon-50600", name: "DEON® 50600", familyId: "optically-clear-adhesives", t: 45, adhesive: "acrylic", backing: "none", desc: "45µm optically clear bonding tape" },
    { id: "deon-60940", name: "DEON® 60940", familyId: "foam-sealing-tapes", t: 500, adhesive: "specialty", backing: "none", desc: "500µm foamed bonding tape for uneven surfaces" },
    { id: "deon-61395", name: "DEON® 61395", familyId: "thin-bonding-tapes", t: 30, adhesive: "specialty", backing: "none", desc: "30µm ultra-thin transfer tape for fine assemblies" },
    { id: "deon-64210", name: "DEON® 64210", familyId: "emi-shielding-tapes", t: 130, adhesive: "conductive acrylic", backing: "tin-plated copper", desc: "130µm single-sided grounding tape" },
    { id: "deon-69402", name: "DEON® 69402", familyId: "foam-sealing-tapes", t: 800, adhesive: "specialty", backing: "none", desc: "800µm thick double-sided foam mounting tape" },
    { id: "deon-58901", name: "DEON® 58901", familyId: "thin-double-sided-pet-tapes", t: 25, adhesive: "tackified acrylic", backing: "PET", desc: "25µm thin double-sided film tape" },
    { id: "deon-60355", name: "DEON® 60355", familyId: "thermally-conductive-tapes", t: 350, adhesive: "acrylic", backing: "aluminium foil", desc: "350µm thermally conductive aluminium tape" }
  ];

  // Resources attach across the graph (markets + applications).
  var RESOURCES = [
    { id: "res-pcb-guide", title: "PCB assembly tape selection guide", type: "Selection guide", format: "PDF", size: "3.1 MB", url: "#",
      markets: ["electronics"], applications: ["component-fixation", "solder-masking", "heat-sink-bonding", "emi-shielding"] },
    { id: "res-display-brochure", title: "Display bonding & sealing brochure", type: "Brochure", format: "PDF", size: "2.4 MB", url: "#",
      markets: ["electronics"], applications: ["display-frame-bonding", "optical-lamination", "gasketing-sealing"] },
    { id: "res-battery-guide", title: "Battery assembly solutions guide", type: "Solutions guide", format: "PDF", size: "4.0 MB", url: "#",
      markets: ["electronics", "automotive"], applications: ["cell-insulation", "busbar-insulation", "cell-fixation", "heat-sink-bonding"] },
    { id: "res-consumer-overview", title: "Consumer device assembly overview", type: "Overview", format: "PDF", size: "1.9 MB", url: "#",
      markets: ["electronics"], applications: ["housing-cosmetic-bonding", "speaker-module-mounting", "rework-fixation", "surface-protection"] },
    { id: "res-industrial-guide", title: "DEON industrial tape selection guide", type: "Selection guide", format: "PDF", size: "5.2 MB", url: "#",
      markets: ["electronics", "automotive", "electrical", "packaging", "appliance", "hvac-metal", "construction", "renewable"],
      applications: ["wire-harness-wrapping", "paint-masking", "carton-sealing-app", "panel-mounting"] }
  ];

  window.DEON_CATALOG = {
    markets: MARKETS, segments: SEGMENTS, applications: APPLICATIONS,
    productFamilies: PRODUCT_FAMILIES, products: PRODUCTS, resources: RESOURCES
  };
})();
