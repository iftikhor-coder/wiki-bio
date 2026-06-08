/* WikiBio — Icon set (inline SVG, currentColor) */
const { createElement: h } = React;

const Icon = ({ d, size = 18, stroke = 1.5, fill = "none", children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  search:  (p)=> <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>,
  arrowR:  (p)=> <Icon {...p} d="M5 12h14M13 6l6 6-6 6" />,
  arrowL:  (p)=> <Icon {...p} d="M19 12H5M11 6l-6 6 6 6" />,
  arrowUR: (p)=> <Icon {...p} d="M7 17 17 7M9 7h8v8" />,
  check:   (p)=> <Icon {...p} d="M4 12.5 9 17.5 20 6.5" />,
  plus:    (p)=> <Icon {...p} d="M12 5v14M5 12h14" />,
  x:       (p)=> <Icon {...p} d="M6 6l12 12M18 6l-12 12" />,
  chev:    (p)=> <Icon {...p} d="m9 6 6 6-6 6" />,
  chevD:   (p)=> <Icon {...p} d="m6 9 6 6 6-6" />,
  sun:     (p)=> <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></Icon>,
  moon:    (p)=> <Icon {...p} d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  bell:    (p)=> <Icon {...p} d="M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16l-2-3zM10 21a2 2 0 0 0 4 0" />,
  star:    (p)=> <Icon {...p} d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.6l1.2-6L3.3 9.3l6.1-.7L12 3z" />,
  badge:   (p)=> <Icon {...p}><path d="m12 2 2.4 2.1 3.2-.3.3 3.2L20 9.4 17.9 12l.9 3-2.7 1.9-.8 3.1-3.3-.5-2.5 2-2-2.5L4 18l-.8-3.1L1 13l1.9-2.7L2 7.2l3.2-1L7 3l3.2.3z"/><path d="m9 12 2 2 4-4" /></Icon>,
  eye:     (p)=> <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>,
  globe:   (p)=> <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></Icon>,
  link:    (p)=> <Icon {...p} d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />,
  share:   (p)=> <Icon {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></Icon>,
  insta:   (p)=> <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></Icon>,
  x_logo:  (p)=> <Icon {...p}><path d="M4 4l16 16M20 4 4 20" stroke="none" fill="currentColor" /><path d="M4 4h4l12 16h-4z" stroke="none" fill="currentColor" /></Icon>,
  linked:  (p)=> <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 13v4" /></Icon>,
  site:    (p)=> <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Icon>,
  imdb:    (p)=> <Icon {...p}><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M7 9v6M10 9v6M13 9v6M16 9v6" /></Icon>,
  upload:  (p)=> <Icon {...p} d="M12 16V4M6 10l6-6 6 6M4 20h16" />,
  image:   (p)=> <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></Icon>,
  pen:     (p)=> <Icon {...p} d="M16 4l4 4-11 11H5v-4L16 4z" />,
  bold:    (p)=> <Icon {...p} d="M7 5h7a3 3 0 0 1 0 6H7zm0 6h8a3 3 0 0 1 0 6H7z" />,
  italic:  (p)=> <Icon {...p} d="M14 5h-5M15 19h-5M14 5l-4 14" />,
  list:    (p)=> <Icon {...p} d="M9 6h11M9 12h11M9 18h11M5 6h.01M5 12h.01M5 18h.01" />,
  quote:   (p)=> <Icon {...p} d="M6 17V11a3 3 0 0 1 3-3M13 17V11a3 3 0 0 1 3-3" />,
  grip:    (p)=> <Icon {...p}><circle cx="9" cy="6" r="1" fill="currentColor" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="9" cy="18" r="1" fill="currentColor" /><circle cx="15" cy="6" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="18" r="1" fill="currentColor" /></Icon>,
  trend:   (p)=> <Icon {...p} d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
  bars:    (p)=> <Icon {...p} d="M4 20V10M10 20V4M16 20v-7M22 20v-4" />,
  users:   (p)=> <Icon {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16 20a5 5 0 0 1 5-5" /></Icon>,
  shield:  (p)=> <Icon {...p} d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" />,
  filter:  (p)=> <Icon {...p} d="M3 5h18l-7 9v6l-4-2v-4z" />,
  menu:    (p)=> <Icon {...p} d="M4 6h16M4 12h16M4 18h16" />,
  dot:     (p)=> <Icon {...p}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></Icon>,
  edit:    (p)=> <Icon {...p} d="M4 20h4l11-11-4-4L4 16zM14 5l4 4" />,
  spark:   (p)=> <Icon {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />,
  bookmark:(p)=> <Icon {...p} d="M6 3h12v18l-6-4-6 4z" />,
  google:  (p)=> <Icon {...p}><path d="M21 12a9 9 0 1 1-3.1-6.8" /><path d="M21 5v5h-5" /></Icon>,
};

const SocialIcon = ({ kind, size = 14 }) => {
  const map = { instagram: I.insta, x: I.x_logo, linkedin: I.linked, site: I.site, imdb: I.imdb };
  const Comp = map[kind] || I.link;
  return <Comp size={size} />;
};

window.I = I;
window.SocialIcon = SocialIcon;
