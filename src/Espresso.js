export class Espresso {

	constructor() {
		this._host = "http://localhost:8080";
	}

	isLocalhost() {
		return this._host.includes("localhost");
	}

	host(tahun = 0) {
		return this.isLocalhost() ? this._host : (this._host + "/" + tahun.toString().padStart(4, "0"));
	}

	idKecamatans() {
		return [5378, 5379, 5380, 5381, 5382, 5383];
	}

}