import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1MasterKelurahan extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "data_master_kelurahan";
	}

	async sipdFindAll() {
		return await new Promise(async resolve => {
			let step = 0, done = 0, data = [];

			let idKecamatans = this._espresso.idKecamatans();
			for (let i = 0 ; i < idKecamatans.length ; i++) {
				step++;
				let idKecamatan = idKecamatans[i];
				let url = `https://sipd-ri.kemendagri.go.id/api/master/kelurahan/list_by_kecamatan_and_tahun`;

				let opt = {};
				opt.method = "POST";
				opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
				opt.body = {};
				opt.body.tahun = this.tahun();
				opt.body.id_camat = idKecamatan;
				opt.body = this.requestBody(opt.body);

				fetch(url, opt).then(res => res.json()).then(res => {
					if (res != null && res.data != null) for (let j = 0 ; j < res.data.length ; j++) data.push(res.data[j]);
					done++;
				}).catch(e => {
					console.log(e);
					done++;
				});
			}

			let wait = setInterval(() => {
				if (step === done) {
					clearInterval(wait);
					resolve(data);
				}
			});
		});
	}

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/master/kelurahan`;
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