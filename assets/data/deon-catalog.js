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
      tagline: "Carton sealing, strapping and tamper protection for logistics",
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
      segments: ["pv-module-assembly", "battery-storage", "wind-components"], status: "planned" },

    // Partner markets — SINGLE PAGE, no segments. special:true routes the
    // chrome/explorer to skip segment children; sections[] drives the page body.
    { id: "converter-partners", name: "Industrial Converter Partners", slug: "converter-partners",
      page: "converter-partners.html", status: "live", special: true,
      tagline: "Jumbo and log roll supply for industrial tape converters",
      intro: "DEON coats and supplies adhesive tapes in jumbo and log roll formats for converters who slit, die-cut and finish to their own programs. We sit upstream as your coating and base-material partner — with consistent batch-to-batch quality, flexible roll formats and the technical support to qualify new constructions.",
      segments: [],
      sections: [
        { id: "overview", title: "A coating partner for industrial converters",
          body: "As a manufacturer and coater, DEON supplies adhesive tapes in bulk formats engineered for downstream conversion. Converters rely on us for the base material — coated to specification, wound to tolerance and delivered to a predictable schedule — so they can focus on slitting, die-cutting, printing and finishing. We support both standard constructions and custom-coated programs, backed by the application engineering needed to qualify new products on your lines. [Placeholder copy — DEON narrative to be added.]" },
        { id: "jumbo-roll-supply", title: "Jumbo roll supply",
          body: "Full-width jumbo rolls coated to your specification and wound on standard cores, ready for slitting. Consistent adhesive coat weight, backing gauge and unwind tension across batches keep your slitting and die-cutting lines running with minimal re-qualification. Available across the DEON adhesive and backing portfolio. [Placeholder copy — DEON narrative to be added.]" },
        { id: "log-roll-supply", title: "Log roll supply",
          body: "Pre-slit log rolls in defined widths and lengths for converters who want to skip the first slitting pass. We hold tight width and diameter tolerances and label every roll for traceability, so you receive a press-ready input that drops straight into your finishing operations. [Placeholder copy — DEON narrative to be added.]" },
        { id: "custom-width-programs", title: "Custom width programs",
          body: "Standing slit-to-width programs tailored to your recurring formats. Agree the widths, cores and pack quantities once, and DEON schedules repeat production against your forecast — reducing lead time, minimising trim waste and giving you a reliable, repeatable supply of exactly the formats your customers order. [Placeholder copy — DEON narrative to be added.]" },
        { id: "printed-cores", title: "Printed cores & branding",
          body: "Cores printed with your brand, product codes, batch data or barcodes so the rolls you ship carry your identity from the moment they leave our line. Printed and colour-coded cores also help your operators and customers identify constructions quickly on the shop floor. [Placeholder copy — DEON narrative to be added.]" },
        { id: "technical-support", title: "Technical support",
          body: "Our application engineers help converters select base constructions, troubleshoot adhesion or converting issues and qualify new tapes for end-use. From coat-weight adjustments to backing changes and sample runs, we work alongside your team to get a construction right before it scales. [Placeholder copy — DEON narrative to be added.]" }
      ] },
    { id: "oem-partners", name: "OEM & Private Label Partners", slug: "oem-partners",
      page: "oem-partners.html", status: "live", special: true,
      tagline: "Private-label manufacturing and custom product development",
      intro: "DEON manufactures adhesive tapes under your brand. From private-label production of proven constructions to ground-up custom product development, we act as your behind-the-scenes manufacturing partner — handling coating, converting, packaging and branding so you can bring tape products to market under your own name.",
      segments: [],
      sections: [
        { id: "overview", title: "Your manufacturing partner, your brand",
          body: "OEM and private-label customers come to DEON for manufacturing depth without the capital outlay. We produce adhesive tapes to your specification, package and brand them as your own, and scale production as your demand grows. Whether you are a distributor building a house range or an OEM integrating tape into a finished product, DEON provides the coating, converting and finishing — under your identity. [Placeholder copy — DEON narrative to be added.]" },
        { id: "private-label-manufacturing", title: "Private label manufacturing",
          body: "Proven DEON constructions produced and packaged under your brand. Choose from the existing portfolio, specify your branding and packaging, and we manufacture to your forecast with consistent quality and full batch traceability. A fast route to a credible own-brand tape range without developing products from scratch. [Placeholder copy — DEON narrative to be added.]" },
        { id: "custom-product-development", title: "Custom product development",
          body: "When an existing tape will not do, our R&D and application engineers develop new constructions to your performance targets — selecting adhesives, backings and coat weights, then validating against your test criteria. You get a differentiated product, owned by your brand, built on DEON's coating and converting capability. [Placeholder copy — DEON narrative to be added.]" },
        { id: "packaging-branding", title: "Packaging & branding",
          body: "Finished goods packaged exactly as your market expects — printed cores, branded liners, custom labels, retail or industrial cartons and shelf-ready presentation. We tailor the format to your channel so products arrive ready to sell under your name. [Placeholder copy — DEON narrative to be added.]" },
        { id: "printed-cores", title: "Printed cores & finishing",
          body: "Cores and finishing details printed with your brand, product codes and batch information for traceability and on-shelf identity. Colour-coding and custom core sizes are available to match your existing range and help end users identify products at a glance. [Placeholder copy — DEON narrative to be added.]" },
        { id: "manufacturing-scale-up", title: "Manufacturing scale-up",
          body: "Start with pilot quantities to validate the market, then scale into full production on the same lines and specification — no re-qualification, no surprises. DEON's capacity and supply reliability let your own-brand programs grow from launch volumes to high-volume manufacturing on a predictable schedule. [Placeholder copy — DEON narrative to be added.]" }
      ] }
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
    { id: "deon-60355", name: "DEON® 60355", familyId: "thermally-conductive-tapes", t: 350, adhesive: "acrylic", backing: "aluminium foil", desc: "350µm thermally conductive aluminium tape" },

    // Placeholder SKUs extending the non-electronics families so every market's
    // product finder is populated. [Replace with real DEON product data.]
    { id: "deon-pvc-15", name: "DEON® PVC 15", familyId: "pvc-electrical-tapes", t: 150, adhesive: "rubber", backing: "PVC", desc: "150µm general-purpose PVC insulation tape" },
    { id: "deon-pvc-19", name: "DEON® PVC 19", familyId: "pvc-electrical-tapes", t: 190, adhesive: "rubber", backing: "PVC", desc: "190µm heavy-duty PVC harness tape" },
    { id: "deon-pvc-13", name: "DEON® PVC 13", familyId: "pvc-electrical-tapes", t: 130, adhesive: "rubber", backing: "PVC", desc: "130µm thin flexible PVC tape" },
    { id: "deon-cht-205", name: "DEON® CHT 205", familyId: "cloth-harness-tapes", t: 205, adhesive: "acrylic", backing: "PET fleece", desc: "205µm abrasion-protection fleece harness tape" },
    { id: "deon-cht-260", name: "DEON® CHT 260", familyId: "cloth-harness-tapes", t: 260, adhesive: "rubber", backing: "PET fleece", desc: "260µm noise-damping fleece harness tape" },
    { id: "deon-cht-310", name: "DEON® CHT 310", familyId: "cloth-harness-tapes", t: 310, adhesive: "rubber", backing: "cotton cloth", desc: "310µm high-abrasion cloth harness tape" },
    { id: "deon-pet-25b", name: "DEON® PET 25", familyId: "polyester-tapes", t: 25, adhesive: "acrylic", backing: "PET", desc: "25µm thin polyester insulation tape" },
    { id: "deon-pet-50b", name: "DEON® PET 50", familyId: "polyester-tapes", t: 50, adhesive: "silicone", backing: "PET", desc: "50µm high-temperature polyester tape" },
    { id: "deon-pet-75b", name: "DEON® PET 75", familyId: "polyester-tapes", t: 75, adhesive: "acrylic", backing: "PET", desc: "75µm polyester layer-insulation tape" },
    { id: "deon-bopp-40", name: "DEON® BOPP 40", familyId: "bopp-packaging-tapes", t: 40, adhesive: "hotmelt", backing: "BOPP", desc: "40µm general-purpose carton-sealing tape" },
    { id: "deon-bopp-48", name: "DEON® BOPP 48", familyId: "bopp-packaging-tapes", t: 48, adhesive: "acrylic", backing: "BOPP", desc: "48µm low-noise acrylic packaging tape" },
    { id: "deon-bopp-55", name: "DEON® BOPP 55", familyId: "bopp-packaging-tapes", t: 55, adhesive: "hotmelt", backing: "BOPP", desc: "55µm heavy-duty carton-sealing tape" },
    { id: "deon-fil-150", name: "DEON® FIL 150", familyId: "filament-strapping-tapes", t: 150, adhesive: "rubber", backing: "PET filament", desc: "150µm mono-filament strapping tape" },
    { id: "deon-fil-180", name: "DEON® FIL 180", familyId: "filament-strapping-tapes", t: 180, adhesive: "synthetic rubber", backing: "glass filament", desc: "180µm bi-directional glass-filament tape" },
    { id: "deon-sec-60", name: "DEON® SEC 60", familyId: "specialty-industrial-tapes", t: 60, adhesive: "acrylic", backing: "void PET", desc: "60µm tamper-evident security tape" },
    { id: "deon-spl-120", name: "DEON® SPL 120", familyId: "specialty-industrial-tapes", t: 120, adhesive: "specialty", backing: "PET", desc: "120µm specialty converted industrial tape" },
    { id: "deon-msk-130", name: "DEON® MSK 130", familyId: "masking-tapes", t: 130, adhesive: "rubber", backing: "crepe paper", desc: "130µm general-purpose masking tape" },
    { id: "deon-msk-pi", name: "DEON® MSK PI", familyId: "masking-tapes", t: 60, adhesive: "silicone", backing: "polyimide", desc: "60µm high-temperature polyimide masking tape" },
    { id: "deon-msk-150", name: "DEON® MSK 150", familyId: "masking-tapes", t: 150, adhesive: "rubber", backing: "crepe paper", desc: "150µm sharp-line paint masking tape" },
    { id: "deon-foil-50", name: "DEON® FOIL 50", familyId: "foil-tapes", t: 50, adhesive: "acrylic", backing: "aluminium foil", desc: "50µm aluminium foil sealing tape" },
    { id: "deon-foil-80", name: "DEON® FOIL 80", familyId: "foil-tapes", t: 80, adhesive: "acrylic", backing: "aluminium foil", desc: "80µm reinforced foil duct tape" },
    { id: "deon-spf-50", name: "DEON® SPF 50", familyId: "surface-protection-films", t: 50, adhesive: "acrylic", backing: "PE", desc: "50µm low-tack surface protection film" },
    { id: "deon-spf-70", name: "DEON® SPF 70", familyId: "surface-protection-films", t: 70, adhesive: "acrylic", backing: "PE", desc: "70µm medium-tack protection film" },
    { id: "deon-spf-30", name: "DEON® SPF 30", familyId: "surface-protection-films", t: 30, adhesive: "acrylic", backing: "PE", desc: "30µm ultra-thin protection film" },
    { id: "deon-ins-25", name: "DEON® INS 25", familyId: "electrical-insulation-tapes", t: 25, adhesive: "acrylic", backing: "PET", desc: "25µm thin dielectric insulation tape" },
    { id: "deon-ins-50", name: "DEON® INS 50", familyId: "electrical-insulation-tapes", t: 50, adhesive: "acrylic", backing: "polyimide", desc: "50µm high-voltage polyimide insulation tape" },
    { id: "deon-fr-90", name: "DEON® FR 90", familyId: "flame-retardant-tapes", t: 90, adhesive: "acrylic", backing: "PET FR", desc: "90µm UL 94 V-0 flame-retardant tape" },
    { id: "deon-fr-150", name: "DEON® FR 150", familyId: "flame-retardant-tapes", t: 150, adhesive: "acrylic", backing: "PET FR", desc: "150µm thick flame-retardant insulation tape" },
    { id: "deon-acf-500", name: "DEON® ACF 500", familyId: "acoustic-foam-tapes", t: 500, adhesive: "acrylic", backing: "PU foam", desc: "500µm acoustic sealing foam tape" },
    { id: "deon-acf-800", name: "DEON® ACF 800", familyId: "acoustic-foam-tapes", t: 800, adhesive: "acrylic", backing: "PU foam", desc: "800µm thick acoustic damping foam tape" }
  ];

  // Resources attach across the graph (markets + applications). category ∈ Knowledge
  // categories (DEON_ARCH.knowledge) so the Knowledge Center can group them by section.
  // [Content is placeholder; the category taxonomy + relations are production.]
  var RESOURCES = [
    // ── Application Guides ──
    { id: "res-pcb-guide", title: "PCB assembly tape selection guide", type: "Selection guide", category: "Application Guides", format: "PDF", size: "3.1 MB", url: "#",
      markets: ["electronics"], applications: ["component-fixation", "solder-masking", "heat-sink-bonding", "emi-shielding"] },
    { id: "res-battery-guide", title: "Battery assembly solutions guide", type: "Solutions guide", category: "Application Guides", format: "PDF", size: "4.0 MB", url: "#",
      markets: ["electronics", "automotive"], applications: ["cell-insulation", "busbar-insulation", "cell-fixation", "heat-sink-bonding"] },
    { id: "res-display-brochure", title: "Display bonding & sealing guide", type: "Application guide", category: "Application Guides", format: "PDF", size: "2.4 MB", url: "#",
      markets: ["electronics"], applications: ["display-frame-bonding", "optical-lamination", "gasketing-sealing"] },
    { id: "res-harness-guide", title: "Wire harnessing & cable wrapping guide", type: "Application guide", category: "Application Guides", format: "PDF", size: "2.8 MB", url: "#",
      markets: ["automotive", "electrical"], applications: ["wire-harness-wrapping"] },

    // ── Product Catalogues ──
    { id: "res-master-catalogue", title: "DEON master product catalogue", type: "Catalogue", category: "Product Catalogues", format: "PDF", size: "12.6 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-electronics-catalogue", title: "Electronics tapes catalogue", type: "Catalogue", category: "Product Catalogues", format: "PDF", size: "6.2 MB", url: "#",
      markets: ["electronics"], applications: [] },
    { id: "res-electrical-catalogue", title: "Electrical & insulation tapes catalogue", type: "Catalogue", category: "Product Catalogues", format: "PDF", size: "5.8 MB", url: "#",
      markets: ["electrical"], applications: [] },
    { id: "res-packaging-catalogue", title: "Packaging & strapping tapes catalogue", type: "Catalogue", category: "Product Catalogues", format: "PDF", size: "4.1 MB", url: "#",
      markets: ["packaging"], applications: [] },

    // ── Technical Datasheets ──
    { id: "res-ds-double-sided", title: "Double-sided tapes — technical datasheets", type: "Datasheet", category: "Technical Datasheets", format: "PDF", size: "3.4 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-ds-electrical", title: "Electrical insulation tapes — technical datasheets", type: "Datasheet", category: "Technical Datasheets", format: "PDF", size: "2.9 MB", url: "#",
      markets: ["electrical", "electronics"], applications: [] },
    { id: "res-ds-foil", title: "Aluminium foil & EMI tapes — technical datasheets", type: "Datasheet", category: "Technical Datasheets", format: "PDF", size: "2.2 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-ds-surface", title: "Surface protection films — technical datasheets", type: "Datasheet", category: "Technical Datasheets", format: "PDF", size: "1.8 MB", url: "#",
      markets: ["metal", "building"], applications: ["surface-protection"] },

    // ── Certifications & Compliance ──
    { id: "res-cert-iso9001", title: "ISO 9001:2015 quality certificate", type: "Certificate", category: "Certifications & Compliance", format: "PDF", size: "0.6 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-cert-iso14001", title: "ISO 14001 environmental certificate", type: "Certificate", category: "Certifications & Compliance", format: "PDF", size: "0.6 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-cert-rohs-reach", title: "RoHS & REACH compliance statement", type: "Compliance", category: "Certifications & Compliance", format: "PDF", size: "0.9 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-cert-ul", title: "UL 510 / UL 94 flame-rating documentation", type: "Compliance", category: "Certifications & Compliance", format: "PDF", size: "1.1 MB", url: "#",
      markets: ["electrical", "electronics"], applications: [] },

    // ── Industry Guides ──
    { id: "res-industrial-guide", title: "DEON industrial tape selection guide", type: "Selection guide", category: "Industry Guides", format: "PDF", size: "5.2 MB", url: "#",
      markets: ["electronics", "automotive", "electrical", "packaging", "appliance", "hvac-metal", "construction", "renewable"],
      applications: ["wire-harness-wrapping", "paint-masking", "carton-sealing-app", "panel-mounting"] },
    { id: "res-ev-guide", title: "Tapes for EV battery & e-mobility", type: "Industry guide", category: "Industry Guides", format: "PDF", size: "3.7 MB", url: "#",
      markets: ["automotive", "renewable"], applications: ["cell-insulation", "cell-fixation"] },
    { id: "res-renewable-guide", title: "Bonding & protection for renewable energy", type: "Industry guide", category: "Industry Guides", format: "PDF", size: "3.0 MB", url: "#",
      markets: ["renewable"], applications: [] },

    // ── Videos & Tutorials ──
    { id: "res-vid-application", title: "How to apply double-sided mounting tape", type: "Video", category: "Videos & Tutorials", format: "Video", size: "4 min", url: "#",
      markets: [], applications: [] },
    { id: "res-vid-converting", title: "Inside DEON converting — from master roll to part", type: "Video", category: "Videos & Tutorials", format: "Video", size: "6 min", url: "#",
      markets: [], applications: [] },
    { id: "res-vid-surface", title: "Surface preparation for reliable bonding", type: "Tutorial", category: "Videos & Tutorials", format: "Video", size: "5 min", url: "#",
      markets: [], applications: [] },

    // ── Case Studies ──
    { id: "res-case-display", title: "Case study: thin-bezel display bonding at scale", type: "Case study", category: "Case Studies", format: "PDF", size: "1.7 MB", url: "#",
      markets: ["electronics"], applications: ["display-frame-bonding"] },
    { id: "res-case-harness", title: "Case study: noise-damped automotive wire harnesses", type: "Case study", category: "Case Studies", format: "PDF", size: "1.5 MB", url: "#",
      markets: ["automotive"], applications: ["wire-harness-wrapping"] },
    { id: "res-case-battery", title: "Case study: residue-free rework in consumer devices", type: "Case study", category: "Case Studies", format: "PDF", size: "1.6 MB", url: "#",
      markets: ["electronics"], applications: ["rework-fixation"] },

    // ── White Papers ──
    { id: "res-wp-bonding", title: "White paper: bonded assembly vs. mechanical fastening", type: "White paper", category: "White Papers", format: "PDF", size: "2.1 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-wp-thermal", title: "White paper: thermal management with conductive tapes", type: "White paper", category: "White Papers", format: "PDF", size: "2.3 MB", url: "#",
      markets: ["electronics", "automotive"], applications: ["heat-sink-bonding"] },
    { id: "res-wp-sustainability", title: "White paper: bio-based & recyclable adhesive systems", type: "White paper", category: "White Papers", format: "PDF", size: "1.9 MB", url: "#",
      markets: [], applications: [] },

    // ── Downloads (general assets) ──
    { id: "res-consumer-overview", title: "Consumer device assembly overview", type: "Overview", category: "Downloads", format: "PDF", size: "1.9 MB", url: "#",
      markets: ["electronics"], applications: ["housing-cosmetic-bonding", "speaker-module-mounting", "rework-fixation", "surface-protection"] },
    { id: "res-company-brochure", title: "DEON company brochure", type: "Brochure", category: "Downloads", format: "PDF", size: "3.3 MB", url: "#",
      markets: [], applications: [] },
    { id: "res-converter-program", title: "Converter & private-label programme overview", type: "Overview", category: "Downloads", format: "PDF", size: "2.0 MB", url: "#",
      markets: [], applications: [] }
  ];

  // Press & Insights items. category ∈ Press categories (DEON_ARCH.press):
  // Industry Insights, Application Stories, Product Updates, Company News, Events & Exhibitions.
  var INSIGHTS = [
    { id: "ins-fasteners-to-tape", title: "Where adhesive tapes are replacing mechanical fasteners",
      category: "Industry Insights", date: "2026-05-28", url: "#",
      excerpt: "Lightweighting and bonded-assembly trends are reshaping how manufacturers join parts. [Placeholder copy.]",
      markets: ["automotive", "electronics"], applications: ["panel-mounting"] },
    { id: "ins-lse-plastics", title: "Bonding to low-surface-energy plastics on the line",
      category: "Industry Insights", date: "2026-04-12", url: "#",
      excerpt: "Why LSE substrates defeat ordinary adhesives — and how to specify around them. [Placeholder copy.]",
      markets: ["electronics", "appliance"], applications: [] },
    { id: "ins-thermal-management", title: "Thermal management in compact electronics",
      category: "Industry Insights", date: "2026-03-03", url: "#",
      excerpt: "Heat-spreading and heat-sink bonding strategies for dense assemblies. [Placeholder copy.]",
      markets: ["electronics"], applications: ["heat-sink-bonding"] },

    { id: "ins-ev-battery-story", title: "Inside an EV battery pack: insulation that earns its place",
      category: "Application Stories", date: "2026-05-09", url: "#",
      excerpt: "How cell insulation and busbar protection come together on a high-volume line. [Placeholder copy.]",
      markets: ["automotive", "electronics"], applications: ["cell-insulation", "busbar-insulation"] },
    { id: "ins-display-bonding-story", title: "Sealing a display module without a single screw",
      category: "Application Stories", date: "2026-02-20", url: "#",
      excerpt: "A look at frame bonding and gasketing for slim consumer displays. [Placeholder copy.]",
      markets: ["electronics"], applications: ["display-frame-bonding", "gasketing-sealing"] },

    { id: "ins-fr-launch", title: "New flame-retardant constructions for EV applications",
      category: "Product Updates", date: "2026-06-01", url: "#",
      excerpt: "Expanded UL 94 V-0 range for battery and power-electronics assembly. [Placeholder copy.]",
      markets: ["automotive", "electronics", "renewable"], applications: [] },
    { id: "ins-spf-range", title: "Expanded surface-protection film range",
      category: "Product Updates", date: "2026-04-25", url: "#",
      excerpt: "Three new tack levels for masking, transit and in-process protection. [Placeholder copy.]",
      markets: ["metal", "electronics"], applications: ["surface-protection"] },

    { id: "ins-capacity", title: "DEON expands converting capacity",
      category: "Company News", date: "2026-05-15", url: "#",
      excerpt: "New slitting and die-cutting lines shorten lead times for custom formats. [Placeholder copy.]",
      markets: [], applications: [] },
    { id: "ins-sustainability", title: "DEON joins industry sustainability initiative",
      category: "Company News", date: "2026-03-18", url: "#",
      excerpt: "Commitment to lower-impact backings and solvent-free adhesive systems. [Placeholder copy.]",
      markets: [], applications: [] },

    { id: "ins-productronica", title: "Meet DEON at productronica 2026",
      category: "Events & Exhibitions", date: "2026-06-04", url: "#",
      excerpt: "Live converting demos and application engineering at booth A1-220. [Placeholder copy.]",
      markets: ["electronics"], applications: [] },
    { id: "ins-battery-show", title: "DEON at The Battery Show",
      category: "Events & Exhibitions", date: "2026-05-02", url: "#",
      excerpt: "Cell insulation and pack-assembly tapes on show for battery makers. [Placeholder copy.]",
      markets: ["automotive", "renewable"], applications: ["cell-insulation"] }
  ];

  // Core manufacturing technologies. `category` matches a Manufacturing &
  // Technology topic (window.DEON_ARCH.manufacturing). Surfaced on
  // manufacturing-technology.html and reusable by segment/application pages.
  var TECHNOLOGIES = [
    // -- Adhesive Technologies --
    { id: "tech-acrylic", name: "Acrylic (solvent & water-based) PSA", category: "Adhesive Technologies",
      summary: "General-purpose to high-performance acrylic pressure-sensitive adhesives with excellent UV, ageing and chemical resistance. Cross-linked formulations hold shear under sustained load and operate continuously to roughly 150 °C.",
      markets: ["electronics", "automotive", "electrical", "construction", "renewable"], applications: ["surface-protection", "panel-mounting", "cell-insulation"] },
    { id: "tech-modified-acrylic", name: "Modified & high-tack acrylic", category: "Adhesive Technologies",
      summary: "Tackified acrylic chemistries for fast initial grab on low-surface-energy (LSE) plastics and powder-coated metals, balancing quick stick with long-term holding power.",
      markets: ["automotive", "appliance", "construction"], applications: ["housing-cosmetic-bonding", "panel-mounting"] },
    { id: "tech-rubber", name: "Rubber / synthetic-rubber hot-melt PSA", category: "Adhesive Technologies",
      summary: "Hot-melt and natural-rubber adhesives engineered for aggressive instant tack and economical high-volume bonding — the workhorse for carton sealing, masking and bundling.",
      markets: ["packaging", "hvac-metal"], applications: ["carton-sealing-app", "paint-masking"] },
    { id: "tech-silicone", name: "Silicone PSA", category: "Adhesive Technologies",
      summary: "Silicone adhesives for extreme-temperature service (−50 °C to 260 °C+), bonding to silicone and PTFE surfaces where acrylics and rubbers fail. Specified for polyimide masking and high-heat insulation.",
      markets: ["electronics", "electrical"], applications: ["solder-masking", "busbar-insulation"] },
    { id: "tech-structural-acrylic-foam", name: "Acrylic-foam structural bonding", category: "Adhesive Technologies",
      summary: "Viscoelastic acrylic-foam cores that bond rigid and flexible substrates while absorbing dynamic, thermal and impact stress — a permanent, gasket-forming alternative to rivets and welds.",
      markets: ["automotive", "construction", "renewable"], applications: ["display-frame-bonding", "panel-mounting"] },
    { id: "tech-thermally-conductive", name: "Thermally conductive adhesives", category: "Adhesive Technologies",
      summary: "Filled adhesive systems that bond and transfer heat at once, channeling thermal load from components to heat sinks and housings without mechanical fasteners.",
      markets: ["electronics", "automotive"], applications: ["heat-sink-bonding", "cell-fixation"] },
    { id: "tech-electrically-functional", name: "Electrically conductive & EMI adhesives", category: "Adhesive Technologies",
      summary: "Conductive and EMI-shielding adhesive constructions that ground, shield and bond in a single step for sensitive electronic assemblies.",
      markets: ["electronics"], applications: ["emi-shielding"] },

    // -- Backing Materials --
    { id: "tech-pet-backing", name: "Polyester (PET) film backing", category: "Backing Materials",
      summary: "Dimensionally stable, high-tensile PET films from 12 µm upward — the dielectric backbone of insulation, splicing and die-cut electronic parts, with controlled shrinkage through reflow.",
      markets: ["electronics", "electrical"], applications: ["cell-insulation", "busbar-insulation"] },
    { id: "tech-polyimide-backing", name: "Polyimide (PI) film backing", category: "Backing Materials",
      summary: "Amber polyimide films rated for continuous 260 °C service with excellent dielectric strength — specified for solder masking, wave-solder and high-voltage insulation.",
      markets: ["electronics"], applications: ["solder-masking", "busbar-insulation"] },
    { id: "tech-pvc-backing", name: "PVC film backing", category: "Backing Materials",
      summary: "Flame-retardant, abrasion-resistant plasticised PVC with the conformability and stretch that electrical and harness wrapping demands.",
      markets: ["electrical", "automotive"], applications: ["wire-harness-wrapping"] },
    { id: "tech-foam-backing", name: "PE / PU / acrylic foam backing", category: "Backing Materials",
      summary: "Closed- and open-cell foams that seal against dust, moisture and noise while compensating for surface irregularities and tolerance gaps.",
      markets: ["electronics", "automotive", "appliance", "construction"], applications: ["gasketing-sealing", "display-frame-bonding"] },
    { id: "tech-cloth-backing", name: "Woven & non-woven cloth backing", category: "Backing Materials",
      summary: "PET and polyester-fleece cloth backings tuned for abrasion, noise damping and hand-tearability — the standard for automotive wire-harness wrapping.",
      markets: ["automotive", "electrical"], applications: ["wire-harness-wrapping"] },
    { id: "tech-foil-backing", name: "Aluminium & metal foil backing", category: "Backing Materials",
      summary: "Soft-temper aluminium and metallised foils for heat reflection, EMI/RFI shielding, vapour barriers and HVAC duct sealing.",
      markets: ["hvac-metal", "construction", "electronics"], applications: ["emi-shielding", "panel-mounting"] },
    { id: "tech-paper-backing", name: "Crepe & flat-paper backing", category: "Backing Materials",
      summary: "Saturated crepe and flat papers engineered for clean, sharp-line masking and residue-free removal across paint, powder-coat and bake cycles.",
      markets: ["automotive", "hvac-metal"], applications: ["paint-masking"] },
    { id: "tech-pe-pp-film-backing", name: "PE / PP protection-film backing", category: "Backing Materials",
      summary: "Polyethylene and polypropylene films with controlled low-tack adhesion for temporary surface protection that peels cleanly after fabrication and transit.",
      markets: ["hvac-metal", "construction", "renewable"], applications: ["surface-protection"] }
  ];

  window.DEON_CATALOG = {
    markets: MARKETS, segments: SEGMENTS, applications: APPLICATIONS,
    productFamilies: PRODUCT_FAMILIES, products: PRODUCTS, resources: RESOURCES,
    insights: INSIGHTS, technologies: TECHNOLOGIES
  };
})();
