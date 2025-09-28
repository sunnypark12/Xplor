import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigation = useNavigation<any>();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    try {
      await signIn(email, password);
      navigation.navigate('Home');
    } catch (e: any) {
      setError(e?.message || 'Failed to sign in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>No account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
  input: { width: '90%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#111827', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '90%', marginBottom: 12 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
  link: { color: '#2563eb', marginTop: 8 },
  error: { color: '#dc2626', marginBottom: 8 },
});

export default Login;


