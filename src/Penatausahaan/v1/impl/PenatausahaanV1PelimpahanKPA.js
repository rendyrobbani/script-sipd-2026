import PenatausahaanAPI from "../PenatausahaanAPI";

export default class PenatausahaanV1PelimpahanKPA extends PenatausahaanAPI {

	async sipdSelectAll(idKegiatan = 0) {
		return new Promise((resolve, reject) => {
			let URL = `https://service.sipd.kemendagri.go.id/referensi/strict/pelimpahan?id_giat=${idKegiatan}`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve([]);
				resolve(JSON);
			}).catch(error => reject(error));
		});
	}

	async pelimpahan(idKPA) {
		return new Promise((resolve, reject) => {
			let body = {};
			body.id_pegawai_kpa = idKPA;
			body.kegiatan = [];
			body.sub_kegiatan = [];
			body.items = [];

			let params = [];
			params.push("id_unit=" + idSKPD);
			params.push("id_skpd=" + idSKPD);
			params.push("id_sub_skpd=" + idSubSKPD);
			params.push("id_urusan=" + idUrusan);
			params.push("id_bidang_urusan=" + idBidang);
			params.push("id_program=" + idProgram);
			params.push("id_giat=" + idKegiatan);
			params.push("id_sub_giat=" + idSubkegiatan);

			let URL = `https://service.sipd.kemendagri.go.id/referensi/strict/pelimpahan`;
			fetch(URL, this.getRequest()).then(response => response.json()).then(JSON => {
				if (JSON == null) resolve([]);
				resolve(JSON);
			}).catch(error => reject(error));
		});
	}

	async pelimpahanBySubkegiatan(idKegiatan, idSubkegiatan, idKPA) {
		return new Promise(async (resolve, reject) => {
			let listSubkegiatan = await this.sipdSelectAll(idKegiatan);
			let dataSubkegiatan = listSubkegiatan.filter(data => data["id_sub_giat"] === idSubkegiatan)[0] ?? null;
			if (dataSubkegiatan != null) {
				let subkegiatan = this.filterSubkegiatan(dataSubkegiatan, idKPA);
				let body = {};
				body.id_pegawai_kpa = idKPA;
				body.kegiatan = [];
				body.sub_kegiatan = [subkegiatan];
				body.items = [subkegiatan];

				let URL = `https://service.sipd.kemendagri.go.id/referensi/strict/pelimpahan`;
				fetch(URL, this.postRequest(body)).then(response => response.json()).then(JSON => {
					if (JSON == null) resolve([]);
					resolve(JSON);
				}).catch(error => reject(error));
			}
		});
	}

	filterSubkegiatan(data, idKPA) {
		return {
			id_unit: data.id_unit,
			id_sub_skpd: data.id_sub_skpd,
			id_urusan: data.id_urusan,
			id_bid_urusan: data.id_bid_urusan,
			id_program: data.id_program,
			id_giat: data.id_giat,
			id_sub_giat: data.id_sub_giat,
			id_pegawai_kpa: idKPA,
		};
	}

}