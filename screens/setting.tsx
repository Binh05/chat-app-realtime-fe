import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { StackNavigationProp } from '@react-navigation/stack';
import TaskBar from '../components/TaskBar';

interface SettingScreenProps {
  navigation: StackNavigationProp<any>;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [currentTab, setCurrentTab] = useState('profile'); 

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleTabChange = (key: string) => {
    setCurrentTab(key);

    switch(key) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'messages':
        navigation.navigate('Message');
        break;
      case 'contacts':
        navigation.navigate('Contacts');
        break;
      case 'profile':

        break;
    }
  };


  const SettingItem = ({ icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.rowItem} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color="#333" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const NavIcon = ({ icon, label, active }: { icon: any, label: string, active: boolean }) => (
    <TouchableOpacity 
      style={styles.navItem} 
      onPress={() => handleTabChange(label.toLowerCase())}
    >
      <Ionicons name={icon} size={24} color={active ? '#00B4D8' : '#333'} />
      <Text style={[styles.navLabel, { color: active ? '#00B4D8' : '#333' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Card - Bấm vào đây để sang Profile */}
          <TouchableOpacity style={styles.userCard} onPress={navigateToProfile}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=5' }} 
              style={styles.avatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Adina Nurrahma</Text>
              <Text style={styles.userBio}>Trust your feelings, be a good human being.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={24} color="#333" style={{marginRight: 8}} />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          {/* Group 1 */}
          <View style={styles.groupContainer}>
            <SettingItem 
              icon="chatbox-ellipses-outline" 
              label="Message requests" 
              onPress={() => navigation.navigate('MessageRequests')}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon="people-outline" 
              label="Category" 
              onPress={() => navigation.navigate('Category')}
            />
          </View>

          {/* Group 2 */}
          <View style={styles.groupContainer}>
            <SettingItem 
              icon="create-outline" 
              label="Edit profile information" 
              onPress={navigateToProfile}
            />
            <View style={styles.divider} />
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <Ionicons name="notifications-outline" size={22} color="#333" />
                <Text style={styles.label}>Notifications</Text>
              </View>
              <Switch
                value={isNotificationEnabled}
                onValueChange={setIsNotificationEnabled}
                trackColor={{ false: '#767577', true: '#00B4D8' }}
                thumbColor={isNotificationEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={styles.divider} />
            <SettingItem 
              icon="language-outline" 
              label="Language" 
              onPress={() => navigation.navigate('Language')}
            />
          </View>

          {/* Group 3 */}
          <View style={styles.groupContainer}>
            <SettingItem 
              icon="shield-checkmark-outline" 
              label="Security" 
              onPress={() => navigation.navigate('Security')}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon="color-palette-outline" 
              label="Theme" 
              onPress={() => navigation.navigate('Theme')}
            />
          </View>

          {/* Group 4 */}
          <View style={styles.groupContainer}>
            <SettingItem 
              icon="help-circle-outline" 
              label="Help & Support" 
              onPress={() => navigation.navigate('HelpSupport')}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon="chatbubble-outline" 
              label="Contact us" 
              onPress={() => navigation.navigate('ContactUs')}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon="lock-closed-outline" 
              label="Privacy policy" 
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* TaskBar giống như Contacts screen */}
      <TaskBar
        current={currentTab}
        onChange={handleTabChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#0077B6'
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa', 
    borderRadius: 16, 
    padding: 15, 
    marginBottom: 20, 
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30 
  },
  userInfo: { 
    flex: 1, 
    marginLeft: 15 
  },
  userName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0077B6' 
  },
  userBio: { 
    fontSize: 14, 
    color: '#6c757d', 
    marginTop: 4 
  },

  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10,
    marginTop: 10
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333' 
  },

  groupContainer: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    marginBottom: 15, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  rowItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 15 
  },
  rowLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  label: { 
    marginLeft: 15, 
    fontSize: 15, 
    color: '#333' 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#e9ecef' 
  },
  
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 12, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#dee2e6' 
  },
  navItem: { 
    alignItems: 'center',
    padding: 8
  },
  navLabel: { 
    fontSize: 12, 
    marginTop: 4,
    fontWeight: '500'
  }
});

export default SettingScreen;