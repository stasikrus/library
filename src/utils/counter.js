const axios = require('axios');

async function incrementCounter(bookId) {
    try {
        await axios.post(`http://counter-app:3001/counter/${bookId}/incr`);
    } catch (error) {
        console.error('Ошибка при увеличении счётчика:', error);
    }
}

async function getCounter(bookId) {
    try {
        const response = await axios.get(`http://counter-app:3001/counter/${bookId}`);
        return response.data.count; 
    } catch (error) {
        console.error('Ошибка при получении данных счетчика:', error);
        return 0; 
    }
}

module.exports = {
    incrementCounter,
    getCounter
};