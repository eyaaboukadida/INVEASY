import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProfileHeader from '../Components/ProfileHeader';
import ProductCard from '../Components/ProductCard';
import EditAddProduct from '../Components/EditAddProduct';
import axios from 'axios';
import {host} from '../Data';

const Product = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [products, setProducts] = useState([]);

  const getAllProduct = async () => {
    try {
      const response = await axios.get(`${host}/api/product`);
      setProducts(response.data.productList);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, [products]);

  const handleEdit = product => {
    setSelectedProduct(product);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleAdd = product => {
    setProducts([...products, {...product, id: String(products.length + 1)}]);
  };

  const handleSave = updatedProduct => {
    const updatedProducts = products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product,
    );
    setProducts(updatedProducts);
    setSelectedProduct(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <View style={styles.CardsBox}>
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setIsEdit(false);
            }}
            style={styles.addButton}>
            <Image
              style={styles.addIcon}
              resizeMode="contain"
              source={require('../Assets/Icons/addProduct.png')}
            />
          </TouchableOpacity>
          <Text style={styles.Header}>List Of Products</Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {products.map(product => (
            <ProductCard
              product={product}
              onEdit={handleEdit}
              key={product._id}
            />
          ))}
        </ScrollView>
      </View>
      <Modal
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        visible={isModalVisible}>
        <EditAddProduct
          product={selectedProduct}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          isEdit={isEdit}
          onAdd={handleAdd}
        />
      </Modal>
    </View>
  );
};

export default Product;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff'},
  CardsBox: {
    width: Width,
    paddingTop: Height * 0.02,
    backgroundColor: '#fff',
    height: Height * 0.6,
    borderRadius: 50,
    top: -Height * 0.12,
  },
  scrollContainer: {},
  addButton: {
    width: Width * 0.17,
    height: Width * 0.17,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,

    marginRight: 20,

    // paddingHorizontal: Width * 0.05,
    backgroundColor: '#28209C',
  },
  addIcon: {width: '50%'},
  Header: {
    position: 'absolute',
    zIndex: 100,
    left: 50,
    top: Height * 0.04,
    fontSize: 22,
  },
});
