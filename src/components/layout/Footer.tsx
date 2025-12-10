import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
              <span className="font-heading font-bold text-xl">
                Health<span className="text-primary">Med</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sua plataforma de estudos médicos. Aprenda medicina de forma prática e objetiva.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Navegação</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/#periodos" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Períodos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Períodos */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Períodos</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/periodo/1-periodo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  1º Período
                </Link>
              </li>
              <li>
                <Link to="/periodo/2-periodo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  2º Período
                </Link>
              </li>
              <li>
                <Link to="/periodo/3-periodo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  3º Período
                </Link>
              </li>
              <li>
                <Link to="/periodo/4-periodo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  4º Período
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4" />
                contato@healthmed.com.br
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4" />
                (11) 99999-9999
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 HealthMed. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/termos" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
