import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

/* ──────────────────────────────────────────────────────────────────────────
   מערכת ניהול ספרייה — מצגת רקע לראיון בחינת פרויקט גמר 5 יח״ל
   ליאור אבני · הנדסת תוכנה וסייבר
   מצגת רקע אווירתית: מעט טקסט, אין שקופית לוח-זמנים ואין תוויות זמן —
   היא רק עוקבת אחרי סדר הנושאים וההרחבות שאדבר עליהם.
   כל המצגת RTL; קוד מוצג LTR.
   ────────────────────────────────────────────────────────────────────────── */

export const design: DesignSystem = {
  palette: { bg: '#eef3fb', text: '#111828', accent: '#2e73ea' },
  fonts: {
    display: '"Rubik", "Segoe UI", "Arial", sans-serif',
    body: '"Heebo", "Segoe UI", "Arial", sans-serif',
  },
  typeScale: { hero: 138, body: 34 },
  radius: 20,
};

/* ─── palette ─── */
const P = {
  bg: '#eef3fb',
  ink: '#111828',
  navy: '#172d67',
  navyDeep: '#0e1b3d',
  blue: '#2e73ea',
  blue2: '#4b7afe',
  cyan: '#0fb5ab',
  cyanBright: '#22ddd2',
  purple: '#8c15e9',
  soft: '#b9d4ff',
  mist: '#e5eef5',
  white: '#ffffff',
  muted: '#5b6b8c',
  line: '#d6e2f2',
};

const MONO = '"JetBrains Mono", "Consolas", "SF Mono", ui-monospace, monospace';

const FONT_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&family=Rubik:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');";

/* ─── code highlight colors (on dark navy) ─── */
const CC = {
  bg: '#0e1b3d',
  bar: '#16285c',
  def: '#d7e3f7',
  comment: '#7186b8',
  str: '#5fe3c8',
  kw: '#7fa8ff',
  type: '#c9a8ff',
  num: '#ffce82',
};

const CODE_KW = new Set(
  ('public private protected internal abstract sealed class interface struct enum void var new return ' +
    'foreach for while if else null using namespace override virtual static const readonly this base true ' +
    'false try catch finally throw in out get set delegate params async await partial')
    .split(' '),
);
const CODE_TYPE = new Set(
  ('string int bool byte short long double decimal float object DateTime Guid List OleDbCommand OleDbConnection ' +
    'OleDbParameter OleDbType BaseEntity BaseDB ChangeEntity Book BookCopy BookAuthor CreateSql HttpClient Task ' +
    'TimeSpan StringBuilder DispatcherTimer EventArgs ServiceHost Service1 IService1 AuthResultDto IValueConverter ' +
    'RandomNumberGenerator Convert BookSearchRowList LibrarySettingsList AccountStatusCodes RoleCodes CopyStatusCodes ' +
    'CopyConditionCodes Service1Client ServiceReference1 SessionManager UiGuards AuthGuard BooksDB BookAuthorsDB ' +
    'BookCopiesDB UsersDB LibrariansDB Librarian PasswordHasher BookManageRowList Func LoansDB UserRolesDB MembersDB ' +
    'User UserRole Member AiContextBuilder AiChatHelper')
    .split(' '),
);

function hl(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\/\/[^\n]*)|("(?:\\.|[^"\\])*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_]+)/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) nodes.push(<span key={k++} style={{ color: CC.comment, fontStyle: 'italic' }}>{m[1]}</span>);
    else if (m[2]) nodes.push(<span key={k++} style={{ color: CC.str }}>{m[2]}</span>);
    else if (m[3]) nodes.push(<span key={k++} style={{ color: CC.num }}>{m[3]}</span>);
    else if (m[4]) {
      const w = m[4];
      const col = CODE_KW.has(w) ? CC.kw : CODE_TYPE.has(w) ? CC.type : CC.def;
      nodes.push(<span key={k++} style={{ color: col }}>{w}</span>);
    } else nodes.push(<span key={k++}>{m[0]}</span>);
  }
  return nodes;
}

/* ─── shared bits ─── */

const Eyebrow = ({ text, accent = P.blue, dark = false }: { text: string; accent?: string; dark?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 36, height: 5, borderRadius: 3, background: accent, boxShadow: `0 0 16px ${accent}66` }} />
    <span style={{ fontFamily: MONO, fontSize: 21, letterSpacing: '0.03em', fontWeight: 600, color: dark ? 'rgba(255,255,255,0.72)' : accent }}>
      {text}
    </span>
  </div>
);

