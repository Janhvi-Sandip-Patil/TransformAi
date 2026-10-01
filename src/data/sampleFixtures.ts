export interface SampleFixture {
  id: string;
  name: string;
  category: string;
  format: 'pdf' | 'docx' | 'image' | 'audio' | 'text';
  tag: string;
  description: string;
  raw_text: string;
  ocr_simulated?: boolean;
  ocr_confidence?: number;
}

export const SAMPLE_FIXTURES: SampleFixture[] = [
  {
    id: 'ntro-power-grid-threat',
    name: 'NTRO-ADVISORY-2026-088: Critical Infrastructure Cyber Incident',
    category: 'National Cyber Security',
    format: 'pdf',
    tag: 'Scanned PDF OCR',
    description: 'Declassified threat advisory detailing APT-44 cyber infiltration on Western Regional Power Grid SCADA nodes.',
    ocr_simulated: true,
    ocr_confidence: 0.94,
    raw_text: `NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO)
CYBER INTELLIGENCE & INFRASTRUCTURE PROTECTION DIVISION
CLASSIFICATION: CONFIDENTIAL // EYES ONLY // OPERATIONAL IMMEDIATE
REF ID: NTRO-CIIP-ADV-2026-088
DATE OF ISSUE: 18 AUGUST 2026

SUBJECT: COORDINATED SPEAR-PHISHING AND SCADA INTRUSION ATTEMPT ON WESTERN LOAD DESPATCH CENTRE (WRLDC)

1. EXECUTIVE SUMMARY:
On 14 August 2026 at 03:42 IST, automated intrusion detection sensors at Western Regional Load Despatch Centre (WRLDC) detected anomalous telemetry and outbound lateral traversal originating from substation control terminal IP 192.168.44.112. Subsequent forensic analysis by NTRO Threat Hunt Unit confirmed targeted exploitation using a zero-day vulnerability in Industrial Remote Terminal Units (RTU Firmware v4.12.08) attributed to state-nexus actor 'SILVER_MONSOON' (also tracked as APT-44).

2. KEY INCIDENT CHRONOLOGY:
- 10 August 2026 09:15 IST: Initial access gained via spear-phishing email targeting Senior Control Room Engineer Vikramaditya Sen, delivering weaponized payload 'GridStitcher.vbs'.
- 12 August 2026 23:00 IST: Lateral movement to SCADA Human Machine Interface (HMI) nodes using pass-the-hash techniques.
- 14 August 2026 03:42 IST: Attempted injection of forged Modbus TCP packets designed to trigger trip circuit anomalies at 765kV Wardha substation.
- 14 August 2026 04:10 IST: Automated air-gap fail-safe triggered; NTRO and CERT-In emergency quarantine protocol activated, isolating control VLANs within 28 minutes.

3. IDENTIFIED THREAT ACTORS & INDICATORS:
- Threat Actor: SILVER_MONSOON (APT-44 / RedEcho subsidiary)
- Command & Control C2 Servers: 185.220.101.54, 45.154.255.89 (Registered via pseudonymous offshore VPS)
- Malware Signature: Trojan.Win32.GridStitcher (SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)
- Affected Equipment: ABB RTU560 Gateway, Schneider Electric EcoStruxure Foxboro DCS

4. STRATEGIC RECOMMENDATIONS & MANDATORY MITIGATION:
1. Immediate isolation and credential revocation for all SCADA domain controllers across Northern, Western, and Southern grids.
2. Mandatory rollout of micro-segmentation policies prohibiting Modbus/DNP3 traffic over non-dedicated physical interfaces.
3. Implementation of hardware-enforced unidirectional security gateways (data diodes) for historian data replication by 01 September 2026.
4. Mandatory multi-factor biometric authentication for all engineering change requests.`
  },
  {
    id: 'maritime-satellite-surveillance',
    name: 'IN-MDA-2026: Bay of Bengal Maritime Domain Intelligence',
    category: 'Maritime Defense',
    format: 'docx',
    tag: 'Structured DOCX',
    description: 'Multi-sensor naval reconnaissance report on suspicious survey vessel movement in the Exclusive Economic Zone.',
    raw_text: `INFORMATION FUSION CENTRE - INDIAN OCEAN REGION (IFC-IOR)
JOINT MARITIME INTELLIGENCE ASSESSMENT // RESTRICTED
DOC ID: IFC-IOR-MDA-2026-402
DATE: 22 AUGUST 2026

TITLE: TRACKING OF UNREGISTERED RESEARCH VESSEL 'HAIYANG EXPLORER-9' NEAR ANDAMAN & NICOBAR EXCLUSIVE ECONOMIC ZONE

1. STRATEGIC OVERVIEW:
Between 15 August 2026 and 21 August 2026, satellite synthetic aperture radar (SAR) imagery and coastal AIS monitoring detected vessel 'Haiyang Explorer-9' conducting bathymetric survey patterns approximately 64 nautical miles East-South-East of Port Blair, traversing the 200-nautical-mile Indian Exclusive Economic Zone (EEZ) without prior statutory clearance from the Ministry of External Affairs.

2. VESSEL PARTICULARS & SENSOR DATA:
- Vessel Name: Haiyang Explorer-9 (IMO: 9845120, Flag: Panama/FOC)
- Operating Entity: Southern Ocean Geological Institute (SOGI), Guangzhou
- Length Overall: 112.5 meters | Displacement: 4,800 gross tonnes
- Specialized Equipment Identified: Hull-mounted multi-beam echo sounder, towed underwater acoustic glider arrays, satellite uplink radomes (Ka-band).

3. PATROL RESPONSE & ACTIONS TAKEN:
- 16 August 2026: Indian Coast Guard Ship ICGS Vijit deployed for shadow escort and visual verification.
- 18 August 2026: Naval Air Squadron 312 P-8I Neptune conducted 4 reconnaissance sorties capturing high-resolution optical and electronic intelligence (ELINT) signatures.
- 20 August 2026: Diplomatic demarche issued to flag administration demanding immediate cessation of hydrographic profiling in Indian territorial waters.

4. KEY RISK EVALUATION:
Acoustic profiles and bathymetric mapping collected in the Ten Degree Channel enable submerged submarine transit modeling, posing direct operational risks to Indian Navy Eastern Fleet deployment routes.`
  },
  {
    id: 'upi-financial-fraud-ring',
    name: 'CERT-In & LEA Dossier: Targeted UPI Phishing & Mule Network',
    category: 'Financial Cybercrime',
    format: 'image',
    tag: 'Image OCR Scanned',
    ocr_simulated: true,
    ocr_confidence: 0.89,
    description: 'Law enforcement briefing on cross-border APK malware syndicates siphoning funds via automated UPI hooks.',
    raw_text: `INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)
SPECIAL CYBER FINANCIAL FRAUD INVESTIGATION CELL
REPORT NUMBER: CERT-IN-FIN-2026-114 | DATE: 25 AUGUST 2026

SUBJECT: DISMANTLING OF 'BHARAT-PAYLOAD' ANDROID MALWARE CAMPAIGN EXPLOITING ACCESSIBILITY SERVICES

1. BACKGROUND & INCIDENT CONTEXT:
During Q2 2026, National Cyber Crime Reporting Portal (NCRP / 1930 Helpline) recorded over 14,200 complaints regarding unauthorized debits from citizen bank accounts across Maharashtra, Karnataka, and Delhi-NCR, amounting to approximately ₹48.6 Crores.

2. TECHNICAL MECHANICS OF EXPLOITATION:
- Initial Vector: Fraudulent SMS and WhatsApp links masquerading as "Electricity Bill Disconnection Alerts" or "KYC PAN Update Mandate" (e.g., 'bijli-bill-update-nic.apk').
- Malicious Capability: Upon installation, the malware prompts for Android Accessibility Services permission. Once granted, it captures SMS OTPs, intercepts screen overlays, and programmatically executes UPI transfers via PhonePe, Google Pay, and Paytm without user visual awareness.
- Money Mule Infrastructure: Illicit funds were routed through 320 layered "mule" accounts across 12 co-operative banks before immediate conversion into USDT cryptocurrency via P2P escrow channels.

3. COORDINATED LAW ENFORCEMENT ACTION (OPERATION VISHALAKSH):
- On 22 August 2026, simultaneous raids in Jamtara, Bharatpur, and Bengaluru led to the arrest of 19 kingpins and seizure of 420 SIM cards, 84 POS terminals, and 12 hardware wallets.
- Freeze orders issued under Section 102 CrPC for 1,140 linked UPI Virtual Payment Addresses (VPAs).`
  },
  {
    id: 'tactical-radio-dispatch-audio',
    name: 'SIGINT Tactical Intercept: High-Altitude Border Security Dispatch',
    category: 'Defense Signals Intelligence',
    format: 'audio',
    tag: 'Audio Transcription',
    description: 'Transcribed tactical radio transmission from Northern Sector surveillance post recording drone activity.',
    raw_text: `[SIGINT AUDIO TRANSCRIPT // AUDIO FILE: OP_NORTH_DISPATCH_20260824_0215.WAV]
AUTOMATED SPEECH RECOGNITION TRANSCRIBED // MODEL: WHISPER-MEDIUM-EN
RECORDED AT: 24 AUGUST 2026 02:15:00 UTC // FREQUENCY: 142.850 MHz VHF

[00:00:02 - POST COMMANDER CAPT. R.K. VERMA]: Control, this is Alpha-Six Post at elevation 14,200 feet, Sector Daulat Beg Oldi. We have a visual and thermal contact on an unmanned aerial system crossing ridge marker Bravo-9.
[00:00:18 - SECTOR HQ / MAJOR DHILLON]: Alpha-Six, Control copies. State azimuth, altitude, and velocity. Confirm if anti-drone radar countermeasure is locked.
[00:00:32 - CAPT. R.K. VERMA]: Azimuth 035 degrees North-East, operating at approximately 400 meters above ground level, velocity 45 knots. Sound signature matches hexacopter electric propulsion. Drone is carrying an underslung payload container, estimated 8 kilograms.
[00:00:54 - SECTOR HQ / MAJOR DHILLON]: Alpha-Six, authorize engagement with 'D-4' Drone Countermeasure Jamming System immediately. Activate GPS spoofing and RF denial on 2.4 and 5.8 GHz bands.
[00:01:12 - CAPT. R.K. VERMA]: Jammer activated... Target RF link severed at 02:18:14 hours. Drone has entered fail-safe auto-descent protocol near coordinate 35.244 North, 77.891 East. Dispatching Quick Reaction Team (QRT) Charlie for payload recovery and forensic triage.
[00:01:35 - SECTOR HQ]: Acknowledged Alpha-Six. Maintain perimeter alert status Amber until forensic team confirms payload neutralization.`
  }
];
