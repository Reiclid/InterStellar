/**
 * DELAY-TOLERANT MESH NETWORKING (DTN)
 * Store-and-Forward Epidemic Gossip Protocol with hop counters, TTL decay, & packet queues
 */

export class DtnGossipRouter {
  constructor(nodeId) {
    this.nodeId = nodeId || `NODE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    this.storageQueue = new Map(); // Packet ID -> Packet Object
    this.seenPacketIds = new Set();
    this.maxQueueSize = 50;
    this.routingLog = [];
  }

  /**
   * Inject a packet into the local DTN store-and-forward queue
   */
  enqueuePacket(recipientId, encryptedPayload, ttlHops = 5) {
    const packetId = `PKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const packet = {
      id: packetId,
      sender: this.nodeId,
      recipient: recipientId,
      hopsRemaining: ttlHops,
      timestamp: Date.now(),
      payload: encryptedPayload,
      hopPath: [this.nodeId]
    };

    this.storageQueue.set(packetId, packet);
    this.seenPacketIds.add(packetId);
    this._log(`[ENQUEUE] Local packet ${packetId} stored for recipient ${recipientId} (TTL: ${ttlHops})`);
    return packet;
  }

  /**
   * Process incoming gossip bundle from a connected peer node
   */
  processGossipBundle(peerNodeId, packetBundle) {
    let accepted = 0;
    let delivered = 0;

    for (const pkt of packetBundle) {
      if (this.seenPacketIds.has(pkt.id)) continue;

      this.seenPacketIds.add(pkt.id);

      // Decrement hop counter
      const hopsLeft = pkt.hopsRemaining - 1;

      if (pkt.recipient === this.nodeId) {
        delivered++;
        this._log(`[DELIVERED] Direct destination reached! Packet ${pkt.id} received from ${peerNodeId}`);
      } else if (hopsLeft > 0) {
        const forwardedPacket = {
          ...pkt,
          hopsRemaining: hopsLeft,
          hopPath: [...pkt.hopPath, this.nodeId]
        };

        this.storageQueue.set(pkt.id, forwardedPacket);
        accepted++;
        this._log(`[GOSSIP RELAY] Stored & forward queue update for ${pkt.id}. Path: ${forwardedPacket.hopPath.join(' -> ')}`);
      } else {
        this._log(`[TTL EXPIRED] Packet ${pkt.id} reached max hop limit (0). Dropped.`);
      }
    }

    this._evictOldestIfFull();
    return { accepted, delivered };
  }

  /**
   * Export all queue bundles for replication to an adjacent node
   */
  exportGossipBundle() {
    return Array.from(this.storageQueue.values());
  }

  _evictOldestIfFull() {
    if (this.storageQueue.size > this.maxQueueSize) {
      const oldestKey = this.storageQueue.keys().next().value;
      this.storageQueue.delete(oldestKey);
      this._log(`[EVICTION] Queue capacity reached. Purged oldest buffer item ${oldestKey}`);
    }
  }

  _log(entryStr) {
    const timestamp = new Date().toISOString().substr(11, 8);
    this.routingLog.unshift(`[${timestamp}] ${entryStr}`);
    if (this.routingLog.length > 40) this.routingLog.pop();
  }
}
