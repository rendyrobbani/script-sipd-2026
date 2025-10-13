import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PengeluaranSPM extends PenatausahaanAPI {

	async sipdSelectAll(page = 1) {
		return new Promise((resolve, reject) => {
			let params = {};
			params.page = Math.max(1, page);
			params = Object.entries(params).map(([key, value]) => [key, value].join("="));

			let pageMax = 0;
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/spm/index` + (params.length === 0 ? "" : ("?" + params.join("&")));
			fetch(URL, this.getRequest()).then(response => {
				pageMax = Math.ceil(Number(response.headers.get("x-pagination-total-count")) / 5);
				return response.json()
			}).then(JSON => {
				let data = JSON ?? [];
				resolve({pageMax, data});
			}).catch(error => reject(error));
		});
	}

	async sipdSelectById(idSPM) {
		return new Promise((resolve, reject) => {
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/spm/cetak/${idSPM}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON ?? {})).catch(error => reject(error));
		});
	}

	async espressoSelectID() {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/spm";
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdate(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/spm";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdateRincian(idSPM, body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/penatausahaan/pengeluaran/spm/${idSPM}`;
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
				console.log(`await penatausahaanPengeluaranSPM.update(${pageFrom}, ${pageInto}, ${delay});`);
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
				let idSPM = listID[i];
				let body = await this.sipdSelectById(idSPM)
				await this.espressoUpdateRincian(idSPM, body);

				await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranSPM.updateRincian(${i}, ${indexInto}, ${delay});`);
				break;
			}
		}
	}

}