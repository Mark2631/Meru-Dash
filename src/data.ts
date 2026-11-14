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
    image: "https://7daysmeal.com/meals/image/2025/03/chapati-beans-stew-recipe.jpg",
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
    image: "https://media.easemytrip.com/media/Blog/International/638828403147185779/6388284031471857796L1Of3.png",
  },
  {
    id: "smokie",
    name: "Smokie",
    description: "A quick bite between classes",
    category: "Food & drinks",
    price: 50,
    image: "https://kenyapeaks.com/assets/uploads/smokie-pasua-in-nairobi-street-foods_6890d930c2b05.webp",
  },
  {
    id: "chips-plain",
    name: "Plain chips",
    description: "Freshly fried golden chips",
    category: "Food & drinks",
    price: 100,
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Ce_grayscale%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2024/11/7/fd94d3de-be4f-4e6d-b1b8-ceb4f585e683_9b48d2c5-326a-4f20-bdd1-3da7559f12f6.jpg",
  },
  {
    id: "bhajia",
    name: "Bhajia",
    description: "Crispy potato bites",
    category: "Food & drinks",
    price: 120,
    image: "https://www.aromaandessence.com/wp-content/uploads/2023/01/Bhajia-final-jpg.webp",
  },
  {
    id: "boiled-egg",
    name: "Boiled egg",
    description: "A freshly boiled egg",
    category: "Food & drinks",
    price: 30,
    image: "https://images.pexels.com/photos/19409033/pexels-photo-19409033.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "beef-burger",
    name: "Beef burger",
    description: "Burger with a side of fries",
    category: "Food & drinks",
    price: 250,
    image: "https://glovo.dhmedia.io/image/global-menu-service/GV_KE/vendor/474961/PRODUCT/41612080958/8701d070-1032-4bdf-8e4e-281a06b5d5eb.jpg",
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
    image: "https://dishanddelights.com/wp-content/uploads/2025/10/pakoblog__Easy_Mandazi_Recipe_front_angle_shot_low_angle_shot_k_bf160adb-0cad-48a5-85f4-4dda91a7c5b0.webp",
  },
  {
    id: "sausage",
    name: "Sausage",
    description: "Hot sausage snack",
    category: "Food & drinks",
    price: 60,
    image: "https://kryta.dk/Admin/Public/GetImage.ashx?format=webp&image=%2FFiles%2FImages%2FThuringer+bratwurst+ai.png&width=640",
  },
  {
    id: "soda",
    name: "Coca-Cola 500ml",
    description: "Chilled soft drink",
    category: "Food & drinks",
    price: 60,
    image: "https://www.tawalasupermarket.co.ke/1918-large_default/coca-cola-coke-pet-bottle-500ml.jpg",
  },
  {
    id: "water",
    name: "Water 500ml",
    description: "Bottled drinking water",
    category: "Food & drinks",
    price: 40,
    image: "https://bf1af2.akinoncloudcdn.com/products/2024/09/23/134773/233124c0-1b59-4cf9-b20f-ac865accf5fc_size3840_cropCenter.jpg",
  },
  {
    id: "juice",
    name: "Fresh juice",
    description: "Chilled fruit juice",
    category: "Food & drinks",
    price: 80,
    image: "https://images.milkandmore.co.uk/image/upload/w_iw/f_auto%2Cq_auto%3Aeco/d_back_up_image.jpg%2Cw_1200%2Cc_scale/v1/products/72775_1.jpg",
  },
  {
    id: "energy-drink",
    name: "Energy drink",
    description: "Cold energy drink",
    category: "Food & drinks",
    price: 100,
    image: "https://d16zmt6hgq1jhj.cloudfront.net/product/6059/So02KHcdbylgZPhG6SZsznsGHdvHYrk4OwRF9Acx.jpg",
  },
  {
    id: "instant-noodles",
    name: "Instant noodles",
    description: "Quick meal for your room",
    category: "Food & drinks",
    price: 50,
    image: "https://cdn.mafrservices.com/pim-content/KEN/media/product/24112/1741186804/24112_main.jpg?im=Resize%3D400",
  },
  {
    id: "bread",
    name: "Mafuko sliced bread",
    description: "Pre-sliced white loaf from a Meru bakery. Pack image to be confirmed by the owner.",
    category: "Essentials",
    price: 80,
    image: "https://cdn.mafrservices.com/sys-master-root/ha4/h71/26930055479326/163643_main.jpg?im=Resize%3D480",
    label: "Meru bakery",
  },
  {
    id: "eggs",
    name: "Eggs",
    description: "Everyday kitchen essential",
    category: "Essentials",
    price: 30,
    image: "https://cdn.mafrservices.com/sys-master-root/hf8/hea/52644034871326/8033_main.jpg?im=Resize%3D400",
  },
  {
    id: "milk",
    name: "Fresh milk 500ml",
    description: "Milk for tea or breakfast",
    category: "Essentials",
    price: 70,
    image: "https://cdnprod.mafretailproxy.com/sys-master-root/hfc/hef/27062194438174/43281_main.jpg_480Wx480H",
  },
  {
    id: "maize-flour",
    name: "Maize flour 2kg",
    description: "Flour for home-style ugali",
    category: "Essentials",
    price: 160,
    image: "https://img.oaks.delivery/cdn-cgi/image/width%3D800%2Cfit%3Dscale-down%2Cformat%3Dauto/products/jo3740/51aed46832ca-640.webp",
  },
  {
    id: "sugar",
    name: "Sugar 1kg",
    description: "White granulated sugar",
    category: "Essentials",
    price: 170,
    image: "",
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
    image: "https://d16zmt6hgq1jhj.cloudfront.net/product/6954/cuCG29x4ibXuY2OgUwoj31Xl2JkezGRcfa2PlvLS.png",
  },
  {
    id: "soap",
    name: "Bathing soap",
    description: "Daily personal care",
    category: "Essentials",
    price: 70,
    image: "https://cdn.mafrservices.com/sys-master-root/ha7/hfc/17290181050398/34160_main.jpg?im=Resize%3D480",
  },
  {
    id: "toothpaste",
    name: "Toothpaste",
    description: "Daily oral care essential",
    category: "Essentials",
    price: 120,
    image: "https://cdn.mafrservices.com/sys-master-root/h80/h9f/31146195091486/29900_main.jpg?im=Resize%3D480",
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
    description: "A pack of tea biscuits for study breaks",
    category: "Essentials",
    price: 50,
    image: "https://cdn.mafrservices.com/sys-master-root/hfc/h23/12455758430238/21745_Main.jpg?im=Resize%3D480",
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
