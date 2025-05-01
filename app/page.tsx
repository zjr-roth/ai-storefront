import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
	return (
		<div className="min-h-screen bg-white">
			<Header />
			<main>
				<HeroSection />
				<FeaturesSection />
				<TestimonialsSection />
				<PricingSection />
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
