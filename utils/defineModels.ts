import { Types } from "mongoose";

// Cart
export interface ICart {
  user_id: Types.ObjectId;
  cartItems: Array<Types.ObjectId>;
  total: number;
  is_active: boolean;
}

// User
export interface IUser {
  first_name: string;
  last_name: string;
  password: string;
  phone_number: number;
  email: string;
}

// User address
type AddressType = {
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: number;
  country: string;
  address_type: string;
};
export interface IUserAddress {
  user_id: Types.ObjectId;
  addresses: Array<AddressType>;
}

// Seller
export interface ISeller {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Seller Info
export interface ISellerInfo {
  company_name: string;
  company_type: Types.ObjectId;
  company_website: string;
  phone: string;
  identity_proof: string;
  tax_info: string;
  seller_id: Types.ObjectId;
}

// Seller Orders
type ProductType = {
  item: Types.ObjectId;
  user: Types.ObjectId;
  address: Types.ObjectId;
  isPayable: boolean;
};
export interface ISellerOrders {
  seller: Types.ObjectId;
  products: Array<ProductType>;
}

// Cart-Items
export interface ICartitem {
  seller: Types.ObjectId;
  seller_info_id: Types.ObjectId;
  product: Types.ObjectId;
  product_info: {
    color: string;
    size: string;
    info_type: string;
    thumbnail: string;
  };
  quantity: number;
  price: number;
  is_ordered: boolean;
}

// Discount
export interface IDiscount {
  description: string;
  discount_percentage: number;
  is_active: boolean;
  seller_id: Types.ObjectId;
  products: Array<Types.ObjectId>;
}

// Order
export interface IOrder {
  user: Types.ObjectId;
  cart: Types.ObjectId;
  address: Types.ObjectId;
  payment_status: boolean;
  payment_type: string;
  is_delivered: boolean;
  total: number;
}

// Parent Category
export interface IParentCategory {
  name: string;
  description: string;
}

// Category
export interface ICategory {
  name: string;
  description: string;
  parent_id: Types.ObjectId;
}

// Sub Category
export interface ISubCategory {
  name: string;
  description: string;
  parent_category_id: Types.ObjectId;
  category_id: Types.ObjectId;
}

// Payment
export interface IPayment {}

// Product
type Product = {
  _id: string;
  images: Array<string>;
  color: Array<string>;
  sizes: Array<string>;
  info_types: Array<string>;
  quantity: number;
  price: number;
};
type ProductReview = {
  content: string;
  ratings: number;
  created_at: Date;
  updated_at: Date;
  user_id: Types.ObjectId;
};
export interface IProduct {
  name: string;
  images_info: Array<Product>;
  thumbnail: string;
  description: string;
  seller_id: Types.ObjectId;
  seller_info: Types.ObjectId;
  parent_category_id: Types.ObjectId;
  category_id: Types.ObjectId;
  sub_category_id: Types.ObjectId;
  reviews: Array<ProductReview>;
  discount: Types.ObjectId;
}
