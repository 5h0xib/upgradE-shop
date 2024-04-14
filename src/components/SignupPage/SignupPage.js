import React, { useState } from 'react';
import { Grid, Paper, Avatar, TextField, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import "./SignupPage.css";
import NavigationBar from '../../common/NavigationBar';
import { useNavigate } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    async function signUpHandler(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords are not same!!!");
            return;
        }

        try {
            // Send form data to server using fetch or other method
            const rawResponse = await fetch('http://localhost:3001/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    contactNumber,
                    role
                })
            });

            // Handleing the response from the server
            if (rawResponse.ok) {
                // Successfuly sign-up, redirect the user to another page or show a success message
                alert('User signed up successfully!');
                navigate("/signin");
            } else {
                const response = await rawResponse.text()
                // Handleing errors from the server
                alert(response);
            }
        } catch (error) {
            // Handleing network errors or exceptions
            console.error('Error during sign-up:', error);
        }
    }

    return (
        <div>
            <NavigationBar />
            <Grid container justifyContent="center" alignItems="center" className="signup-page-container">
                <Paper elevation={10} className='paperStyle'>
                    <Grid align='center'>
                        <div className='heading'>
                            <Avatar className='avatarStyle'>
                                <LockOutlinedIcon />
                            </Avatar>
                            <h1>Sign Up</h1>
                        </div>
                    </Grid>
                    <form onSubmit={signUpHandler}>
                        <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} className="signup-input" label='Firstname' placeholder='Enter your firstname' fullWidth required />
                        <TextField value={lastName} onChange={(e) => setLastName(e.target.value)} className="signup-input" label='Lastname' placeholder='Enter your lastname' fullWidth required />
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} className="signup-input" label='Email' placeholder='Enter your email' fullWidth required />
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" label='Password' placeholder='Enter your password' type='password' fullWidth required />
                        <TextField value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="signup-input" label='Confirm Password' placeholder='Enter password again' type='password' fullWidth required />
                        <TextField value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="signup-input" label='Contact Number' placeholder='Enter your number' fullWidth required />
                        <FormControl className="signup-input">
                            <FormLabel id="demo-row-radio-buttons-group-label">Select Role</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="role"
                                value={role}
                                onChange={handleRoleChange}
                            >
                                <FormControlLabel value="user" control={<Radio />} label="User" />
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                            </RadioGroup>
                        </FormControl>
                        <Button type='submit' color='primary' variant="outlined" className='btnstyle' fullWidth>Sign Up</Button>
                    </form>
                    <hr />
                </Paper>
            </Grid>
        </div>
    );
}
