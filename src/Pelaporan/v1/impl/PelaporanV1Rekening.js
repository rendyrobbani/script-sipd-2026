import PelaporanAPI from "../PelaporanAPI";

export class PelaporanV1Rekening extends PelaporanAPI {

	async sipdSelectAll(level = 1, page = 1) {
		return new Promise((resolve, reject) => {
			level = Math.min(6, Math.max(1, level));
			let URL = `https://service.sipd.kemendagri.go.id/aklap/api/common/account/list-rekening?level_rekening=${Math.min(6, Math.max(1, level))}&keyword=&filter_code=&page=${page}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve(null);
				if (JSON.data == null) resolve(null);
				resolve(JSON.data);
			}).catch(error => reject(error));
		});
	}

	async sipdSelectByKode(level = 1, kode = "#", page = 1) {
		return new Promise((resolve, reject) => {
			level = Math.min(6, Math.max(1, level));
			let URL = `https://service.sipd.kemendagri.go.id/aklap/api/common/account/list-rekening?level_rekening=${Math.min(6, Math.max(1, level))}&keyword=${kode}&filter_code=&page=${page}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve(null);
				if (JSON.data == null) resolve(null);
				resolve(JSON.data);
			}).catch(error => reject(error));
		});
	}

	async espressoUpdateAll(level, body) {
		return new Promise((resolve, reject) => {
			let URL = this.espressoHost() + `/sipd/v1/pelaporan/rekening/${level}`;
			fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => resolve(JSON)).catch(error => reject(error));
		});
	}

	async update(level = 1, pageFrom = 1, pageInto = 0, delay = 0) {
		while (true) {
			try {
				console.log(`level | page : ${level}|${pageFrom}|${pageInto}`);

				let JSON = await this.sipdSelectAll(level, pageFrom);
				if (pageInto == null || pageInto <= 0) pageInto = JSON.last_page

				await this.espressoUpdateAll(level, JSON.data ?? []);

				pageFrom++;
				if (pageFrom > pageInto) break;

				if (delay > 0) await this.wait(delay);
			} catch (e) {
				console.log(`await pelaporanRekening.update(${level}, ${pageFrom}, ${pageInto}, ${delay});`);
				break;
			}
		}
	}

	async updateByKode(level = 1, kode = "#") {
		let JSON = await this.sipdSelectByKode(level, kode);
		await this.espressoUpdateAll(level, JSON.data ?? []);
	}

}