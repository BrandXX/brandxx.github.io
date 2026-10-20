// Public presentation only. The private master and source archive remain separate.
export const profile = {
  name: 'Johnathan W. Carroll',
  title: 'Infrastructure, Security & AI Platform Engineering Leader',
  location: 'Tucson, Arizona',
  email: 'j.carroll@techsoftsys.com',
  summary: 'Hands-on technology leader with 25+ years across government, enterprise IT, ISP operations, entrepreneurship, and applied AI. Combines systems architecture and operational leadership with infrastructure modernization, cybersecurity, disaster recovery, AI infrastructure, and LLMOps.',
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
  'Convert base models to NVFP4 with NVIDIA Model Optimizer, then test, tune, and deploy with vLLM. LLMOps work spans CUDA, FP8 KV caching, speculative decoding, shared-base LoRA serving and adapter lifecycle validation, embeddings/reranking, multimodal services, observability, and reproducible container operations. Use Ollama for basic testing and selected project embedding workloads.',
  'Engineered vLLM/NVFP4 residency workflows, recording 0.96-0.97-second source-sleep-to-first-visible-token latency in selected lab tests. A separate historical Lightning runtime candidate passed 61 sleep/wake cycles and 122/122 post-wake arithmetic/tool checks, with approximately 473 ms mean wake time. Results qualify residency components, not the complete agent architecture.',
  'Diagnosed and corrected an inference proxy connection mismatch; a subsequent approximately 30-minute direct-proxy soak completed 2,648/2,648 requests. Applied controlled comparisons, output validation, and rollback procedures to vLLM deployment changes.',
  'Evaluated four Qwen/Nemotron NVFP4 embedding checkpoints on a common vLLM runtime, comparing serving performance and retrieval quality across three public datasets; validated 20,480 requests across four 60-second, eight-client tests with zero reported errors.',
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
  'LLMOps spans CUDA, FP8 KV caching, speculative decoding, shared-base LoRA serving and adapter lifecycle validation, embeddings/reranking, observability, and reversible container updates; Ollama remains for basic testing and selected embedding workloads.',
  'Recorded 0.96-0.97-second source-sleep-to-first-visible-token switching in selected lab tests; a separate historical Lightning runtime candidate passed 61 sleep/wake cycles and 122/122 arithmetic/tool checks, with approximately 473 ms mean wake time.',
  'Diagnosed and corrected an inference proxy connection mismatch; a subsequent approximately 30-minute direct-proxy soak completed 2,648/2,648 requests. Used controlled comparisons, output validation, and rollback to qualify vLLM changes.',
  'Evaluated four Qwen/Nemotron NVFP4 embedding checkpoints across three public retrieval datasets; 20,480 requests across four 60-second, eight-client tests completed with zero reported errors.',
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
    id: 'residency', title: 'Dynamic GPU Residency & LLMOps', focus: 'Inference architecture and operational validation',
    status: 'Historical lab tests; residency components validated',
    summary: 'Designed a private multi-model, multi-agent inference architecture and experimentally validated dynamic GPU residency components using vLLM and NVFP4-quantized MoE models. Evaluated retained-weight transitions under embedding load and controlled host-memory bandwidth contention.',
    printSummary: 'Designed a multi-model, multi-agent inference architecture; validated residency components under embedding and host-memory bandwidth load with reproducible timing, correctness checks, fault telemetry, and rollback records.',
    resumeBoundary: 'Historical component validation, not whole-architecture production qualification. Nano numerical failures and long-duration near-saturation testing remained unresolved in the record.',
    details: [
      'Measured strictly sequential source sleep, retained target wake, and streamed Chat Completions through the first nonempty visible token. Both short, nonthinking bidirectional probes completed their required response marker.',
      'Validated a pinned vLLM runtime incorporating an upstream sleep/wake fix. Distinguished cold host-mapping setup from warmed transitions, checked arithmetic/tool output after wake, and retained the previous runtime for rollback.',
      'Tested synchronized wakes across two GPUs while an embedder was active, then ran a separate five-level STREAM memory-bandwidth contention matrix with paired-wake timing and post-wake arithmetic gates.',
      'Preserved a failed initial Nano arithmetic gate and its zero-pressure reproduction before completing the replacement stable-gate matrix. Later numerical failures remain qualifications; successful residency does not establish general model correctness.',
      'Separated model-local KV capacity from per-request context and scheduler concurrency. The four deployments in the capacity snapshot were single-GPU TP1 engines on a two-GPU host, not a successful TP2 configuration or a cross-model shared KV pool.',
    ],
    boundary: 'Historical August/September 2026 independent lab results, not whole-architecture production qualification or confirmation of restored dual-GPU availability after RMA. Full-switch, target-wake, and paired-wake timings have different boundaries. Long-duration near-saturation contention testing remained outstanding; the Responses API was excluded from the Lightning acceptance campaign because of a separately tracked streaming defect. Upstream fix authorship is not claimed. Architecture name and internal design remain private.',
  },
  {
    id: 'ai-q', title: 'NVIDIA AI-Q Research Assistant', focus: 'Agentic research and evidence integrity',
    status: 'Implemented private research platform; evaluation ongoing',
    summary: 'Built a self-hosted AI-Q/NeMo research platform with persistent jobs, cited reports, and reproducible evidence evaluation. Diagnosed and corrected a specific citation-accounting defect, validated with 196 focused passing tests.',
    printSummary: 'Built a self-hosted AI-Q/NeMo platform and reproducible evidence evaluation; repaired a specific citation-accounting defect, validated with 196 focused passing tests.',
    details: [
      'Integrated NVIDIA AI-Q, NeMo Agent Toolkit, FastAPI, Dask, PostgreSQL, Next.js, vLLM, and Ollama for persistent research jobs, cited reports, and streaming progress.',
      'Built bounded cross-model evaluation with frozen evidence, positive/negative controls, deterministic source-passage identifiers, immutable inputs, and hash-chained execution journals.',
      'Designed typed request, budget, and evidence contracts to make research jobs traceable and replayable. Separated successful software execution from accepted research quality.',
      'Investigated source-binding, structured-output, and agent-handoff failures; tested source-first comparisons in independent contexts and identified limits in domain-specific controllers and generalization.',
      'Diagnosed a citation-accounting defect and restored 30 cited sources from a 77-source report in an exact-image replay; validated the repair with 196 focused passing tests and regression comparisons.',
      'Analyzed 4.68M+ reported model tokens in selected retained studies and 1,448 calls across 45 diagnostic runs. These supplied study scopes are not lifetime totals or a newly reconciled aggregate.',
    ],
    boundary: 'Active independent AI-assisted research, not commercial deployment. Token/call counts cover selected retained work, not lifetime totals. Software tests and execution journals do not establish factual correctness; bounded comparisons do not establish overall model superiority or reliable general research.',
  },
  {
    id: 'platform', title: 'Stateful AI Platform Operations & Reliability', focus: 'Inference migration, recovery, and integration engineering',
    status: 'Implemented independent lab operations; historical functional checks',
    summary: 'Migrated a stateful Hermes/Honcho assistant platform from Ollama GGUF to vLLM-hosted NVFP4 inference while preserving 3,045 active memory documents and the existing embedding service. Developed recoverable deployment procedures and tested the actual agent paths for browser, vision/video, speech, and other native tools.',
    printSummary: 'Migrated Hermes/Honcho inference to vLLM/NVFP4 while preserving 3,045 active memory documents; engineered state-preserving recovery and consumer-path integration checks.',
    details: [
      'Coordinated service cutover with PostgreSQL, Redis, assistant, and Memory Workbench backups, preserving memory and review progress. Used stopped-state snapshots, retained container images, verified Git bundles, SHA-256 manifests, and database integrity checks.',
      'Separated image-only rollback from full-state restoration so application recovery would not unnecessarily discard newer conversations or review work. Diagnosed persistent Python native-extension/ABI and missing declared dependency failures that an image revert alone did not resolve.',
      'Repaired service-user ownership, protected configuration access, and stale MCP registry problems through scoped recovery actions rather than broad state replacement.',
      'Corrected a false-positive browser smoke check by following the agent\'s actual managed-browser resolver and readiness contract, rather than treating a cached Chrome launch as proof of usable agent tooling.',
      'Repaired unavailable auxiliary-model dependencies and verified native image/video tooling without frame-extraction workarounds. A September 30 functional audit covered terminal, file, browser, search/extraction, image/video, and local speech paths; the October 1 update used narrower health, catalog, browser, and deterministic audio checks.',
    ],
    boundary: 'Independent AI-assisted lab engineering, not a commercial or Tribal deployment. The 3,045-document count describes the recorded migration, not a current inventory or the separate memory-review cohort. Functional checks do not establish visual accuracy or a security certification; LLM/TTS/STT inference was not repeated in the October 1 update. No measured uptime, SLA, recovery-time objective, or general fault-elimination claim. Private configuration, credentials, and architecture remain undisclosed.',
  },
  {
    id: 'audio', title: 'Production Agent Audio and Voice Integration', focus: 'Model-directed audio and operational engineering',
    status: 'Operational personal deployment; owner-confirmed October 2026',
    summary: 'Designed and deployed a self-hosted audio stack for a personal AI assistant using Hermes, Whisper, Qwen3 TTS, and Kokoro. Built model-callable media tools and evidence-aware guidance that separate speech transcripts, deterministic acoustic measurements, and visual inference.',
    printSummary: 'Designed and deployed native agent audio tooling with self-hosted speech services, bounded media processing, deterministic acoustic evidence, and repeatable acceptance checks in an operational personal AI environment.',
    details: [
      'Directed architecture, integration, operations, and acceptance for a three-tool native audio plugin and companion skill. Implementation and testing used AI coding assistance; the speech models and Hermes framework remain upstream components.',
      'Added audio-track selection, source-relative ranges, sequential five-minute 16 kHz mono PCM chunks, approximate speech-segment timestamps, and explicit continuation on transcript output-budget exhaustion.',
      'Separated Whisper speech recognition from FFT-based tone and timing analysis. Recorded controlled rising/falling/constant-tone, silence, speech, track-selection, and fresh-session native-tool checks using fixture manifests with expected results and tolerances.',
      'Restricted media decoder protocols and formats, rejected playlists, retained protected-file and approved-output controls, and documented specific unsafe-input/output rejection tests. Agent guidance treats recorded speech as evidence, not instruction authority.',
      'Integrated profile-scoped Qwen3 TTS through native speech providers while preserving existing Kokoro output; verified MP3 generation and 24 kHz PCM through the actual Hermes read-aloud path.',
      'Maintained custom capability through backend upgrades with registration and deterministic DSP checks, configuration fingerprints, stopped-state backups, retained images, and documented narrow rollback procedures.',
    ],
    boundary: 'Owner-operated personal production confirmed October 10, 2026; exact cutover date, commercial scale, and Tribal deployment are not established. Functional results are dated historical checks, not new benchmark runs. Processing limits are not full-length success measurements; timestamps are segment-level. This native audio plugin does not claim standardized speech accuracy, latency/SLA, native hearing, DTMF decoding, cloning, or diarization. The separate Voice Studio project below covers voice-design and cloning workflows. Specific security checks do not establish general prompt-injection immunity. Internal deployment details and raw evidence remain private.',
  },
  {
    id: 'voice-studio', title: 'Local Voice Design & Speech Studio', focus: 'Speech interfaces, streaming, and model lifecycle',
    status: 'Implemented lab interface; September 2026 functional validation',
    summary: 'Extended a private Qwen3 TTS studio with voice-design and reference-based cloning workflows on vLLM-Omni. Connected browser interaction, streaming audio, reference persistence, and controlled model transitions in a self-hosted speech application.',
    printSummary: 'Integrated voice design, reference-based cloning, PCM streaming, and controlled model transitions in a private Qwen3 TTS studio.',
    details: [
      'Validated a generated voice reference followed by synthesis of new text, plus an uploaded-reference workflow with transcript and consent recording. Kept these studio workflows distinct from the native agent audio plugin.',
      'Recorded 26 regression tests and seven controller tests, with Chromium desktop/mobile checks and a synthetic microphone fixture. Verified reference persistence after a model restart, rejection of model switching during generation, and lease release after an early client disconnect.',
      'Kept one TTS variant resident at a time and implemented bounded lifecycle control without exposing a Docker socket or arbitrary-command API. Measured cold model transitions separately from retained-weight LLM sleep/wake.',
    ],
    boundary: 'Independent AI-assisted engineering, not commercial or Tribal deployment. Functional and synthetic-microphone checks do not establish physical-microphone performance, speech accuracy, or subjective voice quality. Candidate voice audition remained pending; recording consent is not independent verification of rights to a voice. Cold transitions are not subsecond warm wakes.',
  },
  {
    id: 'piper', title: 'PIPER Intent Gateway', focus: 'Intent classification and memory routing',
    status: 'Implemented advisory lab integration; historical regression coverage',
    summary: 'Architected a Hermes advisory intent/memory integration with deterministic contracts, monitoring, human review, and failure analysis. Preserved a historical 114-test intake milestone and a separate selected 106-decision audit.',
    printSummary: 'Architected a Hermes advisory intent/memory plugin with deterministic contracts, monitoring, human review, historical regression coverage, and a selected 106-decision audit.',
    details: [
      'Led AI-assisted integration research across early intake tooling, Open-WebUI filters, and a later native Hermes advisory plugin. Historical work used structured output, contract validation, failure tracing, and rollback.',
      'Separated advisory classification from agent execution, using schema validation and output checks while retaining evidence and explicit uncertainty in handoffs.',
      'Evaluated retrieval and memory-selection behavior without treating model output or remembered content as independent evidence of correctness. Detailed routing and memory architecture remain private.',
      'Built gateway monitoring and review tooling with FastAPI/React, authenticated source-turn review, append-only corrections, revision-checked configuration, atomic replacement, backups, and rollback.',
      'Expanded the early gateway acceptance suite to 114 reported passing tests in May 2026. Re-reviewed 106 previously recovery-labeled decisions in September to separate memory-routing errors, classifier misses, internal turns, correct routes, and downstream recovery.',
      'Retained historical regression source files and a test log supporting the early 114-test milestone. Investigated dependent-hop latency, oversized handoffs, nested timeouts, output-contract failures, and test traffic entering durable memory; those artifacts do not establish a current native-plugin passing suite.',
    ],
    boundary: 'Independent R&D, documented May 2026 - Present. The native plugin is advisory, not autonomous memory enforcement. Historical packages do not establish feature parity across generations. The selected audit is failure analysis, not a general accuracy score; historical tests are not a full current-plugin passing run.',
  },
  {
    id: 'memory', title: 'Ogden / Memory Workbench', focus: 'Proposal-only memory evaluation',
    status: 'Implemented review tooling; model proposals do not mutate live memory',
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
  {
    id: 'embeddings', title: 'Embedding & Retrieval Evaluation', focus: 'Quantized serving, retrieval quality, and evidence-aware evaluation',
    status: 'Historical matched lab comparisons; workload-specific results',
    summary: 'Compared embedding-service performance and retrieval relevance in two distinct lab campaigns: matched Nemotron BF16/NVFP4 releases in September, then four Qwen/Nemotron NVFP4 checkpoints on a common vLLM runtime in October. Evaluated latency, vector integrity, public retrieval tasks, and a source-linked memory corpus without treating any single metric as an overall model ranking.',
    printSummary: 'Evaluated Nemotron BF16/NVFP4 and Qwen/Nemotron NVFP4 checkpoints in separate serving and retrieval studies, retaining workload, dimension, and label-quality limits.',
    details: [
      'September 6-7: the 8B NVFP4 candidate recorded 32.0 versus 16.0 inputs/sec for BF16 in a matched mixed-length, eight-worker soak. Across four 60-second soaks, 20,936 requests completed with zero recorded errors. At 2,048 dimensions, the 8B unweighted nDCG@10 means across SciFact, NFCorpus, and ArguAna were 0.6183 for NVFP4 and 0.6185 for BF16; close scores do not establish statistical equivalence.',
      'October 19: evaluated Qwen 4B/8B and Nemotron 1B/community 8B NVFP4 checkpoints one at a time on a pinned vLLM 0.29.0 shared host. Qwen 8B led the three-dataset unweighted nDCG@10 mean at 0.6367 with native 4,096-dimensional vectors and 0.6356 at 2,048 dimensions. Community Nemotron 8B led SciFact and NFCorpus; Qwen led ArguAna.',
      'The October campaign completed 20,480 requests with zero reported errors across four 60-second, eight-client mixed-load tests. NVIDIA Nemotron 1B recorded 196.1 inputs/sec and 43.3 ms p95. Timing included HTTP, vector serialization, and validation; performance used native vector sizes, not equal-sized outputs across models.',
      'On the 214-session, 1,061-candidate memory corpus, October results at 2,048 dimensions favored the tested Nemotron checkpoints over Qwen on source-link retrieval. Paired intervals did not establish an advantage for the larger sibling in either family. These bronze labels remain unreviewed source linkages, not human-adjudicated relevance or memory correctness.',
      'Investigated GPU contention, role-aware query/document formatting, and consistent vector truncation with L2 normalization. A separate public-dataset and 48-query hard-negative technical comparison showed workload-dependent model tradeoffs; truncation reduced stored vector payload, not inference memory or network payload in that run.',
    ],
    boundary: 'Source-reported independent AI-assisted lab results; not independently rerun for this publication. September and October are separate campaigns, not one cumulative soak. The 2x result applies only to the September 8B workload; zero-error short tests do not establish an SLA. The October campaign did not test Qwen BF16 controls, authorize an index migration, or establish a universal model winner. Publisher checkpoints are not claimed as personally quantized. Human-reviewed replacement evaluation remains outstanding.',
  },
  {
    id: 'retrieval-review', title: 'Human-Reviewed Retrieval Evaluation', focus: 'Evaluation design, leakage controls, and failure costs',
    status: 'Documented protocol; human labeling and sealed-test results outstanding',
    summary: 'Designed a human-in-the-loop protocol for deciding whether an embedding-model replacement improves useful retrieval without increasing costly wrong-memory results. The protocol separates source-linked bronze labels from human-authored queries, relevance judgments, and operational failure costs.',
    printSummary: 'Designed a human-reviewed retrieval protocol with leakage-aware splits, blinded grading, and cost-sensitive replacement gates; completed gold results remain outstanding.',
    details: [
      'Specified 300 authoring cases, divided into 50 calibration and 250 sealed-test cases, with connected-component splitting to keep linked sessions and near-duplicate memories together. These are prepared authoring cases, not 300 completed gold labels.',
      'Defined time-aware queries, exact supporting evidence, acceptable and forbidden memories, severity judgments, and blinded candidate grading with model identity and rank withheld. Calibration policy is frozen before sealed-test evaluation.',
      'Defined a replacement gate requiring a positive lower confidence bound for nDCG@10 gain, a nonpositive upper bound for additional cost-weighted loss, and no increase in observed high/critical harmful top-1 retrievals.',
    ],
    boundary: 'Evaluation design and a source-reported prepared package, not a completed human-gold benchmark, passed replacement gate, or deployed model change. No sealed-test scores or completed blinded grades are claimed. Leakage controls reduce risk rather than prove its elimination; an observed harm rate is not a safety guarantee.',
  },
  {
    id: 'serving-validation', title: 'Inference Release Qualification & Failure Analysis', focus: 'Controlled comparisons, serving defects, and release gates',
    status: 'Historical September 2026 studies; acceptance varies by candidate',
    summary: 'Qualified inference changes through controlled comparisons, request-level validation, long-context probes, and reversible deployments. Distinguished successful HTTP responses from valid model output, and retained rejected candidates and unresolved quality issues alongside successful checks.',
    printSummary: 'Qualified inference changes with controlled A/B tests, long-context probes, failure analysis, scoped upstream fixes, and reversible release procedures.',
    details: [
      'Qwen 27B: compared speculative decoding disabled versus three-token MTP with 42 requests per arm. After diagnosing a proxy/backend idle-connection mismatch, a corrected direct-proxy soak completed 2,648/2,648 requests over approximately 30 minutes. The initial run retained one HTTP 502 among 928 requests; the final HTTPS configuration received separate checks, not that same 30-minute soak.',
      'Validated eight synthetic long-context retrieval probes up to 249,880 input tokens. Treated shared KV capacity separately from per-request context limits and scheduler slots. Retained tool-response compatibility caveats and a hallucinated video description; functional API success did not establish visual accuracy or broad long-context reasoning.',
      'Nemotron Super: isolated a structured-output boundary defect and validated a narrowly scoped upstream vLLM patch. Raw assistant JSON/schema passes improved from 1/6 to 6/6 serial replays of one captured request, without repair, retries, or postprocessing. Preserved the original deployment and used extracted-method regression fixtures; upstream patch authorship is not claimed.',
      'Super MTPv2: tested an external speculative head on an NVFP4 target. A depth-five concurrent trial encountered a CUDA illegal-memory-access fault. Restored the unchanged primary deployment and withheld the candidate from promotion; additional qualification remained outstanding.',
    ],
    boundary: 'Separate source-reported studies, not a single acceptance suite or new throughput record. The Super boundary replay was serial and limited to one request; residual grammar warnings, streaming, concurrency, and long-soak coverage remained unresolved. JSON/schema compliance is not factual correctness. MTPv2 qualification was deferred, not production-accepted. Raw evidence and deployment details remain private.',
  },
  {
    id: 'adapter-routing', title: 'Shared-Base LoRA Serving & Recovery', focus: 'Adapter integration, route integrity, and lifecycle validation',
    status: 'September 2026 infrastructure acceptance; writing quality unaccepted',
    summary: 'Integrated a publisher rank-256 output-head LoRA with Nemotron Lightning NVFP4 inference while preserving the unchanged base route and original adapter tensors. Validated per-request routing, restart durability, and retained-weight lifecycle behavior without duplicating the base model.',
    printSummary: 'Integrated a publisher LoRA with shared-base NVFP4 serving; validated concurrent base/adapter routing, restart durability, and bounded lifecycle recovery.',
    details: [
      'Diagnosed module-targeting and dummy-warmup compatibility failures, then used a narrow canonical-module mapping fix. Kept adapter tensors unchanged and did not modify inference mathematics or kernels.',
      'Recorded 160/160 exact sentinel responses across eight concurrent workers, split evenly between base and adapter routes. Verified adapter discovery after service recreation and retained base arithmetic and tool-call checks.',
      'Recorded a separate extended gate of 20 switches and 61 Level-1 sleep/wake cycles for the LoRA derivative. Kept that campaign distinct from the earlier sleep-only 61-cycle result, and retained versioned inputs and rollback images.',
    ],
    boundary: 'Deployment and integration of a publisher adapter, not personal LoRA training or checkpoint authorship. Short sentinel checks establish bounded route/output integrity, not sustained throughput or better creative writing. An early adapter arithmetic failure remains part of the record; later smoke passes do not erase it. No universal rank-256 backend support or byte-deterministic prose is claimed.',
  },
  {
    id: 'storage', title: 'AI Lab NVMe Storage Engineering', focus: 'High-throughput storage and reproducible I/O measurement',
    status: 'Engineered lab storage; historical sequential direct-read tests',
    summary: 'Engineered two independent four-drive PCIe 5.0 NVMe RAID0 arrays for the AI lab. Repeated fio sequential direct-read testing against prepared 100 GiB files recorded 53.21 GB/s on the 8 TB array and 55.24 GB/s on the 16 TB array, with each array tested independently.',
    printSummary: 'Engineered independent four-drive PCIe 5.0 NVMe RAID0 arrays delivering 53.21 and 55.24 GB/s sequential direct reads in bounded fio tests.',
    details: [
      'The 8 TB array (4 x 2 TB) recorded 53.21 GB/s / 49.56 GiB/s at approximately 50,748 IOPS; the 16 TB array (4 x 4 TB) recorded 55.24 GB/s / 51.44 GiB/s at approximately 52,678 IOPS. Kept decimal and binary units distinct.',
      'Both tests completed with zero fio errors. All eight NVMe devices reported zero SMART critical warnings or media errors, no matching kernel faults were observed during testing, and all 54 running container workloads remained intact.',
      'Retained the direct-I/O workload, prepared-file size, per-array scope, and approximately 90-97% system CPU utilization per job. The CPU observation suggests submission overhead may constrain the single-job workload; it does not establish a specific bottleneck or PCIe saturation.',
    ],
    boundary: 'Historical owner-reported read results, not a new benchmark or independently reproduced performance test. Rates are per array, not combined throughput or write performance; no PCIe-bus saturation or application-level speedup is claimed. Fault checks cover the recorded test window. RAID0 provides no redundancy and is not presented as a backup or resilient production-storage design. Current hardware availability is not established by these results.',
  },
  {
    id: 'preloader', title: 'Open-WebUI Model Preloader', focus: 'Browser-side AI workflow integration',
    status: 'Built and used in the lab; performance gains not benchmarked',
    summary: 'Built and used a JavaScript/Tampermonkey integration that initiates model warmup on Open-WebUI selection, aiming to overlap initialization with user interaction before the first prompt.',
    printSummary: 'Built a browser-side Open-WebUI integration for selection-triggered model warmup, with debounced events, authenticated requests, cooldown controls, and documented operating behavior.',
    details: [
      'Implemented debounced DOM-driven selection handling, deterministic model-ID mapping, client request cancellation, cooldown/force-warm controls, authenticated API fallback, and persisted state.',
      'Maintained versioned source, architecture documentation, change notes, troubleshooting guidance, and a structured manual-validation checklist.',
      'Preserved implementation caveats and separated confirmed lab use from static source checks, unperformed runtime tests, and roadmap features.',
    ],
    boundary: 'Implemented independent lab software, not an upstream Open-WebUI contribution or commercial deployment. No retained before/after latency or GPU-overhead benchmark establishes cold-start elimination. Client cancellation does not guarantee backend work stops. Public repository, license clearance, and current-version compatibility are not established by the supplied artifacts.',
  },
  {
    id: 'proposals', title: 'Reasoning Reliability Research Proposals', focus: 'Research design and evaluation planning',
    status: 'Proposal and design only; no combined-system experiments',
    summary: 'Authored technical proposals on LLM reasoning reliability, with planned evaluation of correctness and computational cost. The work remains proposal and design only, with no combined-system implementation, experiments, or measured gains.',
    printSummary: 'Authored design-only reasoning and repair proposals with evaluation plans; no implementation, measured gains, or peer-reviewed publication claimed.',
    details: [
      'Defined evaluation questions, controls, failure modes, and comparison criteria before implementation, keeping intended benefits separate from measured results.',
      'Distinguished model confidence from correctness and proposed independent artifact validation for agent repairs.',
      'Credited existing research methods; the contribution is synthesis and integration design, not an established first-ever algorithm or published/peer-reviewed paper.',
    ],
    boundary: 'Proposal/design only, as confirmed by the author. No combined-system implementation, experimental improvement, safety guarantee, or publication is claimed. Papers, diagrams, and internal architecture details remain private; this entry is a high-level abstract only.',
  },
];

