import React, { useContext, useEffect, useState, useCallback } from 'react';
import NavigationBar from '../../common/NavigationBar';
import { Context } from '../../common/Context';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import "./CreateOrderPage.css";
import { TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';


const steps = ['Add Address', 'Select Address', 'Review Order'];

export default function CreateOrderPage() {
    const { id, setId, quantity, setQuantity, token, setToken, isPersonAdmin, isLoggedIn } = useContext(Context);
    const [product, setProduct] = React.useState({});
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [landmark, setLandMark] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const navigate = useNavigate();

    const adminValue = isPersonAdmin();

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:3001/api/v1/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    throw new Error('Failed to fetch product');
                }
            } catch (error) {
                // Handleing the error
                console.error('Error fetching product:', error);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    const fetchAllAddresses = useCallback(async () => {
        if (token) {
            try {
                const rawResponse = await fetch('http://localhost:3001/api/v1/addresses', {
                    method: 'GET',
                    headers: {
                        'x-auth-token': token
                    }
                });

                if (rawResponse.ok) {
                    const data = await rawResponse.json();
                    setAddresses(data);
                } else {
                    console.error('Failed to fetch addresses');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        const storedId = localStorage.getItem('productId');
        const storedQuantity = localStorage.getItem('orderQuantity');
        const storedToken = localStorage.getItem('token');

        if (storedId && !id) {
            setId(storedId);
        }
        if (storedQuantity && !quantity) {
            setQuantity(storedQuantity);
        }
        if (storedToken && !token) {
            setToken(storedToken);
        }

        localStorage.setItem('productId', id);
        localStorage.setItem('orderQuantity', quantity);
        fetchAllAddresses();

    }, [id, setId, quantity, setQuantity, token, setToken, fetchAllAddresses]);

    const handleAddressClick = (addressId, address) => {
        setSelectedAddressId(addressId);
        setSelectedAddress(address);
    };

    async function addAddressHandler(event) {
        event.preventDefault();

        try {
            // Send address data to server by fetch
            const rawResponse = await fetch('http://localhost:3001/api/v1/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    name,
                    street,
                    city,
                    state,
                    landmark,
                    contactNumber,
                    zipCode
                })
            });

            // Handling the response from the server
            if (rawResponse.ok) {
                // Successfuly address addition,redirect to anotherpage or show success message
                alert('Address added successfully!');
                fetchAllAddresses();
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                const response = await rawResponse.text();
                // Handleing errors from the server
                alert(response);
            }
        } catch (error) {
            // Handleing network errors and exceptions
            console.error('Error adding address:', error);
        }
    }

    async function confirmOrderHandler(event) {
        event.preventDefault();

        try {
            const rawResponse = await fetch('http://localhost:3001/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    product: id,
                    quantity: quantity,
                    address: selectedAddress
                })
            });

            // Handleing response from server
            if (rawResponse.ok) {
                // Successfully order placed
                alert("Order Confirmed");
                navigate("/Products");
            } else {
                const response = await rawResponse.text();
                // Handle errors from the server
                alert(response);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error adding address:', error);
        }
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    return (
        <div>
            <div className='place-order-container'>
                <NavigationBar loggedIn={isLoggedIn} isAdmin={adminValue} />
                <div className='stepper-menu'>
                    <Box sx={{ width: '90%', padding: '30px', backgroundColor: 'white', margin: '30px auto', borderRadius: '20px' }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                            {activeStep === 0 ? (
                                <div>
                                    <form onSubmit={addAddressHandler}>
                                        <TextField value={name} onChange={(e) => setName(e.target.value)} label='Name' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={street} onChange={(e) => setStreet(e.target.value)} label='Street' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={city} onChange={(e) => setCity(e.target.value)} label='City' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={zipCode} onChange={(e) => setZipCode(e.target.value)} label='Zip Code' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={state} onChange={(e) => setState(e.target.value)} label='State' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={landmark} onChange={(e) => setLandMark(e.target.value)} label='Land Mark' fullWidth required sx={{ marginTop: '10px' }} />
                                        <TextField value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} label='Contact Number' fullWidth required sx={{ marginTop: '10px' }} />
                                        <Button
                                            type='submit'
                                            color="inherit"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginTop: '10px', height: "50px", color: "orange", backgroundColor: "#333333", '&:hover': { backgroundColor: "#555555" } }}>
                                            Add Address
                                        </Button>
                                    </form>
                                </div>
                            ) : activeStep === 1 ? (
                                <div>
                                    <Typography variant="h3">Address List</Typography>
                                    <div style={{ overflowY: 'auto', maxHeight: '400px', marginBottom: "50px" }}>
                                        <List>
                                            {addresses.map(address => (
                                                <ListItem
                                                    key={address._id}
                                                    button
                                                    selected={selectedAddressId === address._id && selectedAddress === address}
                                                    onClick={() => handleAddressClick(address._id, address)}
                                                >
                                                    <ListItemText
                                                        primary={`Name = ${address.name}, Street = ${address.street}, City = ${address.city}, Landmark = ${address.landmark}, State = ${address.state}, ZipCode = ${address.zipCode}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </div>
                                    {selectedAddress ? (
                                        <>
                                            <Typography variant="body1">Selected Address: {`Name = ${selectedAddress.name}, Street = ${selectedAddress.street}, City = ${selectedAddress.city}, Landmark = ${selectedAddress.landmark}, State = ${selectedAddress.state}, ZipCode = ${selectedAddress.zipCode}`}</Typography>
                                        </>
                                    ) : (
                                        <></>
                                    )}

                                </div>
                            ) : activeStep === 2 ? (
                                <div>
                                    <h2>Review Order</h2>
                                    {/* Display product card with all details */}
                                    {/* Order quantity = {quantity}
                                    <br />
                                    Product ID = {id}
                                    <br />
                                    Address ID = {selectedAddressId}
                                    <Typography variant="body1">Selected Address: {`Name = ${selectedAddress.name}, Street = ${selectedAddress.street}, City = ${selectedAddress.city}, Landmark = ${selectedAddress.landmark}, State = ${selectedAddress.state}, ZipCode = ${selectedAddress.zipCode}`}</Typography> */}

                                    <Card>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <CardMedia
                                                    component="img"
                                                    height="470"
                                                    image={product.imageURL || "https://via.placeholder.com/240"}
                                                    alt={product.name}
                                                    sx={{ width: 400 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <CardContent>
                                                    <Typography variant="h5" component="h2">
                                                        Product name: {product.name}
                                                    </Typography>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        Manufacturer: {product.manufacturer}
                                                    </Typography>
                                                    <Typography variant="body2" component="p">
                                                        Description: {product.description}
                                                    </Typography>
                                                    <Typography variant="body1" component="p">
                                                        Price: ${product.price}
                                                    </Typography>
                                                    <Typography variant='body1' component="p">
                                                        Quantity: {quantity}
                                                    </Typography>
                                                    <Typography variant="body1" component="p">
                                                        Total Price: ${product.price * quantity}
                                                    </Typography>
                                                    <Typography variant="h5" component="h2">
                                                        Your Address
                                                    </Typography>
                                                    <Typography variant="body1">{`Person Name = ${selectedAddress.name}, Street = ${selectedAddress.street}, City = ${selectedAddress.city}, Landmark = ${selectedAddress.landmark}, State = ${selectedAddress.state}, ZipCode = ${selectedAddress.zipCode}`}</Typography>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </div>
                            ) : null}

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1, color: "orange", '&:hover': { backgroundColor: "#555555" } }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />

                                {activeStep === 0 ? (
                                    <>
                                        <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '100px' }}>If Address Already Added then skip!</Typography>
                                        <Button sx={{ marginLeft: '10px', color: "orange", backgroundColor: "#333333", '&:hover': { backgroundColor: "#555555" } }} onClick={handleSkip}>skip</Button>
                                    </>

                                ) : (<></>)}

                                {activeStep === steps.length - 1 ? (
                                    <>
                                        <Button onClick={(e) => confirmOrderHandler(e)} sx={{ marginLeft: '10px', color: "orange", backgroundColor: "#333333", '&:hover': { backgroundColor: "#555555" } }}>
                                            Confirm order
                                        </Button>
                                    </>) : (
                                    <>
                                        <Button sx={{ marginLeft: '10px', color: "orange", backgroundColor: "#333333", '&:hover': { backgroundColor: "#555555" } }} onClick={handleNext}>
                                            Next
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </React.Fragment>
                    </Box>
                </div>
            </div>

            <footer className="footer">
                <Typography variant="body2" className="footer">
                    ©2024, Upgrad Eshop, shoaib , all rights reserved
                </Typography>
            </footer>
        </div>
    );
}