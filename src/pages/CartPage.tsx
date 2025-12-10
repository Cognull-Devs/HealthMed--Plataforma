import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft, CreditCard, QrCode } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const CartPage = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const { isAuthenticated, purchaseCourse } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.info('Faça login para continuar');
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark courses as purchased
    items.forEach(item => purchaseCourse(item.id));
    
    // Clear cart
    clearCart();
    
    setIsProcessing(false);
    toast.success('Compra realizada com sucesso!');
    navigate('/minhas-aulas');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-bold mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-muted-foreground mb-8">
              Explore nossos cursos e encontre o conteúdo ideal para seus estudos.
            </p>
            <Link to="/#periodos">
              <Button className="btn-primary">
                Ver Aulas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuar comprando
        </button>

        <h1 className="font-heading text-3xl font-bold mb-8">
          Carrinho de Compras
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="glass-card p-4 rounded-xl flex gap-4">
                <img 
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/aula/${item.slug}`}
                    className="font-semibold hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.subject}</p>
                  <p className="text-primary font-bold mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl sticky top-24">
              <h2 className="font-heading text-xl font-semibold mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Forma de Pagamento</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'pix' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <QrCode className={`w-6 h-6 ${paymentMethod === 'pix' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'pix' ? 'text-primary' : ''}`}>
                      PIX
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'card' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-primary' : ''}`}>
                      Cartão
                    </span>
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="btn-primary w-full py-6 text-base"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  `Finalizar Compra • ${formatPrice(totalPrice)}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Pagamento 100% seguro. Garantia de 7 dias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
