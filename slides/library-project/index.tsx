import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

/* ──────────────────────────────────────────────────────────────────────────
   מערכת ניהול ספרייה — מצגת רקע לראיון בחינת פרויקט גמר 5 יח״ל
   ליאור אבני · הנדסת תוכנה וסייבר

   מצגת רקע אווירתית בלבד:
   · רקע אחיד — אותו כחול כהה בכל השקופיות (כמו שקופית השער).
   · בעיקר כותרות ומעט טקסט — בלי קוד כלל.
   · עוקבת אחרי סדר הדיבור: פתיחה ← הדגמה ← הסבר על הקוד וההרחבות ← Workflow ← סיכום.
   כל המצגת RTL.
   ────────────────────────────────────────────────────────────────────────── */

export const design: DesignSystem = {
  palette: { bg: '#0e1b3d', text: '#eaf1ff', accent: '#22ddd2' },
  fonts: {
    display: '"Rubik", "Segoe UI", "Arial", sans-serif',
    body: '"Heebo", "Segoe UI", "Arial", sans-serif',
  },
  typeScale: { hero: 138, body: 34 },
  radius: 20,
};

/* ─── palette ─── */
const P = {
  navy: '#172d67',
  navyDeep: '#0e1b3d',
  blue: '#2e73ea',
  blue2: '#4b7afe',
  cyan: '#0fb5ab',
  cyanBright: '#22ddd2',
  purple: '#8c15e9',
  purpleBright: '#b06bff',
  white: '#ffffff',
  muted: '#8ea2cc',
};

const MONO = '"JetBrains Mono", "Consolas", "SF Mono", ui-monospace, monospace';

const FONT_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&family=Rubik:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');";

/* ─── רקע כהה אחיד לכל השקופיות ─── */
const darkBg = `radial-gradient(1200px 760px at 86% -12%, ${P.blue}40, transparent 58%), radial-gradient(1000px 680px at -6% 112%, ${P.purple}3a, transparent 55%), ${P.navyDeep}`;

/* ─── shared bits ─── */

const Eyebrow = ({ text, accent = P.cyanBright }: { text: string; accent?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 36, height: 5, borderRadius: 3, background: accent, boxShadow: `0 0 16px ${accent}66` }} />
    <span style={{ fontFamily: MONO, fontSize: 21, letterSpacing: '0.03em', fontWeight: 600, color: 'rgba(255,255,255,0.72)' }}>
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

const Footer = ({ accent = P.cyanBright }: { accent?: string }) => {
  const { current, total } = useSlidePageNumber();
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
        color: 'rgba(255,255,255,0.5)',
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

type SlideProps = {
  eyebrow?: string;
  title?: string;
  accent?: string;
  tag?: string;
  tagColor?: string;
  children: ReactNode;
};

const Slide = ({ eyebrow, title, accent = P.cyanBright, tag, tagColor, children }: SlideProps) => (
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
      padding: '74px 104px 96px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <style>{FONT_CSS}</style>
    {(eyebrow || title || tag) && (
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 28, marginBottom: 34 }}>
        <div>
          {eyebrow && <Eyebrow text={eyebrow} accent={accent} />}
          {title && (
            <h1 style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 58, lineHeight: 1.08, margin: '14px 0 0', color: '#f3f7ff' }}>
              {title}
            </h1>
          )}
        </div>
        {tag && <Tag text={tag} color={tagColor || P.purple} />}
      </header>
    )}
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
    <Footer accent={accent} />
  </div>
);

const List = ({ children, gap = 24 }: { children: ReactNode; gap?: number }) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap }}>{children}</ul>
);

const Bullet = ({ children, accent = P.cyanBright, size = 34 }: { children: ReactNode; accent?: string; size?: number }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 16, fontSize: size, lineHeight: 1.42, color: '#dce6fb' }}>
    <span style={{ flexShrink: 0, marginTop: size * 0.42, width: 12, height: 12, borderRadius: 3, background: accent, transform: 'rotate(45deg)', boxShadow: `0 0 12px ${accent}66` }} />
    <span>{children}</span>
  </li>
);

