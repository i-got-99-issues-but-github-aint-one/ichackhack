import Url from 'url';
import log from 'cuvva-log';
import {MongoClient, ObjectID} from 'mongodb';

export default class Storage {
	static async connect(url) {
		const db = await MongoClient.connect(url, {
			db: { w: 1 },
		});

		log.info('database_connected');

		return new Storage(db);
	}

	constructor(db) {
		this.db = db;

		this.createIndexes().catch(function (error) {
			log.error('index_creation_failed', [error]);
		});
	}

	async createIndexes() {
		await Promise.all([
		]);
	}
}

class Model {
	constructor(collection) {
		this.collection = collection;
	}

	async index(keys, options) {
		const specs = keys.map(k => {
			const spec = {};
			spec[k] = 1;
			return spec;
		});

		await Promise.all(specs.map(s => this.collection.createIndex(s, options)));
	}

	async create(object) {
		const result = await this.collection.insertOne(object);
		return result.ops[0];
	}

	async retrieve(id) {
		return await this.findOne({ _id: ObjectID(id) });
	}

	async update(id, update) {
		const query = { _id: ObjectID(id) };
		const options = { returnOriginal: false };
		const result = await this.collection.findOneAndUpdate(query, update, options);
		return result.value;
	}

	async delete(id) {
		await this.collection.deleteOne({ _id: ObjectID(id) });
	}

	async findOne(query) {
		const object = await this.collection.findOne(query);

		if (!object)
			throw log.info('not_found');

		return object;
	}

	async findMany(query) {
		return await this.collection.find(query).toArray();
	}

	async count(query) {
		return await this.collection.count(query);
	}
}
