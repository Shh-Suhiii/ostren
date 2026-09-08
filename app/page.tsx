import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";

import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import NewArrivals from "@/components/home/NewArrivals";
import OstrinEdit from "@/components/home/OstrenEdit";
import BestSellers from "@/components/home/BestSellers";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";

import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-white text-[#111111]">
      <AnnouncementBar />
      <Navbar />

      <Hero />

      <CategoryShowcase />

      <NewArrivals />

      <OstrinEdit />

      <BestSellers />

      <BrandStory />

      <Newsletter />

      <Footer />
    </main>
  );
}