/* dark translucent card */
const Panel = ({ children, accent, style }: { children: ReactNode; accent?: string; style?: CSSProperties }) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20,
      padding: 28,
      ...(accent ? { borderTop: `4px solid ${accent}` } : null),
      ...style,
    }}
  >
    {children}
  </div>
);

/* flow box used in diagrams */
const Box = ({ title, sub, color = P.blue, style }: { title: string; sub?: string; color?: string; style?: CSSProperties }) => (
  <div
    style={{
      borderRadius: 16,
      padding: '18px 22px',
      background: 'rgba(255,255,255,0.06)',
      border: `2px solid ${color}`,
      boxShadow: `0 14px 32px ${color}22`,
      textAlign: 'center',
      ...style,
    }}
  >
    <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 26, color: '#fff' }}>{title}</div>
    {sub && <div style={{ fontSize: 19, color: 'rgba(255,255,255,0.66)', marginTop: 5, lineHeight: 1.35 }}>{sub}</div>}
  </div>
);

const Arrow = ({ dir = 'down', color = P.cyanBright }: { dir?: 'down' | 'left'; color?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color, fontSize: 34, fontWeight: 700, lineHeight: 1, flexShrink: 0 }}>
    {dir === 'down' ? '↓' : '←'}
  </div>
);

const Stat = ({ value, label, color = P.cyanBright }: { value: string; label: string; color?: string }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 900, fontSize: 66, lineHeight: 1, color }}>{value}</div>
    <div style={{ fontSize: 22, marginTop: 8, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
  </div>
);

/* row with right-colored border (used for layers / extensions / nodes) */
const Row = ({ children, color, style }: { children: ReactNode; color: string; style?: CSSProperties }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRight: `6px solid ${color}`,
      borderRadius: 13,
      padding: '13px 18px',
      ...style,
    }}
  >
    {children}
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
    <Eyebrow text="פרויקט גמר · 5 יח״ל" accent={P.cyanBright} />
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
            color: [P.blue2, P.cyanBright, P.purpleBright][i],
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
   SLIDE 2 — פתיחה: שרת–לקוח · WCF
   ════════════════════════════════════════════════════════════════════════ */
