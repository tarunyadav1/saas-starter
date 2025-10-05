'use client';

import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface VideoCard {
  id: string;
  thumbnail: string;
  title: string;
}

interface CategoryData {
  title: string;
  videos: VideoCard[];
}

const showcaseData: CategoryData[] = [
  {
    title: 'SocialMedia & Creative Content',
    videos: [
      { id: '1', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', title: 'Social Media Video 1' },
      { id: '2', thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', title: 'Social Media Video 2' },
      { id: '3', thumbnail: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=300&fit=crop', title: 'Creative Content 1' },
      { id: '4', thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop', title: 'Creative Content 2' },
    ],
  },
  {
    title: 'Advertising & Corporate Promotion',
    videos: [
      { id: '5', thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop', title: 'Corporate Ad 1' },
      { id: '6', thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop', title: 'Corporate Ad 2' },
      { id: '7', thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', title: 'Promotion Video 1' },
      { id: '8', thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop', title: 'Promotion Video 2' },
    ],
  },
  {
    title: 'Personal Identity & Cloning',
    videos: [
      { id: '9', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', title: 'Personal Avatar 1' },
      { id: '10', thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop', title: 'Personal Avatar 2' },
      { id: '11', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop', title: 'Identity Clone 1' },
      { id: '12', thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop', title: 'Identity Clone 2' },
    ],
  },
  {
    title: 'Education & Training',
    videos: [
      { id: '13', thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop', title: 'Education Video 1' },
      { id: '14', thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', title: 'Education Video 2' },
      { id: '15', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', title: 'Training Module 1' },
      { id: '16', thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop', title: 'Training Module 2' },
    ],
  },
  {
    title: 'E-commerce & Product Marketing',
    videos: [
      { id: '17', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', title: 'Product Demo 1' },
      { id: '18', thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', title: 'Product Demo 2' },
      { id: '19', thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop', title: 'Marketing Video 1' },
      { id: '20', thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop', title: 'Marketing Video 2' },
    ],
  },
  {
    title: 'Affiliate & Partnership Marketing',
    videos: [
      { id: '21', thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop', title: 'Affiliate Video 1' },
      { id: '22', thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop', title: 'Affiliate Video 2' },
      { id: '23', thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop', title: 'Partnership Promo 1' },
      { id: '24', thumbnail: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=300&fit=crop', title: 'Partnership Promo 2' },
    ],
  },
];

export default function VideoShowcase() {
  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Production Video Showcase
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Explore our diverse range of AI-powered video productions across various industries and use cases
          </p>
        </motion.div>

        <div className="space-y-16">
          {showcaseData.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: categoryIndex * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.videos.map((video, videoIndex) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: videoIndex * 0.05,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                      <div className="aspect-[9/16] relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${video.thumbnail})` }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        <div className="absolute top-3 right-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Volume2 className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
                          >
                            <svg
                              className="w-8 h-8 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </motion.div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                  initial={{ width: "0%" }}
                                  whileInView={{ width: "45%" }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  viewport={{ once: true }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-white/80 font-medium">1:24</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <span>View All Productions</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