const Tag = ({ text, color = P.purple }: { text: string; color?: string }) => (
  <span
    style={{
      flexShrink: 0,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 21,
      fontWeight: 700,
      color: '#fff',
      background: color,
      padding: '11px 20px',
      borderRadius: 999,
      boxShadow: `0 12px 26px ${color}55`,
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </span>
);

const Footer = ({ dark = false, accent = P.blue }: { dark?: boolean; accent?: string }) => {
  const { current, total } = useSlidePageNumber();
  const col = dark ? 'rgba(255,255,255,0.5)' : P.muted;
  return (
    <div
      style={{
        position: 'absolute',
        left: 104,
        right: 104,
        bottom: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        direction: 'ltr',
        fontFamily: MONO,
        fontSize: 18,
        color: col,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ color: accent, fontWeight: 600 }}>{String(current).padStart(2, '0')}</span>
        <span style={{ opacity: 0.55 }}>/ {String(total).padStart(2, '0')}</span>
      </span>
      <span style={{ direction: 'rtl' }}>מערכת ניהול ספרייה · ליאור אבני</span>
    </div>
  );
};

const darkBg = `radial-gradient(1200px 760px at 86% -12%, ${P.blue}40, transparent 58%), radial-gradient(1000px 680px at -6% 112%, ${P.purple}3a, transparent 55%), ${P.navyDeep}`;
const lightBg = `radial-gradient(1150px 760px at 93% -16%, #dbe8ff 0%, transparent 56%), radial-gradient(950px 720px at -10% 116%, #ece2fd 0%, transparent 52%), ${P.bg}`;

type SlideProps = {
  eyebrow?: string;
  title?: string;
  accent?: string;
  dark?: boolean;
  tag?: string;
  tagColor?: string;
  children: ReactNode;
};

const Slide = ({ eyebrow, title, accent = P.blue, dark = false, tag, tagColor, children }: SlideProps) => {
  const fg = dark ? '#eaf1ff' : P.ink;
  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: dark ? darkBg : lightBg,
        color: fg,
        fontFamily: 'var(--osd-font-body)',
        padding: '74px 104px 96px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{FONT_CSS}</style>
      {(eyebrow || title || tag) && (
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 28, marginBottom: 30 }}>
          <div>
            {eyebrow && <Eyebrow text={eyebrow} accent={accent} dark={dark} />}
            {title && (
              <h1 style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 56, lineHeight: 1.08, margin: '14px 0 0', color: fg }}>
                {title}
              </h1>
            )}
          </div>
          {tag && <Tag text={tag} color={tagColor || P.purple} />}
        </header>
      )}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
      <Footer dark={dark} accent={accent} />
    </div>
  );
};

const List = ({ children, gap = 22 }: { children: ReactNode; gap?: number }) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap }}>{children}</ul>
);

const Bullet = ({ children, accent = P.blue, dark = false, size = 33 }: { children: ReactNode; accent?: string; dark?: boolean; size?: number }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 16, fontSize: size, lineHeight: 1.42, color: dark ? '#dce6fb' : P.ink }}>
    <span style={{ flexShrink: 0, marginTop: size * 0.42, width: 12, height: 12, borderRadius: 3, background: accent, transform: 'rotate(45deg)', boxShadow: `0 0 12px ${accent}66` }} />
    <span>{children}</span>
  </li>
);

const Card = ({ children, style, accent }: { children: ReactNode; style?: CSSProperties; accent?: string }) => (
  <div
    style={{
      background: P.white,
      border: `1px solid ${P.line}`,
      borderRadius: 22,
      boxShadow: '0 22px 50px rgba(23,45,103,0.10)',
      padding: 28,
      position: 'relative',
      ...(accent ? { borderTop: `4px solid ${accent}` } : null),
      ...style,
    }}
  >
    {children}
  </div>
);

