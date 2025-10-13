import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PenerimaanSTBPPembiayaan extends PenatausahaanAPI {

	async sipdSelectAll(idSKPD = 0, page = 1) {
		return new Promise((resolve, reject) => {
			let params = {};
			params.page = Math.max(1, page);
			params.limit = 5;
			params.skpd = idSKPD;
			params.jenis = "ALL";
			params = Object.entries(params).map(([key, value]) => [key, value].join("="));

			let pageMax = 0;
			let URL = `https://service.sipd.kemendagri.go.id/penerimaan/strict/stbp-pembiayaan` + (params.length === 0 ? "" : ("?" + params.join("&")));
			fetch(URL, this.getRequest()).then(response => {
				pageMax = Math.ceil(Number(response.headers.get("x-pagination-total-count")) / 5);
				return response.json()
			}).then(JSON => {
				let data = JSON ?? [];
				resolve({pageMax, data});
			}).catch(error => reject(error));
		});
	}

	async sipdSelectById(idSTBP) {
		return new Promise((resolve, reject) => {
			let URL = `https://service.sipd.kemendagri.go.id/penerimaan/strict/stbp-pembiayaan/cetak/${idSTBP}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON ?? {})).catch(error => reject(error));
		});
	}

	async espressoSelectID() {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/penerimaan/stbp/pembiayaan";
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdate(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/penerimaan/stbp/pembiayaan";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdateRincian(idSTBP, body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/penatausahaan/penerimaan/stbp/pembiayaan/${idSTBP}`;
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async update(indexSKPD = 0, pageFrom = 1, delay = 0) {
		let listSKPD = await window.penganggaranMasterPerangkatDaerah.espressoSelectAll(0);
		for (let i = indexSKPD ; i < listSKPD.length ; i++) {
			if (i !== indexSKPD) pageFrom = 1;
			while (true) {
				try {
					console.log(`indexSKPD : ${i} | page : ${pageFrom}`);

					let JSON = await this.sipdSelectAll(listSKPD[i].id, pageFrom);
					await this.espressoUpdate(JSON.data);

					if (pageFrom >= (JSON.pageMax ?? 0)) break;

					await this.wait(delay);
					pageFrom++;
				} catch (e) {
					console.log(`await penatausahaanPenerimaanSTBPPembiayaan.update(${indexSKPD}, ${pageFrom}, ${delay});`);
					break;
				}
			}

		}
	}

	async updateRincian(indexFrom = 0, indexInto = 0, delay = 0) {
		let listID = await this.espressoSelectID();
		if (indexInto == null || indexInto === 0) indexInto = listID.length;
		for (let i = indexFrom ; i < Math.min(indexInto, listID.length) ; i++) {
			console.log("index : " + i);

			try {
				let idSTBP = listID[i].idSTBP;
				let body = await this.sipdSelectById(idSTBP)
				await this.espressoUpdateRincian(idSTBP, body);

				await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPenerimaanSTBPPembiayaan.updateRincian(${indexFrom}, ${indexInto}, ${delay});`);
				break;
			}
		}
	}

}