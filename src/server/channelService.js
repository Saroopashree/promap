import { ChannelType } from "@onehop/js";

class ChannelService {
  #client;
  #hop;

  constructor(mongoClient, hop) {
    this.#client = mongoClient;
    this.#hop = hop;
  }

  #collection() {
    return this.#client.db("promap").collection("channels");
  }

  async getCommunicationChannel(domain) {
    const channels = this.#collection();
    return await channels.findOne({ domain });
  }

  async createCommunicationChannel(domain) {
    if (await this.getCommunicationChannel(domain)) return;

    const channels = this.#collection();
    const channel = await this.#hop.channels.create(ChannelType.UNPROTECTED);

    const doc = { channelId: channel.id, domain };
    await channels.insertOne(doc);
    return doc;
  }

  async publishMessage(channelId, topic, message) {
    if (channelId) {
      console.log(channelId, topic, message);
      await this.#hop.channels.publishMessage(channelId, topic, message);
    }
  }
}

export default ChannelService;
