import PenatausahaanAPI from "../../PenatausahaanAPI";

export class PenatausahaanV1PengeluaranRealisasi extends PenatausahaanAPI{

	async sipdSelectByBulan(bulan) {
		return new Promise((resolve, reject) => {
			let URL = `https://service.sipd.kemendagri.go.id/pengeluaran/strict/laporan/realisasi/cetak?tipe=bulan&skpd=0&bulan=${bulan}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve([]);
				resolve(JSON);
			}).catch(error => reject(error));
		});
	}

	async espressoUpdateByBulan(bulan, body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/penatausahaan/pengeluaran/realisasi/${bulan}`;
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async update(bulanFrom = 1, bulanInto = 0) {
		if (bulanInto == null || bulanInto === 0) bulanInto = 12;
		for (let i = Math.max(1, bulanFrom); i <= bulanInto; i++) {
			console.log("Bulan : " + i.toString().padStart(2, "0"));
			let dataSIPD = await this.sipdSelectByBulan(i);
			await this.espressoUpdateByBulan(i, dataSIPD);
		}
	}

	async downloadByBulan(bulan) {
		let data = await this.sipdSelectByBulan(bulan);
		let a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "text/json" }));
		a.download = `Penatausahaan Pengeluaran Realisasi Bulan ${bulan}.json`;
		a.click();
	}

}