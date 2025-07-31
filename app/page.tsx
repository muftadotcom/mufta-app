'use client'; // This directive is necessary for using React hooks in Next.js App Router

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, ShoppingCart, User, Menu, X, Gift, Star, Ticket, Zap, Award, Mail, Phone, Globe, LogOut, ChevronDown, Loader2, Plus, Minus, Trash2, CheckCircle, ArrowLeft, Filter, Share2, Heart, Clock, Download, ThumbsUp, Bookmark, Package, ChevronRight, RotateCw, Users, Store, Globe2, UploadCloud, FileText, Camera, LayoutDashboard, Eye, MousePointerClick, Wallet, BarChart2, Tag, Info, ListChecks, Image as ImageIcon, Check, MoreVertical, Edit, Power, ArrowDownCircle, ArrowUpCircle, Settings, Bell, Shield, CheckCircle2, XCircle, UserX, MessageSquare, Send, Sparkles, Building, Phone as PhoneIcon, Palette, Newspaper, Code, QrCode, Home, Megaphone, TrendingUp, Stamp, Bot, StarIcon, LifeBuoy, HelpCircle, Facebook, Twitter, Instagram } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


// --- Type Definitions ---
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; };
type PageParams = { dealId?: number; vendorSlug?: string; [key: string]: any; };
type PageState = { name: string; params: PageParams; };
type Category = { id: number; name: string; };
type DynamicCategory = { id: string; name: string; icon: React.ReactElement; };
type Deal = { id: number; vendor: string; title: string; price: number; type: string; imageUrl: string; city: string; category: string; description: string; rules: string; stock: number; sold: number; status: string; endDate: Date; };
type CartItem = Deal & { quantity: number };
type Order = { id: string; date: string; status: string; items: CartItem[]; total: number };
type Vendor = { id: number; name: string; slug: string; city: string; type: string; status: string; joined: string; heroImageUrl?: string; businessDescription?: string; };
type Refund = { id: number; orderId: string; vendor: string; amount: number; reason: string; status: string; date: string; };
type Banner = { id: number; name: string; position: string; city: string; status: boolean; imageUrl: string; };
type Customer = { id: number; name: string; email: string; city: string; totalOrders: number; totalPoints: number; joined: string; };
type Reward = { id: number; title: string; points: number; vendor: string; imageUrl: string; };
type StampCard = { id: number; vendor: string; title: string; totalStamps: number; currentStamps: number; icon: string; };
type Feedback = { id: number; customer: string; rating: number; comment: string; date: string; };
type Faq = { id: number; question: string; answer: string; };
type VendorOrder = Order & { customer: string; item: CartItem; };

// --- Mock Data ---
const initialCategories: Category[] = [ { id: 1, name: 'Coupons' }, { id: 2, name: 'Gifts' }, { id: 3, name: 'Spins' }, { id: 4, name: 'Scratches' }, { id: 5, name: 'Draws' }, ];
const allDeals: Deal[] = [ { id: 1, vendor: 'Pizza Planet', title: 'Buy 1 Get 1 Free Large Pizza', price: 0, type: 'Free Coupon', imageUrl: 'https://placehold.co/600x400/2E1065/FFFFFF?text=Pizza+Deal', city: 'Gujranwala', category: 'coupons', description: 'Enjoy two large pizzas for the price of one! Valid on all classic flavors.', rules: 'Not valid with other offers. Dine-in or takeaway only.', stock: 100, sold: 25, status: 'Active', endDate: new Date() }, { id: 2, vendor: 'The Style Hub', title: 'Flat 30% Off on All Jeans', price: 100, type: 'Paid Voucher', imageUrl: 'https://placehold.co/600x400/FF3366/FFFFFF?text=Fashion+Sale', city: 'Gujranwala', category: 'coupons', description: 'Upgrade your wardrobe with our latest collection of denim.', rules: 'Voucher is non-refundable. One voucher per customer.', stock: 50, sold: 10, status: 'Active', endDate: new Date() }, { id: 3, vendor: 'Gadget Galaxy', title: 'Win a new Smartphone!', price: 50, type: 'Enter Draw', imageUrl: 'https://placehold.co/600x400/2E1065/FFFFFF?text=Gadget+Draw', city: 'Gujranwala', category: 'draws', description: 'Get a chance to win the latest smartphone for just PKR 50.', rules: 'Draw will be held on August 1, 2025.', endDate: new Date('2025-08-01T23:59:59'), stock: 1000, sold: 250, status: 'Active' }, { id: 4, vendor: 'Cafe Beans', title: 'Free Coffee Scratch Card', price: 0, type: 'Free Scratchie', imageUrl: 'https://placehold.co/600x400/FF3366/FFFFFF?text=Free+Coffee', city: 'Gujranwala', category: 'scratches', description: 'Try your luck! Scratch the card to reveal your prize.', rules: 'One scratch card per person per day.', stock: 500, sold: 150, status: 'Paused', endDate: new Date() }, { id: 5, vendor: 'Lahore Eatery', title: '25% off on entire bill', price: 0, type: 'Free Coupon', imageUrl: 'https://placehold.co/600x400/2E1065/FFFFFF?text=Lahore+Deal', city: 'Lahore', category: 'coupons', description: 'A delicious 25% discount on your total bill.', rules: 'Minimum spend of PKR 1000 applies.', stock: 200, sold: 80, status: 'Active', endDate: new Date() }, { id: 6, vendor: 'Lahori Bites', title: 'Free Drink with any Burger', price: 0, type: 'Free Coupon', imageUrl: 'https://placehold.co/600x400/FF3366/FFFFFF?text=Lahore+Food', city: 'Lahore', category: 'coupons', description: 'Buy any of our juicy burgers and get a refreshing drink absolutely free.', rules: 'Offer valid for a limited time only.', stock: 300, sold: 120, status: 'Active', endDate: new Date() }, { id: 7, vendor: 'Tech Giveaway', title: 'Win a Gaming Laptop', price: 100, type: 'Enter Draw', imageUrl: 'https://placehold.co/600x400/FF3366/FFFFFF?text=Laptop+Draw', city: 'Gujranwala', category: 'draws', description: 'Enter for a chance to win a high-performance gaming laptop. The ultimate prize for any gamer.', rules: 'Winner selected randomly from all entries.', endDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), stock: 500, sold: 100, status: 'Active' }, ];
const availableCities = ['Gujranwala', 'Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi'];
const initialVendors: Vendor[] = [ { id: 1, name: 'Pizza Planet', slug: 'pizza-planet', city: 'Gujranwala', type: 'Offline', status: 'Active', joined: '2025-01-15', heroImageUrl: 'https://placehold.co/1200x400/2E1065/FFFFFF?text=Pizza+Planet', businessDescription: 'The best pizza in town! We serve authentic Italian pizza with fresh ingredients.' }, { id: 2, name: 'The Style Hub', slug: 'the-style-hub', city: 'Gujranwala', type: 'Online', status: 'Active', joined: '2025-02-20' }, ];
const initialRefunds: Refund[] = [ { id: 1, orderId: 'X7B2A', vendor: 'The Style Hub', amount: 100, reason: 'The voucher code I received was already used when I tried to apply it on the brand\'s website.', status: 'Pending', date: '2025-07-20' }, ];
const initialBanners: Banner[] = [ { id: 1, name: 'Summer Sale Hero', position: 'Hero (Home)', city: 'All', status: true, imageUrl: 'https://placehold.co/1280x400/FF3366/FFFFFF?text=Summer+Sale' }, ];
const initialCustomers: Customer[] = [ { id: 1, name: 'Ali Khan', email: 'ali.khan@example.com', city: 'Lahore', totalOrders: 5, totalPoints: 1250, joined: '2025-01-20' }, ];
const initialRewards: Reward[] = [ { id: 1, title: 'Free Coffee', points: 500, vendor: 'Cafe Beans', imageUrl: 'https://placehold.co/600x400/FFC700/000000?text=Free+Coffee' }, ];
const initialStampCards: StampCard[] = [ { id: 1, vendor: 'Cafe Beans', title: 'Free Coffee', totalStamps: 10, currentStamps: 4, icon: '☕' }, ];
const initialFeedback: Feedback[] = [ { id: 1, customer: 'Ali Khan', rating: 5, comment: 'Great service and amazing pizza!', date: '2025-07-22' }, ];
const initialFaqs: Faq[] = [ { id: 1, question: 'How do I earn loyalty points?', answer: 'You can earn loyalty points by making purchases at participating vendors.' }, ];

