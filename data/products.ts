export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  label?: string;
  description: string;
  className: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Ostrin Essential",
    price: 1499,
    category: "Essentials",
    label: "New",
    description:
      "A clean everyday essential designed with a timeless Ostrin aesthetic.",
    className: "bg-[#e7f1f5]",
    isNew: true,
  },
  {
    id: 2,
    name: "Signature Classic",
    price: 1899,
    category: "Classics",
    label: "New",
    description:
      "A refined classic with a modern silhouette and effortless appeal.",
    className: "bg-[#eef0ec]",
    isNew: true,
  },
  {
    id: 3,
    name: "Everyday Edit",
    price: 1699,
    category: "Essentials",
    label: "Featured",
    description:
      "Thoughtfully designed for everyday use with a minimal aesthetic.",
    className: "bg-[#e4edf1]",
  },
  {
    id: 4,
    name: "Modern Essential",
    price: 2099,
    category: "Essentials",
    label: "New",
    description:
      "A contemporary essential created for a modern, understated wardrobe.",
    className: "bg-[#e9e9e7]",
    isNew: true,
  },
  {
    id: 5,
    name: "Ostrin Signature",
    price: 1999,
    category: "Signature",
    label: "Bestseller",
    description:
      "One of Ostrin's signature pieces, balancing simplicity and character.",
    className: "bg-[#e8f0f3]",
    isBestSeller: true,
  },
  {
    id: 6,
    name: "Classic Form",
    price: 2299,
    category: "Classics",
    label: "Bestseller",
    description:
      "A versatile classic built around clean lines and timeless proportions.",
    className: "bg-[#e9ece8]",
    isBestSeller: true,
  },
  {
    id: 7,
    name: "Daily Essential",
    price: 1799,
    category: "Essentials",
    label: "Bestseller",
    description:
      "An easy everyday choice designed to fit seamlessly into your routine.",
    className: "bg-[#e7edf0]",
    isBestSeller: true,
  },
  {
    id: 8,
    name: "The Essential Edit",
    price: 2499,
    category: "Signature",
    label: "Bestseller",
    description:
      "A considered Ostrin essential combining modern design with everyday comfort.",
    className: "bg-[#ededeb]",
    isBestSeller: true,
  },
  {
    id: 9,
    name: "Minimal Form",
    price: 2199,
    category: "Minimal",
    description:
      "A minimal design focused on clean details and effortless styling.",
    className: "bg-[#e8ecec]",
  },
  {
    id: 10,
    name: "Ostrin Daily",
    price: 1599,
    category: "Essentials",
    description:
      "An uncomplicated everyday piece made for modern living.",
    className: "bg-[#e9f0ed]",
  },
  {
    id: 11,
    name: "Studio Classic",
    price: 2399,
    category: "Classics",
    description:
      "A polished classic with a subtle contemporary edge.",
    className: "bg-[#e8e9e6]",
  },
  {
    id: 12,
    name: "Modern Signature",
    price: 2699,
    category: "Signature",
    label: "New",
    description:
      "A refined signature design that represents the modern Ostrin aesthetic.",
    className: "bg-[#e5eef2]",
    isNew: true,
  },
];

export const categories = [
  "All",
  "Essentials",
  "Classics",
  "Signature",
  "Minimal",
];