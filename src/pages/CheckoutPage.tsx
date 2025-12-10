import Layout from "@/components/layout/Layout";
import { CreditCard, QrCode, ShieldCheck, Lock, Check } from "lucide-react";

const CheckoutPage = () => {
  const orderItems = [
    { title: "APG - Aprendizagem Baseada em Problemas", price: 197 },
    { title: "HAM I - Habilidades Médicas I", price: 197 },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price, 0);
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
          Finalizar <span className="text-secondary">Compra</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Data */}
            <div className="health-card p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Dados Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome completo
                  </label>
                  <input 
                    type="text"
                    placeholder="Seu nome"
                    className="health-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    E-mail
                  </label>
                  <input 
                    type="email"
                    placeholder="seu@email.com"
                    className="health-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    CPF
                  </label>
                  <input 
                    type="text"
                    placeholder="000.000.000-00"
                    className="health-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Telefone
                  </label>
                  <input 
                    type="text"
                    placeholder="(00) 00000-0000"
                    className="health-input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="health-card p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Forma de Pagamento
              </h3>

              {/* Payment Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label className="health-card p-4 cursor-pointer border-2 border-primary relative">
                  <input type="radio" name="payment" className="sr-only" defaultChecked />
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <QrCode className="w-8 h-8 text-primary" />
                    <span className="font-medium text-foreground">PIX</span>
                    <span className="text-xs text-secondary">5% de desconto</span>
                  </div>
                </label>

                <label className="health-card p-4 cursor-pointer border-2 border-border hover:border-primary/50 transition-colors">
                  <input type="radio" name="payment" className="sr-only" />
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                    <span className="font-medium text-foreground">Cartão</span>
                    <span className="text-xs text-muted-foreground">Em até 12x</span>
                  </div>
                </label>
              </div>

              {/* PIX Section */}
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-48 h-48 bg-card rounded-lg flex items-center justify-center border border-border">
                    <div className="w-36 h-36 bg-foreground rounded grid grid-cols-8 gap-0.5 p-2">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square ${Math.random() > 0.5 ? 'bg-background' : 'bg-foreground'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-semibold text-foreground mb-2">
                      Pague com PIX
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Escaneie o QR Code ou copie o código para pagar
                    </p>
                    <button className="health-button-outline text-sm">
                      Copiar código PIX
                    </button>
                  </div>
                </div>
              </div>

              {/* Credit Card Form (hidden by default) */}
              <div className="hidden mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Número do cartão
                  </label>
                  <input 
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="health-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Validade
                    </label>
                    <input 
                      type="text"
                      placeholder="MM/AA"
                      className="health-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      CVV
                    </label>
                    <input 
                      type="text"
                      placeholder="123"
                      className="health-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome no cartão
                  </label>
                  <input 
                    type="text"
                    placeholder="Como está no cartão"
                    className="health-input"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button className="health-button-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
              <Lock className="w-5 h-5" />
              Confirmar Pagamento
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Ambiente seguro com criptografia SSL</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="health-card p-6 sticky top-24">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
                Resumo do Pedido
              </h3>

              <div className="space-y-4 mb-6">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex-1 pr-4">{item.title}</span>
                    <span className="text-foreground whitespace-nowrap">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="py-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="text-secondary">-{formatPrice(discount)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-secondary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground text-sm block">
                      Garantia de 7 dias
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Se não gostar, devolvemos seu dinheiro
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