const Code = ({ lines, fontSize = 21, title }: { lines: string[]; fontSize?: number; title?: string }) => (
  <div style={{ borderRadius: 18, overflow: 'hidden', background: CC.bg, boxShadow: '0 24px 60px rgba(14,27,61,0.35)', border: `1px solid ${CC.bar}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 20px', background: CC.bar, direction: 'ltr' }}>
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
      {title && <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 16, color: 'rgba(255,255,255,0.65)' }}>{title}</span>}
    </div>
    <pre style={{ margin: 0, padding: '20px 24px', direction: 'ltr', textAlign: 'left', fontFamily: MONO, fontSize, lineHeight: 1.5, color: CC.def, whiteSpace: 'pre', overflow: 'hidden' }}>
      {lines.map((l, i) => (
        <div key={i}>{l === '' ? '\u00A0' : hl(l)}</div>
      ))}
    </pre>
  </div>
);

const Box = ({ title, sub, color = P.blue, dark = false, style }: { title: string; sub?: string; color?: string; dark?: boolean; style?: CSSProperties }) => (
  <div
    style={{
      borderRadius: 16,
      padding: '16px 20px',
      background: dark ? 'rgba(255,255,255,0.06)' : P.white,
      border: `2px solid ${color}`,
      boxShadow: `0 14px 32px ${color}22`,
      textAlign: 'center',
      ...style,
    }}
  >
    <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 25, color: dark ? '#fff' : P.navy }}>{title}</div>
    {sub && <div style={{ fontSize: 18, color: dark ? 'rgba(255,255,255,0.62)' : P.muted, marginTop: 3 }}>{sub}</div>}
  </div>
);

const Arrow = ({ dir = 'down', color = P.blue2 }: { dir?: 'down' | 'left' | 'up'; color?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>
    {dir === 'down' ? '↓' : dir === 'up' ? '↑' : '←'}
  </div>
);

const Stat = ({ value, label, color = P.blue, dark = false }: { value: string; label: string; color?: string; dark?: boolean }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 900, fontSize: 64, lineHeight: 1, color }}>{value}</div>
    <div style={{ fontSize: 22, marginTop: 8, color: dark ? 'rgba(255,255,255,0.7)' : P.muted }}>{label}</div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 1 — שער
   ════════════════════════════════════════════════════════════════════════ */
const S01_Title: Page = () => (
  <div
    dir="rtl"
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: darkBg,
      color: '#eaf1ff',
      fontFamily: 'var(--osd-font-body)',
      padding: '0 120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <style>{FONT_CSS}</style>
    <span style={{ position: 'absolute', top: 120, left: 150, width: 220, height: 220, borderRadius: '50%', border: `2px solid ${P.cyanBright}55`, opacity: 0.6 }} />
    <span style={{ position: 'absolute', bottom: 80, left: 320, width: 90, height: 90, borderRadius: 20, background: `${P.purple}33`, transform: 'rotate(20deg)' }} />
    <Eyebrow text="פרויקט גמר · 5 יח״ל" accent={P.cyanBright} dark />
    <h1 style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 900, fontSize: 132, lineHeight: 1.04, margin: '22px 0 0' }}>
      מערכת ניהול ספרייה
    </h1>
    <div style={{ fontFamily: MONO, fontSize: 44, color: P.cyanBright, marginTop: 10, direction: 'ltr', textAlign: 'right' }}>
      Library Management System
    </div>
    <div style={{ height: 2, width: 560, background: `linear-gradient(90deg, ${P.blue2}, transparent)`, margin: '40px 0 36px' }} />
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>מגיש</div>
        <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 48 }}>ליאור אבני</div>
      </div>
      <div style={{ maxWidth: 760 }}>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>מסלול</div>
        <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.35 }}>
          שירותי אינטרנט, תכנות אסינכרוני ומסדי נתונים
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
      {['לקוח WPF', 'אתר Blazor', 'אפליקציית MAUI'].map((t, i) => (
        <span
          key={t}
          style={{
            fontFamily: MONO,
            fontSize: 22,
            padding: '10px 20px',
            borderRadius: 999,
            border: `1px solid ${[P.blue2, P.cyanBright, P.purple][i]}88`,
            color: [P.blue2, P.cyanBright, P.purple][i],
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          {t}
        </span>
      ))}
    </div>
    <div style={{ position: 'absolute', bottom: 44, left: 120, fontFamily: MONO, fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>תשפ״ו · 2026</div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 2 — ארכיטקטורה
   ════════════════════════════════════════════════════════════════════════ */
const S02_Architecture: Page = () => {
  const Layer = ({ name, desc, color }: { name: string; desc: string; color: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.12)`, borderRight: `6px solid ${color}`, borderRadius: 12, padding: '11px 18px' }}>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: '#fff', direction: 'ltr', minWidth: 130, textAlign: 'right' }}>{name}</div>
      <div style={{ fontSize: 19, color: 'rgba(255,255,255,0.72)' }}>{desc}</div>
    </div>
  );
  const ClientPill = ({ t, color }: { t: string; color: string }) => (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 21, fontFamily: 'var(--osd-font-display)' }}>{t}</div>
  );
  return (
    <Slide eyebrow="ארכיטקטורה" title="מערכת שרת–לקוח · שירות WCF אחד" accent={P.blue} dark>
      <p style={{ fontSize: 30, lineHeight: 1.45, color: 'rgba(255,255,255,0.85)', margin: '0 0 26px', maxWidth: 1560 }}>
        שרת מרכזי החושף <b>שירות WCF</b> אחד, ו־<b>שלושה לקוחות</b> שמדברים רק איתו — אף לקוח לא ניגש למסד הנתונים ישירות.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 40, flex: 1, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <Layer name="Model" desc="ישויות, DTO, enums" color={P.cyanBright} />
          <Layer name="DAL" desc="גישה לנתונים · ADO.NET + OleDb (Access)" color={P.blue2} />
          <Layer name="BL" desc="אבטחה, הרשאות, עוזר AI" color={P.purple} />
          <Layer name="WCF Service" desc="IService1 · החוזה היחיד ללקוחות" color={P.blue} />
          <Layer name="Host" desc="WpfHost — מארח את השירות + טיימר תחזוקה" color={P.cyanBright} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ textAlign: 'center', color: P.cyanBright, fontFamily: MONO, fontSize: 19 }}>הלקוחות ↔ WCF</div>
          <ClientPill t="WPF" color={P.blue2} />
          <ClientPill t="Blazor" color={P.cyanBright} />
          <ClientPill t="MAUI" color={P.purple} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 70, marginTop: 'auto', paddingTop: 22 }}>
        <Stat value="17" label="טבלאות (מנורמל)" color={P.cyanBright} dark />
        <Stat value="3" label="לקוחות · 3 פלטפורמות" color={P.blue2} dark />
        <Stat value="9" label="הרחבות מתקדמות" color={P.purple} dark />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 3 — שלוש פלטפורמות, שרת אחד (רקע לחלק ההדגמה + Web/MAUI)
   ════════════════════════════════════════════════════════════════════════ */
