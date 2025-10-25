import {PenganggaranV1API} from "../../PenganggaranV1API";

export class PenganggaranV1PengeluaranSubkegiatanRKA extends PenganggaranV1API {

	constructor() {
		super();
		this._title = "penganggaran_pengeluaran_subkegiatan_rka";
	}

	async sipdFindCurrentJadwal(isAnggaran = 1) {
		return await new Promise(async (resolve, reject) => {
			let url = "https://sipd-ri.kemendagri.go.id/api/jadwal/anggaran_jadwal/cek_aktif";

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.is_anggaran = isAnggaran;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) resolve(res.data[0] ?? {});
				resolve([]);
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdFindBySubkegiatan(subkegiatan = null, jadwal = null) {
		return await new Promise(async (resolve, reject) => {
			if (subkegiatan == null) reject(new Error("subkegiatan cannot be null"));
			if (jadwal == null) reject(new Error("jadwal cannot be null"));

			let isMurni = [1, 2, 40, 5, 27, 28].includes(jadwal.id_tahap ?? 0);
			let isPergeseran = [7, 30].includes(jadwal.id_tahap ?? 0);
			let isPerubahan = [3, 4, 41, 8, 25, 29, 31, 32].includes(jadwal.id_tahap ?? 0);

			let url;
			if (isMurni) url = `https://sipd-ri.kemendagri.go.id/api/renja/renja_laporan/listDataLampiranRKA`;
			else if (isPergeseran || isPerubahan) url = `https://sipd-ri.kemendagri.go.id/api/renja/renja_laporan/listDataLampiranRKAPergeseran`;
			else throw new Error("isMurni, isPergeseran, isPerubahan must have one true value");

			let opt = {};
			opt.method = "POST";
			opt.headers = this.requestHeader(opt.method, this.accessToken(), this.apiKey());
			opt.body = {};
			opt.body.tahun = this.tahun();
			opt.body.id_daerah = this.idDaerah();
			opt.body.is_prop = this.isProvinsi();
			opt.body.id_tahap = jadwal.id_tahap ?? 0;
			opt.body.id_sub_giat = subkegiatan.idSubkegiatan ?? 0;
			opt.body.id_sub_bl = subkegiatan.id ?? 0;
			opt.body.id_sub_rkpd = 0;
			opt.body.is_locked = 1;
			opt.body = this.requestBody(opt.body);

			fetch(url, opt).then(res => res.json()).then(res => {
				if (res != null && res.data != null) {
					if (isMurni) resolve(this.mappingJSON(subkegiatan.id, res.data));
					else if (isPergeseran) resolve(this.mappingJSONPerubahan(subkegiatan.id, res.data));
					else if (isPerubahan) resolve(this.mappingJSONPerubahan(subkegiatan.id, res.data));
					else throw new Error("isMurni, isPergeseran, isPerubahan must have one true value");
				}
				resolve({});
			}).catch(res => {
				reject(res);
			});
		});
	}

	async sipdFindByListSubkegiatan(listSubkegiatan = [], jadwal = null) {
		return await new Promise(async (resolve, reject) => {
			try {
				let step = 0, done = 0, data = [];

				for (let i = 0; i < listSubkegiatan.length; i++) {
					let subkegiatan = listSubkegiatan[i];

					step++;
					this.sipdFindBySubkegiatan(subkegiatan, jadwal).then(JSON => {
						data.push(JSON);
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
				let jadwal = await this.sipdFindCurrentJadwal(isAnggaran);
				let temp = [];
				let list = [];

				let listSubkegiatan = await window.penganggaranPengeluaranSubkegiatan.espressoFindAll();
				for (let j = 0; j < listSubkegiatan.length; j++) {
					temp.push(listSubkegiatan[j]);
					if (temp.length === 100) {
						list.push(temp);
						temp = [];
					}
				}
				if (temp.length > 0) list.push(temp);

				let data = [];
				for (let i = 0; i < list.length; i++) {
					let JSON = await this.sipdFindByListSubkegiatan(list[i], jadwal);
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
			let url = `${this.espressoHost()}/sipd/v1/penganggaran/pengeluaran/subkegiatan_rka`;
			let opt = this.espressoOptionsPost(body);
			fetch(url, opt).then(res => res.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async updateAll(isAnggaran = 1) {
		console.log("Update : " + this._title);
		let JSON = await this.sipdFindAll(isAnggaran);
		await this.espressoSaveAll(JSON);
	}

	async mappingJSON(id, fromJSON = {}) {
		let intoJSON = JSON.parse(JSON.stringify(fromJSON));
		intoJSON["id_sub_bl"] = id;
		return intoJSON;
	}

	async mappingJSONPerubahan(id, fromJSON = []) {
		let intoJSON = {};
		intoJSON["id_sub_bl"] = id;
		fromJSON.forEach(JSON => {
			let key, val;
			switch (JSON.urut) {
				case 8 :
					key = "spm_teks";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 9 :
					key = "layanan_teks";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 12 :
					val = JSON["colom_2"] ?? null;
					val = val == null ? [] : val.split(" s.d ");

					key = "waktu_mulai";
					intoJSON[key] = val[0] == null ? null : val[0].trim();
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();

					key = "waktu_akhir";
					intoJSON[key] = val[1] == null ? null : val[1].trim();
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 13 :
					key = "sasaran";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 11 :
					key = "lokasi_bl";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 14 :
					key = "pagu_n_lalu";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null || !intoJSON[key].match("[0-9]") ? null : intoJSON[key];
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 15 :
					key = "pagu";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null || !intoJSON[key].match("[0-9]") ? null : intoJSON[key];
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();

					key = "total";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null || !intoJSON[key].match("[0-9]") ? null : intoJSON[key];
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 16 :
					key = "pagu_n_depan";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null || !intoJSON[key].match("[0-9]") ? null : intoJSON[key];
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 19 :
					key = "pagu_indikatif";
					intoJSON[key] = JSON["colom_6"] ?? null;
					intoJSON[key] = intoJSON[key] == null || !intoJSON[key].match("[0-9]") ? null : intoJSON[key];
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 18 :
					key = "tolak_ukur_capaian";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();

					key = "target_kinerja_capaian";
					intoJSON[key] = JSON["colom_6"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 20 :
					key = "tolak_ukur_keluaran";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();

					key = "target_kinerja_keluaran";
					intoJSON[key] = JSON["colom_6"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
				case 21 :
					key = "tolak_ukur_hasil";
					intoJSON[key] = JSON["colom_2"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();

					key = "target_kinerja_hasil";
					intoJSON[key] = JSON["colom_6"] ?? null;
					intoJSON[key] = intoJSON[key] == null ? null : intoJSON[key].trim().startsWith(": ") ? intoJSON[key].substring(2).trim() : intoJSON[key].trim();
					intoJSON[key] = intoJSON[key] == null || intoJSON[key].trim() === "-" || intoJSON[key].trim().length === 0 ? null : intoJSON[key].trim();
					break;
			}
		});
		return intoJSON;
	}

}