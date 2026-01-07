import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '' });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (storedProducts.length > 0) {
      setProducts(storedProducts);
    } else {
      const defaultProducts: Product[] = [
        { id: 1, name: 'Терракотовая ваза', price: 2500, category: 'vases', image: 'https://cdn.poehali.dev/projects/03cdfc4b-c9d5-403b-9300-fbfb80a1303a/files/c6b39d23-50ac-495e-a184-e65410d39ff1.jpg', description: 'Ручная работа, высота 25см' },
        { id: 2, name: 'Глиняная чаша', price: 1800, category: 'bowls', image: 'https://cdn.poehali.dev/projects/03cdfc4b-c9d5-403b-9300-fbfb80a1303a/files/111dfe02-c713-43fe-8e81-d7d9e7e8c115.jpg', description: 'Идеально для сервировки стола' },
        { id: 3, name: 'Декоративная тарелка', price: 1500, category: 'plates', image: 'https://cdn.poehali.dev/projects/03cdfc4b-c9d5-403b-9300-fbfb80a1303a/files/847895ae-1a4d-4159-9147-693fda418ce1.jpg', description: 'Уникальный дизайн, диаметр 30см' },
        { id: 4, name: 'Кувшин глиняный', price: 3200, category: 'vases', image: 'https://cdn.poehali.dev/projects/03cdfc4b-c9d5-403b-9300-fbfb80a1303a/files/c6b39d23-50ac-495e-a184-e65410d39ff1.jpg', description: 'Классический стиль, объём 1.5л' },
        { id: 5, name: 'Салатник керамический', price: 2000, category: 'bowls', image: 'https://cdn.poehali.dev/projects/03cdfc4b-c9d5-403b-9300-fbfb80a1303a/files/111dfe02-c713-43fe-8e81-d7d9e7e8c115.jpg', description: 'Глазурованная поверхность' },
        { id: 6, name: 'Блюдо сервировочное', price: 2800, category: 'plates', image: 'https://cdn.poehali.dev/projects/03cdfc4b-c9d5-403b-9300-fbfb80a1303a/files/847895ae-1a4d-4159-9147-693fda418ce1.jpg', description: 'Овальная форма, 35см' },
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }, []);

  const categories = [
    { value: 'all', label: 'Все товары' },
    { value: 'vases', label: 'Вазы и кувшины' },
    { value: 'bowls', label: 'Чаши и салатники' },
    { value: 'plates', label: 'Тарелки и блюда' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({ title: 'Товар добавлен в корзину', description: product.name });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = () => {
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    
    const orderData = {
      items: cart,
      customer: orderForm,
      total: totalPrice,
      date: new Date().toISOString(),
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    setCart([]);
    setOrderForm({ name: '', phone: '', address: '' });
    toast({ title: 'Заказ оформлен!', description: 'Мы свяжемся с вами в ближайшее время' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl">🏺</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Глина и её изделия</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary">{cart.length}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Icon name="ShoppingBag" size={64} className="mb-4 opacity-50" />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    {cart.map(item => (
                      <Card key={item.id}>
                        <CardContent className="pt-4">
                          <div className="flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <Icon name="Plus" size={14} />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)} className="ml-auto">
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Оформление заказа</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Имя</Label>
                        <Input 
                          id="name" 
                          placeholder="Введите ваше имя"
                          value={orderForm.name}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="+7 (999) 123-45-67"
                          value={orderForm.phone}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Адрес доставки</Label>
                        <Input 
                          id="address" 
                          placeholder="Введите адрес"
                          value={orderForm.address}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Итого:</span>
                      <span className="text-primary">{totalPrice} ₽</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleOrder}>
                    Оформить заказ
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="py-12 bg-gradient-to-b from-accent/20 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Изделия из глины ручной работы</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Уникальные керамические изделия, созданные с любовью и мастерством
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold">Каталог товаров</h3>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Badge variant="secondary" className="mb-2">
                    {categories.find(c => c.value === product.category)?.label}
                  </Badge>
                  <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <p className="text-2xl font-bold text-primary">{product.price} ₽</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={() => addToCart(product)}>
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-card border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">🏺</span>
            <span>© 2024 Глина и её изделия. Все права защищены.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;