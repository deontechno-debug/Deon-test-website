# DEON Productionization Build Spec (frozen)

Authoritative for the implementation sprint. IA frozen; see `DEON_SITE_ARCHITECTURE.md` and `assets/data/deon-architecture.js` (`window.DEON_ARCH`) for canonical ids/names. Positioning: DEON is a **manufacturer / coater / converter / OEM & private-label partner**, not a reseller. Benchmark page = electronics.html. One design language (deon-site.css vocabulary: `.hero`+`.hero-card`, `.market-section` w/ `.market-eyebrow`+H2(44/300)+`.market-intro`, `.segment-card`/`.segment-grid`, `.feature-layout`/`.feature-list`, `.cta-strip`, `.download-grid`/`.download-card`, `.tag-row`/`.tag`, `.context-bar` breadcrumb via `DEON.trail.*`, product finder via `ProductFinder.mount`). No generic SaaS sections, no filler.

## Top nav (frozen, 8): Markets · Applications · Products · Knowledge Center · Press & Insights · About DEON · Careers · Contact

## Markets (12) and segments
- Packaging & Logistics: Carton Sealing, Bundling, Protective Packaging
- Electrical: Electrical Installation, Cable Harnessing, Transformers, Motors & Generators, Switchgear, Energy Storage
- Electronics: PCB Assembly, Displays, Battery Packs, Consumer Electronics
- Automotive: Wire Harnessing, Interior Components, EV Battery Systems
- Transportation: Aerospace, Railway, Marine, Commercial Vehicles, Recreational Vehicles
- Appliance Manufacturing: Refrigeration Appliances, Washing Appliances, Climate Control Appliances
- HVACR: HVACR Systems
- Metal Manufacturing: Surface Protection, Fabrication & Processing
- Building Components: Facade Systems, Doors & Windows, Insulation Systems, Interior Components
- Renewable Energy: Solar Modules, Energy Storage, Power Electronics, EV Infrastructure
- Industrial Converter Partners — SINGLE PAGE (no segments). Sections: Overview, Jumbo Roll Supply, Log Roll Supply, Custom Width Programs, Printed Cores, Technical Support, Contact CTA
- OEM & Private Label Partners — SINGLE PAGE (no segments). Sections: Overview, Private Label Manufacturing, Custom Product Development, Packaging & Branding, Printed Cores, Manufacturing Scale-Up, Contact CTA

## Product families (12)
Electrical Tapes · Packaging Tapes · Double-Sided Tapes · Foam Tapes · PET Tapes · Cloth Tapes · Foil Tapes · MOPP Tapes · Filament Tapes · Masking Tapes · Holding Tapes · Protective Tapes

