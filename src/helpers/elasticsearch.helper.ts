import {Client} from 'elasticsearch';
import getConfig from '../config';
const config = getConfig();

/**
 * Elasticsearch class
 */
export default class elasticsearch {
    static client: Client =  new Client({
        hosts: config.elasticsearch
    });

    /**
     * Get the client connection object.
     * 
     * @returns EsClient
     */
    static getClient() : Client {
        return elasticsearch.client;
    }
}