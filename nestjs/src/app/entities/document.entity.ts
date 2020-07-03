/*****************************************************************************
 *  DOCUMENT TYPE FOR THE CLIENT SIDE
 *****************************************************************************/

export class Document {
	// Variables
	public author?: string;
	public corpus?: Corpus;
	public texts?: Text[];

	public createdAt?: Date;
	public updatedAt?: Date;

	// constructor
	constructor(author: string = "", corpus: Corpus = null, texts: Text[] = [], createdAt: Date = null, updatedAt: Date = null) {
		this.author = author;
		this.corpus = corpus;
		this.texts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// public async getEntity(): Promise<DocumentEntity> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			resolve(new CorpusEntity(0, this.title, this.url, this.contributors, this.texts, this.createdAt, this.updatedAt));
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async setEntity(document: DocumentEntity): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			this.author = await document.author.getUser();
	// 			this.corpus = await document.corpus.getCorpus();
	// 			this.texts = await

	// 			this.url = corpus.url;
	// 			this.contributors = corpus.contributors;
	// 			this.texts = corpus.texts;

	// 			this.createdAt = document.createdAt;
	// 			this.updatedAt = document.updatedAt;
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async getJSON(): Promise<any> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			resolve({
	// 				title: this.title,
	// 				url: this.url,
	// 				contributors: this.contributors,
	// 				texts: this.texts,
	// 				createdAt: this.createdAt,
	// 				updatedAt: this.updatedAt,
	// 			});
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async setJSON(json: any): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			if (json.hasOwnProperty('title')) this.title = json.title;
	// 			if (json.hasOwnProperty('url')) this.url = json.url;
	// 			if (json.hasOwnProperty('contributors')) this.contributors = json.contributors;
	// 			if (json.hasOwnProperty('texts')) this.texts = json.texts;
	// 			if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
	// 			if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public static async parseEntities(entities: CorpusEntity[]): Promise<Corpus[]> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			let promises = new Array(entities.length);
	// 			entities.forEach(async (entity, i) => {
	// 				promises[i] = entity.getCorpus().catch(err => {
	// 					throw err;
	// 				});
	// 			});
	// 			Promise.all(promises)
	// 				.then((values: Corpus[]) => {
	// 					resolve(values);
	// 				})
	// 				.catch(err => {
	// 					throw err;
	// 				});
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}

/*****************************************************************************
 *  DOCUMENT ENTITY FOR THE SERVER SIDE
 *****************************************************************************/
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, ManyToMany, JoinColumn, JoinTable, OneToMany } from 'typeorm';
import { CorpusEntity, Corpus } from './corpus.entity';
import { UserEntity, User } from './user.entity';
import { Text, TextEntity } from './text.entity';
import { ParagraphEntity } from './paragraph.entity';

@Entity('documents')
export class DocumentEntity {
	// Variables
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(
		type => CorpusEntity,
		corpus => corpus.documents,
	)
	@JoinColumn({ name: 'corpus' })
	public corpus: CorpusEntity;

	@ManyToOne(
		type => UserEntity,
		user => user.documents,
	)
	@JoinColumn({ name: 'author' })
	public author: UserEntity;

	@OneToMany(
		type => ParagraphEntity,
		paragraph => paragraph.document,
	)
	public paragraphs: ParagraphEntity[];

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	// Constructor
	constructor(id: number = 0, corpus: CorpusEntity = null, author: UserEntity = null, paragraphs: ParagraphEntity[] = null, createdAt: Date = new Date(), updatedAt: Date = new Date()) {
		this.id = id;
		this.corpus = corpus;
		this.author = author;
		this.paragraphs = paragraphs;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public async getDocument(): Promise<Document> {
		return new Promise(async (resolve, reject) => {
			try {
				let texts = new Array<Text>(this.paragraphs.length);
				for (let i = 0; i < texts.length; i++) {
					texts[i] = await this.paragraphs[i].text.getText();
				}
				resolve(new Document(await this.author.username, await this.corpus.getCorpus(), texts, this.createdAt, this.updatedAt));
			} catch (err) {
				reject(err);
			}
		});
	}

	/*
	public async get(): Promise<Corpus> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(new Corpus(this.title, this.url, this.contributors, this.texts, this.createdAt, this.updatedAt));
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setCorpus(corpus: Corpus): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.id = 0;
				this.title = corpus.title;
				this.url = corpus.url;
				this.contributors = corpus.contributors;
				this.texts = corpus.texts;
				this.createdAt = corpus.createdAt;
				this.updatedAt = corpus.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getJSON(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve({
					id: this.id,
					title: this.title,
					url: this.url,
					contributors: this.contributors,
					texts: this.texts,
					createdAt: this.createdAt,
					updatedAt: this.updatedAt,
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setJSON(json: any): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				if (json.hasOwnProperty('id')) this.id = json.id;
				if (json.hasOwnProperty('title')) this.title = json.title;
				if (json.hasOwnProperty('url')) this.url = json.url;
				if (json.hasOwnProperty('contributors')) this.contributors = json.contributors;
				if (json.hasOwnProperty('texts')) this.texts = json.texts;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
    }
    */
}
