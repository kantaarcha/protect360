import { useLanguage } from '../context/LanguageContext';
import {
  DEFAULT_AVATAR_CONFIG,
  HAIR_PALETTES,
  OUTFIT_PALETTES,
  ROOM_THEMES,
  SKIN_PALETTES,
} from '../utils/pixelAvatar';

function PixelBackdrop({ sceneType, wealthTier, roomTheme = 'sky' }) {
  const isDim = wealthTier === 'struggling' && sceneType === 'office_room';
  const room = ROOM_THEMES[roomTheme] || ROOM_THEMES.sky;

  if (sceneType === 'hospital') {
    return (
      <g>
        {/* Soft sterile sky-mint wall & floor matching PROTECT360 cool palette */}
        <rect x="0" y="0" width="220" height="82" fill="#E6F4F1" />
        <rect x="0" y="78" width="220" height="4" fill="#B5DCD6" />
        <rect x="0" y="82" width="220" height="30" fill="#D5EBE8" />
        {/* Wall tiles accent */}
        <rect x="0" y="42" width="220" height="2" fill="#CFEAE5" />
        {/* Hospital Cross Sign */}
        <rect x="20" y="14" width="24" height="24" rx="2" fill="#FFFFFF" stroke="#94C5BF" strokeWidth="1" />
        <rect x="30" y="18" width="4" height="16" fill="#E05252" />
        <rect x="24" y="24" width="16" height="4" fill="#E05252" />
        {/* Heart Rate Monitor */}
        <rect x="148" y="16" width="54" height="32" fill="#142B4A" />
        <rect x="152" y="20" width="46" height="22" fill="#0F2038" />
        <path
          d="M154 32 H164 L168 24 L173 38 L178 29 H196"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2.5"
        />
        {/* IV Drip Stand */}
        <rect x="64" y="22" width="3" height="60" fill="#64748B" />
        <rect x="58" y="80" width="15" height="3" fill="#475569" />
        <rect x="61" y="22" width="14" height="3" fill="#64748B" />
        <rect x="71" y="26" width="8" height="14" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
        <rect x="72" y="33" width="6" height="6" fill="#38BDF8" />
        {/* Hospital Bed right side */}
        <rect x="142" y="64" width="66" height="18" fill="#FFFFFF" />
        <rect x="142" y="74" width="66" height="8" fill="#1D4ED8" />
        <rect x="140" y="56" width="4" height="28" fill="#475569" />
        <rect x="206" y="60" width="4" height="24" fill="#475569" />
        <rect x="146" y="59" width="16" height="6" fill="#DBEAFE" />
      </g>
    );
  }

  if (sceneType === 'rainy_street') {
    return (
      <g>
        {/* Moody PROTECT360 Twilight Navy Sky */}
        <rect x="0" y="0" width="220" height="82" fill="#0F223D" />
        <rect x="0" y="82" width="220" height="30" fill="#1E293B" />
        <rect x="0" y="82" width="220" height="3" fill="#334155" />
        {/* Distant Rain-soaked Skyline */}
        <rect x="12" y="32" width="26" height="50" fill="#162E50" />
        <rect x="44" y="22" width="32" height="60" fill="#1B365D" />
        <rect x="142" y="26" width="34" height="56" fill="#162E50" />
        <rect x="182" y="38" width="28" height="44" fill="#1B365D" />
        {/* Dim Window Glows */}
        <rect x="20" y="42" width="5" height="6" fill="#FDE68A" opacity="0.55" />
        <rect x="52" y="34" width="6" height="6" fill="#93C5FD" opacity="0.45" />
        <rect x="150" y="38" width="6" height="6" fill="#FDE68A" opacity="0.5" />
        {/* Streetlamp & Puddle Glow */}
        <rect x="188" y="18" width="4" height="66" fill="#475569" />
        <rect x="176" y="18" width="16" height="4" fill="#64748B" />
        <rect x="174" y="22" width="8" height="5" fill="#FBBF24" />
        <ellipse cx="178" cy="96" rx="22" ry="4" fill="#FBBF24" opacity="0.16" />
        <ellipse cx="110" cy="100" rx="28" ry="4" fill="#38BDF8" opacity="0.14" />
        {/* Animated Crisp Pixel Raindrops */}
        <g className="px-rain-layer" fill="#93C5FD" opacity="0.7">
          <rect x="24" y="10" width="2" height="8" />
          <rect x="58" y="26" width="2" height="8" />
          <rect x="92" y="14" width="2" height="8" />
          <rect x="130" y="32" width="2" height="8" />
          <rect x="162" y="12" width="2" height="8" />
          <rect x="40" y="54" width="2" height="8" />
          <rect x="146" y="58" width="2" height="8" />
        </g>
      </g>
    );
  }

  if (sceneType === 'cafe_mall') {
    return (
      <g>
        {/* Warm Stylish Boutique / Cafe matching Coral & Teal accents */}
        <rect x="0" y="0" width="220" height="82" fill="#FFF7ED" />
        <rect x="0" y="82" width="220" height="30" fill="#F3E4D2" />
        <rect x="0" y="80" width="220" height="3" fill="#D6C2AA" />
        {/* Striped Awning */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <rect
            key={i}
            x={i * 20}
            y="0"
            width="20"
            height="14"
            fill={i % 2 === 0 ? '#2878C8' : '#FFFFFF'}
          />
        ))}
        {/* Sale Tag Sign Left */}
        <rect x="16" y="22" width="44" height="22" rx="2" fill="#142B4A" />
        <rect x="19" y="25" width="38" height="16" fill="#E05252" />
        <rect x="24" y="31" width="28" height="4" fill="#FFFFFF" />
        {/* Cafe Counter Right */}
        <rect x="146" y="50" width="62" height="32" fill="#8B5A2B" />
        <rect x="142" y="46" width="70" height="6" fill="#5C3A1B" />
        {/* Pixel Coffee Machine & Cup */}
        <rect x="160" y="28" width="20" height="18" fill="#334155" />
        <rect x="164" y="32" width="12" height="8" fill="#38BDF8" />
        <rect x="188" y="38" width="10" height="8" fill="#FFFFFF" />
      </g>
    );
  }

  if (sceneType === 'celebration') {
    return (
      <g>
        {/* Golden-Teal Sunrise Office Horizon */}
        <rect x="0" y="0" width="220" height="82" fill="#EBF5FF" />
        <rect x="0" y="82" width="220" height="30" fill="#DBEAFE" />
        <rect x="0" y="80" width="220" height="3" fill="#93C5FD" />
        {/* Panoramic Window */}
        <rect x="26" y="10" width="168" height="58" fill="#BAE6FD" stroke="#1E3A8A" strokeWidth="3" />
        {/* Bright Sun & Teal City Horizon */}
        <circle cx="164" cy="28" r="10" fill="#FDE047" />
        <rect x="36" y="42" width="22" height="24" fill="#60A5FA" />
        <rect x="64" y="34" width="26" height="32" fill="#3B82F6" />
        <rect x="132" y="38" width="24" height="28" fill="#2563EB" />
        <rect x="162" y="46" width="26" height="20" fill="#0D9488" />
        {/* Floating Confetti Pixels */}
        <g className="px-sparkle-float">
          <rect x="22" y="18" width="4" height="4" fill="#F59E0B" />
          <rect x="44" y="26" width="4" height="4" fill="#10B981" />
          <rect x="178" y="14" width="4" height="4" fill="#2563EB" />
          <rect x="198" y="28" width="4" height="4" fill="#F59E0B" />
        </g>
      </g>
    );
  }

  // Default: Cozy PROTECT360 Room / Home Office (customizable via roomTheme)
  const useMidnightWall = isDim || room.lamp;
  return (
    <g>
      <rect x="0" y="0" width="220" height="82" fill={isDim ? '#1E293B' : room.wall} />
      <rect x="0" y="82" width="220" height="30" fill={isDim ? '#334155' : room.floor} />
      <rect x="0" y="80" width="220" height="3" fill={isDim ? '#475569' : room.trim} />
      {/* Window with Day/Twilight View */}
      <rect
        x="20"
        y="14"
        width="54"
        height="42"
        fill={isDim ? '#0F172A' : room.windowBg}
        stroke={useMidnightWall ? '#475569' : '#1E3A5F'}
        strokeWidth="3"
      />
      <rect x="46" y="14" width="2" height="42" fill={useMidnightWall ? '#475569' : '#1E3A5F'} />
      <rect x="20" y="34" width="54" height="2" fill={useMidnightWall ? '#475569' : '#1E3A5F'} />
      {useMidnightWall && <rect x="60" y="20" width="6" height="6" fill="#FDE68A" />}
      {/* Desk & PROTECT360 Chart Monitor on Right */}
      <rect x="148" y="54" width="60" height="28" fill={isDim ? '#475569' : room.desk} />
      <rect x="144" y="50" width="68" height="5" fill={isDim ? '#334155' : room.deskTop} />
      <rect x="164" y="26" width="34" height="22" fill="#142B4A" />
      <rect x="167" y="29" width="28" height="16" fill="#0F2038" />
      {/* Tiny Upward Growth Graph */}
      <rect x="171" y="38" width="4" height="5" fill="#22B8A7" />
      <rect x="177" y="35" width="4" height="8" fill="#3B82F6" />
      <rect x="183" y="31" width="4" height="12" fill="#10B981" />
      {/* Desk Plant / Warm Lamp in Midnight Theme */}
      {room.lamp ? (
        <g>
          <rect x="152" y="42" width="4" height="8" fill="#94A3B8" />
          <rect x="148" y="34" width="12" height="8" fill="#FDE047" />
        </g>
      ) : (
        <g>
          <rect x="150" y="42" width="10" height="8" fill="#D97706" />
          <rect x="152" y="35" width="6" height="7" fill={room.plant} />
        </g>
      )}
    </g>
  );
}

