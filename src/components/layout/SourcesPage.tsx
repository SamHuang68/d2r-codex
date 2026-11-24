import React from 'react';
import { Scale, Database, Image as ImageIcon, Music } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PageHeader } from '../common/PageHeader';
import { getAboutHeader, getAboutSections, type AboutSectionData } from '../../data/aboutCopy';

const SECTION_ICON: Record<AboutSectionData['id'], React.ReactNode> = {
  unofficial: <Scale className="w-5 h-5" />,
  data: <Database className="w-5 h-5" />,
  images: <ImageIcon className="w-5 h-5" />,
  original: <Music className="w-5 h-5" />,
};

/** 資料來源與版權聲明：本站是非官方的玩家整理，圖片與遊戲內容的權利屬於原權利人 */
export const SourcesPage: React.FC = () => {
  const { lang } = useLanguage();
  const header = getAboutHeader(lang);
  const sections = getAboutSections(lang);

  const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <section className="rounded-2xl border border-sanctuary-800 bg-sanctuary-950/70 p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-diablo text-lg font-bold text-d2-unique mb-3">{icon}<span>{title}</span></h2>
      <div className="space-y-2.5 text-sm leading-relaxed text-sanctuary-300">{children}</div>
    </section>
  );

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
      <PageHeader
        icon={<Scale className="w-6 h-6" />}
        title={header.title}
        desc={header.desc}
      />

      {sections.map((sec) => (
        <Section key={sec.id} icon={SECTION_ICON[sec.id]} title={sec.title}>
          {sec.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Section>
      ))}

      <p className="text-xs text-sanctuary-500">{header.footerNote}</p>
    </div>
  );
};