const S03_Clients: Page = () => {
  const ClientCard = ({ icon, name, who, shows, color }: { icon: string; name: string; who: string; shows: string; color: string }) => (
    <Card accent={color} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: '34px 30px' }}>
      <div style={{ width: 72, height: 72, borderRadius: 18, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 33, color: P.navy }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 20, color }}>{who}</div>
      <div style={{ fontSize: 23, color: P.muted, lineHeight: 1.45 }}>{shows}</div>
    </Card>
  );
  return (
    <Slide eyebrow="ריבוי פלטפורמות" title="אותה מערכת — שלוש פלטפורמות" accent={P.cyan}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', flex: 1 }}>
        <ClientCard icon="🖥️" name="לקוח WPF" who="לספרנים ומנהלים" shows="ניהול קטלוג, עותקים, השאלות, קנסות, משתמשים ודוחות" color={P.blue} />
        <ClientCard icon="🌐" name="אתר Blazor" who="למנויים · בדפדפן" shows="דשבורד אישי — השאלות, הזמנות וקנסות מכל מחשב (Razor)" color={P.cyan} />
        <ClientCard icon="📱" name="אפליקציית MAUI" who="למנויים · במובייל" shows="עבודה אסינכרונית (async/await) — ממשק רספונסיבי שלא קופא" color={P.purple} />
      </div>
      <div style={{ textAlign: 'center', fontSize: 26, color: P.navy, marginTop: 24 }}>
        שלושתם מדברים עם <b>אותו שירות WCF</b> — לוגיקה אחת, מסד אחד, אבטחה אחת.
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 4 — חמש השכבות + הזרימה
   ════════════════════════════════════════════════════════════════════════ */
const S04_Layers: Page = () => {
  const L = ({ n, name, desc, color }: { n: string; name: string; desc: string; color: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: P.white, border: `1px solid ${P.line}`, borderRight: `6px solid ${color}`, borderRadius: 13, padding: '13px 18px', boxShadow: '0 10px 22px rgba(23,45,103,0.06)' }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 21, flexShrink: 0 }}>{n}</div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: P.navy, minWidth: 150, direction: 'ltr', textAlign: 'right' }}>{name}</div>
      <div style={{ fontSize: 21, color: P.muted, flex: 1 }}>{desc}</div>
    </div>
  );
  const FlowPill = ({ t, color }: { t: string; color: string }) => (
    <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: '#fff', background: color, padding: '9px 16px', borderRadius: 10, direction: 'ltr' }}>{t}</span>
  );
  return (
    <Slide eyebrow="השכבות בשרת" title="חמש שכבות בשרת — כל אחת ותפקידה" accent={P.purple}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1, justifyContent: 'center' }}>
        <L n="1" name="Model" desc="ישויות (=טבלאות), אוספים, DTO ו-Enums" color={P.cyanBright} />
        <L n="2" name="DAL" desc="השכבה היחידה שמכירה SQL · מחלקה לכל טבלה · יורשת מ-BaseDB" color={P.blue2} />
        <L n="3" name="BL" desc="לוגיקה בלבד: PasswordHasher · AuthGuard · בניית prompt ל-AI" color={P.purple} />
        <L n="4" name="WCF Service" desc="חוזה דק: בודק הרשאות, מצפין, ומעביר ל-DAL" color={P.blue} />
        <L n="5" name="Host" desc="מריץ את ה-ServiceHost + DispatcherTimer לניקוי הזמנות" color={P.cyan} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 18, direction: 'ltr' }}>
        <FlowPill t="Client" color={P.blue2} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="WCF" color={P.blue} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="Service1" color={P.blue} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="DAL" color={P.purple} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="DB" color={P.cyan} />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 5 — Template Method ב-BaseDB
   ════════════════════════════════════════════════════════════════════════ */
const S05_Template: Page = () => (
  <Slide eyebrow="תבנית עיצוב" title="Template Method ב-BaseDB" accent={P.purple} tag="DRY · מניעת כפל קוד" tagColor={P.purple}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 34, flex: 1, alignItems: 'center' }}>
      <Code
        title="BaseDB.cs — שלד שכתוב פעם אחת"
        fontSize={20}
        lines={[
          'public abstract class BaseDB {',
          '    // השלד — כתוב פעם אחת באב',
          '    protected List<BaseEntity> Select() { ... }',
          '    public int SaveChanges() { ... }',
          '',
          '    // הצעדים — כל DAL יורש ממלא בעצמו',
          '    protected abstract void CreateInsertSQL(...);',
          '    protected abstract void CreateUpdateSQL(...);',
          '    protected abstract void CreateDeleteSQL(...);',
          '    protected abstract BaseEntity NewEntity();',
          '    protected abstract BaseEntity CreateModel(...);',
          '}',
        ]}
      />
      <div>
        <List gap={16}>
          <Bullet accent={P.purple} size={28}>האב מגדיר את <b>שלד האלגוריתם</b> (פתיחת חיבור, לולאות)</Bullet>
          <Bullet accent={P.blue} size={28}>היורש ממלא רק את <b>5 הצעדים</b> שמתאימים לטבלה שלו</Bullet>
          <Bullet accent={P.cyan} size={28}><code style={{ fontFamily: MONO }}>Select</code> ו-<code style={{ fontFamily: MONO }}>SaveChanges</code> אף פעם לא משוכפלים</Bullet>
        </List>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
          {['CreateInsertSQL', 'CreateUpdateSQL', 'CreateDeleteSQL', 'NewEntity', 'CreateModel'].map((m) => (
            <span key={m} style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, color: P.purple, background: `${P.purple}14`, border: `1px solid ${P.purple}33`, padding: '8px 14px', borderRadius: 999, direction: 'ltr' }}>{m}()</span>
          ))}
        </div>
      </div>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 6 — תשתית הנתונים (טבלאות · Lookups · DTO)
   ════════════════════════════════════════════════════════════════════════ */
const S06_Data: Page = () => {
  const Mini = ({ title, sub, color }: { title: string; sub: string; color: string }) => (
    <Card accent={color} style={{ flex: 1, padding: '22px 24px' }}>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 26, color: P.navy }}>{title}</div>
      <div style={{ fontSize: 21, color: P.muted, marginTop: 8, lineHeight: 1.4 }}>{sub}</div>
    </Card>
  );
  return (
    <Slide eyebrow="תשתית הנתונים" title="מסד מנורמל · Lookups · DTO" accent={P.cyan}>
      <div style={{ display: 'flex', gap: 18, marginBottom: 22 }}>
        <Mini title="17 טבלאות" sub="15 נתונים + 2 טבלאות קשר (book_authors · user_roles)" color={P.blue} />
        <Mini title="Lookups ↔ Enums" sub="קודי סטטוס/תפקיד במסד מסונכרנים עם Enums בקוד ל-Type Safety" color={P.purple} />
        <Mini title="DTO" sub="אובייקט שנושא בדיוק מה שהלקוח צריך — גם ממספר טבלאות (AuthResultDto)" color={P.cyan} />
      </div>
      <div style={{ display: 'flex', gap: 18, flex: 1 }}>
        <Card accent={P.blue2} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 25, color: P.navy, marginBottom: 14 }}>נרמול ושלמות נתונים</div>
          <List gap={13}>
            <Bullet accent={P.blue2} size={24}>טבלאות קשר רבים-לרבים מונעות כפילות</Bullet>
            <Bullet accent={P.blue} size={24}>Foreign Keys אוכפים Referential Integrity</Bullet>
            <Bullet accent={P.cyan} size={24}>טבלאות Lookup לסטטוסים, תנאים ותפקידים</Bullet>
          </List>
        </Card>
        <Card accent={P.purple} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 25, color: P.navy, marginBottom: 14 }}>כלל ברזל — הפרדת שכבות</div>
          <p style={{ fontSize: 24, lineHeight: 1.5, color: P.ink, margin: 0 }}>
            ה-DAL <b>לא מכיר</b> את ה-BL. למשל אינו יודע להצפין סיסמה — הוא מקבל זאת כ-<b>delegate</b> מבחוץ. כך השכבות נשארות עצמאיות.
          </p>
        </Card>
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 7 — ההרחבות (סעיף 9 + 10)
   ════════════════════════════════════════════════════════════════════════ */
