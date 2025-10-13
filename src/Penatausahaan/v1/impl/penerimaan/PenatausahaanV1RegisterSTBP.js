import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1RegisterSTBP extends PenatausahaanAPI {

	async sipdSelectByBulan(bulan) {
		return new Promise((resolve, reject) => {
			let tanggalFrom = new Date(`2026-${bulan.toString().padStart(2, "0")}-01`);
			let tanggalInto = new Date(`2026-${(bulan + 1).toString().padStart(2, "0")}-01`);
			tanggalInto.setDate(0);

			let body = {};
			body.jenis_dokumen = "stbp";
			body.jenis_register = "all";
			body.tanggal_awal = tanggalFrom.toISOString().substring(0, 10);
			body.tanggal_akhir = tanggalInto.toISOString().substring(0, 10);

			let URL = `https://service.sipd.kemendagri.go.id/penerimaan/strict/laporan/register/stbp/cetak`;
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve([]);
				resolve(JSON.detail ?? []);
			}).catch(error => reject(error));
		});
	}

	async espressoUpdateByBulan(body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/penatausahaan/penerimaan/register/stbp`;
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async update(bulanFrom = 1, bulanInto = 0) {
		if (bulanInto == null || bulanInto === 0) bulanInto = 12;
		for (let i = Math.max(1, bulanFrom) ; i <= bulanInto ; i++) {
			console.log("Bulan : " + i.toString().padStart(2, "0"));
			let dataSIPD = await this.sipdSelectByBulan(i);
			await this.espressoUpdateByBulan(dataSIPD);
		}
	}

	async downloadByBulan(bulan) {
		let data = await this.sipdSelectByBulan(bulan);
		let a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type: "text/json"}));
		a.download = `Penatausahaan Penerimaan Register STBP Bulan ${bulan}.json`;
		a.click();
	}

}