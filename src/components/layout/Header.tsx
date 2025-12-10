import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">H</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                Health<span className="text-secondary">Med</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Medicina direto ao ponto</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Início
            </Link>
            <Link to="/periodo/1" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Períodos
            </Link>
            <Link to="/aluno" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Área do Aluno
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/carrinho" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <Link to="/aluno" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-all">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Entrar</span>
            </Link>
            <Link to="/checkout" className="health-button-primary text-sm">
              Criar Conta
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link to="/periodo/1" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Períodos
              </Link>
              <Link to="/aluno" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Área do Aluno
              </Link>
              <Link to="/carrinho" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Carrinho (2)
              </Link>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Link to="/aluno" className="flex-1 health-button-outline text-sm text-center">
                  Entrar
                </Link>
                <Link to="/checkout" className="flex-1 health-button-primary text-sm text-center">
                  Criar Conta
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
