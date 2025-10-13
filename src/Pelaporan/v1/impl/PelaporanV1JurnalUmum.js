import PelaporanAPI from "../PelaporanAPI";

export class PelaporanV1JurnalUmum extends PelaporanAPI {

	async sipdSelectAll(page = 1, idSubSKPD = 0) {
		return new Promise((resolve, reject) => {
			let params = {};
			params.skpd = idSubSKPD;
			params.filter = 1;
			params.keyword = "";
			params.start_date = `${this.tahun()}-01-01`;
			params.end_date = `${this.tahun()}-12-31`;
			params.transaksi = 1;
			params.per_page = 10;
			params.page = page;
			params = Object.entries(params).map(([key, value]) => [key, value].join("=")).join("&");

			let URL = `https://service.sipd.kemendagri.go.id/aklap/api/buku-jurnal/list?${params}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve(null);
				if (JSON.data == null) resolve(null);
				resolve(JSON.data);
			}).catch(error => reject(error));
		});
	}

	async sipdSelectByNomor(nomor = "#", page = 1, idSubSKPD = 0) {
		return new Promise((resolve, reject) => {
			let params = {};
			params.skpd = idSubSKPD;
			params.filter = 1;
			params.keyword = nomor;
			params.start_date = `${this.tahun()}-01-01`;
			params.end_date = `${this.tahun()}-12-31`;
			params.transaksi = 1;
			params.per_page = 10;
			params.page = page;
			params = Object.entries(params).map(([key, value]) => [key, value].join("=")).join("&");

			let URL = `https://service.sipd.kemendagri.go.id/aklap/api/buku-jurnal/list?${params}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve(null);
				if (JSON.data == null) resolve(null);
				resolve(JSON.data);
			}).catch(error => reject(error));
		});
	}

	async espressoUpdate(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/pelaporan/jurnal/umum";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async update(pageFrom = 1, pageInto = 0, delay = 0) {
		while (true) {
			try {
				pageFrom = Math.max(1, pageFrom);
				console.log("page : " + pageFrom);

				let JSON = await this.sipdSelectAll(pageFrom);
				await this.espressoUpdate(JSON.list);

				if (pageInto === 0) pageInto = (JSON.pagination.max_page ?? 0);
				if (pageFrom >= pageInto) break;

				if (delay > 0) await this.wait(delay);
				pageFrom++;
			} catch (e) {
				console.log(`await pelaporanJurnalUmum.update(${pageFrom}, ${pageInto}, ${delay});`);
				break;
			}
		}
	}

	async updateByNomor(nomor = "#") {
		console.log(nomor);
		let JSON = await this.sipdSelectByNomor(nomor);
		await this.espressoUpdate(JSON.list);
	}

	async updateByListNomor(listNomor = [], delay = 0) {
		for (let i = 0; i < listNomor.length; i++) {
			let nomor = listNomor[i];
			try {
				await this.updateByNomor(nomor);
				if (delay > 0) await this.wait(delay);
			} catch (e) {
				console.log(`await pelaporanJurnalUmum.updateByListNomor(${JSON.stringify(listNomor.slice(i))}, ${delay});`);
				break;
			}
		}
	}

}