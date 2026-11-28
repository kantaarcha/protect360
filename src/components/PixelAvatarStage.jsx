import { useLanguage } from '../context/LanguageContext';
import {
  DEFAULT_AVATAR_CONFIG,
  HAIR_PALETTES,
  OUTFIT_PALETTES,
  ROOM_THEMES,
  SKIN_PALETTES,
  sanitizeAccessories,
} from '../utils/pixelAvatar';

function CustomRoomShell({ room, roomTheme, isDim, showDesk = true }) {
  const isDarkRoom = isDim || room.lamp;
  return (
    <g>
      <rect x="0" y="0" width="220" height="82" fill={isDim ? '#1E293B' : room.wall} />
      <rect x="0" y="82" width="220" height="30" fill={isDim ? '#334155' : room.floor} />
      <rect x="0" y="80" width="220" height="3" fill={isDim ? '#475569' : room.trim} />

      {/* Room Window */}
      <rect
        x="20"
        y="14"
        width="54"
        height="42"
        fill={isDim ? '#0F172A' : room.windowBg}
        stroke={isDarkRoom ? '#475569' : '#1E3A5F'}
        strokeWidth="3"
      />
      <rect x="46" y="14" width="2" height="42" fill={isDarkRoom ? '#475569' : '#1E3A5F'} />
      <rect x="20" y="34" width="54" height="2" fill={isDarkRoom ? '#475569' : '#1E3A5F'} />
      {isDarkRoom && roomTheme !== 'space_observatory' && (
        <rect x="60" y="20" width="6" height="6" fill="#FDE68A" />
      )}

      {/* Festive & Youth Lifestyle Theme Props */}
      {roomTheme === 'gaming_rgb' && (
        <g>
          <rect x="14" y="6" width="66" height="4" rx="2" fill="#EC4899" />
          <rect x="138" y="6" width="66" height="4" rx="2" fill="#22D3EE" />
          <rect x="148" y="30" width="12" height="18" fill="#0F172A" stroke="#22D3EE" strokeWidth="1" />
          <rect x="151" y="33" width="6" height="3" fill="#A855F7" />
        </g>
      )}

      {roomTheme === 'sakura_spring' && (
        <g>
          <rect x="26" y="20" width="14" height="8" rx="2" fill="#F472B6" />
          <rect x="52" y="24" width="14" height="8" rx="2" fill="#F9A8D4" />
          <g className="px-sparkle-float" fill="#EC4899">
            <rect x="30" y="42" width="4" height="4" />
            <rect x="84" y="18" width="4" height="4" />
            <rect x="138" y="24" width="4" height="4" />
          </g>
        </g>
      )}

      {roomTheme === 'cozy_cafe' && (
        <g>
          <rect x="86" y="14" width="44" height="4" fill="#92400E" />
          <rect x="92" y="6" width="8" height="8" fill="#15803D" />
          <rect x="108" y="8" width="6" height="6" fill="#F59E0B" />
          <rect x="118" y="6" width="8" height="8" fill="#DC2626" />
          <rect x="148" y="42" width="12" height="8" fill="#334155" />
          <rect x="151" y="38" width="6" height="4" fill="#FFFFFF" />
        </g>
      )}

      {roomTheme === 'beach_summer' && (
        <g>
          <rect x="22" y="40" width="50" height="14" fill="#0EA5E9" />
          <circle cx="32" cy="24" r="5" fill="#FDE047" />
          <rect x="138" y="24" width="9" height="56" rx="4" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
          <rect x="141" y="28" width="3" height="48" fill="#FDE047" />
        </g>
      )}

      {roomTheme === 'space_observatory' && (
        <g>
          <circle cx="36" cy="28" r="7" fill="#F59E0B" />
          <ellipse cx="36" cy="28" rx="13" ry="3" fill="none" stroke="#FDE68A" strokeWidth="1.5" />
          <rect x="58" y="22" width="2" height="2" fill="#FFFFFF" />
          <rect x="26" y="44" width="2" height="2" fill="#38BDF8" />
          <rect x="64" y="42" width="2" height="2" fill="#FFFFFF" />
          <rect x="136" y="44" width="12" height="5" fill="#CBD5E1" transform="rotate(-18 142 46)" />
          <rect x="140" y="49" width="2" height="31" fill="#64748B" />
        </g>
      )}

      {roomTheme === 'christmas' && (
        <g>
          <rect x="26" y="20" width="3" height="3" fill="#FFFFFF" />
          <rect x="54" y="26" width="3" height="3" fill="#FFFFFF" />
          <rect x="34" y="42" width="3" height="3" fill="#FFFFFF" />
          <polygon points="152,20 138,44 166,44" fill="#15803D" />
          <polygon points="152,32 135,62 169,62" fill="#166534" />
          <rect x="148" y="62" width="8" height="18" fill="#78350F" />
          <rect x="150" y="15" width="4" height="5" fill="#FACC15" />
          <rect x="145" y="40" width="4" height="4" fill="#EF4444" />
          <rect x="155" y="48" width="4" height="4" fill="#38BDF8" />
          <rect x="142" y="54" width="4" height="4" fill="#FACC15" />
        </g>
      )}

      {roomTheme === 'halloween' && (
        <g>
          <rect x="28" y="22" width="12" height="4" fill="#0F172A" />
          <rect x="32" y="20" width="4" height="6" fill="#0F172A" />
          <rect x="144" y="36" width="16" height="14" rx="4" fill="#F97316" />
          <rect x="150" y="32" width="4" height="4" fill="#15803D" />
          <rect x="147" y="40" width="3" height="3" fill="#FEF08A" />
          <rect x="154" y="40" width="3" height="3" fill="#FEF08A" />
          <rect x="147" y="46" width="10" height="2" fill="#FEF08A" />
        </g>
      )}

      {roomTheme === 'songkran' && (
        <g>
          <rect x="0" y="0" width="220" height="4" fill="#0EA5E9" />
          {[14, 42, 70, 98, 126, 154, 182].map((bx, i) => (
            <rect key={bx} x={bx} y="4" width="14" height="7" fill={['#F43F5E', '#FACC15', '#22C55E', '#06B6D4'][i % 4]} />
          ))}
          <rect x="34" y="68" width="18" height="10" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
          <rect x="38" y="65" width="4" height="3" fill="#FFFFFF" />
          <rect x="44" y="65" width="4" height="3" fill="#F472B6" />
          <circle cx="32" cy="24" r="6" fill="#FDE047" />
        </g>
      )}

      {roomTheme === 'valentine' && (
        <g>
          <g className="px-sparkle-float" fill="#EC4899">
            <rect x="30" y="24" width="8" height="6" />
            <rect x="32" y="30" width="4" height="3" />
            <rect x="134" y="18" width="8" height="6" />
            <rect x="136" y="24" width="4" height="3" />
          </g>
          <rect x="147" y="42" width="12" height="8" fill="#BE185D" />
          <rect x="150" y="35" width="6" height="6" fill="#F43F5E" />
        </g>
      )}

      {roomTheme === 'chinese_new_year' && (
        <g>
          <rect x="14" y="0" width="2" height="10" fill="#F59E0B" />
          <rect x="8" y="10" width="14" height="16" rx="4" fill="#DC2626" stroke="#FACC15" strokeWidth="1" />
          <rect x="13" y="26" width="4" height="6" fill="#FACC15" />
          <rect x="200" y="0" width="2" height="10" fill="#F59E0B" />
          <rect x="194" y="10" width="14" height="16" rx="4" fill="#DC2626" stroke="#FACC15" strokeWidth="1" />
          <rect x="199" y="26" width="4" height="6" fill="#FACC15" />
          <rect x="148" y="44" width="14" height="6" fill="#FACC15" stroke="#B45309" strokeWidth="1" />
        </g>
      )}

      {showDesk && (
        <g>
          {/* Desk & PROTECT360 Monitor Right */}
          <rect x="148" y="54" width="60" height="28" fill={isDim ? '#475569' : room.desk} />
          <rect x="144" y="50" width="68" height="5" fill={isDim ? '#334155' : room.deskTop} />
          <rect x="164" y="26" width="34" height="22" fill="#142B4A" />
          <rect x="167" y="29" width="28" height="16" fill="#0F2038" />
          <rect x="171" y="38" width="4" height="5" fill="#22B8A7" />
          <rect x="177" y="35" width="4" height="8" fill="#3B82F6" />
          <rect x="183" y="31" width="4" height="12" fill="#10B981" />

          {roomTheme === 'midnight' || roomTheme === 'halloween' ? (
            <g>
              <rect x="152" y="42" width="4" height="8" fill="#94A3B8" />
              <rect x="148" y="34" width="12" height="8" fill={roomTheme === 'halloween' ? '#FB923C' : '#FDE047'} />
            </g>
          ) : roomTheme === 'sky' || roomTheme === 'sakura_spring' || roomTheme === 'songkran' ? (
            <g>
              <rect x="150" y="42" width="10" height="8" fill="#D97706" />
              <rect x="152" y="35" width="6" height="7" fill={room.plant} />
            </g>
          ) : null}
        </g>
      )}
    </g>
  );
}