## Segment → Applications → Products (given mappings; infer the rest with industrial assumptions)
### Electrical
- Electrical Installation → Electrical Insulation, Repair & Maintenance, Wire Splicing, Cable Repair, Terminal Protection → Electrical Tapes, Foil Tapes
- Cable Harnessing → Wire Bundling, Wire Protection, Harness Wrapping → Cloth Tapes, Electrical Tapes (PVC), PET Tapes
- Transformers → Electrical Insulation, Coil Wrapping, Phase Insulation, Layer Insulation → PET Tapes, Foil Tapes, Electrical Tapes
- Motors & Generators → Slot Insulation, Coil Protection, Harness Wrapping → PET Tapes, Electrical Tapes, Cloth Tapes
- Switchgear → Electrical Insulation, Protection, Identification → Electrical Tapes, PET Tapes, Foil Tapes
- Energy Storage → Cell Insulation, Pack Assembly, Wire Harnessing, Component Fixation → PET Tapes, Double-Sided Tapes, Foil Tapes
### Electronics
- PCB Assembly → Masking, Electrical Insulation, Component Protection, Temporary Fixation → PET Tapes, Foil Tapes, Double-Sided Tapes
- Displays → Mounting, Bonding, Component Assembly → Double-Sided Tapes, Foam Tapes
- Battery Packs → Cell Insulation, Pack Assembly, Component Mounting, Thermal Management → PET Tapes, Foil Tapes, Double-Sided Tapes
- Consumer Electronics → Bonding, Mounting, Electrical Insulation, Component Assembly → Double-Sided Tapes, PET Tapes, Foam Tapes
### Packaging & Logistics
- Carton Sealing → Carton Sealing → Packaging Tapes
- Bundling → Bundling → MOPP Tapes, Filament Tapes
- Protective Packaging → Transit Protection, Temporary Fixation, Part Holding, Component Stabilization → Holding Tapes, Foam Tapes, Double-Sided Tapes
### Automotive (infer): Wire Harnessing→Wire Bundling/Harness Wrapping/Wire Protection→Cloth/PET/Electrical; Interior Components→Bonding/Mounting/Component Assembly→Double-Sided/Foam; EV Battery Systems→Cell Insulation/Pack Assembly/Thermal Management→PET/Foil/Double-Sided
### Transportation (infer): Aerospace/Railway/Marine/Commercial Vehicles/Recreational Vehicles → Surface Protection, Bonding, Masking, Wire Harnessing, Thermal Management → Protective, Double-Sided, Masking, PET, Foil
### Appliance (infer): Refrigeration/Washing/Climate Control → Bonding, Mounting, Surface Protection, Component Assembly, Thermal Management → Double-Sided, Foam, Protective, Foil
### HVACR (infer): HVACR Systems → Duct Sealing, Bonding, Surface Protection, Thermal Management → Foil, Cloth, Foam, Protective
### Metal Manufacturing (infer): Surface Protection→Surface Protection/Transit Protection→Protective; Fabrication & Processing→Masking/Surface Protection/Bundling→Masking/Protective/Filament
### Building Components (infer): Facade Systems/Doors & Windows/Insulation Systems/Interior Components → Bonding, Mounting, Surface Protection, Sealing → Double-Sided, Foam, Protective, Foil
### Renewable Energy (infer): Solar Modules→Bonding/Mounting/Surface Protection→Double-Sided/Foam/Protective; Energy Storage→Cell Insulation/Pack Assembly/Thermal Management→PET/Foil/Double-Sided; Power Electronics→Electrical Insulation/Thermal Management/Component Protection→PET/Foil; EV Infrastructure→Bonding/Surface Protection/Cable Management→Double-Sided/Protective/Cloth

## Page templates (frozen — section order)
- Market: Hero · Overview · Industry Challenges · Market Segments · Key Applications · Recommended Product Families · Knowledge Center Resources · Related Insights · CTA
- Segment: Hero · Overview · Industry Challenges/Requirements · Typical Applications · Recommended Product Families · Related Technologies · Knowledge Assets · Related Insights · CTA
- Application: Hero · Overview · Technical Requirements · Common Challenges · Recommended Product Families · Related Materials · Related Technologies · Knowledge Assets · Related Insights · CTA
- Product Family: Hero · Overview · Key Features & Benefits · Typical Applications · Available Product Range (finder/table) · Related Technologies · Downloads · Related Products · CTA
- Product: Hero · Overview · Key Features · Technical Specifications · Applications · Markets Served · Certifications & Compliance · Downloads · Related Products · CTA

## Knowledge Center categories: Product Catalogues, Technical Datasheets, Certifications & Compliance, Application Guides, Industry Guides, Videos & Tutorials, FAQs, Case Studies, White Papers, Downloads
## Press & Insights categories: Industry Insights, Application Stories, Product Updates, Company News, Events & Exhibitions
## About DEON: Company Overview, Our Story, Leadership, Manufacturing & Technology, Quality & Certifications, Locations
## Manufacturing & Technology (flagship): Adhesive Technologies, Backing Materials, Manufacturing Capabilities, Testing & Validation, Custom Product Development, R&D & Innovation, Sustainability & Compliance

## Catalog schema (assets/data/deon-catalog.js → window.DEON_CATALOG)
- markets[]: {id,name,slug,page,tagline,intro,challenges:[],segments:[segId],status:"live", special?:true, sections?:[{id,title,body}]}
- segments[]: {id:"<marketId>-<slug>",name,marketId,summary,overview,challenges:[],requirements:[],applications:[appId]}
- applications[]: {id:slug,name,slug,markets:[mid],segments:[segId],summary,overview,technicalRequirements:[],challenges:[],productFamilies:[familyId],technologies:[techId]}
- productFamilies[]: {id:slug,name,slug,note,overview,benefits:[]}
- products[]: {id,name,familyId,t,adhesive,backing,desc}  (~3-5 per family, realistic specs)
- resources[]: {id,title,type,category,format,size,url:"#",markets:[],applications:[]}  (category ∈ Knowledge categories)
- insights[]: {id,title,category,excerpt,url:"#",date,markets:[],applications:[]}  (category ∈ Press categories)
- technologies[]: {id,name,category,summary}  (category ∈ Manufacturing topics)

resourcesForApplication is derived from resource.applications (resources reference apps, not vice versa).
