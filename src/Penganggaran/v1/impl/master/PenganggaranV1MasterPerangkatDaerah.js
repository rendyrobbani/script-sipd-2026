import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1MasterPerangkatDaerah extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "data_master_perangkat_daerah";
	}

	async sipdFindAll() {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/master/skpd/listNew`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
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

	async sipdFindById(id) {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/master/skpd/view/${id}/${this.tahun()}/${this.idDaerah()}`;

			let opt = {};
			opt.method = "GET";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data[0]);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdUpdateKepalaSKPD(id, nama, nip, pangkat, status) {
		return await new Promise(async (resolve, reject) => {
			let unit = await this.findById(id);
			let url = `https://sipd-ri.kemendagri.go.id/api/master/skpd/update_skpd`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.kode_bidang_urusan_1 = unit.id_bidang_urusan_1;
			opt.body.kode_bidang_urusan_2 = unit.id_bidang_urusan_2;
			opt.body.kode_bidang_urusan_3 = unit.id_bidang_urusan_3;
			opt.body.kode_skpd = unit.kode_opd;
			opt.body.nama_skpd = unit.nama_skpd;
			opt.body.nip_kepala = nip;
			opt.body.nama_kepala = nama;
			opt.body.pangkat_kepala = pangkat;
			opt.body.status_kepala = status.replaceAll("Definitif", "PA").toUpperCase();
			opt.body.input_pendapatan = unit.is_pendapatan;
			opt.body.id_user_log = this.idUser();
			opt.body.id_daerah_log = this.idDaerah();
			opt.body.id_skpd = unit.id_skpd;
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.kode_skpd_old = unit.kode_skpd;
			opt.body.nip_kepala_old = unit.nip_kepala;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdUpdatePaguIndikatif(idUnit, pagu) {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/renja/setup_unit/update_pagu_indikatif`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.set_pagu_user = this.idUser();
			opt.body.id_unit = idUnit;
			opt.body.pagu_indikatif = pagu;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => resolve(res)).catch(res => reject(res));
		});
	}

	async sipdMutakhirkanAdminSKPD(id) {
		return await new Promise(async (resolve, reject) => {
			let unit = await this.findById(id);
			let url = `https://sipd-ri.kemendagri.go.id/api/master/skpd/update_admin_skpd`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.id_skpd = unit.id_skpd;
			opt.body.nip_kepala = unit.nip_kepala;
			opt.body.nama_kepala = unit.nama_kepala;
			opt.body.id_user_log = this.idUser();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_daerah_log = this.idDaerah();
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async espressoSelectAll(withSubSKPD = 1) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/master/perangkat_daerah/${withSubSKPD ? 1 : 0}`;
			let opt = this.espressoOptionsGet();
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoSaveAll(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/master/perangkat_daerah`;
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