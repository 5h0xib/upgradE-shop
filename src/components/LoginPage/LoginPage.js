import React, { useContext, useState } from 'react';
import { Context } from '../../common/Context';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Avatar, TextField, Button, Typography, FormControlLabel, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import "./LoginPage.css";
import NavigationBar from '../../common/NavigationBar';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useContext(Context);
    const navigate = useNavigate();

    async function signInHandler(event) {
        event.preventDefault();

        try {
            // Send the form data to the server using fetch or any other method
            const rawResponse = await fetch('http://localhost:3001/api/v1/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            // Handle the response from the server
            if (rawResponse.ok) {
                // Successful sign-up, you can redirect the user to another page or show a success message
                const authToken = rawResponse.headers.get("x-auth-token");
                setToken(authToken);
                localStorage.setItem('token', authToken);
                navigate('/Products');
                // console.log(rawResponse.headers);
            } else {
                const response = await rawResponse.text()
                // Handle errors from the server
                alert(response);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error during sign-in:', error);
        }
    }

    return (
        <div>
            <NavigationBar />
            <Grid container justifyContent="center" alignItems="center" className="login-page-container"> {/* Apply background image to Grid container */}
                <Paper elevation={10} className='paperStyle'>
                    <Grid align='center'>
                        <div className='heading'>
                            <Avatar className='avatarStyle'>
                                <LockOutlinedIcon />
                            </Avatar>
                            <h1>Welcome</h1>
                        </div>
                    </Grid>
                    <form onSubmit={signInHandler}>
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" label='Email' placeholder='Enter your email' fullWidth required />
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" label='Password' placeholder='Enter your password' type='password' fullWidth required />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Remember me"
                        />
                        <Button type='submit' color='primary' variant="outlined" className='btnstyle' fullWidth>Sign In</Button>
                    </form>
                    <hr />
                    <Typography sx={{ fontSize: 20, textAlign: "center", color: "grey" }}>
                        For E-shoping? Click Below
                        <br />
                        <Link to="/signup"><Button type='submit' color='primary' variant="outlined" className='btnstyle' fullWidth>Sign Up</Button></Link>
                    </Typography>
                    <hr />
                </Paper>
            </Grid>
        </div>
    );
}
