import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PengeluaranSTS extends PenatausahaanAPI{

	async sipdSelectAll(page = 1) {
		return new Promise((resolve, reject) => {
			let params = {};
			params.page = page;
			params.limit = 10;
			params.keterangan = "";
			params.nomor = "";
			params.tab = "sudah_pengesahan";
			params.status = "sudah_pengesahan";
			params.type = "ALL";
			params.tanggal_mulai = "";
			params.tanggal_akhir = "";
			params.nilai_awal = 0;
			params.nilai_akhir = 10000000000;
			params.skpd = 0;
			params.lb_skpd = "Tampilkan Semua";
			params.sub_skpd = 0;
			params.lb_sub_skpd = "Tampilkan Semua";
			params = Object.entries(params).map(([key, value]) => [key, value].join("="));

			let pageMax = 0;
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/sts/index` + (params.length === 0 ? "" : ("?" + params.join("&")));
			fetch(URL, this.getRequest()).then(response => {
				pageMax = Math.ceil(Number(response.headers.get("x-pagination-total-count")) / 10);
				return response.json()
			}).then(JSON => {
				let data = JSON ?? [];
				resolve({pageMax, data});
			}).catch(error => reject(error));
		});
	}

	async sipdSelectByNomor(page = 1, nomorSTS = "") {
		return new Promise((resolve, reject) => {
			let params = {};
			params.page = page;
			params.limit = 10;
			params.keterangan = "";
			params.nomor = nomorSTS;
			params.type = "ALL";
			params.tanggal_mulai = "";
			params.tanggal_akhir = "";
			params.nilai_awal = 0;
			params.nilai_akhir = 10000000000;
			params.skpd = 0;
			params.lb_skpd = "Tampilkan Semua";
			params.sub_skpd = 0;
			params.lb_sub_skpd = "Tampilkan Semua";
			params = Object.entries(params).map(([key, value]) => [key, value].join("="));

			let pageMax = 0;
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/sts/index` + (params.length === 0 ? "" : ("?" + params.join("&")));
			fetch(URL, this.getRequest()).then(response => {
				pageMax = Math.ceil(Number(response.headers.get("x-pagination-total-count")) / 10);
				return response.json()
			}).then(JSON => {
				let data = JSON ?? [];
				resolve({pageMax, data});
			}).catch(error => reject(error));
		});
	}

	async sipdSelectById(jenis, idSTS) {
		return new Promise((resolve, reject) => {
			let URL = null;
			switch (jenis.toUpperCase()) {
				case "UP" :
					URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/sts/cetak/up/${idSTS}/0`;
					break;
				case "GU" :
					URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/sts/cetak/gu/${idSTS}/0`;
					break;
				case "TU" :
					URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/sts/cetak/tu/${idSTS}`;
					break;
				case "LS" :
					URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/pkb/cetak/${idSTS}`;
					break;
			}
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON ?? {})).catch(error => reject(error));
		});
	}

	async espressoSelectID() {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/sts";
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdate(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/sts";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdateRincian(idSTS, body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/penatausahaan/pengeluaran/sts/${idSTS}`;
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
				console.log(`await penatausahaanPengeluaranSTS.update(${pageFrom}, ${pageInto}, ${delay});`);
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
				let idSTS = listID[i].idSTS;
				let jenis = listID[i].jenis;
				let body = await this.sipdSelectById(jenis, idSTS)
				await this.espressoUpdateRincian(idSTS, body);

				await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranSTS.updateRincian(${i}, ${indexInto}, ${delay});`);
				break;
			}
		}
	}

	async updateByNomor(nomor = "#") {
		console.log("Nomor : " + nomor);
		let JSON = await this.sipdSelectByNomor(1, nomor)
		await this.espressoUpdate(JSON.data);
	}

	async updateByListNomor(listNomor = []) {
		for (let i = 0; i < listNomor.length; i++) {
			let nomor = listNomor[i];
			try {
				await this.updateByNomor(nomor);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranSTS.updateByListNomor("${listNomor.slice(i)}".split(","));`);
				break;
			}
		}
	}

	async updateRincianByListID(listID = [], index = 0, delay = 0) {
		for (let i = index; i < listID.length; i++) {
			console.log("index : " + i);

			try {
				let idSTS = listID[i].idSTS;
				let jenis = listID[i].jenis;
				let body = await this.sipdSelectById(jenis, idSTS)
				await this.espressoUpdateRincian(idSTS, body);

				await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranSTS.updateRincianByListID(${JSON.stringify(listID.slice(i))}, 0, ${delay});`);
				break;
			}
		}
	}

}