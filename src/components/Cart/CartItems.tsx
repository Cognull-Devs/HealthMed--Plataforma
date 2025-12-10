// src/components/Cart/CartItems.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface CartItem {
  id: string;
  course_id: string;
  courses: {
    title: string;
    subject: string;
  };
}

interface CartItemsProps {
  userId: string;
  refreshTrigger: number;
}

export default function CartItems({ userId, refreshTrigger }: CartItemsProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, [userId, refreshTrigger]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          course_id,
          courses (
            title,
            subject
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setCartItems(data || []);
    } catch (err) {
      console.error('Erro ao carregar carrinho:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      // Atualizar lista local
      setCartItems(cartItems.filter(item => item.id !== itemId));
      alert('Item removido do carrinho!');
    } catch (err) {
      console.error('Erro ao remover do carrinho:', err);
      alert('Erro ao remover item');
    }
  };

  if (loading) {
    return <div className="text-center py-6">Carregando carrinho...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Meu Carrinho</h2>

      {cartItems.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Seu carrinho está vazio</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.courses.title}</h3>
                <span className="text-sm text-gray-600">{item.courses.subject}</span>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Remover
              </button>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-lg font-semibold">
              Total de itens: {cartItems.length}
            </p>
            <button className="mt-3 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold">
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}