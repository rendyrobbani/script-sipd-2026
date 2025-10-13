import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PenerimaanPendapatan extends PenatausahaanAPI {

	async sipdSelectAll(idSubSKPD) {
		return new Promise((resolve, reject) => {
			let URL = `https://service.sipd.kemendagri.go.id/referensi/strict/dpa/penerimaan/pendapatan/${idSubSKPD}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve([]);
				if (JSON.items == null) resolve([]);
				resolve(JSON.items);
			}).catch(error => reject(error));
		});
	}

	async espressoSelectAll() {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/penerimaan/pendapatan";
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdateAll(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/penerimaan/pendapatan";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}



	async update(indexFrom = 0, indexInto = 0, delay = 0) {
		let listDataEspresso = await this.espressoSelectAll();
		let padlen = listDataEspresso.length.toString().length;
		if (indexInto == null || indexInto === 0) indexInto = listDataEspresso.length;
		for (let i = indexFrom; i < Math.min(indexInto, listDataEspresso.length); i++) {
			console.log(`index : ${i.toString().padStart(padlen, "0")} | ${indexInto.toString().padStart(padlen, "0")}`);
			try {
				let dataEspresso = listDataEspresso[i];
				let dataSIPD = await this.sipdSelectAll(dataEspresso.idSubSKPD);
				await this.espressoUpdateAll(dataSIPD);
				if (delay > 0 && i + 1 < listDataEspresso.length) await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPenerimaanPendapatan.update(${i}, ${indexInto}, ${delay});`)
				break;
			}
		}
	}

}