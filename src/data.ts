export type ProductCategory = "Food & drinks" | "Essentials";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  image: string;
  label?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "beef-pilau",
    name: "Beef pilau",
    description: "Fragrant pilau with tender beef",
    category: "Food & drinks",
    price: 180,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85",
    label: "Campus favourite",
  },
  {
    id: "masala-chips",
    name: "Masala chips",
    description: "Crispy chips with a little kick",
    category: "Food & drinks",
    price: 150,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "chapati-beans",
    name: "Chapati & beans",
    description: "A filling, home-style plate",
    category: "Food & drinks",
    price: 120,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "samosa",
    name: "Samosa",
    description: "Golden, crisp and ready to go",
    category: "Food & drinks",
    price: 40,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "smokie",
    name: "Smokie",
    description: "A quick bite between classes",
    category: "Food & drinks",
    price: 50,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "soda",
    name: "Soda",
    description: "Chilled soft drink",
    category: "Food & drinks",
    price: 60,
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "water",
    name: "Bottled water",
    description: "Stay hydrated through the day",
    category: "Food & drinks",
    price: 40,
    image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "mandazi",
    name: "Mandazi",
    description: "Soft, freshly made mandazi",
    category: "Food & drinks",
    price: 30,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484df?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "bread",
    name: "Fresh bread",
    description: "A simple everyday essential",
    category: "Essentials",
    price: 80,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "eggs",
    name: "Eggs",
    description: "Everyday kitchen essential",
    category: "Essentials",
    price: 30,
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "milk",
    name: "Milk",
    description: "A fresh everyday favourite",
    category: "Essentials",
    price: 70,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "toiletries",
    name: "Personal care",
    description: "Ask for the toiletries you need",
    category: "Essentials",
    price: 100,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
    label: "Request options",
  },
];

export const formatKES = (amount: number) =>
  "KSh " + Math.round(amount).toLocaleString("en-KE");

export const CAMPUS_CENTER = {
  lat: 0.1428,
  lng: 37.7106,
};

export type PinLocation = {
  lat: number;
  lng: number;
  landmark: string;
};

export const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";