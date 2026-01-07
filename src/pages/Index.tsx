import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [openCategories, setOpenCategories] = useState<string[]>(['main']);

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
    { 
      id: 'main', 
      label: 'Глиняная посуда', 
      icon: '🏺',
      children: [
        { value: 'prep', label: 'Для приготовления', count: products.filter(p => p.category === 'vases').length },
        { value: 'serving', label: 'Для подачи к столу', count: products.filter(p => p.category === 'bowls').length },
        { value: 'storage', label: 'Для хранения продуктов', count: products.filter(p => p.category === 'plates').length },
        { value: 'drinks', label: 'Посуда для напитков', count: 0 },
      ]
    },
    { id: 'birch', label: 'Береста', icon: '🌿', children: [] },
    { id: 'wood', label: 'Дерево', icon: '🪵', children: [] },
    { id: 'linen', label: 'Льняные изделия', icon: '🧵', children: [] },
    { id: 'ceramic', label: 'Декоративная керамика', icon: '🎨', children: [] },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : selectedCategory === 'prep' ? products.filter(p => p.category === 'vases')
    : selectedCategory === 'serving' ? products.filter(p => p.category === 'bowls')
    : selectedCategory === 'storage' ? products.filter(p => p.category === 'plates')
    : products;

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

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
      <header className="bg-[hsl(var(--header-bg))] text-[hsl(var(--header-fg))] sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                <span className="text-2xl">🏺</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">Глина и её изделия</h1>
                <p className="text-xs text-white/70">народные промыслы</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <a href="#" className="hover:text-white transition-colors">Каталог</a>
                <a href="#" className="hover:text-white transition-colors">Покупателю</a>
                <a href="#" className="hover:text-white transition-colors">Доставка</a>
              </nav>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Icon name="Phone" size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Icon name="Search" size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Icon name="User" size={18} />
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 relative">
                      <Icon name="ShoppingCart" size={18} />
                      {cart.length > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">{cart.length}</Badge>
                      )}
                      <span className="ml-2 hidden sm:inline">Корзина ({cart.length})</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Корзина</SheetTitle>
                    </SheetHeader>
                    
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <Icon name="ShoppingBag" size={48} className="mb-3 opacity-50" />
                        <p>Корзина пуста</p>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-6">
                        <div className="space-y-3">
                          {cart.map(item => (
                            <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-muted">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                                <p className="text-xs text-muted-foreground">{item.price} ₽</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                    <Icon name="Minus" size={12} />
                                  </Button>
                                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Icon name="Plus" size={12} />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto text-destructive" onClick={() => removeFromCart(item.id)}>
                                    <Icon name="Trash2" size={12} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm">Оформление заказа</h3>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor="name" className="text-xs">Имя</Label>
                              <Input 
                                id="name" 
                                placeholder="Введите ваше имя"
                                value={orderForm.name}
                                onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-xs">Телефон</Label>
                              <Input 
                                id="phone" 
                                type="tel"
                                placeholder="+7 (999) 123-45-67"
                                value={orderForm.phone}
                                onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label htmlFor="address" className="text-xs">Адрес доставки</Label>
                              <Input 
                                id="address" 
                                placeholder="Введите адрес"
                                value={orderForm.address}
                                onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                                className="h-9"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-primary/10 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Итого:</span>
                            <span className="text-xl font-bold text-primary">{totalPrice} ₽</span>
                          </div>
                        </div>

                        <Button className="w-full" onClick={handleOrder}>
                          Оформить заказ
                        </Button>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-primary text-white p-4 rounded-t-lg font-bold">
            КАТАЛОГ ТОВАРОВ
          </div>
          <div className="bg-card border border-t-0 rounded-b-lg">
            {categories.map(category => (
              <div key={category.id}>
                <Collapsible open={openCategories.includes(category.id)} onOpenChange={() => toggleCategory(category.id)}>
                  <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors border-b">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    <Icon name="ChevronDown" size={16} className={`transition-transform ${openCategories.includes(category.id) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  {category.children.length > 0 && (
                    <CollapsibleContent>
                      <div className="bg-muted/50">
                        {category.children.map(child => (
                          <button 
                            key={child.value}
                            onClick={() => setSelectedCategory(child.value)}
                            className={`w-full px-6 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between ${selectedCategory === child.value ? 'bg-primary/10 text-primary font-medium' : ''}`}
                          >
                            <span>{child.label}</span>
                            <span className="text-xs text-muted-foreground">{child.count}</span>
                          </button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Глиняная посуда ручной работы</h2>
            <p className="text-muted-foreground">
              Купить глиняную посуду для готовки, хранения продуктов, сервировки стола. Купить глиняные кувшины и крынки для молока, вина и других напитков.
            </p>
          </div>

          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? 'bg-primary text-white' : ''}>
                Все товары
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Показано товаров:</span>
              <span className="font-semibold">{filteredProducts.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden bg-muted/30">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => addToCart(product)}>
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Icon name="Package" size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground">Товары в этой категории отсутствуют</p>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-secondary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-bold mb-3">О магазине</h3>
              <p className="text-white/80">Изделия из глины ручной работы. Народные промыслы России.</p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Контакты</h3>
              <p className="text-white/80">Email: info@glina.ru</p>
              <p className="text-white/80">Телефон: +7 (999) 123-45-67</p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Информация</h3>
              <p className="text-white/80">© 2024 Глина и её изделия</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
