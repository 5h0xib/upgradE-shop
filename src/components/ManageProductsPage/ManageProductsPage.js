import React from 'react'
import "./ManageProductsPage.css"
import NavigationBar from '../../common/NavigationBar'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useContext } from 'react';
import { Context } from '../../common/Context';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';


export default function ManageProductsPage() {
  const [productName, setProductName] = React.useState('');
  const [productImageURL, setProductImageURL] = React.useState('');
  const [productDescription, setProductDescription] = React.useState('');
  const [availableUnits, setAvailableUnits] = React.useState('');
  const [productManufacturer, setProductManufacturer] = React.useState('');
  const [productCategory, setProductCategory] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const { token, isLoggedIn } = useContext(Context);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [productId, setProductId] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState({});
  const [openEditModal, setOpenEditModal] = React.useState(false);

  React.useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleOpenEditModal = (product) => {
    setOpenEditModal(true);
    setSelectedProduct(product);
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  }

  async function handleEditProduct(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/v1/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          name: selectedProduct.name,
          category: selectedProduct.category,
          manufacturer: selectedProduct.manufacturer,
          description: selectedProduct.description,
          price: selectedProduct.price,
          imageURL: selectedProduct.imageURL,
          availableItems: selectedProduct.availableItems
        })
      });

      // Handleing response from server
      if (response.ok) {
        console.log(response);
        alert('Product Updated Successfully');
        window.location.reload();
      } else {
        // If response is not ok, handle error
        throw new Error('Failed to update product');
      }
    } catch (error) {
      // Handleing network errors and exceptions
      console.error('Error during product update:', error);
      alert('Failed to update product. Please try again later.');
    }
  }



  async function addProductHandler(event) {
    event.preventDefault();
    try {

      const rawResponse = await fetch('http://localhost:3001/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          name: productName,
          category: productCategory,
          manufacturer: productManufacturer,
          description: productDescription,
          price: productPrice,
          imageURL: productImageURL,
          availableItems: availableUnits
        })
      });

      // Handleing response from server
      if (rawResponse.ok) {
        alert('Product Added Successfully');
        window.location.reload();
      } else {
        const response = await rawResponse.text()

        alert(response);
      }
    } catch (error) {
      // Handleing network errors and exceptions
      console.error('Error during sign-up:', error);
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
        console.log(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = (id) => {
    setOpenDeleteModal(true);
    setProductId(id);
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  }

  async function handleConfirmDelete() {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/products/${productId}`, { method: 'DELETE' });
      if (response.ok) {
        handleCloseDeleteModal();
        alert("Product Deleted Successfully");
        // Reload the page deletion
        window.location.reload();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      // Handleing error
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className='manage-products-container'>
      <NavigationBar loggedIn={isLoggedIn} />

      <div className='form-container'>
        <h1>Add Product </h1>
        <form onSubmit={addProductHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Product Name"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Image URL"
                fullWidth
                value={productImageURL}
                onChange={(e) => setProductImageURL(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Available Units"
                fullWidth
                type="number"
                value={availableUnits}
                onChange={(e) => setAvailableUnits(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Manufacturer"
                fullWidth
                value={productManufacturer}
                onChange={(e) => setProductManufacturer(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Category"
                fullWidth
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Price"
                fullWidth
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <div className='products-grid'>
        <h1>Modify Products</h1>
        <Grid container spacing={2}> {/* Grid container */}
          {products.map((product, index) => (
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
                    <Button onClick={() => handleDelete(product._id)}>
                      <DeleteIcon sx={{ color: 'orange', marginTop: '10px', fontSize: '30px' }} />
                    </Button>
                    <Button onClick={() => handleOpenEditModal(product)}>
                      <EditIcon sx={{ color: 'orange', marginTop: '10px', fontSize: '30px' }} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <footer className="footer-manage-products">
        <Typography variant="body2" className="footer">
        ©2024, Upgrad Eshop, shoaib , all rights reserved
        </Typography>
      </footer>
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="Delete-modal-title"
        aria-describedby="Delete-modal-description"
        style={{
          backdropFilter: 'blur(5px)', // Add backdrop filter to create a blur effect
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background for the modal backdrop
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFF',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Delete
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this product?
          </Typography>
          <Button onClick={handleConfirmDelete} variant="outlined" color="inherit" sx={{ color: 'white', backgroundColor: '#333333', marginRight: '10px' }}>
            Yes
          </Button>
          <Button onClick={handleCloseDeleteModal} variant="outlined" color="inherit" sx={{ marginLeft: 17 }}>
            No
          </Button>
        </div>
      </Modal>
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="modal-container">
          <h2 id="simple-modal-title">Edit Product</h2>
          <form onSubmit={handleEditProduct} className="form-container-of-edit">
            <TextField className='input' id="outlined-basic" label="Product Name" variant="outlined" required
              value={selectedProduct.name}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
            <TextField className='input' id="outlined-basic" label="Product Category" variant="outlined" required
              value={selectedProduct.category}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })} />
            <TextField className='input' id="outlined-basic" label="Product Manufacturer" variant="outlined" required
              value={selectedProduct.manufacturer}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, manufacturer: e.target.value })} />
            <TextField className='input' id="outlined-basic" label="Product Description" variant="outlined" required
              value={selectedProduct.description}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} />
            <TextField className='input' id="outlined-basic" label="Product Image URL" variant="outlined" required
              value={selectedProduct.imageURL}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, imageURL: e.target.value })} />
            <TextField className='input' id="outlined-basic" label="Available Units" variant="outlined" required
              value={selectedProduct.availableItems}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, availableItems: e.target.value })} />
            <TextField className='input' id="outlined-basic" label="Product Price" variant="outlined" required
              value={selectedProduct.price}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })} />
            <Button type="submit" variant="contained" color="primary">
              Update Product
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  )
}