function PixelCharacter({
  avatarConfig,
  wealthTier,
  injury,
}) {
  const skin = SKIN_PALETTES[avatarConfig?.skinTone] || SKIN_PALETTES.warm;
  const hair = HAIR_PALETTES[avatarConfig?.hairColor] || HAIR_PALETTES.espresso;
  const palette = OUTFIT_PALETTES[avatarConfig?.outfitColor] || OUTFIT_PALETTES.royal;
  const gender = avatarConfig?.gender || 'neutral';
  const hairStyle = avatarConfig?.hairStyle || 'short';
  const outline = '#1E293B';

  // Outfit Palette based on wealth & chosen theme color
  const outfit =
    wealthTier === 'prosperous'
      ? {
          shirt: palette.suit,
          shirtShade: palette.suitShade,
          collar: '#FFFFFF',
          accent: palette.tie,
          pants: '#0F172A',
        }
      : wealthTier === 'struggling'
        ? {
            shirt: '#64748B',
            shirtShade: '#475569',
            collar: '#94A3B8',
            accent: '#D4B483', // cloth patch
            pants: '#334155',
          }
        : {
            shirt: palette.shirt,
            shirtShade: palette.shirtShade,
            collar: palette.collar,
            accent: palette.tie,
            pants: palette.pants,
          };

  const torsoW = gender === 'feminine' ? 20 : gender === 'masculine' ? 24 : 22;
  const torsoX = 110 - torsoW / 2;

  return (
    <g className={`px-char-group state-${wealthTier} injury-${injury}`}>
      {/* Ground Contact Shadow */}
      <ellipse cx="110" cy="95" rx="16" ry="4" fill="#0F172A" opacity="0.22" />

      {/* Back Hair Layer (Bob / Ponytail / Curly) */}
      {hairStyle === 'bob' && (
        <rect x="94" y="32" width="32" height="24" rx="2" fill={hair.base} />
      )}
      {hairStyle === 'ponytail' && (
        <g>
          <rect x="123" y="30" width="8" height="20" fill={hair.base} />
          <rect x="121" y="32" width="4" height="4" fill="#14B8A6" />
        </g>
      )}
      {hairStyle === 'curly' && (
        <g fill={hair.base}>
          <rect x="91" y="25" width="38" height="24" rx="3" />
          <rect x="89" y="32" width="6" height="12" />
          <rect x="125" y="32" width="6" height="12" />
        </g>
      )}

      {/* Shoes & Legs */}
      <rect x="100" y="74" width="8" height="16" fill={outfit.pants} />
      <rect x="112" y="74" width="8" height="16" fill={outfit.pants} />
      {/* Torn pants patch when struggling */}
      {wealthTier === 'struggling' && (
        <rect x="113" y="80" width="6" height="5" fill="#D4B483" />
      )}

      {/* Leg Plaster Cast overlay if injured */}
      {injury === 'leg_cast' && (
        <g>
          <rect x="111" y="75" width="10" height="17" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="111" y="82" width="10" height="2" fill="#38BDF8" />
          {/* Crutch propped left side */}
          <rect x="90" y="54" width="3" height="40" fill="#92400E" />
          <rect x="87" y="53" width="9" height="3" fill="#B45309" />
          <rect x="88" y="68" width="6" height="3" fill="#78350F" />
        </g>
      )}

      {/* Shoes */}
      <rect x="99" y="89" width="9" height="4" fill={outline} />
      {injury !== 'leg_cast' && <rect x="112" y="89" width="9" height="4" fill={outline} />}

      {/* Torso / Outfit */}
      <rect
        x={torsoX}
        y="52"
        width={torsoW}
        height="24"
        fill={outfit.shirt}
        stroke={outline}
        strokeWidth="1.5"
      />
      <rect x={torsoX + torsoW - 4} y="53" width="3" height="22" fill={outfit.shirtShade} />

      {/* Outfit Details: Prosperous Suit Tie / Steady Polo / Struggling Torn Patches */}
      {wealthTier === 'prosperous' && (
        <g>
          <rect x="106" y="53" width="8" height="12" fill={outfit.collar} />
          <rect x="108" y="54" width="4" height="15" fill={outfit.accent} />
          <rect x="103" y="59" width="3" height="3" fill="#FBBF24" />
        </g>
      )}
      {wealthTier === 'steady' && (
        <g>
          <rect x="106" y="53" width="8" height="5" fill={outfit.collar} />
          <rect x="109" y="57" width="2" height="5" fill={outfit.accent} />
        </g>
      )}
      {wealthTier === 'struggling' && (
        <g>
          {/* Torn Cloth Patch on Shirt + Skin Tear peeking through */}
          <rect x={torsoX + 3} y="58" width="7" height="7" fill={outfit.accent} />
          <rect x={torsoX + 5} y="57" width="1" height="9" fill={outline} />
          <rect x={torsoX + 13} y="65" width="5" height="5" fill={skin.shade} />
        </g>
      )}

      {/* Arms */}
      {/* Left Arm */}
      <rect x={torsoX - 5} y="53" width="5" height="15" fill={outfit.shirt} stroke={outline} strokeWidth="1.2" />
      <rect x={torsoX - 5} y="67" width="5" height="5" fill={skin.base} />
      {/* Right Arm OR Arm Cast + Sling */}
      {injury === 'arm_cast' ? (
        <g>
          {/* Sling Strap across torso */}
          <path d="M98 53 L116 66" stroke="#38BDF8" strokeWidth="3.5" />
          {/* Bulky White Cast */}
          <rect x={torsoX + torsoW - 2} y="57" width="9" height="11" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x={torsoX + torsoW - 8} y="61" width="10" height="7" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
        </g>
      ) : (
        <g>
          <rect x={torsoX + torsoW} y="53" width="5" height="15" fill={outfit.shirt} stroke={outline} strokeWidth="1.2" />
          <rect x={torsoX + torsoW} y="67" width="5" height="5" fill={skin.base} />
        </g>
      )}

      {/* Neck & Pixel Head */}
      <rect x="106" y="47" width="8" height="6" fill={skin.shade} />
      <rect
        x="96"
        y="24"
        width="28"
        height="25"
        rx="3"
        fill={skin.base}
        stroke={outline}
        strokeWidth="1.5"
      />
      {/* Subtle Cheek Shade */}
      <rect x="97" y="45" width="26" height="3" fill={skin.shade} opacity="0.6" />

      {/* Facial Expression */}
      {injury === 'medical_mask' ? (
        <g>
          {/* Tired / Feverish Eyes + Medical Mask */}
          <rect x="102" y="35" width="3" height="3" fill={outline} />
          <rect x="115" y="35" width="3" height="3" fill={outline} />
          <rect x="100" y="38" width="4" height="2" fill={skin.blush} opacity="0.85" />
          <rect x="116" y="38" width="4" height="2" fill={skin.blush} opacity="0.85" />
          <rect x="101" y="39" width="18" height="9" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.2" />
          <rect x="97" y="41" width="4" height="2" fill="#BAE6FD" />
          <rect x="119" y="41" width="4" height="2" fill="#BAE6FD" />
        </g>
      ) : injury === 'windfall' ? (
        <g>
          {/* Happy Sparkling Eyes */}
          <path d="M101 37 Q104 34 106 37" fill="none" stroke={outline} strokeWidth="2" />
          <path d="M114 37 Q117 34 119 37" fill="none" stroke={outline} strokeWidth="2" />
          <rect x="100" y="39" width="4" height="2" fill={skin.blush} />
          <rect x="116" y="39" width="4" height="2" fill={skin.blush} />
          <rect x="107" y="42" width="6" height="3" fill={outline} />
        </g>
      ) : (
        <g>
          {/* Standard Expressive Eyes */}
          <rect x="102" y="34" width="3" height="4" fill={outline} />
          <rect x="115" y="34" width="3" height="4" fill={outline} />
          {gender === 'feminine' && (
            <>
              <rect x="100" y="34" width="2" height="2" fill={outline} />
              <rect x="118" y="34" width="2" height="2" fill={outline} />
            </>
          )}
          <rect x="100" y="39" width="4" height="2" fill={skin.blush} opacity="0.7" />
          <rect x="116" y="39" width="4" height="2" fill={skin.blush} opacity="0.7" />
          {/* Mouth / Worried Sweat if struggling */}
          {wealthTier === 'struggling' ? (
            <>
              <rect x="107" y="43" width="6" height="2" fill={outline} />
              <rect x="122" y="29" width="3" height="5" fill="#38BDF8" />
            </>
          ) : (
            <rect x="107" y="42" width="6" height="2" fill={outline} />
          )}
        </g>
      )}

      {/* Cheek Band-Aid when injured */}
      {(injury === 'arm_cast' || injury === 'leg_cast') && (
        <g>
          <rect x="114" y="39" width="7" height="4" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
          <rect x="117" y="40" width="1" height="2" fill="#D97706" />
        </g>
      )}

      {/* Front Hair / Bangs Layer */}
      <rect x="95" y="20" width="30" height="8" rx="2" fill={hair.base} />
      <rect x="95" y="24" width="5" height="9" fill={hair.base} />
      <rect x="120" y="24" width="5" height="9" fill={hair.base} />
      <rect x="102" y="21" width="14" height="3" fill={hair.shine} />
      {hairStyle === 'short' && <rect x="100" y="27" width="8" height="3" fill={hair.base} />}
      {hairStyle === 'bob' && <rect x="98" y="27" width="24" height="3" fill={hair.base} />}
      {hairStyle === 'curly' && (
        <g fill={hair.base}>
          <rect x="98" y="18" width="24" height="5" />
          <rect x="102" y="26" width="6" height="4" />
          <rect x="112" y="26" width="6" height="4" />
        </g>
      )}

      {/* Floating Sparkles / Coin when Prosperous or Windfall */}
      {(wealthTier === 'prosperous' || injury === 'windfall') && (
        <g className="px-sparkle-float">
          <rect x="78" y="34" width="5" height="5" fill="#FACC15" />
          <rect x="137" y="30" width="6" height="6" fill="#22D3EE" />
          {injury === 'windfall' && (
            <g>
              <circle cx="141" cy="48" r="6" fill="#FACC15" stroke="#B45309" strokeWidth="1.2" />
              <rect x="140" y="45" width="2" height="6" fill="#B45309" />
            </g>
          )}
        </g>
      )}
    </g>
  );
}

