import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1PengeluaranBelanja extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "penganggaran_pengeluaran_belanja_rincian";
	}

	async sipdFindAll(isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/renja/rinci_sub_bl/list`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
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

	async sipdFindByIdSubkegiatan(idUnit, idSubkegiatan, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/renja/rinci_sub_bl/get_by_id_sub_bl`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_unit = idUnit;
			opt.body.id_sub_bl = idSubkegiatan;
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
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/belanja`;
			let opt = this.espressoOptionsPost(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoFindAll() {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/belanja`;
			let opt = this.espressoOptionsGet();
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAll(isAnggaran = 1) {
		console.log("Update : " + this._title);
		let JSON = await this.sipdFindAll(isAnggaran);
		await this.espressoSaveAll(JSON);
	}

	async sipdFindPenerimaByIdBelanja(idBelanja = null) {
		return await new Promise(async (resolve, reject) => {
			if (idBelanja == null) reject(new Error("ID Belanja cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/penerima_bantuan/view_by_id_rinci_sub_bl/${idBelanja}`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdFindPenerimaByListIdBelanja(listIdBelanja = []) {
		return await new Promise(async (resolve, reject) => {
			try {
				let step = 0,
				    done = 0,
				    data = [];

				for (let i = 0; i < listIdBelanja.length; i++) {
					let id = listIdBelanja[i];

					step++;
					this.sipdFindPenerimaByIdBelanja(id).then(JSON => {
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

	async sipdFindAllPenerima() {
		return await new Promise(async (resolve, reject) => {
			try {
				let tempID = [];
				let listID = [];

				let listBelanja = await this.espressoFindAll();
				for (let j = 0; j < listBelanja.length; j++) {
					tempID.push(listBelanja[j].id);
					if (tempID.length === 100) {
						listID.push(tempID);
						tempID = [];
					}
				}
				if (tempID.length > 0) listID.push(tempID);

				let data = [];
				for (let i = 0; i < listID.length; i++) {
					let JSON = await this.sipdFindPenerimaByListIdBelanja(listID[i]);
					for (let j = 0; j < JSON.length; j++) data.push(JSON[j]);
				}

				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	async espressoSaveAllPenerima(body) {
		return await new Promise(async (resolve, reject) => {
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/belanja`;
			let opt = this.espressoOptionsPut(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAllPenerima() {
		console.log("Update : " + this._title + "_penerima");
		let JSON = await this.sipdFindAllPenerima();
		await this.espressoSaveAllPenerima(JSON);
	}

	async sipdFindOne(idSubkegiatan, idBelanja, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			let url = `https://sipd-ri.kemendagri.go.id/api/renja/rinci_sub_bl/view/${idBelanja}`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_sub_bl = idSubkegiatan;
			opt.body.is_anggaran = isAnggaran;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data[0]);
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdUpdateSumberDanaByIdBelanja(idSubkegiatan, idBelanja, idSumberDana = null, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			let from = await this.sipdFindOne(idSubkegiatan, idBelanja, isAnggaran);

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/rinci_sub_bl/update`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.id_subs_sub_bl = from.id_subs_sub_bl || 0;
			opt.body.id_ket_sub_bl = from.id_ket_sub_bl || 0;
			opt.body.id_akun = from.id_akun || 0;
			opt.body.id_standar_harga = from.id_standar_harga || 0;
			opt.body.id_standar_nfs = from.id_standar_nfs || 0;
			opt.body.pajak = from.pajak || 0;
			opt.body.volume = from.volume || 0;
			opt.body.harga_satuan = from.harga_satuan || 0;
			opt.body.koefisien = from.koefisien || null;
			opt.body.total_harga = from.total_harga || 0;
			opt.body.jenis_bl = from.jenis_bl || null;
			opt.body.id_dana = idSumberDana || from.id_dana || null;
			opt.body.vol_1 = from.vol_1 || 0;
			opt.body.sat_1 = from.sat_1 || null;
			opt.body.vol_2 = from.vol_2 || 0;
			opt.body.sat_2 = from.sat_2 || null;
			opt.body.vol_3 = from.vol_3 || 0;
			opt.body.sat_3 = from.sat_3 || null;
			opt.body.vol_4 = from.vol_4 || 0;
			opt.body.sat_4 = from.sat_4 || null;
			opt.body.rkpd_murni = from.rkpd_murni || 0;
			opt.body.rkpd_pak = from.rkpd_pak || 0;
			opt.body.kode_akun = from.kode_akun || null;
			opt.body.nama_akun = from.nama_akun || null;
			opt.body.nama_standar_harga = from.nama_standar_harga || null;
			opt.body.kode_standar_harga = from.kode_standar_harga || null;
			opt.body.otsus = from.otsus || 0;
			opt.body.id_daerah_log = this.idDaerah();
			opt.body.id_user_log = this.idUser();
			opt.body.updated_user = this.idUser();
			opt.body.id_rinci_sub_bl = from.id_rinci_sub_bl || 0;
			opt.body.id_unik = from.id_unik || 0;
			opt.body.tahun = from.tahun || null;
			opt.body.id_daerah = from.id_daerah || 0;
			opt.body.id_unit = from.id_unit || 0;
			opt.body.id_bl = from.id_bl || 0;
			opt.body.id_sub_bl = from.id_sub_bl || 0;
			opt.body.id_standar_nfs = from.id_standar_nfs || 0;
			opt.body.id_jadwal_murni = from.id_jadwal_murni || 0;
			opt.body.is_lokus_akun = from.is_lokus_akun || 0;
			opt.body.lokus_akun_teks = from.lokus_akun_teks || null;
			opt.body.id_blt = from.id_blt || 0;
			opt.body.id_usulan = from.id_usulan || 0;
			opt.body.id_jenis_usul = from.id_jenis_usul || 0;
			opt.body.id_skpd = from.id_skpd || 0;
			opt.body.id_sub_skpd = from.id_sub_skpd || 0;
			opt.body.id_program = from.id_program || 0;
			opt.body.id_giat = from.id_giat || 0;
			opt.body.id_sub_giat = from.id_sub_giat || 0;
			opt.body.set_sisa_kontrak = from.set_sisa_kontrak || 0;
			opt.body.nama_daerah = from.nama_daerah || null;
			opt.body.nama_unit = from.nama_unit || null;
			opt.body.nama_standar_nfs = from.nama_standar_nfs || null;
			opt.body.nama_jadwal_murni = from.nama_jadwal_murni || null;
			opt.body.nama_blt = from.nama_blt || null;
			opt.body.nama_usulan = from.nama_usulan || null;
			opt.body.nama_jenis_usul = from.nama_jenis_usul || null;
			opt.body.nama_skpd = from.nama_skpd || null;
			opt.body.nama_sub_skpd = from.nama_sub_skpd || null;
			opt.body.nama_program = from.nama_program || null;
			opt.body.nama_giat = from.nama_giat || null;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => resolve(res)).catch(res => reject(res));
		});
	}

	async sipdUpdateSumberDanaByIdSubkegiatan(idUnit, idSubkegiatan, idSumberDana = null, isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			try {
				let listBelanja = await this.sipdFindByIdSubkegiatan(idUnit, idSubkegiatan, isAnggaran);
				for (let i = 0; i < listBelanja.length; i++) {
					let dataBelanja = listBelanja[i];
					await this.sipdUpdateSumberDanaByIdBelanja(idSubkegiatan, dataBelanja["id_rinci_sub_bl"] || 0, idSumberDana, isAnggaran);
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	async sipdDeleteById(id = null) {
		return await new Promise(async (resolve, reject) => {
			if (id == null) reject(new Error("ID Belanja cannot be null"));

			let url = `https://sipd-ri.kemendagri.go.id/api/renja/rinci_sub_bl/hapus_rincian`;

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.id_daerah_log = this.idDaerah();
			opt.body.id_user_log = this.idUser();
			opt.body.aktivitas = "delete";
			opt.body.kunci_bl_rinci = 3;
			opt.body.id_rinci_sub_bl = id;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => resolve(res.data)).catch(res => reject(res));
		});
	}

	async sipdDownloadAll(isAnggaran = 1) {
		let data = await this.sipdFindAll(isAnggaran);
		this.downloadJSON("penganggaran_pengeluaran_belanja.json", data);
	}
}