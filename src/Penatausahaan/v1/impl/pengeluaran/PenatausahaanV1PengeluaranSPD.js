import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PengeluaranSPD extends PenatausahaanAPI{

	async sipdSelectByIdSKPD(idSKPD) {
		return new Promise((resolve, reject) => {
			let tabs = [
				"belum_otorisasi",
				"sudah_otorisasi",
				"arsip_akpd",
				"arsip_pergeseran",
			];

			let data = [];

			try {
				let step = 0;
				let done = 0;

				tabs.forEach(tab => {
					step++;
					let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/spd/pembuatan/list-spd/${idSKPD}?tab=${tab}`;
					fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
						if (JSON != null) for (let i = 0; i < JSON.length; i++) data.push(JSON[i]);
						done++;
					}).catch(error => reject(error));
				});

				let intv = setInterval(() => {
					if (step === done) {
						clearInterval(intv);
						resolve(data);
					}
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	async sipdSelectByIdSKPDAndIdSPD(idSKPD, idSPD) {
		return new Promise((resolve, reject) => {
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/spd/pembuatan/laporan-spd/${idSKPD}/${idSPD}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve([]);
				resolve(JSON);
			}).catch(error => reject(error));
		});
	}

	async espressoSelectID() {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/spd";
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdate(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/spd";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdateRincian(idSPD, body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/penatausahaan/pengeluaran/spd/${idSPD}`;
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async update(index = 0, delay = 0) {
		let listSKPD = await window.penganggaranMasterPerangkatDaerah.espressoSelectAll(0);
		for (let i = index; i < listSKPD.length; i++) {
			console.log("index : " + i);

			try {
				let idSKPD = listSKPD[i].id;
				let JSON = await this.sipdSelectByIdSKPD(idSKPD);
				await this.espressoUpdate(JSON);

				await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranSPD.update(${i}, 0);`);
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
				let idSKPD = listID[i].idSKPD;
				let idSPD = listID[i].idSPD;
				let body = await this.sipdSelectByIdSKPDAndIdSPD(idSKPD, idSPD)
				await this.espressoUpdateRincian(idSPD, body);

				await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranSPD.updateRincian(${i}, ${indexInto}, ${delay});`);
				break;
			}
		}
	}

	async updateRincianByListID(listJSON = [], delay = 0) {
		for (let i = 0; i < listJSON.length; i++) {
			console.log("index : " + i);

			try {
				let idSKPD = listJSON[i].idSKPD;
				let idSPD = listJSON[i].idSPD;
				let body = await this.sipdSelectByIdSKPDAndIdSPD(idSKPD, idSPD)
				await this.espressoUpdateRincian(idSPD, body);

				await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranSPD.updateRincianByListID(${JSON.stringify(listJSON.slice(i))}, ${delay});`);
				break;
			}
		}
	}

}