export const resumeProjects = projects.filter(project => ['residency', 'ai-q', 'piper'].includes(project.id));

export const researchProfile = {
  title: 'Applied AI Research',
  summary: 'Independent research through TechSoft Systems in AI infrastructure, LLMOps, retrieval evaluation, stateful platform reliability, agent systems, and evidence integrity. Project leadership, hands-on integration, and AI-assisted development; implemented lab systems, operational personal deployments, and design-only proposals retain separate status.',
};

export const residencyMeasurements = [
  { title: 'Bidirectional model switching', result: '0.960760 / 0.973000 seconds', method: 'September 1 selected Omni-to-Lightning and reverse tests. Wall time from source Level-1 sleep start through the target first nonempty visible content delta, including state verification; short nonthinking streamed marker requests.' },
  { title: 'Pinned-runtime sleep/wake acceptance', result: '61/61 cycles; 122/122 checks; approx. 473 ms mean wake', method: 'Separate September 1 Lightning acceptance campaign with vLLM 0.28.1rc1.dev130+g44fe2a392. The dedicated 50-cycle soak is included in the 61-cycle total. First sleep established retained host mappings; Responses API testing was excluded.' },
  { title: 'Synchronized dual-GPU wakes', result: '1.630-1.634 seconds', method: 'Median pair completion for four three-cycle conditions (twelve pair cycles overall) with an active embedder. Concurrent target-wake timing, not source-sleep-to-first-token or general agent-task latency.' },
  { title: 'Host-memory bandwidth contention', result: '274.7 GB/s STREAM; 3.5-3.9% higher median pair wake', method: 'Separate near-saturation matrix: paired-wake medians rose from 1.625/1.622 to 1.682/1.685 seconds. Individual smaller-model wakes rose approximately 10%. Bandwidth stress, not RAM-capacity exhaustion or proof of PCIe saturation.' },
  { title: 'Final stable-gate contention matrix', result: '60/60 arithmetic checks', method: 'Final replacement-gate matrix with no observed restarts, matching GPU/kernel faults, or swap use. Earlier failed Nano gates and later numerical failures remain part of the record; this is not universal model correctness or a long-duration soak.' },
];