const S07_Extensions: Page = () => {
  const Ext = ({ icon, name, color, star }: { icon: string; name: string; color: string; star?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, background: P.white, border: `1px solid ${P.line}`, borderRight: `5px solid ${color}`, borderRadius: 13, padding: '12px 16px', boxShadow: '0 10px 22px rgba(23,45,103,0.06)' }}>
      <span style={{ fontSize: 25, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 22, fontWeight: 600, color: P.navy, lineHeight: 1.2, flex: 1 }}>{name}</span>
      {star && <span style={{ fontSize: 20 }}>⭐</span>}
    </div>
  );
  return (
    <Slide eyebrow="ההרחבות" title="תשע הרחבות מתקדמות" accent={P.purple}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, flex: 1, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <Tag text="סעיף 9" color={P.purple} />
            <span style={{ fontSize: 21, color: P.muted }}>חמש הרחבות</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <Ext icon="🧬" name="ירושה ממחלקות שכתבתי (UI)" color={P.blue} />
            <Ext icon="🔗" name="שימוש מתקדם ב-Delegate" color={P.blue2} />
            <Ext icon="🔐" name="הצפנה — PBKDF2" color={P.purple} star />
            <Ext icon="🧩" name="שימוש ב-UserControl" color={P.cyan} />
            <Ext icon="🤖" name="שימוש בבינה מלאכותית" color={P.purple} star />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <Tag text="סעיף 10" color={P.cyan} />
            <span style={{ fontSize: 21, color: P.muted }}>ארבע הרחבות</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <Ext icon="🛡️" name="הגנה מ-SQL Injection" color={P.blue} star />
            <Ext icon="⏱️" name="קוד אסינכרוני (טיימרים)" color={P.purple} star />
            <Ext icon="🔄" name="Value Converter" color={P.cyan} />
            <Ext icon="📱" name="עבודה אסינכרונית בטלפון" color={P.blue2} />
          </div>
        </div>
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 8 — הרחבה: הצפנת PBKDF2
   ════════════════════════════════════════════════════════════════════════ */
const S08_PBKDF2: Page = () => (
  <Slide eyebrow="הרחבה · הצפנה" title="הצפנת סיסמאות — PBKDF2" accent={P.purple} tag="אבטחה" tagColor={P.purple}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 34, flex: 1, alignItems: 'center' }}>
      <Code
        title="PasswordHasher.cs"
        fontSize={19}
        lines={[
          'private const int SaltSizeBytes = 16;   // 128-bit salt',
          'private const int HashSizeBytes = 32;   // 256-bit key',
          'private const int Iterations    = 100000;',
          '',
          'public static string HashPassword(string password) {',
          '    byte[] salt = new byte[SaltSizeBytes];',
          '    RandomNumberGenerator.Create().GetBytes(salt);',
          '    byte[] hash = Pbkdf2(password, salt, Iterations, 32);',
          '    // נשמר כ-"iterations.salt.hash"',
          '    return Iterations + "." + ToB64(salt) + "." + ToB64(hash);',
          '}',
        ]}
      />
      <div>
        <List gap={15}>
          <Bullet accent={P.purple} size={28}><b>Salt אקראי 128 ביט</b> — נגד Rainbow Tables</Bullet>
          <Bullet accent={P.blue} size={28}><b>100,000 איטרציות</b> — נגד Brute Force</Bullet>
          <Bullet accent={P.cyan} size={28}><b>מפתח 256 ביט</b> — רמת אבטחה גבוהה</Bullet>
          <Bullet accent={P.blue2} size={28}><b>FixedTimeEquals</b> — נגד Timing Attacks</Bullet>
        </List>
        <div style={{ marginTop: 22, background: `${P.purple}10`, border: `1px solid ${P.purple}33`, borderRadius: 14, padding: '16px 20px', fontSize: 21, color: P.navy, lineHeight: 1.45 }}>
          הסיסמה המקורית <b>לעולם</b> לא נשמרת. ה-Service מצפין — ה-DAL מקבל hash מוכן בלבד.
        </div>
      </div>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 9 — הרחבה: עוזר ה-AI
   ════════════════════════════════════════════════════════════════════════ */
