import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1PengeluaranSubkegiatanPrioritas extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "penganggaran_pengeluaran_subkegiatan_prioritas";
	}

	async sipdFindByIdPenganggaranSubkegiatan(idPenganggaranSubkegiatan = null, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			if (idPenganggaranSubkegiatan == null) reject(new Error("ID Penganggaran Subkegiatan cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/label_bl/get_by_id_sub_bl`;

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

	async sipdFindByListIdPenganggaranSubkegiatan(listIdPenganggaranSubkegiatan = [], isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			try {
				let step = 0, done = 0, data = [];

				for (let i = 0; i < listIdPenganggaranSubkegiatan.length; i++) {
					let id = listIdPenganggaranSubkegiatan[i];

					step++;
					this.sipdFindByIdPenganggaranSubkegiatan(id, isAnggaran).then(JSON => {
						for (let j = 0; j < JSON.length; j++) data.push(JSON[j]);
						done++;
					}).catch(() => {
						done++;
					});
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

	async sipdFindAll(isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			try {
				let tempID = [];
				let listID = [];

				let listSubkegiatan = await window.penganggaranPengeluaranSubkegiatan.espressoFindAll();
				for (let j = 0; j < listSubkegiatan.length; j++) {
					tempID.push(listSubkegiatan[j].id);
					if (tempID.length === 100) {
						listID.push(tempID);
						tempID = [];
					}
				}
				if (tempID.length > 0) listID.push(tempID);

				let data = [];
				for (let i = 0; i < listID.length; i++) {
					let JSON = await this.sipdFindByListIdPenganggaranSubkegiatan(listID[i], isAnggaran);
					for (let j = 0; j < JSON.length; j++) data.push(JSON[j]);
				}

				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/subkegiatan_prioritas`;
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