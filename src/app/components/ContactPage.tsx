import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  Building2,
  Clock,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 overflow-hidden relative">
      
      {/* Gradient Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 backdrop-blur-xl rounded-full text-white hover:bg-slate-900 transition-all shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05, x: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="size-3.5" />
        <span className="text-xs font-medium">Voltar</span>
      </motion.button>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="size-4 text-indigo-600" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Estamos Aqui Para Você
            </span>
          </motion.div>

          <motion.h1 
            className="text-5xl lg:text-6xl font-black text-slate-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Entre em{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Contato
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl text-slate-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Nosso time está pronto para transformar a gestão de recebíveis da sua empresa
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <div className="space-y-6">
            {/* Address Card */}
            <motion.div
              className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-2xl transition-all relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              
              <div className="relative z-10">
                <div className="size-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mb-4 shadow-lg">
                  <MapPin className="size-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">Nosso Escritório</h3>
                
                <div className="space-y-2 text-slate-600">
                  <p className="font-medium">Praça Infante Dom Pedro nº 12</p>
                  <p>5º Andar - Esquerdo</p>
                  <p>Algés, Oeiras</p>
                  <p>Lisboa, Portugal</p>
                  <p className="font-semibold text-indigo-600 mt-3">1495-149</p>
                </div>

                <motion.div
                  className="mt-6 pt-6 border-t border-slate-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 className="size-4 text-indigo-600" />
                    <span>Sede em Lisboa</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div
              className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-2xl transition-all relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              
              <div className="relative z-10">
                <div className="size-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 shadow-lg">
                  <Phone className="size-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">Telefone</h3>
                
                <a 
                  href="tel:+35696545689"
                  className="text-2xl font-bold text-indigo-600 hover:text-purple-600 transition-colors inline-block"
                >
                  +356 9654 56 895
                </a>

                <motion.div
                  className="mt-6 pt-6 border-t border-slate-200 space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="size-4 text-purple-600" />
                    <span>Seg - Sex: 9h00 - 18h00</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MessageSquare className="size-4 text-green-600" />
                    <span>Suporte via WhatsApp</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              className="group bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-indigo-500/50 transition-all relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              
              <div className="relative z-10">
                <div className="size-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Mail className="size-7" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">Email</h3>
                
                <a 
                  href="mailto:contato@tapago.pt"
                  className="text-lg font-semibold hover:text-indigo-100 transition-colors inline-block"
                >
                  contato@tapago.pt
                </a>

                <p className="text-sm text-indigo-100 mt-4">
                  Respondemos em até 24h úteis
                </p>
              </div>

              <motion.div
                className="absolute -bottom-4 -right-4 size-32 bg-white/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </div>

          {/* Right Side - Contact Form */}
          <motion.div
            className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Envie uma Mensagem</h3>
              
              {isSubmitted ? (
                <motion.div
                  className="py-20 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    className="size-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl"
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 0.6
                    }}
                  >
                    <CheckCircle className="size-10" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Mensagem Enviada!</h4>
                  <p className="text-slate-600">Entraremos em contato em breve</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="João Silva"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="joao@empresa.pt"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="+351 XXX XXX XXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="Sua Empresa Lda"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                      placeholder="Como podemos ajudar sua empresa?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="size-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send className="size-5" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-slate-500 text-center">
                    Ao enviar, você concorda com nossa política de privacidade
                  </p>
                </form>
              )}
            </div>

            {/* Decorative gradient */}
            <motion.div
              className="absolute -top-10 -right-10 size-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
            />
          </motion.div>
        </div>

        {/* Map Placeholder Section */}
        <motion.div
          className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative h-96"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Google Maps Embed Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="size-16 text-indigo-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-900 mb-2">Venha nos visitar!</h4>
              <p className="text-slate-600 mb-4">Algés, Oeiras - Lisboa</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Praça+Infante+Dom+Pedro+12+Algés+Oeiras+Lisboa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg"
              >
                Abrir no Google Maps
                <MapPin className="size-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}