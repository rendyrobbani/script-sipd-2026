import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1MasterLabelPusat extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "data_master_label_pusat";
	}

	async sipdFindAll() {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/master/label_pusat/list`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.deleted_data = true;
			opt.body.start = 0;
			opt.body.length = 1000000;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null && res.data.data != null) resolve(res.data.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/master/label/pusat`;
			let opt = this.espressoOptionsPost(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAll() {
		console.log("Update : " + this._title);
		let JSON = await this.sipdFindAll();
		await this.espressoSaveAll(JSON);
	}

}