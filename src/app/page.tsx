import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { AchievementsSection } from "@/components/achievements/AchievementsSection";
import { ContactSection } from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <div className="divider" aria-hidden="true" />
        <AboutSection />
        <div className="divider" aria-hidden="true" />
        <SkillsSection />
        <div className="divider" aria-hidden="true" />
        <ProjectsSection />
        <div className="divider" aria-hidden="true" />
        <ExperienceSection />
        <div className="divider" aria-hidden="true" />
        <AchievementsSection />
        <div className="divider" aria-hidden="true" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