const S09_Ai: Page = () => (
  <Slide eyebrow="הרחבה · בינה מלאכותית" title="עוזר ספרייה חכם — מקומי, דרך WCF" accent={P.purple} dark tag="Ollama · Gemma" tagColor={P.purple}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box title="המשתמש שואל" sub="צ׳אט בלקוח WPF" color={P.cyanBright} dark style={{ minWidth: 200 }} />
        <Arrow dir="left" color={P.cyanBright} />
        <Box title="WCF" sub="AskLibraryAssistant" color={P.blue2} dark style={{ minWidth: 170 }} />
        <Arrow dir="left" color={P.cyanBright} />
        <Box title="AiContextBuilder" sub="שולף נתוני המשתמש מהמסד" color={P.purple} dark style={{ minWidth: 240 }} />
      </div>
      <Arrow color={P.cyanBright} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box title="System Prompt דינמי" sub="השאלות, ההזמנות, הקנסות והקטלוג" color={P.blue} dark style={{ minWidth: 320 }} />
        <Arrow dir="left" color={P.cyanBright} />
        <Box title="Ollama · Gemma" sub="מודל מקומי דרך HTTP" color={P.purple} dark style={{ minWidth: 230 }} />
        <Arrow dir="left" color={P.cyanBright} />
        <Box title="תשובה בצ׳אט" sub="חוזרת דרך WCF · היסטוריה לכל סשן" color={P.cyanBright} dark style={{ minWidth: 250 }} />
      </div>
      <div style={{ textAlign: 'center', fontSize: 23, color: 'rgba(255,255,255,0.78)', marginTop: 10 }}>
        מקומי = <b>פרטיות</b> · בלי תלות באינטרנט · בלי עלות API
      </div>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 10 — הרחבה: הגנה מ-SQL Injection
   ════════════════════════════════════════════════════════════════════════ */
const S10_SqlInjection: Page = () => (
  <Slide eyebrow="הרחבה · אבטחה" title="הגנה מ-SQL Injection" accent={P.blue} tag="Parameterized Queries" tagColor={P.blue}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, flex: 1, alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>❌</span>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 24, color: '#c0392b' }}>שרשור מחרוזות — מסוכן</span>
        </div>
        <Code
          fontSize={18}
          lines={[
            '"... WHERE email = \'" + input + "\'"',
            '',
            "// תוקף מקליד:  ' OR '1'='1",
            '// → מתחבר בלי סיסמה',
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '24px 0 12px' }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 24, color: P.cyan }}>פרמטרים — בטוח</span>
        </div>
        <Code
          fontSize={18}
          lines={[
            'cmd.CommandText = "... WHERE book_id = ?";',
            'cmd.Parameters.AddWithValue("@book_id", bookId);',
          ]}
        />
      </div>
      <div>
        <List gap={18}>
          <Bullet accent={P.blue} size={29}>הערך עובר <b>בנפרד</b> כפרמטר — לעולם לא כקוד</Bullet>
          <Bullet accent={P.purple} size={29}>ה-Driver של ADO.NET מתייחס אליו כ<b>דאטה בלבד</b></Bullet>
          <Bullet accent={P.cyan} size={29}>בונוס: <b>אימות טיפוסים</b> מובנה (int / date)</Bullet>
          <Bullet accent={P.blue2} size={29}>בפרויקט — <b>אין אפילו שאילתה אחת</b> עם שרשור קלט</Bullet>
        </List>
      </div>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 11 — הרחבה: קוד אסינכרוני (טיימר)
   ════════════════════════════════════════════════════════════════════════ */
const S11_Timer: Page = () => (
  <Slide eyebrow="הרחבה · קוד אסינכרוני" title="קוד אסינכרוני — טיימר רקע בשרת" accent={P.cyan} tag="DispatcherTimer" tagColor={P.cyan}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 34, flex: 1, alignItems: 'center' }}>
      <Code
        title="MainWindow.xaml.cs (WpfHost)"
        fontSize={18.5}
        lines={[
          '// מתעורר כל שעה ומנקה הזמנות שפג תוקפן',
          'private void ScheduleNextRoundHour() {',
          '    var now  = DateTime.Now;',
          '    var next = new DateTime(now.Year, now.Month,',
          '        now.Day, now.Hour, 0, 0).AddHours(1);',
          '    timer.Interval = next - now;  // עד השעה העגולה',
          '    timer.Start();',
          '}',
          '',
          'private void Timer_Tick(object s, EventArgs e) {',
          '    new Service1().CleanupExpiredReservations();',
          '    timer.Interval = TimeSpan.FromHours(1);',
          '}',
        ]}
      />
      <div>
        <List gap={16}>
          <Bullet accent={P.cyan} size={28}>הטיימר <b>לא תופס Thread</b> בזמן ההמתנה</Bullet>
          <Bullet accent={P.blue} size={28}>ה-Dispatcher מעיר אותו <b>רק כשמגיע הזמן</b></Bullet>
          <Bullet accent={P.purple} size={28}>במקביל WCF משרת לקוחות מ-<b>Thread Pool</b></Bullet>
          <Bullet accent={P.blue2} size={28}>הניקוי לא מפריע לבקשות, ולהפך</Bullet>
        </List>
        <div style={{ marginTop: 22, background: `${P.cyan}12`, border: `1px solid ${P.cyan}33`, borderRadius: 14, padding: '15px 20px', fontSize: 20, color: P.navy, lineHeight: 1.45 }}>
          בנייד אסינכרוני = <code style={{ fontFamily: MONO }}>async/await</code>. בשרת = טיימר + Thread Pool. שתי מטרות שונות.
        </div>
      </div>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 12 — צלילה: למה changes לא static
   ════════════════════════════════════════════════════════════════════════ */
