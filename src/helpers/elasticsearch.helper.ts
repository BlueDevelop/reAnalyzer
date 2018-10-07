import {Client} from 'elasticsearch';
import getConfig from '../config';
const config = getConfig();

/**
 * Elasticsearch class
 */
export default class elasticsearch {
    client: Client;
    
    /**
     * Init elasticsearch connection.
     */
    constructor() {
        this.client = new Client({
            hosts: config.elasticsearch
        });
    }

    /**
     * Get the client connection object.
     * 
     * @returns EsClient
     */
    getClient() : Client {
        return this.client;
    }
}