export default function PixelAvatarStage({
  avatarConfig = DEFAULT_AVATAR_CONFIG,
  sceneType = 'office_room',
  wealthTier = 'steady',
  injury = 'none',
  compact = false,
}) {
  const { lang } = useLanguage();

  const statusTags = [];
  if (wealthTier === 'prosperous') {
    statusTags.push({
      id: 'wealth',
      tone: 'teal',
      text: lang === 'TH' ? 'สถานะ: คล่องตัวมั่งคั่ง' : 'Wealthy & Resilient',
    });
  } else if (wealthTier === 'struggling') {
    statusTags.push({
      id: 'wealth',
      tone: 'warn',
      text: lang === 'TH' ? 'สถานะ: เงินตึง / เสื้อขาด' : 'Tight Cash / Struggling',
    });
  } else {
    statusTags.push({
      id: 'wealth',
      tone: 'blue',
      text: lang === 'TH' ? 'สถานะ: ประคองตัวปกติ' : 'Steady Normal',
    });
  }

  if (injury === 'arm_cast') {
    statusTags.push({
      id: 'inj',
      tone: 'red',
      text: lang === 'TH' ? 'ใส่เฝือกแขน' : 'Arm Cast',
    });
  } else if (injury === 'leg_cast') {
    statusTags.push({
      id: 'inj',
      tone: 'red',
      text: lang === 'TH' ? 'ใส่เฝือกขา + ไม้ค้ำ' : 'Leg Cast & Crutch',
    });
  } else if (injury === 'medical_mask') {
    statusTags.push({
      id: 'inj',
      tone: 'amber',
      text: lang === 'TH' ? 'สวมหน้ากากพักฟื้น' : 'Recovery Mask',
    });
  } else if (injury === 'windfall') {
    statusTags.push({
      id: 'inj',
      tone: 'green',
      text: lang === 'TH' ? 'ได้โบนัส / เฮง!' : 'Cash Windfall!',
    });
  }

  const sceneLabelMap = {
    office_room: { th: 'ฉาก: ห้องพัก & โต๊ะทำงาน', en: 'Scene: Room & Desk' },
    hospital: { th: 'ฉาก: โรงพยาบาล / ฉุกเฉิน', en: 'Scene: Hospital Room' },
    rainy_street: { th: 'ฉาก: ถนนฝนตก / กดดัน', en: 'Scene: Rainy Pressure' },
    cafe_mall: { th: 'ฉาก: คาเฟ่ & โซนช้อป', en: 'Scene: Cafe & Shopping' },
    celebration: { th: 'ฉาก: ออฟฟิศรับข่าวดี', en: 'Scene: Sunny Victory' },
  };

  return (
    <div className={`px-stage-wrap ${compact ? 'is-compact' : ''}`}>
      <div className="px-canvas-frame">
        <svg
          className="px-stage-svg"
          viewBox="0 0 220 112"
          shapeRendering="crispEdges"
          role="img"
          aria-label={lang === 'TH' ? 'ตัวละคร Pixel ของคุณและฉากเหตุการณ์' : 'Your pixel character & dynamic event scene'}
        >
          <PixelBackdrop
            sceneType={sceneType}
            wealthTier={wealthTier}
            roomTheme={avatarConfig?.roomTheme}
          />
          <PixelCharacter
            avatarConfig={avatarConfig}
            wealthTier={wealthTier}
            injury={injury}
          />
        </svg>
      </div>

      <div className="px-stage-badges">
        <span className="px-stage-chip scene">
          {lang === 'TH'
            ? sceneLabelMap[sceneType]?.th || sceneLabelMap.office_room.th
            : sceneLabelMap[sceneType]?.en || sceneLabelMap.office_room.en}
        </span>
        {statusTags.map((tag) => (
          <span key={tag.id} className={`px-stage-chip ${tag.tone}`}>
            {tag.text}
          </span>
        ))}
      </div>
    </div>
  );
}
