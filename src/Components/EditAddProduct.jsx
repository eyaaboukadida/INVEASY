import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import ButtonOutline from './ButtonOutline';
import SelectDropdown from 'react-native-select-dropdown';
import {launchImageLibrary} from 'react-native-image-picker';
import {host} from '../Data';
import axios from 'axios';

const Categories = [
  {title: 'Snacks'},
  {title: 'Fruits'},
  {title: 'Canned'},
  {title: 'Cereals'},
];

const EditAddProduct = ({product, onClose, onSave, isEdit, onAdd}) => {
  const [ref, setRef] = useState(isEdit ? product?.ref : '');
  const [name, setName] = useState(isEdit ? product?.name : '');
  const [category, setCategory] = useState(isEdit ? product.category : '');
  const [imageUrl, setImageUrl] = useState(isEdit ? product.image.url : null);
  const [sellPrice, setSellPrice] = useState(isEdit ? product.sellPrice : 0);
  const [NewImage, setNewImage] = useState(isEdit ? product.image : null);

  const createProduct = async newProd => {
    try {
      await axios.post(`${host}/api/product`, newProd);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };

  const updateProduct = async newProd => {
    try {
      await axios.put(`${host}/api/product/${newProd._id}`, newProd);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };
  useEffect(() => {}, []);

  const handleSave = () => {
    const newProduct = {
      ...product,
      ref,
      name,
      category,
      image: NewImage.uri,
      sellPrice: parseFloat(sellPrice),
    };
    if (isEdit) {
      updateProduct(newProduct);
    } else {
      console.log('newIMG', newProduct.image.uri);
      createProduct(newProduct);
    }
    onClose();
  };
  const getNewImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
      });

      if (!result.didCancel) {
        const image = result.assets[0];
        await uploadImage(image);
      }
    } catch (error) {
      console.error('Error getting image: ', error);
    }
  };

  const uploadImage = async image => {
    const newImageUri = image.uri;

    // Function to determine MIME type based on file extension
    const getMimeType = filename => {
      const extension = filename.split('.').pop();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        default:
          return 'application/octet-stream';
      }
    };
    const formData = new FormData();
    formData.append('image', {
      uri: newImageUri,
      type: getMimeType(newImageUri.split('/').pop()),
      name: newImageUri.split('/').pop(),
    });

    try {
      const response = await axios.post(`${host}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Image uploaded successfully', response.data);
        setImageUrl(response.data.image.url); // Assuming response.data.imageUrl is the URL of the uploaded image
        setNewImage({uri: response.data.image});
        console.log('new IMage', response.data.image);
        return response.data.image;
      } else {
        console.log('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        {isEdit ? 'Edit Product' : 'Add Product'}
      </Text>
      <TextInput
        placeholderTextColor={'#28209C'}
        style={styles.input}
        placeholder="Reference"
        value={ref}
        onChangeText={text => setRef(text)}
      />
      <TextInput
        placeholderTextColor={'#28209C'}
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />

      <TextInput
        placeholderTextColor={'#28209C'}
        style={styles.input}
        placeholder="Sell Price"
        value={String(sellPrice)}
        onChangeText={text => setSellPrice(text)}
        keyboardType="numeric"
      />
      <SelectDropdown
        data={Categories}
        onSelect={(selectedItem, index) => {
          setCategory(selectedItem.title);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.title) || 'Select Category'}
              </Text>
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && {backgroundColor: '#D2D9DF'}),
              }}>
              <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
        defaultValue={Categories.find(e => e.title == category)}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={getNewImage}>
        <Image
          style={styles.uploadIcon}
          source={require('../Assets/Icons/Upload.png')}
        />
      </TouchableOpacity>
      <Image style={styles.uploadImage} source={{uri: `${host}${imageUrl}`}} />
      <View style={styles.buttonContainer}>
        <ButtonOutline
          text="Cancel"
          fontSize={16}
          width={'40%'}
          action={() => onClose()}
        />
        <ButtonOutline
          text="Save"
          fontSize={16}
          width={'40%'}
          action={handleSave}
        />
      </View>
    </View>
  );
};

export default EditAddProduct;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    height: Height,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#28209C',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
    bottom: 50,
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#3C2CEC',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  uploadButton: {
    width: '20%',
    height: Height * 0.1,
    alignSelf: 'flex-start',
    marginVertical: 20,
  },
  uploadIcon: {
    resizeMode: 'contain',
    tintColor: '#3C2CEC',
    width: '100%',
    height: '100%',
  },
  uploadImage: {
    width: Width * 0.55,
    height: Width * 0.55,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
});
