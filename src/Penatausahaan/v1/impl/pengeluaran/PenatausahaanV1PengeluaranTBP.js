import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PengeluaranTBP extends PenatausahaanAPI{

	async sipdSelectAll(page = 1) {
		return new Promise((resolve, reject) => {
			let params = {};
			params.page = Math.max(1, page);
			params.limit = 5;
			params.keterangan = "";
			params.nomor = "";
			params.skpd = 0;
			params.status = "aktif";
			params.tanggal_mulai = "";
			params.tanggal_akhir = "";
			params.nilai_awal = "0";
			params.nilai_akhir = "10000000000";
			params.lb_skpd = "Tampilkan Semua";
			params.sub_skpd = 0;
			params.lb_sub_skp = "Tampilkan Semua";
			params = Object.entries(params).map(([key, value]) => [key, value].join("="));

			let pageMax = 0;
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/tbp/index` + (params.length === 0 ? "" : ("?" + params.join("&")));
			fetch(URL, this.getRequest()).then(response => {
				pageMax = Math.ceil(Number(response.headers.get("x-pagination-total-count")) / 5);
				return response.json()
			}).then(JSON => {
				let data = JSON ?? [];
				resolve({pageMax, data});
			}).catch(error => reject(error));
		});
	}

	async sipdSelectByNomor(page = 1, nomor = "#") {
		return new Promise((resolve, reject) => {
			let params = {};
			params.page = Math.max(1, page);
			params.limit = 5;
			params.keterangan = "";
			params.nomor = nomor;
			params.skpd = 0;
			params.tanggal_mulai = "";
			params.tanggal_akhir = "";
			params.nilai_awal = "0";
			params.nilai_akhir = "10000000000";
			params.lb_skpd = "Tampilkan Semua";
			params.sub_skpd = 0;
			params.lb_sub_skp = "Tampilkan Semua";
			params = Object.entries(params).map(([key, value]) => [key, value].join("="));

			let pageMax = 0;
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/tbp/index` + (params.length === 0 ? "" : ("?" + params.join("&")));
			fetch(URL, this.getRequest()).then(response => {
				pageMax = Math.ceil(Number(response.headers.get("x-pagination-total-count")) / 5);
				return response.json()
			}).then(JSON => {
				let data = JSON ?? [];
				resolve({pageMax, data});
			}).catch(error => reject(error));
		});
	}

	async sipdSelectById(idTBP) {
		return new Promise((resolve, reject) => {
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/tbp/cetak/${idTBP}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON ?? {})).catch(error => reject(error));
		});
	}

	async espressoSelectID() {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/tbp";
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdate(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/tbp";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdateRincian(idTBP, body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/penatausahaan/pengeluaran/tbp/${idTBP}`;
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async update(pageFrom = 1, pageInto = 0, delay = 0) {
		while (true) {
			try {
				pageFrom = Math.max(1, pageFrom);
				console.log("page : " + pageFrom);

				let JSON = await this.sipdSelectAll(pageFrom);
				await this.espressoUpdate(JSON.data);

				if (pageInto === 0) pageInto = (JSON.pageMax ?? 0);
				if (pageFrom >= pageInto) break;

				await this.wait(delay);
				pageFrom++;
			} catch (e) {
				console.log(`await penatausahaanPengeluaranTBP.update(${pageFrom}, ${pageInto}, ${delay});`);
				break;
			}
		}
	}

	async updateRincian(indexFrom = 0, indexInto = 0, delay = 0) {
		let listID = await this.espressoSelectID();
		if (indexInto == null || indexInto === 0) indexInto = listID.length;
		for (let i = indexFrom; i < Math.min(indexInto, listID.length); i++) {
			console.log("index : " + i);

			try {
				let idTBP = listID[i];
				let body = await this.sipdSelectById(idTBP)
				await this.espressoUpdateRincian(idTBP, body);

				await this.wait(delay);
			} catch (e) {
				break;
			}
		}
	}

	async updateByNomor(nomor = "#") {
		let JSON = await this.sipdSelectByNomor(1, nomor)
		await this.espressoUpdate(JSON.data);
	}

	async updateByListNomor(listNomor = []) {
		for (let i = 0; i < listNomor.length; i++) {
			let nomor = listNomor[i];
			try {
				console.log("Nomor : " + nomor);
				await this.updateByNomor(nomor);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranTBP.updateByListNomor("${listNomor.slice(i)}".split(","));`);
				break;
			}
		}
	}

}