export const inferenceEngineering = {
  title: 'Inference & Platform Engineering',
  focus: 'AI infrastructure, LLMOps, and reproducible operations',
  status: 'Implemented lab serving; historical workload-specific benchmarks',
  paragraphs: [
    'Convert base models to NVFP4 using NVIDIA Model Optimizer, validate and optimize the converted checkpoints, and deploy through vLLM. Work includes FP8 KV caching, MTP speculative decoding, prefix caching, chunked prefill, CUDA graphs, and model residency. Personal conversion experience is distinct from deploying publisher-supplied NVFP4 checkpoints.',
    'Integrate embedding/reranking services, local speech, and multimodal workloads. LLMOps includes pinned runtime images, functional acceptance checks, model-local capacity planning, observability, verified backups, state-preserving container updates, and narrow rollback procedures. Ollama remains for basic testing and selected embedding workloads.',
  ],
  details: [
    'Designed reproducible inference comparisons using matched decoding settings, immutable model/runtime identities, bounded concurrency, and explicit timing definitions; retained failed attempts and workload-specific acceptance limits.',
    'Investigated unsuccessful TP2 attempts and tested a bounded single-GPU serving configuration for Nemotron Super. Workspace and retained-VRAM headroom remained narrow. Distinguished per-sequence context limits from each engine\'s own KV capacity; startup capacity did not establish simultaneous maximum-context workload support.',
    'Evaluated role-aware embedding formats against public retrieval datasets and a separate hard-negative technical suite, informing workload-specific model selection rather than an overall quality ranking.',
    'Used infrastructure and GPU telemetry with Prometheus, Grafana, Loki, and NVIDIA DCGM Exporter, alongside fault logs and post-update checks. Monitoring coverage and bounded fault-free tests are not a production SLA.',
  ],
  boundary: 'Historical local-lab results use different workloads, timing definitions, and recorded runtime configurations. They are not direct cross-model rankings, universal model-performance claims, or guarantees on the current runtime. Residency acceptance-phase measurements do not replace these throughput campaigns. Detailed source artifacts and internal configuration remain private.',
};

