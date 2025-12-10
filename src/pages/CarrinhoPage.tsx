import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CartItemCard from "@/components/cards/CartItemCard";
import { ArrowRight, ShoppingBag, Tag, ShieldCheck } from "lucide-react";

const CarrinhoPage = () => {
  const cartItems = [
    { title: "APG - Aprendizagem Baseada em Problemas", price: 197, category: "SOI" },
    { title: "HAM I - Habilidades Médicas I", price: 197, category: "HAM" },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discount = 50;
  const total = subtotal - discount;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
          Carrinho de <span className="text-secondary">Compras</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <CartItemCard key={index} {...item} />
            ))}

            {/* Empty State (visual) */}
            {cartItems.length === 0 && (
              <div className="health-card p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Adicione cursos ao seu carrinho para continuar
                </p>
                <Link to="/" className="health-button-primary inline-flex items-center gap-2">
                  Explorar Cursos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Coupon */}
            <div className="health-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Cupom de desconto</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Digite seu cupom"
                  className="health-input flex-1"
                />
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Aplicar
                </button>
              </div>
            </div>

            {/* Continue Shopping */}
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-medium"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continuar comprando
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="health-card p-6 sticky top-24">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
                Resumo do Pedido
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cartItems.length} itens)</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="text-secondary">-{formatPrice(discount)}</span>
                </div>
              </div>

              <div className="py-4 border-t border-b border-border mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-secondary">{formatPrice(total)}</span>
                    <span className="block text-xs text-muted-foreground">
                      ou 12x de {formatPrice(total / 12)}
                    </span>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="health-button-primary w-full flex items-center justify-center gap-2"
              >
                Finalizar Compra
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CarrinhoPage;
