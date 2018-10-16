import { Client } from 'elasticsearch';
import getConfig from '../config';
const config = getConfig();

/**
 * Elasticsearch class
 */
export default class Elasticsearch {
  /**
   * Get the client connection object.
   *
   * @returns EsClient
   */
  public static getClient(): Client {
    return Elasticsearch.client;
  }

  private static client: Client = new Client({
    hosts: config.elasticsearch,
  });
}
