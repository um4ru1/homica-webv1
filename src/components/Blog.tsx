import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: '5 Tips Merawat Lansia di Rumah dengan Aman',
      excerpt: 'Panduan lengkap untuk keluarga yang ingin memberikan perawatan terbaik untuk orang tua di rumah.',
      category: 'Elderly Care',
      author: 'Dr. Sarah Ahmad',
      date: '15 Maret 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/flagged/photo-1567318362383-fa193e67bbd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMGNhcmVnaXZlciUyMGZhbWlseXxlbnwxfHx8fDE3NTc1ODY2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Care', 'Health', 'Family']
    },
    {
      id: 2,
      title: 'Perkembangan Bayi 0-12 Bulan: Milestone Penting',
      excerpt: 'Memahami tahapan perkembangan bayi dan cara stimulasi yang tepat untuk mendukung tumbuh kembang optimal.',
      category: 'Child Care',
      author: 'Sari Pediatri',
      date: '12 Maret 2024',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1600563093202-337471bde37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwY2FyZSUyMGNoaWxkY2FyZSUyMG5hbm55fGVufDF8fHx8MTc1NzU4NjYyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Baby', 'Development', 'Parenting']
    },
    {
      id: 3,
      title: 'Cara Membersihkan Rumah yang Efektif dan Ramah Lingkungan',
      excerpt: 'Tips dan trik membersihkan rumah menggunakan produk alami yang aman untuk keluarga dan lingkungan.',
      category: 'House Cleaning',
      author: 'Clean Living Team',
      date: '10 Maret 2024',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGNsZWFuaW5nJTIwc2VydmljZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTc1NjM3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Cleaning', 'Eco-friendly', 'Tips']
    },
    {
      id: 4,
      title: 'Memilih Caregiver yang Tepat: Checklist Lengkap',
      excerpt: 'Panduan memilih caregiver profesional dengan kriteria dan pertanyaan penting yang harus diajukan.',
      category: 'General Care',
      author: 'Homica Team',
      date: '8 Maret 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1622253694238-3b22139576c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwc21pbGluZ3xlbnwxfHx8fDE3NTc1MzUwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Caregiver', 'Selection', 'Guide']
    },
    {
      id: 5,
      title: 'Nutrisi Sehat untuk Lansia: Menu Harian yang Bergizi',
      excerpt: 'Rekomendasi menu makanan sehat dan bergizi yang sesuai untuk kebutuhan nutrisi lansia.',
      category: 'Nutrition',
      author: 'Ahli Gizi Homica',
      date: '5 Maret 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/flagged/photo-1567318362383-fa193e67bbd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMGNhcmVnaXZlciUyMGZhbWlseXxlbnwxfHx8fDE3NTc1ODY2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Nutrition', 'Elderly', 'Health']
    },
    {
      id: 6,
      title: 'Keamanan Anak di Rumah: Checklist Area Berbahaya',
      excerpt: 'Identifikasi dan cara mengatasi area-area berbahaya di rumah untuk menjaga keamanan anak.',
      category: 'Child Safety',
      author: 'Safety Expert',
      date: '3 Maret 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1600563093202-337471bde37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwY2FyZSUyMGNoaWxkY2FyZSUyMG5hbm55fGVufDF8fHx8MTc1NzU4NjYyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Safety', 'Children', 'Prevention']
    }
  ];

  const categories = ['All', 'Elderly Care', 'Child Care', 'House Cleaning', 'General Care'];

  return (
    <section id="blog" className="py-20 bg-white dark:bg-custombg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-customtext">
            Artikel & <span className="text-[#0A74DA]">Edukasi</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Tips, panduan, dan informasi terkini seputar perawatan lansia, 
            pengasuhan anak, dan menjaga kebersihan rumah.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                index === 0
                  ? 'bg-[#0A74DA] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-[#0A74DA] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured Article */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <ImageWithFallback
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#0A74DA] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4 dark:text-customtext2">
                  <span className="bg-[#00BFA6] text-white px-3 py-1 rounded-full text-xs font-medium">
                    {blogPosts[0].category}
                  </span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {blogPosts[0].date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {blogPosts[0].readTime}
                  </div>
                </div>
                <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 mb-4 dark:text-customtext">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed dark:text-customtext2">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-customtext">{blogPosts[0].author}</span>
                  </div>
                  <Button className="bg-[#0A74DA] hover:bg-[#0A74DA]/90 group text-custom-button-text">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#00BFA6] text-white px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3 dark:text-customtext2">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="font-['Poppins'] text-lg font-bold text-gray-900 mb-3 line-clamp-2 dark:text-customtext">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow dark:text-customtext2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 ">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-xs text-gray-600 dark:text-customtext2">{post.author}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#0A74DA] hover:text-[#0A74DA] hover:bg-[#0A74DA]/10 group/btn">
                      Read More
                      <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="border-[#0A74DA] text-[#0A74DA] hover:bg-[#0A74DA] hover:text-white"
          >
            Lihat Artikel Lainnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}