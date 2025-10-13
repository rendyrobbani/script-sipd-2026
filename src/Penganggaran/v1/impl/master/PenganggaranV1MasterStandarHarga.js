import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1MasterStandarHarga extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "data_master_standar_harga";
		this._tipe_ssh = "SSH";
		this._tipe_hspk = "HSPK";
		this._tipe_asb = "ASB";
		this._tipe_sbu = "SBU";
	}

	async sipdFindByTipe(tipe) {
		return await new Promise(async (resolve, reject) => {
			let kelompok = null;
			if (tipe != null && tipe === this._tipe_ssh) kelompok = 1;
			if (tipe != null && tipe === this._tipe_hspk) kelompok = 2;
			if (tipe != null && tipe === this._tipe_asb) kelompok = 3;
			if (tipe != null && tipe === this._tipe_sbu) kelompok = 4;
			if (kelompok == null) reject(new Error("Tipe Standar Harga tidak ditemukan"));

			let url = `https://sipd-ri.kemendagri.go.id/api/master/d_komponen/listAll`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.deleted_data = true;
			opt.body.start = 0;
			opt.body.length = 1000000;
			opt.body.tipe = tipe;
			opt.body.kelompok = kelompok;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null && res.data.data != null) resolve(res.data.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdFindAll() {
		return await new Promise(async (resolve, reject) => {
			try {
				let data = [];

				let step = 0;
				let done = 0;

				[this._tipe_ssh, this._tipe_hspk, this._tipe_asb, this._tipe_sbu,].forEach(tipe => {
					step++;
					this.sipdFindByTipe(tipe).then(rows => {
						rows.forEach(row => data.push(row));
						done++;
					}).catch(error => reject(error));
				});

				let wait = setInterval(() => {
					if (step === done) {
						clearInterval(wait);
						resolve(data);
					}
				}, this.timeout());
			} catch (e) {
				reject(e);
			}
		});
	}

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/master/standar_harga`;
			let opt = this.espressoOptionsPost(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAll() {
		console.log("Update : " + this._title);
		let JSON = await this.sipdFindAll();
		await this.espressoSaveAll(JSON);
	}

	async sipdFindRekeningByTipe(tipe) {
		return await new Promise(async (resolve, reject) => {
			let kelompok = null;
			if (tipe != null && tipe === this._tipe_ssh) kelompok = 1;
			if (tipe != null && tipe === this._tipe_hspk) kelompok = 2;
			if (tipe != null && tipe === this._tipe_asb) kelompok = 3;
			if (tipe != null && tipe === this._tipe_sbu) kelompok = 4;
			if (kelompok == null) reject(new Error("Tipe Standar Harga tidak ditemukan"));

			let url = `https://sipd-ri.kemendagri.go.id/api/master/d_komponen/export_excel`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.start = 0;
			opt.body.length = 1000000;
			opt.body.tipe = tipe;
			opt.body.kelompok = kelompok;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async espressoSaveRekeningByTipe(tipe, body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/master/standar_harga/${tipe.toLowerCase()}`;
			let opt = this.espressoOptionsPut(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAllRekening() {
		console.log("Update Rekening : " + this._title);

		return await new Promise(async (resolve, reject) => {
			try {
				let step = 0;
				let done = 0;

				[this._tipe_ssh, this._tipe_hspk, this._tipe_asb, this._tipe_sbu].forEach(tipe => {
					step++;
					this.sipdFindRekeningByTipe(tipe).then(JSON => {
						this.espressoSaveRekeningByTipe(tipe, JSON).finally(() => done++);
					}).catch(error => {
						reject(error)
					});
				});

				let wait = setInterval(() => {
					if (step === done) {
						clearInterval(wait);
						resolve();
					}
				}, this.timeout());
			} catch (e) {
				reject(e);
			}
		});
	}

}