const S02_Architecture: Page = () => {
  const ClientPill = ({ t, color }: { t: string; color: string }) => (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}`, borderRadius: 14, padding: '16px 8px', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 26, fontFamily: 'var(--osd-font-display)' }}>{t}</div>
  );
  return (
    <Slide eyebrow="פתיחה · ארכיטקטורה" title="שרת מרכזי אחד · שלושה לקוחות" accent={P.blue}>
      <p style={{ fontSize: 30, lineHeight: 1.45, color: 'rgba(255,255,255,0.85)', margin: '0 0 30px', maxWidth: 1600 }}>
        שלושה לקוחות מדברים עם <b>שירות WCF אחד</b>. כל הלוגיקה והאבטחה בשרת — אף לקוח לא ניגש למסד הנתונים ישירות.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flex: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 18, width: '100%', maxWidth: 1100 }}>
          <ClientPill t="לקוח WPF" color={P.blue2} />
          <ClientPill t="אתר Blazor" color={P.cyanBright} />
          <ClientPill t="אפליקציית MAUI" color={P.purpleBright} />
        </div>
        <Arrow />
        <Box title="שירות WCF" sub="IService1 — החוזה היחיד מול הלקוחות" color={P.blue} style={{ width: '100%', maxWidth: 760 }} />
        <Arrow />
        <Box title="שרת — BL · DAL · Model" sub="לוגיקה, אבטחה וגישה לנתונים במקום אחד" color={P.purple} style={{ width: '100%', maxWidth: 760 }} />
        <Arrow />
        <Box title="מסד נתונים (Access)" sub="ADO.NET · OleDb" color={P.cyan} style={{ width: '100%', maxWidth: 760 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 80, marginTop: 'auto', paddingTop: 24 }}>
        <Stat value="3" label="סוגי משתמשים" color={P.blue2} />
        <Stat value="3" label="לקוחות" color={P.cyanBright} />
        <Stat value="9" label="הרחבות מתקדמות" color={P.purpleBright} />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 3 — הדגמה: שלוש פלטפורמות
   ════════════════════════════════════════════════════════════════════════ */
const S03_Clients: Page = () => {
  const ClientCard = ({ icon, name, who, shows, color }: { icon: string; name: string; who: string; shows: ReactNode; color: string }) => (
    <Panel accent={color} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: '34px 30px' }}>
      <div style={{ width: 74, height: 74, borderRadius: 18, background: `${color}26`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 34, color: '#fff' }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 20, color }}>{who}</div>
      <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.75)', lineHeight: 1.45 }}>{shows}</div>
    </Panel>
  );
  return (
    <Slide eyebrow="הדגמה · ריבוי פלטפורמות" title="אותה מערכת — שלוש פלטפורמות" accent={P.cyan}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', flex: 1 }}>
        <ClientCard icon="🖥️" name="לקוח WPF" who="לספרנים, מנהלים, ומנויים" shows={<>מנהלה: ניהול קטלוג, עותקים, השאלות, קנסות, משתמשים ודוחות<br />חבר: צפייה בספרים, השאלה, הזמנה, ותשלום קנס<br />בנוסף, לכל משתמש יש עוזר AI אישי</>} color={P.blue2} />
        <ClientCard icon="🌐" name="אתר Blazor" who="למנויים · בדפדפן" shows="דשבורד אישי — השאלות, הזמנות וקנסות מכל מחשב (צפייה בלבד)" color={P.cyanBright} />
        <ClientCard icon="📱" name="אפליקציית MAUI" who="למנויים · במובייל" shows="דשבורד אישי — השאלות, הזמנות וקנסות מכל טלפון (צפייה בלבד)" color={P.purpleBright} />
      </div>
      <div style={{ textAlign: 'center', fontSize: 27, color: 'rgba(255,255,255,0.82)', marginTop: 26 }}>
        שלושתם מדברים עם <b>אותו שירות WCF</b> — לוגיקה אחת, מסד אחד, אבטחה אחת.
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 4 — חמש השכבות
   ════════════════════════════════════════════════════════════════════════ */
const S04_Layers: Page = () => {
  const L = ({ n, name, desc, color }: { n: string; name: string; desc: string; color: string }) => (
    <Row color={color}>
      <div style={{ width: 44, height: 44, borderRadius: 11, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>{n}</div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 23, color: '#fff', minWidth: 160, direction: 'ltr', textAlign: 'right' }}>{name}</div>
      <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.72)', flex: 1 }}>{desc}</div>
    </Row>
  );
  const FlowPill = ({ t, color }: { t: string; color: string }) => (
    <span style={{ fontFamily: MONO, fontSize: 21, fontWeight: 600, color: '#fff', background: color, padding: '9px 16px', borderRadius: 10, direction: 'ltr' }}>{t}</span>
  );
  return (
    <Slide eyebrow="הסבר על הקוד · השכבות" title="חמש שכבות בשרת — כל אחת ותפקידה" accent={P.purple}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
        <L n="1" name="Model" desc="ישויות (=טבלאות), אוספים (lists), DTO ו-Enums" color={P.cyanBright} />
        <L n="2" name="DAL" desc="השכבה היחידה שמכירה SQL · מחלקה לכל טבלה · ירושה מ-BaseDB" color={P.blue2} />
        <L n="3" name="BL" desc="לוגיקה בלבד: הצפנת סיסמאות · הרשאות · בניית ההקשר ל-AI" color={P.purpleBright} />
        <L n="4" name="WCF Service" desc="הקשר בין הלקוח לשרת" color={P.blue} />
        <L n="5" name="Host" desc="מריץ את השירות + טיימר רקע לניקוי הזמנות שפג תוקפן" color={P.cyan} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 22, direction: 'ltr' }}>
        <FlowPill t="Client" color={P.blue2} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="WCF" color={P.blue} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="BL" color={P.purple} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="DAL" color={P.purpleBright} />
        <span style={{ color: P.muted, fontSize: 24 }}>→</span>
        <FlowPill t="DB" color={P.cyan} />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 5 — מסד הנתונים
   ════════════════════════════════════════════════════════════════════════ */
const S05_Data: Page = () => {
  const Mini = ({ title, sub, color }: { title: string; sub: ReactNode; color: string }) => (
    <Panel accent={color} style={{ flex: 1, padding: '24px 26px' }}>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 28, color: '#fff' }}>{title}</div>
      <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.72)', marginTop: 10, lineHeight: 1.4 }}>{sub}</div>
    </Panel>
  );
  return (
    <Slide eyebrow="הסבר על הקוד · נתונים" title="מסד הנתונים (הdatabase)" accent={P.cyan}>
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        <Mini title="17 טבלאות" sub="15 נתונים + 2 טבלאות קשר רבים-לרבים" color={P.blue2} />
        <Mini title="Lookups ↔ Enums" sub="קודי סטטוס/תפקיד מסונכרנים עם Enums בקוד" color={P.purpleBright} />
        <Mini title="DTO" sub={<>נושא בדיוק מה שהלקוח צריך — בלי שדות רגישים<br />(לא נמצא ב-Access כמובן)</>} color={P.cyanBright} />
      </div>
      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        <Panel accent={P.blue2} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 27, color: '#fff', marginBottom: 16 }}>נרמול ושלמות נתונים</div>
          <List gap={14}>
            <Bullet accent={P.blue2} size={25}>טבלאות נתונים המכילות את כל המידע</Bullet>
            <Bullet accent={P.blue} size={25}>{'טבלאות קשר רבים-לרבים '}</Bullet>
            <Bullet accent={P.cyan} size={25}>טבלאות Lookup לסטטוסים, תנאים ותפקידים</Bullet>
          </List>
        </Panel>
        <Panel accent={P.purpleBright} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 27, color: '#fff', marginBottom: 16 }}>הפרדת שכבות</div>
          <p style={{ fontSize: 26, lineHeight: 1.5, color: 'rgba(255,255,255,0.82)', margin: 0 }}>
            ה-DAL <b>לא מכיר</b> את ה-BL. למשל אינו יודע להצפין סיסמה — הוא מקבל זאת מבחוץ. כך השכבות נשארות עצמאיות.
          </p>
        </Panel>
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 6 — מנגנון ה-changes / SaveChanges (בלי קוד)
   ════════════════════════════════════════════════════════════════════════ */
const S06_Changes: Page = () => (
  <Slide eyebrow="הסבר על הקוד · ליבה" title="מנגנון ה-changes — כתיבה אחת לכמה טבלאות" accent={P.cyanBright}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, flex: 1, justifyContent: 'center' }}>
      <Box title="Insert · Select · Update · Delete" sub="לא פונים מיד למסד — נכנסים לתור" color={P.cyanBright} style={{ width: '100%', maxWidth: 900 }} />
      <Arrow />
      <Box title="תור ה-changes" sub="כל פריט = ישות + delegate שיבנה את ה-SQL בעתיד" color={P.blue2} style={{ width: '100%', maxWidth: 900 }} />
      <Arrow />
      <Box title="SaveChanges()" sub="חיבור אחד · טרנזקציה · כל הטבלאות יחד — הכול או כלום" color={P.purpleBright} style={{ width: '100%', maxWidth: 900 }} />
    </div>
    <div style={{ display: 'flex', gap: 20, marginTop: 18 }}>
      <Panel accent={P.cyan} style={{ flex: 1, padding: '18px 24px' }}>
        <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
          <b>פעולה רב-טבלאית</b> — הוספת ספר כותבת ל-3 טבלאות (books · authors · copies) כיחידה אחת.
        </div>
      </Panel>
      <Panel accent={P.blue} style={{ flex: 1, padding: '18px 24px' }}>
        <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
          <b>instance ולא static</b> — לכל בקשה רשימה נפרדת, בידוד מלא בין לקוחות במקביל (מניעת Race Condition).
        </div>
      </Panel>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 7 — ההרחבות (סעיף 9 + 10)
   ════════════════════════════════════════════════════════════════════════ */
const S07_Extensions: Page = () => {
  const Ext = ({ icon, name, color, star }: { icon: string; name: string; color: string; star?: boolean }) => (
    <Row color={color} style={{ padding: '12px 16px' }}>
      <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 23, fontWeight: 600, color: '#fff', lineHeight: 1.2, flex: 1 }}>{name}</span>
      {star && <span style={{ fontSize: 21 }}>⭐</span>}
    </Row>
  );
  return (
    <Slide eyebrow="הסבר על הקוד · ההרחבות" title="תשע הרחבות מתקדמות" accent={P.purple}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Tag text="סעיף 9" color={P.purple} />
            <span style={{ fontSize: 21, color: 'rgba(255,255,255,0.6)' }}>חמש הרחבות</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Ext icon="🧬" name="ירושה ממחלקות שכתבתי" color={P.blue2} />
            <Ext icon="🔗" name="שימוש מתקדם ב-Delegate" color={P.blue} />
            <Ext icon="🔐" name="הצפנת סיסמאות — PBKDF2" color={P.purpleBright} star />
            <Ext icon="🧩" name="שימוש ב-UserControl" color={P.cyan} />
            <Ext icon="🤖" name="שימוש בבינה מלאכותית" color={P.purpleBright} star />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Tag text="סעיף 10" color={P.cyan} />
            <span style={{ fontSize: 21, color: 'rgba(255,255,255,0.6)' }}>ארבע הרחבות</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Ext icon="🛡️" name="הגנה מ-SQL Injection" color={P.blue} star />
            <Ext icon="⏱️" name="קוד אסינכרוני — טיימר רקע" color={P.purpleBright} star />
            <Ext icon="🔄" name="Value Converter" color={P.cyan} />
            <Ext icon="📱" name="עבודה אסינכרונית בנייד" color={P.blue2} />
          </div>
        </div>
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 8 — הרחבה: הצפנת PBKDF2 (בלי קוד)
   ════════════════════════════════════════════════════════════════════════ */
const S08_PBKDF2: Page = () => {
  const Chip = ({ t, color }: { t: string; color: string }) => (
    <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}`, borderRadius: 14, padding: '16px 8px' }}>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 30, color: '#fff' }}>{t.split('|')[0]}</div>
      <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.62)', marginTop: 4 }}>{t.split('|')[1]}</div>
    </div>
  );
  return (
    <Slide eyebrow="הרחבה · אבטחה" title="הצפנת סיסמאות — PBKDF2" accent={P.purpleBright}>
      <div style={{ display: 'flex', gap: 18, marginBottom: 26 }}>
        <Chip t="Salt 128-bit|נגד Rainbow Tables" color={P.purpleBright} />
        <Chip t="100,000|איטרציות · נגד Brute Force" color={P.blue} />
        <Chip t="מפתח 256-bit|רמת אבטחה גבוהה" color={P.cyan} />
        <Chip t="FixedTimeEquals|נגד Timing Attacks" color={P.blue2} />
      </div>
      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        <Panel accent={P.purpleBright} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <List gap={16}>
            <Bullet accent={P.purpleBright} size={28}><b>גיבוב חד-כיווני</b> — אי אפשר לשחזר את הסיסמה ממנו</Bullet>
            <Bullet accent={P.blue} size={28}>Salt אקראי לכל משתמש — אותה סיסמה נראית שונה</Bullet>
            <Bullet accent={P.cyan} size={28}>איטרציות רבות מאיטות בכוונה כל ניסיון פיצוח</Bullet>
          </List>
        </Panel>
        <Panel accent={P.blue} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 28, lineHeight: 1.5, color: 'rgba(255,255,255,0.88)' }}>
            הסיסמה המקורית <b>לעולם</b> לא נשמרת. ה-Service מצפין — וה-DAL מקבל גיבוב מוכן בלבד.
          </div>
        </Panel>
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 9 — הרחבה: עוזר ה-AI (flow נקי בשורה אחת)
   ════════════════════════════════════════════════════════════════════════ */
