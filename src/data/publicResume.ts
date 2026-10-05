// Public presentation only. The private master and source archive remain separate.
export const profile = {
  name: 'Johnathan W. Carroll',
  title: 'Infrastructure, Security & AI Platform Engineering Leader',
  location: 'Tucson, Arizona',
  email: 'j.carroll@techsoftsys.com',
  summary: 'Hands-on technology leader with 25+ years across government, enterprise IT, ISP operations, entrepreneurship, and applied AI. Combines systems architecture and operational leadership with infrastructure modernization, cybersecurity, disaster recovery, and local AI platform engineering.',
};

export const tribalRoles = [
  { title: 'IT Infrastructure Manager', dates: 'Aug 2023 - Present' },
  { title: 'Senior System Administrator', dates: 'Jan 2021 - Aug 2023' },
  { title: 'Security Analyst', dates: 'Jan 2019 - Jan 2021' },
];

export const tribalBullets = [
  'Lead a nine-person Infrastructure and SecOps organization supporting approximately 1,500 employees across seven sites and critical government services.',
  'Serve as the sole systems infrastructure engineer and systems/security architect, reporting to the IT Director; own compute, virtualization, storage, capacity planning, technical standards, and lifecycle strategy.',
  'Modernized and consolidated legacy platforms around Nutanix AHV, Cisco UCS, and Pure Storage, producing approximately $250,000 in annual operating savings and a 50% reduction in physical infrastructure footprint.',
  'Lead infrastructure vendor evaluation, technical requirements, RFPs, procurement recommendations, licensing, and renewals; develop and manage infrastructure portions of the annual CapEx and OpEx budget.',
  'Led Darktrace adoption and expanded layered security through Microsoft Defender, Sentinel, Rapid7 MDR, vulnerability management, managed patching, and employee awareness. Helped establish dedicated Cybersecurity and Physical Security functions.',
  'Designed and maintain backup and disaster-recovery architecture using Veeam, immutable backups, storage replication, and geographically separated recovery infrastructure.',
  'Originated and serve as primary architect for an estimated $6 million centralized data-center and combined SOC/NOC program, including APC POD, power, cooling, civil infrastructure, and migration planning. The partially funded program remains in design and procurement, not commissioned.',
  'Translate independent AI research into the emerging Tribal AI architecture, governance, policy, and security program, including collaboration with the Tribal Attorney General. The program remains in development and scoped pilot testing.',
];

export const techsoftBullets = [
  'Founded and operate a technology consultancy, now focused primarily on independent applied AI R&D alongside the full-time Tribal role; specialize in small local AI labs and custom GPU/server systems.',
  'Engineered a Threadripper PRO lab around dual RTX PRO 6000 Blackwell GPUs with 192 GB aggregate GPU memory, 512 GB ECC DDR5 memory, and PCIe 5.0 NVMe storage. Dedicated AI research began in January 2025.',
  'Convert base models to NVFP4 with NVIDIA Model Optimizer, then test, tune, and deploy with vLLM. Work spans CUDA, tensor parallelism, FP8 KV caching, speculative decoding, GPU residency, embeddings, reranking, and multimodal services.',
  'Lead AI-assisted agent and memory-system engineering, evidence-integrity evaluation, observability, and state-preserving container updates. Use Ollama for basic testing and selected project embedding workloads.',
];

export const tribalPrintBullets = [
  'Lead a nine-person Infrastructure/SecOps organization supporting approximately 1,500 employees across seven sites and critical government services.',
  'Serve as sole systems infrastructure engineer and systems/security architect, reporting to the IT Director; own compute, virtualization, storage, capacity, standards, and lifecycle planning.',
  'Consolidated legacy platforms around Nutanix AHV, Cisco UCS, and Pure Storage, producing approximately $250,000 in annual savings and a 50% infrastructure footprint reduction.',
  'Lead vendor evaluation, RFPs, licensing, procurement recommendations, and infrastructure CapEx/OpEx planning; led Darktrace adoption and layered security modernization.',
  'Designed Veeam-based backup/DR architecture with immutable backups and geographically separated recovery; originated and serve as primary architect for an estimated $6M data-center/SOC/NOC program, still in design/procurement and partially funded.',
  'Inform the emerging Tribal AI architecture, security, governance, and policy program through independent research and Attorney General collaboration; development and scoped pilots remain distinct from production.',
];