const S12_DeepDive: Page = () => {
  const Col = ({ title, badge, badgeColor, points, good }: { title: string; badge: string; badgeColor: string; points: string[]; good: boolean }) => (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.12)`, borderTop: `4px solid ${badgeColor}`, borderRadius: 18, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 30 }}>{good ? '✅' : '⚠️'}</span>
        <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: badgeColor, direction: 'ltr' }}>{badge}</span>
      </div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 27, color: '#fff' }}>{title}</div>
      <List gap={12}>
        {points.map((p, i) => (
          <Bullet key={i} accent={badgeColor} dark size={23}>{p}</Bullet>
        ))}
      </List>
    </div>
  );
  return (
    <Slide eyebrow="צלילה טכנית" title="הרשימה changes — instance, לא static" accent={P.cyanBright} dark tag="ריבוי-משתמשים" tagColor={P.cyan}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, padding: '13px 22px', marginBottom: 18 }}>
        <span style={{ fontFamily: MONO, fontSize: 22, color: CC.type, direction: 'ltr', flexShrink: 0 }}>{'List<ChangeEntity>'}</span>
        <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.86)' }}>= ישות + <b>delegate</b> שבונה SQL בעתיד — <b>לא</b> מחרוזת SQL · נוצרת מחדש לכל אובייקט DAL</span>
      </div>
      <p style={{ fontSize: 25, color: 'rgba(255,255,255,0.82)', margin: '0 0 18px', maxWidth: 1560 }}>
        השרת רב-משתמשים — WCF מטפל בכמה לקוחות במקביל על Threads שונים. הבחירה ב-instance במקום static מכוונת.
      </p>
      <div style={{ display: 'flex', gap: 26, flex: 1, alignItems: 'stretch' }}>
        <Col
          good={false}
          badge="static"
          badgeColor="#e0833a"
          title="עותק יחיד משותף"
          points={['רשימה אחת לכל ה-DAL בשרת', 'שני לקוחות במקביל → השינויים מתערבבים', 'Clear() של אחד מוחק לשני — Race Condition']}
        />
        <Col
          good
          badge="instance"
          badgeColor={P.cyanBright}
          title="רשימה נפרדת לכל בקשה"
          points={['כל new BooksDB() מקבל רשימה נקייה משלו', 'Service1 יוצר DAL חדש בכל קריאה (stateless)', 'אין משאב משותף → אין מירוץ, אין באג']}
        />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 13 — Workflow: מפת המסע "הוספת ספר"
   ════════════════════════════════════════════════════════════════════════ */
const S13_Journey: Page = () => {
  const Node = ({ t, sub, color, n }: { t: string; sub: string; color: string; n: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: P.white, border: `1px solid ${P.line}`, borderRight: `6px solid ${color}`, borderRadius: 14, padding: '14px 18px', boxShadow: '0 10px 24px rgba(23,45,103,0.06)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 21, color: P.navy, fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>{t}</div>
        <div style={{ fontSize: 18, color: P.muted }}>{sub}</div>
      </div>
    </div>
  );
  return (
    <Slide eyebrow="Workflow אמיתי" title="הוספת ספר — המסע דרך כל השכבות" accent={P.blue} tag="מקצה לקצה" tagColor={P.blue}>
      <p style={{ fontSize: 27, color: P.muted, margin: '0 0 24px', maxWidth: 1560 }}>
        פעולה אחת מדגימה את כל המערכת: מהקלקה בלקוח, דרך הרשת וההרשאות, וכתיבה לשלוש טבלאות כיחידה אחת — ובחזרה.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 40px', flex: 1, alignContent: 'center' }}>
        <Node n="1" t="WPF Client" sub="EditBookWindow — הספרן לוחץ ׳שמירה׳" color={P.blue2} />
        <Node n="2" t="WCF Service" sub="Service1.AddBook — נקודת הכניסה לשרת" color={P.blue} />
        <Node n="3" t="BL · Security" sub="RequireStaff + AuthGuard — בדיקת הרשאה" color={P.purple} />
        <Node n="4" t="DAL · BooksDB" sub="מכניס לתור 3 טבלאות (Delegate)" color={P.cyanBright} />
        <Node n="5" t="BaseDB.SaveChanges" sub="Template Method — חיבור יחיד, פרמטרים" color={P.cyan} />
        <Node n="6" t="חזרה ללקוח" sub="תוצאה → הודעה למשתמש → רענון הטבלה" color={P.blue2} />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 14 — הליבה: DAL + SaveChanges (טרנזקציה)
   ════════════════════════════════════════════════════════════════════════ */
const S14_AddBookCode: Page = () => (
  <Slide eyebrow="הליבה" title="שלוש טבלאות — כתיבה אחת" accent={P.cyanBright} dark tag="ChangeEntity + Delegate" tagColor={P.purple}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.12fr 0.88fr', gap: 32, flex: 1, alignItems: 'center' }}>
      <Code
        title="BooksDB.AddBook  →  BaseDB.SaveChanges"
        fontSize={17.5}
        lines={[
          '// BooksDB: פעולה לוגית אחת = שלוש טבלאות',
          'changes.Add(new ChangeEntity(CreateInsertSQL, book));  // books',
          'foreach (a) baDb.EnqueueInsert(..., changes);  // book_authors',
          'for (copies) copiesDb.EnqueueInsert(..., changes); // book_copies',
          'SaveChanges();   // כולן יחד',
          '',
          '// BaseDB.SaveChanges — Template Method, חיבור יחיד',
          'connection.Open();',
          'foreach (var item in changes) {',
          '    cmd.Parameters.Clear();',
          '    item.CreateSql(item.Entity, cmd);  // הפעלת ה-delegate',
          '    cmd.ExecuteNonQuery();   // פרמטרים -> חסין SQL Injection',
          '}',
        ]}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Box title="Insert / Update / Delete" sub="לא פונים מיד למסד — נכנסים לתור" color={P.cyanBright} dark />
        <Arrow color={P.cyanBright} />
        <Box title="List<ChangeEntity>" sub="ישות + delegate שבונה את ה-SQL" color={P.blue2} dark />
        <Arrow color={P.cyanBright} />
        <Box title="SaveChanges()" sub="לולאה אחת · הכול מצליח או נכשל יחד" color={P.purple} dark />
      </div>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 15 — Workflow משני: התחברות
   ════════════════════════════════════════════════════════════════════════ */
const S15_Login: Page = () => (
  <Slide eyebrow="Workflow משני" title="התחברות — delegate והפרדת שכבות" accent={P.blue2} tag="קושר להצפנה" tagColor={P.purple}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 34, flex: 1, alignItems: 'center' }}>
      <Code
        title="Service1.Login  →  UsersDB.Login"
        fontSize={18}
        lines={[
          '// השירות מעביר את האימות כ-delegate',
          'public AuthResultDto Login(string email, string pw) {',
          '    return new UsersDB().Login(',
          '        email, pw, PasswordHasher.VerifyPassword);',
          '}',
          '',
          '// ה-DAL מאמת בלי לדעת איך מצפינים',
          'var user = SelectByEmail(email);   // שאילתה מפורמטרת',
          'if (user == null ||',
          '    !verifyPassword(pw, user.PasswordHash))',
          '    return Fail("Email or password incorrect");',
          'return BuildAuthResult(user);   // DTO עם תפקידים',
        ]}
      />
      <div>
        <List gap={16}>
          <Bullet accent={P.blue2} size={28}><b>הזרקת delegate</b> — ה-DAL לא מכיר את ה-BL</Bullet>
          <Bullet accent={P.purple} size={28}>אותה הודעת שגיאה לאימייל ולסיסמה (אבטחה)</Bullet>
          <Bullet accent={P.cyan} size={28}>אימות אמיתי ב-<code style={{ fontFamily: MONO }}>VerifyPassword</code> (PBKDF2)</Bullet>
          <Bullet accent={P.blue} size={28}><b>AuthResultDto</b> מרכז משתמש + תפקידים מכמה טבלאות</Bullet>
        </List>
      </div>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 16 — סיכום ורפלקציה
   ════════════════════════════════════════════════════════════════════════ */
const S16_Summary: Page = () => {
  const Item = ({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.12)`, borderRight: `5px solid ${color}`, borderRadius: 14, padding: '16px 20px' }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 25, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.72)', marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  );
  return (
    <Slide eyebrow="סיכום" title="החלטות תכנון — ומה למדתי" accent={P.cyanBright} dark>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, alignContent: 'center' }}>
        <Item icon="🧱" title="הפרדת שכבות" desc="UI / BL / DAL נפרדים — תחזוקה וגמישות" color={P.blue} />
        <Item icon="🔄" title="ניהול שינויים" desc="ChangeEntity — טרנזקציות בחיבור אחד" color={P.cyanBright} />
        <Item icon="🔐" title="אבטחת מידע" desc="PBKDF2 + הגנה מ-SQL Injection" color={P.purple} />
        <Item icon="🖥️" title="ריבוי לקוחות" desc="שרת אחד משרת WPF, Web ו-Mobile" color={P.blue2} />
        <Item icon="🤖" title="נתונים בזמן אמת ל-AI" desc="חיבור נתוני המערכת למודל מקומי" color={P.purple} />
        <Item icon="🗄️" title="מסד מנורמל" desc="17 טבלאות · Lookups · שלמות נתונים" color={P.cyan} />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 17 — תודה / שאלות
   ════════════════════════════════════════════════════════════════════════ */
