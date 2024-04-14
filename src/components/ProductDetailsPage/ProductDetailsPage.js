import React, { useContext, useEffect } from 'react';
import { Context } from '../../common/Context';
import './ProductDetailsPage.css';
import NavigationBar from '../../common/NavigationBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Rating from '@mui/material/Rating';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}


export default function ProductDetailsPage() {
    const { id } = useContext(Context);
    const [product, setProduct] = React.useState(JSON.parse(localStorage.getItem('product')) || {});
    const [value, setValue] = React.useState(5);
    const [hover, setHover] = React.useState(-1);
    const [limitExceeded, setLimitExceeded] = React.useState(false);
    const {quantity,setQuantity,setId, isPersonAdmin, isLoggedIn} = useContext(Context);

    const adminValue = isPersonAdmin();


    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:3001/api/v1/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    localStorage.setItem('product', JSON.stringify(data));
                } else {
                    throw new Error('Failed to fetch product');
                }
            } catch (error) {
                // Handle error
                console.error('Error fetching product:', error);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    useEffect(() => {
        setQuantity(1);
    },[id,setQuantity]);

    const handleIncrement = () => {
        if (quantity < product.availableItems) {
            setQuantity(quantity + 1);
            setLimitExceeded(false);
        } else {
            setLimitExceeded(true);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setLimitExceeded(false);
        } else {
            setQuantity(1);
        }
    };

    const placeButtonHandler = (id) => {
        setId(id);
      }


    return (
        <div className="full-page">
            <div>
                <NavigationBar loggedIn={isLoggedIn} isAdmin={adminValue} />

                <Card className="product-container" sx={{ backgroundColor: 'rgb(106, 106, 106)', borderRadius: 6 }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <CardMedia
                                component="img"
                                image={product.imageURL || "https://via.placeholder.com/240"}
                                alt={product.name}
                                sx={{ width: '100%', height: '100%' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CardContent sx={{ color: 'white', display: 'flex', flexDirection: 'column', textAlign: 'center', height: '100%' }}>
                                <div>
                                    <Typography gutterBottom variant="h4" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography className="product-description" variant="body2">
                                        Description = {product.description}
                                    </Typography>
                                    <Typography className="product-category" variant="body2">
                                        Category = {product.category}
                                    </Typography>
                                    <Typography className="product-manufacturer" variant="body2">
                                        {product.manufacturer ? (
                                            <>
                                                Manufacturer = {product.manufacturer}
                                            </>
                                        ) : (
                                            <>
                                                Manufacturer = Unknown
                                            </>
                                        )}

                                    </Typography>
                                    <hr />
                                    <Typography className="product-price" variant="h6">
                                        Total : ${quantity * product.price}/-<br />
                                        Inclusive of all tax
                                    </Typography>
                                    <Typography className="product-stock" variant="body2">
                                        Items in Stock = {product.availableItems}
                                    </Typography>
                                    <hr />
                                    <Box
                                        sx={{
                                            width: 200,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Rating
                                            name="hover-feedback"
                                            value={value}
                                            precision={0.5}
                                            getLabelText={getLabelText}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                            onChangeActive={(event, newHover) => {
                                                setHover(newHover);
                                            }}
                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                        {value !== null && (
                                            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                                        )}
                                    </Box>
    
                                    <Link to='/Create-order'>
                                        <Button onClick={()=>placeButtonHandler(product._id)} className="place-order-button" color="inherit" variant="outlined" sx={{ width: '100%', fontSize: 18, borderRadius: 7, color: 'orange' }}>
                                            Place Order
                                        </Button>
                                    </Link>

                                    <div className='quantity'>
                                        <p>Add the quantity</p>
                                        <Button variant="contained" className='decrement-button' onClick={handleDecrement}>-</Button>
                                        {quantity}
                                        <Button variant="contained" className='increment-button' onClick={handleIncrement}>+</Button>
                                        {limitExceeded && (
                                            <Typography variant="body2" className="limit-exceeded">
                                                <br/>
                                                Quantity limit exceeded!
                                            </Typography>
                                        )}
                                    </div>

                                    <div className='group-icons'>
                                        <div className='icon'>
                                            <LocalShippingIcon sx={{ fontSize: 50 }} />
                                            Free Delivery
                                        </div>
                                        <div className='icon'>
                                            <ReplayIcon sx={{ fontSize: 50 }} />
                                            7 Days replacement
                                        </div>
                                        <div className='icon'>
                                            <LockIcon sx={{ fontSize: 50 }} />
                                            Secure Transactions
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </div>
            <footer className="footer">
                <Typography variant="body2" className="footer">
                    ©2024, Upgrad Eshop, shoaib , all rights reserved
                </Typography>
            </footer>
        </div>
    );
}