export const techsoftPrintBullets = [
  'Founded a technology consultancy, now primarily independent applied AI R&D alongside the full-time Tribal role; build local AI labs and GPU/server systems.',
  'Engineered a dual RTX PRO 6000 Blackwell platform with 192 GB aggregate GPU memory and 512 GB ECC DDR5; convert and optimize base models to NVFP4 with NVIDIA Model Optimizer for vLLM deployment.',
  'Work across CUDA, tensor parallelism, FP8 KV caching, speculative decoding, model residency, embeddings/reranking, agent memory, observability, and reproducible AI-assisted engineering.',
];

export const previousRoles = [
  {
    employer: 'Tucson Electric Power', title: 'Security Analyst - Contract', dates: '2017 - 2019',
    bullets: [
      'Led design, modernization, and integration of CCTV, access control, and physical-security technology into IT across headquarters, power generation, and Arizona substations.',
      'Contributed security engineering within a $40M+ modernization program, including a $30M data-center conversion contained within that total; contracted through PrevenTronics and later Tech Systems.',
    ],
    printBullets: ['Led CCTV/access-control modernization and integration into IT across headquarters, power generation, and Arizona substations; security scope within a $40M+ program, including its $30M data-center conversion.'],
  },
  {
    employer: 'TBM Equities LLC / Sahara Apartments', title: 'IT Director / Senior System Administrator', dates: 'Jul 2013 - Jul 2018',
    bullets: [
      'Initially engaged through TechSoft following ransomware; restored affected services and business operations within 24 hours, establishing a multi-year IT leadership relationship.',
      'Reduced hardware footprint 60% with Hyper-V and annual energy costs approximately $8,000; implemented Veeam/off-site replication with a 15-minute RPO for critical systems and networks serving 900+ residents.',
    ],
    printBullets: ['Restored ransomware-affected services and business operations within 24 hours through an initial TechSoft engagement. Later reduced hardware footprint 60% and energy costs approximately $8K/year; delivered a 15-minute RPO for critical systems.'],
  },
  {
    employer: 'BestComm Networks', title: 'Technical Engineer / Supervisor', dates: '2006 - 2012',
    bullets: ['Provided advanced Tier 3 engineering and 24/7 NOC support within an international Best Western provider environment of approximately 3,400 properties; supervised staff and supported network modernization, monitoring, and complex escalations.'],
  },
  {
    employer: 'TheRiver ISP', title: 'Technical Manager', dates: '2004 - 2006',
    bullets: ['Managed a 52-person technical operations organization serving approximately 26,000 subscribers; led staffing, escalations, carrier relationships, capacity planning, modernization, and the technical/workforce transition following acquisition.'],
  },
  {
    employer: 'Microsoft Support Contracts', title: 'Advanced Technical Support & Escalation', dates: 'Approximately 2000 - 2004',
    bullets: ['Delivered Microsoft-authorized third-party support through Keen and later Convergys, with Microsoft-provided training: final-tier server case ownership in the earlier assignment and later Tier 2/3 Windows escalation and mentoring.'],
  },
  {
    employer: 'OneSmack.com LLC', title: 'Founder, Owner & Operator', dates: 'Mid-1990s - 2000 | Norfolk, Virginia',
    bullets: ['Founded a web-development and technology business serving approximately 26 clients; delivered database-backed applications, onboarding/quoting workflows, hosting administration, custom systems, and office IT integration.'],
  },
];

