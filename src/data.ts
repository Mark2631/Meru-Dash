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
    description: "Spiced rice with tender beef",
    category: "Food & drinks",
    price: 180,
    image: "https://barakarice.com/wp-content/uploads/2016/06/Baraka-Rice-Basmati-Pilau-scaled.jpg",
    label: "Popular",
  },
  {
    id: "masala-chips",
    name: "Masala chips",
    description: "Crispy chips tossed in masala",
    category: "Food & drinks",
    price: 150,
    image: "https://images.bolt.eu/store/2025/2025-01-15/8f77ccbd-7217-43ea-ba91-de83a05ddf8c.jpeg",
  },
  {
    id: "chapati-beans",
    name: "Chapati & beans",
    description: "A filling campus meal",
    category: "Food & drinks",
    price: 120,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "smocha",
    name: "Smocha",
    description: "Chapati, smokie and kachumbari",
    category: "Food & drinks",
    price: 70,
    image: "https://sokomoja-media.s3.amazonaws.com/media/products/SLR00112/08451c26b8e140468f213af8129b4b4e.webp",
    label: "Campus snack",
  },
  {
    id: "samosa",
    name: "Samosa",
    description: "Golden savoury snack",
    category: "Food & drinks",
    price: 40,
    image: "https://www.booknbook.co.ke/storage/public/restaurants/358-jahazi-coffee-house/profile/438160209_823552939789639_7220117977974863933_n.jpg",
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
    id: "chips-plain",
    name: "Plain chips",
    description: "Freshly fried golden chips",
    category: "Food & drinks",
    price: 100,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "bhajia",
    name: "Bhajia",
    description: "Crispy potato bites",
    category: "Food & drinks",
    price: 120,
    image: "https://www.booknbook.co.ke/storage/public/restaurants/358-jahazi-coffee-house/profile/438160209_823552939789639_7220117977974863933_n.jpg",
  },
  {
    id: "boiled-egg",
    name: "Boiled egg",
    description: "Simple, filling snack",
    category: "Food & drinks",
    price: 30,
    image: "https://image.idntimes.com/post/20260305/hampers-sembako-mini-bahan-dapur_9e57a671-b0b7-4938-ba8a-e036aaa834ac.jpg",
  },
  {
    id: "beef-burger",
    name: "Beef burger",
    description: "Burger with a side of fries",
    category: "Food & drinks",
    price: 250,
    image: "https://glovo.dhmedia.io/image/stores-glovo/stores/e1d44d941e3af431c584305a775067c3a8deb7601ac9e53b35c2635928733657?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MTI4MCwiaGVpZ2h0IjoxMjB9fSx7IndlYnAiOnsicSI6ImxvdyJ9fV0%3D",
  },
  {
    id: "chicken-chips",
    name: "Chicken & chips",
    description: "Crispy chicken with golden fries",
    category: "Food & drinks",
    price: 280,
    image: "https://glovo.dhmedia.io/image/stores-glovo/stores/e1d44d941e3af431c584305a775067c3a8deb7601ac9e53b35c2635928733657?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MTI4MCwiaGVpZ2h0IjoxMjB9fSx7IndlYnAiOnsicSI6ImxvdyJ9fV0%3D",
    label: "Meal",
  },
  {
    id: "chapati-roll",
    name: "Chapati roll",
    description: "Chapati wrap with egg and vegetables",
    category: "Food & drinks",
    price: 100,
    image: "https://glovo.dhmedia.io/image/stores-glovo/stores/45973e1210e99a2bc56d69311f2b45055782485d11ebc23e007f3db45fc0d7a2?t=W3sicYXV0byI6eyJxIjoibG93In19LHsicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MTI4MCwiaGVpZ2h0IjoxMjB9fV0%3D",
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
    id: "sausage",
    name: "Sausage",
    description: "Hot sausage snack",
    category: "Food & drinks",
    price: 60,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "soda",
    name: "Soda 500ml",
    description: "Chilled soft drink",
    category: "Food & drinks",
    price: 60,
    image: "https://jdssupercare.com/cdn/shop/files/8fd73c5e-00ed-461e-81e0-f1401ef09485.jpg?v=1756217862",
  },
  {
    id: "water",
    name: "Water 500ml",
    description: "Bottled drinking water",
    category: "Food & drinks",
    price: 40,
    image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "juice",
    name: "Fresh juice",
    description: "Chilled fruit juice",
    category: "Food & drinks",
    price: 80,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "energy-drink",
    name: "Energy drink",
    description: "Cold energy drink",
    category: "Food & drinks",
    price: 100,
    image: "https://cdn.mafrservices.com/sys-master-root/hfc/he7/26929882398750/156079_main.jpg?im=Resize%3D480",
  },
  {
    id: "instant-noodles",
    name: "Instant noodles",
    description: "Quick meal for your room",
    category: "Food & drinks",
    price: 50,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "bread",
    name: "Mafuko sliced bread",
    description: "Sliced loaf from a Meru bakery",
    category: "Essentials",
    price: 80,
    image: "https://www.businesslist.co.ke/img/ke/z/_1592850477-37-mafuko-industries-ltd.jpg",
    label: "Meru bakery",
  },
  {
    id: "eggs",
    name: "Eggs",
    description: "Everyday kitchen essential",
    category: "Essentials",
    price: 30,
    image: "https://image.idntimes.com/post/20260305/hampers-sembako-mini-bahan-dapur_9e57a671-b0b7-4938-ba8a-e036aaa834ac.jpg",
  },
  {
    id: "milk",
    name: "Fresh milk 500ml",
    description: "Milk for tea or breakfast",
    category: "Essentials",
    price: 70,
    image: "https://eastmatt.com/ios1/itemimages/foodstuffs_two.jpeg",
  },
  {
    id: "maize-flour",
    name: "Maize flour 2kg",
    description: "Flour for home-style ugali",
    category: "Essentials",
    price: 160,
    image: "https://assets.kenyanwallstreet.com/assets/282ab65a-412e-4ecd-aa0b-86b1f4d08af8.jpg",
  },
  {
    id: "sugar",
    name: "Sugar 1kg",
    description: "Everyday pantry essential",
    category: "Essentials",
    price: 170,
    image: "https://eastmatt.com/ios1/itemimages/foodstuffs_two.jpeg",
  },
  {
    id: "cooking-oil",
    name: "Cooking oil 500ml",
    description: "Cooking oil for your kitchen",
    category: "Essentials",
    price: 140,
    image: "https://eastmatt.com/ios1/itemimages/foodstuffs_two.jpeg",
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
  {
    id: "tissue",
    name: "Toilet tissue",
    description: "Everyday bathroom essential",
    category: "Essentials",
    price: 50,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "soap",
    name: "Bathing soap",
    description: "Daily personal care",
    category: "Essentials",
    price: 70,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "toothpaste",
    name: "Toothpaste",
    description: "Daily oral care essential",
    category: "Essentials",
    price: 120,
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "avocado",
    name: "Avocado",
    description: "Fresh fruit",
    category: "Essentials",
    price: 30,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "bananas",
    name: "Bananas",
    description: "Fresh bananas",
    category: "Essentials",
    price: 20,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "biscuits",
    name: "Biscuits",
    description: "A snack for study breaks",
    category: "Essentials",
    price: 50,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=85",
  },
];

export const formatKES = (amount: number) =>
  "KSh " + Math.round(amount).toLocaleString("en-KE");

export const CAMPUS_CENTER = {
  lat: 0.134898,
  lng: 37.708432,
};

export type PinLocation = {
  lat: number;
  lng: number;
  landmark: string;
};

export const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
