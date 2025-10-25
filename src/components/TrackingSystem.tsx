import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Bell, 
  Star, 
  CheckCircle,
  Navigation,
  Shield,
  Eye,
  Smartphone
} from 'lucide-react';

export function TrackingSystem() {
  const trackingFeatures = [
    {
      icon: MapPin,
      title: 'GPS Real-Time',
      description: 'Pantau posisi pekerja secara real-time dari berangkat hingga selesai bekerja',
      color: 'from-blue-500 to-blue-600',
      benefits: ['Live location tracking', 'Route optimization', 'Arrival notifications'],
      textcolor: 'text-blue-400',
    },
    {
      icon: Clock,
      title: 'Check-in & Check-out',
      description: 'Absensi digital otomatis dengan notifikasi langsung ke konsumen',
      color: 'from-green-500 to-green-600',
      benefits: ['Automatic attendance', 'Time tracking', 'Work duration logs'],
      textcolor: 'text-green-400',
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Button',
      description: 'Tombol darurat yang langsung menghubungkan ke tim support Homica',
      color: 'from-red-500 to-red-600',
      benefits: ['24/7 emergency response', 'Instant connection', 'Safety guarantee'],
      textcolor: 'text-red-400',
    },
    {
      icon: Bell,
      title: 'Status Update Otomatis',
      description: 'Update progres pekerjaan dengan notifikasi real-time ke konsumen',
      color: 'from-purple-500 to-purple-600',
      benefits: ['Progress notifications', 'Status updates', 'Work milestones'],
      textcolor: 'text-purple-400',
    },
    {
      icon: Star,
      title: 'Rating & Feedback',
      description: 'Sistem penilaian terintegrasi langsung setelah layanan selesai',
      color: 'from-yellow-500 to-yellow-600',
      benefits: ['Instant feedback', 'Quality assurance', 'Service improvement'],
      textcolor: 'text-yellow-400',
    }
  ];

  const workStatuses = [
    { status: 'Dalam Perjalanan', color: 'bg-blue-500', icon: Navigation },
    { status: 'Tiba di Lokasi', color: 'bg-orange-500', icon: MapPin },
    { status: 'Sedang Bekerja', color: 'bg-green-500', icon: Clock },
    { status: 'Selesai', color: 'bg-gray-500', icon: CheckCircle }
  ];

  return (
    <section id="tracking" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-custombg dark:bg-none">
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
            Sistem <span className="text-[#0A74DA]">Tracking</span> Real-Time
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-customtext2">
            Transparansi penuh untuk keamanan dan kenyamanan Anda. Pantau setiap aktivitas 
            pekerja secara real-time melalui aplikasi Homica.
          </p>
        </motion.div>

        {/* Main Tracking Interface Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Map Area */}
                <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
                  <div className="text-center z-10">
                    <div className="w-20 h-20 bg-[#0A74DA] rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-['Poppins'] text-xl font-bold text-gray-900 mb-2">
                      Live Tracking Map
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Posisi pekerja: Siti Nurhaliza
                    </p>
                    <Badge className="bg-green-500 text-white">
                      Sedang Bekerja
                    </Badge>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-[#00BFA6] rounded-full animate-ping"></div>
                  <div className="absolute bottom-8 right-8 w-4 h-4 bg-[#0A74DA] rounded-full animate-bounce"></div>
                  <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>

                {/* Status Panel */}
                <div className="p-8 bg-white">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-['Poppins'] text-xl font-bold text-gray-900 mb-4">
                        Status Pekerjaan
                      </h3>
                      <div className="space-y-3">
                        {workStatuses.map((item, index) => (
                          <div 
                            key={index}
                            className={`flex items-center p-3 rounded-lg border ${
                              index === 2 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center mr-3`}>
                              <item.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className={`font-medium ${
                              index === 2 ? 'text-green-800' : 'text-gray-700'
                            }`}>
                              {item.status}
                            </span>
                            {index === 2 && (
                              <Badge className="ml-auto bg-green-500 text-white">
                                Active
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Mulai Kerja</div>
                          <div className="font-medium">09:00 WIB</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Estimasi Selesai</div>
                          <div className="font-medium">17:00 WIB</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Durasi</div>
                          <div className="font-medium">6 jam 30 menit</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Progress</div>
                          <div className="font-medium text-green-600">75%</div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-red-500 hover:bg-red-600 text-custom-button-text">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Emergency Button
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trackingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-custombg2 dark:bg-none">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className={`font-['Poppins'] text-lg font-bold text-gray-900 mb-3 dark:${feature.textcolor}`}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 dark:text-customtext2">
                    {feature.description}
                  </p>

                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-customtext2">
                        <div className="w-1.5 h-1.5 bg-[#00BFA6] rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl dark:bg-custombg2 dark:bg-none" 
        >
          <div className="text-center mb-8">
            <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-customtext mb-4">
              Manfaat Sistem Tracking Homica
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-customtext2">
              Sistem tracking kami memberikan keuntungan berlipat untuk keamanan
              dan kenyamanan menggunakan layanan Homica.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A74DA] to-[#00BFA6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-['Poppins'] text-lg font-bold text-gray-900 mb-2 dark:text-customtext">
                Transparansi Penuh
              </h4>
              <p className="text-gray-600 text-sm dark:text-customtext2">
                Ketahui setiap aktivitas pekerja secara real-time untuk ketenangan pikiran
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00BFA6] to-[#0A74DA] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-['Poppins'] text-lg font-bold text-gray-900 mb-2 dark:text-customtext">
                Keamanan Terjamin
              </h4>
              <p className="text-gray-600 text-sm dark:text-customtext2">
                Emergency button dan monitoring 24/7 untuk perlindungan maksimal
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A74DA] to-[#00BFA6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-['Poppins'] text-lg font-bold text-gray-900 mb-2 dark:text-customtext">
                Kontrol Penuh
              </h4>
              <p className="text-gray-600 text-sm dark:text-customtext2">
                Kelola layanan dari smartphone dengan interface yang mudah digunakan
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-[#0A74DA] hover:bg-[#0A74DA]/90 text-custom-button-text">
              Coba Tracking System
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}