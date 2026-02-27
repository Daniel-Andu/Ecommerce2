import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../api';
import { getImageUrl } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import './NewArrivals.css';

export default function NewArrivals() {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNewArrivals();
    }, []);

    const loadNewArrivals = async () => {
        try {
            setLoading(true);
            const data = await products.newArrivals();
            setNewProducts(data || []);
        } catch (error) {
            console.error('Load new arrivals error:', error);
            toast.error('Failed to load new arrivals');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="new-arrivals-page">
                <div className="container">
                    <div className="loading">Loading new arrivals...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="new-arrivals-page">
            <div className="container">
                <div className="page-header">
                    <h1>✨ New Arrivals</h1>
                    <p>Check out our latest products</p>
                </div>

                {newProducts.length === 0 ? (
                    <div className="no-products">
                        <h3>No new arrivals yet</h3>
                        <p>Check back soon for new products!</p>
                        <Link to="/products" className="btn btn-primary">Browse All Products</Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {newProducts.map(product => (
                            <Link key={product.id} to={`/products/${product.slug}`} className="product-card">
                                <div className="new-badge">NEW</div>
                                <div className="product-image">
                                    {product.images?.[0] ? (
                                        <img src={getImageUrl(product.images[0])} alt={product.name} />
                                    ) : (
                                        <div className="no-image">📷</div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <div className="product-price">
                                        {product.sale_price ? (
                                            <>
                                                <span className="sale-price">ETB {Number(product.sale_price).toFixed(2)}</span>
                                                <span className="original-price">ETB {Number(product.base_price).toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="price">ETB {Number(product.base_price).toFixed(2)}</span>
                                        )}
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
