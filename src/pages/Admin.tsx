import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Order {
  items: Array<{ name: string; price: number; quantity: number }>;
  customer: { name: string; phone: string; address: string };
  total: number;
  date: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'vases',
    image: '',
    description: '',
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
    
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
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'админ' && loginForm.password === 'админ') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      loadData();
      toast({ title: 'Успешный вход', description: 'Добро пожаловать в админ-панель' });
    } else {
      toast({ title: 'Ошибка входа', description: 'Неверный логин или пароль', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    navigate('/');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.description) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image,
      description: newProduct.description,
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    setNewProduct({ name: '', price: '', category: 'vases', image: '', description: '' });
    toast({ title: 'Товар добавлен', description: 'Новый товар успешно добавлен в каталог' });
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast({ title: 'Товар удалён', description: 'Товар удалён из каталога' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4 border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Icon name="Lock" size={24} />
              Админ-панель
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm">Логин</Label>
                <Input
                  id="username"
                  placeholder="Введите логин"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                <Icon name="Settings" size={20} />
              </div>
              <h1 className="text-xl font-bold">Админ-панель</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Icon name="Home" size={16} className="mr-2" />
                Сайт
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders">
              <Icon name="ShoppingBag" size={16} className="mr-2" />
              Заказы ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              <Icon name="Package" size={16} className="mr-2" />
              Товары ({products.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon name="ClipboardList" size={20} />
                  Список заказов
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Заказов пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, index) => (
                      <div key={index} className="p-4 rounded-lg bg-secondary/20 border border-border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{order.customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.address}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {new Date(order.date).toLocaleDateString('ru-RU')}
                            </Badge>
                            <p className="text-lg font-bold text-primary">{order.total} ₽</p>
                          </div>
                        </div>
                        <div className="border-t border-border pt-3">
                          <p className="font-medium text-sm mb-2">Состав заказа:</p>
                          <ul className="space-y-1">
                            {order.items.map((item, i) => (
                              <li key={i} className="text-sm flex justify-between text-muted-foreground">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{item.price * item.quantity} ₽</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="Plus" size={20} />
                    Добавить товар
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="productName" className="text-sm">Название</Label>
                    <Input
                      id="productName"
                      placeholder="Название товара"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productPrice" className="text-sm">Цена (₽)</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      placeholder="2500"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCategory" className="text-sm">Категория</Label>
                    <Select value={newProduct.category} onValueChange={(val) => setNewProduct(prev => ({ ...prev, category: val }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vases">Вазы и кувшины</SelectItem>
                        <SelectItem value="bowls">Чаши и салатники</SelectItem>
                        <SelectItem value="plates">Тарелки и блюда</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="productImage" className="text-sm">URL изображения</Label>
                    <Input
                      id="productImage"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productDescription" className="text-sm">Описание</Label>
                    <Textarea
                      id="productDescription"
                      placeholder="Описание товара"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить товар
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="List" size={20} />
                    Текущие товары
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {products.map(product => (
                      <div key={product.id} className="flex gap-3 p-3 rounded-lg bg-secondary/20 border border-border">
                        <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                          <p className="text-sm font-bold text-primary mt-1">{product.price} ₽</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
