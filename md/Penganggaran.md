# SIPD | Penganggaran

- URL :

```
https://sipd-ri.kemendagri.go.id
```

## Setup

1. Jalankan script berikut di console `SIPD`

```javascript
(() => {
	let print = [];
	print.push("for (const key of Object.keys(localStorage)) delete localStorage[key];");
	for (const [key, value] of Object.entries(localStorage)) {
		if (!key.startsWith("token_key")) print.push(`localStorage.setItem(\`${key}\`, \`${value}\`);`);
	}
	console.log(print.join(""));
})();
```

2. Copy hasil log tersebut ke console `Espresso` dan tekan `Enter`
3. Copy response header `x-api-key` terbaru dari `SIPD` ke clipboard dan paste ketika menjalankan command untuk pertama kali 

## Data Master

- Data yang diupdate :
	- Master Provinsi
	- Master Kabupaten
	- Master Kecamatan
	- Master Kelurahan
	- Master Urusan
	- Master Bidang
	- Master Program
	- Master Kegiatan
	- Master Subkegiatan
	- Master Rekening
	- Master Sumber Dana
	- Master Kelompok Standar Harga
	- Master Label Pusat
	- Master Label Provinsi
	- Master Label Kabupaten
	- Master Label Kegiatan
	- Master Satuan
	- Master Profil Penerima Bantuan
	- Master Standar Harga dan Kode Rekeningnya


- Command :

```javascript
await updateDataMaster();
```

- Ala Carte :
```javascript
await penganggaranMasterProvinsi.updateAll();
await penganggaranMasterKabupaten.updateAll();
await penganggaranMasterKecamatan.updateAll();
await penganggaranMasterKelurahan.updateAll();
await penganggaranMasterUrusan.updateAll();
await penganggaranMasterBidang.updateAll();
await penganggaranMasterProgram.updateAll();
await penganggaranMasterKegiatan.updateAll();
await penganggaranMasterSubkegiatan.updateAll();
await penganggaranMasterPerangkatDaerah.updateAll();
await penganggaranMasterSumber.updateAll();
await penganggaranMasterRekening.updateAll();
await penganggaranMasterKelompok.updateAll();
await penganggaranMasterLabelPusat.updateAll();
await penganggaranMasterLabelProvinsi.updateAll();
await penganggaranMasterLabelKabupaten.updateAll();
await penganggaranMasterLabelKegiatan.updateAll();
await penganggaranMasterSatuan.updateAll();
await penganggaranMasterProfil.updateAll();
await penganggaranMasterStandarHarga.updateAll();
await penganggaranMasterStandarHarga.updateAllRekening();
```

## Data Penganggaran 1

- Data yang diupdate :
	- Data Subkegiatan
	- Data Paket Pekerjaan/Pengelompokkan Belanja
	- Data Keterangan Belanja
	- Data Rincian Belanja


- Parameters :
	- isAnggaran : `number` (`0` or `1`)


- Command :

```javascript
await updateDataPenganggaran1(isAnggaran);
```

- Command Example :

```javascript
await updateDataPenganggaran1(1);
```

- Ala Carte :

```javascript
await penganggaranPenerimaanPendapatanRincian.updateAll(isAnggaran);
await penganggaranPenerimaanPembiayaanRincian.updateAll(isAnggaran);
await penganggaranPengeluaranPembiayaanRincian.updateAll(isAnggaran);
await penganggaranPengeluaranSubkegiatan.updateAll(isAnggaran);
await penganggaranPengeluaranUraian.updateAll(isAnggaran);
await penganggaranPengeluaranKeterangan.updateAll(isAnggaran);
await penganggaranPengeluaranBelanja.updateAll(isAnggaran);
```

- Ala Carte Example :

```javascript
await penganggaranPenerimaanPendapatanRincian.updateAll(1);
await penganggaranPenerimaanPembiayaanRincian.updateAll(1);
await penganggaranPengeluaranPembiayaanRincian.updateAll(1);
await penganggaranPengeluaranSubkegiatan.updateAll(1);
await penganggaranPengeluaranUraian.updateAll(1);
await penganggaranPengeluaranKeterangan.updateAll(1);
await penganggaranPengeluaranBelanja.updateAll(1);
```

## Data Penganggaran 2

- Data yang diupdate :
	- Data Rincian Subkegiatan
	- Data Subkegiatan Prioritas
	- Data Tagging Subkegiatan
	- Data Sumber Dana Subkegiatan
	- Data Lokasi Subkegiatan
	- Data Output Subkegiatan
	- Data Header untuk RKA
	- Data Penerima Bantuan Hibah, Bantuan Sosial, dll


- Parameters :
	- isAnggaran : `number` (`0` or `1`)


- Command :

```javascript
await updateDataPenganggaran2(isAnggaran);
```

- Command Example :

```javascript
await updateDataPenganggaran2(1);
```

- Ala Carte :

```javascript
await penganggaranPengeluaranSubkegiatanRincian.updateAll(isAnggaran);
await penganggaranPengeluaranSubkegiatanPrioritas.updateAll(isAnggaran);
await penganggaranPengeluaranSubkegiatanTag.updateAll(isAnggaran);
await penganggaranPengeluaranSubkegiatanSumber.updateAll(isAnggaran);
await penganggaranPengeluaranSubkegiatanLokasi.updateAll(isAnggaran);
await penganggaranPengeluaranSubkegiatanOutput.updateAll(isAnggaran);
await penganggaranPengeluaranSubkegiatanRKA.updateAll(isAnggaran);
await penganggaranPengeluaranBelanja.updateAllPenerima(isAnggaran);
```

- Ala Carte Example :

```javascript
await penganggaranPengeluaranSubkegiatanRincian.updateAll(1);
await penganggaranPengeluaranSubkegiatanPrioritas.updateAll(1);
await penganggaranPengeluaranSubkegiatanTag.updateAll(1);
await penganggaranPengeluaranSubkegiatanSumber.updateAll(1);
await penganggaranPengeluaranSubkegiatanLokasi.updateAll(1);
await penganggaranPengeluaranSubkegiatanOutput.updateAll(1);
await penganggaranPengeluaranSubkegiatanRKA.updateAll(1);
await penganggaranPengeluaranBelanja.updateAllPenerima(1);
```