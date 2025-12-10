import { Trash2, BookOpen } from "lucide-react";

interface CartItemCardProps {
  title: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

const CartItemCard = ({ title, price, imageUrl, category = "SOI" }: CartItemCardProps) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  return (
    <div className="health-card p-4 flex gap-4">
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary/50" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="text-xs text-secondary font-medium">{category}</span>
        <h4 className="font-heading font-semibold text-foreground truncate">{title}</h4>
        <p className="text-sm text-muted-foreground">Acesso vitalício</p>
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
        <span className="health-price text-lg">{formattedPrice}</span>
      </div>
    </div>
  );
};

export default CartItemCard;
