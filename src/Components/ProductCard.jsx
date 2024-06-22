import axios from 'axios';
import React, {useEffect} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {host} from '../Data';

const ProductCard = ({product, onEdit}) => {
  useEffect(() => {}, []);
  const deleteProduct = async id => {
    try {
      await axios.delete(`${host}/api/product/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={{uri: `${host}${product.image.url}`}}
        style={styles.productImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product && product.name}</Text>
        <Text style={styles.category}>{product && product.category}</Text>
      </View>
      <View style={[styles.infoContainer, {position: 'absolute', right: 20}]}>
        <Text style={styles.price}>
          {product && product.sellPrice.toFixed(2)} DT
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => onEdit(product)} style={styles.button}>
          <Image
            style={[styles.buttonIcon, {width: 25}]}
            source={require('../Assets/Icons/editproduct.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#FF5D1815'}]}
          onPress={() => deleteProduct(product._id)}>
          <Image
            style={styles.buttonIcon}
            source={require('../Assets/Icons/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Height * 0.2,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#3c2ceca6',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
    margin: 16,
    borderTopWidth: 1,
    borderLeftWidth: 5,
    borderRightWidth: 1,
    borderBottomWidth: 5,
    borderColor: '#3c2ceca6',
  },
  productImage: {
    width: Width * 0.3,
    height: Height * 0.18,
    borderRadius: 10,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '50%',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 16,
    color: '#777',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    right: 20,
    bottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
});
