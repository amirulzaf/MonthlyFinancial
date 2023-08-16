import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydb.db');

const Calculator = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (description && amount) {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO savings (description, amount) values (?, ?)',
          [description, amount],
          (_, { insertId }) => console.log(`New savings entry added with ID: ${insertId}`),
          (txObj, error) => console.log(`Error: ${error.message}`)
        );
      });
      setDescription('');
      setAmount('');
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ marginBottom: 10 }}>Enter new savings:</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginVertical: 5 }}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginVertical: 5 }}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'lightblue',
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={handleSave}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Calculator;
