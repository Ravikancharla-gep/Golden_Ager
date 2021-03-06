// Al Imports...
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { Link, Toolbar  ,Stack } from '@mui/material';
import { styled} from '@mui/styles';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Textfield from '../../components/formUI/Textfield';

import SubmitButton from '../../components/formUI/Button';
import Logo from '../../components/logo.png'
import { useHistory } from "react-router-dom";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useEffect } from "react";

// ---------------------------------------------------------------------

const theme = createTheme();

const Title = styled(Typography)({
  fontSize : 35,
  background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 0%, rgba(162,222,131,1) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
});

// Adding Style components - buttons
const StyledSubmitButton = styled(SubmitButton)({
  background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 0%, rgba(162,222,131,1) 100%)",
  border: 0,
  borderRadius: 4,
  boxShadow: '0 3px 5px 2px rgba(2, 212, 225, .3)',
  color: 'white',
  height: 10,
  padding: '0 10px',
});

// Null initialisation
const INITIAL_FORM_STATE = {
  email: '',
}

const FORM_VALIDATION = Yup.object().shape({

  email: Yup.string()
    .email('Invalid email.')
    .required('Required'),
});

export default function ForgotPassword() 
{
  // If the user already logged in , just redirect to dashboard
  let history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history]);

  //Sucess  or error messages
  const [success, setSuccess] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const CloseSuccess = () => {
    setShowSuccess(false);
    history.push("/");
  };

  const CloseError = () => {
    setShowError(false);
  };

  // submitting form
  const onSubmit  = async (values, props) => {

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const email = values.email;

    try 
    {
      const { data } = await axios.post(
        "/api/auth/forgotpassword",
        { email },
        config
      );
  
      console.log(data.data)
      setSuccess(data.data)
      setError("")
      setShowSuccess(true)
      setShowError(false)
      props.resetForm()
      setTimeout(CloseSuccess, 5000);

    }
    catch (error) 
    {
      setError(error.response.data.error)
      setSuccess("")
      setShowSuccess(false)
      setShowError(true)
      console.log(error.response.data);
      setTimeout(CloseError, 5000);
    }

  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
  
        <Grid
          item
          xs={false}
          sm={4}
          md={7}

          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1454418747937-bd95bb945625?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'right',
          }}
        />
          
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >

                <Toolbar >
                    <Link underline="none" href="/">
                      <img style = {{ width :32, height :32, margin : 4}} alt = "logo" src = {Logo} />
                    </Link>
          
                    <Title  variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        <Link underline="none" href="/">
                          Golden&nbsp;Ager
                        </Link>
                    </Title>
                </Toolbar>

                <Grid container sx = {{pt : 4}} rowSpacing={2}>
                                    
                  <Grid item xs ={12}>
                    <Typography   fontSize={20} variant="body1">
                      Enter your email to receive reset link
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>

                    <Box sx={{ width: '100%' , pt : 1}}>
                      <Collapse in={showSuccess} >
                        <Alert 
                          action=
                          {
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                  
                              onClick={() => {
                                setShowSuccess(false);
                              }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                          sx={{ mb: 2 }}
                        >   
                            {success} 
                        </Alert>
                      </Collapse>
                    </Box>

                    <Box sx={{ width: '100%' , pt : 1}}>
                        <Collapse in={showError} >
                          <Alert severity="error"
                            action={
                              <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                             
                                onClick={() => {
                                  setShowError(false);
                                }}
                              >
                                  <CloseIcon fontSize="inherit" />
                              </IconButton>
                            }
                            sx={{ mb: 2 }}
                          >   
                              {error} 
                          </Alert>
                        </Collapse>
                    </Box>

                    <div >

                      <Formik
                        initialValues={{
                         ...INITIAL_FORM_STATE
                        }}
                        validationSchema={FORM_VALIDATION}
                        onSubmit={onSubmit}
                      >
                        <Form>
                          <Grid container spacing={2} rowSpacing = {2}>
                              <Grid item xs={12}>
                                  <Textfield
                                    required
                                    name="email"
                                    label="Email"
                                  />
                              </Grid>
                          </Grid>
                      
                          <Stack
                            sx={{ p: 2}}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                          >
                            <StyledSubmitButton >Submit</StyledSubmitButton>
                          </Stack>

                        </Form>

                      </Formik>
                    </div>

                  </Grid>
                </Grid>
                  
              </Box>
          </Grid>

      </Grid>
    </ThemeProvider>
    )
}
