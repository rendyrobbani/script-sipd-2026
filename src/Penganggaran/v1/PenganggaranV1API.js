import {Espresso} from "../../Espresso";

export class PenganggaranV1API {

	constructor() {
		this._espresso = new Espresso();
	}

	setToken() {
		let apiKey = JSON.parse(atob(atob(prompt("X-API-Key").trim())));
		window.localStorage.setItem("token_key_1", apiKey["token_key_1"]);
		window.localStorage.setItem("token_key_2", apiKey["token_key_2"]);
	}

	tokenKey1() {
		let token = window.localStorage.getItem("token_key_1");
		if (token == null) this.setToken();
		return window.localStorage.getItem("token_key_1");
	}

	tokenKey2() {
		let token = window.localStorage.getItem("token_key_2");
		if (token == null) this.setToken();
		return window.localStorage.getItem("token_key_2");
	}

	localAuthName() {
		let value = null;
		let keys = Object.keys(localStorage);
		for (let i = 0 ; i < keys.length ; i++) {
			const key = keys[i];
			if (key.startsWith(`v0.0.0-auth`)) {
				value = key;
				break;
			}
		}
		return value;
	}

	session() {
		return JSON.parse(localStorage.getItem(this.localAuthName())) || "kosong";
	}

	idDaerah() {
		return this.session()["daerah_id"];
	}

	idUnit(nullable = true) {
		if (nullable) return this.session()["unit_id"];
		return this.session()["unit_id"] == null ? 0 : this.session()["unit_id"];
	}

	idUser() {
		return this.session()["user_id"];
	}

	idLevel() {
		return this.session()["level_id"];
	}

	idProvinsi() {
		return this.session()["id_prop"];
	}

	isProvinsi() {
		return this.session()["is_prop"];
	}

	isKabupatenKota() {
		return this.isProvinsi() === 1 ? 0 : 1;
	}

	accessToken() {
		return this.session()["token"];
	}

	tahun() {
		const N = localStorage.getItem("sipd-konfigurasi");
		if (N) return JSON.parse(N).tahun;
		const G = localStorage.getItem("sipd-konfigurasi-tahun");
		return G ? JSON.parse(G) : void 0
	}

	makeid(z) {
		let P = "";
		const N = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", G = N.length;
		let O = 0;
		for (; O < z ;) P += N.charAt(Math.floor(Math.random() * G)), O += 1;
		return P
	}

	makeNUMBER(z) {
		return Math.floor(Math.random() * z)
	}

	apiKey() {
		return btoa(btoa(JSON.stringify({
			token: this.makeid(15),
			id_daerah: this.idDaerah(),
			tahun: this.tahun(),
			id_app: this.makeNUMBER(1e5),
			is_app: 1,
			secret_key: btoa(btoa(JSON.stringify({
				sidx: btoa(btoa(this.idUser())),
				sidl: btoa(btoa(this.idLevel())),
				sidd: btoa(btoa(this.idDaerah())),
				idd: btoa(btoa(this.idDaerah()))
			}))),
			security_key: this.idDaerah() + "|" + this.tahun() + "|" + btoa((Math.round((new Date).getTime() / 1e3) + 30).toString()) + "|" + this.makeid(10) + "|" + this.makeNUMBER(1e5),
			token_key_1: this.tokenKey1(),
			token_key_2: this.tokenKey2(),
		})));
	}

	dekrip(t) {
		let e = atob(t), n = e.length - 1, s = "";
		for (; n >= 0 ;) s += e.charAt(n), n--;
		let o = atob(s), l = o.length - 1, _ = "";
		for (; l >= 0 ;) _ += o.charAt(l), l--;
		return JSON.parse(_)
	}

	requestHeader(method = "GET", accessToken = null, apiKey = null) {
		const header = {};
		header["Accept"] = "application/json";
		if (method === "POST") header["Content-Type"] = "multipart/form-data; boundary=----WebKitFormBoundary";
		if (accessToken != null) header["X-Access-Token"] = accessToken;
		if (apiKey != null) header["X-API-Key"] = apiKey;
		return header;
	}

	requestBody(request = {}) {
		const body = [];
		for (const [key, value] of Object.entries(request)) {
			body.push("------WebKitFormBoundary");
			body.push("Content-Disposition: form-data; name=\"" + key + "\"");
			body.push("");
			body.push(value);
		}
		body.push("------WebKitFormBoundary--");
		body.push("");
		return body.join("\r\n");
	}

	maxRow() {
		return 100;
	}

	padLen() {
		return 10;
	}

	timeout() {
		return 100;
	}

	splitJSON(json) {
		let data = [];
		let temp = [];
		for (let i = 0 ; i < json.length ; i++) {
			temp.push(json[i]);
			if (temp.length === this.maxRow()) {
				data.push(temp);
				temp = [];
			}
		}
		if (temp.length > 0) data.push(temp);
		return data;
	}

	downloadJSON(fileName = "fileName.json", data = []) {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type: "text"}));
		a.download = fileName;
		a.click();
	}

	async runDownloadArgs(download_args = [], title = null) {
		return await new Promise(async (resolve, reject) => {
			try {
				if (title != null) console.log("Memulai " + title);
				for (let i = 0 ; i < download_args.length ; i++) {
					const arg = download_args[i];
					await arg();
				}
				if (title != null) console.log("Selesai " + title);
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	}

	espressoHost() {
		return this._espresso.host(this.tahun());
	}

	espressoOptions(method, body) {
		let opt = {};

		opt.headers = {};
		opt.headers["Accept"] = "application/json";
		opt.headers["Content-Type"] = "application/json";

		opt.method = method;

		if (body != null) opt.body = JSON.stringify(body);

		return opt;
	}

	espressoOptionsGet() {
		return this.espressoOptions("Get");
	}

	espressoOptionsPost(body) {
		return this.espressoOptions("Post", body);
	}

	espressoOptionsPut(body) {
		return this.espressoOptions("Put", body);
	}

}