function PixelBackdrop({ sceneType, wealthTier, roomTheme = 'sky' }) {
  const isDim = wealthTier === 'struggling' && sceneType === 'office_room';
  const room = ROOM_THEMES[roomTheme] || ROOM_THEMES.sky;

  if (sceneType === 'hospital') {
    return (
      <g>
        <rect x="0" y="0" width="220" height="82" fill="#E6F4F1" />
        <rect x="0" y="78" width="220" height="4" fill="#B5DCD6" />
        <rect x="0" y="82" width="220" height="30" fill="#D5EBE8" />
        <rect x="0" y="42" width="220" height="2" fill="#CFEAE5" />
        <rect x="20" y="14" width="24" height="24" rx="2" fill="#FFFFFF" stroke="#94C5BF" strokeWidth="1" />
        <rect x="30" y="18" width="4" height="16" fill="#E05252" />
        <rect x="24" y="24" width="16" height="4" fill="#E05252" />
        <rect x="148" y="16" width="54" height="32" fill="#142B4A" />
        <rect x="152" y="20" width="46" height="22" fill="#0F2038" />
        <path d="M154 32 H164 L168 24 L173 38 L178 29 H196" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
        <rect x="64" y="22" width="3" height="60" fill="#64748B" />
        <rect x="58" y="80" width="15" height="3" fill="#475569" />
        <rect x="61" y="22" width="14" height="3" fill="#64748B" />
        <rect x="71" y="26" width="8" height="14" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
        <rect x="72" y="33" width="6" height="6" fill="#38BDF8" />
        <rect x="142" y="64" width="66" height="18" fill="#FFFFFF" />
        <rect x="142" y="74" width="66" height="8" fill="#1D4ED8" />
        <rect x="140" y="56" width="4" height="28" fill="#475569" />
        <rect x="206" y="60" width="4" height="24" fill="#475569" />
        <rect x="146" y="59" width="16" height="6" fill="#DBEAFE" />
      </g>
    );
  }

  if (sceneType === 'dental_clinic') {
    return (
      <g>
        {/* Clean Bright Dental Studio */}
        <rect x="0" y="0" width="220" height="82" fill="#ECFEFF" />
        <rect x="0" y="82" width="220" height="30" fill="#CFFAFE" />
        <rect x="0" y="80" width="220" height="3" fill="#67E8F9" />
        {/* Happy Tooth Wall Poster Left */}
        <rect x="20" y="16" width="28" height="34" rx="2" fill="#FFFFFF" stroke="#0891B2" strokeWidth="1.5" />
        <rect x="27" y="23" width="14" height="14" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
        <rect x="28" y="34" width="5" height="6" fill="#E0F2FE" />
        <rect x="35" y="34" width="5" height="6" fill="#E0F2FE" />
        <rect x="31" y="28" width="2" height="2" fill="#0F172A" />
        <rect x="36" y="28" width="2" height="2" fill="#0F172A" />
        {/* Dental Chair + Overhead Exam Spotlight Right */}
        <rect x="170" y="6" width="4" height="18" fill="#64748B" />
        <rect x="160" y="24" width="22" height="7" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.2" />
        <polygon points="163,31 179,31 186,58 156,58" fill="#FEF08A" opacity="0.28" />
        <rect x="144" y="58" width="54" height="16" rx="4" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.2" />
        <rect x="184" y="42" width="14" height="22" rx="3" fill="#0EA5E9" stroke="#0369A1" strokeWidth="1.2" />
        <rect x="164" y="74" width="14" height="8" fill="#475569" />
      </g>
    );
  }

  if (sceneType === 'office_meeting') {
    return (
      <g>
        {/* Work Desk / Finance & Paycheck Review Scene */}
        <rect x="0" y="0" width="220" height="82" fill="#F1F5F9" />
        <rect x="0" y="82" width="220" height="30" fill="#E2E8F0" />
        <rect x="0" y="80" width="220" height="3" fill="#CBD5E1" />
        {/* Whiteboard with Trend Chart & Urgent Memo */}
        <rect x="16" y="14" width="60" height="38" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
        <path d="M22 42 L34 32 L46 36 L68 22" fill="none" stroke="#EF4444" strokeWidth="2.5" />
        <rect x="52" y="20" width="10" height="6" fill="#FDE047" />
        {/* Clock & Meeting Desk Right */}
        <circle cx="184" cy="22" r="9" fill="#FFFFFF" stroke="#334155" strokeWidth="1.8" />
        <rect x="183" y="16" width="2" height="6" fill="#0F172A" />
        <rect x="184" y="21" width="5" height="2" fill="#EF4444" />
        <rect x="146" y="56" width="62" height="26" fill="#475569" />
        <rect x="142" y="52" width="70" height="5" fill="#334155" />
        {/* Papers & Hot Coffee */}
        <rect x="150" y="46" width="16" height="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        <rect x="154" y="44" width="14" height="5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
        <rect x="184" y="42" width="10" height="10" rx="1" fill="#2563EB" />
        <rect x="186" y="38" width="2" height="3" fill="#94A3B8" />
        <rect x="190" y="37" width="2" height="4" fill="#94A3B8" />
      </g>
    );
  }

  if (sceneType === 'pet_care') {
    return (
      <g>
        {/* User's Personalized Room + Pet Care Corner */}
        <CustomRoomShell room={room} roomTheme={roomTheme} isDim={false} showDesk={true} />
        {/* Warm Pet Carpet on Right Floor */}
        <ellipse cx="176" cy="90" rx="30" ry="7" fill="#FDBA74" opacity="0.65" />
        {/* Grooming / Vet Tote Bag on Left Floor */}
        <rect x="54" y="72" width="18" height="12" rx="2" fill="#0EA5E9" stroke="#0369A1" strokeWidth="1" />
        <rect x="59" y="68" width="8" height="4" fill="none" stroke="#0369A1" strokeWidth="1.5" />
        <rect x="61" y="75" width="4" height="6" fill="#FFFFFF" />
        <rect x="60" y="76" width="6" height="4" fill="#FFFFFF" />
        {/* Cute Pixel Shiba Inu on Right Foreground */}
        <g>
          <rect x="152" y="71" width="24" height="16" rx="3" fill="#F59E0B" />
          <rect x="155" y="77" width="18" height="10" fill="#FEF3C7" />
          <rect x="168" y="61" width="15" height="14" rx="2" fill="#F59E0B" />
          <rect x="170" y="68" width="11" height="7" fill="#FEF3C7" />
          <polygon points="168,61 171,55 174,61" fill="#D97706" />
          <polygon points="177,61 180,55 183,61" fill="#D97706" />
          <rect x="172" y="64" width="2" height="2" fill="#0F172A" />
          <rect x="178" y="64" width="2" height="2" fill="#0F172A" />
          <rect x="175" y="68" width="3" height="2" fill="#0F172A" />
          <rect x="147" y="69" width="6" height="4" fill="#D97706" />
          <rect x="154" y="86" width="4" height="6" fill="#F59E0B" />
          <rect x="169" y="86" width="4" height="6" fill="#F59E0B" />
          {/* Food Bowl & Heart */}
          <rect x="186" y="84" width="14" height="6" rx="2" fill="#EF4444" />
          <rect x="188" y="82" width="10" height="2" fill="#92400E" />
          <g className="px-sparkle-float" fill="#F43F5E">
            <rect x="172" y="49" width="6" height="5" />
            <rect x="174" y="54" width="2" height="2" />
          </g>
        </g>
      </g>
    );
  }

  if (sceneType === 'gaming_room') {
    return (
      <g>
        {/* User's Personalized Room + Console Gaming Setup */}
        <CustomRoomShell room={room} roomTheme={roomTheme} isDim={false} showDesk={true} />
        {/* RGB Wall Shelf Accent Center-Upper */}
        <rect x="86" y="21" width="46" height="4" rx="2" fill="#A855F7" />
        <rect x="86" y="21" width="22" height="4" rx="2" fill="#22D3EE" />
        {/* Upgraded Console Monitor + Game Screen */}
        <rect x="162" y="23" width="38" height="25" fill="#0F172A" stroke="#A855F7" strokeWidth="2" />
        <rect x="166" y="27" width="30" height="17" fill="#1E1B4B" />
        <rect x="170" y="31" width="8" height="8" fill="#22D3EE" />
        <rect x="182" y="33" width="10" height="5" fill="#F43F5E" />
        {/* Console & Pixel Controller on Desk */}
        <rect x="174" y="48" width="18" height="4" rx="1" fill="#E2E8F0" />
        <rect x="177" y="49" width="3" height="2" fill="#2563EB" />
        <rect x="186" y="49" width="3" height="2" fill="#EF4444" />
        {/* Cozy Floor Beanbag Cushion Left of Avatar */}
        <ellipse cx="64" cy="83" rx="14" ry="7" fill="#7C3AED" />
        <ellipse cx="64" cy="80" rx="11" ry="4" fill="#A78BFA" />
      </g>
    );
  }

  if (sceneType === 'beach_travel') {
    return (
      <g>
        {/* Sunny Beach / Travel Vacation Scene */}
        <rect x="0" y="0" width="220" height="54" fill="#BAE6FD" />
        <rect x="0" y="54" width="220" height="24" fill="#0EA5E9" />
        <rect x="0" y="78" width="220" height="34" fill="#FDE68A" />
        <circle cx="34" cy="22" r="10" fill="#FACC15" />
        {/* Sea Waves */}
        <rect x="18" y="60" width="24" height="3" fill="#E0F2FE" />
        <rect x="152" y="64" width="30" height="3" fill="#E0F2FE" />
        {/* Beach Umbrella & Palm Tree */}
        <rect x="172" y="42" width="4" height="44" fill="#78350F" />
        <polygon points="150,42 174,26 198,42" fill="#F43F5E" />
        <polygon points="162,42 174,26 186,42" fill="#FFFFFF" />
        {/* Suitcase Left */}
        <rect x="26" y="64" width="20" height="22" rx="2" fill="#2563EB" stroke="#1E3A8A" strokeWidth="1.2" />
        <rect x="32" y="58" width="8" height="6" fill="none" stroke="#1E3A8A" strokeWidth="2" />
        <rect x="30" y="68" width="12" height="3" fill="#FACC15" />
      </g>
    );
  }

  if (sceneType === 'gym_sport') {
    return (
      <g>
        {/* Fitness & Workout Gym Studio */}
        <rect x="0" y="0" width="220" height="82" fill="#EFF6FF" />
        <rect x="0" y="82" width="220" height="30" fill="#334155" />
        <rect x="0" y="80" width="220" height="3" fill="#3B82F6" />
        {/* Mirror & Motivational Frame */}
        <rect x="20" y="14" width="48" height="44" fill="#DBEAFE" stroke="#64748B" strokeWidth="2" />
        <path d="M26 24 L36 18 M28 38 L44 26" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
        {/* Barbell Rack Right */}
        <rect x="148" y="48" width="52" height="4" fill="#475569" />
        <rect x="152" y="38" width="8" height="24" rx="2" fill="#0F172A" />
        <rect x="188" y="38" width="8" height="24" rx="2" fill="#0F172A" />
        <rect x="158" y="62" width="4" height="20" fill="#64748B" />
        <rect x="186" y="62" width="4" height="20" fill="#64748B" />
        {/* Gym Water Bottle */}
        <rect x="36" y="66" width="10" height="16" rx="2" fill="#06B6D4" />
        <rect x="38" y="62" width="6" height="4" fill="#0F172A" />
      </g>
    );
  }

  if (sceneType === 'restaurant_feast') {
    return (
      <g>
        {/* Warm Bistro / Grill Buffet & Friends Feast */}
        <rect x="0" y="0" width="220" height="82" fill="#431407" />
        <rect x="0" y="82" width="220" height="30" fill="#7C2D12" />
        <rect x="0" y="80" width="220" height="3" fill="#F59E0B" />
        {/* Warm Pendant Bulbs */}
        <rect x="38" y="0" width="2" height="16" fill="#F59E0B" />
        <circle cx="39" cy="18" r="5" fill="#FDE047" />
        <rect x="178" y="0" width="2" height="16" fill="#F59E0B" />
        <circle cx="179" cy="18" r="5" fill="#FDE047" />
        {/* Grill / Feast Table Right */}
        <rect x="144" y="54" width="64" height="28" fill="#9A3412" />
        <rect x="140" y="50" width="72" height="5" fill="#C2410C" />
        <rect x="154" y="44" width="22" height="6" fill="#1E293B" />
        <rect x="158" y="42" width="6" height="4" fill="#EF4444" />
        <rect x="166" y="42" width="6" height="4" fill="#F59E0B" />
        <rect x="186" y="42" width="10" height="8" fill="#FFFFFF" />
        <rect x="188" y="38" width="6" height="4" fill="#FDE047" />
      </g>
    );
  }

  if (sceneType === 'party') {
    return (
      <g>
        <rect x="0" y="0" width="220" height="82" fill="#1E1B4B" />
        <rect x="0" y="82" width="220" height="30" fill="#312E81" />
        <rect x="0" y="80" width="220" height="3" fill="#4338CA" />
        <polygon points="110,16 40,82 86,82" fill="#38BDF8" opacity="0.16" />
        <polygon points="110,16 134,82 184,82" fill="#F472B6" opacity="0.16" />
        <rect x="109" y="0" width="2" height="10" fill="#CBD5E1" />
        <circle cx="110" cy="14" r="7" fill="#E2E8F0" />
        <rect x="107" y="11" width="3" height="3" fill="#94A3B8" />
        <rect x="111" y="14" width="3" height="3" fill="#38BDF8" />
        <rect x="14" y="42" width="24" height="40" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
        <circle cx="26" cy="54" r="6" fill="#334155" />
        <circle cx="26" cy="70" r="7" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
        <rect x="182" y="42" width="24" height="40" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
        <circle cx="194" cy="54" r="6" fill="#334155" />
        <circle cx="194" cy="70" r="7" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
        <g className="px-sparkle-float">
          <rect x="46" y="12" width="6" height="6" fill="#F472B6" />
          <rect x="68" y="16" width="6" height="6" fill="#FACC15" />
          <rect x="146" y="16" width="6" height="6" fill="#22D3EE" />
          <rect x="168" y="12" width="6" height="6" fill="#34D399" />
        </g>
      </g>
    );
  }

  if (sceneType === 'road_car') {
    return (
      <g>
        <rect x="0" y="0" width="220" height="72" fill="#E0F2FE" />
        <rect x="0" y="72" width="220" height="40" fill="#334155" />
        <rect x="0" y="70" width="220" height="4" fill="#94A3B8" />
        <rect x="14" y="92" width="28" height="4" fill="#FDE047" />
        <rect x="64" y="92" width="28" height="4" fill="#FDE047" />
        <rect x="128" y="92" width="28" height="4" fill="#FDE047" />
        <rect x="178" y="92" width="28" height="4" fill="#FDE047" />
        <rect x="12" y="28" width="32" height="42" fill="#BFDBFE" />
        <rect x="174" y="20" width="36" height="50" fill="#93C5FD" />
        <rect x="136" y="54" width="58" height="22" rx="3" fill="#2563EB" />
        <rect x="146" y="42" width="36" height="14" rx="2" fill="#3B82F6" />
        <rect x="150" y="45" width="12" height="8" fill="#BAE6FD" />
        <rect x="166" y="45" width="12" height="8" fill="#BAE6FD" />
        <circle cx="149" cy="76" r="7" fill="#0F172A" />
        <circle cx="149" cy="76" r="3" fill="#CBD5E1" />
        <circle cx="182" cy="76" r="7" fill="#0F172A" />
        <circle cx="182" cy="76" r="3" fill="#CBD5E1" />
        <polygon points="32,78 44,78 40,62 36,62" fill="#F97316" />
        <rect x="35" y="70" width="6" height="3" fill="#FFFFFF" />
        <rect x="30" y="78" width="16" height="3" fill="#EA580C" />
      </g>
    );
  }

  if (sceneType === 'home_repair') {
    return (
      <g>
        {/* User's Personalized Room + Home Maintenance / Utility Emergency Props */}
        <CustomRoomShell room={room} roomTheme={roomTheme} isDim={false} showDesk={true} />
        {/* Leaking Wall Air Conditioner on Center Wall */}
        <rect x="84" y="22" width="50" height="15" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
        <rect x="88" y="31" width="42" height="3" fill="#334155" />
        <rect x="94" y="39" width="3" height="6" fill="#38BDF8" />
        <rect x="108" y="42" width="3" height="6" fill="#38BDF8" />
        <rect x="120" y="38" width="3" height="6" fill="#38BDF8" />
        {/* Red Emergency Toolbox Left Floor */}
        <rect x="12" y="66" width="22" height="16" fill="#DC2626" />
        <rect x="12" y="64" width="22" height="4" fill="#991B1B" />
        <rect x="19" y="60" width="8" height="4" fill="#475569" />
        <rect x="21" y="70" width="4" height="5" fill="#FACC15" />
        {/* Water Puddle on Floor Near Desk */}
        <ellipse cx="164" cy="90" rx="20" ry="5" fill="#38BDF8" opacity="0.55" />
        <ellipse cx="160" cy="89" rx="11" ry="2.5" fill="#BAE6FD" opacity="0.8" />
      </g>
    );
  }

  if (sceneType === 'cyber_desk') {
    return (
      <g>
        {/* User's Personalized Room + Tech / Monitor Glitch Alert */}
        <CustomRoomShell room={room} roomTheme={roomTheme} isDim={false} showDesk={true} />
        {/* Cracked / Error Warning Overlay on Desk Monitor */}
        <rect x="167" y="29" width="28" height="16" fill="#1E1B4B" />
        <rect x="170" y="32" width="16" height="3" fill="#F43F5E" />
        <rect x="170" y="37" width="22" height="3" fill="#22D3EE" />
        <path d="M174 29 L180 37 L177 45" fill="none" stroke="#FDE047" strokeWidth="1.5" />
        {/* Router & Blinking Signal on Desk */}
        <rect x="184" y="47" width="16" height="4" rx="1" fill="#334155" />
        <rect x="186" y="42" width="2" height="5" fill="#475569" />
        <rect x="196" y="42" width="2" height="5" fill="#475569" />
        <rect x="189" y="48" width="3" height="2" fill="#EF4444" />
        {/* Tangled Power Cable on Floor */}
        <path d="M156 84 Q166 92 178 86" fill="none" stroke="#475569" strokeWidth="2.2" />
      </g>
    );
  }

  if (sceneType === 'rainy_street') {
    return (
      <g>
        <rect x="0" y="0" width="220" height="82" fill="#0F223D" />
        <rect x="0" y="82" width="220" height="30" fill="#1E293B" />
        <rect x="0" y="82" width="220" height="3" fill="#334155" />
        <rect x="12" y="32" width="26" height="50" fill="#162E50" />
        <rect x="44" y="22" width="32" height="60" fill="#1B365D" />
        <rect x="142" y="26" width="34" height="56" fill="#162E50" />
        <rect x="182" y="38" width="28" height="44" fill="#1B365D" />
        <rect x="20" y="42" width="5" height="6" fill="#FDE68A" opacity="0.55" />
        <rect x="52" y="34" width="6" height="6" fill="#93C5FD" opacity="0.45" />
        <rect x="150" y="38" width="6" height="6" fill="#FDE68A" opacity="0.5" />
        <rect x="188" y="18" width="4" height="66" fill="#475569" />
        <rect x="176" y="18" width="16" height="4" fill="#64748B" />
        <rect x="174" y="22" width="8" height="5" fill="#FBBF24" />
        <ellipse cx="178" cy="96" rx="22" ry="4" fill="#FBBF24" opacity="0.16" />
        <ellipse cx="110" cy="100" rx="28" ry="4" fill="#38BDF8" opacity="0.14" />
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
        <rect x="0" y="0" width="220" height="82" fill="#FFF7ED" />
        <rect x="0" y="82" width="220" height="30" fill="#F3E4D2" />
        <rect x="0" y="80" width="220" height="3" fill="#D6C2AA" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <rect key={i} x={i * 20} y="0" width="20" height="14" fill={i % 2 === 0 ? '#2878C8' : '#FFFFFF'} />
        ))}
        <rect x="16" y="22" width="44" height="22" rx="2" fill="#142B4A" />
        <rect x="19" y="25" width="38" height="16" fill="#E05252" />
        <rect x="24" y="31" width="28" height="4" fill="#FFFFFF" />
        <rect x="146" y="50" width="62" height="32" fill="#8B5A2B" />
        <rect x="142" y="46" width="70" height="6" fill="#5C3A1B" />
        <rect x="160" y="28" width="20" height="18" fill="#334155" />
        <rect x="164" y="32" width="12" height="8" fill="#38BDF8" />
        <rect x="188" y="38" width="10" height="8" fill="#FFFFFF" />
      </g>
    );
  }

  if (sceneType === 'celebration') {
    return (
      <g>
        {/* User's Personalized Room in Bright Victory & Windfall Celebration Mode */}
        <CustomRoomShell room={room} roomTheme={roomTheme} isDim={false} showDesk={true} />
        {/* Golden Trophy on Right Corner of Desk (clear of theme props) */}
        <rect x="200" y="47" width="8" height="3" fill="#B45309" />
        <rect x="203" y="44" width="2" height="3" fill="#F59E0B" />
        <rect x="200" y="38" width="8" height="6" rx="1" fill="#FACC15" />
        {/* Celebratory Confetti Sparkles */}
        <g className="px-sparkle-float">
          <rect x="86" y="20" width="4" height="4" fill="#F59E0B" />
          <rect x="102" y="14" width="4" height="4" fill="#10B981" />
          <rect x="120" y="22" width="4" height="4" fill="#2563EB" />
          <rect x="132" y="14" width="4" height="4" fill="#EC4899" />
          <rect x="52" y="64" width="4" height="4" fill="#FACC15" />
        </g>
      </g>
    );
  }

  // Default Customizable 12-Theme Studio Room Backdrop
  return <CustomRoomShell room={room} roomTheme={roomTheme} isDim={isDim} showDesk={true} />;
}