const S17_Thanks: Page = () => (
  <div
    dir="rtl"
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: darkBg,
      color: '#eaf1ff',
      fontFamily: 'var(--osd-font-body)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 120px',
    }}
  >
    <style>{FONT_CSS}</style>
    <span style={{ position: 'absolute', top: 130, right: 180, width: 160, height: 160, borderRadius: '50%', border: `2px solid ${P.cyanBright}44` }} />
    <span style={{ position: 'absolute', bottom: 120, left: 220, width: 80, height: 80, borderRadius: 18, background: `${P.purple}33`, transform: 'rotate(18deg)' }} />
    <Eyebrow text="תודה רבה" accent={P.cyanBright} dark />
    <h1 style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 900, fontSize: 150, lineHeight: 1.05, margin: '20px 0 12px' }}>שאלות?</h1>
    <p style={{ fontSize: 36, color: 'rgba(255,255,255,0.75)' }}>אשמח להציג כל חלק במערכת ולהדגים אותו בזמן אמת</p>
    <div style={{ marginTop: 40, fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 40 }}>ליאור אבני</div>
    <div style={{ fontFamily: MONO, fontSize: 24, color: P.cyanBright, marginTop: 8, direction: 'ltr' }}>Library Management System</div>
    <Footer dark accent={P.cyanBright} />
  </div>
);

/* ─── transitions ─── */
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 220,
  exit: { duration: 150, easing: EASE_IN, keyframes: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-5px)' }] },
  enter: { duration: 220, delay: 80, easing: EASE_OUT, keyframes: [{ opacity: 0, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }] },
};

const settle: SlideTransition = {
  duration: 280,
  exit: { duration: 160, easing: EASE_IN, keyframes: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }] },
  enter: { duration: 280, delay: 100, easing: EASE_OUT, keyframes: [{ opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }] },
};

S01_Title.transition = settle;
S12_DeepDive.transition = settle;
S13_Journey.transition = settle;
S16_Summary.transition = settle;
S17_Thanks.transition = settle;

export const meta: SlideMeta = {
  title: 'מערכת ניהול ספרייה — פרויקט גמר',
  createdAt: '2026-06-03T14:02:09.981Z',
};

export default [
  S01_Title,
  S02_Architecture,
  S03_Clients,
  S04_Layers,
  S05_Template,
  S06_Data,
  S07_Extensions,
  S08_PBKDF2,
  S09_Ai,
  S10_SqlInjection,
  S11_Timer,
  S12_DeepDive,
  S13_Journey,
  S14_AddBookCode,
  S15_Login,
  S16_Summary,
  S17_Thanks,
] satisfies Page[];