export const projects = [
  {
    id: 'ai-q', title: 'NVIDIA AI-Q Research Assistant', focus: 'Agentic research and evidence integrity',
    summary: 'Built a self-hosted AI-Q/NeMo research platform; analyzed 4.68M+ reported model tokens in selected retained studies and 1,448 calls across 45 diagnostic runs. Corrected a citation-accounting defect with 196 focused passing tests.',
    printSummary: 'Built a self-hosted AI-Q/NeMo platform and reproducible evidence evaluation; repaired a specific citation-accounting defect, validated with 196 focused passing tests.',
    details: [
      'Integrated NVIDIA AI-Q, NeMo Agent Toolkit, FastAPI, Dask, PostgreSQL, Next.js, vLLM, and Ollama for persistent research jobs, cited reports, and streaming progress.',
      'Built bounded cross-model evaluation with frozen evidence, positive/negative controls, deterministic source-passage identifiers, immutable inputs, and hash-chained execution journals.',
      'Designed typed request, budget, and evidence contracts to make research jobs traceable and replayable. Separated successful software execution from accepted research quality.',
      'Investigated source-binding, structured-output, and agent-handoff failures; tested source-first comparisons in independent contexts and identified limits in domain-specific controllers and generalization.',
      'Diagnosed a citation-accounting defect and restored 30 cited sources from a 77-source report in an exact-image replay; validated the repair with 196 focused passing tests and regression comparisons.',
    ],
    boundary: 'Active independent AI-assisted research, not commercial deployment. Token/call counts cover selected retained work, not lifetime totals. Software tests and execution journals do not establish factual correctness; bounded comparisons do not establish overall model superiority or reliable general research.',
  },
  {
    id: 'piper', title: 'PIPER Intent Gateway', focus: 'Intent classification and memory routing',
    summary: 'Architected a native Hermes advisory plugin for intent and memory selection, deterministic contracts, monitoring, and human review; expanded a historical acceptance suite to 114 passing tests and audited 106 selected decisions.',
    printSummary: 'Architected a Hermes advisory intent/memory plugin with deterministic contracts, monitoring, human review, historical regression coverage, and a selected 106-decision audit.',
    details: [
      'Led AI-assisted intent-routing research across early hybrid intake, Open-WebUI filters, and a later native Hermes advisory plugin. Historical gateway work included structured LLM output, deterministic policy mappings, bounded context, session isolation, timeout/fallback controls, and circuit breaking.',
      'Separated pre-work intake from post-work agent handoff. Historical routing contracts used schema validation, bounded repair, and fallback; model-assisted classification supplied hints rather than owning agent execution.',
      'Defined retrieval boundaries across conversation history, user profile, assistant operational memory, and authoritative durable knowledge. The executing agent retains planning and tool-use responsibility.',
      'Built gateway monitoring and review tooling with FastAPI/React, authenticated source-turn review, append-only corrections, revision-checked configuration, atomic replacement, backups, and rollback.',
      'Expanded the early gateway acceptance suite to 114 reported passing tests in May 2026. Re-reviewed 106 previously recovery-labeled decisions in September to separate memory-routing errors, classifier misses, internal turns, correct routes, and downstream recovery.',
    ],
    boundary: 'Independent R&D, documented May 2026 - Present. The native plugin is advisory, not autonomous memory enforcement. Historical packages do not establish feature parity across generations. The selected audit is failure analysis, not a general accuracy score; historical tests are not a full current-plugin passing run.',
  },
  {
    id: 'memory', title: 'Ogden / Memory Workbench', focus: 'Proposal-only memory evaluation',
    summary: 'Evaluated 280 conclusions across 72 cases, completed after retries and serving recovery; produced 19 proposals for human review without mutating live memory.',
    printSummary: 'Evaluated 280 conclusions across 72 cases after retries/recovery, yielding 19 human-review proposals without mutating live memory.',
    details: [
      'Designed and evaluated a proposal-only semantic memory reviewer with complete-artifact validation, idempotent imports, immutable model output, separate human edits, and append-only review events.',
      'Revalidated source records at review time and blocked approval on source drift. Kept live-memory application disabled, with auditable exports and human review separate from model-generated proposals.',
      'Established provenance-aware export boundaries: retained model conclusions are unreviewed, not human-approved training examples. Schema-valid output remains a proposal.',
      'Implemented exact deduplication that reduced a 200-conclusion sample to 111 review rows while retaining source identities and audit metadata.',
      'Researched governance distinctions between confidence, authority, and purpose, including privacy risks from cumulative profile inference; broader runtime enforcement remains planned.',
    ],
    boundary: 'Independent AI-assisted research. The 19 proposals are not 19 proven errors or applied fixes. Semantic clustering, a full memory compiler, and compaction concepts remain research/planned work, not completed features.',
  },
];