function PixelCharacter({ avatarConfig, wealthTier, injury }) {
  const skin = SKIN_PALETTES[avatarConfig?.skinTone] || SKIN_PALETTES.warm;
  const hair = HAIR_PALETTES[avatarConfig?.hairColor] || HAIR_PALETTES.espresso;
  const palette = OUTFIT_PALETTES[avatarConfig?.outfitColor] || OUTFIT_PALETTES.royal;
  const gender = avatarConfig?.gender || 'neutral';
  const hairStyle = avatarConfig?.hairStyle || 'short';
  const accessories = sanitizeAccessories(
    Array.isArray(avatarConfig?.accessories)
      ? avatarConfig.accessories
      : avatarConfig?.accessory && avatarConfig.accessory !== 'none'
        ? [avatarConfig.accessory]
        : []
  );
  const hasAcc = (id) => accessories.includes(id);
  const outline = '#1E293B';

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
            accent: '#D4B483',
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
      <ellipse cx="110" cy="95" rx="16" ry="4" fill="#0F172A" opacity="0.22" />

      {/* Pocket Shiba Buddy standing right beside feet */}
      {hasAcc('mini_shiba') && (
        <g>
          <rect x="76" y="79" width="14" height="10" rx="2" fill="#F59E0B" />
          <rect x="78" y="83" width="10" height="6" fill="#FEF3C7" />
          <rect x="83" y="71" width="11" height="10" rx="2" fill="#F59E0B" />
          <rect x="85" y="76" width="8" height="5" fill="#FEF3C7" />
          <polygon points="83,71 85,67 87,71" fill="#D97706" />
          <polygon points="90,71 92,67 94,71" fill="#D97706" />
          <rect x="87" y="74" width="2" height="2" fill="#0F172A" />
          <rect x="91" y="74" width="2" height="2" fill="#0F172A" />
          <rect x="77" y="88" width="3" height="4" fill="#D97706" />
          <rect x="86" y="88" width="3" height="4" fill="#D97706" />
        </g>
      )}

      {/* Daypack straps behind torso */}
      {hasAcc('backpack') && (
        <g>
          <rect x={torsoX - 3} y="53" width={torsoW + 6} height="20" rx="3" fill="#EA580C" stroke={outline} strokeWidth="1.2" />
        </g>
      )}

      {/* Back Hair Layer (9 Styles) */}
      {hairStyle === 'bob' && <rect x="94" y="32" width="32" height="24" rx="2" fill={hair.base} />}
      {hairStyle === 'long_straight' && (
        <rect x="93" y="32" width="34" height="34" rx="2" fill={hair.base} />
      )}
      {hairStyle === 'ponytail' && (
        <g>
          <rect x="123" y="30" width="8" height="22" fill={hair.base} />
          <rect x="121" y="32" width="4" height="4" fill="#14B8A6" />
        </g>
      )}
      {hairStyle === 'twin_tails' && (
        <g>
          <rect x="89" y="30" width="8" height="24" fill={hair.base} />
          <rect x="123" y="30" width="8" height="24" fill={hair.base} />
          <rect x="93" y="31" width="4" height="4" fill="#EC4899" />
          <rect x="123" y="31" width="4" height="4" fill="#EC4899" />
        </g>
      )}
      {hairStyle === 'curly' && (
        <g fill={hair.base}>
          <rect x="91" y="25" width="38" height="24" rx="3" />
          <rect x="89" y="32" width="6" height="12" />
          <rect x="125" y="32" width="6" height="12" />
        </g>
      )}
      {hairStyle === 'bun' && (
        <g>
          <rect x="103" y="13" width="14" height="10" rx="3" fill={hair.base} />
          <rect x="106" y="14" width="8" height="3" fill={hair.shine} />
        </g>
      )}

      {/* Shoes & Legs */}
      <rect x="100" y="74" width="8" height="16" fill={outfit.pants} />
      <rect x="112" y="74" width="8" height="16" fill={outfit.pants} />
      {wealthTier === 'struggling' && <rect x="113" y="80" width="6" height="5" fill="#D4B483" />}

      {injury === 'leg_cast' && (
        <g>
          <rect x="111" y="75" width="10" height="17" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="111" y="82" width="10" height="2" fill="#38BDF8" />
          <rect x="90" y="54" width="3" height="40" fill="#92400E" />
          <rect x="87" y="53" width="9" height="3" fill="#B45309" />
          <rect x="88" y="68" width="6" height="3" fill="#78350F" />
        </g>
      )}

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

      {hasAcc('backpack') && (
        <g fill="#C2410C">
          <rect x={torsoX + 2} y="53" width="3" height="14" />
          <rect x={torsoX + torsoW - 5} y="53" width="3" height="14" />
        </g>
      )}

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
          <rect x={torsoX + 3} y="58" width="7" height="7" fill={outfit.accent} />
          <rect x={torsoX + 5} y="57" width="1" height="9" fill={outline} />
          <rect x={torsoX + 13} y="65" width="5" height="5" fill={skin.shade} />
        </g>
      )}

      {/* Neck Accessories: Scarf / Bowtie */}
      {hasAcc('scarf') && (
        <g>
          <rect x={torsoX + 1} y="50" width={torsoW - 2} height="6" rx="1" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          <rect x="112" y="55" width="6" height="11" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
        </g>
      )}
      {hasAcc('bowtie') && (
        <g>
          <polygon points="104,53 110,56 104,59" fill="#EC4899" stroke={outline} strokeWidth="0.8" />
          <polygon points="116,53 110,56 116,59" fill="#EC4899" stroke={outline} strokeWidth="0.8" />
          <rect x="109" y="55" width="2" height="2" fill="#FBCFE8" />
        </g>
      )}

      {/* Arms */}
      <rect x={torsoX - 5} y="53" width="5" height="15" fill={outfit.shirt} stroke={outline} strokeWidth="1.2" />
      <rect x={torsoX - 5} y="67" width="5" height="5" fill={skin.base} />
      {injury === 'arm_cast' ? (
        <g>
          <path d="M98 53 L116 66" stroke="#38BDF8" strokeWidth="3.5" />
          <rect x={torsoX + torsoW - 2} y="57" width="9" height="11" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x={torsoX + torsoW - 8} y="61" width="10" height="7" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
        </g>
      ) : (
        <g>
          <rect x={torsoX + torsoW} y="53" width="5" height="15" fill={outfit.shirt} stroke={outline} strokeWidth="1.2" />
          <rect x={torsoX + torsoW} y="67" width="5" height="5" fill={skin.base} />
          {hasAcc('boba_tea') && (
            <g>
              <rect x={torsoX + torsoW + 1} y="60" width="7" height="10" rx="1" fill="#FDE68A" stroke="#92400E" strokeWidth="1" />
              <rect x={torsoX + torsoW + 2} y="66" width="5" height="3" fill="#451A03" />
              <rect x={torsoX + torsoW + 4} y="55" width="2" height="5" fill="#EC4899" />
            </g>
          )}
        </g>
      )}

      {/* Head */}
      <rect x="106" y="47" width="8" height="6" fill={skin.shade} />
      <rect x="96" y="24" width="28" height="25" rx="3" fill={skin.base} stroke={outline} strokeWidth="1.5" />
      <rect x="97" y="45" width="26" height="3" fill={skin.shade} opacity="0.6" />

      {/* Sparkle Stud Earrings */}
      {hasAcc('earrings') && (
        <g>
          <rect x="94" y="39" width="3" height="3" fill="#FDE047" stroke="#B45309" strokeWidth="0.6" />
          <rect x="123" y="39" width="3" height="3" fill="#FDE047" stroke="#B45309" strokeWidth="0.6" />
        </g>
      )}

      {/* Facial Expression */}
      {injury === 'medical_mask' ? (
        <g>
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
          <path d="M101 37 Q104 34 106 37" fill="none" stroke={outline} strokeWidth="2" />
          <path d="M114 37 Q117 34 119 37" fill="none" stroke={outline} strokeWidth="2" />
          <rect x="100" y="39" width="4" height="2" fill={skin.blush} />
          <rect x="116" y="39" width="4" height="2" fill={skin.blush} />
          <rect x="107" y="42" width="6" height="3" fill={outline} />
        </g>
      ) : (
        <g>
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

      {(injury === 'arm_cast' || injury === 'leg_cast') && (
        <g>
          <rect x="114" y="39" width="7" height="4" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
          <rect x="117" y="40" width="1" height="2" fill="#D97706" />
        </g>
      )}

      {/* Eye Slot Accessories (Mutually exclusive via slot guard) */}
      {hasAcc('glasses') && (
        <g>
          <rect x="99" y="33" width="8" height="6" fill="none" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="113" y="33" width="8" height="6" fill="none" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="107" y="35" width="6" height="1.5" fill="#1E293B" />
        </g>
      )}
      {hasAcc('sunglasses') && (
        <g>
          <rect x="98" y="32" width="9" height="7" rx="1" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
          <rect x="113" y="32" width="9" height="7" rx="1" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
          <rect x="107" y="34" width="6" height="2" fill="#0F172A" />
          <rect x="100" y="34" width="3" height="2" fill="#94A3B8" opacity="0.7" />
          <rect x="115" y="34" width="3" height="2" fill="#94A3B8" opacity="0.7" />
        </g>
      )}
      {hasAcc('cyber_visor') && (
        <g>
          <rect x="97" y="32" width="26" height="7" rx="2" fill="#06B6D4" stroke="#164E63" strokeWidth="1.2" opacity="0.9" />
          <rect x="101" y="34" width="18" height="2" fill="#ECFEFF" />
        </g>
      )}

      {/* Front Hair Layer */}
      <rect x="95" y="20" width="30" height="8" rx="2" fill={hair.base} />
      <rect x="95" y="24" width="5" height="9" fill={hair.base} />
      <rect x="120" y="24" width="5" height="9" fill={hair.base} />
      <rect x="102" y="21" width="14" height="3" fill={hair.shine} />
      {hairStyle === 'short' && <rect x="100" y="27" width="8" height="3" fill={hair.base} />}
      {hairStyle === 'bob' && <rect x="98" y="27" width="24" height="3" fill={hair.base} />}
      {hairStyle === 'side_part' && (
        <g fill={hair.base}>
          <rect x="99" y="27" width="14" height="3" />
          <rect x="102" y="29" width="7" height="2" />
        </g>
      )}
      {hairStyle === 'spiky' && (
        <g fill={hair.base}>
          <polygon points="96,21 101,13 106,21" />
          <polygon points="105,21 111,12 116,21" />
          <polygon points="114,21 120,14 125,21" />
        </g>
      )}
      {hairStyle === 'curly' && (
        <g fill={hair.base}>
          <rect x="98" y="18" width="24" height="5" />
          <rect x="102" y="26" width="6" height="4" />
          <rect x="112" y="26" width="6" height="4" />
        </g>
      )}

      {/* Ear Band / Over-Head Accessories */}
      {hasAcc('headphones') && (
        <g>
          <rect x="95" y="18" width="30" height="4" fill="#0F172A" />
          <rect x="92" y="29" width="5" height="10" rx="2" fill="#2563EB" stroke="#0F172A" strokeWidth="1" />
          <rect x="123" y="29" width="5" height="10" rx="2" fill="#2563EB" stroke="#0F172A" strokeWidth="1" />
        </g>
      )}

      {/* Headwear Slot Accessories (Conflicts with Headphones guarded in UI) */}
      {hasAcc('cap') && (
        <g>
          <rect x="95" y="17" width="30" height="9" rx="2" fill="#2563EB" stroke="#0F172A" strokeWidth="1.2" />
          <rect x="95" y="24" width="36" height="3" fill="#1D4ED8" stroke="#0F172A" strokeWidth="1" />
          <rect x="106" y="20" width="6" height="3" fill="#FFFFFF" />
        </g>
      )}
      {hasAcc('beanie') && (
        <g>
          <rect x="95" y="15" width="30" height="10" rx="4" fill="#F97316" stroke="#9A3412" strokeWidth="1.2" />
          <rect x="94" y="22" width="32" height="4" rx="1" fill="#EA580C" stroke="#9A3412" strokeWidth="1" />
          <rect x="107" y="12" width="6" height="4" rx="1" fill="#FEF3C7" />
        </g>
      )}
      {hasAcc('santa_hat') && (
        <g>
          <polygon points="96,22 110,8 124,22" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1" />
          <rect x="94" y="21" width="32" height="5" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <circle cx="110" cy="8" r="3" fill="#FFFFFF" />
        </g>
      )}
      {hasAcc('crown') && (
        <g>
          <polygon points="98,21 101,11 106,17 110,9 114,17 119,11 122,21" fill="#FACC15" stroke="#B45309" strokeWidth="1.2" />
          <rect x="108" y="17" width="4" height="3" fill="#EF4444" />
        </g>
      )}

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
    statusTags.push({ id: 'inj', tone: 'red', text: lang === 'TH' ? 'ใส่เฝือกแขน' : 'Arm Cast' });
  } else if (injury === 'leg_cast') {
    statusTags.push({ id: 'inj', tone: 'red', text: lang === 'TH' ? 'ใส่เฝือกขา + ไม้ค้ำ' : 'Leg Cast & Crutch' });
  } else if (injury === 'medical_mask') {
    statusTags.push({ id: 'inj', tone: 'amber', text: lang === 'TH' ? 'สวมหน้ากากพักฟื้น' : 'Recovery Mask' });
  } else if (injury === 'windfall') {
    statusTags.push({ id: 'inj', tone: 'green', text: lang === 'TH' ? 'ได้โบนัส / เฮง!' : 'Cash Windfall!' });
  }

  const sceneLabelMap = {
    office_room: { th: 'ฉาก: ห้องพักตามธีม', en: 'Scene: Custom Room' },
    office_meeting: { th: 'ฉาก: ที่ทำงาน & เอกสารเงิน', en: 'Scene: Work & Paycheck' },
    dental_clinic: { th: 'ฉาก: คลินิกทันตกรรม', en: 'Scene: Dental Clinic' },
    hospital: { th: 'ฉาก: โรงพยาบาล / ฉุกเฉิน', en: 'Scene: Hospital Room' },
    pet_care: { th: 'ฉาก: ดูแลน้องหมาในห้อง', en: 'Scene: Pet in Custom Room' },
    gaming_room: { th: 'ฉาก: เกมคอนโซลในห้อง', en: 'Scene: Gaming in Custom Room' },
    beach_travel: { th: 'ฉาก: ทริปทะเล & เดินทาง', en: 'Scene: Beach Trip' },
    gym_sport: { th: 'ฉาก: ฟิตเนส & กีฬา', en: 'Scene: Fitness Gym' },
    restaurant_feast: { th: 'ฉาก: ร้านปิ้งย่าง / งานเลี้ยง', en: 'Scene: Feast & Bistro' },
    party: { th: 'ฉาก: ปาร์ตี้ / คอนเสิร์ต', en: 'Scene: Party & Concert' },
    road_car: { th: 'ฉาก: ถนน & ซ่อมรถ', en: 'Scene: Road & Vehicle' },
    home_repair: { th: 'ฉาก: ซ่อมบ้านในห้อง', en: 'Scene: Home Repair in Room' },
    cyber_desk: { th: 'ฉาก: โต๊ะเทคในห้อง', en: 'Scene: Tech Desk in Room' },
    rainy_street: { th: 'ฉาก: ถนนฝนตก / กดดัน', en: 'Scene: Rainy Pressure' },
    cafe_mall: { th: 'ฉาก: คาเฟ่ & โซนช้อป', en: 'Scene: Cafe & Shopping' },
    celebration: { th: 'ฉาก: ห้องของคุณรับข่าวดี', en: 'Scene: Custom Room Victory' },
  };

  const bubbleText = (() => {
    if (injury === 'arm_cast' || injury === 'leg_cast') return lang === 'TH' ? 'โอ๊ย เจ็บ!' : 'Ouch!';
    if (sceneType === 'dental_clinic') return lang === 'TH' ? 'เสียวฟัน!' : 'Tooth check!';
    if (injury === 'medical_mask') return lang === 'TH' ? 'พักฟื้นแป๊บ...' : 'Recovering...';
    if (wealthTier === 'struggling') return lang === 'TH' ? 'เงินตึงแล้ว!' : 'Cash tight!';
    if (sceneType === 'office_meeting') return lang === 'TH' ? 'เรื่องงานเข้า!' : 'Pay alert!';
    if (sceneType === 'pet_care') return lang === 'TH' ? 'ดูแลน้อง!' : 'Pet care!';
    if (sceneType === 'gaming_room') return lang === 'TH' ? 'เกมใหม่ออก!' : 'Game night!';
    if (sceneType === 'beach_travel') return lang === 'TH' ? 'จัดกระเป๋า!' : 'Trip mode!';
    if (sceneType === 'gym_sport') return lang === 'TH' ? 'ฟิตหุ่น!' : 'Workout!';
    if (sceneType === 'restaurant_feast') return lang === 'TH' ? 'อิ่มจัง!' : 'Feast time!';
    if (sceneType === 'party') return lang === 'TH' ? 'น่าไปจัง!' : 'Party time!';
    if (sceneType === 'road_car') return lang === 'TH' ? 'รถมีปัญหา!' : 'Car trouble!';
    if (sceneType === 'home_repair') return lang === 'TH' ? 'พังอีกแล้ว!' : 'Needs fixing!';
    if (sceneType === 'cyber_desk') return lang === 'TH' ? 'เช็กจอด่วน!' : 'Tech alert!';
    if (injury === 'windfall') return lang === 'TH' ? 'ว้าว เฮง!' : 'Awesome!';
    return null;
  })();

  return (
    <div className={`px-stage-wrap ${compact ? 'is-compact' : ''}`}>
      <div className="px-canvas-frame">
        {bubbleText && <span className="px-react-bubble">{bubbleText}</span>}
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
