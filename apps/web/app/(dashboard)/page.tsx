import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <header className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Automate Organic Ads that drive traffic to your website
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Like a Gen Z marketing team, but cheaper
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://app.bigmotion.ai/?service=videoAds/">
                <Button size="lg" className="bg-[#D6FD51] hover:bg-[#c5eb40] text-black font-semibold px-8 py-6 text-lg rounded-full">
                  Create viral clips
                </Button>
              </Link>
            </div>
            <div className="mt-12">
              <p className="text-sm text-gray-500 mb-4">Powering top creators on</p>
              <div className="flex justify-center items-center gap-8">
                <span className="text-gray-400 font-semibold">TikTok</span>
                <span className="text-gray-400 font-semibold">YouTube Shorts</span>
                <span className="text-gray-400 font-semibold">Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Industry Examples Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Industry Examples & Video Results
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">iOS app for couples</h3>
              <p className="text-gray-600">
                Flamingo rapidly scaled to $80,000 MRR, generating over 671 million views from 6,535 slideshows within a year.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Ecommerce</h3>
              <p className="text-gray-600">
                WarStory.ai generated $62,000 in affiliate revenue from TikTok Shop with over 30 million views from 300+ AI-generated UGC videos within two weeks.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">SaaS</h3>
              <p className="text-gray-600">
                PoolPlanner.ai literally any niche any business can promote itself using Tiktok Slideshows
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="https://app.bigmotion.ai/?service=videoAds/">
              <Button size="lg" className="bg-[#D6FD51] hover:bg-[#c5eb40] text-black font-semibold px-8 py-4 rounded-full">
                Create viral clips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What can it do?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">AI UGC videos</h3>
              <p className="text-gray-600">
                Create and publish UGC "hook + demo" videos that showcase your product
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Automated Campaigns</h3>
              <p className="text-gray-600">
                Automatically create and auto-publish UGC videos directly to your account
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">AI slideshow generator</h3>
              <p className="text-gray-600">
                Create and publish AI-generated image slideshows for TikTok
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Hook Generator</h3>
              <p className="text-gray-600">
                Automatically generate and save viral hooks for your videos
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">UGC Avatar Generator</h3>
              <p className="text-gray-600">
                Generate custom AI avatars for UGC videos in the "hook + demo" format
              </p>
              <span className="text-sm text-[#D6FD51] font-semibold">Soon</span>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Music Library</h3>
              <p className="text-gray-600">
                Access a wide selection of popular music tracks to enhance your videos
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="https://app.bigmotion.ai/?service=videoAds/">
              <Button size="lg" className="bg-[#D6FD51] hover:bg-[#c5eb40] text-black font-semibold px-8 py-4 rounded-full">
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Two Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Two services for the price of one
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">AI Slideshow</h3>
              <p className="text-gray-600 mb-6">
                Stop spending hours editing videos no one watches. BigMotion's AI Slideshows create instant viral hits —automatically. 
                Just enter your product name and a quick description, and our AI crafts attention-grabbing slideshows that actually convert. 
                It's like having your own creative team, minus the headaches, costs, and delays. Faster, cheaper, and smarter. Guaranteed.
              </p>
              <Link href="https://app.bigmotion.ai/?service=slideshows/">
                <Button className="bg-[#D6FD51] hover:bg-[#c5eb40] text-black font-semibold rounded-full">
                  Try Now
                </Button>
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Organic Ads</h3>
              <p className="text-gray-600 mb-6">
                Paid ads are expensive. BigMotion Organic Ads aren't. Grab attention instantly with short, punchy actor hooks combined 
                seamlessly with powerful product demos. Think of it as having your favorite influencers promoting your product—without 
                the influencer budget. More eyeballs, less spend, real results. Scale effortlessly. This is your unfair advantage.
              </p>
              <Link href="https://app.bigmotion.ai/?service=videoAds/">
                <Button className="bg-[#D6FD51] hover:bg-[#c5eb40] text-black font-semibold rounded-full">
                  Try Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            People Say About<br />Organic Ads Generator
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                Completely forgot about Canva and Figma after finding BigMotion.ai. What used to take me 3 hours per slideshow now takes 5 minutes.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm text-gray-500">E-commerce (Fashion)</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                The auto-posting feature is insane. Set it up once and BigMotion.ai handles everything - 47k app downloads in 3 months while I focused on product development.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Marcus Rodriguez</p>
                  <p className="text-sm text-gray-500">Mobile App (Fitness)</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                Best idea generator I've ever used. No more staring at blank screens wondering what to post. BigMotion.ai gives me endless content concepts.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">David Kim</p>
                  <p className="text-sm text-gray-500">Mobile App (Productivity)</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                Generated 1,200 qualified leads for my coaching program. 23% save rate on posts - the organic approach builds genuine trust.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Jennifer Walsh</p>
                  <p className="text-sm text-gray-500">Lead Generation (Real Estate)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="https://app.bigmotion.ai/?service=videoAds/">
              <Button size="lg" className="bg-[#D6FD51] hover:bg-[#c5eb40] text-black font-semibold px-8 py-4 rounded-full">
                Start Earning Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Crack TikTok without breaking the bank
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">The traditional way</h3>
              <p className="text-gray-600 mb-6">
                Today, acquiring users or customers requires experience, time, and significant investment in personnel and tools.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Marketing Experience</span>
                  <span className="font-semibold">3+ years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Video Editing Experience</span>
                  <span className="font-semibold">3+ years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Staff</span>
                  <span className="font-semibold">$1000+ /month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">UGC Creators</span>
                  <span className="font-semibold">$500+ /month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tools (ChatGPT, CapCut, etc.)</span>
                  <span className="font-semibold">$85+ /month</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold">Total Investment</span>
                    <span className="text-xl font-bold text-red-500">$2000+ /month</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#F0FFD6] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">The BigMotion way</h3>
              <p className="text-gray-700 mb-6">
                With expert AI and marketing insights, you attract more customers while saving time and money.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Marketing Experience</span>
                  <span className="font-semibold">Built into BigMotion</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Video Editing Experience</span>
                  <span className="font-semibold">Built into BigMotion</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">You or a Team Member</span>
                  <span className="font-semibold">Minimal time invest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">UGC Creators</span>
                  <span className="font-semibold">Largest AI UGC Library</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">BigMotion</span>
                  <span className="font-semibold">From $19 /month</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold">Total Investment</span>
                    <span className="text-xl font-bold text-green-500">From $19 /month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Supercharge your socials with AI
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-3xl font-bold mb-6">
                $19<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  10 videos per month
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All 50+ UGC avatars
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Generate unlimited viral hooks
                </li>
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full">
                Get started
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#D6FD51]">
              <h3 className="text-2xl font-bold mb-2">Grow</h3>
              <div className="text-3xl font-bold mb-6">
                $49<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  50 videos per month
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All 50+ UGC avatars
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  AI Slideshow generator
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  100 credits for image generation
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Publish to TikTok, Instagram, Shorts
                </li>
              </ul>
              <Button className="w-full bg-[#D6FD51] hover:bg-[#c5eb40] text-black font-semibold rounded-full">
                Get started
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Scale</h3>
              <div className="text-3xl font-bold mb-6">
                $95<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  150 videos per month
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All 50+ UGC avatars
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  AI Slideshow generator
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  300 credits for image generation
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Schedule/automate videos
                </li>
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-semibold text-lg cursor-pointer">How do I start making a TikTok page?</summary>
              <p className="mt-4 text-gray-600">
                Look, this isn't rocket science, but most people still mess it up. Here's the exact playbook: Create your TikTok account, 
                then warm it up by scrolling and engaging with posts on your FYP for 20-30 minutes daily. Do this for 3-5 days and DO NOT 
                post during this time - I don't care how eager you are.
              </p>
            </details>
            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-semibold text-lg cursor-pointer">Why should I do the slideshow format?</summary>
              <p className="mt-4 text-gray-600">
                Slideshows are the easiest to automate and scale while still being highly engaging. People love saving valuable information, 
                and slideshows are perfect for that. Plus, you can create AI slideshows that people will love and engage with without them 
                ever knowing it's made with AI. Maximum engagement, minimum effort.
              </p>
            </details>
            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-semibold text-lg cursor-pointer">Can I post these videos to other platforms?</summary>
              <p className="mt-4 text-gray-600">
                Yes, and you should. Don't limit yourself to TikTok - repurpose your BigMotion.ai slideshows across Instagram, LinkedIn, 
                YouTube Shorts, and anywhere else that accepts image carousels. Maximum leverage from minimum effort. The same content 
                that works on TikTok will work everywhere else.
              </p>
            </details>
            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-semibold text-lg cursor-pointer">Would slideshows work for a Shopify app?</summary>
              <p className="mt-4 text-gray-600">
                Hell yes. Here's how: "0 to $10k in 30 days (here's my Shopify stack)" and share 5 tools including your app. 
                Or "3 hard truths I learned growing a $10k MRR Shopify store" where one slide discusses a problem your app solves. 
                The key is forming your hook as a list where each slide is a bullet point.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4">BigMotion</h3>
              <p className="text-gray-400">
                Making a video has never been so easy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Popular Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tools/ai-image-to-video" className="hover:text-white">Image to Video AI</Link></li>
                <li><Link href="/tools/ai-ugc-video-generator" className="hover:text-white">AI UGC Video Generator</Link></li>
                <li><Link href="/tools/ai-script-to-video-generator" className="hover:text-white">Script to Video AI</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="https://discord.com/invite/9GDVWBfjtd" className="hover:text-white">Discord Community</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 BigMotion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}