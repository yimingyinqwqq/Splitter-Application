import React from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import './Button.css'

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

const MenuButton = ({children, type, onClick, buttonStyle, buttonSize}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = STYLES.includes(buttonSize) ? buttonSize : SIZES[0];
    
    return (
        <Link to='/register' className='btn-mobile'>
            <Button
                className={`btn ${checkButtonStyle} ${checkButtonSize}`}
                onClick={onClick}
                type={type}
            >
                {children}
            </Button>
        </Link>
    );
}

export default MenuButton;