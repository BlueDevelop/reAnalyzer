import {connect, connection, disconnect} from 'mongoose';
import getConfig from '../config';

const config = getConfig();

before('connect mongo', async () => {
    try {
        connect(config.connString, { useNewUrlParser: true });
        console.log('Succesfully connected to ' + config.connString);
    } catch(err) {
        console.log('Could not connect to ' + config.connString);
        console.error(err);
    }
});

beforeEach(async () => {
    return await removeCollections(); 
});

after(async () => {
    await removeCollections(); 
    return await disconnect();
});

async function removeCollections() {
    const removeCollectionPromises = [];
    for(const i in connection.collections){
        removeCollectionPromises.push(connection.collections[i].deleteMany({}));
    }

    return await Promise.all(removeCollectionPromises);   
}