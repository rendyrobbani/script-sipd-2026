import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1PengeluaranSubkegiatanRincian extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "penganggaran_pengeluaran_subkegiatan_rincian";
	}

	async sipdFindAll(isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/renja/sub_bl/list`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.is_prop = this.isProvinsi();
			opt.body.is_anggaran = isAnggaran;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/subkegiatan_rincian`;
			let opt = this.espressoOptionsPost(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAll(isAnggaran = 1) {
		console.log("Update : " + this._title);
		let JSON = await this.sipdFindAll(isAnggaran);
		await this.espressoSaveAll(JSON);
	}

}