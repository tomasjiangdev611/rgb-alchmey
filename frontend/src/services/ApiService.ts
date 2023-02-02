import axios, { AxiosInstance } from 'axios';
import { RGBAlchemy } from '../models';

class AlchemyService {
	private instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			withCredentials: false,
			baseURL: 'http://localhost:9876/',
			headers: {
				'Content-Type': 'application/json',
			}
		})
	}

	async getAlchemyInitialData(): Promise<RGBAlchemy> {
		return new Promise((resolve, reject) => {
			this.instance.get(`init`).then((response) => {
				return resolve(response.data)
			}).catch((error) => {
				reject(error)
			})
		})
	}

	async getAlchemyDataByUserId(userId: string): Promise<RGBAlchemy> {
		return new Promise((resolve, reject) => {
			this.instance.get(`init/user/${userId}`).then((response) => {
				return resolve(response.data)
			}).catch((error) => {
				reject(error)
			})
		})
	}
}

export default AlchemyService

