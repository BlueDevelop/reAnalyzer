import { Client } from '@elastic/elasticsearch';
import getConfig from '../config';
import errorLogger from '../loggers/error.logger';
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

  public static async search(esQuery: any) {
    try {
      const result = await Elasticsearch.client.search(esQuery);
      return result;
    } catch (error) {
      errorLogger.error(`Error in elasticsearch search`);
      errorLogger.error(error);
    }
  }

  private static client: Client = new Client({
    node: config.elasticsearch,
    // requestTimeout: Infinity,
  });
}
