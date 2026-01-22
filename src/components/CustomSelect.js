'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import styles from '../styles/CustomSelect.module.css';

/**
 * Premium Custom Select Component
 * @param {Object} props
 * @param {Array} props.options - Array of options { value, label }
 * @param {any} props.value - Current selected value
 * @param {Function} props.onChange - Callback (value) => {}
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Custom class
 * @param {Object} props.style - Custom styles
 */
export default function CustomSelect({
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    className = '',
    style = {}
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Get selected label
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    // Toggle dropdown
    const toggleOpen = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Handle selection
    const handleSelect = (optionValue) => {
        if (value !== optionValue) {
            onChange(optionValue);
        }
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`${styles.selectContainer} ${className}`}
            ref={containerRef}
            style={style}
        >
            <div
                className={`${styles.selectButton} ${isOpen ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
                onClick={toggleOpen}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={!selectedOption ? styles.placeholder : ''}>
                    {displayValue}
                </span>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
                    <FaChevronDown />
                </span>
            </div>

            <ul
                className={`${styles.optionsList} ${isOpen ? styles.open : ''}`}
                role="listbox"
            >
                {options.map((option) => (
                    <li
                        key={option.value}
                        className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                        onClick={() => handleSelect(option.value)}
                        role="option"
                        aria-selected={option.value === value}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
