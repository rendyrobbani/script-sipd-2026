import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1PenerimaanPendapatanRincian extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "penganggaran_penerimaan_pendapatan_rincian";
	}

	async sipdFindByIdUnit(idUnit) {
		return await new Promise(async (resolve, reject) => {
			if (idUnit == null) reject(new Error("ID Unit cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/pendapatan/listByIdUnit`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_unit = idUnit;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdFindAll() {
		return await new Promise(async (resolve, reject) => {
			try {
				let step = 0, done = 0, data = [];

				let units = await window.penganggaranMasterPerangkatDaerah.espressoSelectAll(1);
				for (let i = 0; i < units.length; i++) {
					let idUnit = units[i].id;

					step++;
					this.sipdFindByIdUnit(idUnit).then(JSON => {
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

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/penerimaan/pendapatan`;
			let opt = this.espressoOptionsPost(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAll() {
		console.log("Update : " + this._title);
		let JSON = await this.sipdFindAll();
		await this.espressoSaveAll(JSON);
	}

	async sipdInsert(idUnit, idRekening, kodeRekening, namaRekening, uraian, keterangan, total) {
		return await new Promise(async (resolve, reject) => {
			if (idUnit == null) reject(new Error("ID Unit cannot be null"));
			if (idRekening == null) reject(new Error("ID Rekening cannot be null"));
			if (kodeRekening == null) reject(new Error("Kode Rekening cannot be null"));
			if (namaRekening == null) reject(new Error("Nama Rekening cannot be null"));
			if (uraian == null) reject(new Error("Uraian cannot be null"));
			if (keterangan == null) reject(new Error("Keterangan cannot be null"));
			if (total == null) reject(new Error("Total cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/pendapatan/add`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_daerah_log = this.idDaerah();
			opt.body.id_user_log = this.idUser();
			opt.body.created_user = this.idUser();
			opt.body.id_unit = idUnit;
			opt.body.id_akun = idRekening;
			opt.body.kode_akun = kodeRekening;
			opt.body.nama_akun = namaRekening;
			opt.body.uraian = uraian;
			opt.body.keterangan = keterangan;
			opt.body.total = total;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => resolve(res)).catch(res => reject(res));
		});
	}

}