const S09_Ai: Page = () => {
  const Step = ({ n, title, sub, color }: { n: string; title: string; sub: string; color: string }) => (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}`, borderRadius: 18, padding: '22px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 22 }}>{n}</div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 26, color: '#fff', lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 19, color: 'rgba(255,255,255,0.66)', lineHeight: 1.35 }}>{sub}</div>
    </div>
  );
  return (
    <Slide eyebrow="הרחבה · בינה מלאכותית" title="עוזר ספרייה חכם — מודל מקומי" accent={P.purpleBright}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, flex: 1 }}>
        <Step n="1" title="שאלת המשתמש" sub="צ׳אט בתוך הלקוח" color={P.cyanBright} />
        <Arrow dir="left" />
        <Step n="2" title="השרת בונה הקשר" sub="נתוני המנוי + הקטלוג → System Prompt" color={P.blue} />
        <Arrow dir="left" />
        <Step n="3" title="מודל מקומי" sub="Ollama · Gemma דרך HTTP" color={P.purpleBright} />
        <Arrow dir="left" />
        <Step n="4" title="תשובה למשתמש" sub="חוזרת דרך WCF · היסטוריה לכל סשן" color={P.cyan} />
      </div>
      <div style={{ textAlign: 'center', fontSize: 26, color: 'rgba(255,255,255,0.82)', marginTop: 26 }}>
        מקומי = <b>פרטיות</b> · בלי תלות באינטרנט · בלי עלות API
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 10 — הרחבה: הגנה מ-SQL Injection (בלי קוד)
   ════════════════════════════════════════════════════════════════════════ */
const S10_SqlInjection: Page = () => (
  <Slide eyebrow="הרחבה · אבטחה" title="הגנה מפני SQL Injection" accent={P.blue}>
    <div style={{ display: 'flex', gap: 20, marginBottom: 26 }}>
      <Panel style={{ flex: 1, borderTop: `4px solid #e0556a` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 26 }}>❌</span>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 26, color: '#ff8a98' }}>שרשור קלט לשאילתה</span>
        </div>
        <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>תוקף יכול להזריק טקסט שמשנה את משמעות השאילתה — ולעקוף את ההתחברות.</div>
      </Panel>
      <Panel style={{ flex: 1, borderTop: `4px solid ${P.cyanBright}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 26 }}>✅</span>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 26, color: P.cyanBright }}>שאילתה מפורמטרת</span>
        </div>
        <div style={{ fontSize: 23, color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>הערך נשלח <b>בנפרד</b> כפרמטר — ה-Driver מתייחס אליו כדאטה בלבד, אף פעם לא כקוד.</div>
      </Panel>
    </div>
    <Panel accent={P.purpleBright} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <List gap={16}>
        <Bullet accent={P.blue} size={29}>כל הערכים עוברים כפרמטרים — לעולם לא מושרשרים לתוך ה-SQL</Bullet>
        <Bullet accent={P.purpleBright} size={29}>בונוס: אימות טיפוסים מובנה (מספר / תאריך)</Bullet>
      </List>
    </Panel>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 11 — הרחבה: קוד אסינכרוני (טיימר) — בלי קוד
   ════════════════════════════════════════════════════════════════════════ */
const S11_Async: Page = () => (
  <Slide eyebrow="הרחבה · קוד אסינכרוני" title="טיימר רקע בשרת — בלי לחסום" accent={P.cyan}>
    <div style={{ display: 'flex', gap: 20, flex: 1 }}>
      <Panel accent={P.cyan} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 30, color: '#fff', marginBottom: 20 }}>הטיימר בשרת</div>
        <List gap={20}>
          <Bullet accent={P.cyan} size={30}>מתעורר <b>כל שעה עגולה</b> ומנקה הזמנות שפג תוקפן</Bullet>
          <Bullet accent={P.blue} size={30}>לא תופס Thread בזמן ההמתנה</Bullet>
          <Bullet accent={P.purpleBright} size={30}>במקביל, WCF משרת לקוחות מ-Thread Pool</Bullet>
        </List>
      </Panel>
    </div>
  </Slide>
);

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 12 — Workflow: "הוספת ספר" מקצה לקצה
   ════════════════════════════════════════════════════════════════════════ */
const S12_Journey: Page = () => {
  const Node = ({ t, sub, color, n }: { t: string; sub: string; color: string; n: string }) => (
    <Row color={color} style={{ padding: '14px 18px' }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 21, flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: '#fff', fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>{t}</div>
        <div style={{ fontSize: 19, color: 'rgba(255,255,255,0.66)' }}>{sub}</div>
      </div>
    </Row>
  );
  return (
    <Slide eyebrow="Workflow מלא" title="הוספת ספר — המסע דרך כל השכבות" accent={P.blue}>
      <p style={{ fontSize: 27, color: 'rgba(255,255,255,0.8)', margin: '0 0 26px', maxWidth: 1600 }}>
        פעולה אחת מדגימה את כל המערכת: מהקלקה בלקוח, דרך הרשת וההרשאות, וכתיבה לשלוש טבלאות כיחידה אחת — ובחזרה.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 40px', flex: 1, alignContent: 'center' }}>
        <Node n="1" t="WPF Client" sub="הספרן ממלא טופס ולוחץ ׳שמירה׳" color={P.blue2} />
        <Node n="2" t="WCF Service" sub="נקודת הכניסה לשרת" color={P.blue} />
        <Node n="3" t="BL · Security" sub="בדיקת הרשאה — צוות פעיל בלבד" color={P.purpleBright} />
        <Node n="4" t="DAL · BooksDB" sub="מכניס לתור 3 טבלאות (Delegate)" color={P.cyanBright} />
        <Node n="5" t="SaveChanges" sub="חיבור יחיד · טרנזקציה · פרמטרים" color={P.cyan} />
        <Node n="6" t="חזרה ללקוח" sub="תוצאה → הודעה → רענון הטבלה" color={P.blue2} />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 13 — סיכום
   ════════════════════════════════════════════════════════════════════════ */
const S13_Summary: Page = () => {
  const Item = ({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) => (
    <Row color={color} style={{ alignItems: 'flex-start', padding: '16px 20px' }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 26, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 21, color: 'rgba(255,255,255,0.72)', marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </Row>
  );
  return (
    <Slide eyebrow="סיכום" title="החלטות תכנון — ומה למדתי" accent={P.cyanBright}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, alignContent: 'center' }}>
        <Item icon="🧱" title="הפרדת שכבות" desc="UI / BL / DAL נפרדים — תחזוקה וגמישות" color={P.blue} />
        <Item icon="🔄" title="ניהול שינויים" desc="changes + טרנזקציה בחיבור אחד" color={P.cyanBright} />
        <Item icon="🔐" title="אבטחת מידע" desc="PBKDF2 + הגנה מ-SQL Injection" color={P.purpleBright} />
        <Item icon="🖥️" title="ריבוי לקוחות" desc="שרת אחד משרת WPF, Web ו-Mobile" color={P.blue2} />
        <Item icon="🤖" title="נתונים בזמן אמת ל-AI" desc="חיבור נתוני המערכת למודל מקומי" color={P.purple} />
        <Item icon="🗄️" title="מסד מנורמל" desc="17 טבלאות · Lookups · שלמות נתונים" color={P.cyan} />
      </div>
    </Slide>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 14 — תודה
   ════════════════════════════════════════════════════════════════════════ */
const S14_Thanks: Page = () => (
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
    <Eyebrow text="סוף" accent={P.cyanBright} />
    <h1 style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 900, fontSize: 160, lineHeight: 1.05, margin: '20px 0 12px' }}>תודה רבה</h1>
    <div style={{ marginTop: 30, fontFamily: 'var(--osd-font-display)', fontWeight: 800, fontSize: 44 }}>ליאור אבני</div>
    <div style={{ fontFamily: MONO, fontSize: 24, color: P.cyanBright, marginTop: 8, direction: 'ltr' }}>Library Management System</div>
    <Footer accent={P.cyanBright} />
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
S06_Changes.transition = settle;
S12_Journey.transition = settle;
S13_Summary.transition = settle;
S14_Thanks.transition = settle;

export const meta: SlideMeta = {
  title: 'מערכת ניהול ספרייה — פרויקט גמר',
  createdAt: '2026-06-03T14:02:09.981Z',
};

export default [
  S01_Title,
  S02_Architecture,
  S03_Clients,
  S04_Layers,
  S05_Data,
  S06_Changes,
  S07_Extensions,
  S08_PBKDF2,
  S10_SqlInjection,
  S11_Async,
  S09_Ai,
  S12_Journey,
  S13_Summary,
  S14_Thanks,
] satisfies Page[];