export const benchmarks = [
  { model: 'Nemotron Super 120B NVFP4', result: '212.20 output tokens/sec', method: 'Warmed single-request technical workload; end-to-end rate across the configured generation, not decode-only throughput.' },
  { model: 'Nemotron Lightning 30B-A3B NVFP4', result: '568.15 output tokens/sec', method: 'Mean of five warmed synthetic runs; 59.6% above the measured target-only control on the recorded runtime.' },
  { model: 'Qwen3.8-27B NVFP4', result: '133.64-164.12 output tokens/sec', method: 'Median single-request decode rates across recorded prompt workloads; 914.20-1,130.73 aggregate output tokens/sec across eight concurrent requests.' },
];

export const skills = [
  { name: 'Infrastructure', items: 'Nutanix AHV, VMware, Hyper-V, Cisco UCS, Pure Storage, NetApp, Veeam, Linux, GPU/server engineering' },
  { name: 'Networking', items: 'Cisco Nexus/Catalyst, Palo Alto, VLAN/VXLAN, VPN, multi-site infrastructure' },
  { name: 'Security', items: 'Darktrace, Defender, Sentinel, Rapid7, Syxsense, identity controls, incident response, vulnerability management' },
  { name: 'AI Infrastructure & LLMOps', items: 'CUDA, NVIDIA Model Optimizer, NVFP4, vLLM, GPU residency, capacity planning, inference evaluation, embeddings/reranking, AI-Q, NeMo Agent Toolkit, Hermes, Honcho, MCP' },
  { name: 'Engineering', items: 'Docker, Python, Bash, PowerShell, SQL, TypeScript/JavaScript, FastAPI, PostgreSQL, Redis, GitHub Actions' },
  { name: 'Observability', items: 'Prometheus, Grafana, Loki, NVIDIA DCGM Exporter, infrastructure and GPU telemetry' },
];

export const printSkills = [
  { name: 'Infrastructure', items: 'Nutanix AHV, VMware, Hyper-V, Cisco UCS, Pure Storage, NetApp, Veeam, Linux' },
  { name: 'Networking', items: 'Cisco Nexus/Catalyst, Palo Alto, VLAN/VXLAN, VPN' },
  { name: 'Security', items: 'Darktrace, Defender, Sentinel, Rapid7, Syxsense, identity, incident response' },
  { name: 'AI Infrastructure & LLMOps', items: 'CUDA, Model Optimizer, NVFP4, vLLM, residency/capacity, inference evaluation, AI-Q/NeMo, Hermes, Honcho, MCP' },
  { name: 'Engineering', items: 'Docker, Python, Bash, PowerShell, SQL, TypeScript/JavaScript, FastAPI, GitHub Actions' },
  { name: 'Observability', items: 'Prometheus, Grafana, Loki, NVIDIA DCGM Exporter' },
];

export const education = [
  'Computer Programming & Digital Repair Certificates - Norfolk Technical Vocational Center',
  'Coursework - Tidewater Community College',
  'InfraGard Arizona Member; open-source contributor and advocate',
];
