import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../api';
import { getImageUrl } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import './Deals.css';

export default function Deals() {
    const [dealProducts, setDealProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        try {
            setLoading(true);
            const data = await products.getAll({ sort: 'price_desc', limit: 50 });
            // Filter products with sale prices
            const onSale = data.products?.filter(p => p.sale_price && p.sale_price < p.base_price) || [];
            setDealProducts(onSale);
        } catch (error) {
            console.error('Load deals error:', error);
            toast.error('Failed to load deals');
        } finally {
            setLoading(false);
        }
    };

    const calculateDiscount = (basePrice, salePrice) => {
        const discount = ((basePrice - salePrice) / basePrice) * 100;
        return Math.round(discount);
    };

    if (loading) {
        return (
            <div className="deals-page">
                <div className="container">
                    <div className="loading">Loading deals...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="deals-page">
            <div className="container">
                <div className="page-header">
                    <h1>🔥 Hot Deals</h1>
                    <p>Save big on these amazing products!</p>
                </div>

                {dealProducts.length === 0 ? (
                    <div className="no-deals">
                        <h3>No deals available right now</h3>
                        <p>Check back soon for amazing offers!</p>
                        <Link to="/products" className="btn btn-primary">Browse All Products</Link>
                    </div>
                ) : (
                    <div className="deals-grid">
                        {dealProducts.map(product => (
                            <Link key={product.id} to={`/products/${product.slug}`} className="deal-card">
                                <div className="deal-badge">
                                    {calculateDiscount(product.base_price, product.sale_price)}% OFF
                                </div>
                                <div className="deal-image">
                                    {product.images?.[0] ? (
                                        <img src={getImageUrl(product.images[0])} alt={product.name} />
                                    ) : (
                                        <div className="no-image">📷</div>
                                    )}
                                </div>
                                <div className="deal-info">
                                    <h3>{product.name}</h3>
                                    <div className="deal-prices">
                                        <span className="sale-price">ETB {Number(product.sale_price).toFixed(2)}</span>
                                        <span className="original-price">ETB {Number(product.base_price).toFixed(2)}</span>
                                    </div>
                                    <div className="savings">
                                        Save ETB {(product.base_price - product.sale_price).toFixed(2)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
