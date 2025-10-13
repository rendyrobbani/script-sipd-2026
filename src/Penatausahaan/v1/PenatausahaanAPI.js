export default class PenatausahaanAPI {

	#TOKEN_NAME = "X-SIPD-PU-TK";

	base64Encode(text) {
		const utf8 = new TextEncoder().encode(text);
		return btoa(String.fromCharCode(...utf8));
	}

	base64Decode(text) {
		const binary = atob(text);
		const utf8 = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
		return new TextDecoder().decode(utf8);
	}

	token() {
		return document.cookie.split("; ").filter(token => token.startsWith(this.#TOKEN_NAME + "="))[0].split("=")[1];
	}

	payload() {
		return JSON.parse(this.base64Decode(this.token().split(".")[1]));
	}

	iss() {
		return this.payload()["iss"] ?? null;
	}

	sub() {
		return this.payload()["sub"] ?? null;
	}

	exp() {
		return this.payload()["exp"] ?? null;
	}

	iat() {
		return this.payload()["iat"] ?? null;
	}

	tahun() {
		return this.payload()["tahun"] ?? null;
	}

	idUser() {
		return this.payload()["id_user"] ?? null;
	}

	idDaerah() {
		return this.payload()["id_daerah"] ?? null;
	}

	kodeProvinsi() {
		return this.payload()["kode_provinsi"] ?? null;
	}

	kodeDDN() {
		return this.payload()["kode_ddn"] ?? null;
	}

	idSKPD() {
		return this.payload()["id_skpd"] ?? null;
	}

	idRole() {
		return this.payload()["id_role"] ?? null;
	}

	idPegawai() {
		return this.payload()["id_pegawai"] ?? null;
	}

	subDomainDaerah() {
		return this.payload()["sub_domain_daerah"] ?? null;
	}

	async wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	espressoHost() {
		return "http://localhost:8080";
	}

	headerRequest(method = "Get", body = null) {
		let headers = {};
		headers["Authorization"] = "Bearer " + this.token();
		headers["Accept"] = "application/json";
		if (["Post", "Put"].includes(method) && body != null) headers["Content-Type"] = "application/json";

		let request = {headers, method};
		if (body != null) request.body = JSON.stringify(body);

		return request;
	}

	getRequest() {
		return this.headerRequest("Get");
	}

	postRequest(body) {
		return this.headerRequest("Post", body);
	}

	putRequest(body) {
		return this.headerRequest("Put", body);
	}

}