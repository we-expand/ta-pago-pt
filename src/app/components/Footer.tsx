import { motion } from 'motion/react';
import { Logo } from './Logo';
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowUpRight,
  Sparkles,
  Shield,
  Lock,
  Award,
  ExternalLink
} from 'lucide-react';

export default function Footer({ onContactClick }: { onContactClick: () => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Logo />
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              A primeira IA que aprende, recupera e maximiza seus recebíveis transformando devedores em compradores.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <Shield className="size-4 text-green-400" />
                <span className="text-xs font-medium">GDPR</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <Lock className="size-4 text-blue-400" />
                <span className="text-xs font-medium">SSL</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <Award className="size-4 text-yellow-400" />
                <span className="text-xs font-medium">ISO</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="size-5 text-indigo-400" />
              Produto
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Funcionalidades', href: '#features' },
                { label: 'Preços', href: '#pricing' },
                { label: 'Integrações', href: '#' },
                { label: 'API', href: '#' },
                { label: 'Documentação', href: '#' },
                { label: 'Changelog', href: '#' }
              ].map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm group"
                  >
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-4">Empresa</h3>
            <ul className="space-y-3">
              {[
                { label: 'Sobre Nós', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Carreiras', href: '#', badge: 'Estamos contratando!' }
              ].map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm group"
                  >
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                    {link.badge && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] rounded-full font-semibold">
                        {link.badge}
                      </span>
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-4">
              <li>
                <motion.button
                  onClick={onContactClick}
                  className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors text-sm group w-full text-left"
                  whileHover={{ x: 5 }}
                >
                  <MapPin className="size-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-white mb-1">Escritório Lisboa</div>
                    <div className="leading-relaxed">
                      Praça Infante Dom Pedro nº 12<br />
                      5º Andar - Esquerdo<br />
                      Algés, Oeiras<br />
                      1495-149 Lisboa
                    </div>
                  </div>
                </motion.button>
              </li>
              
              <li>
                <motion.a
                  href="tel:+35696545689"
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm group"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="size-5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">+356 9654 56 895</div>
                    <div className="text-xs">Seg-Sex: 9h-18h</div>
                  </div>
                </motion.a>
              </li>
              
              <li>
                <motion.a
                  href="mailto:saldo.positivo@tapago.pt"
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm group"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="size-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">saldo.positivo@tapago.pt</div>
                    <div className="text-xs">Resposta em 24h</div>
                  </div>
                </motion.a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <div className="text-sm font-medium mb-3">Siga-nos</div>
              <div className="flex gap-3">
                {[
                  { Icon: Linkedin, href: '#', color: 'hover:bg-blue-600' },
                  { Icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
                  { Icon: Facebook, href: '#', color: 'hover:bg-blue-700' },
                  { Icon: Instagram, href: '#', color: 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600' }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    className={`size-10 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transition-all ${social.color}`}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.Icon className="size-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            className="text-sm text-slate-400 text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-2">
              © {currentYear} TaPago.PT • Todos os direitos reservados
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-500">
              <span>By</span>
              <a
                href="https://weexpand.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-400 transition-colors"
              >
                We Expand - Sales & Technology LDA
              </a>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { label: 'Termos de Uso', href: '#' },
              { label: 'Política de Privacidade', href: '#' },
              { label: 'Cookies', href: '#' },
              { label: 'GDPR', href: '#' }
            ].map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                className="text-slate-400 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Extra: Stats Bar */}
        <motion.div
          className="mt-8 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '€2.4M', label: 'Recuperado/Mês', color: 'text-green-400' },
              { value: '107x', label: 'ROI Médio', color: 'text-indigo-400' },
              { value: '68%', label: 'Taxa Sucesso', color: 'text-purple-400' },
              { value: '24/7', label: 'IA Ativa', color: 'text-pink-400' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: 0.7 + (i * 0.1),
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05, y: -3 }}
              >
                <motion.div
                  className={`text-3xl font-black ${stat.color} mb-1`}
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom line */}
      <motion.div
        className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
    </footer>
  );
}