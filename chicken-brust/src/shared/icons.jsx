// Stroke icons used across the app (24×24 viewBox).
const Svg = ({ size = 18, stroke = '#111', width = 2, fill = 'none', children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={width}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

export const IconChevronLeft = p => <Svg {...p}><path d="M15 18l-6-6 6-6" /></Svg>;
export const IconArrowLeft = p => <Svg width={2.2} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
export const IconArrowRight = p => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const IconSearch = p => <Svg width={2.4} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></Svg>;
export const IconFilter = p => <Svg {...p}><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2.2" /><circle cx="9" cy="17" r="2.2" /></Svg>;
export const IconTrash = p => <Svg stroke="#E0521B" {...p}><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" /></Svg>;
export const IconPin = p => <Svg {...p}><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></Svg>;
export const IconPhone = p => <Svg {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></Svg>;
export const IconChat = ({ size = 17, fill = '#111' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>
);
export const IconCamera = p => <Svg {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></Svg>;
export const IconBell = p => <Svg {...p}><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20a2 2 0 0 0 4 0" /></Svg>;
export const IconPencil = p => <Svg width={2.2} {...p}><path d="M4 20h4L19 9l-4-4L4 16z" /></Svg>;
export const IconGear = p => (
  <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></Svg>
);
export const IconLogout = p => <Svg {...p}><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></Svg>;
export const IconPath = ({ d, ...p }) => <Svg {...p}><path d={d} /></Svg>;

export const Heart = ({ size = 18, fill = 'none', stroke = '#111', width = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={width} aria-hidden="true">
    <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
  </svg>
);