// --- Zustand Store Simulation ---
const useStore = <T,>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] => { 
  const [store, setStore] = useState(initialState); 
  return [store, setStore]; 
};

// --- Gemini API Helper ---
const callGemini = async (prompt: string): Promise<string> => {
  // In a real app, this would make a fetch call to the Gemini API
  console.log("Gemini Prompt:", prompt);
  // Simulate a delay and a plausible response
  await new Promise(res => setTimeout(res, 1500));
  return "• 🍕 **BOGO Pizza:** Get two large pizzas, pay for one!\n• 🏙️ **City Center:** Perfect for a meal in Gujranwala.\n• 🏃 **Grab it Fast:** This is a limited-time offer for dine-in or takeaway.";
};

// --- Helper Components ---
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => { if (!isOpen) return null; return <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4" onClick={onClose}><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}><div className="flex justify-end p-2"><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-6 h-6"/></button></div>{children}</div></div>; };
const CitySelector = ({ onSelectCity, cities }: { onSelectCity: (city: string) => void, cities: string[] }) => ( <> <div className="text-center px-6 pb-4 border-b dark:border-gray-700"><h2 className="text-2xl font-bold">Select Your City</h2></div><div className="p-6"><div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{cities.map((city) => ( <button key={city} onClick={() => onSelectCity(city)} className="w-full text-center px-4 py-3 border dark:border-gray-600 rounded-lg font-medium hover:border-pink-500 hover:text-pink-600 dark:hover:border-pink-500 dark:hover:text-pink-500 transition-colors">{city}</button>))}</div></div></> );
const AuthFlow = ({ onLoginSuccess, primaryColor, secondaryColor }: { onLoginSuccess: (user: any) => void, primaryColor: string, secondaryColor: string }) => { const [step, setStep] = useState('prompt'); const [identifier, setIdentifier] = useState(''); const handleContinue = (e: React.FormEvent) => { e.preventDefault(); setStep('loading'); setTimeout(() => setStep('otp'), 1500); }; const handleVerify = (e: React.FormEvent) => { e.preventDefault(); setStep('loading'); setTimeout(() => { let userType = 'shopper'; if (identifier === 'vendor@mufta.pk') userType = 'vendor'; if (identifier === 'admin@mufta.pk') userType = 'admin'; onLoginSuccess({ name: userType === 'vendor' ? 'Pizza Planet' : userType === 'admin' ? 'Super Admin' : 'Shopper', email: identifier, type: userType }); }, 1500); }; return <div className="p-8">{step === 'loading' && <div className="flex flex-col items-center justify-center h-48"><Loader2 className="w-12 h-12 animate-spin" style={{ color: primaryColor }} /></div>}{step === 'prompt' && <><h2 className="text-2xl font-bold text-center">Login or Sign Up</h2><p className="text-center text-gray-500 mt-2">Hint: use 'vendor@mufta.pk' or 'admin@mufta.pk'</p><form onSubmit={handleContinue} className="mt-8 space-y-6"><input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email or Phone Number" required className="w-full px-4 py-3 border dark:border-gray-600 bg-transparent rounded-lg focus:ring-2 focus:ring-pink-500" /><button type="submit" className="w-full py-3 text-white font-semibold rounded-lg" style={{ backgroundColor: primaryColor }}>Continue</button></form></>}{step === 'otp' && <><h2 className="text-2xl font-bold text-center">Verify Your Identity</h2><p className="text-center mt-2">An OTP was sent to <span className="font-semibold">{identifier}</span></p><form onSubmit={handleVerify} className="mt-8 space-y-6"><div className="flex justify-center space-x-2">{[...Array(6)].map((_, i) => <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-2xl font-bold border dark:border-gray-600 bg-transparent rounded-lg focus:ring-2 focus:ring-pink-500" />)}</div><button type="submit" className="w-full py-3 text-white font-semibold rounded-lg" style={{ backgroundColor: secondaryColor }}>Verify OTP</button></form></>}</div>; };
const UserProfile = ({ user, onLogout, navigateTo }: { user: any, onLogout: () => void, navigateTo: (page: string) => void }) => { const [isOpen, setIsOpen] = useState(false); return <div className="relative"><button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700"><User className="w-6 h-6" /><ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"><div className="px-4 py-3 border-b dark:border-gray-700"><p className="font-semibold">{user.name}</p><p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.type} Account</p></div>{user.type === 'vendor' ? (<button onClick={() => {setIsOpen(false); navigateTo('vendor_dashboard');}} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><LayoutDashboard className="w-4 h-4"/>Vendor Dashboard</button>) : user.type === 'admin' ? (<button onClick={() => {setIsOpen(false); navigateTo('admin_dashboard');}} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><Shield className="w-4 h-4"/>Admin Panel</button>) : (<><button onClick={() => {setIsOpen(false); navigateTo('orders');}} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><ShoppingCart className="w-4 h-4"/>My Orders</button><button onClick={() => {setIsOpen(false); navigateTo('favorites');}} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><Heart className="w-4 h-4"/>My Favorites</button><button onClick={() => {setIsOpen(false); navigateTo('loyalty');}} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><Award className="w-4 h-4"/>Loyalty & Points</button></>)}<button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"><LogOut className="w-4 h-4" /><span>Logout</span></button></div>}</div>; };
const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, primaryColor, handleCheckout }: { isOpen: boolean, onClose: () => void, cart: any[], updateQuantity: (id: number, q: number) => void, removeFromCart: (id: number) => void, primaryColor: string, handleCheckout: () => void }) => { const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]); return <><div className={`fixed inset-0 bg-black z-[90] transition-opacity ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`} onClick={onClose}></div><div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-[100] transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}><div className="flex items-center justify-between p-6 border-b dark:border-gray-700"><h2 className="text-2xl font-bold">Your Cart</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X /></button></div>{cart.length === 0 ? <div className="flex-grow flex flex-col items-center justify-center"><ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600" /><h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3><button onClick={onClose} className="mt-6 px-6 py-3 font-semibold text-white rounded-lg" style={{backgroundColor: primaryColor}}>Start Shopping</button></div> : <><div className="flex-grow overflow-y-auto p-6 space-y-4">{cart.map(item => <div key={item.id} className="flex items-start space-x-4"><img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-lg object-cover" /><div className="flex-grow"><h4 className="font-semibold">{item.title}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{item.vendor}</p><p className="text-sm font-bold mt-1" style={{color: primaryColor}}>{item.price === 0 ? 'Free' : `PKR ${item.price}`}</p></div><div className="flex flex-col items-end space-y-2"><div className="flex items-center border dark:border-gray-600 rounded-md"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md"><Minus className="w-4 h-4" /></button><span className="px-3 text-sm">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md"><Plus className="w-4 h-4" /></button></div><button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div></div>)}</div><div className="p-6 border-t dark:border-gray-700"><div className="flex justify-between items-center text-lg font-semibold"><span>Subtotal</span><span>PKR {subtotal.toFixed(2)}</span></div><button onClick={handleCheckout} className="w-full mt-4 py-3 text-white font-bold rounded-lg text-lg" style={{backgroundColor: primaryColor}}>Proceed to Checkout</button></div></> }</div></>; };
const DealCard = ({ deal, onAddToCart, isInCart, primaryColor, onCardClick }: { deal: any, onAddToCart: (deal: any) => void, isInCart: boolean, primaryColor: string, onCardClick: (id: number) => void }) => ( <div onClick={() => onCardClick(deal.id)} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform flex flex-col cursor-pointer"><div className="relative"><img src={deal.imageUrl} alt={deal.title} className="w-full h-48 object-cover" /><div className="absolute top-2 left-2 bg-pink-100 text-pink-800 text-xs font-semibold px-2 py-1 rounded-full">{deal.type}</div></div><div className="p-4 flex flex-col flex-grow"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">{deal.vendor}</p><h3 className="mt-1 text-lg font-semibold flex-grow">{deal.title}</h3><div className="mt-4 flex justify-between items-center"><p className="text-lg font-bold" style={{color: primaryColor}}>{deal.price === 0 ? 'Free' : `PKR ${deal.price}`}</p><button onClick={(e) => { e.stopPropagation(); if (!isInCart) onAddToCart(deal); }} disabled={isInCart} className={`px-3 py-2 text-sm font-medium text-white rounded-md transition-colors ${isInCart ? 'bg-green-500 cursor-not-allowed' : 'hover:bg-pink-700'}`} style={!isInCart ? {backgroundColor: primaryColor} : {}}>{isInCart ? <CheckCircle className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}</button></div></div></div> );
const InstallPwaPrompt = ({ onInstall, onDismiss }: { onInstall: () => void, onDismiss: () => void }) => ( <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up"><div className="max-w-xl mx-auto bg-gray-800 text-white rounded-2xl shadow-2xl flex items-center justify-between p-4"><div className="flex items-center space-x-4"><div className="bg-pink-600 p-3 rounded-xl"><ThumbsUp className="w-6 h-6 text-white"/></div><div><h4 className="font-bold">Get the Full Experience!</h4><p className="text-sm text-gray-300">Install Mufta on your device for faster access.</p></div></div><div className="flex items-center space-x-3"><button onClick={onDismiss} className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700">Later</button><button onClick={onInstall} className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700"><Download className="w-4 h-4"/>Install</button></div></div><style>{`@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } } .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }`}</style></div> );
const DealCardSkeleton = () => ( <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse"><div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div><div className="p-4"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div><div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div><div className="flex justify-between items-center"><div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div><div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div></div></div></div> );

// --- Page Components ---
const HomePage = ({ setPage, deals, onAddToCart, cart, primaryColor, navigateToDeal, navigateTo, categories, isLoading, currentCity }: { setPage: (page: string) => void, deals: any[], onAddToCart: (deal: any) => void, cart: any[], primaryColor: string, navigateToDeal: (id: number) => void, navigateTo: (page: string) => void, categories: any[], isLoading: boolean, currentCity: string }) => ( <> <section className="relative py-20 md:py-32 bg-gray-800 text-white text-center" style={{backgroundImage: 'linear-gradient(rgba(46, 16, 101, 0.8), rgba(46, 16, 101, 0.8)), url(https://placehold.co/1200x400/FF3366/FFFFFF?text=Mufta+Banner)'}}><h1 className="text-4xl md:text-5xl font-extrabold">Welcome to Muffta in {currentCity}!</h1><p className="mt-4 text-lg text-gray-300">Your one-stop shop for the best deals and rewards.</p></section> <section className="py-16 bg-white dark:bg-gray-800"><div className="max-w-7xl mx-auto px-4"><div className="text-center"><h2 className="text-3xl font-extrabold">What are you looking for?</h2></div><div className="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">{categories.map((cat) => ( <button key={cat.id} onClick={() => navigateTo(cat.id)} className="group flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"><div className="p-4 rounded-full" style={{backgroundColor: primaryColor, color: 'white'}}>{React.cloneElement(cat.icon, {})}</div><p className="mt-4 text-lg font-semibold">{cat.name}</p></button>))}</div></div></section> <section className="py-16 bg-gray-50 dark:bg-gray-900"><div className="max-w-7xl mx-auto px-4"><div className="flex justify-between items-center mb-12"><h2 className="text-3xl font-extrabold">Top Deals in {deals[0]?.city || '...'}</h2><button onClick={() => navigateTo('coupons')} className="text-lg font-semibold" style={{color: primaryColor}}>View All &rarr;</button></div><div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">{isLoading ? Array.from({length: 4}).map((_, i) => <DealCardSkeleton key={i} />) : deals.slice(0, 4).map((deal) => <DealCard key={deal.id} deal={deal} onAddToCart={onAddToCart} isInCart={cart.some(item => item.id === deal.id)} primaryColor={primaryColor} onCardClick={navigateToDeal} />)}</div></div></section><section className="py-20" style={{backgroundColor: primaryColor}}><div className="max-w-4xl mx-auto text-center px-4"><h2 className="text-3xl font-extrabold text-white sm:text-4xl">Got a Business? Reach Thousands of Shoppers</h2><p className="mt-4 text-lg text-pink-100">Join Mufta to list your deals, attract new customers, and grow your sales. It's free to get started.</p><button onClick={() => navigateTo('vendor_register')} className="mt-8 inline-block bg-white text-pink-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100">Become a Vendor</button></div></section> </> );
const CouponsPage = ({ deals, onAddToCart, cart, primaryColor, city, navigateToDeal }: { deals: any[], onAddToCart: (deal: any) => void, cart: any[], primaryColor: string, city: string, navigateToDeal: (id: number) => void }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredDeals = deals.filter(deal => deal.title.toLowerCase().includes(searchTerm.toLowerCase())); return <div className="max-w-7xl mx-auto px-4 py-12"><div className="text-center"><h1 className="text-4xl font-extrabold">Free Coupons in <span style={{color: primaryColor}}>{city}</span></h1></div><div className="my-8 sticky top-20 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 rounded-lg"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Search for coupons..." className="w-full pl-12 pr-4 py-3 border dark:border-gray-600 bg-transparent rounded-lg focus:ring-2 focus:ring-pink-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>{filteredDeals.length > 0 ? <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredDeals.map((deal) => <DealCard key={deal.id} deal={deal} onAddToCart={onAddToCart} isInCart={cart.some(item => item.id === deal.id)} primaryColor={primaryColor} onCardClick={navigateToDeal} />)}</div> : <div className="text-center py-16"><h3 className="text-2xl font-semibold">No Coupons Found</h3></div>}</div>; };
const DealDetailPage = ({ deal, onAddToCart, isInCart, primaryColor, toggleWishlist, isWishlisted, currentUser, openAuthModal }: { deal: any, onAddToCart: (deal: any) => void, isInCart: boolean, primaryColor: string, toggleWishlist: (id: number) => void, isWishlisted: boolean, currentUser: any, openAuthModal: () => void }) => { const [summary, setSummary] = useState(''); const [isSummaryLoading, setIsSummaryLoading] = useState(false); const handleGenerateSummary = async () => { setIsSummaryLoading(true); const prompt = `Summarize the following deal in 3 short bullet points for a shopper. Use emojis. Deal Title: "${deal.title}", Description: "${deal.description}", Rules: "${deal.rules}".`; const result = await callGemini(prompt); setSummary(result); setIsSummaryLoading(false); }; if (!deal) return <div className="text-center py-20">Deal not found.</div>; const handleWishlistClick = () => { if(currentUser) { toggleWishlist(deal.id); } else { openAuthModal(); } }; return <div className="bg-white dark:bg-gray-800"><div className="max-w-7xl mx-auto px-4 py-12"><div className="grid md:grid-cols-2 gap-12 items-start"><div><img src={deal.imageUrl} alt={deal.title} className="w-full rounded-2xl shadow-xl aspect-video object-cover"/></div><div className="space-y-6"><span className="inline-block bg-pink-100 text-pink-800 text-sm font-semibold px-3 py-1 rounded-full">{deal.type}</span><h1 className="text-4xl font-extrabold">{deal.title}</h1><p className="text-lg text-gray-500 dark:text-gray-400">Offered by <span className="font-semibold" style={{color: primaryColor}}>{deal.vendor}</span></p><div className="mt-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/20"><button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="flex items-center gap-2 font-semibold text-pink-600 disabled:opacity-50">{isSummaryLoading ? <Loader2 className="animate-spin w-5 h-5"/> : <Sparkles className="w-5 h-5"/>}{isSummaryLoading ? 'Generating...' : '✨ Quick Summary'}</button>{summary && <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{summary}</div>}</div><div className="mt-6"><h3 className="text-xl font-bold mb-2">Description</h3><p className="text-gray-600 dark:text-gray-300">{deal.description}</p></div><div className="mt-6"><h3 className="text-xl font-bold mb-2">Rules & Conditions</h3><p className="text-sm text-gray-500 dark:text-gray-400">{deal.rules}</p></div><div className="mt-8 flex flex-col sm:flex-row gap-4"><button onClick={() => !isInCart && onAddToCart(deal)} disabled={isInCart} className={`w-full flex items-center justify-center gap-2 py-4 px-6 text-lg font-bold text-white rounded-lg transition-colors ${isInCart ? 'bg-green-500 cursor-not-allowed' : 'hover:bg-pink-700'}`} style={!isInCart ? {backgroundColor: primaryColor} : {}}>{isInCart ? <><CheckCircle/> Added</> : `Grab for ${deal.price === 0 ? 'Free' : `PKR ${deal.price}`}`}</button><button onClick={handleWishlistClick} className={`w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-6 text-lg font-bold rounded-lg border-2 ${isWishlisted ? 'border-pink-500 bg-pink-50 text-pink-600 dark:bg-pink-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Heart className={`w-6 h-6 transition-all ${isWishlisted ? 'fill-current' : ''}`} /></button></div></div></div></div></div>; };
const FavoritesPage = ({ wishlist, onAddToCart, cart, primaryColor, navigateToDeal, removeWishlist }: { wishlist: any[], onAddToCart: (deal: any) => void, cart: any[], primaryColor: string, navigateToDeal: (id: number) => void, removeWishlist: (id: number) => void }) => ( <div className="max-w-7xl mx-auto px-4 py-12"><div className="text-center mb-12"><h1 className="text-4xl font-extrabold">My Favorites</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">Deals you've saved for later.</p></div>{wishlist.length > 0 ? <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{wishlist.map((deal) => ( <div key={deal.id} className="relative group"><DealCard deal={deal} onAddToCart={onAddToCart} isInCart={cart.some(item => item.id === deal.id)} primaryColor={primaryColor} onCardClick={navigateToDeal} /><button onClick={() => removeWishlist(deal.id)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5"/></button></div>))}</div> : <div className="text-center py-16 border-2 border-dashed dark:border-gray-700 rounded-lg"><Heart className="mx-auto h-12 w-12 text-gray-400" /><h3 className="mt-2 text-xl font-semibold">Nothing saved yet!</h3><p className="mt-1 text-gray-500 dark:text-gray-400">Click the heart icon on a deal to save it here.</p></div>}</div> );
const OrdersPage = ({ orders, primaryColor }: { orders: any[], primaryColor: string }) => { const getStatusColor = (status: string) => { switch (status) { case 'Delivered': return 'bg-green-100 text-green-800'; case 'Processing': return 'bg-yellow-100 text-yellow-800'; case 'Cancelled': return 'bg-red-100 text-red-800'; default: return 'bg-gray-100 text-gray-800'; } }; return <div className="max-w-7xl mx-auto px-4 py-12"><div className="text-center mb-12"><h1 className="text-4xl font-extrabold">My Orders</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">Your history of purchased deals and vouchers.</p></div>{orders.length > 0 ? <div className="space-y-8">{orders.map((order) => ( <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"><div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div className="flex-grow"><p className="font-semibold text-lg">Order ID: <span className="font-mono" style={{color: primaryColor}}>#{order.id}</span></p><p className="text-sm text-gray-500 dark:text-gray-400">Date: {order.date}</p></div><div className="flex items-center gap-4"><span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span><button className="text-sm font-semibold" style={{color: primaryColor}}>View Details <ChevronRight className="inline w-4 h-4"/></button></div></div><div className="p-4 space-y-4 divide-y dark:divide-gray-700">{order.items.map((item: any) => ( <div key={item.id} className="flex items-center gap-4 pt-4 first:pt-0"><img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-md object-cover"/><div><p className="font-semibold">{item.title}</p><p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p></div><p className="ml-auto font-semibold">PKR {(item.price * item.quantity).toFixed(2)}</p></div>))}</div></div>))}</div> : <div className="text-center py-16 border-2 border-dashed dark:border-gray-700 rounded-lg"><Package className="mx-auto h-12 w-12 text-gray-400" /><h3 className="mt-2 text-xl font-semibold">No orders yet!</h3><p className="mt-1 text-gray-500 dark:text-gray-400">Your purchased deals will appear here.</p></div>}</div>; };
const SpinsPage = ({ primaryColor, secondaryColor }: { primaryColor: string, secondaryColor: string }) => { const segments = [ { text: "10% Off", color: "#FF3366" }, { text: "Try Again", color: "#2E1065" }, { text: "Free Drink", color: "#FFC700" }, { text: "20% Off", color: "#FF3366" }, { text: "Better Luck!", color: "#2E1065" }, { text: "Free Fries", color: "#FFC700" }, { text: "50% Off", color: "#FF3366" }, { text: "Nothing", color: "#2E1065" }, ]; const [isSpinning, setIsSpinning] = useState(false); const [rotation, setRotation] = useState(0); const [result, setResult] = useState<string | null>(null); const handleSpin = () => { if (isSpinning) return; setIsSpinning(true); setResult(null); const randomSegment = Math.floor(Math.random() * segments.length); const prize = segments[randomSegment]; const degreesPerSegment = 360 / segments.length; const prizeAngle = randomSegment * degreesPerSegment; const randomOffset = (Math.random() - 0.5) * degreesPerSegment * 0.8; const finalAngle = 360 * 5 + prizeAngle + randomOffset; setRotation(finalAngle); setTimeout(() => { setIsSpinning(false); setResult(prize.text); }, 5000); }; return <div className="max-w-4xl mx-auto px-4 py-12 text-center"><h1 className="text-4xl font-extrabold">Spin to Win!</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">Try your luck with our daily spin. You might win an amazing prize!</p><div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto my-12 flex items-center justify-center"><div className="absolute w-full h-full transition-transform duration-[5000ms] ease-out" style={{ transform: `rotate(${rotation}deg)` }}>{segments.map((segment, index) => ( <div key={index} className="absolute w-1/2 h-1/2 origin-bottom-right" style={{ transform: `rotate(${index * (360 / segments.length)}deg)` }}><div className="absolute -left-full w-full h-full skew-y-[30deg] origin-top-right" style={{ transform: `rotate(${-(360 / segments.length) / 2}deg)`, backgroundColor: segment.color, color: segment.color === '#2E1065' ? 'white' : 'black' }}><span className="absolute w-full h-full flex items-center justify-center text-sm font-bold" style={{transform: `skewY(-30deg) rotate(${(360 / segments.length) / 2}deg)`}}>{segment.text}</span></div></div>))}</div><div className="absolute w-12 h-12 bg-white rounded-full border-4 border-gray-800 z-10"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-x-8 border-x-transparent border-b-[16px] border-b-gray-800 z-20"></div></div>{result && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-8"><p className="font-bold">Congratulations!</p><p>You won: {result}</p></div>}<button onClick={handleSpin} disabled={isSpinning} className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto py-4 px-6 text-xl font-bold text-white rounded-lg shadow-lg transition-transform hover:scale-105 disabled:opacity-50" style={{ backgroundColor: secondaryColor }}>{isSpinning ? <Loader2 className="animate-spin" /> : <RotateCw />}{isSpinning ? 'Spinning...' : 'Spin the Wheel'}</button><p className="text-sm text-gray-500 dark:text-gray-400 mt-4">You have 1 free spin remaining today.</p></div>; };
const ScratchesPage = ({ primaryColor }: { primaryColor: string }) => { const canvasRef = useRef<HTMLCanvasElement>(null); const [isScratched, setIsScratched] = useState(false); const [prize, setPrize] = useState("Better Luck Next Time!"); const prizes = ["Free Burger", "20% Off", "Try Again", "Free Ice Cream"]; const setupCanvas = () => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; const rect = canvas.getBoundingClientRect(); canvas.width = rect.width; canvas.height = rect.height; ctx.fillStyle = '#c0c0c0'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalCompositeOperation = 'destination-out'; }; useEffect(() => { setPrize(prizes[Math.floor(Math.random() * prizes.length)]); setupCanvas(); window.addEventListener('resize', setupCanvas); return () => window.removeEventListener('resize', setupCanvas); }, []); const handleScratch = (e: any) => { const canvas = canvasRef.current; if (!canvas || isScratched) return; const ctx = canvas.getContext('2d'); if (!ctx) return; const rect = canvas.getBoundingClientRect(); const pos = { x: (e.clientX || e.touches[0].clientX) - rect.left, y: (e.clientY || e.touches[0].clientY) - rect.top }; ctx.beginPath(); ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI); ctx.fill(); checkScratchCompletion(); }; const checkScratchCompletion = () => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); const pixelData = imageData.data; let transparentPixels = 0; for (let i = 3; i < pixelData.length; i += 4) { if (pixelData[i] === 0) { transparentPixels++; } } const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100; if (percentage > 50) { setIsScratched(true); } }; const resetCard = () => { setIsScratched(false); setPrize(prizes[Math.floor(Math.random() * prizes.length)]); setTimeout(setupCanvas, 0); }; return <div className="max-w-4xl mx-auto px-4 py-12 text-center"><h1 className="text-4xl font-extrabold">Scratch & Win!</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">Scratch the card to reveal your prize. Good luck!</p><div className="relative w-full max-w-md h-64 mx-auto my-12 rounded-2xl shadow-xl overflow-hidden bg-yellow-300 dark:bg-yellow-600"><div className="absolute inset-0 flex items-center justify-center"><p className="text-3xl font-bold text-yellow-800 dark:text-yellow-100">{prize}</p></div><canvas ref={canvasRef} className={`absolute inset-0 w-full h-full cursor-grab ${isScratched ? 'opacity-0 transition-opacity duration-500' : ''}`} onMouseDown={(e) => { const target = e.currentTarget; const moveHandler = (moveEvent: any) => handleScratch(moveEvent); target.addEventListener('mousemove', moveHandler); target.addEventListener('mouseup', () => target.removeEventListener('mousemove', moveHandler), { once: true }); }} onTouchMove={handleScratch} /></div>{isScratched && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-8"><p className="font-bold">You revealed the prize!</p><p>You got: {prize}</p></div>}<button onClick={resetCard} className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto py-4 px-6 text-xl font-bold text-white rounded-lg shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: primaryColor }}><Star />Get New Card</button><p className="text-sm text-gray-500 dark:text-gray-400 mt-4">You have 2 free scratch cards remaining today.</p></div>; };
const DrawsPage = ({ draws, primaryColor, secondaryColor, userEntries, enterDraw }: { draws: any[], primaryColor: string, secondaryColor: string, userEntries: any, enterDraw: (id: number) => void }) => {
    const Countdown = ({ endDate }: { endDate: Date }) => {
        const calculateTimeLeft = (): TimeLeft => {
            const difference = +new Date(endDate) - +new Date();
            if (difference > 0) {
                return { days: Math.floor(difference / (1000 * 60 * 60 * 24)), hours: Math.floor((difference / (1000 * 60 * 60)) % 24), minutes: Math.floor((difference / 1000 / 60) % 60), seconds: Math.floor((difference / 1000) % 60) };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };
        const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
        useEffect(() => { const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000); return () => clearTimeout(timer); });
        
        const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
             if (value === 0 && interval !== 'seconds' && timeLeft.days === 0 && (interval !== 'minutes' || timeLeft.hours === 0)) return null;
            return <div key={interval} className="flex flex-col items-center"><span className="text-2xl font-bold">{String(value).padStart(2, '0')}</span><span className="text-xs uppercase">{interval}</span></div>;
        }).filter(Boolean);
        
        return timerComponents.length ? <div className="flex gap-4">{timerComponents}</div> : <span>Draw has ended!</span>;
    };

    return <div className="max-w-7xl mx-auto px-4 py-12"><div className="text-center mb-12"><h1 className="text-4xl font-extrabold tracking-tight">Prize Draws</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">Enter for a chance to win amazing prizes from top vendors!</p></div><div className="grid md:grid-cols-2 gap-8">{draws.map(draw => { const myEntries = userEntries[draw.id] || 0; return ( <div key={draw.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"><img src={draw.imageUrl} alt={draw.title} className="w-full h-64 object-cover"/><div className="p-6 flex flex-col flex-grow"><h3 className="text-2xl font-bold">{draw.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">by {draw.vendor}</p><div className="my-6 flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><p className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400">Draw Ends In</p><div className="text-gray-900 dark:text-white mt-2"><Countdown endDate={draw.endDate}/></div></div><div className="flex justify-between items-center text-sm my-4"><div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Users className="w-5 h-5 text-gray-400"/><p>1,234 Entries</p></div>{myEntries > 0 && <div className="font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">You have {myEntries} entries</div>}</div><button onClick={() => enterDraw(draw.id)} className="w-full py-3 text-lg font-bold text-white rounded-lg shadow-md transition-transform hover:scale-105" style={{backgroundColor: secondaryColor}}>Enter Draw (PKR {draw.price})</button></div></div> )})}</div></div>;
};
const VendorRegistrationPage = ({ primaryColor, secondaryColor, navigateTo }: { primaryColor: string, secondaryColor: string, navigateTo: (page: string) => void }) => {
    const [step, setStep] = useState(1);
    const [vendorType, setVendorType] = useState<'offline' | 'online' | null>(null);

    const FileInput = ({ label, icon }: { label: string, icon: React.ReactNode }) => {
        const [fileName, setFileName] = useState('');
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {icon}
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-pink-600 hover:text-pink-500">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{fileName || 'PNG, JPG, PDF up to 5MB'}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h2 className="text-2xl font-bold text-center">Join Our Vendor Network</h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Are you a physical store or an online business?</p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onClick={() => { setVendorType('offline'); setStep(2); }} className="flex flex-col items-center justify-center p-8 border-2 dark:border-gray-600 rounded-lg hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                <Store className="w-12 h-12 mb-4" style={{ color: primaryColor }} />
                                <h3 className="text-xl font-semibold">Offline Store</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Physical shop, restaurant, etc.</p>
                            </button>
                            <button onClick={() => { setVendorType('online'); setStep(2); }} className="flex flex-col items-center justify-center p-8 border-2 dark:border-gray-600 rounded-lg hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                <Globe2 className="w-12 h-12 mb-4" style={{ color: primaryColor }} />
                                <h3 className="text-xl font-semibold">Online Business</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">E-commerce, Shopify store, etc.</p>
                            </button>
                        </div>
                    </>
                );
            case 2:
                return (
                        <>
                            <h2 className="text-2xl font-bold text-center">{vendorType === 'offline' ? 'Offline' : 'Online'} Vendor Details</h2>
                            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Please provide your business details and documents for verification.</p>
                            <form className="mt-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
                                        <input type="text" required className="w-full p-3 border dark:border-gray-600 bg-transparent rounded-lg" placeholder="e.g., Pizza Planet" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                                        <input type="tel" required className="w-full p-3 border dark:border-gray-600 bg-transparent rounded-lg" placeholder="e.g., 03001234567" />
                                    </div>
                                </div>
                                <FileInput label="Trade License" icon={<FileText className="mx-auto h-12 w-12 text-gray-400" />} />
                                <FileInput label="CNIC (Front & Back)" icon={<User className="mx-auto h-12 w-12 text-gray-400" />} />
                                {vendorType === 'offline' && <FileInput label="Shop Front Photo" icon={<Camera className="mx-auto h-12 w-12 text-gray-400" />} />}
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center text-sm text-gray-600 dark:text-gray-300">
                                    Captcha Placeholder: In a real app, a Google reCAPTCHA would be here to prevent spam.
                                </div>
                                <button type="submit" className="w-full py-3 text-lg font-bold text-white rounded-lg shadow-md" style={{ backgroundColor: secondaryColor }}>Submit for Review</button>
                            </form>
                        </>
                    );
        }
    };

    return <div className="max-w-4xl mx-auto px-4 py-12"><div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">{step > 1 && <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-6 hover:text-pink-600"><ArrowLeft className="w-4 h-4" /> Back</button>}{renderStep()}</div></div>;
};

// --- Main App Component ---
const MuftaApp = () => {
    // --- State Management ---
    const [page, setPage] = useState<PageState>({ name: 'home', params: {} });
    const [currentCity, setCurrentCity] = useState<string | null>(null);
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showPwaPrompt, setShowPwaPrompt] = useState(false);
    
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [cart, setCart] = useStore<CartItem[]>([]);
    const [wishlist, setWishlist] = useStore<number[]>([]);
    const [orders, setOrders] = useStore<Order[]>([
        { id: 'X7B2A', date: '2025-07-18', status: 'Delivered', items: [{ id: 2, vendor: 'The Style Hub', title: 'Flat 30% Off on All Jeans', price: 100, type: 'Paid Voucher', imageUrl: 'https://placehold.co/600x400/FF3366/FFFFFF?text=Fashion+Sale', city: 'Gujranwala', category: 'coupons', description: 'Upgrade your wardrobe with our latest collection of denim.', rules: 'Voucher is non-refundable. One voucher per customer.', stock: 50, sold: 10, status: 'Active', endDate: new Date(), quantity: 1 }], total: 100 }
    ]);
    const [userEntries, setUserEntries] = useStore<{[key: number]: number}>({ 7: 2 });

    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Theming ---
    const primaryColor = '#FF3366'; // Hot Pink
    const secondaryColor = '#2E1065'; // Deep Indigo

    // --- Dynamic Categories ---
    const dynamicCategories: DynamicCategory[] = [
        { id: 'coupons', name: 'Coupons', icon: <Ticket className="w-8 h-8"/> },
        { id: 'gifts', name: 'Gifts', icon: <Gift className="w-8 h-8"/> },
        { id: 'spins', name: 'Spins', icon: <RotateCw className="w-8 h-8"/> },
        { id: 'scratches', name: 'Scratches', icon: <Star className="w-8 h-8"/> },
        { id: 'draws', name: 'Draws', icon: <Zap className="w-8 h-8"/> },
    ];

    // --- Effects ---
    useEffect(() => {
        const savedCity = localStorage.getItem('mufta-city');
        if (savedCity) {
            setCurrentCity(savedCity);
        } else {
            setIsCityModalOpen(true);
        }
        
        // PWA install prompt logic
        setTimeout(() => {
            if (typeof window !== 'undefined' && !window.matchMedia('(display-mode: standalone)').matches) {
                setShowPwaPrompt(true);
            }
        }, 5000);
    }, []);

    useEffect(() => {
        if (currentCity) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setDeals(allDeals.filter(d => d.city === currentCity));
                setIsLoading(false);
            }, 1000);
        }
    }, [currentCity]);


    // --- Handlers ---
    const handleSelectCity = (city: string) => {
        setCurrentCity(city);
        localStorage.setItem('mufta-city', city);
        setIsCityModalOpen(false);
    };

    const handleLoginSuccess = (user: any) => {
        setCurrentUser(user);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setPage({ name: 'home', params: {} });
    };

    const navigateTo = (name: string, params: PageParams = {}) => {
        setPage({ name, params });
        window.scrollTo(0, 0);
    };
    
    const navigateToDeal = (dealId: number) => navigateTo('deal_detail', { dealId });

    const handleAddToCart = (deal: Deal) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === deal.id);
            if (existingItem) {
                return prevCart.map(item => item.id === deal.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...deal, quantity: 1 }];
        });
        setIsCartOpen(true);
    };
    
    const updateCartQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            setCart(cart.filter(item => item.id !== id));
        } else {
            setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };
    
    const handleCheckout = () => {
        if (!currentUser) {
            setIsCartOpen(false);
            setIsAuthModalOpen(true);
            return;
        }
        const newOrder: Order = {
            id: `MFT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Processing',
            items: cart,
            total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
        };
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
        setIsCartOpen(false);
        navigateTo('orders');
    };

    const toggleWishlist = (dealId: number) => {
        setWishlist(prev => prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]);
    };
    
    const removeWishlist = (dealId: number) => {
        setWishlist(prev => prev.filter(id => id !== dealId));
    };

    const enterDraw = (drawId: number) => {
        if (!currentUser) {
            setIsAuthModalOpen(true);
            return;
        }
        setUserEntries(prev => ({ ...prev, [drawId]: (prev[drawId] || 0) + 1 }));
        // In a real app, you would also handle payment for the draw entry
    };

    // --- Render Logic ---
    const renderPage = () => {
        switch (page.name) {
            case 'home':
                return <HomePage setPage={(catId) => navigateTo(catId)} deals={deals} onAddToCart={handleAddToCart} cart={cart} primaryColor={primaryColor} navigateToDeal={navigateToDeal} navigateTo={navigateTo} categories={dynamicCategories} isLoading={isLoading} currentCity={currentCity || '...'} />;
            case 'coupons':
                return <CouponsPage deals={deals.filter(d => d.category === 'coupons')} onAddToCart={handleAddToCart} cart={cart} primaryColor={primaryColor} city={currentCity || ''} navigateToDeal={navigateToDeal} />;
            case 'deal_detail':
                const deal = allDeals.find(d => d.id === page.params.dealId); // Search all deals, not just city-specific
                return <DealDetailPage deal={deal} onAddToCart={handleAddToCart} isInCart={cart.some(c => c.id === deal?.id)} primaryColor={primaryColor} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(deal?.id || -1)} currentUser={currentUser} openAuthModal={() => setIsAuthModalOpen(true)} />;
            case 'favorites':
                const wishlistedDeals = allDeals.filter(d => wishlist.includes(d.id));
                return <FavoritesPage wishlist={wishlistedDeals} onAddToCart={handleAddToCart} cart={cart} primaryColor={primaryColor} navigateToDeal={navigateToDeal} removeWishlist={removeWishlist} />;
            case 'orders':
                return <OrdersPage orders={orders} primaryColor={primaryColor} />;
            case 'spins':
                return <SpinsPage primaryColor={primaryColor} secondaryColor={secondaryColor} />;
            case 'scratches':
                return <ScratchesPage primaryColor={primaryColor} />;
            case 'draws':
                return <DrawsPage draws={deals.filter(d => d.category === 'draws')} primaryColor={primaryColor} secondaryColor={secondaryColor} userEntries={userEntries} enterDraw={enterDraw} />;
            case 'vendor_register':
                return <VendorRegistrationPage primaryColor={primaryColor} secondaryColor={secondaryColor} navigateTo={navigateTo} />;
            default:
                return <HomePage setPage={(catId) => navigateTo(catId)} deals={deals} onAddToCart={handleAddToCart} cart={cart} primaryColor={primaryColor} navigateToDeal={navigateToDeal} navigateTo={navigateTo} categories={dynamicCategories} isLoading={isLoading} currentCity={currentCity || '...'} />;
        }
    };
    
    const totalCartItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-4">
                             <button onClick={() => navigateTo('home')} className="flex items-center space-x-2">
                                <Gift className="w-8 h-8" style={{color: primaryColor}} />
                                <span className="text-2xl font-bold">Muffta</span>
                            </button>
                            <button onClick={() => setIsCityModalOpen(true)} className="hidden md:flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span className="font-medium">{currentCity || 'Select City'}</span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            {dynamicCategories.map(cat => (
                                <button key={cat.id} onClick={() => navigateTo(cat.name.toLowerCase())} className="font-semibold text-gray-600 dark:text-gray-300 hover:text-pink-600">{cat.name}</button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-4">
                             <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ShoppingCart className="w-6 h-6" />
                                {totalCartItems > 0 && <span className="absolute top-0 right-0 block h-5 w-5 rounded-full text-xs font-medium text-white flex items-center justify-center" style={{backgroundColor: secondaryColor}}>{totalCartItems}</span>}
                            </button>
                            {currentUser ? (
                                <UserProfile user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} />
                            ) : (
                                <button onClick={() => setIsAuthModalOpen(true)} className="font-semibold text-white px-5 py-2 rounded-lg" style={{backgroundColor: primaryColor}}>Login</button>
                            )}
                            <button className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {currentCity ? renderPage() : <div className="flex justify-center items-center h-[calc(100vh-80px)]"><Loader2 className="w-12 h-12 animate-spin" style={{color: primaryColor}}/></div>}
            </main>

            <footer className="bg-gray-800 text-white">
                 <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold">About Mufta</h3>
                            <ul className="mt-4 space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Press</a></li>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">For Vendors</h3>
                            <ul className="mt-4 space-y-2 text-gray-300">
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('vendor_register'); }} className="hover:text-white">Register as Vendor</a></li>
                                <li><a href="#" className="hover:text-white">Vendor Login</a></li>
                                <li><a href="#" className="hover:text-white">Vendor Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Help & Support</h3>
                            <ul className="mt-4 space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white">FAQs</a></li>
                                <li><a href="#" className="hover:text-white">Refund Policy</a></li>
                                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Follow Us</h3>
                            <div className="flex mt-4 space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                                <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                                <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Muffta. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <Modal isOpen={isCityModalOpen} onClose={() => {}}>
                <CitySelector onSelectCity={handleSelectCity} cities={availableCities} />
            </Modal>
            <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
                <AuthFlow onLoginSuccess={handleLoginSuccess} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            </Modal>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateCartQuantity} removeFromCart={removeFromCart} primaryColor={primaryColor} handleCheckout={handleCheckout} />
            {showPwaPrompt && <InstallPwaPrompt onInstall={() => setShowPwaPrompt(false)} onDismiss={() => setShowPwaPrompt(false)} />}
        </div>
    );
};

export default MuftaApp;
