import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Ensure you're importing useNavigation

const TaskListPage = ({ route }) => {
  const navigation = useNavigation();
  const { userId } = route.params;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('tasks')
      .where('userId', '==', userId)
      .orderBy('deadline', 'desc')
      .onSnapshot(querySnapshot => {
        const tasksArray = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          key: doc.id,
        }));
        setTasks(tasksArray);
      });

    return () => subscriber();
  }, [userId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.taskName}</Text>
            <Text style={styles.subtitle}>{new Date(item.deadline.seconds * 1000).toLocaleString()}</Text>
            {/* Add more task details if needed */}
          </View>
        )}
        keyExtractor={item => item.key}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('TaskPage')}>
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#20B2AA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TaskListPage;
