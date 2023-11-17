const axios = require('axios');

const COUNTER_APP_URL = process.env.COUNTER_APP_URL || 'http://localhost:3001';

async function incrementCounter(bookId) {
    try {
        await axios.post(`${COUNTER_APP_URL}/counter/${bookId}/incr`);
    } catch (error) {
        console.error('Ошибка при увеличении счётчика:', error);
    }
}

async function getCounter(bookId) {
    try {
        const response = await axios.get(`${COUNTER_APP_URL}/counter/${bookId}`);
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