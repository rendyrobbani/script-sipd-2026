import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PengeluaranBelanja extends PenatausahaanAPI {

	async sipdSelectAll(idSKPD, idSubSKPD, idUrusan, idBidang, idProgram, idKegiatan, idSubkegiatan) {
		return new Promise((resolve, reject) => {
			let params = [];
			params.push("id_unit=" + idSKPD);
			params.push("id_skpd=" + idSKPD);
			params.push("id_sub_skpd=" + idSubSKPD);
			params.push("id_urusan=" + idUrusan);
			params.push("id_bidang_urusan=" + idBidang);
			params.push("id_program=" + idProgram);
			params.push("id_giat=" + idKegiatan);
			params.push("id_sub_giat=" + idSubkegiatan);

			let URL = `https://service.sipd.kemendagri.go.id/referensi/strict/dpa/penarikan/belanja/sub-giat?` + params.join("&");
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve([]);
				resolve(JSON);
			}).catch(error => reject(error));
		});
	}

	async espressoSelectAll() {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/belanja";
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async espressoUpdateAll(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + "/sipd/v1/penatausahaan/pengeluaran/belanja";
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async update(indexFrom = 0, indexInto = 0, delay = 0) {
		let listDataEspresso = await this.espressoSelectAll();
		let padlen = listDataEspresso.length.toString().length;
		if (indexInto == null || indexInto === 0) indexInto = listDataEspresso.length;
		for (let i = indexFrom; i < Math.min(indexInto, listDataEspresso.length); i++) {
			console.log(`index : ${i.toString().padStart(padlen, "0")} | ${indexInto.toString().padStart(padlen, "0")}`);
			try {
				let dataEspresso = listDataEspresso[i];
				let dataSIPD = await this.sipdSelectAll(dataEspresso.idSKPD, dataEspresso.idSubSKPD, dataEspresso.idUrusan, dataEspresso.idBidang, dataEspresso.idProgram, dataEspresso.idKegiatan, dataEspresso.idSubkegiatan);
				await this.espressoUpdateAll(dataSIPD);
				if (delay > 0 && i + 1 < listDataEspresso.length) await this.wait(delay);
			} catch (e) {
				console.log(`await penatausahaanPengeluaranBelanja.update(${i}, ${indexInto}, ${delay});`)
				break;
			}
		}
	}

}