export const benchmarks = [
  { model: 'Nemotron Super 120B NVFP4', result: '212.20 output tokens/sec', method: 'Warmed single-request technical workload; end-to-end rate across the configured generation, not decode-only throughput.' },
  { model: 'Nemotron Lightning 30B-A3B NVFP4', result: '568.15 output tokens/sec', method: 'Mean of five warmed synthetic runs; 59.6% above the measured target-only control on the recorded runtime.' },
  { model: 'Qwen3.8-27B NVFP4', result: '133.64-164.12 output tokens/sec', method: 'Median single-request decode rates across recorded prompt workloads; 914.20-1,130.73 aggregate output tokens/sec across eight concurrent requests.' },
];

export const skills = [
  { name: 'Infrastructure', items: 'Nutanix AHV, VMware, Hyper-V, Cisco UCS, Pure Storage, NetApp, Veeam, Linux, GPU/server engineering' },
  { name: 'Networking', items: 'Cisco Nexus/Catalyst, Palo Alto, VLAN/VXLAN, VPN, multi-site infrastructure' },
  { name: 'Security', items: 'Darktrace, Defender, Sentinel, Rapid7, Syxsense, identity controls, incident response, vulnerability management' },
  { name: 'AI platforms', items: 'CUDA, NVIDIA Model Optimizer, NVFP4, vLLM, embeddings/reranking, AI-Q, NeMo Agent Toolkit, Hermes, Honcho, MCP' },
  { name: 'Engineering', items: 'Docker, Python, Bash, PowerShell, SQL, TypeScript/JavaScript, FastAPI, PostgreSQL, Redis, GitHub Actions' },
  { name: 'Observability', items: 'Prometheus, Grafana, Loki, NVIDIA DCGM Exporter, infrastructure and GPU telemetry' },
];

export const printSkills = [
  { name: 'Infrastructure', items: 'Nutanix AHV, VMware, Hyper-V, Cisco UCS, Pure Storage, NetApp, Veeam, Linux' },
  { name: 'Networking', items: 'Cisco Nexus/Catalyst, Palo Alto, VLAN/VXLAN, VPN' },
  { name: 'Security', items: 'Darktrace, Defender, Sentinel, Rapid7, Syxsense, identity, incident response' },
  { name: 'AI platforms', items: 'CUDA, Model Optimizer, NVFP4, vLLM, AI-Q/NeMo, Hermes, Honcho, MCP' },
  { name: 'Engineering', items: 'Docker, Python, Bash, PowerShell, SQL, TypeScript/JavaScript, FastAPI, GitHub Actions' },
  { name: 'Observability', items: 'Prometheus, Grafana, Loki, NVIDIA DCGM Exporter' },
];

export const education = [
  'Computer Programming & Digital Repair Certificates - Norfolk Technical Vocational Center',
  'Coursework - Tidewater Community College',
  'InfraGard Arizona Member; open-source contributor and advocate',
];
