import { HeroVideo } from "@/components/sections/HeroVideo";
import { FiveElementsZodiac } from "@/components/sections/FiveElementsZodiac";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { Journal } from "@/components/sections/Journal";
import { DailyFortune } from "@/components/sections/DailyFortune";
import { LineageStory } from "@/components/sections/LineageStory";
import { FaqSection } from "@/components/sections/FaqSection";
import { Newsletter } from "@/components/sections/Newsletter";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <DailyFortune />
      <FiveElementsZodiac />
      <HowItWorks />
      <ProductsShowcase />
      <Testimonials />
      <Journal />
      <LineageStory />
      <CtaBanner />
      <FaqSection />
      <Newsletter />
    </>
  );
}
