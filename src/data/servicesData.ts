import { ServiceItem } from '../types';
import defaultAssets from './permanentWebsiteAssets.json';

const BASE_SERVICES_DATA: ServiceItem[] = [
  {
    id: 'custom-tattoo-design',
    name: 'Custom Tattoo Design',
    subtitle: 'Bespoke Skin Art',
    category: 'tattoo',
    avgTime: '60–180 mins',
    description: 'Bespoke skin art tailored from your personal story, aesthetic references, and anatomical contours. Every piece is an original masterpiece drafted from scratch.',
    sessionSteps: [
      {
        number: '01',
        title: 'Concept & Anatomical Blueprint',
        detail: 'In-depth consultation to map motifs, linework density, and natural muscle flow.'
      },
      {
        number: '02',
        title: 'Sterile Suite Preparation',
        detail: 'Hospital-grade antiseptic skin prep and fresh single-use needle cartridge unboxing in your direct sight.'
      },
      {
        number: '03',
        title: 'Artisanal Ink Execution',
        detail: 'Layered needle precision using carbon blacks and EU-certified vegan pigments.'
      },
      {
        number: '04',
        title: 'SecondSkin Dressing & Aftercare',
        detail: 'Sterile polyurethane breathable seal applied alongside custom day-by-day healing regimen.'
      }
    ],
    accent: '#D31E1E',
    imageUrl: '/uploads/service-custom-tattoo-design.jpg'
  },
  {
    id: 'tattoo-cover-ups-reworkings',
    name: 'Tattoo Cover-Ups & Reworkings',
    subtitle: 'Transformation & Mastery',
    category: 'tattoo',
    avgTime: '120–240 mins',
    description: 'Transforming old, blurred, or faded ink into fresh, seamless masterpieces through strategic shading, organic geometry, and deep pigment integration.',
    sessionSteps: [
      {
        number: '01',
        title: 'Pigment Density Analysis',
        detail: 'Assessing underlying ink saturation and skin undertones to plan optical camouflage.'
      },
      {
        number: '02',
        title: 'Custom Stencil Architecture',
        detail: 'Drafting high-contrast motifs that naturally obscure legacy lines without muddying.'
      },
      {
        number: '03',
        title: 'High-Saturation Reworking',
        detail: 'Layered dark shading and strategic highlights to completely redefine the artwork.'
      },
      {
        number: '04',
        title: 'Post-Restoration Care',
        detail: 'Targeted healing protocol for reworked skin tissue to ensure permanent crispness.'
      }
    ],
    accent: '#162A4A',
    imageUrl: '/uploads/service-tattoo-cover-ups-reworkings.jpg'
  },
  {
    id: 'sleeve-tattoos',
    name: 'Sleeve Tattoos',
    subtitle: 'Full & Half Arm Narrative',
    category: 'tattoo',
    avgTime: 'Multi-session / 4–6 hrs',
    description: 'Cohesive full-arm or half-arm storytelling with intricate shading, anatomical transitions, and seamless composition wrapped perfectly around limbs.',
    sessionSteps: [
      {
        number: '01',
        title: 'Full Limb Mapping',
        detail: 'Drafting flow curves connecting shoulder, bicep, elbow ditch, and forearm.'
      },
      {
        number: '02',
        title: 'Linework Foundation',
        detail: 'Laying down structural outlines and negative-space breathers across the limb.'
      },
      {
        number: '03',
        title: 'Graduated Wash & Texture',
        detail: 'Progressive sittings dedicated to contrast gradients, texture packing, and depth.'
      },
      {
        number: '04',
        title: 'Comprehensive Recovery Support',
        detail: 'Inter-session healing checks and premium aftercare balm regimen.'
      }
    ],
    accent: '#D31E1E',
    imageUrl: '/uploads/service-sleeve-tattoos.jpg'
  },
  {
    id: 'large-scale-full-body',
    name: 'Large-Scale & Full-Body Tattoos',
    subtitle: 'Museum-Grade Ink Architecture',
    category: 'tattoo',
    avgTime: 'Custom Multi-Session',
    description: 'High-endurance, museum-grade body art crafted across multiple sittings for full backpieces, chests, and full torso projects.',
    sessionSteps: [
      {
        number: '01',
        title: 'Full Body Canvas Architecture',
        detail: 'Custom anatomical drafting aligned with spine curvature, ribs, and musculature.'
      },
      {
        number: '02',
        title: 'Multi-Stage Project Schedule',
        detail: 'Strategic pacing plan balancing endurance, skin trauma minimization, and rapid healing.'
      },
      {
        number: '03',
        title: 'Deep Black & Shading Blocks',
        detail: 'Intensive sessions focused on high-impact blackwork, realism, or color saturation.'
      },
      {
        number: '04',
        title: 'VIP Master Class Aftercare',
        detail: 'Dedicated monitoring between sessions with antimicrobial healing packs.'
      }
    ],
    accent: '#0D2137',
    imageUrl: '/uploads/service-large-scale-full-body.jpg'
  },
  {
    id: 'traditional-asian-polynesian',
    name: 'Traditional Asian & Polynesian Tribal',
    subtitle: 'Sacred Heritage & Geometric Flow',
    category: 'tattoo',
    avgTime: '120–300 mins',
    description: 'Bold geometric flow, sacred Polynesian tatau motifs, Japanese Irezumi elements, and high-contrast linework honoring ancient ink traditions.',
    sessionSteps: [
      {
        number: '01',
        title: 'Cultural Motif Alignment',
        detail: 'Selecting authentic motifs representing strength, lineage, protection, and wisdom.'
      },
      {
        number: '02',
        title: 'Freehand Anatomical Placement',
        detail: 'Custom pen-drawn contouring directly on skin to harmonize with muscular movement.'
      },
      {
        number: '03',
        title: 'Solid Pigment Saturation',
        detail: 'Dense, pitch-black ink saturation using heavy-gauge magnum groupings.'
      },
      {
        number: '04',
        title: 'Preservation & Deepening',
        detail: 'High-contrast protection guide for lasting black pigment vibrancy.'
      }
    ],
    accent: '#D31E1E',
    imageUrl: '/uploads/service-traditional-asian-polynesian.jpg'
  },
  {
    id: 'custom-lettering-memorial',
    name: 'Custom Tattoo Lettering & Memorial',
    subtitle: 'Fine-Line Typography & Tributes',
    category: 'tattoo',
    avgTime: '45–90 mins',
    description: 'Precision script, meaningful typography, tribute portraits, and delicate memorial designs etched with reverence and microscopic accuracy.',
    sessionSteps: [
      {
        number: '01',
        title: 'Calligraphy & Script Styling',
        detail: 'Iterative digital and hand-drawn script design to capture emotional resonance.'
      },
      {
        number: '02',
        title: 'Micro-Needle Calibration',
        detail: 'Single-needle (1RL/3RL) setup calibrated for razor-sharp, feather-light lines.'
      },
      {
        number: '03',
        title: 'Painless Gentle Inking',
        detail: 'Minimal-trauma execution ideal for sensitive placements like collarbones and wrists.'
      },
      {
        number: '04',
        title: 'Fine-Line Preservation Seal',
        detail: 'Ultra-thin medical film application to prevent scab formation and ink blur.'
      }
    ],
    accent: '#162A4A',
    imageUrl: '/uploads/service-custom-lettering-memorial.jpg'
  },
  {
    id: 'tattoo-touch-ups-finishing',
    name: 'Tattoo Touch-Ups & Finishing',
    subtitle: 'Vibrancy & Edge Restoration',
    category: 'tattoo',
    avgTime: '30–60 mins',
    description: 'Restoring vibrancy, crisp edges, and deep pigment saturation to healed pieces, sharpening blurred borders and reviving rich contrast.',
    sessionSteps: [
      {
        number: '01',
        title: 'Line & Tone Audit',
        detail: 'Identifying microscopic pigment dropouts and areas needing color fortification.'
      },
      {
        number: '02',
        title: 'Surgical Skin Refresh',
        detail: 'Sterile preparation and gentle exfoliation of the target area.'
      },
      {
        number: '03',
        title: 'Rapid Color Re-Injection',
        detail: 'Fast, high-efficiency pigment injection restoring day-one brilliance.'
      },
      {
        number: '04',
        title: 'Gloss Finish Seal',
        detail: 'Immediate soothing hydrogel application with rapid 5-day recovery protocol.'
      }
    ],
    accent: '#0D2137',
    imageUrl: '/uploads/service-tattoo-touch-ups-finishing.jpg'
  },
  {
    id: 'tattoo-removal-permanent-makeup',
    name: 'Tattoo Removal & Permanent Makeup',
    subtitle: 'Cosmetic Artistry & Pigment Fading',
    category: 'specialized',
    avgTime: '45–60 mins',
    description: 'Safe pigment fading consultations, microblading touch-ups, and precision cosmetic artistry performed with sterile medical standards.',
    sessionSteps: [
      {
        number: '01',
        title: 'Facial Symmetry & Skin Assessment',
        detail: 'Micro-measurement and skin type mapping for natural cosmetic enhancement.'
      },
      {
        number: '02',
        title: 'Topical Numbing & Hygiene',
        detail: 'High-efficacy pharmaceutical topical numbing for zero discomfort.'
      },
      {
        number: '03',
        title: 'Micro-Pigment Placement',
        detail: 'Fine strokes following organic facial hair patterns or targeted fading.'
      },
      {
        number: '04',
        title: 'Cosmetic Barrier Cream',
        detail: 'Antimicrobial protective coating ensuring soft, natural healed tones.'
      }
    ],
    accent: '#D31E1E',
    imageUrl: '/uploads/service-tattoo-removal-permanent-makeup.jpg'
  },
  {
    id: 'industrial-cartilage-piercings',
    name: 'Industrial & Cartilage Piercings',
    subtitle: 'Precision Anatomical Ear Curation',
    category: 'piercing',
    avgTime: '20–30 mins',
    description: 'Precision anatomical ear curation using implant-grade ASTM-F136 titanium barbells and needles for perfect dual-point cartilage alignment.',
    sessionSteps: [
      {
        number: '01',
        title: 'Cartilage Scaffolding Check',
        detail: 'Anatomical verification of the ear ridge to ensure zero pressure necrosis.'
      },
      {
        number: '02',
        title: 'Sterile Single-Use Needles',
        detail: 'Laser-sharpened cannula needles opened fresh in front of client.'
      },
      {
        number: '03',
        title: 'Zero-Friction Insertion',
        detail: 'Rapid, smooth puncture paired with internally threaded titanium barbell.'
      },
      {
        number: '04',
        title: 'Saline Spray Routine',
        detail: 'Sterile saline spray kit and sleep-position guidance for optimal healing.'
      }
    ],
    accent: '#162A4A',
    imageUrl: '/uploads/service-industrial-cartilage-piercings.jpg'
  },
  {
    id: 'conch-daith-rook-piercings',
    name: 'Conch, Daith & Rook Piercings',
    subtitle: 'Deep Inner-Ear Structural Art',
    category: 'piercing',
    avgTime: '20–30 mins',
    description: 'Deep inner-ear structural piercings performed with sterile single-use needles, fitted with mirror-polished ASTM titanium or genuine gemstones.',
    sessionSteps: [
      {
        number: '01',
        title: 'Fossa & Ridge Mapping',
        detail: 'Identifying the exact acoustic curve and sweet spot for painless longevity.'
      },
      {
        number: '02',
        title: 'Curved Needle Technique',
        detail: 'Specialized inner-ear curved needle trajectory for pinpoint accuracy.'
      },
      {
        number: '03',
        title: 'Seamless Ring or Curved Barbell',
        detail: 'Mirror-polished titanium jewelry with zero sharp edges or nicking.'
      },
      {
        number: '04',
        title: 'Cartilage Calming Treatment',
        detail: 'Cold sterile compress and aftercare saline rinse schedule.'
      }
    ],
    accent: '#D31E1E',
    imageUrl: '/uploads/service-conch-daith-rook-piercings.jpg'
  },
  {
    id: 'tragus-anti-tragus-helix-snug',
    name: 'Tragus, Anti-Tragus, Helix & Snug',
    subtitle: 'Delicate Ear Rim Modifications',
    category: 'piercing',
    avgTime: '15–25 mins',
    description: 'Delicate outer and inner ear rim modifications calibrated to accentuate your unique ear profile with minimal swelling and fast recovery.',
    sessionSteps: [
      {
        number: '01',
        title: 'Anatomy Symmetry Check',
        detail: 'Balancing proportions against existing jewelry and ear silhouette.'
      },
      {
        number: '02',
        title: 'Precision Clamp & Clamping',
        detail: 'Gentle stabilization to guarantee a perfectly perpendicular piercing angle.'
      },
      {
        number: '03',
        title: 'Internally Threaded Flatback Stud',
        detail: 'Flat-back labrets minimizing hair snagging and bedtime irritation.'
      },
      {
        number: '04',
        title: 'Downsizing Schedule',
        detail: 'Complimentary downsize milestone date set for 4–6 weeks post-procedure.'
      }
    ],
    accent: '#162A4A',
    imageUrl: '/uploads/service-tragus-anti-tragus-helix-snug.jpg'
  },
  {
    id: 'septum-nose-piercings',
    name: 'Septum & Nose Piercings',
    subtitle: 'Facial Centerpiece Perfection',
    category: 'piercing',
    avgTime: '15–20 mins',
    description: 'Classic nostril studs, delicate rings, and sweet-spot septum placements performed in seconds with supreme gentleness and flawless symmetry.',
    sessionSteps: [
      {
        number: '01',
        title: 'Membranous Sweet-Spot Localization',
        detail: 'Locating the thin painless tissue between nasal cartilage for zero crunch.'
      },
      {
        number: '02',
        title: 'Rapid Single-Pass Needle',
        detail: 'Ultra-fast, tear-free placement executed within 2 seconds.'
      },
      {
        number: '03',
        title: 'Circular Barbell or Clicker Fit',
        detail: 'Implant-grade titanium clicker fitted with clean symmetrical margins.'
      },
      {
        number: '04',
        title: 'Flip-Up Healing Protocol',
        detail: 'Technique to discreetly flip septum jewelry upward if required for work.'
      }
    ],
    accent: '#D31E1E',
    imageUrl: '/uploads/service-septum-nose-piercings.jpg'
  },
  {
    id: 'lip-monroe-philtrum-labret',
    name: 'Lip, Monroe, Philtrum & Labret',
    subtitle: 'Symmetrical Oral & Facial Framing',
    category: 'piercing',
    avgTime: '20–30 mins',
    description: 'Symmetrical oral and facial framing piercings including Medusa, vertical labret, Monroe, and snake bites with enamel-safe titanium flatbacks.',
    sessionSteps: [
      {
        number: '01',
        title: 'Lip Contour & Gum Line Survey',
        detail: 'Checking tooth enamel and gum contact angles to prevent dental erosion.'
      },
      {
        number: '02',
        title: 'Alcohol-Free Oral Rinse Prep',
        detail: 'Full intra-oral and dermal sanitization with antiseptic wash.'
      },
      {
        number: '03',
        title: 'Smooth Needle Passage',
        detail: 'Painless needle pass paired with extra-length initial healing post.'
      },
      {
        number: '04',
        title: 'Oral Care Protocol',
        detail: 'Saline outside, alcohol-free mouthwash inside, with clear diet guidelines.'
      }
    ],
    accent: '#0D2137',
    imageUrl: '/uploads/service-lip-monroe-philtrum-labret.jpg'
  },
  {
    id: 'tongue-smiley-webbing-cheek',
    name: 'Tongue, Smiley, Webbing & Cheek',
    subtitle: 'Specialized Intra-Oral Modifications',
    category: 'piercing',
    avgTime: '25–35 mins',
    description: 'Specialized intra-oral and facial dimple piercings performed under strict clinical hygiene protocols, ensuring complete safety and comfort.',
    sessionSteps: [
      {
        number: '01',
        title: 'Vascular & Frenulum Inspection',
        detail: 'Sublingual transillumination to bypass veins and frenulum tissue safely.'
      },
      {
        number: '02',
        title: 'Double Surgical Cleansing',
        detail: 'Comprehensive medical gargle and sterile workstation setup.'
      },
      {
        number: '03',
        title: 'Quick Controlled Channeling',
        detail: 'Instant channel creation with high-polish titanium ball bar.'
      },
      {
        number: '04',
        title: 'Swelling Control & Care Kit',
        detail: 'Ice soothing routine, food texture guide, and weekly follow-up check.'
      }
    ],
    accent: '#D31E1E',
    imageUrl: '/uploads/service-tongue-smiley-webbing-cheek.jpg'
  },
  {
    id: 'navel-eyebrow-bridge-anchor',
    name: 'Navel, Eyebrow, Bridge & Anchors',
    subtitle: 'Precision Body & Dermal Anchors',
    category: 'piercing',
    avgTime: '20–35 mins',
    description: 'Precision body and dermal anchor placements tailored to your anatomy, featuring micro-dermal feet that integrate securely under the skin.',
    sessionSteps: [
      {
        number: '01',
        title: 'Tissue Pinch & Depth Gauge',
        detail: 'Assessing skin flexibility and subcutaneous pocket depth.'
      },
      {
        number: '02',
        title: 'Dermal Punch or Piercing Needle',
        detail: 'Medical-grade biopsy punch or cannula needle for micro-millimeter precision.'
      },
      {
        number: '03',
        title: 'Anchoring & Low-Profile Gem Fit',
        detail: 'Implant-grade perforated base fitted flush to dermal tissue.'
      },
      {
        number: '04',
        title: 'Snag-Proof Shielding',
        detail: 'Breathable compression bandage and anchor stability instructions.'
      }
    ],
    accent: '#162A4A',
    imageUrl: '/uploads/service-navel-eyebrow-bridge-anchor.jpg'
  }
];

const customServiceMap = (defaultAssets.services as Record<string, string>) || {};

export const SERVICES_DATA: ServiceItem[] = BASE_SERVICES_DATA.map((service) => ({
  ...service,
  imageUrl: customServiceMap[service.id] || service.imageUrl,
}));
