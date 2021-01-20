import React,{useState} from 'react';
import useStyles from './styles';
import {Avatar, Button, Paper, Grid, Container, Typography } from '@material-ui/core';
import {GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from './Input';
import Icon from './icon';
import {signin, signup} from '../../actions/auth';

const initialState = {
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    confirmPassword:''
};

const Auth = () => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData,setFormData] = useState(initialState);

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword );

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignUp){
            dispatch(signup(formData,history));
        }
        else {
            dispatch(signin(formData,history));
        }
    }
    
    const handleChange = (e) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});

    }

    const switchMode = () => {
        setIsSignUp((prev) => !prev);
    }

    const googleSuccess =  async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({type:'AUTH', data: {result,token}});
            history.push('/');
        }
        catch(error){
            console.error(error);
        }
    }
    const googleFailiure = () => {
        console.error("Google Sign In was unsuccessful.");
    }
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignUp? 'Sign Up':'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignUp && (
                                <>
                                    <Input name="firstName" label ="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label ="Last Name" handleChange={handleChange} autoFocus half />                                     
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword?"text":"password"} handleShowPassword={handleShowPassword} />
                        {isSignUp && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignUp? 'Sign Up': 'Sign In'}
                    </Button>
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_OAUTH}
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">Google Sign In</Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailiure}
                        cookiePolicy="single_host_origin"

                    />
                    <Grid container justify="flex-end">
                        <Grid item >
                            <Button onClick={switchMode}>
                                {isSignUp? 'Already have an Account? Sign In':"Dont't have an Account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;
