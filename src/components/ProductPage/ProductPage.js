import * as React from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';
import "./ProductPage.css"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SortIcon from '@mui/icons-material/Sort';
import PriceDownIcon from '@mui/icons-material/ArrowDownward';
import PriceUpIcon from '@mui/icons-material/ArrowUpward';
import NewestIcon from '@mui/icons-material/NewReleases';
import ListItemIcon from '@mui/material/ListItemIcon';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Context } from '../../common/Context';
import { useContext } from 'react';

const ProductPage = () => {
  const [alignment, setAlignment] = React.useState('All');
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [sortBy, setSortBy] = React.useState('Default');
  const { setId, searchQuery, isPersonAdmin, isLoggedIn } = useContext(Context);

  const adminValue = isPersonAdmin();

  // fetch all products from API
  const fetchAllProducts = async () => {
    
    try {
      
      const response = await fetch('http://localhost:3001/api/v1/products');
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        console.error('Failed to fetch products');
      }
    } 
    catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // fetch categories from API
  const fetchCategories = async () => {
    
    try {
      
      const response = await fetch('http://localhost:3001/api/v1/products/categories');
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      } else {
        console.error('Failed to fetch categories');
      }
    } 
      catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  // Fetching categories and products when component mounts
  React.useEffect(() => {
    
    fetchCategories();
    fetchAllProducts();
  },[]);

  const handleChange = (event, newAlignment) => {
   
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.innerText);
  };

  const buyButtonHandler = (id) => {
    setId(id);
  }

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    
    <Box sx={{ width: 270 }} role="presentation" onClick={toggleDrawer(false)}>
      <List >
        {[
          { text: 'Default', icon: <SortIcon sx={{ color: 'orange' }} /> },
          { text: 'Price high to low', icon: <PriceDownIcon sx={{ color: 'orange' }} /> },
          { text: 'Price low to high', icon: <PriceUpIcon sx={{ color: 'orange' }} /> },
          { text: 'Newest', icon: <NewestIcon sx={{ color: 'orange' }} /> }
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={handleSortChange}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  // Filter and sort products based on selected category and sorting method
  const filteredProducts = products.filter(product => {
    
    if (searchQuery) {
      // Check if the product name or any other relevant property matches the search query
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      // If no search query is present, filter based on category
      if (alignment === 'All') return true;
      return product.category === alignment;
    }
  }).sort((a, b) => {
    
    if (sortBy === 'Price high to low') {
      return b.price - a.price;
    } else if (sortBy === 'Price low to high') {
      return a.price - b.price;
    } else if (sortBy === 'Newest') {
      const dateComparison = new Date(b.updatedAt) - new Date(a.updatedAt);
      
      if (dateComparison === 0) {
        // If dates are same, compare times
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        return dateComparison;
      }
    } else {
      return 0; // Default sorting
    }
  });
  

  return (
    <div>
      <div className='main'>
        <NavigationBar loggedIn={isLoggedIn} isAdmin={adminValue} isProductPage={true}/>
        <div className='categories'>
          <Button color="inherit" variant="outlined" sx={{ marginLeft: 3, color: 'orange' }} onClick={toggleDrawer(true)}><SortIcon />Sort By</Button>
          <Drawer
            className="filter-menu"
            open={open}
            onClose={toggleDrawer(false)}
            classes={{
              paper: 'drawer-paper'
            }}
            BackdropProps={{
              classes: {
                root: 'drawer-backdrop'
              }
            }}
          >
            {DrawerList}
          </Drawer>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{ backgroundColor: '#333333' }}
          >
            <ToggleButton value="All" sx={{ color: '#ff8c00', '&.Mui-selected': { color: 'black', backgroundColor: '#ff8c00' } }}>All</ToggleButton>
            {categories.map((category, index) => (
              <ToggleButton key={index} value={category} sx={{ color: '#ff8c00', '&.Mui-selected': { color: 'black', backgroundColor: '#ff8c00' } }}>
                {category}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
        <div className='products-grid'>
          <Grid container spacing={2}> {/* Grid container */}
            {filteredProducts.map((product, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}> {/* Grid item */}
                <Card className="card-container" sx={{ maxWidth: 320, backgroundColor: '#333333', borderRadius: 6 }}>
                  <CardMedia
                    component="img"
                    height="310"
                    image={product.imageURL || "https://via.placeholder.com/240"}
                    alt="Product Image"
                  />
                  <CardContent sx={{ color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <div>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="body2">
                        {product.description}
                      </Typography>
                      <Typography variant="h6">
                        Price : ${product.price}/-
                      </Typography>
                    </div>
                    <div style={{ alignSelf: 'flex-end' }}>
                      {/* Using Link to navigate to product details page */}
                      <Link to={"/Product-Details"}>
                        <Button onClick={() => buyButtonHandler(product._id)} className="buy-button" color="inherit" variant="outlined" sx={{ fontSize: 18, paddingLeft: 4, paddingRight: 4, borderRadius: 7, marginRight: 1, color: 'orange' }}>
                          Buy
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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

export default ProductPage;
