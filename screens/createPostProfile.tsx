import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CreatePostProfile = ({ navigation }: { navigation: any }) => {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Hàm chọn ảnh
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    console.log("Đăng bài:", postText, selectedImage);
    // Code gọi API đăng bài ở đây...
    navigation.goBack();
  };

  const removeImage = () => {
    setSelectedImage(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo bài viết</Text>
        <TouchableOpacity 
          style={[styles.postButton, { opacity: (postText.length > 0 || selectedImage) ? 1 : 0.5 }]} 
          onPress={handlePost}
          disabled={postText.length === 0 && !selectedImage}
        >
          <Text style={styles.postButtonText}>Đăng</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=5' }} 
            style={styles.avatar} 
          />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>Nameh</Text>
            <View style={styles.privacyBadge}>
              <Ionicons name="earth" size={12} color="#666" />
              <Text style={styles.privacyText}>Công khai</Text>
            </View>
          </View>
        </View>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Bạn đang nghĩ gì?"
          placeholderTextColor="#999"
          multiline
          value={postText}
          onChangeText={setPostText}
          scrollEnabled={false}
        />

        {/* Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
              <Ionicons name="close-circle" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Toolbar */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={styles.toolbarItem} onPress={pickImage}>
            <Ionicons name="images-outline" size={24} color="#4CAF50" />
            <Text style={styles.toolbarLabel}>Ảnh/Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="person-add-outline" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="happy-outline" size={24} color="#FFC107" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="location-outline" size={24} color="#FF5722" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  postButton: { backgroundColor: '#0077B6', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 6 },
  postButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#eee' },
  userInfoContainer: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  userInfoText: { marginLeft: 10 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  privacyBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2, marginTop: 2, gap: 4 },
  privacyText: { fontSize: 12, color: '#666', fontWeight: '500' },
  input: { paddingHorizontal: 15, fontSize: 18, color: '#333', minHeight: 100, textAlignVertical: 'top' },
  imagePreviewContainer: { margin: 15, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  previewImage: { width: '100%', height: 300, resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  toolbarContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  toolbarItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20, padding: 5 },
  toolbarLabel: { marginLeft: 5, fontSize: 14, color: '#666', fontWeight: '500' }
});

export default CreatePostProfile;