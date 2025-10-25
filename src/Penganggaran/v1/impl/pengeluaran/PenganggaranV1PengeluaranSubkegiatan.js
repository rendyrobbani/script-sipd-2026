import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1PengeluaranSubkegiatan extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "penganggaran_pengeluaran_subkegiatan";
	}

	async sipdFindByIdUnit(idUnit = null, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			if (idUnit == null) reject(new Error("ID Unit cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/sub_bl/list_belanja_by_tahun_daerah_unit`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.is_prop = this.isProvinsi();
			opt.body.id_unit = idUnit;
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

	async sipdFindOperatorByIdPenganggaranSubkegiatan(idPenganggaranSubkegiatan = null, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			if (idPenganggaranSubkegiatan == null) reject(new Error("ID Subkegiatan cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/staf_sub_bl/list_operator_belanja`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_sub_bl = idPenganggaranSubkegiatan;
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

	async sipdLookOperatorByIdSkpdAndIdPenganggaranSubkegiatan(idSKPD, idPenganggaranSubkegiatan, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			try {
				let rows, users = {}, operators = [];

				rows = await dataMasterUser.findByIdSKPD(idSKPD);
				rows.forEach(row => users[row.id_user] = row)

				rows = await this.findOperatorByIdPenganggaranSubkegiatan(idPenganggaranSubkegiatan, isAnggaran);
				rows.forEach(row => operators.push(users[row.id_staf]));

				resolve(operators);
			} catch (e) {
				reject(e);
			}
		});
	}

	async sipdUpdateKunciPenganggaranSubkegiatan(idUnit = null, idPenganggaranSubkegiatan = null, isKunci = true) {
		return await new Promise(async (resolve, reject) => {
			if (idUnit == null) reject(new Error("ID Unit cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/sub_bl/update_kunci_belanja_per_kegiatan`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_daerah_log = this.idDaerah();
			opt.body.id_user_log = this.idUser();
			opt.body.id_unit = idUnit;
			opt.body.id_sub_bl = idPenganggaranSubkegiatan;
			opt.body.kunci_bl = isKunci;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve({});
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdUpdateKunciPenganggaranSubkegiatanRincian(idUnit = null, idPenganggaranSubkegiatan = null, isKunci = true) {
		return await new Promise(async (resolve, reject) => {
			if (idUnit == null) reject(new Error("ID Unit cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/sub_bl/update_kunci_rincian_belanja_per_kegiatan`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_daerah_log = this.idDaerah();
			opt.body.id_user_log = this.idUser();
			opt.body.id_unit = idUnit;
			opt.body.id_sub_bl = idPenganggaranSubkegiatan;
			opt.body.kunci_bl_rinci = isKunci ? 1 : 0;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve({});
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdFindAll(isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			try {
				let step = 0, done = 0, data = [];

				let listSKPD = await penganggaranMasterPerangkatDaerah.sipdFindAll();
				for (let i = 0; i < listSKPD.length; i++) {
					let skpd = listSKPD[i];
					if (skpd.is_skpd) {
						step++;
						this.sipdFindByIdUnit(skpd.id_skpd, isAnggaran).then(JSON => {
							for (let j = 0; j < JSON.length; j++) data.push(JSON[j]);
							done++;
						}).catch(() => {
							done++;
						});
					}
				}

				let wait = setInterval(() => {
					if (step === done) {
						clearInterval(wait);
						resolve(data);
					}
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	async espressoFindAll() {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/subkegiatan`;
			let opt = this.espressoOptionsGet();
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/subkegiatan`;
			let opt = this.espressoOptionsPost(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAll(isAnggaran = 1) {
		console.log("Update : " + this._title);
		let JSON = await this.sipdFindAll(isAnggaran);
		await this.espressoSaveAll(JSON);
	}

	async sipdDownloadAll(isAnggaran = 1) {
		let data = await this.sipdFindAll(isAnggaran);
		this.downloadJSON(this._title + ".json", data);
	}

}