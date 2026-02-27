import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../api';
import toast from 'react-hot-toast';
import './Categories.css';

export default function Categories() {
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categories.getAll();
            setCategoriesList(data || []);
        } catch (error) {
            console.error('Load categories error:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="categories-page">
                <div className="container">
                    <div className="loading">Loading categories...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="categories-page">
            <div className="container">
                <div className="page-header">
                    <h1>Shop by Category</h1>
                    <p>Browse our wide selection of product categories</p>
                </div>

                <div className="categories-grid">
                    {categoriesList.map(category => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className="category-card"
                        >
                            <div className="category-icon">📦</div>
                            <h3>{category.name}</h3>
                            {category.description && <p>{category.description}</p>}
                            {category.product_count > 0 && (
                                <span className="product-count">{category.product_count} products</span>
                            )}
                        </Link>
                    ))}
                </div>

                {categoriesList.length === 0 && (
                    <div className="no-categories">
                        <p>No categories available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
